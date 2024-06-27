const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path'); // Ensure path is imported
const axios = require('axios'); // Import axios for making HTTP requests
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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
            const frames = output.split('\n').filter(line => line.startsWith('data:image')).map(line => line.trim());

            // Combine frames into a single prompt for OpenAI analysis
            const combinedFramesPrompt = `Based on the following video frames, suggest 5 possible hashtags for a TikTok video:\n\n${frames.join('\n')}`;

            // Send combined prompt to OpenAI for analysis
            const hashtags = await analyzeVideoWithOpenAI(combinedFramesPrompt);

            res.json({ hashtags: hashtags });
        });
    } catch (error) {
        console.error('Error processing video:', error.response ? error.response.data : error.message);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Failed to process video', error: error.message });
        }
    }
});

const analyzeVideoWithOpenAI = async (prompt) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: prompt,
            max_tokens: 100,
            temperature: 0.5,
            n: 1,
            stop: null
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        const hashtags = response.data.choices[0].text.trim().split('\n').map(tag => tag.replace(/^#/, '').trim());
        return hashtags;
    } catch (error) {
        console.error('Error analyzing video with OpenAI:', error.message);
        return [];
    }
};

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
