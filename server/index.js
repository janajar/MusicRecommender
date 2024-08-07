const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const FLASK_SERVER_URL = 'http://127.0.0.1:5000/recommend-music';

if (!OPENAI_API_KEY) {
    console.error('OpenAI API key is not set in environment variables.');
    process.exit(1);
}

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

app.post('/api/upload', upload.single('video'), async (req, res) => {
    if (!req.file) {
        console.log('No file uploaded.');
        return res.status(400).send('No file uploaded.');
    }

    try {
        console.log('File received:', req.file);

        // Call the Python script and pass the file buffer
        const scriptPath = path.join(__dirname, 'analyze.py');
        const pythonProcess = spawn('python3', [scriptPath]);

        // Send the file buffer to the Python script
        pythonProcess.stdin.write(req.file.buffer);
        pythonProcess.stdin.end();

        let output = '';
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error from Python script: ${data.toString()}`);
        });

        pythonProcess.on('close', async (code) => {
            if (code !== 0) {
                console.error('Python script exited with code:', code);
                return res.status(500).json({ message: 'Failed to analyze video' });
            }
            console.log('Python script output:', output);

            try {
                const response = await axios.post(FLASK_SERVER_URL, { hashtags: output });
                console.log('Response from Flask server:', response.data);
                res.json(response.data);
            } catch (error) {
                console.error('Error sending data to Flask server:', error.response ? error.response.data : error.message);
                res.status(500).json({ message: 'Failed to send data to Flask server', error: error.message });
            }
        });
    } catch (error) {
        console.error('Error processing video:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Failed to process video', error: error.message });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
