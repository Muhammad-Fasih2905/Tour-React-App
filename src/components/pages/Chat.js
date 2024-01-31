import React, { useContext, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import ProfileIcon from "../../assets/images/profile-icon.png";
import { usePubNub } from "pubnub-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef } from "react";
import { db } from "../../firebase";
import { UserContext } from "../../contexts/UserContext";

function Chat() {
  const { userId } = useContext(UserContext);
  const bottomRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [userName, setUserName] = useState("");
  const admin_id = sessionStorage.getItem("admin_id");
  // PUBNUB USER
  const pubnub = usePubNub();
  const [channels, setChannels] = useState([
    `${selectedUser}_yV7GSysYWCX8YshO285KOs7hn223`,
  ]);
  // const calledOnce = useRef(false);
  const [messages, addMessage] = useState([]);
  const [message, setMessage] = useState("");
  const [oldMessages, setOldMessages] = useState([]);

  const getUsers = async () => {
    const q = query(collection(db, "users"), where("role", "==", "user"));
    const querySnapshot = await getDocs(q);
    setUsers(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  // console.log('userId',userId);
  const myFunc = (e) => {
    setSelectedUser(e.user_id);
    setUserName(e.user_name);
    addMessage([]);
    setMessage("");
  };

  const sendMessage = () => {
    // console.log("sendMessage===>", message);
    if (message === "") {
      alert("Enter Message");
      return;
    } else {
      if (message) {
        pubnub.publish(
          {
            channel: channels,
            message: message,
            storeInHistory: true,
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString(),
          },
          function (status, response) {
            // console.log("Status====>", status);
            // console.log("Response ====>", response);
          }
        );
        // messages.push({
        //   message: message,
        //   uuid: "yV7GSysYWCX8YshO285KOs7hn223",
        // });
        setMessage("");
      }
    }
  };
  useEffect(() => {
    try {
      pubnub
        .fetchMessages({
          channels: [channels],
          start: "15343325214676133",
          end: "16843325004275466",
        })
        .then((res) => {
          // console.log("RES====>", res);
          let message_res = Object.values(res.channels);
          let myMessages = message_res.flat(1);
          // console.log("OLD MESSAGES FUNC===>", myMessages);
          setOldMessages(myMessages);
        });
    } catch (error) {
      console.log("ERROR===>", error);
    }
  }, [pubnub, channels]);

  const handleMessage = (event) => {
    // console.log("messages12 CURRENT MESSAGE===>", event);
    addMessage((messages) => [...messages, event]);
    //   const message = event.message;
    //   if (typeof message === "string" || message.hasOwnProperty("text")) {
    //     const text = message.text || message;
    //     console.log('text===>', text)
    //   }
  };
  // console.log("messages12", messages);
  useEffect(() => {
    pubnub.addListener({ message: handleMessage });
  }, [pubnub]);

  useEffect(() => {
    pubnub.subscribe({ channels: channels });
  }, [channels]);

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    setChannels([`${selectedUser}_yV7GSysYWCX8YshO285KOs7hn223`]);
  }, [selectedUser]);

  useEffect(() => {
    try {
      pubnub
        .fetchMessages({
          // channels: [`${userId}_yV7GSysYWCX8YshO285KOs7hn223`],
          channels: [
            `DdVTUpxs16hdbWBTX5BrsCyTHLG2_yV7GSysYWCX8YshO285KOs7hn223`,
          ],
          start: "15343325214676133",
          end: "16843325004275466",
        })
        .then((res) => {
          console.log("RES====>", res);
          let message_res = Object.values(res.channels);
          let myMessages = message_res.flat(1);
          console.log("Chatbot MESSAGES FUNC===>", myMessages);
        });
    } catch (error) {
      console.log("ERROR===>", error);
    }
    // console.log("GLOBAL USER_ID====>", userId);
  }, [pubnub, userId]);
  // console.log("GLOBAL USER_ID====> 2", userId);

  // console.log("CHANNELS====>", channels);
  return (
    <>
      {/* <AdminNavbar /> */}
      <Container className="mt-4">
        <Row>
          <Col md="12">
            <Card id="chat3" style={{ borderRadius: "10px" }}>
              <Card.Body>
                <Row>
                  <Col
                    md={6}
                    lg={5}
                    xl={4}
                    className="mb-4 mb-md-0"
                    style={{
                      borderRight: "1px solid lightgray",
                    }}
                  >
                    <div className="p-3">
                      {/* <InputGroup className="rounded mb-3">
                                                <input
                                                    className="form-control rounded"
                                                    placeholder="Search"
                                                    type="search"
                                                />
                                                <span
                                                    className="input-group-text border-0"
                                                    id="search-addon"
                                                >
                                                </span>
                                            </InputGroup> */}

                      <div
                        style={{
                          position: "relative",
                          height: "620px",
                          overflowY: "auto",
                        }}
                      >
                        <div className="mb-0">
                          {users?.map((e, i) => {
                            return (
                              <li
                                className="p-2 border-bottom"
                                key={i}
                                onClick={() => {
                                  myFunc(e);
                                  console.log("USER ID====>", e.user_id);
                                  // setSelectedUser(e.user_id)
                                  // setUserName(e.user_name)
                                }}
                              >
                                <div className="d-flex justify-content-between">
                                  <div className="d-flex flex-row">
                                    <div>
                                      <img
                                        // src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                        src={ProfileIcon}
                                        alt="avatar"
                                        className="d-flex align-self-center me-3"
                                        width="50"
                                      />
                                      {/* <span className="badge bg-success badge-dot"></span> */}
                                    </div>
                                    <div
                                      className="pt-1"
                                      style={{ cursor: "pointer" }}
                                    >
                                      <p className="fw-bold mt-2 text-capitalize">
                                        {e.user_name}
                                      </p>
                                      {/* <p className="small text-muted">
                                                                        Hello, Are you there?
                                                                    </p> */}
                                    </div>
                                  </div>
                                  {/* <div className="pt-1">
                                                                <p className="small text-muted mb-1">Just now</p>
                                                                <span className="badge bg-danger rounded-pill float-end">
                                                                    3
                                                                </span>
                                                            </div> */}
                                </div>
                              </li>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Col>
                  {selectedUser !== "" ? (
                    <Col md={6} lg={7} xl={8}>
                      <div>
                        <div className="d-flex flex-row justify-content-start border-bottom p-1">
                          <img
                            // src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                            src={ProfileIcon}
                            alt="avatar 1"
                            style={{ width: "45px", height: "100%" }}
                          />
                          <p className="pt-2 ps-2 text-capitalize">
                            {userName}
                          </p>
                        </div>
                      </div>
                      <div
                        style={{
                          position: "relative",
                          height: "500px",
                          overflowY: "auto",
                        }}
                        className="pt-3 pe-3"
                        ref={bottomRef}
                      >
                        {oldMessages?.map((e, i) => {
                          console.log("OLD MESSAGES elements===>", e);
                          return (
                            <>
                              {e.uuid === admin_id ? (
                                <>
                                  <div className="d-flex flex-row justify-content-end">
                                    <div
                                      style={{
                                        width: "450px",
                                      }}
                                    >
                                      <p className="small p-2 text-white ms-3 mb-1 rounded-3 bg-primary">
                                        {e.message}
                                      </p>
                                      <p className="small ms-3 mb-3 rounded-3 text-muted float-start">
                                        Admin
                                      </p>
                                    </div>
                                    <img
                                      // src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                      src={ProfileIcon}
                                      alt="avatar 1"
                                      style={{ width: "35px", height: "100%" }}
                                      className="mx-2"
                                    />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="d-flex flex-row justify-content-start">
                                    <img
                                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                      // src={ProfileIcon}
                                      alt="avatar 1"
                                      style={{ width: "35px", height: "100%" }}
                                      className="mx-2"
                                    />
                                    <div
                                      style={{
                                        width: "450px",
                                      }}
                                    >
                                      <p
                                        className="small p-2 me-3 mb-1 text-dark rounded-3"
                                        style={{ backgroundColor: "#f5f6f7" }}
                                      >
                                        {e.message}
                                      </p>
                                      <p className="small me-3 mb-3 rounded-3 text-muted text-capitalize float-end">
                                        {userName}
                                      </p>
                                    </div>
                                  </div>
                                </>
                              )}
                            </>
                          );
                        })}

                        {messages.map((e, i) => {
                          console.log("messages====>", e);
                          return (
                            <>
                              {e.publisher === admin_id ? (
                                <>
                                  <div className="d-flex flex-row justify-content-end">
                                    <div
                                      style={{
                                        width: "450px",
                                      }}
                                    >
                                      <p className="small p-2 text-white ms-3 mb-1 rounded-3 bg-primary">
                                        {e.message}
                                      </p>
                                      <p className="small ms-3 mb-3 rounded-3 text-muted float-start">
                                        Admin
                                      </p>
                                    </div>
                                    <img
                                      // src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                      src={ProfileIcon}
                                      alt="avatar 1"
                                      style={{ width: "35px", height: "100%" }}
                                      className="mx-2"
                                    />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="d-flex flex-row justify-content-start">
                                    <img
                                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                      // src={ProfileIcon}
                                      alt="avatar 1"
                                      style={{ width: "35px", height: "100%" }}
                                      className="mx-2"
                                    />
                                    <div
                                      style={{
                                        width: "450px",
                                      }}
                                    >
                                      <p
                                        className="small p-2 me-3 mb-1 text-dark rounded-3"
                                        style={{ backgroundColor: "#f5f6f7" }}
                                      >
                                        {e.message}
                                      </p>
                                      <p className="small me-3 mb-3 rounded-3 text-muted text-capitalize float-end">
                                        {userName}
                                      </p>
                                    </div>
                                  </div>
                                </>
                              )}
                            </>
                          );
                        })}
                      </div>

                      <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2 border-top">
                        <input
                          type="text"
                          className="form-control form-control-lg shadow-none"
                          value={message}
                          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                          placeholder="Type message"
                          onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button
                          variant="primary"
                          size="lg"
                          className="ms-3"
                          onClick={() => sendMessage()}
                        >
                          Send
                        </Button>
                      </div>
                    </Col>
                  ) : (
                    <>
                      <Col
                        md={6}
                        lg={7}
                        xl={8}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className="text-center">No User Selected</div>
                      </Col>
                    </>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Chat;
