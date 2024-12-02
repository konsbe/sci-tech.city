import React from "react";
import "./chatRoom.css";
import dynamic from "next/dynamic";
import { cookies } from 'next/headers'
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
 
// import SpaceComponent from "@/src/routes/space";
const SpaceComponent = dynamic(() => import('@/src/routes/space'), {
  ssr: false,
});

let fuck = "fuck";

export function userCokie(): RequestCookie | undefined {
  const cookieStore = cookies()
  const theme = cookieStore.get('user')
  return theme
}
function ChatRoom() {
 
  const cookie = userCokie()
   
  fuck += " chatRoom";
  return (
    <div className="body-container">
      <SpaceComponent cookie={cookie} />
    </div>
  );
}

export default ChatRoom;

// const [onlineSubscribedUsers, setOnlineSubscribedUsers] = useState<string[]>([]);
// const [privateChats, setPrivateChats] = useState<any[]>([]);

// JOIN
// setOnlineSubscribedUsers(payloadData?.connctedUsers);

// setPrivateChats((prev: any) => {
//   const keysArray = prev!.map((obj: any) => Object.keys(obj)[0]);
//   if (keysArray!.includes(entry)) return prev; // Return the unchanged array
//   return [...prev, { [`${entry}`]: [] }];
// });

// LEAVE
// setOnlineSubscribedUsers((prev: string[] | []): string[] =>
//   prev?.filter((user: string) => user !== leftUser)
// );

// setPrivateChats((prev: any) => {
//   return prev?.filter((usr: any) => !usr.hasOwnProperty(leftUser));
// });
