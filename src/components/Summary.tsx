import * as React from "react";
import { Invoice } from "../interfaces"


export default function Summary(invoice: Invoice) {
  return (
    <div className="summary">
      {
        invoice.items.map((item, index) => {
          return (
            <div className="summary__item" key={`item:${index}`}>
              {item.name} x{item.quantity}
              <span className="summary__item--right">${item.amount}</span>
            </div>
          )
        })
      }
      <div className="summary__item">Total<span className="summary__item--bold">${invoice.amount}</span></div>
      <hr />
    </div>
  )
}