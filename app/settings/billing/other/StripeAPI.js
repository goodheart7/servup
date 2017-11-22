"use strict";

var superagent = require('superagent');
var Buffer = require('buffer/').Buffer;

var stripe_url = 'https://api.stripe.com/v2/';
var public_key = 'pk_test_m7YwssBsq4vkVEMKez64ptuY';
var secret_key = '';

module.exports = function (stripe_url, public_key, secret_key){
    var module = {};

    module.createCardToken = function (cardNumber , expMonth ,expYear , cvc , callback, price ) {
        var bytes = new Buffer(public_key+':').toString('utf8');
        console.log(bytes);
        var encodedSecretKey = new Buffer(bytes).toString('base64');
        console.log("Encoded : " + encodedSecretKey);

        console.log("CardNumber : " + cardNumber);
        console.log("expMonth : " + expMonth);
        console.log("expYear : " + expYear);
        console.log("CVC : " + cvc);
         try {

                    superagent
                    .post(stripe_url+'tokens')
                    .set('Accept', '*/*')
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .set('Authorization', 'Basic '+encodedSecretKey)
                    .send('card'+'[number]='+cardNumber)
                    .send('card'+'[exp_month]='+expMonth)
                    .send('card'+'[exp_year]='+expYear)
                    .send('card'+'[cvc]='+cvc)
                    .end(function(err, res){

                                if (err) {
                                    if (!err.response) {
                                        res = {
                                            ok: false,
                                            body: { errors: { default: 'Server connection error' }}
                                        }
                                    } else {
                                        res = err.response;

                                    }
                                } else if(!res.ok){

                                     res = {
                                            ok: false,
                                            body: JSON.parse(res.text)
                                     }

                                }else{

                                    res = {
                                            ok: true,
                                            body: JSON.parse(res.text)
                                     }

                                }

                                console.log('response ',res.text);
                                callback && callback(res);

                      }
                     );

         } catch (e) {
            var error = {ok: false, unauthorized: false, exception: e};
            console.log('error ',error );
            callback && callback(error);
        }

    };

    module.createCustomerToken = function(token, description, email, callback) {
    	description = "Lorem IPsum";
    	email = 'test@onebyte.biz';
    	var bytes = new Buffer(secret_key+':').toString('utf8');
    	var encodedSecretKey = new Buffer(bytes).toString('base64');
    	try{
    		superagent
    		.post(stripe_url+'customers')
    		.set('Accept', '*/*')
    		.set('Content-Type', 'application/x-www-form-urlencoded')
    		.set('Authorization', 'Basic '+encodedSecretKey)
    		.send('source=' + token)
    		.send('description=' + description)
    		.send('email=' + email)
    		.end((err, res) => {
    			if (err) {
    				if (!err.response) {
    					res = {
    						ok: false,
    						body: { errors: { default: 'Server connection error' }}
    					}
    				} else {
    					res = err.response;
    				}
    			}else if(!res.ok){
    				res = {
    					ok: false,
    					body: JSON.parse(res.text)
    				}
    			}else{
    				res = {
    					ok: true,
    					body: JSON.parse(res.text)
    				}
    			}
    			callback && callback(res);
    		})
    	}
    	catch(e){
    		var error = {ok: false, unauthorized: false, exception: e};
    		console.log('error ',error );
    		callback && callback(error);
    	}
	  }

   	module.chargeCustomer = function (customerID, amount, currency, callback) {
   		amount = 20 * 100;
   		currency = 'usd';
		  var bytes = new Buffer(secret_key+':').toString('utf8');
      var encodedSecretKey = new Buffer(bytes).toString('base64');
  		try{
  			superagent
  				.post(stripe_url+'charges')
  				.set('Accept', '*/*')
  				.set('Content-Type', 'application/x-www-form-urlencoded')
  				.set('Authorization', 'Basic '+encodedSecretKey)
  				.send('amount=' + amount)
  				.send('currency=' + currency)
  				.send('customer=' + customerID)
  				.end((err, res) => {
  					if (err) {
  						if (!err.response) {
  							res = {
  								ok: false,
  								body: { errors: { default: 'Server connection error' }}
  							}
  						} else {
  							res = err.response;
  						}
  					}else if(!res.ok){
  						res = {
  							ok: false,
  							body: JSON.parse(res.text)
  						}
  					}else{
  						res = {
  							ok: true,
  							body: JSON.parse(res.text)
  						}
  					}
  					callback && callback(res);
  				})
  		}
  		catch(e){
  			var error = {ok: false, unauthorized: false, exception: e};
  			console.log('error ',error );
  			callback && callback(error);
  		}
    }
    return module;
}


