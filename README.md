# Minipoll
Minipoll is an easy to used website for polling. You can quickly setup a poll here and let everyeone vote for it, or setup a private poll for your freinds only.

# Dev
First of all, install the necessary dependencies
```sh
npm install
```
Build the frontend code
```sh
npm run build
```
Start the development database
```sh
./startdb.mongo.sh
```
Lastly, start the development server and listen to port 5000
```sh
npm start
```
Remember to stop the container after developing
```sh
docker stop poll_database
```

# Staging
This website is not ready for staging.

# Production
This website is not ready for production.

# TODO
- [ ] Prevent user from entering duplicated options
- [ ] Styling homepage
- [ ] Prevent user from voting multiple times
