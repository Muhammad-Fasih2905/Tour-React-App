import React from "react";
import "./App.css";
import Home from "./components/pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Services from "./components/pages/Services";
import Products from "./components/pages/Products";
import SignUp from "./components/pages/SignUp";
import Login from "./components/pages/Login";
import ForgetPassword from "./components/pages/ForgetPassword";
import Details from "./components/pages/Details";
import CustomizedPackage from "./components/pages/CustomizedPackage";
import AdminLogin from "./components/pages/AdminLogin";
import AdminPanel from "./components/pages/AdminPanel";
import CurrentPackages from "./components/pages/CurrentPackages";
import Reviews from "./components/pages/Reviews";
import CreateNewPackage from "./components/pages/CreateNewPackage";
import CustomerQueries from "./components/pages/CustomerQueries";
import RecommendedPackage from "./components/pages/RecommendedPackage";
import UserProtectedRoutes from "./UserProtectedRoutes";
import AdminChat from "./components/pages/AdminChat";
import ChatMiddle from "./components/pages/ChatMiddle";
import ForgotPass from "./components/pages/ForgotPassword";
import Comments from "./components/Comments";
// import Budget from "./components/pages/Budget";

const AppRouter = () => {
  const userID = sessionStorage.getItem("user_id");
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route
            path="/products"
            element={<UserProtectedRoutes Component={Products} />}
          />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/details" element={<Details />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/customizedpackage" element={<CustomizedPackage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/adminpanel" element={<AdminPanel />} />
          <Route path="/currentpackages" element={<CurrentPackages />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/createnewpackage" element={<CreateNewPackage />} />
          <Route path="/customerqueries" element={<CustomerQueries />} />
          <Route path="/chat" element={<AdminChat />} />
          <Route path="/forgotPass" element={<ForgotPass />} />
          <Route path="/recommendedPackages" element={<RecommendedPackage />} />
          <Route path="/comments" element={<Comments />} />
          {/* <Route path="/budget" element={<Budget />} /> */}
        </Routes>
      </Router>
    </>
  );
};

export default AppRouter;
