from flask import Flask, render_template, request, jsonify
import spotipy
import os
from apiclient.discovery import build
from apiclient.errors import HttpError
from oauth2client.tools import argparser
from spotipy.oauth2 import SpotifyClientCredentials

DEVELOPER_KEY = "AIzaSyCbRGmKFPQ-4hUMgJT-BOzAAwO1_NcXIwM"
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

client_credentials_manager = SpotifyClientCredentials('fbdb0de9be30443e9ee5ed5b254798ca',
                                                      '28310ff425264b25be082048592d725a')
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
sp.trace = False

app = Flask(__name__)

youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=DEVELOPER_KEY)

def get_artist(artist_name):
    results = sp.search(q='artist:' + artist_name, type='artist')
    items = results['artists']['items']
    if len(items) > 0:
        return items[0]
    else:
        return None

def get_youtube_video(recommendation):
    search_response = youtube.search().list(
        q= recommendation,
        part="id,snippet",
        maxResults=1
    ).execute()
    search_result = search_response.get("items")[0]
    if search_result["id"]["kind"] == "youtube#video":
        return {
            'id' : search_result["id"]["videoId"],
            'recommendation' : recommendation,
            'youtube_title' : search_result['snippet']['title'],
            'thumbnail' : search_result['snippet']['thumbnails']['high']
            
        }

def show_recommendations_for_artist(artist_name):
    artist_name = get_artist(artist_name)
    if not artist_name:
        return {
            'error' : 'Could not find artist.'
        }
    recommendations = []
    results = sp.recommendations(seed_artists=[artist_name['id']])
    if not results['tracks']:
        return {
            'error' : 'No results found.'
        }
    for track in results['tracks']:
        recommendations.append('%s - %s' % (track['name'], track['artists'][0]['name']))   
    return recommendations 

@app.route("/video", methods=['POST'])
def play_video():
    recommendation = request.args.get('recommendation')
    video = get_youtube_video(recommendation)
    return jsonify(video)

@app.route("/recommendations", methods=['POST'])
def recommender():
    artist = request.args.get('artist')
    recommendations = show_recommendations_for_artist(artist)
    return jsonify(recommendations) if recommendations else jsonify('No results found.')


@app.errorhandler(404)
def page_not_found(e):
    return jsonify({
        'error' : '404 not found.'
    }), 404

@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({
        'error' : 'Method not allowed'
    }), 405
    
@app.route("/", methods=['GET'])
def home():
    return render_template('index.html', title='Home')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 33507))
    app.run(debug=True, host='0.0.0.0', port=port)
