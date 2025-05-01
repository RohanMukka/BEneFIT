import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BenefitStakeForm from "./components/BenefitStakeForm";
import ValidateGoalForm from "./components/ValidateGoalForm";
import ChoicePage from "./components/ChoicePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChoicePage />} />
        <Route path="/stake" element={<BenefitStakeForm />} />
        <Route path="/validate" element={<ValidateGoalForm />} />
      </Routes>
    </Router>
  );
}

export default App;