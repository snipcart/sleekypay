import { enc, SHA512 } from 'crypto-js'
import { encode as base64_encode } from 'base-64';

export class Auth {
  static readonly USERNAME = process.env.REACT_APP_PAYNAMICS_USERNAME;
  static readonly PASSWORD = process.env.REACT_APP_PAYNAMICS_PASSWORD;
  static readonly MERCHANT_ID = process.env.REACT_APP_PAYNAMICS_MERCHANT_ID;
  static readonly MKEY = process.env.REACT_APP_PAYNAMICS_MKEY;

  static authorization = () => {
    return `Basic ${base64_encode(`${Auth.USERNAME}:${Auth.PASSWORD}`)}`
  }

  static sign = (payload: Record<string, any>, keys: string[]) => {
    const raw = keys.map((key) => payload[key] ?? '')
      .concat(Auth.MKEY)
      .join('')
    return enc.Hex.stringify(SHA512(raw));
  }

  // TODO: Build abstraction layer to handle this
  static signWithMerchantId = (payload: Record<string, any>, keys: string[]) => {
    return Auth.sign(
      {
        ...payload,
        merchantId: Auth.MERCHANT_ID,
        mKey: Auth.MKEY
      },
      ['merchantId', ...keys]
    )
  }
}