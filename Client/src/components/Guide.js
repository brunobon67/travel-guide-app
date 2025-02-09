import React from "react";

const Guide = ({ guide }) => {
  if (!guide) return null;

  return (
    <div style={styles.container}>
      <h3>🌍 Your Travel Guide</h3>
      <div dangerouslySetInnerHTML={{ __html: guide.replace(/\n/g, "<br>") }} />
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    backgroundColor: "#fff",
    padding: "20px",
    marginTop: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
};

export default Guide;
