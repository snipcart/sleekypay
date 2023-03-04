import fetch from "node-fetch";

exports.handler = async function(event, context, callback) {   
    // Get request's body
    const request = JSON.parse(event.body)

    // Validate that the request is coming from Snipcart
    const response = await fetch(`https://payment.snipcart.com/api/public/custom-payment-gateway/validate?publicToken=${request.PublicToken}`)

    // Return a 404 if the request is not from Snipcart
    if (!response.ok) return {
        statusCode: 404,
        body: ""
    }

    // Create a payment method list
    let paymentMethodList = [{
        id: 'Paynomics',
        name: 'Paynamics 101',
        iconUrl: '',
        checkoutUrl: 'https://api.payserv.net/v1/rpf/transactions/rpf',
    }]

    // Return successful status code and available payment methods
    return {
        statusCode: 200,
        body: JSON.stringify(paymentMethodList)
    };
}