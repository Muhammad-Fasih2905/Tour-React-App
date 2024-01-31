import React, { useEffect, useState } from "react";
import AppRouter from "./AppRouter";
import "react-chat-widget/lib/styles.css";
import ChatMiddle from "./components/pages/ChatMiddle";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
function App() {
  // const [userID, setUserID] = useState(null);

  // const getUserInfo = () => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       console.log("LOGIN-->");
  //       setUserID(user.uid);
  //     } else {
  //       console.log("USER NOT LOGIN");
  //     }
  //   });
  // };

  // useEffect(() => {
  //   getUserInfo();
  // }, []);

  const userID = sessionStorage.getItem("user_id");

  return (
    <>
      <AppRouter />
      {userID !== null ? <ChatMiddle /> : null}
    </>
  );
}

export default App;
