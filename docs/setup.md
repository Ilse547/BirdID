# BirdID setup
This document describes how to set up BirdID on a local environment.

## 1. Requirements:
make sure these are installed on your computer
- NodeJS
- PostgreSQL
- Python 3.11+
- FFmpeg
    - Debian: ` sudo apt install ffmpeg `
    - MacOS: `brew install ffmpeg`
    - Windows: download from ffmpeg.org

for building the mobile app ([step 7](#7-build-the-release-apk)) youll need a java jdk and the android sdk, chekc the expo docs

## 2. Clone the Repo:
```bash
git clone https://github.com/Ilse547/BirdID.git
cd BirdID
```
The project has 3 subfolders

- `mobile/`: the React Native (Expo) app
- `backend/`: the Express API
- `birdnet/`: the Python environment for BirdNET

## 3. Setup the DB
1. Install PostgreSQL and create a database user and a database:
```
CREATE USER birdid_user WITH PASSWORD 'your-strong-password';
CREATE DATABASE birdid OWNER birdid_user;
```
2. Create the tables `users`, `recordings`, `identification_results` and `user_follows`
>[!NOTE]
>will soon be finished

## 4. Configure the backend
create the .env in the backend root
```
PORT=3000
JWT_SECRET=The-jwt-key
DB_USER=birdid_user
DB_HOST=localhost
DB_NAME=birdid
DB_PASSWORD=your-password
DB_PORT=5432
```
Install the dependencies:

```bash
cd backend
npm install
```

## 5. Set up BirdNET

BirdNET runs in its own Python virtual environment inside `birdnet`

```bash
cd birdnet
python3.11 -m venv .venv
git clone https://github.com/birdnet-team/BirdNET-Analyzer.git
cd BirdNET-Analyzer
../.venv/bin/python -m pip install --upgrade pip
../.venv/bin/python -m pip install .
```

## 6. Configure the Mobile app

1. Find the IP address of your computer on the local network ex: `192.168.1.20`.
    - Linux: run `hostname -I`
    - MacOS: run `ipconfig getifaddr en0`
    - Windows: idk switch to linux
2. Create the file `mobile/.env`:
```
EXPO_PUBLIC_API_URL=http://192.168.1.20:3000
```

3. Install the dependencies:
```bash
cd mobile
npm install
```
>[!IMPORTANT]
>The phone must be on the same wifi network as the computer

## 7. Build the release APK

Run these commands from `mobile/`:

```bash
npx expo prebuild --clean
cd android
./gradlew assembleRelease --no-build-cache
```
The APK is created in `mobile/android/app/build/outputs/apk/release/`.
The app allows plain HTTP traffic because the backend runs on the local network without HTTPS, only use this on a trusted network

## Test the setup
Run ` cd backend && node server.js ` you should see `Backend running at http://localhost:3000`
Run ` cd mobile && npx expo start -c ` to start the app