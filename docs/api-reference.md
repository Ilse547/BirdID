# API Reference
The BirDID backend is an Express API, the mobile app is its only client, thsi document described the backend

## Summary

| method | route | uses auth | purpose |
| --- | --- | --- | --- |
| P0ST | `/auth/register` | No | Create an account |
| POST | `/auth/login` | No | Log in and receive a token |
| POST | `/upload` | Yes | Uplood a recording and identify the birds |
| GET | `/recording/me` | Yes | your own observations |
| GET | `/recording/explore` | Yes | newest observations from all users |
| GET | `/recording/feed` | Yes | Newest observations from users you follow |
| GET | `/stats/me` | Yes | Your statistics |
| GET | `/users/search` | Yess | Search users by name |
| GET | `/users/following` | Yes | Users you follow |
| GET | `/users/:userId` | Yes | A users public profile and observations |
| POST | `/users/:userId/follow` | Yes | folow a user |
| DELETE | `/users/:userId/follow` | Yes | Unfollow a user |
| GET | `/app/version` | No | Minimum supported app version |

## App

### GET /app/version
returns the minimum app version the backend supports, doesnt require authenticaatzion so the app can check it ebfore logging in
Response `200`: `{"minAppVersion": "1.0.0"}`
the app compares its own version with this value and shows an error

## authentication
### POST /auth/register
create a user

Request body (JSON):
| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `username` | string | yes | |
| `email` | string | yes | mst match a basic email pattern |
| `password` | string | yes | at least 8 characters |

respons:
- `201`: `{ "message": "user registered", "user": { "id", "username", "email" } }`
- `400`: a field is missing, the email is invalid, or the password is too short
- `500`: the user could not be saved (for example, the username or email already exists)

### POST /auth/login
request body (JSON):

| Field | Type | Required |
| --- | --- | --- |
| `email` | string | Yes |
| `password` | string | Yes |

Responses:
- `200`: `{ "message": "Login successful", "token": "<jwt>", "user": { "id", "username", "email" } }`
- `400`: a field is missing
- `401`: no user matches the email and password
- `500`: login failed on the server


## Recording
### POST /upload

Uploads a recording, runs BirdNET on it, and saves the recording and its results

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `audio` | file | yes | recording in m4a format |
| `latitude` | number | no | sent by the app when location is granted |
| `longitude` | number | no | sent by the app when location is graanted |
| `region` | string | mo | if missing the backend does not look it up in this route |

Response `200`:

```json
{
  "message": "audio analyzed",
  "results": [
    ["1", "0.0", "3.0", "Great Tit", "Parus major", "...", "0.8123", "Great Tit", "Parus major", "0.8123"]
  ]
}
```

Each result is a BirdNET table row, with two fields changed for the app:
- `index 3`: common name
- `index 6`: confidence as a number between 0 and 1

Errors:
- `400`: no audio file was sent
- `500`: Birdnet or the database failed

### GET /recording/me
gives the observation of the user
Response `200`:

```json
{
  "recordings": [
    {
      "id": 12,
      "created_at": "2025-05-01T10:15:00.000Z",
      "location": "Berlin",
      "results": [
        {
          "common_name": "Great Tit",
          "scientific_name": "Parus major",
          "confidence": "0.8123",
          "start_seconds": "0.000",
          "end_seconds": "3.000"
        }
      ]
    }
  ]
}
```

`location` is the region, or `"location not found"` when no region was saved

Error: `500` if the observations could not be loaded.

### GET /recording/explore
Returns the newest observations from all users, newest first
Response `200`:

```json
{
  "recordings": [
    {
      "id": 12,
      "username": "john2006",
      "created_at": "2025-05-01T10:15:00.000Z",
      "location": "Berlin",
      "results": [
        { "common_name": "Great Tit", "scientific_name": "Parus major", "confidence": "0.8123" }
      ]
    }
  ]
}
```
Errors: `500` if the observations could not be loaded
### GET /recording/feed
Returns the newest observations from users the loged in user follows
Response `200`: same shape as `/recording/explore`
Error: `500` if the feed could not be loaded


## users
### GET /users/search?q=

Find users whose name contains `q` (not case sensitive), excludes the user who is logged in. Returns at most 20 users
Response `200`: `{ "users": [{ "id": 4, "uesrname": "john2006", "is_following": false }] }`
Error: `500` if the search fails

### GET /users/following

gives the user follows
Response `200`: `{ "users": [{ "id": 4, "username": "jophn2006", "followed_at": "2025-04-20T08:00:00.000Z" }] }`
Error: `500` if the list could not be loaded

### GET /users/:userId
Returns a users pubic profile and all of their observations, newest first, The observations use the same shape as `/recording/me`

reponse `200`:
```json
{
  "user": { "id": 4, "username": "marie2023" },
  "recordings": []
}
```
Errors:
- `400`: `userId` is not a number
- `404`: no user has this id
- `500`: the profile could not be loaded

### POST /users/:userId/follow
Makes the logged in user follow `:userId`
Response `200`: `{ "message": "user followed" }`

Errors:
- `400`: the id is not a number, or the user tries to follow themselves
- `500`: the follow could not be saved, for example because the user does not exist

### DELETE /users/:userId/follow
stops following `:userId`
Response `200`: `{ "message": "user unfollowed" }`
Error: `500` if the change could not be saved

## stats
### GET /stats/me
gives totals and the most identified birds for the logged in user, the calculation runs in the database.

Response `200`:
```json
{
  "total_observations": 23,
  "unique_birds": 14,
  "top_birds": [
    { "common_name": "Greet Tit", "sightings": 9, "rank": 1 },
    { "common_name": "Blue Tit", "sightings": 7, "rank": 2 }
  ]
}
```
- `sightings` is the number of observations that contained the bird.
- `top_birds` contains up to 5 birds. Tied birds share a rank, so the list can contain more than 5 entries.

Error `500` if the statistics could not be calculated.
