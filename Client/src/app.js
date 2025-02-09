import React, { useState } from "react";
import Form from "./components/Form";
import Guide from "./components/Guide";
import SavedItineraries from "./components/SavedItineraries";

const App = () => {
  const [guide, setGuide] = useState("");

  const fetchTravelGuide = async (preferences) => {
    const response = await fetch("http://localhost:3001/get-travel-guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences }),
    });

    const data = await response.json();
    setGuide(data.guide);

    // Save guide to localStorage
    const savedItineraries = JSON.parse(localStorage.getItem("itineraries")) || [];
    savedItineraries.push({ destination: preferences.destination, guide: data.guide, date: new Date().toLocaleDateString() });
    localStorage.setItem("itineraries", JSON.stringify(savedItineraries));
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Accento Italiano - Travel Guide 🌍</h1>
      <Form onSubmit={fetchTravelGuide} />
      <Guide guide={guide} />
      <SavedItineraries />
    </div>
  );
};

export default App;
