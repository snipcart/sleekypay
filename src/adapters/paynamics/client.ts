import { Auth } from './auth/Auth'

export const client = async (
  resource: string,
  method: string,
  payload: Record<string, any>,
  headers: HeadersInit | undefined
) => {
  return (await fetch(`${process.env.REACT_APP_PAYNAMICS_BASE_URL}/${resource}`, {
      method,
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "Authorization": Auth.authorization(),
      },
      body: JSON.stringify(payload)
    }
  )).json();
}
