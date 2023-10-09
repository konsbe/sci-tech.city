import React from "react";
import "./chatRoom.css";
import dynamic from "next/dynamic";
// import SpaceComponent from "@/src/routes/space";
const SpaceComponent = dynamic(() => import('@/src/routes/space'), {
  ssr: false,
});

let fuck = "fuck";

function ChatRoom() {
  fuck += " chatRoom";
  return (
    <div className="body-container">
      <SpaceComponent />
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
