from flask import Flask, request, jsonify
from scrape import personalized_recommendations, trending_sounds

app = Flask(__name__)


@app.route('/')
@app.route('/recommend-music', methods=['POST'])       
def recommend_music():
    #data = request.get_json()
    #hashtags = data.get('hashtags', [])
    
    # if not isinstance(hashtags, list):
    #     return jsonify({"error": "Hashtags must be a list"}), 400
    
    try:
        #personalized = personalized_recommendations(hashtags)
        trending = trending_sounds()
        return jsonify({"personalized": "personalize", "trending": trending, "new": "TODO"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)