import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { UserProvider } from "./contexts/UserContext";

// Kommunicate.init("c649afb5419746cbabaef12843bf891c", {
//     popupWidget: true,
//     automaticChatOpenOnNavigation: false,
//     preLeadCollection: [
//         {
//             field: 'Name', // Name of the field you want to add
//             required: true, // Set 'true' to make it a mandatory field
//             placeholder: 'Enter your Name' // add whatever text you want to show in the placeholder
//         },
//         {
//             field: 'Email',
//             type: 'email',
//             required: true,
//             placeholder: "Enter your email"
//         },
//         {
//             field: 'Phone',
//             type: 'number',
//             required: true,
//             element: 'input', // Optional field (Possible values: textarea or input)
//             placeholder: "Enter your phone number"
//         },
//     ]
// })

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
    {/* <Provider store={store}> */}
    {/* </Provider> */}
  </React.StrictMode>,
  document.getElementById("root")
);
