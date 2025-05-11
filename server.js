const express = require("express");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const natural = require("natural");
const Fuse = require("fuse.js");
const cors = require("cors");
const stopword = require("stopword");

const app = express();
app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// --- Extract text from PDF ---
async function extractTextFromPDF(pdfBuffer) {
    try {
        const data = await pdfParse(pdfBuffer);
        const text = data.text.trim();
        return text.length > 0 ? text : null;
    } catch (error) {
        console.error("❌ PDF text extraction failed:", error);
        return null;
    }
}

// --- Preprocess text ---
function preprocessText(text) {
    const tokenizer = new natural.WordTokenizer();
    let tokens = tokenizer.tokenize(text.toLowerCase());
    tokens = stopword.removeStopwords(tokens);
    return tokens.map(word => natural.PorterStemmer.stem(word));
}

// --- Extract top keywords using TF-IDF ---
function getImportantKeywords(text, count = 20) {
    const tfidf = new natural.TfIdf();
    tfidf.addDocument(text);
    const terms = tfidf.listTerms(0);
    if (!terms.length) return ["no", "keywords", "found"];
    return terms.slice(0, count).map(term => term.term);
}

// --- Cosine similarity calculation ---
function cosineSimilarity(text1, text2) {
    if (!text1 || !text2) return 0;

    const words1 = preprocessText(text1);
    const words2 = preprocessText(text2);
    if (!words1.length || !words2.length) return 0;

    const allWords = Array.from(new Set([...words1, ...words2]));
    const vector1 = allWords.map(word => words1.filter(w => w === word).length);
    const vector2 = allWords.map(word => words2.filter(w => w === word).length);

    const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
    const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val ** 2, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val ** 2, 0));

    return magnitude1 && magnitude2 ? dotProduct / (magnitude1 * magnitude2) : 0;
}

// --- Fuzzy matching score ---
function fuzzyMatchScore(resumeKeywords, jobDescription) {
    if (!resumeKeywords || resumeKeywords.length === 0 || !jobDescription) return 0;

    const fuse = new Fuse(resumeKeywords, {
        includeScore: true,
        threshold: 0.3,
    });

    const matches = fuse.search(jobDescription);
    return (matches.length / resumeKeywords.length) * 100;
}

// --- Calculate base ATS score ---
function calculateATSScore(cosine, fuzzy) {
    const cosinePercent = cosine * 100;
    const score = (cosinePercent * 0.6) + (fuzzy * 0.4);
    return Math.round(score);
}

// --- Apply keyword and degree boost ---
function applyKeywordBoost(resumeText, baseScore) {
    const text = resumeText.toLowerCase();
    let boost = 0;

    const keywords = {
        programming: ["javascript", "python", "java", "c++", "typescript", "sql"],
        frameworks: ["react", "angular", "vue", "django", "spring", "express"],
        tools: ["docker", "git", "aws", "azure", "kubernetes", "jenkins"],
        degree: ["b.e", "btech", "bachelor of engineering", "computer science"]
    };

    Object.entries(keywords).forEach(([category, terms]) => {
        terms.forEach(term => {
            if (text.includes(term)) {
                if (category === "degree") {
                    boost += 8;
                } else {
                    boost += 5;
                }
            }
        });
    });

    return Math.min(baseScore + boost, 100); // Cap at 100
}

// --- Upload endpoint ---
app.post("/upload", async (req, res) => {
    try {
        if (!req.files || !req.files.resumes) {
            return res.status(400).send("No resumes uploaded.");
        }

        if (!req.body.jobDescription) {
            return res.status(400).send("Job description is missing.");
        }

        const resumes = Array.isArray(req.files.resumes) ? req.files.resumes : [req.files.resumes];
        const jobDescription = req.body.jobDescription;

        const results = [];

        for (let file of resumes) {
            const resumeText = await extractTextFromPDF(file.data);
            const resumeKeywords = getImportantKeywords(resumeText);
            const cosine = cosineSimilarity(resumeText, jobDescription);
            const fuzzyScore = fuzzyMatchScore(resumeKeywords, jobDescription);
            const rawATS = calculateATSScore(cosine, fuzzyScore);
            const boostedScore = applyKeywordBoost(resumeText, rawATS);

            // Create a keyword count for each resume
            const keywordsCount = {};
            resumeKeywords.forEach((keyword) => {
                keywordsCount[keyword] = (keywordsCount[keyword] || 0) + 1;
            });

            // Calculate skills
            const skills = {
                javascript: resumeText.includes('javascript') ? 1 : 0,
                python: resumeText.includes('python') ? 1 : 0,
                react: resumeText.includes('react') ? 1 : 0,
                teamwork: resumeText.includes('teamwork') ? 1 : 0,
                leadership: resumeText.includes('leadership') ? 1 : 0,
            };

            results.push({
                resumeName: file.name,
                matchPercentage: boostedScore,
                cosineSimilarity: (cosine * 100).toFixed(1),
                fuzzyKeywordScore: fuzzyScore.toFixed(1),
                topKeywords: resumeKeywords,
                keywordsCount, // Added
                skills, // Added
            });
        }

        results.sort((a, b) => b.matchPercentage - a.matchPercentage);
        res.json(results);
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).send("Error processing the request.");
    }
});

// --- Start server ---
app.listen(5000, () => {
    console.log("✅ ATS Scanner backend running on http://localhost:5000");
});
