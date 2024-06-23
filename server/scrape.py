from TikTokApi import TikTokApi
from math import log
async def scrape_tiktok(hashtag, ms_token):
    async with TikTokApi() as api:
        await api.create_sessions(ms_tokens=[ms_token], num_sessions=1, sleep_after=3, headless = False)
        tag = api.hashtag(name=hashtag)
        async for video in tag.videos(count=30):
            return [video.stats, video.sound]

def popularity_score(video):
    score = 0.35 * log(video[0]["playCount"] + 1) 
    + 0.25 * log(video[0]["diggCount"] + 1)
    + 0.20 * log(video[0]["shareCount"] + 1) 
    + 0.15 * log(video[0]["commentCount"] + 1)
    + 0.05 * log(video[0]["collectCount"] + 1)

    return score

