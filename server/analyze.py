import cv2
import base64
import os
import sys
import tempfile
import time
from dotenv import load_dotenv
from openai import OpenAI
import numpy as np
from PIL import Image
from io import BytesIO

def extract_frames(video_stream, spf=2):
    try:
        # Create a temporary file to save the video stream
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmpfile:
            tmpfile.write(video_stream.read())
            tmpfile_path = tmpfile.name

        video = cv2.VideoCapture(tmpfile_path)

        if not video.isOpened():
            raise ValueError("Could not open the video file")

        total_frames = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = video.get(cv2.CAP_PROP_FPS)
        next_frame = int(fps * spf)

        curr_frame = 0
        frames = []
        while curr_frame < total_frames - 1:
            video.set(cv2.CAP_PROP_POS_FRAMES, curr_frame)
            success, frame = video.read()
            if not success:
                break
            frames.append(frame)
            curr_frame += next_frame

        video.release()
        os.remove(tmpfile_path)
        return frames

    except Exception as e:
        print(f"An error occurred: {e}")
        return []

def analyze_frame(frame):
    # Encode the frame in its original color format
    _, buffer = cv2.imencode(".jpg", frame)
    frame_base64 = base64.b64encode(buffer).decode("utf-8")
    return frame_base64

def generate_summary(frames_analysis):
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", "<your OpenAI API key if not set as env var>"))
    # Create the prompt with all frames
    response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
    {"role": "system", "content": "You are generating hashtags for a TikTok video, generate 5 total"},
    {"role": "user", "content": [
        "These are the frames from the video.",
        *map(lambda x: {"type": "image_url",
                        "image_url": {"url": f'data:image/jpg;base64,{x}', "detail": "low"}}, frames_analysis)
        ],
    }
    ],
    temperature=0,
    )
    print(response.choices[0].message.content)

if __name__ == "__main__":
    try:
        load_dotenv()
        
        # Assuming video_stream is provided via stdin for this example
        video_stream = sys.stdin.buffer
        frames = extract_frames(video_stream)

        if frames:
            frames_analysis = [analyze_frame(frame) for frame in frames]
            summary = generate_summary(frames_analysis)
            print("Summary:", summary)
        else:
            print("No frames extracted from the video.")

    except Exception as e:
        print(f"An error occurred in the main block: {e}")