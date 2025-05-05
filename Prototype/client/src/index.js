// Importing React library for building user interfaces
import React from "react";

// Importing ReactDOM for rendering React components to the DOM
import ReactDOM from "react-dom/client";

// Importing the main App component, which serves as the root component of the application
import App from "./App";

// Creating a root DOM node where the React application will be mounted
const root = ReactDOM.createRoot(document.getElementById("root"));

// Rendering the App component inside the root DOM node
root.render(
  <React.StrictMode>
    {/* React.StrictMode is a wrapper that helps identify potential problems in an application */}
    <App /> {/* The main application component */}
  </React.StrictMode>
);
