import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ResumeUpload from './components/ResumeUpload';
import JobDescription from './components/JobDescription';
import Result from './components/Result';
import ResultPage from './components/ResultPage';
import './App.css';

function UploadPage({ onSubmit }) {
  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!files.length || !jobDescription) {
      alert('Upload resumes and enter job description');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('resumes', file));
    formData.append('jobDescription', jobDescription);

    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    onSubmit(data);
    navigate('/results');
  };

  return (
    <div className="upload-container">
      <h1>Applicant Tracking System</h1>
      <div className="glass-card">
        <ResumeUpload onFilesChange={setFiles} />
        <JobDescription onJobDescriptionChange={setJobDescription} />
        <button
          onClick={handleSubmit}
          className="compare-btn"
        >
          Compare
        </button>
      </div>
    </div>
  );
}

function App() {
  const [results, setResults] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage onSubmit={setResults} />} />
        <Route path="/results" element={<Result results={results} />} />
        <Route path="/result/:id" element={<ResultPage results={results} />} />
      </Routes>
    </Router>
  );
}

export default App;
