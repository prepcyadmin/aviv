import React, { useState } from 'react';

const ResumeUpload = ({ onFilesChange }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    onFilesChange(selectedFiles);
  };

  const containerStyle = {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '30px',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
  };

  const headingStyle = {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#ffffff',
    textShadow: '0 1px 3px rgba(0,0,0,0.4)',
  };

  const inputWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const uploadButtonStyle = {
    backgroundColor: '#007bff', // Professional blue color
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease-in-out',
    width: 'auto',
    display: 'inline-block',
    textAlign: 'center',
    margin: '0 auto',
  };

  const uploadButtonHoverStyle = {
    backgroundColor: '#0056b3', // Darker blue for hover
  };

  const fileNameStyle = {
    color: '#fff',
    fontSize: '14px',
    marginTop: '10px',
    textAlign: 'center',
  };

  const listStyle = {
    listStyleType: 'none',
    paddingLeft: 0,
    textAlign: 'center',
  };

  const itemStyle = {
    padding: '6px 0',
    fontSize: '16px',
    color: '#e0e0e0',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Upload Resumes</h2>
      <div style={inputWrapperStyle}>
        <label htmlFor="file-upload" style={uploadButtonStyle}>
          Choose Files
        </label>
        <input
          id="file-upload"
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }} // Hide the actual file input
        />
        {files.length > 0 && (
          <ul style={listStyle}>
            {files.map((file, index) => (
              <li key={index} style={itemStyle}>
                {file.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
