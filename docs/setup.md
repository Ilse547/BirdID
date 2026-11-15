# BirdID setup
This document describes how to setup BirdID on a lcoal environment.

## 1 Requirements:
make sure these are installed on your computer
- NodeJS
- PostgreSQL
- Python 3.11
-
## 2 Clone the Repo:
```bash
git clone https://github.com/Ilse547/BirdID.git
cd BirdID
```
The project has 3 subfolders

- `mobile/`: the React Native (Expo) app
- `backend/`: the Express API
- `birdnet/`: the Python environment for BirdNET

## 3 Setup the DB
1. Install PostgreSQL and create a database user and a database:
```
CREATE USER birdid_user WITH PASSWORD 'your-strong-password';
CREATE DATABASE birdid OWNER birdid_user;
```
2. Create the tables `users`, `recordings`, `identification_results` and `user_follows`.

## 4 COnfigure the backend
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