// /**
//  * Created by Gabriel on 15-07-15.
//  **/

// "use strict";

// var superagent = require('superagent');
// var base64 = require('base-64');
// var utf8 = require('utf8');
// var config = require('./stripeConfig');

// var stripeApiRouter = {
//     createCardToken : function (cardNumber , expMonth ,expYear , cvc , callback ) {
//     // 	console.log(config.apiKey.public);

//     	var cardDetails = {
// 		    "card[number]": cardNumber,
// 		    "card[exp_month]": expMonth,
// 		    "card[exp_year]": expYear,
// 		    "card[cvc]": cvc
// 		  };
// 		  var formBody = [];
// 		  for (var property in cardDetails) {
// 		    var encodedKey = encodeURIComponent(property);
// 		    var encodedValue = encodeURIComponent(cardDetails[property]);
// 		    formBody.push(encodedKey + "=" + encodedValue);
// 		  }
// 		  formBody = formBody.join("&");
// 		  console.log("Form Body " + formBody);
//         var bytes = utf8.encode(config.apiKey.public+':');
//         var encodedSecretKey = base64.encode(bytes);

//         try {
//     //     	fetch(config.stripeUrl+'tokens', {
//     //     		method : "POST",
//     //     		headers : {
//     //     			'Accept': 'application/json',
//     //     			'Content-Type' : 'application/json',
//     //     			"Authorization" : 'Bearer ' + encodedSecretKey
//     //     		},
//     //     		body : formBody
//     //     	})
//     //     	.then((err, res) => {
//     //     		if (err) {
// 	   //                  if (!err.response) {
// 	   //                      res = {
// 	   //                          ok: false,
// 	   //                          body: { errors: { default: 'Server connection error' }}
// 	   //                      }
// 	   //                  } else {
// 	   //                      res = err.response;
// 	   //                  }
// 	   //              }else if(!res.ok){
// 	   //              	res = {
// 	   //                  	ok: false,
// 	   //                  	body: JSON.parse(res.text)
// 	   //              	}
// 	   //          	}else{
// 	   //              	res = {
// 	   //                  	ok: true,
// 	   //                  	body: JSON.parse(res.text)
// 	   //              	}
// 	   //          	}
// 	   //          	callback && callback(res);
//     //     	})
// 	            superagent
// 	            .post(config.stripeUrl+'tokens')
// 	            .set('Accept', '*/*')
// 	            .set('Content-Type', 'application/x-www-form-urlencoded')
// 	            .set('Authorization', 'Basic '+encodedSecretKey)
// 	            .send('card'+'[number]='+cardNumber)
// 	            .send('card'+'[exp_month]='+expMonth)
// 	            .send('card'+'[exp_year]='+expYear)
// 	            .send('card'+'[cvc]='+cvc)
// 	            .end(function(err, res){
// 	                if (err) {
// 	                    if (!err.response) {
// 	                        res = {
// 	                            ok: false,
// 	                            body: { errors: { default: 'Server connection error' }}
// 	                        }
// 	                    } else {
// 	                        res = err.response;
// 	                    }
// 	                }else if(!res.ok){
// 	                	res = {
// 	                    	ok: false,
// 	                    	body: JSON.parse(res.text)
// 	                	}
// 	            	}else{
// 	                	res = {
// 	                    	ok: true,
// 	                    	body: JSON.parse(res.text)
// 	                	}
// 	            	}
// 	            	callback && callback(res);
// 	        });
//         } catch (e) {
//             var error = {ok: false, unauthorized: false, exception: e};
//             console.log('error ',error );
//             callback && callback(error);
//         }
//     },
//     createCustomerToken : function(token, description, email, callback){
// 		var bytes = utf8.encode(config.apiKey.secret+':');
// 		var encodedSecretKey = base64.encode(bytes);
// 		try{
// 			superagent
// 				.post(config.stripeUrl+'customers')
// 				.set('Accept', '*/*')
// 				.set('Content-Type', 'application/x-www-form-urlencoded')
// 				.set('Authorization', 'Basic '+encodedSecretKey)
// 				.send('source=' + token)
// 				.send('description=' + description)
// 				.send('email=' + email)
// 				.end((err, res) => {
// 					if (err) {
// 						if (!err.response) {
// 							res = {
// 								ok: false,
// 								body: { errors: { default: 'Server connection error' }}
// 							}
// 						} else {
// 							res = err.response;
// 						}
// 					}else if(!res.ok){
// 						res = {
// 							ok: false,
// 							body: JSON.parse(res.text)
// 						}
// 					}else{
// 						res = {
// 							ok: true,
// 							body: JSON.parse(res.text)
// 						}
// 					}
// 					callback && callback(res);
// 				})
// 		}
// 		catch(e){
// 			var error = {ok: false, unauthorized: false, exception: e};
// 			console.log('error ',error );
// 			callback && callback(error);
// 		}
// 	},
// 	chargeCustomer : function (customerID, amount, currency, callback){
// 		var bytes = utf8.encode(config.apiKey.secret+':');
// 		var encodedSecretKey = base64.encode(bytes);
// 		try{
// 			superagent
// 				.post(config.stripeUrl+'charges')
// 				.set('Accept', '*/*')
// 				.set('Content-Type', 'application/x-www-form-urlencoded')
// 				.set('Authorization', 'Basic '+encodedSecretKey)
// 				.send('amount=' + amount)
// 				.send('currency=' + currency)
// 				.send('customer=' + customerID)
// 				.end((err, res) => {
// 					if (err) {
// 						if (!err.response) {
// 							res = {
// 								ok: false,
// 								body: { errors: { default: 'Server connection error' }}
// 							}
// 						} else {
// 							res = err.response;
// 						}
// 					}else if(!res.ok){
// 						res = {
// 							ok: false,
// 							body: JSON.parse(res.text)
// 						}
// 					}else{
// 						res = {
// 							ok: true,
// 							body: JSON.parse(res.text)
// 						}
// 					}
// 					callback && callback(res);
// 				})
// 		}
// 		catch(e){
// 			var error = {ok: false, unauthorized: false, exception: e};
// 			console.log('error ',error );
// 			callback && callback(error);
// 		}
//     }
// }

