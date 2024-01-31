import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../firebase";
import {
  Button,
  Container,
  Nav,
  Navbar,
  Modal,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import LoadingSpinner from "./LoadingSpinner";
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
import CompanyLogo from "../assets/images/company-logo.png";
import { NavDropdown } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import ErrorAlert from "./ErrorAlert";
import { UserContext } from "../contexts/UserContext";
import ModalQuestion from "./ModalQuestion";

function Header() {
  const navigate = useNavigate();
  const { value, setValue } = useContext(UserContext);
  const userID = sessionStorage.getItem("user_id");
  const user_email = sessionStorage.getItem("user_email");
  const user_contact = sessionStorage.getItem("user_contact");
  const user_name = sessionStorage.getItem("user_name");
  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  // Signup States
  const [signup, setSignup] = useState(false);
  const [signUpValues, setSignUpValues] = useState({
    fullName: "",
    emailAddress: "",
    contactNo: "",
    password: "",
    confirmPassword: "",
  });

  const handleCustomPackage = async () => {
    // console.log("VALUES===>", value);
    try {
      if (
        value.address === "" ||
        value.departCity === "" ||
        value.destination === "" ||
        value.members === "" ||
        value.departDate === "" ||
        value.returnDate === "" ||
        value.travelVia === ""
      ) {
        alert("Fill all the Fields");
      } else {
        await addDoc(collection(db, "customerQueries"), {
          isRequested: true,
          isAccepted: false,
          isRejected: false,
          user_id: userID,
          price: Number(value.price),
          user_name: user_name,
          phoneNumber: user_contact,
          email: user_email,
          address: value.address,
          departCity: value.departCity,
          destination: value.destination,
          tripDuration: Number(value.tripDuration),
          members: Number(value.members),
          departDate: value.departDate,
          returnDate: value.returnDate,
          travelVia: value.travelVia,
          otherInform: value?.otherInform ? value?.otherInform : "",
          created_At: new Date().toLocaleString(),
        });
        alert("Your Custom Package Request Has been Sent to Our Team.");
      }
    } catch (error) {
      console.log(error);
    }

    handleClose();
  };

  const postUserData = (key, value) => {
    setValue((prev) => ({ ...prev, [key]: value }));
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleShowLogin = () => {
    handleClose();
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
    setSignup(false);
    setEmail("");
    setPassword("");
  };

  const logoutHandler = () => {
    setLoader(true);
    signOut(auth);
    sessionStorage.clear();
    // setTimeout(() => {
    // window.location.reload();
    localStorage.removeItem("skipModal");
    navigate("/", { replace: true });
    // }, 500);
    setLoader(false);
  };

  const handleUserLogin = async () => {
    try {
      if (email === "" || password === "") {
        setError(true);
        setErrorMsg("Fill all the Fields");
      } else {
        setLoader(true);
        setError(false);
        const response = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const uuid = response.user.uid;
        console.log("LOGIN HANDLER RESPONSE===>", response.user);
        const q = query(collection(db, "users"), where("role", "==", "user"));
        const querySnapshot = await getDocs(q);
        const usersArr = [];
        querySnapshot.forEach((doc) => {
          usersArr.push(doc.data());
        });
        // console.log("usersArr===>", usersArr);
        setUsers(usersArr);
        // console.log("users STATE===>", users);
        const isFound = usersArr.find((e) => {
          if (e.user_id === uuid) {
            return true;
          }
          return false;
        });
        console.log("isFound Says ===>", isFound);
        if (isFound !== undefined) {
          sessionStorage.setItem("user_id", response.user.uid);
          sessionStorage.setItem("user_email", response.user.email);
          sessionStorage.setItem("user_name", response.user.displayName);
          sessionStorage.setItem("user_contact", isFound.user_contact);
          sessionStorage.setItem(
            "user_message",
            "Please wait one of our agent will reply you shortly."
          );
          console.log("MODAL ===> LOGIN SUCCESS.");
        } else {
          setError(true);
          setErrorMsg("Invalid Credentials");
        }
        setEmail("");
        setPassword("");
        setLoader(false);
        handleCloseLogin();
      }
    } catch (error) {
      setLoader(true);
      setError(true);
      setErrorMsg(error.code);
      console.log("ERROR in Login Handler ===>", error);
      setLoader(false);
    }
  };

  const postSignUpData = (key, value) => {
    setSignUpValues((prev) => ({ ...prev, [key]: value }));
  };

  // SIGNUP HANDLER

  let passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^_&|*])[a-zA-Z0-9!@#$%^_&*]{7,15}$/;

  const handleSubmission = () => {
    if (
      !signUpValues.fullName ||
      !signUpValues.emailAddress ||
      !signUpValues.password ||
      !signUpValues.contactNo ||
      !signUpValues.confirmPassword
    ) {
      setError(true);
      setErrorMsg("Fill all the fields");
      return;
    } else if (
      !signUpValues.emailAddress.includes("@") ||
      !signUpValues.emailAddress.includes(".")
    ) {
      setError(true);
      setErrorMsg("Invalid Email Address");
    } else if (signUpValues.contactNo.length !== 11) {
      setError(true);
      setErrorMsg("Phone Number must be 11 digits");
      return;
    } else if (!signUpValues.password.match(passwordRegex)) {
      setError(true);
      setErrorMsg(
        `Password should be atleast 8-15 characters long and should contain letters numbers and special character`
      );
      return;
    } else if (signUpValues.password !== signUpValues.confirmPassword) {
      setError(true);
      setErrorMsg("Password and Confirm Password does not match.");
      return;
    } else {
      setError(false);
      setErrorMsg("");
      setLoader(true);

      createUserWithEmailAndPassword(
        auth,
        signUpValues.emailAddress,
        signUpValues.password
      )
        .then(async (res) => {
          setLoader(true);
          const user = res.user;
          console.log("SIGNUP USER===>", user);
          await addDoc(collection(db, "users"), {
            user_id: user.uid,
            user_name: signUpValues.fullName,
            user_email: signUpValues.emailAddress,
            user_contact: signUpValues.contactNo,

            role: "user",
          });
          await updateProfile(user, {
            displayName: signUpValues.fullName,
          });
          localStorage.setItem("newsignup", JSON.stringify(true));
          // setIsNewSignup(true);
          sessionStorage.setItem("user_id", user.uid);
          sessionStorage.setItem("user_email", user.email);
          sessionStorage.setItem("user_name", user.displayName);
          sessionStorage.setItem("user_contact", signUpValues.contactNo);
          sessionStorage.setItem(
            "user_message",
            "Please wait one of our agent will reply you shortly."
          );
          setLoader(false);

          handleCloseLogin();
        })
        .catch((err) => {
          setLoader(true);
          setError(true);
          setErrorMsg(err.message);
          console.log(err);
          setLoader(false);
        });
      setLoader(false);
    }
  };

  // Forgot Password Handler
  const forgotPassHandler = () => {
    if (email === "") {
      setError(true);
      setErrorMsg("Please Enter Email Address.");
    } else {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          setError(true);
          setErrorMsg("Please check your Email for Reset Password.");
          setTimeout(() => {
            navigate("/forgotPass");
          }, 5000);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error.code);
          setError(true);
          setErrorMsg(errorCode);
        });
    }
  };

  useEffect(() => {
    if (userID !== null && Object.keys(value).length > 0) {
      handleCustomPackage();
      setValue({});
      console.log("CutomPackage UseEFFECT RUN");
    }
  }, [userID]);

  const [isCompleted, setIsCompleted] = useState(false);
  const [isNewSignup, setIsNewSignup] = useState(false);
  const [getQues, setGetQues] = useState([]);
  // async function getQuestions() {
  //   try {
  //     const querySnapshot = await getDocs(
  //       query(collection(db, "question"), where("user_id", "==", userID))
  //     );

  //     if (!querySnapshot.empty) {
  //       const docSnapshot = querySnapshot.docs[0];
  //       const questions = docSnapshot.data();
  //       console.log("QUESTIONS===>", questions);
  //       setGetQues(questions.questions);
  //       setIsCompleted(questions.isCompleted);
  //     } else {
  //       console.log("Document not found.");
  //       // Handle the case when the document doesn't exist
  //     }
  //   } catch (error) {
  //     console.log(
  //       "Getting error while fetching questions from the database! ",
  //       error
  //     );
  //   }
  // }
  async function getQuestions() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "question"), where("user_id", "==", userID))
      );

      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        const questions = docSnapshot.data();
        console.log("QUESTIONS===>", questions);
        setGetQues(questions.questions);
        setIsCompleted(questions.isCompleted);
      } else {
        console.log("Document not found.");
        setIsCompleted(false); // Set isCompleted to false when the document doesn't exist
        setIsNewSignup(false);
      }
    } catch (error) {
      console.log("Error while fetching questions from the database: ", error);
    }
  }

  useEffect(() => {
    if (userID) {
      getQuestions();
    }
  }, [userID]);

  let localValue = localStorage.getItem("skipModal") || false;

  return (
    <>
      {loader ? (
        <LoadingSpinner />
      ) : (
        <>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
              <Navbar.Brand
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
              >
                <img
                  alt="companyLogo"
                  src={CompanyLogo}
                  width="30"
                  height="30"
                  className="d-inline-block align-top mx-2"
                />
                Great Expeditions
              </Navbar.Brand>
              <Navbar.Toggle
                aria-controls="responsive-navbar-nav"
                className="shadow-none border-0"
              />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ms-auto text-center">
                  <Button
                    variant="outline-light"
                    className="mt-1 mx-2 rounded-4 shadow-none"
                    onClick={() => navigate("/")}
                  >
                    Home
                  </Button>
                  <Button
                    variant="outline-light"
                    className="mt-1 mx-2 rounded-4 shadow-none"
                    onClick={() => navigate("/recommendedPackages")}
                  >
                    Recommended
                  </Button>
                  <Button
                    variant="outline-light"
                    className="mt-1 mx-2 rounded-4 shadow-none"
                    onClick={() => navigate("/services")}
                  >
                    Services
                  </Button>
                  <Button
                    variant="outline-light"
                    className="mt-1 mx-2 rounded-4 shadow-none"
                    onClick={() => navigate("/comments")}
                  >
                    Comments
                  </Button>

                  {userID !== null ? (
                    <Button
                      variant="outline-light"
                      className="mt-1 mx-2 rounded-4 shadow-none"
                      onClick={() => navigate("/products")}
                    >
                      My Packages
                    </Button>
                  ) : null}
                  {/* {userID !== null ? (
                    <Button
                      variant="outline-light"
                      className="mt-1 mx-2 rounded-4 shadow-none"
                      onClick={() => navigate("/budget")}
                    >
                      Budget
                    </Button>
                  ) : null} */}
                  {
                    <Button
                      variant="light"
                      className="mt-1 mx-2 rounded-4 shadow-none"
                      onClick={() => handleShow()}
                    >
                      Customized Package <i className="fa fa-plus-circle" />
                    </Button>
                  }
                </Nav>
                <Nav className="ms-auto text-center text-capitalize">
                  {userID !== null ? (
                    <NavDropdown title={user_name} id="nav-dropdown">
                      <NavDropdown.Item
                        eventKey="4.1"
                        className="d-flex justify-content-center"
                      >
                        <Button
                          variant="danger"
                          className="shadow-none"
                          onClick={() => logoutHandler()}
                        >
                          Logout
                        </Button>
                      </NavDropdown.Item>
                    </NavDropdown>
                  ) : (
                    <>
                      <Nav.Link>
                        <Button
                          variant="light"
                          className="border border-light shadow-none"
                          onClick={() => handleShowLogin()}
                        >
                          Login
                        </Button>
                      </Nav.Link>
                    </>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Modal show={show} onHide={handleClose} scrollable={true}>
            <Modal.Header closeButton>
              <Modal.Title>Customized Your Own Package</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Row className="mb-3">
                <h5 className="py-3">Address Information:- </h5>
                <Form.Group as={Col} md="12">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Address"
                    onChange={(e) =>
                      postUserData("address", e.target.value.toLowerCase())
                    }
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <h5 className="py-3"> Trip Details:- </h5>
                <Form.Group as={Col} md="6">
                  <Form.Label>Departure City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Departure City"
                    onChange={(e) =>
                      postUserData("departCity", e.target.value.toLowerCase())
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Destination</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Destination"
                    onChange={(e) =>
                      postUserData("destination", e.target.value.toLowerCase())
                    }
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="12">
                  <Form.Label>Trip Duration</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Trip Duration"
                    onChange={(e) =>
                      postUserData("tripDuration", e.target.value)
                    }
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="12">
                  <Form.Label>Members</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Total Members"
                    onChange={(e) => postUserData("members", e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="12">
                  <Form.Label>Departure Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Departure Date"
                    onChange={(e) => postUserData("departDate", e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="12">
                  <Form.Label>Return Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Return Date"
                    onChange={(e) => postUserData("returnDate", e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <h5 className="py-3"> Transport Details:- </h5>
                <Form.Group as={Col} md="12">
                  <Form.Label>Travel Via</Form.Label>
                  <Multiselect
                    placeholder="Select Travel"
                    isObject={false}
                    onRemove={(e) => console.log(e)}
                    onSelect={(e) => postUserData("travelVia", e)}
                    options={["Bus", "Plane", "Train"]}
                    showCheckbox
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <h5 className="py-3"> Price:- </h5>
                <Form.Group as={Col} md="12">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Quote your price"
                    onChange={(e) => postUserData("price", e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <h5 className="py-3"> Other Information:- </h5>
                <Form.Group as={Col} md="12">
                  <Form.Label>Other Inform.</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Additional Information"
                    onChange={(e) =>
                      postUserData("otherInform", e.target.value.toLowerCase())
                    }
                  />
                </Form.Group>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  userID !== null ? handleCustomPackage() : handleShowLogin();
                }}
              >
                Customized Package
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Login Modal */}
          <Modal show={showLogin} onHide={handleCloseLogin}>
            <Modal.Header closeButton>
              <Modal.Title>{signup ? "Signup" : "Login"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error ? (
                <>
                  <ErrorAlert errorMessage={errorMsg} />
                </>
              ) : null}
              <Form>
                {!signup && (
                  <>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        placeholder="name@example.com"
                        // autoFocus
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Group>
                    {!signup && (
                      <>
                        <Button
                          variant="success"
                          className="w-100"
                          onClick={() => handleUserLogin()}
                        >
                          Login
                        </Button>
                      </>
                    )}

                    <p
                      className="pt-3 text-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => forgotPassHandler()}
                    >
                      Forgot Password?
                    </p>

                    <p className="text-center my-3">Don't have an account?</p>

                    <Button
                      variant="primary"
                      className="w-100 "
                      onClick={() => setSignup(true)}
                    >
                      Create an Account
                    </Button>
                  </>
                )}
                {signup && (
                  <>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={signUpValues.fullName}
                        placeholder="Full Name"
                        autoFocus
                        onChange={(e) =>
                          postSignUpData(
                            "fullName",
                            e.target.value.toLowerCase()
                          )
                        }
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        value={signUpValues.emailAddress}
                        placeholder="name@example.com"
                        // autoFocus
                        onChange={(e) =>
                          postSignUpData(
                            "emailAddress",
                            e.target.value.toLowerCase()
                          )
                        }
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Contact No.</Form.Label>
                      <Form.Control
                        type="text"
                        value={signUpValues.contactNo}
                        placeholder="Contact No."
                        onChange={(e) =>
                          postSignUpData(
                            "contactNo",
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                      />
                    </Form.Group>

                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={signUpValues.password}
                        placeholder="Password"
                        onChange={(e) =>
                          postSignUpData("password", e.target.value)
                        }
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={signUpValues.confirmPassword}
                        placeholder="Confirm Password"
                        onChange={(e) =>
                          postSignUpData("confirmPassword", e.target.value)
                        }
                      />
                    </Form.Group>

                    {signup && (
                      <Button
                        variant="success"
                        className="w-100"
                        onClick={() => handleSubmission()}
                      >
                        Create Account
                      </Button>
                    )}
                    <p className="text-center my-3">Already have an account?</p>
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={() => setSignup(false)}
                    >
                      Login
                    </Button>
                  </>
                )}
              </Form>
            </Modal.Body>
          </Modal>

          {userID && !isCompleted && (
            <ModalQuestion
              isNewSignup={localValue ? false : !isCompleted}
              setIsNewSignup={setIsCompleted}
              isCompleted={isCompleted}
              setIsCompleted={setIsCompleted}
            />
          )}
        </>
      )}
    </>
  );
}

export default Header;
