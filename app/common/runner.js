'use strict';
var config = require ('./stripeConfig');
var StripeAPI = require('./StripeAPI')(config.stripeUrl, config.apiKey.public);

function init (){
    var cardNumber = 4242424242424242,
        exp_month = 12,
        exp_year = 2016,
        cvc = 123;
    StripeAPI.createCardToken(cardNumber, exp_month, exp_year, cvc, function (token) {
        console.log("=============Token=============");
        console.log(token);
        console.log("===============================");
        StripeAPI.createCustomerToken(token.body.id, 'ahmad', 'ahmad@gmail.com', function (customer){
            console.log("=============Customer=============");
            console.log(customer);
            console.log("==================================");
            StripeAPI.chargeCustomer(customer.body.id, 2000, 'usd', function (charges){
                console.log("=============Charges=============");
                console.log(charges);
                console.log("==================================");
            })
        })
    });
}
init();