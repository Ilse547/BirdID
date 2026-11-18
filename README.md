<div align="center">

# Bird ID
**Record Bird sounds to identify them**

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white)
![BirdNET](https://img.shields.io/badge/BirdNET-Analyzer-8BC34A)
</div>

## Table of contents

- [About](#about)
- [Features](#features)
- [Releases](#releases)
- [Architecture](#architecture)
- [Database](#database)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
  - [BirdNET](#birdnet)
  - [Backend](#backend)
  - [Database Setup](#database-setup)
  - [Mobile app](#mobile-app)
- [Environment variables](#environment-variables)
- [API endpoints](#api-endpoints)
- [Roadmap](#roadmap)

## About
Bird ID is an app that records bird sounds and identifies them using [BirdNET](https://github.com/birdnet-team/BirdNET-Analyzer) to analyze the sounds and give you the results

## Features

- Bird identification with confidence scores
- Region saved with each observation
- Profile page listing your observations and identified birds
- Bird IDs' link to wikipedia
- Search, follow and unfollow other users

## Releases
Check the [releases page](https://github.com/Ilse547/BirdID/releases) to download the latest release.
Current Version: v1.0.0

## Tech stack
Mobile : React Native  
Backend : NodeJS and Express  
Database : PostgreSQL  
Audio analysis : BirdNET Analyzer  

## Architecture
```mermaid
flowchart LR
    Phone["App<br/>(React Native)"] -- "HTTP" --> API["Express API"]
    API --> DB[("PostgreSQL")]
    API --> FF["FFmpeg<br/>(m4a to wav)"]
    FF --> BN["BirdNET Analyzer"]
```
## Database
```mermaid
erDiagram
    USERS {
        int id PK
        text username
        text email
        text password_hash
    }
    RECORDINGS {
        int id PK
        int user_id FK
        text original_name
        text stored_path
        double latitude
        double longitude
        text region
        timestamptz created_at
    }
    IDENTIFICATION_RESULTS {
        int id PK
        int recording_id FK
        text common_name
        text scientific_name
        numeric confidence
        numeric start_seconds
        numeric end_seconds
    }
    USER_FOLLOWS {
        int follower_id PK, FK
        int following_id PK, FK
        timestamptz created_at
    }

    USERS ||--o{ RECORDINGS : "uploads (one to many)"
    RECORDINGS ||--o{ IDENTIFICATION_RESULTS : "has (one to many)"
    USERS ||--o{ USER_FOLLOWS : "follower (many to many)"
    USERS ||--o{ USER_FOLLOWS : "following (many to many)"
```

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
├── docs/
└── birdnet/        # Python virtual environment running birdNET
```
## Getting started
> [!NOTE]
> This is a small quick guide, follow the full guide in [docs/setup.md](docs/setup.md)
For more in depth documentation check the [docs](docs) folder

### BirdNET
Follow step 5 of [setup.md](docs/setup.md), clone BirdNET-Analyzer into a Python virtual environment inside `birdnet/`
```bash
birdnet/.venv/bin/python -m birdnet_analyzer.analyze --help
```
### Backend

```bash
cd backend
npm install
node server.js
```
> [!WARNING]
> Don't forget to set up the .env

## Database setup
Create the database user and load the schema, check for the full steps [setup.md](docs/setup.md#3-set-up-the-database)
```bash
psql -h localhost -U birdid_user -d birdid -f backend/db/schema.sql
```

### Mobile app
```bash
cd mobile
npm install
npx expo start -c
```
> [!WARNING]
> Don't forget to set up the .env

## Environment variables
### `backend/.env`

```env
PORT=3000
DB_USER=birdid_user
DB_HOST=localhost
DB_NAME=birdid
DB_PASSWORD=change-me
DB_PORT=5432
JWT_SECRET=use-a-long-random-secret
```

### `mobile/.env`

```env
EXPO_PUBLIC_API_URL=http://<server-ip>:3000
```

## API endpoints

| Endpoint | Auth | Description |
| --- | :--: | --- |
| `/` | ❌ | check |
| `/auth/register` | ❌ | create account |
| `/auth/login` | ❌ | log in and receive a JWT |
| `/upload` | ✅ | upload recording to run BirdNET |
| `/recording/me` | ✅ | observations and identifications |
| `/users/search?q=` | ✅ | search users by username |
| `/users/following` | ✅ | followed users |
| `/users/:userId` | ✅ | profile and observations |
| `/users/:userId/follow` | ✅ | follow and unfollow a user |
| `/app/version` | ❌ | minimum supported app version |

## Goals:
1. Users should be able to log in to save their recent sightings
2. Users should be able to follow other users and see their sightings
3. users should be able to record their surroundings and ID birds by their chant
4. users should be able to share their identifications

## Roadmap

- [x] microphone recording
- [x] BirdNET integration
- [x] Express upload route
- [x] mobile upload
- [x] result screen
- [x] Login and registration
- [x] location loging
- [x] Follow users
- [ ] notifications
- [x] see other peoples profiles
- [x] view other peoples observations
- [ ] observation caching
- [x] API minimum version
- [ ] add link to specific observations
- [x] cache observations locally

## License

This project is licensed under the MIT license see the license doc file.


The mobile app was created from the Expo template, check its license in [mobile/LICENSE](mobile/LICENSE).