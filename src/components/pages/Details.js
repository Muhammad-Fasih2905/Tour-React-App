import React, { useState } from "react";
import { Button } from "../Button";
import { useNavigate } from "react-router-dom";

const Details = () => {
  const [logindata] = useState([]);

  const history = useNavigate();

  const userlogout = () => {
    localStorage.removeItem("user_login");
    localStorage.removeItem("skipModal");
    history("/");
  };

  return (
    <>
      {logindata.length === 0 ? (
        "errror"
      ) : (
        <>
          <h1>DETAILS OF USER:</h1>
          <h1>{logindata[0].name}</h1>
          <Button onClick={userlogout}>LogOut</Button>
        </>
      )}
    </>
  );
};

export default Details;
