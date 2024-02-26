"use server";

import { cookies } from "next/headers";
import { UserInfo } from "../interfaces/user";

export async function createCookie(data: any) {
  const cookiesList = cookies();
  const hasCookie = cookiesList.get("user");
  if (hasCookie) return;
  cookies().set({
    name: data.name,
    value: data.value,
    httpOnly: true,
    path: data.path ? data.path : "/",
  });
}

export async function getCookie(name: string) {
  const cookiesList = cookies();

  const hasCookie = cookiesList.get(name);

  return hasCookie;
}

export async function createUser(data: UserInfo) {

  const reqBody = {
    user_id: Date.now(),
    username: data.userName, 
    email: data.email,
    picture: data.profilePicture,
    created_at: Date.now(), 
    password : data.password,
  }
  
  const response = await fetch(`http://localhost:8082/api/keycloak-service/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBody),
  });

  const res: any = await response.json();

  return res;
}
export async function decodeToken(accessToken: string) {
  const parts = accessToken?.split(".");
  if (!parts) return;
  const payload = await JSON.parse(atob(parts[1]));

  return payload;
}

export const login = async (data: { username: string; password: string }) => {
  
  const response = await fetch(
    "http://localhost:8082/api/keycloak-service/signin",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  const res: any = await response.json();
  const resToken = res[0] ? res[0] : res
  const parts = resToken?.access_token?.split(".");
  
  // const header = JSON.parse(atob(parts[0]));
  
  const payload = JSON.parse(atob(parts[1]));
    
  await createCookie({
    name: "access_token",
    value: res[0]?.access_token,
  });
  await createCookie({
    name: "profile_data",
    value: res[1] ? res[1] : res,
  });
  const cookie = await createCookie({
    name: "user",
    value: payload?.email,
  });

  return res;
};

export const logout = async () => {
  const cookiesList = cookies();
  const hasCookie = cookiesList.get("access_token");
  if (!hasCookie) return;

  const response = await fetch(
    "http://localhost:8082/api/keycloak-service/logout",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: hasCookie.value }),
    }
  );

  cookies().delete("access_token");
  cookies().delete("user");

  return response;
};
