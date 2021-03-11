# weather-app
Weather API

## Setup
This NodeJS weather API tool uses express to expose a weather endpoint. To setup to run this locally, just run `npm i`.

## Running Tests
Unit testing is done using the Jest framework. Running tests is as simple as running `npm test`.

## Running locally
The API expects a bunch of configuration variables which are injected into the app at runtime. The configuration is expected to be in a file named `.env` as bunch of key value pairs. To set up, copy the `.env.sample` file into a file named `.env`. All configurations have defaults except for the API Keys. Fill in those values and run `npm start` to run the API locally.

## TODO
- [ ] Better Caching - the `CacheService` is very rudimentary
- [ ] Better logging
- [ ] Better Error handling - there are just 2 error types defined
