'use strict';

const STRIPE_URL = 'https://api.stripe.com/v1/';
const STRIPE_Customer_URL = 'https://api.stripe.com/v1/customers';
const SECRET_KEY = 'pk_test_m7YwssBsq4vkVEMKez64ptuY';

let createCardToken = function (object) {

  let {cardno, expiryMonth, expiryYear, secureCode} = object;

  var cardDetails = {
    "card[number]": cardno,
    "card[exp_month]": expiryMonth,
    "card[exp_year]": expiryYear,
    "card[cvc]": secureCode,
  };

  var body = [];
  for (var property in cardDetails) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(cardDetails[property]);
    body.push(encodedKey + "=" + encodedValue);
  }
  body = body.join("&");

  return fetch(STRIPE_URL + 'tokens', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + SECRET_KEY
    },
    body: body
  })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.log('createCardToken.js: ', error);
    });
};
let addCustomer = function (token) {
  console.log('@@@@@@@ token', token);
  /*
   let {cardno, expiryMonth, expiryYear, secureCode} = object;

   var cardDetails = {
   "card[number]": cardno,
   "card[exp_month]": expiryMonth,
   "card[exp_year]": expiryYear,
   "card[cvc]": secureCode,
   };

   var body = [];
   for (var property in cardDetails) {
   var encodedKey = encodeURIComponent(property);
   var encodedValue = encodeURIComponent(cardDetails[property]);
   body.push(encodedKey + "=" + encodedValue);
   }
   body = body.join("&");*/
  var body = {source: token};
  body = JSON.stringify(body);

  return fetch(STRIPE_Customer_URL, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + SECRET_KEY
    },
    body: body
  })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('@@@@stripe response', responseJson);
      return responseJson;
    })
    .catch((error) => {
      console.log('createCardToken.js: ', error);
    });
};

export {createCardToken};
export {addCustomer};