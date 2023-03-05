async () => {  
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
        "pmethod": " ",
        "collection_method": "single_pay",
        "payment_notification_status": "1",
        "payment_notification_channel": "1",
        "amount": "101.50",
        "currency": "PHP",
        "trx_type": "sale",
        "signature": ""
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
        "signature": ""
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


  // var jsonData = JSON.parse(payload);
  var jsonData = payload;
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


  var rawTrx =
    merchantid +
    payload.transaction.request_id +
    payload.transaction.notification_url +
    payload.transaction.response_url +
    payload.transaction.cancel_url +
    payload.transaction.collection_method +
    payload.transaction.amount +
    payload.transaction.currency +
    payload.transaction.payment_notification_status +
    payload.transaction.payment_notification_channel +
    mkey;
  var raw =
    payload.customer_info.fname +
    payload.customer_info.lname +
    payload.customer_info.mname +
    payload.customer_info.email +
    payload.customer_info.phone +
    payload.customer_info.mobile +
    payload.customer_info.dob +
    mkey;

  async function sha512(str) {
  let encoder = new TextEncoder();
  let data = encoder.encode(str);
  let hash = await crypto.subtle.digest("SHA-512", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  }

  payload.transaction.signature = await sha512(rawTrx);
  payload.customer_info.signature = await sha512(raw);

  console.log('rawTrx', rawTrx);
  console.log('raw', raw);
  console.log('signatureTrx', payload.transaction.signature);
  console.log('signature', payload.customer_info.signature);
  // console.log('payload', payload);

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
}
