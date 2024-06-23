from flask import Flask, request, jsonify
from scrape import scrape_tiktok, popularity_score
from aiohttp import ClientSession
import asyncio
app = Flask(__name__)


async def get_ms_token():
    async with ClientSession() as session:
        async with session.get("https://www.tiktok.com/") as response:
            cookies = response.cookies
            ms_token = cookies.get('msToken') if 'msToken' in cookies else None
            return ms_token


@app.route('/')
@app.route('/recommend-music', methods=['POST'])       
def recommend_music():
    # data = request.get_json()
    # hashtags = data.get('hashtags', [])
    hashtags = ["gojo"]
    if not isinstance(hashtags, list):
        return jsonify({"error": "Hashtags must be a list"}), 400
    
    #try:
    recommendations = []
    ms_token = asyncio.run(get_ms_token())
    for hashtag in hashtags:
        results = asyncio.run(scrape_tiktok(hashtag, ms_token))
        recommendations.append(results)
    # return jsonify({"sounds": str(recommendations[0].items())})
    recommendations = sorted(recommendations, key=popularity_score)

    sounds = []
    for recommendation in recommendations:
        sounds.append((recommendation[1].title, recommendation[1].original))

    return jsonify({"sounds": sounds, "size": len(recommendations)})
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
