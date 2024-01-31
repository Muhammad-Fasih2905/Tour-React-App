import React, { useState, useEffect, useContext } from "react";
import "../../App.css";
import Header from "../Header";
import Icon2 from "../../assets/images/img-2.png";
import Icon3 from "../../assets/images/img-3.png";
import Airplane from "../../assets/images/airplane.png";
import {
  Card,
  Modal,
  Button,
  Form,
  FloatingLabel,
  InputGroup,
  DropdownButton,
  Dropdown,
  Container,
} from "react-bootstrap";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import LoadingSpinner from "../LoadingSpinner";
import Footer from "../Footer";
import ErrorAlert from "../ErrorAlert";
import { useNavigate } from "react-router-dom";
import Mountain from "../../assets/K2.jpg";
import Beach from "../../assets/Globe .jpg";
import axios from "axios";

const Budget = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [budget, setBudget] = useState("");
  const [fetchedBudget, setFetchedBudget] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [getQues, setGetQues] = useState([]);
  const userID = sessionStorage.getItem("user_id");
  const [saveRegion, setSaveRegion] = useState("");

  const [questionErrors, setQuestionErrors] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const url = "https://great-expedition-76211bc8562a.herokuapp.com/";

  const getBudget = () => {
    const budgetValue = parseFloat(budget);
    if (isNaN(budgetValue)) {
      console.log("Invalid budget entered.");
      return;
    }

    const requestData = {
      budget: budgetValue,
      direction: saveRegion,
    };

    axios
      .post(url, requestData)
      .then((response) => {
        console.log(response.data);
        setFetchedBudget(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error fetching budget:", error.response.data);
          console.error("Status code:", error.response.status);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up the request:", error.message);
        }
      });
  };

  async function getQuestions() {
    try {
      const q = query(
        collection(db, "question"),
        where("user_id", "==", userID)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        const questionDocRef = doc(db, "question", docSnapshot.id);
        const data = docSnapshot.data();
        console.log("Document Data:", data);
        setGetQues(data.question);
        setIsCompleted(data.isCompleted);

        const ques1Answer = data["ques1"]; // Access the answer using the question ID as a key
        if (ques1Answer !== undefined) {
          console.log("Answer for ques1:", ques1Answer);

          // Add your logic here to handle the answer for ques1

          // Save the answer in the budget state
          setSaveRegion(ques1Answer);
        } else {
          console.log("ques1 not found in the questions.");
        }
      } else {
        console.log("Document not found.");
      }
    } catch (error) {
      console.log("Error fetching questions from the database:", error);
    }
  }

  const handleShowModal = () => {
    if (budget === "") return;

    if (saveRegion) {
      setQuestionErrors(false);
      getBudget();
    } else {
      setQuestionErrors(true);
    }

    console.log("Questions ==> ", saveRegion);
  };

  useEffect(() => {
    if (userID) {
      getQuestions();
    }
  }, [userID]);

  return (
    <>
      {loader ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* header start */}
          <Header />
          {/* header end */}

          {/* page title start */}
          <div className="products">
            <h1 className="display-1">Budget</h1>
          </div>
          {/* page title end */}

          {/* input and send btn start */}
          <div
            className="container d-flex flex-column justify-self-center "
            style={{ marginTop: "50px" }}
          >
            <input
              className="form-control shadow-none"
              type="text"
              placeholder="Budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
            {questionErrors && (
              <div onClick={() => setShowModal(true)}>
                <p className="text-danger text-justify">
                  Questionaire left empty.{" "}
                  <span className="text-primary">Click here!</span> to fill the
                  Questionaire
                </p>
              </div>
            )}
            <button
              type="submit"
              class="btn btn-primary mb-3 mt-3 w-25 align-self-center"
              onClick={handleShowModal}
            >
              Send
            </button>
          </div>

          {/* input and send btn end */}

          {/* Result card start */}
          <div className="album py-5 bg-light">
            <Container
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              {fetchedBudget && (
                <div
                  className="card shadow mx-3 my-3"
                  style={{
                    border: "none",
                    width: "58%",
                    borderRadius: 15,
                    backgroundColor: "rgba(131, 56, 236, 0.08)",
                    cursor: "pointer",
                    height: "auto",
                  }}
                >
                  <Card.Img
                    variant="top"
                    className="pt-3 px-3"
                    height={270}
                    src={fetchedBudget.direction === "north" ? Beach : Mountain}
                    alt="cardImage"
                  />
                  <Card.Body>
                    <Card.Title className="text-capitalize">
                      These are the recommended cities for you
                    </Card.Title>
                    <Card.Text className="text-capitalize text-Elipsis">
                      <div
                        style={{
                          height: 100,
                          overflowY: "scroll",
                          marginBottom: 10,
                        }}
                      >
                        {fetchedBudget.recommended_cities.map((city) => {
                          return <li>{city} (1 day & night)</li>;
                        })}
                      </div>
                    </Card.Text>
                    <p>
                      Commute from 1 city to another city is included in the
                      budget. For more details please chat.
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <img
                          style={{
                            backgroundColor: "rgba(77, 45, 219, 0.518)",
                          }}
                          className="img-fluid p-1 rounded-circle mx-1"
                          alt="Travel"
                          src={Airplane}
                        />
                        <img
                          style={{
                            backgroundColor: "rgba(77, 45, 219, 0.518)",
                          }}
                          className="img-fluid px-2 py-1 rounded-circle mx-1"
                          alt="Travel"
                          src={Icon3}
                        />
                        <img
                          style={{
                            backgroundColor: "rgba(77, 45, 219, 0.518)",
                          }}
                          className="img-fluid p-1 rounded-circle mx-1"
                          alt="Travel"
                          src={Icon2}
                        />
                      </div>
                      <small className="text-dark">Rs. {budget}</small>
                    </div>
                    <p
                      className="pt-3"
                      style={{
                        color: "#2fb9f5",
                        fontWeight: "normal",
                        fontSize: 13,
                      }}
                    >
                      Excluding any miscellaneous amount. Prices may differ in
                      accordance to the price of fuel.
                    </p>
                  </Card.Body>
                </div>
              )}
            </Container>
          </div>

          {/* Result card end */}
          <Footer />
          {userID && showModal && (
            <ModalQuestion
              isNewSignup={showModal}
              setIsNewSignup={setIsCompleted}
            />
          )}
        </>
      )}
    </>
  );
};

