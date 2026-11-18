# Contributing to BirdID
first of all thank you for improving birdid! this document will explain how to change the code, submit changes 

## before you start
1. read the [setup guide](setup.md) and set up the database, backend, BirdNET and the mobile app
2. read the [api-reference.md](api-reference.md) to understand how project works
3. check the open issues or todo list before starting something new, so work is not duplicated

## Project structure
```
BirdID/
├── mobile/      React Native
├── backend/     Express API, PostgreSQL access
├── birdnet/     Python environment for BirdNET
└── docs/        Technical documentation
```
## coding guidelines
### Mobile app
- dont use typescript, just js
- put screens in `mobile/pages/`, hooks in `mobile/hooks/`, and shared styles in `mobile/styles.js`
- try to keep the style consistent

### Backend
- protected routes must use the `authenticateToken` middleware
- use a transaction when a change touches more than one table

### Documentation
- when you add or change a route update [api-reference.md](api-reference.md)
- when you change the database schema, update [database.md](database.md) and the diagram in the README
- when you change setup steps, update [setup.md](setup.md)

## Do nto commit
- `.env` files like `backend/.env` or `mobile/.env`, they contain passwords and the JWT secret
- The `backend/upload/` folder with uploaded recordingst
- The BirdNet folder with the virtual ennvironemnt and outputs

## Questions
if something in this guide is unclear, open an issue or contact the maintainer

## Security
The app uses play http, only use it on a trusted network