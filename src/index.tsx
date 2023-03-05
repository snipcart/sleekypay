var CryptoJS = require('crypto-js');

var myHeaders = new Headers();
myHeaders.append("Authorization", "Basic YWNjZXNzVHJ2TDQ6M25CNjdPWkZxZ2g0");
myHeaders.append("Content-Type", "application/json");

function toIsoString(date) {
  var pad = function(num) {
    return (num < 10 ? '0' : '') + num;
  };
  return date.getFullYear()
    + pad(date.getMonth() + 1)
    + pad(date.getDate())
    + pad(date.getHours())
    + pad(date.getMinutes())
    + pad(date.getSeconds())
    ;
}
var dt = new Date();
let timestamp = toIsoString(dt);
// console.log(timestamp);

var mode = 'test';

var payload = {
  "transaction": {
      "request_id": "AT-"+ mode +"-RPF-"+ timestamp,
      "notification_url": "https://www.paynamics.com/",
      "response_url": "https://www.paynamics.com/",
      "cancel_url": "https://www.paynamics.com/",
      "pchannel": " ",
      "collection_method": "single_pay",
      "payment_notification_status": "1",
      "payment_notification_channel": "1",
      "amount": "101.50",
      "currency": "PHP",
      "trx_type": "sale",
      "signature": signatureTrx
  },
  "billing_info": {
      "address1": "First Street",
      "address2": "H.V. dela Costa Street",
      "city": "Makati",
      "state": "Metro Manila",
      "country": "Philippines",
      "zip": "1227"
  },
  "shipping_info": {
      "shipping_address1": "First Street",
      "shipping_address2": "",
      "shipping_city": "Quezon City",
      "shipping_state": "Metro Manila Area",
      "shipping_country": "PH",
      "shipping_zip": "1229"
  },
  "customer_info": {
      "fname": "Jan",
      "lname": "Dae",
      "mname": "",
      "email": "jandae@gmal.com",
      "phone": "09171234567",
      "mobile": "09171234567",
      "dob": "",
      "signature": signature
  },
  "order_details": {
      "orders": [
          {
              "itemname": "Test Product",
              "quantity": 1,
              "unitprice": "101.50",
              "totalprice": "101.50"
          }
      ],
      "subtotalprice": "101.50",
      "shippingprice": "0.00",
      "discountamount": "0.00",
      "totalorderamount": "101.50"
  }
}


var payloadStringified = JSON.stringify(payload);


var jsonData = JSON.parse(payload);
var merchantid = '000000021122575A1796';
var mkey = 'F6857B71681EF7E482F30B251558AADF';
var request_id = jsonData.transaction.request_id ? jsonData.transaction.request_id : '';
var notification_url = jsonData.transaction.notification_url ? jsonData.transaction.notification_url : '';
var response_url = jsonData.transaction.response_url ? jsonData.transaction.response_url : '';
var cancel_url = jsonData.transaction.cancel_url ? jsonData.transaction.cancel_url : '';
var pmethod = jsonData.transaction.pmethod ? jsonData.transaction.pmethod : '';
var collection_method = jsonData.transaction.collection_method ? jsonData.transaction.collection_method : '';
var amount = jsonData.transaction.amount ? jsonData.transaction.amount : '';
var currency = jsonData.transaction.currency ? jsonData.transaction.currency : '';
var payment_notification_status = jsonData.transaction.payment_notification_status ? jsonData.transaction.payment_notification_status : '';
var payment_notification_channel = jsonData.transaction.payment_notification_channel ? jsonData.transaction.payment_notification_channel : '';



var rawTrx = merchantid + request_id + notification_url + response_url + cancel_url + pmethod + collection_method + 
amount + currency + payment_notification_status + payment_notification_channel + mkey;
var signatureTrx = CryptoJS.enc.Hex.stringify(CryptoJS.SHA512(rawTrx));


console.log('RAW TRX', rawTrx);
console.log('SIGNATURE TRX', signatureTrx);

var fname = jsonData.customer_info.fname ? jsonData.customer_info.fname : '';
var lname = jsonData.customer_info.lname ? jsonData.customer_info.lname : '';
var mname = jsonData.customer_info.mname ? jsonData.customer_info.mname : '';
var email = jsonData.customer_info.email ? jsonData.customer_info.email : '';
var phone = jsonData.customer_info.phone ? jsonData.customer_info.phone : '';
var mobile = jsonData.customer_info.mobile ? jsonData.customer_info.mobile : '';
var dob = jsonData.customer_info.dob ? jsonData.customer_info.dob : '';

var raw = fname + lname + mname + email + phone + mobile + dob + mkey;
var signature = CryptoJS.enc.Hex.stringify(CryptoJS.SHA512(raw));


console.log('RAW', raw);
console.log('SIGNATURE', signature);


var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: payloadStringified,
  redirect: 'follow'
};


fetch("https://api.payserv.net/v1/rpf/transactions/rpf", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));