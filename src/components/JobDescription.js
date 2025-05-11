import React, { useState } from 'react';

const JobDescription = ({ onJobDescriptionChange }) => {
  const [jobDescription, setJobDescription] = useState("");

  const handleChange = (e) => {
    setJobDescription(e.target.value);
    onJobDescriptionChange(e.target.value);
  };

  const containerStyle = {
    maxWidth: '400px', // Reduced max width for an even smaller card
    margin: '30px auto', // Center the container with some top/bottom space
    padding: '15px', // Reduced padding for a more compact card
    borderRadius: '12px', // Slightly smaller border radius for a tighter look
    background: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 6px 20px rgba(31, 38, 135, 0.2)', // Slightly smaller shadow for a compact look
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const headingStyle = {
    fontSize: '18px', // Even smaller font size for the heading
    marginBottom: '12px', // Reduced margin for a more compact look
    textAlign: 'center',
    color: '#ffffff',
    textShadow: '0 1px 3px rgba(0,0,0,0.4)',
  };

  const textareaStyle = {
    width: '100%',
    height: '120px', // Reduced height for the textarea
    padding: '10px', // Reduced padding for a more compact input field
    fontSize: '14px', // Smaller font size
    borderRadius: '8px', // Reduced border radius for a tighter design
    border: 'none',
    resize: 'vertical',
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)', // Slightly smaller shadow
    outline: 'none',
    backdropFilter: 'blur(5px)',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Job Description</h2>
      <textarea
        placeholder="Paste Job Description Here"
        value={jobDescription}
        onChange={handleChange}
        style={textareaStyle}
      />
    </div>
  );
};

export default JobDescription;
