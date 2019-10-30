# Minipoll
Minipoll is an easy to used website for polling. You can quickly setup a poll here and let everyeone vote for it, or setup a private poll for your freinds only.

# Dev
Using docker-compose to easily build and start the project
```sh
docker-compose build
docker-compose up
docker-compose down
```
Or manually starting database and server
```sh
npm install
npm run build
./startdb.sh                # Start mongodb using docker
npm start
docker stop poll_database   # Stop mongodb
```

# Staging
This website is not ready for staging.

# Production
This website is not ready for production.

# TODO
- [ ] Prevent user from entering duplicated options
- [x] Styling homepage
- [ ] Prevent user from voting multiple times
