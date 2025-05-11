import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Radar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const technicalWords = [
  'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'C++', 'Java', 'Ruby', 'Docker', 'Kubernetes', 'AWS', 'Git', 'API', 'HTML', 'CSS',
];

const educationKeywords = ['B.E.', 'M.Tech', 'MBA', 'B.Tech', 'Computer Science', 'Engineering', 'Science'];
const experienceKeywords = ['internship', 'project', 'experience', 'developer', 'manager'];
const softSkillsKeywords = ['leadership', 'communication', 'teamwork', 'problem-solving', 'collaboration'];

const styles = {
  glassStyle: {
    margin: '50px auto',
    maxWidth: '1000px',
    padding: '30px',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    color: '#fff',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  section: {
    width: '100%',
    marginBottom: '20px',
  },
  headingStyle: {
    marginBottom: '20px',
    fontSize: '24px',
    textAlign: 'center',
  },
  ulStyle: {
    listStyleType: 'circle',
    paddingLeft: '20px',
  },
  linkStyle: {
    display: 'inline-block',
    marginTop: '30px',
    textDecoration: 'none',
    color: '#00ffff',
    fontWeight: 'bold',
    transition: 'color 0.3s',
  },
  chartContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap', // Allow charts to wrap on smaller screens
  },
  heatmapStyle: {
    flex: 1,
    minWidth: '300px',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(31, 38, 135, 0.3)',
  },
  chartStyle: {
    flex: 1,
    minWidth: '300px',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(31, 38, 135, 0.3)',
  },
  summaryCard: {
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(31, 38, 135, 0.3)',
    color: '#fff',
    minWidth: '300px',
    marginTop: '20px',
  },
  progressContainer: {
    marginBottom: '15px',
  },
  progressLabel: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  progressBarOuter: {
    width: '100%',
    height: '14px',
    backgroundColor: '#ddd',
    borderRadius: '7px',
    overflow: 'hidden',
  },
  progressBarInner: (value) => ({
    width: `${value}%`,
    height: '100%',
    backgroundColor: '#00ffff',
    transition: 'width 1s ease-in-out',
  }),
};

const filterKeywords = (keywords, categoryList) =>
  keywords.filter((kw) => categoryList.some((word) => kw.toLowerCase().includes(word.toLowerCase())));

const calculateMatchScore = (matched, total) =>
  total === 0 ? 0 : Math.min(100, Math.round((matched.length / total) * 100));

