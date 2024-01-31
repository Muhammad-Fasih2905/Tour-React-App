import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProtectedRoutes = (props) => {
  const { Component } = props;
  const navigate = useNavigate();
  const userID = sessionStorage.getItem("user_id");

  useEffect(() => {
    if (!userID) {
      navigate("/login");
    }
  }, [userID, navigate]);

  return (
    <>
      <Component />
    </>
  );
};

export default UserProtectedRoutes;
