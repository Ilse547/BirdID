<div align="center">

# Bird ID
**Record Bird sounds to identify them**

</div>

## Table of contents

- [About](#about)
- [Features](#features)
- [Releases](#releases)
- [Project structure](#project-structure)

## About
Bird ID is an app that records bird sounds and identifies them using [BirdNET](https://github.com/birdnet-team/BirdNET-Analyzer) to analyze the sounds and give you the results

## Features

- Bird identification with confidence scores
- Region saved with each observation
- Profile page listing your observations and identified birds
- Bird ids' link to wikipedia
- Search, follow and unfollow other users

## Releases
Check the [releases page](https://github.com/Ilse547/BirdID/releases) to download the latest release.
Current Version: v1.0.0

## Project structure

```text
BirdID/
├── mobile/
│   ├── pages/      # app pages
│   ├── hooks/      # app hooks
│   ├── App.js
│   ├── config.js
│   └── styles.js
├── backend/
│   ├── routes/     # API routes
│   ├── middleware/ # API middleware
│   ├── services/   # API BirdNET service
│   ├── db/         # API DB connection
│   └── server.js
└── birdnet/        # Python virtual environment running birdNET
```


## Goals:
1. Users should be able to log in to save their recent sightings
2. Users should be able to follow other users and see their sightings
3. users should be able to record their sourroundings and ID birds by their chant
4. users should be be able to share their identifications

## checklist

- [ ] microphone recording
- [ ] BirdNET integration
- [ ] Express upload route
- [ ] mobile upload
- [ ] BirdNET integration
- [ ] result screen
- [ ] Login and registration

## run the project
1. in the ``` backend/ ``` folder run ``` node server.js ```
2. in the ``` mobile/ ``` folder run ``` npx expo start --lan ```

## Compiklw into apk
1. inside of ``` mobile/ ``` run ``` npx expo prebuild --platform android ```  
2. inside of ``` mobile/android ``` run ``` ./gradlew clean ``` to remove old build files  
3. then run ``` ./gradlew assembleRelease ``` to build the apk  

# BirdNET setup

BirdNET-Analyzer is used by the backend to analyse and identify birds  

## Local setup

Python 3.11 is required to run BirdNET-Analyzer  

Run these commands to install it:  
``` cd ~/dev/BirdID/birdnet ```

``` ~/.pyenv/versions/3.11.16/bin/python -m venv .venv ```

``` git clone https://github.com/birdnet-team/BirdNET-Analyzer.git ```

``` cd BirdNET-Analyzer ```
``` ../.venv/bin/python -m pip install --upgrade pip ```
``` ../.venv/bin/python -m pip install . ```
