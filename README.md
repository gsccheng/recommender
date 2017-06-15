### Subtopic Recommendation API server

## Installation
----
Go to the root directory and run

```
npm install
```

For development and testing, spin up an Elasticsearch server v5.1.1 listening on port 9200.

Seed the databases accordingly:

```
npm run seed-dev
```
or

```
npm run seed-test
```

## Instructions
----
Run

```
npm run start-dev
```

Then, send an http request to `localhost:3000` for subtopic recommendations! For example:

```
http://localhost:3000/recommendations?subtopic=X
```

You will receive the recommendations in JSON in the response body.

## Testing
----
To test, run

```
npm run test
```