import React, { useState } from "react";
import BenefitStakeForm from "./components/BenefitStakeForm";
import ValidateGoalForm from "./components/ValidateGoalForm";
import ChoicePage from "./components/ChoicePage";

function App() {
  const [view, setView] = useState("choice");

  if (view === "start") return <BenefitStakeForm />;
  if (view === "validate") return <ValidateGoalForm />;
  return <ChoicePage onSelect={setView} />;
}

export default App;
