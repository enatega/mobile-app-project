import { API, client } from "@/src/api";

export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  const { data } = await client.post(API.auth.login, payload);
  return data; // { token, user }
}
