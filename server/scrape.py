from TikTokApi import TikTokApi
from math import log
import asyncio
from aiohttp import ClientSession

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

def personalized_recommendations(hashtags):
    recommendations = []
    ms_token = asyncio.run(get_ms_token())
    for hashtag in hashtags:
        results = asyncio.run(hashtag_videos(hashtag, ms_token))
        recommendations.extend(results)

    recommendations = sorted(recommendations, key=popularity_score)
    sounds = []
    for recommendation in recommendations:
        if hasattr(recommendation.sound, 'play_url'):
            author = recommendation.author.username if not hasattr(recommendation.sound, 'author') else recommendation.sound.author
            sounds.append({"title":recommendation.sound.title, "author":author, "url":recommendation.sound.play_url})

        if len(sounds) == 10:
            break
    return sounds

async def get_ms_token():
    async with ClientSession() as session:
        async with session.get("https://www.tiktok.com/") as response:
            cookies = response.cookies
            ms_token = cookies.get('msToken') if 'msToken' in cookies else None
            return ms_token

async def hashtag_videos(hashtag, ms_token):
    async with TikTokApi() as api:
        await api.create_sessions(ms_tokens=[ms_token], num_sessions=1, sleep_after=3, headless = False)
        tag = api.hashtag(name=hashtag)
        videos = []
        async for video in tag.videos(count=30):
            videos.append(video)
        return videos 

def popularity_score(video):
    score = 0.35 * log(video.stats["playCount"] + 1) 
    + 0.25 * log(video.stats["diggCount"] + 1)
    + 0.20 * log(video.stats["shareCount"] + 1) 
    + 0.15 * log(video.stats["commentCount"] + 1)
    + 0.05 * log(video.stats["collectCount"] + 1)

    return score

def webscraper():
    driver = webdriver.Chrome()
    # Open a website
    driver.get("http://www.google.com")
    # Print the title of the page
    print(driver.title)
    # Close the browser
    driver.quit()



