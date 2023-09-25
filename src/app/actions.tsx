'use server'
 
import { cookies } from 'next/headers'
 
export async function createCookie(data:any) {
  const cookiesList = cookies()
  const hasCookie = cookiesList.get('name')
  console.log("hasCookie: ", hasCookie);
  
  cookies().set({
    name: 'name',
    value: 'lee',
    httpOnly: true,
    path: '/',
  })
}