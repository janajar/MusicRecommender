from TikTokApi import TikTokApi
from math import log
import asyncio
from aiohttp import ClientSession
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

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
            sounds.append({"title":recommendation.sound.title, "auxwthor":author, "url":recommendation.sound.play_url})

        if len(sounds) == 5:
            break
    return sounds


def trending_sounds():
    options = webdriver.ChromeOptions()
    options.add_experimental_option("detach", True)
    driver = webdriver.Chrome(options=options)
    driver.get("https://ads.tiktok.com/business/creativecenter/inspiration/popular/music/pc/en")

    try:

        driver.find_element(By.XPATH, '//*[@id="ccContentContainer"]/div[2]/div/div[1]/div[2]/div[1]/span').click()
        driver.implicitly_wait(10)

        # View more button click
        view_more_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//*[@id="ccContentContainer"]/div[2]/div/div[2]/div[2]/div/div[1]/div'))
        )
        view_more_button.click()

        time.sleep(3)

        # Wait until elements with music names are present
        music_name_elements = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'ItemCard_musicName__2znhM')))
        music_name_elements.pop()
        return len(music_name_elements)
        # Wait until the elements with author names are present
        author_name_elements = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'ItemCard_autherName__gdrue')))
        author_name_elements.pop()

        driver.quit()
        titles = []
        for music_element in music_name_elements:
            titles.append(music_element.text)
        
        authors = []
        for author_name in author_name_elements:
            authors.append(author_name.text)
        
        sounds = []
        for title, author in zip(titles, authors):
            sounds.append({"title": music_name, "author": author_name})
        
        return sounds

    # Error Catching
    except Exception as e:
        print(f"An error occurred: {e}")

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

def load_sounds(driver):
    # click on songs button to ensure songs load
    driver.find_element(By.XPATH, '//*[@id="ccContentContainer"]/div[2]/div/div[1]/div[2]/div[1]/span').click()
    driver.implicitly_wait(10)

    # view more songs
    driver.find_element(By.XPATH, '//*[@id="ccContentContainer"]/div[2]/div/div[2]/div[2]/div/div[1]/div').click()
    driver.implicitly_wait(10)