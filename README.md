# Paynamics
Paynamics is a payment gateway for Philippines transactions

This app is based from SleekPay, a fake payment gateway to showcase Snipcart's custom payment gateway integration functionality. 

## Local development

Netlify CLI must be installed globally

    npm install netlify-cli -g

To run the project locally, you can use the following commands:
```
npm install
npm run dev
```
The website will be live on `localhost:1234/index.html` while netlify functions can be found on `http://localhost:34567/.netlify/functions/<your_function_name>`

## Production build
```
npm run build
```

# Paynamics Method 

## in app.netlify.com

API_URL = `https://payment.snipcart.com` is SnipCart's API Hostname
SITE_URL = `https://api.payserv.net/v1/rpf/transactions/rpf` is Paynamics API Endpoint
BEARER_TOKEN = grab from postman+paynamics

## in snipcart

PAYMENT METHODS TEST URL
https://master--paynamics-method.netlify.app/.netlify/functions/paynamics-method