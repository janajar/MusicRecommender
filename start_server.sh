#!/bin/bash
cd server
python3 app.py &
node index.js &
cd ../client
npm start