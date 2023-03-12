import { generate } from 'short-uuid';
import { TransactionPayload } from '../../../../types/paynamics/transactionPayload';
import { Invoice } from '../../../../types/snipcart/invoice';

export const invoiceToTransaction = ({
  amount,
  currency,
  email,
  billingAddress,
  shippingAddress,
  items,
}: Invoice): TransactionPayload => {
  // TODO: Snipcart does not provide a first name and a last last name
  // Assuming it is formatted as "FIRST_NAME LAST_NAME" for now
  const [firstName, lastName] =( billingAddress?.name ?? "").split("")

  return {
    transaction: {
      request_id: generate(),
      // TODO: Update URLs with actual values
      notification_url: "https://www.paynamics.com/notify",
      response_url: "https://www.paynamics.com/response",
      cancel_url: "https://www.paynamics.com/cancel",
      pchannel: "",
      pmethod: "",
      collection_method: "single_pay",
      payment_notification_status: "1",
      payment_notification_channel: "1",
      currency,
      trx_type: "sale",
    },
    billing_info: {
      billing_address1: billingAddress.streetAndNumber,
      billing_address2: "",
      billing_city: billingAddress.city,
      billing_state: billingAddress.region,
      billing_country: billingAddress.country,
      billing_zip: billingAddress.postalCode,
    },
    shipping_info: {
      shipping_address1: shippingAddress.streetAndNumber,
      shipping_address2: "",
      shipping_city: shippingAddress.city,
      shipping_state: shippingAddress.region,
      shipping_country: shippingAddress.country,
      shipping_zip: shippingAddress.postalCode,
    },
    customer_info: {
      fname: firstName,
      lname: lastName,
      mname: "",
      email,
      // TODO: Use actual customer number
      phone: "09171234567",
      mobile: "",
      dob: "",
    },
    order_details: {
      orders: items.map(({ name, quantity, unitPrice, amount: itemAmount }) => ({
        itemname: name,
        quantity,
        unitprice: unitPrice?.toString() ?? "0",
        totalPrice: itemAmount?.toString() ?? "0",
        servicecharge: false,
      })),
      subtotalprice: amount.toString(),
      shippingprice: "0",
      // TODO: Loop through each iteam and add up its discount amount?
      discountamount: "0",
      // TODO: Assuming it is equal to amount for now
      totalorderamount: amount.toString(),
    }

  }
}