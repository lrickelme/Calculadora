import React from "react";
import Calculator from "../components/Calculator";

export default function CalculatorScreen() {
  const valueActive = "911+=";

  return <Calculator valueActive={valueActive} />;
}
