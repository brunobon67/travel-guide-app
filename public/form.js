import React, { useState } from "react";

const Form = ({ onSubmit }) => {
  const [preferences, setPreferences] = useState({
    destination: "",
    duration: "",
    groupSize: "",
    tripType: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tripType") {
      // Handle multiple selections for trip type
      const selectedOptions = [...e.target.options].filter(option => option.selected).map(option => option.value);
      setPreferences({ ...preferences, tripType: selectedOptions });
    } else {
      setPreferences({ ...preferences, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.formContainer}>
      <h2>Plan Your Trip ✈️</h2>
      <input type="text" name="destination" placeholder="Destination" value={preferences.destination} onChange={handleChange} required />
      <input type="number" name="duration" placeholder="Duration (days)" value={preferences.duration} onChange={handleChange} required />
      <input type="number" name="groupSize" placeholder="Group Size" value={preferences.groupSize} onChange={handleChange} required />

      <label>Select Trip Type:</label>
      <select name="tripType" multiple onChange={handleChange}>
        <option value="Adventure">Adventure</option>
        <option value="Cultural">Cultural</option>
        <option value="Relaxing">Relaxing</option>
        <option value="Nature">Nature</option>
        <option value="Family">Family</option>
      </select>

      <button type="submit">Get Travel Guide 📖</button>
    </form>
  );
};

// Inline styles
const styles = {
  formContainer: {
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    maxWidth: "400px",
    margin: "auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
};

export default Form;
