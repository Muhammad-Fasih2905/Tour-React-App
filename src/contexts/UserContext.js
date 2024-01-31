import React from "react";
import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [value, setValue] = useState({});
  const [purchasePackage, setPurchasePackage] = useState({});
  const [totalMembers, setTotalMembers] = useState(1);
  const [userId, setUserId] = useState("");
        
  return (
    <UserContext.Provider
      value={{
        value,
        setValue,
        purchasePackage,
        setPurchasePackage,
        totalMembers,
        setTotalMembers,
        userId,
        setUserId,
      }}
    >
      {" "}
      {props.children}{" "}
    </UserContext.Provider>
  );
};
