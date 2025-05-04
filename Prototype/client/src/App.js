// Importing React for building the component
import React from "react";

// Importing React Router components for routing
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importing the individual components for different pages
import BenefitStakeForm from "./components/BenefitStakeForm"; // Component for staking ETH and setting fitness goals
import ValidateGoalForm from "./components/ValidateGoalForm"; // Component for validating fitness goals
import ChoicePage from "./components/ChoicePage"; // Component for the main choice page

// Main App component that defines the routing structure
function App() {
  return (
    <Router>
      {/* Routes define the navigation paths and their corresponding components */}
      <Routes>
        {/* Route for the home page, which displays the ChoicePage component */}
        <Route path="/" element={<ChoicePage />} />

        {/* Route for the staking page, which displays the BenefitStakeForm component */}
        <Route path="/stake" element={<BenefitStakeForm />} />

        {/* Route for the validation page, which displays the ValidateGoalForm component */}
        <Route path="/validate" element={<ValidateGoalForm />} />
      </Routes>
    </Router>
  );
}

// Exporting the App component as the default export
export default App;