const ModalQuestion = (props) => {
  const { isNewSignup, setIsNewSignup, isCompleted, setIsCompleted } = props;

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const userID = sessionStorage.getItem("user_id");

  const ModalClose = () => setIsCompleted(false);

  let initialQues = [
    {
      id: 1,
      ques: "Do you want to explore northern or southern side of Pakistan?",
      ans: "",
    },
    {
      id: 2,
      ques: "Do you love to explore mountains?",
      ans: "",
    },
    {
      id: 3,
      ques: "Do you want you vacation of 3 days?",
      ans: "",
    },
    {
      id: 4,
      ques: "Do you want your vacation of 1 week or above?",
      ans: "",
    },
    {
      id: 5,
      ques: "Do you prefer to stay in camps while on vacation?",
      ans: "",
    },
    {
      id: 6,
      ques: " Do you prefer to stay in hotel while on vacations?",
      ans: "",
    },
    {
      id: 7,
      ques: "Have you ever bought a package tour?",
      ans: "",
    },
    {
      id: 8,
      ques: "Do you like to try local food when you travel?",
      ans: "",
    },
    {
      id: 9,
      ques: "Do you prefer to travel by bus?",
      ans: "",
    },
    {
      id: 10,
      ques: "Do you like to try local food when you travel?",
      ans: "",
    },
    {
      id: 11,
      ques: "Do you prefer to travel by plane?",
      ans: "",
    },
    {
      id: 12,
      ques: "Is budgeting important for you when you plan a trip? you prefer luxurious trip.",
      ans: "",
    },
    {
      id: 13,
      ques: "Do you prefer camping/ bonfire while on a trip?",
      ans: "",
    },
    {
      id: 14,
      ques: " Do you prefer hiking and exploring more spots within less time in a certain area?",
      ans: "",
    },
    {
      id: 15,
      ques: "Are you a beach person?",
      ans: "",
    },
    // {
    //   id: 16,
    //   ques: "Do you want to explore southern side of pakistan?",
    //   ans: "",
    // },
  ];

  const [currentQues, setCurrentQues] = useState(0);
  const [questionValues, setQuestionValues] = useState(initialQues);
  const postQuestionData = (id, value) => {
    let update = questionValues.map((e) => {
      if (e.id === id) {
        if (id === 1) {
          return { ...e, ans: value === "south" ? "south" : "north" };
        } else {
          return { ...e, ans: value };
        }
      } else {
        return e;
      }
    });

    setQuestionValues(update);
  };

  const handleQuestionSubmission = () => {
    setError(false);
    setErrorMsg("");
    setLoader(true);

    let hasUnansweredQuestions = false;

    for (let i = 0; i < 15; i++) {
      const question = questionValues[i];
      if (!question || question.ans === "") {
        hasUnansweredQuestions = true;
        break;
      }
    }

    if (hasUnansweredQuestions) {
      alert("Please answer all the questions from 0 to 15.");
      setShowModal(false);
      setLoader(false);
      return;
    }

    const questionRef = collection(db, "question");

    const questionData = {
      user_id: userID,
      ...questionValues.slice(0, 15).reduce((acc, question, index) => {
        return {
          ...acc,
          [`ques${index + 1}`]: question.ans,
        };
      }, {}),
      isCompleted: true,
    };

    // Check if any answers are filled
    const isAnyAnswerFilled = Object.values(questionData).some(
      (value) => value !== undefined
    );

    if (!isAnyAnswerFilled) {
      alert("Please fill at least one question from 0 to 15.");
      setShowModal(false);
      setLoader(false);
      return;
    }
    addDoc(questionRef, questionData)
      .then(() => {
        alert("Answer has been submitted");
        setShowModal(false);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error in uploading question details:", error);
        if (error.response && error.response.status === 500) {
          alert("Internal Server Error. Please try again later.");
        } else if (error.response) {
          alert("Error:", error.response.data);
        } else {
          alert("Error:", error.message);
        }
        setLoader(false);
      });
  };

  return (
    <Modal
      show={showModal}
      onHide={() => {
        setShowModal(false);
      }}
      size="lg"
      backdrop="static"
      className=""
      style={{ display: "block", position: "center" }}
    >
      <Modal.Header>
        <Modal.Title>Questionnaire</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label className="fs-5">{`Question ${questionValues[currentQues]?.id}. ${questionValues[currentQues]?.ques}`}</Form.Label>

          <div class="d-flex justify-content-center flex-column">
            {currentQues === 0 ? (
              <>
                <div className="form-check">
                  <input
                    className="form-check-input fs-5"
                    value="south"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    checked={questionValues[currentQues]?.ans === "south"}
                    onChange={(elem) =>
                      postQuestionData(
                        questionValues[currentQues]?.id,
                        elem.target.value
                      )
                    }
                  />
                  <label
                    className="form-check-label fs-5"
                    htmlFor="flexRadioDefault1"
                  >
                    South
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input fs-5"
                    value="north"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault2"
                    checked={questionValues[currentQues]?.ans === "north"}
                    onChange={(elem) =>
                      postQuestionData(
                        questionValues[currentQues]?.id,
                        elem.target.value
                      )
                    }
                  />
                  <label
                    className="form-check-label fs-5"
                    htmlFor="flexRadioDefault2"
                  >
                    North
                  </label>
                </div>
              </>
            ) : (
              <>
                <div className="form-check">
                  <input
                    className="form-check-input fs-5"
                    value="yes"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    checked={questionValues[currentQues]?.ans === "yes"}
                    onChange={(elem) =>
                      postQuestionData(
                        questionValues[currentQues]?.id,
                        elem.target.value
                      )
                    }
                  />
                  <label
                    className="form-check-label fs-5"
                    htmlFor="flexRadioDefault1"
                  >
                    Yes
                  </label>
                </div>
                <div class="form-check">
                  <input
                    value="no"
                    class="form-check-input fs-5"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault2"
                    checked={questionValues[currentQues]?.ans === "no"}
                    onChange={(elem) =>
                      postQuestionData(
                        questionValues[currentQues]?.id,
                        elem.target.value
                      )
                    }
                  />
                  <label class="form-check-label fs-5" for="flexRadioDefault2">
                    No
                  </label>
                </div>
              </>
            )}
          </div>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-center align-items-center">
        <div className="row mob-res">
          <div className="col d-flex justify-content-center gap-4 ">
            <Button
              className="rounded"
              variant="dark"
              onClick={() =>
                setCurrentQues((prev) =>
                  prev !== questionValues.length - 1 ? prev + 1 : prev
                )
              }
              style={{
                display:
                  currentQues === questionValues.length - 1 ? "none" : "block",
              }}
            >
              Next
            </Button>
            {currentQues > 0 && (
              <Button
                className="rounded"
                variant="dark"
                onClick={() => setCurrentQues((prev) => prev - 1)}
              >
                Previous
              </Button>
            )}
          </div>
        </div>
        <div className="row ">
          <div className="col d-flex justify-content-center gap-4 flex-end">
            <Button
              variant="dark"
              className="rounded"
              onClick={handleQuestionSubmission}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default Budget;
