# Description

Hookify is a Music recommendation client powered using the Spotify Recommendations API.

---

# Development

Developed using Python / Flask,

---

## Developer Notes

Please always use `pipenv install` instead of `pip3 install` when adding dependencies.

Also ensure to keep the `requirements.txt` up-to-date by runnging the following command wheneve dependencies are added/removed.

```
$ pipenv lock -r > requirements.txt
````

---

## Environment & Application setup

Step 1: Download & install Python 3 -

The easiest way to setup a Python Environment on Windows is to download Anaconda - https://www.anaconda.com/download/

If on macOS, you can use `brew`

To setup homebrew, open the terminal and run the command

````
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
````

Then install Python by running the following command

````
brew install python
````

Step 2: Install Pipenv

To setup & use isolated Virtual Environments, install pipenv

````
pip3 install pipenv
````

Step 3: Open the terminal & cd into project directory -

````
cd /path/to/project
````

Step 4: Activate/Create Virtual Environment

````
pipenv shell
````

Step 5: Run the following command to install all the dependencies -

````
pipenv install
````

Alternatively, you can run -

````
pip3 install -r requirements.txt
````

Step 6: Done!

---

## Run Locally:

Prerequisite: Ensure you have `Debug` in `app.py` set to `True` during Development & your `.env` is setup (see `.env.example`).

Step 1: Open the terminal & cd into project directory -

````
cd /path/to/project
````

Step 2: Run the following command to run the application -

Launch a development server:

````
python app.py
````

Run in production:

````
gunicorn -w 4 app:app
````

Step 3: Copy the URL that will display in the terminal into your browser

Default URL - http://0.0.0.0:33507/

Done!

Note: You may need to refresh your browser when front-end changes are made, back-end changes don't require re-running the application.

---

# Deployment

There are two Methods of Deployment, Cloud foundry or OpenShift. Dockerizing is not nessery for deployment on Cloud foundry.

Note: Please note that this app is built five years old and has not been maintained. Issues may arise when setting up or running the app.

---

## Deployment Notes

#### Set "DEBUG" to "FALSE" only for Production in app.py

#### NOTE: `name` and `route` in manifest.yml define the app name & URL.

---

## Dockerizing the Application

Prerequisite: Ensure you have Docker installed & running in the background.

Note: Configurations for Docker are located in `Dockerfile` & `docker-compose.yml` file on the root directory

Step 1: Open the terminal & cd into project directory -

````
cd /path/to/project
````

Step 2: Run the following command to build the Docker image -

````
docker build -t hookify .
````

Step 3: Run the following command to compose cloud Services -

````
ocker-compose up
````

Done!

---

## Cloud foundry

Prerequisite: Ensure you have Cloud foundry installed & setup.

Note: Configurations for Cloud foundry Deployment, such as domain, are located in `manifest.yml` file on the root directory.

Step 1: Open the terminal & cd into project directory -

````
cd /path/to/project
````

Step 2: Login to Cloud foundry -

````
cf login --sso
````

Step 3: Follow the link, copy the code, paste it into the terminal & execute

Note: Password will not display when pasted or typed into the terminal, it will be hidden.

Step 4: Deploy to Cloud foundry -

````
cf push
````

Done!

---

## OpenShift

For Instructions to dockerize and deploy the application into OpenShift, please see relevant documentation on redhat.com.
