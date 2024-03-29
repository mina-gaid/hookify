from flask import Flask, render_template, request, jsonify
from recommender.api import Recommender
import requests
import os
import json
from datetime import datetime
from flask_cors import CORS
from flask_htmlmin import HTMLMIN

app = Flask(__name__)
app.config['MINIFY_HTML'] = True
app.config['CORS_HEADERS'] = 'Content-Type'

CORS(app)

htmlmin = HTMLMIN(app)
# or you can use HTMLMIN.init_app(app)
# pass additional parameters to htmlmin
# HTMLMIN(app, **kwargs)


@app.route("/", methods=['GET'])
def home():
    music_genres = load_genres()['genres']
    return render_template('index.html', genres=music_genres)


@app.route("/download", methods=['GET'])
def download():
    return render_template('download.html')


@app.route("/about", methods=['GET'])
def about():
    return render_template('about.html')


@app.route("/developers", methods=['GET'])
def developers():
    return render_template('developers.html')


@app.route("/contact", methods=['GET'])
def contact():
    return render_template('contact.html')


@app.route("/genres", methods=['POST'])
def genres():
    music_genres = load_genres()
    return jsonify(music_genres['genres'])


@app.errorhandler(400)
def bad_request(e):
    return jsonify({
        'error': "Bad Request"
    })


@app.errorhandler(404)
def page_not_found(e):
    return jsonify({
        'error': "Page not Found"
    })


@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({
        'error': "Method not allowed."
    })


@app.errorhandler(500)
def internal_server_error(e):
    return jsonify({
        'error': "Internal server error."
    })


def load_genres():
    with open('resources/genres.json') as f:
        data = json.load(f)
    return data


@app.route('/recommendations', methods=['POST'])
def recommendations():
    recommender = Recommender()
    if request.args.get('q'):
        q = request.args.get('q')
        t = request.args.get('t')
        if t == 'artist':
            recommender.artists = q
        elif t == 'track':
            recommender.tracks = q
        else:
            recommender.genres = q
    recs = recommender.find_recommendations()
    return jsonify(recs)


@app.route('/play', methods=['POST'])
def play():
    if not request.args.get('track'):
        return jsonify({
            'error': 'Track is required.'
        }), 400

    get_video_id = make_request('https://www.googleapis.com/youtube/v3/search', {
        'q': request.args.get('track'),
        'part': 'id,snippet',
        'maxResults': 1,
        'type': 'video',
        'key': os.getenv('YOUTUBE_API_KEY')
    })

    return jsonify({
        "id": get_video_id['items'][0]['id']['videoId']
    })


def make_request(url, params):
    req = requests.get(url, params=params)
    return req.json()


@app.context_processor
def inject_now():
    return {'now': datetime.utcnow()}


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 33507))
    app.run(debug=False, host='0.0.0.0', port=port)
