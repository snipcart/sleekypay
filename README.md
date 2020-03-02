# SleekyPay
SleekyPay is a fake payment gateway to showcase Snipcart's custom payment gateway integration functionality.

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