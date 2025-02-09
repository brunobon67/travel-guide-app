import React, { useEffect, useState } from "react";

const SavedItineraries = () => {
  const [savedItineraries, setSavedItineraries] = useState([]);

  useEffect(() => {
    const storedItineraries = JSON.parse(localStorage.getItem("itineraries")) || [];
    setSavedItineraries(storedItineraries);
  }, []);

  const deleteItinerary = (index) => {
    const updatedItineraries = savedItineraries.filter((_, i) => i !== index);
    setSavedItineraries(updatedItineraries);
    localStorage.setItem("itineraries", JSON.stringify(updatedItineraries));
  };

  return (
    <div style={styles.container}>
      <h3>📂 Saved Itineraries</h3>
      {savedItineraries.length === 0 ? <p>No saved itineraries yet.</p> : null}

      {savedItineraries.map((itinerary, index) => (
        <div key={index} style={styles.itineraryBox}>
          <p><strong>📍 Destination:</strong> {itinerary.destination}</p>
          <p><strong>📅 Date Saved:</strong> {itinerary.date}</p>
          <p dangerouslySetInnerHTML={{ __html: itinerary.guide.replace(/\n/g, "<br>") }}></p>
          <button onClick={() => deleteItinerary(index)}>🗑 Delete</button>
        </div>
      ))}
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    marginTop: "20px",
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  itineraryBox: {
    backgroundColor: "#fff",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
  },
};

export default SavedItineraries;
