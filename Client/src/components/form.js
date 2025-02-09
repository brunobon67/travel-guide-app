import React, { useState } from "react";

const Form = ({ onSubmit }) => {
  const [preferences, setPreferences] = useState({
    destination: "",
    duration: "",
    groupSize: "",
    tripType: "Adventure"
  });

  const handleChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="destination" placeholder="Where to?" onChange={handleChange} required />
      <input type="number" name="duration" placeholder="How many days?" onChange={handleChange} required />
      <input type="number" name="groupSize" placeholder="Number of people?" onChange={handleChange} required />
      <select name="tripType" onChange={handleChange}>
        <option value="Adventure">Adventure</option>
        <option value="Cultural">Cultural</option>
        <option value="Relaxing">Relaxing</option>
      </select>
      <button type="submit">Get My Travel Guide</button>
    </form>
  );
};

export default Form;
