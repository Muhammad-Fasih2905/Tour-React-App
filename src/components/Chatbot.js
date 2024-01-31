import React, { useState, useEffect, useContext } from "react";
import {
  Widget,
  addResponseMessage,
  addUserMessage,
  dropMessages,
  setQuickButtons,
} from "react-chat-widget";
import { usePubNub } from "pubnub-react";
import "react-chat-widget/lib/styles.css";
import { UserContext } from "../contexts/UserContext";
const Chatbot = () => {
  const user_id = sessionStorage.getItem("user_id");
  const admin_id = "yV7GSysYWCX8YshO285KOs7hn223";

  // PUBNUB USER
  const pubnub = usePubNub();
  const [channels] = useState([`${user_id}_yV7GSysYWCX8YshO285KOs7hn223`]);
  const { userId, setUserId } = useContext(UserContext);
  const [messages, addMessage] = useState([]);
  const [message, setMessage] = useState("");
  const [oldMessages, setOldMessages] = useState([]);
  const [msgSend, setmsgSend] = useState(true);

  const sendMessage = (message) => {
    if (message) {
      pubnub
        .publish({
          channel: channels[0],
          message: message,
          time: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString(),
          storeInHistory: true,
        })
        .then(() => {
          setMessage("");
          // setUserId("");
        });
    }
  };
console.log('global',userId);
  const handleQuickButtonClicked = (message) => {
    if (message.includes("Karachi") || message === "Karachi") {
      addUserMessage("Where is your office located?");
      sendMessage("Where is your office located?");
      setUserId(user_id);
      setTimeout(() => {
        addResponseMessage(message);
      }, 1000);
    } else if (
      message.includes(
        "We are offering spots from north and south, for further details try contacting our agent."
      ) ||
      message ===
        "We are offering spots from north and south, for further details try contacting our agent."
    ) {
      addUserMessage("Which tourist spot you are offering?");
      sendMessage("Which tourist spot you are offering?");
      setUserId(user_id);
      setTimeout(() => {
        addResponseMessage(message);
      }, 1000);
    } else if (
      message.includes(
        "You can pay your packages price through Easypaisa/JazzCash. 30% Before the trip and 70% after the trip."
      ) ||
      message ===
        "You can pay your packages price through Easypaisa/JazzCash. 30% Before the trip and 70% after the trip."
    ) {
      addUserMessage("What is your payment method?");
      sendMessage("What is your payment method?");
      setUserId(user_id);
      setTimeout(() => {
        addResponseMessage(message);
      }, 1000);
    } else {
      addUserMessage(message);
      sendMessage(message);
      
    }
  };

  useEffect(() => {
    if (oldMessages.length !== 0) {
      oldMessages.forEach((m) => {
        // console.log("Current Messag OLD MESSAGES 78====>", m);
        if (m.uuid === admin_id) {
          addResponseMessage(m.message);
        } else {
          addUserMessage(m.message);
        }
      });
    }
  }, [oldMessages]);

  useEffect(() => {
    if (messages.length > 0 && msgSend) {
      console.log("Current Message 85====>", messages, msgSend);
      messages.forEach((m) => {
        if (m.publisher === user_id) {
          setmsgSend(false);
          console.log("Current Message 5555 ====>", m, true);
          // addUserMessage(m.message);
          addMessage([]);
        } else {
          console.log("Current Message 111 ====>", m);
          addResponseMessage(m.message);
          addMessage([]);
        }
      });
    }
    setTimeout(() => {
      setmsgSend(true);
    }, 500);
  }, [messages]);

  useEffect(() => {
    try {
      pubnub
        .fetchMessages({
          channels: [channels],
          start: "15343325214676133",
          end: "16843325004275466",
        })
        .then((res) => {
          let message_res = Object.values(res.channels);
          let myMessages = message_res.flat(1);
          setOldMessages(myMessages);
        });
    } catch (error) {
      console.log("ERROR===>", error);
    }
  }, [pubnub, channels]);

  const handleMessage = (event) => {
    console.log("event", event);
    addMessage((messages) => [...messages, event]);
    // const message = event.message;
    // console.log("Current Message 112===>", message);
    // if (typeof message === "string" || message.hasOwnProperty("text")) {
    //   const text = message.text || message;
    // }
  };

  useEffect(() => {
    pubnub.addListener({ message: handleMessage });
  }, [pubnub]);

  useEffect(() => {
    pubnub.subscribe({ channels: channels });
  }, [channels]);

  useEffect(() => {
    setQuickButtons([
      {
        label: "Where is your office located?",
        value: "Karachi",
      },
      {
        label: "Which tourist spot you are offering?",
        value:
          "We are offering spots from north and south, for further details try contacting our agent.",
      },
      {
        label: "What is your payment method?",
        value:
          "You can pay your packages price through Easypaisa/JazzCash. 30% Before the trip and 70% after the trip.",
      },
      {
        label: "Live Chat",
        value: "Live Chat",
      },
    ]);
  }, []);

  return (
    <div>
      <Widget
        title="Great Expeditions"
        subtitle="Hey! Thanks for checking out Great Expeditions!"
        emojis={true}
        handleNewUserMessage={sendMessage}
        showTimeStamp={false}
        handleQuickButtonClicked={handleQuickButtonClicked}
        showBadge={false}
      />
    </div>
  );
};

export default Chatbot;
