# Hookify
A Flask web application to discover music recommendations based on artists.

## Installation

``` shell
$ cd /path/to/Hookify
$ pip install -r requirements.txt
$ python recommendations.py

```

## View on Heroku

https://hookify.herokuapp.com

## API Documentation

This app uses the [Spotify Recommendations API](https://developer.spotify.com/web-api/get-recommendations/) to retreive track recommendations for a given artist. The [YouTube Data API](https://developers.google.com/youtube/v3/) is used to fetch YouTube video for a given recommendation.

[HookTube](https://hooktube.com/) is used to redirect Youtbe videos to allow for -

- HTML5 Video player
- Play videos without giving them views
- Bypasses country blocks age restrictions
- Download the videos
- Keep your data private from Google

### Get Recommendations

This endpoint returns a list of recommended songs for a given artist.

```shell
curl -X POST  https://hookify.herokuapp.com/recommendations?artist=oasis
```

> The above command returns JSON structured like this:

```json
[
    "The Masterplan - Oasis",
    "Club Foot - Kasabian",
    "Notion - Kings of Leon",
    "Man of War - Radiohead",
    "Married With Children - Remastered - Oasis",
    "Someday - The Strokes",
    "You Do Something To Me - Paul Weller",
    "Waterfall - Remastered - The Stone Roses",
    "This Charming Man - 2011 Remastered Version - The Smiths",
    "Fireside - Arctic Monkeys",
    "Slide Away - Remastered - Oasis",
    "I Promise - Radiohead",
    "For What It's Worth - Liam Gallagher",
    "Wasted - Kasabian",
    "Banquet - Bloc Party",
    "Rockin' Chair - Oasis",
    "Maybe Tomorrow - Stereophonics",
    "Always Ascending - Franz Ferdinand",
    "505 - Arctic Monkeys",
    "You Only Live Once - The Strokes"
]
```

#### Query Parameters

| Parameter  | Description                                  |
|------------|----------------------------------------------|                         
| artist    | The artist name                                |

### Get YouTube Video

This endpoint returns the YouTube url for a given recommendation.

```shell
curl -X POST 'https://hookify.herokuapp.com/video?recommendation=The%20Masterplan%20-%20Oasis'
```

> The above command returns JSON structured like this:

```json
{
    "id": "dPPi2D6GK7A",
    "recommendation": "The Masterplan - Oasis",
    "thumbnail": {
        "height": 360,
        "url": "https://i.ytimg.com/vi/dPPi2D6GK7A/hqdefault.jpg",
        "width": 480
    },
    "youtube_title": "Oasis - The Masterplan"
}
```

#### Query Parameters

| Parameter  | Description                                  |
|------------|----------------------------------------------|                         
| recommendation    | The track name                                |