const ResultPage = ({ results }) => {
  const { id } = useParams();
  if (!id) return <p style={{ color: '#fff' }}>Invalid or missing ID in the URL.</p>;

  const resultIndex = parseInt(id, 10);
  if (!results || resultIndex < 0 || resultIndex >= results.length)
    return <p style={{ color: '#fff' }}>Result not found. Check if the ID is valid and results are loaded.</p>;

  const result = results[resultIndex];
  const keywords = result.topKeywords || [];
  const resumeTextLower = result.resumeText ? result.resumeText.toLowerCase() : '';

  // Filter matched keywords
  const techMatched = filterKeywords(keywords, technicalWords);
  const eduMatched = filterKeywords(keywords, educationKeywords);
  const expMatched = filterKeywords(keywords, experienceKeywords);
  const softMatched = filterKeywords(keywords, softSkillsKeywords);

  const educationScore = calculateMatchScore(eduMatched, educationKeywords);
  const experienceScore = calculateMatchScore(expMatched, experienceKeywords);
  const softSkillsScore = calculateMatchScore(softMatched, softSkillsKeywords);

  // Calculate "Skills Match" based on direct presence in resume text
  const skillsMatchedDirectly = technicalWords.filter((skill) => resumeTextLower.includes(skill.toLowerCase()));
  const skillsScoreDirect = calculateMatchScore(skillsMatchedDirectly, technicalWords);

  // First Radar Chart Data (based on top keywords)
  const radarDataTopKeywords = {
    labels: ['JavaScript', 'Python', 'React', 'Leadership', 'Teamwork', 'SQL'],
    datasets: [
      {
        label: `${result.resumeName} (Top Keywords)`,
        data: [
          keywords.includes('javascript') ? 100 : 0,
          keywords.includes('python') ? 100 : 0,
          keywords.includes('react') ? 100 : 0,
          keywords.includes('leadership') ? 100 : 0,
          keywords.includes('teamwork') ? 100 : 0,
          keywords.includes('sql') ? 100 : 0,
        ],
        backgroundColor: 'rgba(0, 255, 255, 0.2)',
        borderColor: '#00ffff',
        borderWidth: 2,
      },
    ],
  };

  // Second Radar Chart Data (presence of specific technical skills)
  const radarDataTechnicalSkills = {
    labels: technicalWords,
    datasets: [
      {
        label: `${result.resumeName} (Technical Skills)`,
        data: technicalWords.map((skill) => resumeTextLower.includes(skill.toLowerCase()) ? 100 : 0),
        backgroundColor: 'rgba(139, 0, 139, 0.2)', // Purple color
        borderColor: '#8B008B',
        borderWidth: 2,
      },
    ],
  };

  const heatmapData = {
    keywords: keywords.reduce((acc, keyword) => {
      acc[keyword] = (acc[keyword] || 0) + 1;
      return acc;
    }, {}),
  };

  return (
    <div style={styles.glassStyle}>
      <div style={styles.section}>
        <h2 style={styles.headingStyle}>Details for {result.resumeName}</h2>
      </div>

      <div style={styles.chartContainer}>
        <div style={styles.heatmapStyle}>
          <h3>Keyword Heatmap:</h3>
          {Object.entries(heatmapData.keywords).map(([keyword, count], idx) => (
            <div key={idx}>
              <strong>{keyword}:</strong> {count}
            </div>
          ))}
        </div>

        <div style={styles.chartStyle}>
          <h3>Radar Chart (Top Keyword Matching):</h3>
          <Radar data={radarDataTopKeywords} />
        </div>

        <div style={styles.chartStyle}>
          <h3>Radar Chart (Technical Skills Presence):</h3>
          <Radar data={radarDataTechnicalSkills} />
        </div>
      </div>

      {/* Match Summary Card */}
      <div style={styles.summaryCard}>
        <h3>Match Summary</h3>

        {/* Skills Match - Now correctly using skillsScoreDirect */}
        <div style={styles.progressContainer}>
          <div style={styles.progressLabel}>Skills Match (Presence)</div>
          <div style={styles.progressBarOuter}>
            <div style={styles.progressBarInner(skillsScoreDirect)} />
          </div>
        </div>

        {/* Education Match */}
        <div style={styles.progressContainer}>
          <div style={styles.progressLabel}>Education Match (Keywords)</div>
          <div style={styles.progressBarOuter}>
            <div style={styles.progressBarInner(educationScore)} />
          </div>
        </div>

        {/* Experience Match */}
        <div style={styles.progressContainer}>
          <div style={styles.progressLabel}>Experience Match (Keywords)</div>
          <div style={styles.progressBarOuter}>
            <div style={styles.progressBarInner(experienceScore)} />
          </div>
        </div>

        {/* Soft Skills Match */}
        <div style={styles.progressContainer}>
          <div style={styles.progressLabel}>Soft Skills Match (Keywords)</div>
          <div style={styles.progressBarOuter}>
            <div style={styles.progressBarInner(softSkillsScore)} />
          </div>
        </div>
      </div>

      {/* Back link */}
      <Link
        to="/results"
        style={styles.linkStyle}
        onMouseOver={(e) => (e.target.style.color = '#ffffff')}
        onMouseOut={(e) => (e.target.style.color = '#00ffff')}
      >
        ← Back to Results
      </Link>
    </div>
  );
};

export default ResultPage;