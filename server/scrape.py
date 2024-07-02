from TikTokApi import TikTokApi
from math import log
import asyncio
from aiohttp import ClientSession
from selenium import webdriver
from selenium.webdriver.common.by import By

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

        if len(sounds) == 5:
            break
    return sounds

def trending_sounds():
    options = webdriver.ChromeOptions()
    options.add_experimental_option("detach", True)
    driver = webdriver.Chrome(options=options)
    driver.get("https://ads.tiktok.com/business/creativecenter/inspiration/popular/music/pc/en")
    driver.implicitly_wait(10) # waiting for site to load

    load_sounds(driver)
    sounds = pull_sounds(driver)
    driver.quit()
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

def load_sounds(driver):
    # click on songs button to ensure songs load
    driver.find_element(By.XPATH, '//*[@id="ccContentContainer"]/div[2]/div/div[1]/div[2]/div[1]/span').click()
    driver.implicitly_wait(10)

    # view more songs
    driver.find_element(By.XPATH, '//*[@id="ccContentContainer"]/div[2]/div/div[2]/div[2]/div/div[1]/div').click()
    driver.implicitly_wait(10)

def pull_sounds(driver):
    sound_list_wrapper = driver.find_element(By.XPATH, '//*[@id="ccContentContainer"]/div[2]/div/div[2]/div[1]')
    # sound_cards = sound_list_wrapper.find_elements(By.CLASS_NAME, 'CommonDataList_cardWrapper__kHTJP index-mobile_cardWrapper__Z2o_q')
    
    # sounds = []
    # for sound_card in sound_cards:
    #     title = sound_card.find_element(By.CLASS_NAME, 'ItemCard_musicName__2znhM index-mobile_musicName__4Srx_').text
    #     author = sound_card.find_element(By.CLASS_NAME, 'ItemCard_autherName__gdrue index-mobile_autherName__DmQfn').text
    #     sounds.append({"title":title, "author":author})
    # return sounds
    # child_elements = sound_list_wrapper.find_elements(By.XPATH, './*')
    # for child in child_elements:
    #     class_name = child.get_attribute('class')
    #     text = child.text
    #     print(f'Class: {class_name}, Text: {text}')
    # return driver.find_element(By.XPATH, '//*[@id="ccContentContainer"]/div[2]/div/div[2]/div[1]/div[1]/div/div/div[2]/div[2]/div[1]/span').text



