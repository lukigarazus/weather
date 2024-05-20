# Weather app

## How to run the app?

Your should have both Docker and docker-compose ready to go on your machine.

Once you have that go and copy .env.example to .env and fill in all of the variables with real values. The app will run just fine with the default values, except for the weather API key.

Now run docker-compose up and go to localhost:5173.

## Caveats

1. I did not write any tests because I'm not willing to spend too much time on this task. Normally I would write the following tests:

Cache response fixture, open weather response fixture that's different than cache.
Mock Open Weather, Mock Postgres with fixtures.

- No cache, open weather up -> response open weather
- No cache, open weather up, two request -> response cache on second
- No cache, open weather down -> response 500
- Cache, open weather up -> response cache
- Cache, open weather down -> response cache
- Postgres down, open weather up -> response open weather
- Postgres down, open weather down -> response 500

The front end is quite simple but there are a few possible scenarios so I would write cases like these:

- No location permission -> descriptive error message
- Location permission, API down -> error message
- Location permission, API up -> loader then weather
- Location permission, API up, pick city -> loader then local weather then loader then city weather that's different

2. I did not use any ORMs, query builders etc. because during the interview I was asked about SQL so I wanted to showcase that I can do something. I used Postgres for the same reason, I'm not sure
   if it's good as a cache.

3. I did not use any FE component libraries because I wanted to showcase that I can implement everything myself. I would not do that in a commercial context.

4. I used a FE list of US cities to avoid another API integration, mostly for speed of dev.

5. The current deployment is pretty simplistic and does not allow deployment of the API and the client to different hosts. I did a bit to make it a bit more customizable but then dropped it
   due to time constraints and the fact that IRL an app like this would not need to be deployed in a sophisticated way.

6. Error handling on the FE is done with a request to reload the page, again for the sake of simplicity and speed.
