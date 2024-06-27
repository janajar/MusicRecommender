from IPython.display import display, Image, Audio
import cv2  # We're using OpenCV to read video, to install !pip install opencv-python
import base64
import os
import sys
import numpy as np
import tempfile

def analyze_video(video_stream):
    try:
        # Create a temporary file to save the video stream
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmpfile:
            tmpfile.write(video_stream.read())
            tmpfile_path = tmpfile.name

        video = cv2.VideoCapture(tmpfile_path)

        if not video.isOpened():
            raise ValueError("Could not open the video file")

        base64Frames = []
        while video.isOpened():
            success, frame = video.read()
            if not success:
                break
            _, buffer = cv2.imencode(".jpg", frame)
            base64Frames.append(base64.b64encode(buffer).decode("utf-8"))

        video.release()
        os.remove(tmpfile_path)
        return base64Frames

    except Exception as e:
        print(f"An error occurred: {e}")
        return []

if __name__ == "__main__":
    try:
        video_stream = sys.stdin.buffer
        frames = analyze_video(video_stream)
        for frame in frames:
            print(f"data:image/jpeg;base64,{frame}")
    except Exception as e:
        print(f"An error occurred in the main block: {e}")
