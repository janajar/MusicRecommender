from flask import Flask, request, jsonify
from scrape import personalized_recommendations, trending_sounds
import re

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to the Music Recommendation API!"

@app.route('/recommend-music', methods=['POST'])
def recommend_music():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Invalid input, JSON required"}), 400
    
    req = data.get('hashtags', [])
    hashtagged = re.findall(r'#\w+', req)
    hashtags = [word[1:] for word in hashtagged]

    if not isinstance(hashtags, list):
        return jsonify({"error": "Hashtags must be a list"}), 400
    
    try:
        personalized = personalized_recommendations(hashtags)
        # trending = trending_sounds()  # Uncomment if needed
        return jsonify({"personalized": personalized})
    
    except Exception as e:
        app.logger.error(f"Error during recommendation: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)