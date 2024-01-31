import React, { useContext, useEffect, useState } from "react";
// import '../../App.css';
// import Cards from '../Cards';
// import HeroSection from "../HeroSection";
// import Header from "../Header";
// import ProductImage from "../../assets/images/package-img.png";
import Airplane from "../../assets/images/airplane.png";
import Icon2 from "../../assets/images/img-2.png";
import Icon3 from "../../assets/images/img-3.png";
import { useNavigate } from "react-router-dom";
import {
  // Container,
  Card,
  Button,
  Modal,
  Form,
  // FloatingLabel,
} from "react-bootstrap";
import {
  collection,
  getDocs,
  query,
  addDoc,
  doc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
// import LoadingSpinner from "../LoadingSpinner";
import { Rating } from "react-simple-star-rating";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import ErrorAlert from "../ErrorAlert";
import { UserContext } from "../../contexts/UserContext";

const RecomPackages = ({ isRegion }) => {
  const userID = sessionStorage.getItem("user_id");
  const user_email = sessionStorage.getItem("user_email");
  const user_contact = sessionStorage.getItem("user_contact");
  const user_name = sessionStorage.getItem("user_name");
  const navigate = useNavigate();
  const { purchasePackage, setPurchasePackage, totalMembers, setTotalMembers } =
    useContext(UserContext);
  const [loader, setLoader] = useState(false);
  const [packages, setPackages] = useState([]);
  const [status, setStatus] = useState("Purchase");
  const [show, setShow] = useState(false);
  const [myPackages, setmyPackages] = useState([]);
  const [currentPackage, setCurrentPackage] = useState([]);
  const [values, setValues] = useState({
    image: "",
    title: "",
    price: "",
    description: "",
    departDate: "",
    returnDate: "",
    duration: "",
    review: "",
    totalAmount: "",
    facilities: [],
  });
  // const [totalMembers, setTotalMembers] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  // New States
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [queryShow, setQueryShow] = useState(false);
  const [customerQuery, setCustomerQuery] = useState("");
  // Signup States
  const [signup, setSignup] = useState(false);
  const [signUpValues, setSignUpValues] = useState({
    fullName: "",
    emailAddress: "",
    contactNo: "",
    password: "",
    confirmPassword: "",
  });

  const getPackages = async () => {
    setLoader(true);
    const q = query(collection(db, "packages"));
    const data = await getDocs(q);
    setPackages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    // Get USER PURCHASE REQUEST
    const purchase_query = query(
      collection(db, "user_purchase_packages"),
      where("user_id", "==", userID)
    );
    const purchase_data = await getDocs(purchase_query);
    setmyPackages(
      purchase_data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
    setLoader(false);
  };

  // console.log("user_puchase_packages===>", myPackages);
  // console.log("PACKAGES====>", packages);
  const handleClose = () => {
    setShow(false);
    setValues({
      image: "",
      title: "",
      description: "",
      departDate: "",
      returnDate: "",
      duration: "",
      price: "",
      review: "",
      totalAmount: "",
      facilities: [],
    });
  };

  const handleShow = async (e) => {
    // let check = myPackages.filter(f => f.package_id === e.id)
    // console.log("HANDLE SHOW  ===>", check);
    // console.log("E ==>", e)
    // if (check[0].isRequested) {
    //   setStatus('Pending')
    // } else if (check[0].isAccepted) {
    //   setStatus('Accepted')
    // } else if (check[0].isRejected) {
    //   setStatus('Rejected')
    // }
    console.log("SERVICES HANDLE SHOW===>", e);
    setShow(true);
    setValues({
      image: e.image,
      title: e.title,
      description: e.description,
      departDate: e.departDate,
      returnDate: e.returnDate,
      duration: e.tripDuration,
      price: e.price,
      facilities: e.facilities,
      // review: e.review,
      // totalAmount: e.total_amount
    });
    // setTotalMembers(1);
    setPurchasePackage(e);
    // setCurrentPackage(check[0])
  };

  const purchasePackageHandler = async () => {
    console.log("DATA==>", purchasePackage);
    if (totalMembers === 0 || totalMembers === "") {
      alert("Enter No. of Members");
      return;
    } else {
      await addDoc(collection(db, "user_purchase_packages"), {
        user_id: userID,
        user_email: user_email,
        user_contact: user_contact,
        package_id: purchasePackage.id,
        package_image: purchasePackage.image,
        package_title: purchasePackage.title,
        package_description: purchasePackage.description,
        package_facilities: purchasePackage.facilities,
        package_duration: purchasePackage.tripDuration,
        package_price: purchasePackage.price,
        total_members: totalMembers,
        total_amount: purchasePackage.price * totalMembers,
        isRequested: true,
        isAccepted: false,
        isRejected: false,
        review: "",
        rating: 0,
        users_rating: purchasePackage.users_rating,
        avg_rating: purchasePackage.avg_rating,
        dateTime: new Date().toLocaleString(),
      });
      alert("Package Purchase Successfully.");
      handleClose();
    }
  };

  // Rating Handle

  const handleRating = async (rate) => {
    console.log("===>", currentPackage.id);
    console.log(rate);
    setRating(rate);
    const myDoc = doc(db, "user_purchase_packages", currentPackage.id);
    const newFields = {
      rating: rate, // MODIFY
    };
    await updateDoc(myDoc, newFields);
  };

  const handleReview = async () => {
    if (review === "") {
      alert("Fill all the Fields.");
      return;
    } else {
      console.log("handleReview ===>", currentPackage.id);
      console.log("REVIEW ===>", review);
      const myDoc = doc(db, "user_purchase_packages", currentPackage.id);
      const newFields = {
        review: review, // MODIFY
      };
      await updateDoc(myDoc, newFields);
      alert("Review Submit Successfully.");
    }
  };

  // LOGIN

  const handleShowLogin = () => {
    handleClose();
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
    setEmail("");
    setPassword("");
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
        console.log("usersArr===>", usersArr);
        setUsers(usersArr);
        console.log("users STATE===>", users);
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
      setErrorMsg("Fill all fields");
      return;
    } else if (
      !signUpValues.emailAddress.includes("@") ||
      !signUpValues.emailAddress.includes(".")
    ) {
      setError(true);
      setErrorMsg("Invalid Email Address");
      return;
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

  const handleQuery = async () => {
    if (customerQuery === "") {
      alert("Fill all the Fields.");
      return;
    } else {
      try {
        await addDoc(collection(db, "queries"), {
          user_id: userID,
          user_email: user_email,
          user_contact: user_contact,
          package_id: purchasePackage.id,
          user_name: user_name,
          // package_image: purchasePackage.image,
          package_title: purchasePackage.title,
          customer_query: customerQuery,
          // package_description: purchasePackage.description,
          // package_facilities: purchasePackage.facilities,
          // package_duration: purchasePackage.tripDuration,
          // package_price: purchasePackage.price,
          // total_members: totalMembers,
          // total_amount: purchasePackage.price * totalMembers,
          // isRequested: true,
          // isAccepted: false,
          // isRejected: false,
          // review: "",
          // rating: 0,
          // users_rating: purchasePackage.users_rating,
          // avg_rating: purchasePackage.avg_rating,
          dateTime: new Date().toLocaleString(),
        });
        alert("Query Submit Successfully.");
        handleClose();
      } catch (error) {
        console.log("ERROR in HandleQuery===>", error);
      }
    }
  };

  const postSignUpData = (key, value) => {
    setSignUpValues((prev) => ({ ...prev, [key]: value }));
  };

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
    if (userID !== null && Object.keys(purchasePackage).length > 0) {
      purchasePackageHandler();
      setPurchasePackage({});
      setTotalMembers(1);
      console.log("PURCHASE PACKAGE RUN..");
    }
  }, [userID]);

  useEffect(() => {
    getPackages();
  }, []);
  return (
    <>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {packages
          .sort((a, b) => (b.avg_rating > a.avg_rating ? 1 : -1))
          .filter((e) => e.avg_rating > 0 || e.region == isRegion)
          .slice(0, 3)
          .map((e, i) => {
            return (
              <div className="col" key={i}>
                <div
                  className="card shadow mx-3 my-3"
                  style={{
                    border: "none",
                    borderRadius: 15,
                    backgroundColor: "rgba(131, 56, 236, 0.08)",
                    cursor: "pointer",
                    height: 480,
                  }}
                  onClick={() => handleShow(e)}
                >
                  <Card.Img
                    variant="top"
                    className="pt-3 px-3"
                    height={250}
                    src={e.image}
                    alt="cardImage"
                  />
                  <Card.Body>
                    <Card.Title className="text-capitalize">
                      {e.title}
                    </Card.Title>
                    <Card.Text
                      className="text-capitalize text-Elipsis"
                      style={{
                        height: 50,
                      }}
                    >
                      {e.description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <img
                          style={{
                            backgroundColor: "rgba(77, 45, 219, 0.518)",
                          }}
                          className="img-fluid p-1 rounded-circle mx-1"
                          alt="airplane"
                          src={Airplane}
                        />
                        <img
                          style={{
                            backgroundColor: "rgba(77, 45, 219, 0.518)",
                          }}
                          className="img-fluid px-2 py-1 rounded-circle mx-1"
                          alt="tea"
                          src={Icon3}
                        />
                        <img
                          style={{
                            backgroundColor: "rgba(77, 45, 219, 0.518)",
                          }}
                          className="img-fluid p-1 rounded-circle mx-1"
                          alt="breakfast"
                          src={Icon2}
                        />
                      </div>
                      <small className="text-dark">
                        Rs. {e.price.toLocaleString()} / Head
                      </small>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <p
                        className="pt-3"
                        style={{
                          color: "blue",
                          fontWeight: "normal",
                          fontSize: 13,
                        }}
                      >
                        {" "}
                        Trip Duration: {e.tripDuration} Days{" "}
                      </p>

                      <div className="d-flex justify-content-between align-items-center">
                        <Rating
                          allowFraction
                          size={20}
                          initialValue={e.avg_rating}
                          readonly
                        />
                      </div>
                    </div>
                    <small className="d-flex justify-content-end ps-1">
                      Rating: {e.avg_rating > 5 ? 5 : Math.floor(e.avg_rating)}
                      /5
                    </small>
                  </Card.Body>
                </div>
                <Modal show={show} onHide={handleClose} scrollable={true}>
                  <Modal.Header closeButton>
                    <Modal.Title>Package Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      <img
                        src={values.image}
                        alt="packageImg"
                        className="my-2 img-fluid"
                      />
                    </p>
                    <p>
                      {" "}
                      Package Name:{" "}
                      <span className="text-success text-capitalize">
                        {values.title}
                      </span>
                    </p>

                    <p> Package Facilities: {e.facilities.join(", ")}</p>
                    {/* <p> Depart Date: {values.departDate}</p>
                        <p> Return Date: {values.returnDate}</p> */}
                    <p> Trip Duration: {values.duration} Days</p>
                    <p>
                      {" "}
                      Per Head:{" "}
                      <span className="text-danger fw-bold">
                        {" "}
                        {values.price} RS{" "}
                      </span>{" "}
                    </p>
                    <p>
                      {" "}
                      Total Amount:{" "}
                      <span className="text-danger fw-bold">
                        {" "}
                        {values.price * totalMembers} RS{" "}
                      </span>{" "}
                    </p>
                    <p className="text-capitalize">
                      Package Description:{" "}
                      <pre className="text-success"> {values.description}</pre>
                    </p>
                    {queryShow && (
                      <>
                        <Form.Group controlId="exampleForm.ControlInput1">
                          <Form.Label>Query: </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter your Query"
                            value={customerQuery}
                            onChange={(e) => setCustomerQuery(e.target.value)}
                          />
                        </Form.Group>
                        <Button
                          variant="success"
                          size="sm"
                          className="mt-3"
                          onClick={() => handleQuery()}
                        >
                          Submit Query
                        </Button>
                      </>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    {status === "Purchase" ? (
                      <div className="d-flex flex-row w-100 justify-content-between">
                        <div>
                          <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Total Members: </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="No. of Members"
                              value={totalMembers}
                              onChange={(e) =>
                                setTotalMembers(
                                  e.target.value.replace(/\D/g, "")
                                )
                              }
                            />
                          </Form.Group>
                        </div>
                        <div>
                          <Button
                            variant="primary"
                            size="sm"
                            className="shadow-none mt-4"
                            style={{ height: 38 }}
                            onClick={
                              userID !== null
                                ? () => purchasePackageHandler()
                                : () => handleShowLogin()
                            }
                          >
                            {status}
                          </Button>
                          {userID && (
                            <Button
                              variant="secondary"
                              className="shadow-none mx-2 mt-4"
                              size="sm"
                              style={{ height: 38 }}
                              onClick={() => setQueryShow(!queryShow)}
                            >
                              Query
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </Modal.Footer>
                </Modal>
              </div>
            );
          })}
        {/*  Login Modal */}
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
                    className="text-dark pt-3 text-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => forgotPassHandler()}
                  >
                    Forget Password
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
                        postSignUpData("fullName", e.target.value.toLowerCase())
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
        <div className="w-100 d-flex justify-content-end">
          <Button
            size="sm"
            variant="primary"
            className="shadow-none me-3"
            style={{ width: "100px" }}
            onClick={() => navigate("/recommendedPackages")}
          >
            {" "}
            See All{" "}
          </Button>
        </div>
      </div>
    </>
  );
};

export default RecomPackages;