// // module.exports = function (stripe_url, secret_key) {
// //     var module = {};
// //     module.createCardToken = function (cardNumber , expMonth ,expYear , cvc , callback ) {


// //         var bytes = utf8.encode(config.apiKey+':');
// //         var encodedSecretKey = base64.encode(bytes);

// //          try {

// //                     superagent
// //                     .post(config.stripeUrl+'tokens')
// //                     .set('Accept', '*/*')
// //                     .set('Content-Type', 'application/x-www-form-urlencoded')
// //                     .set('Authorization', 'Basic '+encodedSecretKey)
// //                     .send('card'+'[number]='+cardNumber)
// //                     .send('card'+'[exp_month]='+expMonth)
// //                     .send('card'+'[exp_year]='+expYear)
// //                     .send('card'+'[cvc]='+cvc)
// //                     .end(function(err, res){

// //                                 if (err) {
// //                                     if (!err.response) {
// //                                         res = {
// //                                             ok: false,
// //                                             body: { errors: { default: 'Server connection error' }}
// //                                         }
// //                                     } else {
// //                                         res = err.response;

// //                                     }
// //                                 } else if(!res.ok){

// //                                      res = {
// //                                             ok: false,
// //                                             body: JSON.parse(res.text)
// //                                      }

// //                                 }else{

// //                                     res = {
// //                                             ok: true,
// //                                             body: JSON.parse(res.text)
// //                                      }

// //                                 }

// //                                 console.log('response ',res.text);
// //                                 callback && callback(res);

// //                       }
// //                      );

// //          } catch (e) {
// //             var error = {ok: false, unauthorized: false, exception: e};
// //             console.log('error ',error );
// //             callback && callback(error);
// //         }


// //     };



// //     return module;
// // };
// module.exports = stripeApiRouter;
