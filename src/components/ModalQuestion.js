import React, { useState, useEffect, useContext } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
// import Budget from "./pages/Budget";

const ModalQuestion = (props) => {
  const { isNewSignup, setIsNewSignup, isCompleted, setIsCompleted } = props;

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loader, setLoader] = useState(false);
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

  // const postQuestionData = (id, value) => {
  //   console.log("ID ===>", id, value);

  //   let update = questionValues.map((e) =>
  //     e.id === id ? { ...e, ans: value } : e
  //   );

  //   setQuestionValues(update);
  // };
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
  // console.log("questionValues ===> ", questionValues);

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
      setIsNewSignup(false);
      setIsCompleted(true);
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
      setIsNewSignup(false);
      setIsCompleted(false);
      setLoader(false);
      return;
    }
    addDoc(questionRef, questionData)
      .then(() => {
        alert("Answer has been submitted");
        setIsNewSignup(false);
        setIsCompleted(true);
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

  const handleSkip = () => {
    setIsNewSignup(false);
    setIsCompleted(true);
    localStorage.setItem("skipModal", true);
  };

  return (
    <Modal
      show={isNewSignup}
      // onHide={ModalClose}
      onHide={() => {
        setIsNewSignup(false);
        setIsCompleted(true);
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
            {/* <Button
              variant="dark"
              className="rounded"
              onClick={() => {
                localStorage.removeItem("newsignup");
                handleQuestionSubmission();
              }}
            >
              Save
            </Button> */}
            <Button
              variant="dark"
              className="rounded"
              onClick={handleQuestionSubmission}
            >
              Save
            </Button>
            <Button variant="dark" className="rounded" onClick={handleSkip}>
              Skip
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalQuestion;
