#!/bin/bash
cd server
source flsk/bin/activate
python3 app.py &
node index.js &
cd ../client
npm start