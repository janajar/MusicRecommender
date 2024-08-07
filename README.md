# Song Recommendation for TikTok Videos

## Overview

This project aims to recommend songs for TikTok videos by leveraging the power of OpenAI and the TikTok API. It analyzes the content of a TikTok video to generate relevant hashtags using OpenAI, and then uses these hashtags to pull popular sounds from the TikTok platform. Additionally, the project scrapes the TikTok Creative Center to gather the most popular sounds on TikTok in general. The resulting recommendations are then displayed on the frontend.

## Features

- **Video Analysis with OpenAI**: Analyze the content of a TikTok video to generate relevant hashtags.
- **TikTok Sound Recommendations**: Use the [Unofficial TikTok API](https://github.com/davidteather/TikTok-Api) to pull popular sounds based on the generated hashtags.
- **User-friendly Frontend**: Display recommended sounds on an easy-to-use frontend interface.

## Setup Instructions

1. **Clone the Repository**:
    ```sh
    git clone <your-repository-url>
    cd <your-repository-name>
    ```

2. **Install Dependencies**:
    ```sh
    pip install -r requirements.txt
    ```

3. **Configure Environment Variables**:
    - Add your OpenAI API key to the `.env` file:
        ```
        OPENAI_API_KEY=your_openai_api_key
        ```

4. **Start the Server**:
    ```sh
    ./start_server.sh
    ```

## Usage

Once the server is running, you can interact with the application through the frontend. Upload a TikTok video, and the system will analyze it to generate hashtags and recommend popular sounds accordingly. Additionally, you can explore the most popular sounds on TikTok.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.

---

By following these instructions, you should be able to set up and run the song recommendation system for TikTok videos. If you encounter any issues or have questions, please open an issue on the repository. Enjoy your song recommendations!

## Additional Resources

Check our project on [Devpost](https://devpost.com/software/engagement-studio).

## Demonstration Video

Watch the video below to see a demonstration of the project:

[![Watch the video](https://img.youtube.com/vi/f_17y8BlOB8/0.jpg)](https://www.youtube.com/watch?v=f_17y8BlOB8)

