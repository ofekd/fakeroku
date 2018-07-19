# Fakeroku
## A fake Heroku for a job interview

### Usage

Requires latest Docker.

Before first use, you'll have to migrate the DB. change all the `migrate: false` to `true` in `options/development.options.json`, then run once. The console should log the migrated models.

Run:

`./fakeroku-dev.sh up`

Stop:

`./fakeroku-dev.sh down`

To explore the API, point any OpenAPI explorer to `http://127.0.0.1:3000/openapi.json` while the server is running. For Loopback's explorer, use:

https://loopback.io/api-explorer/?url=http://127.0.0.1:3000/openapi.json

Some endpoints require the use of `Filter`and `Where` objects to query models. Here are references for their structure (please copy & paste for the links to work):

http://apidocs.loopback.io/@loopback%2fdocs/repository.html#Filter
http://apidocs.loopback.io/@loopback%2fdocs/repository.html#Where


### Background

When I got the task, Loopback immediately came to mind. It's a great framework for building APIs and I thought it to be perfect for the job.

However, it is not without its problems. Old age has started showning and so the team rewrote the entire thing (a la Angular, but without the outrage). I took a look at the state of the rewrite, and to my surprise it was quite usable.

Sure, it is not a stage in which I will usually adpot a framework, but for this exercise it was perfect. It allowed me to save the boring pipework while still being able to demonstrate problem solving, new code base adoption, and quick hacks "needed yesterday". That way you'll have (a taste) of my coding over a spectrum of different types of problems.

### Some Technical Decisions

1. No over implementation -- if a feature wasn't requested and is not required for complete code, it is not added. Bloat brings bugs.

2. Ops -- I always set Docker up right away, using a different image for development and production. To allow ops freedom with no dev frustration, docker was abstracted away by a very simple script. That helps moving things around when the project grows without having to teach the team new commands.

3. Docker hardening -- production image was not hardened, as it should. Just had no time and it's out of scope anyway.

4. Missing pieces -- Loopback 4 developer preview has some glaring missing pieces. They were *very loosely* implemented to allow for a swift removal when implemented in the framework. These pieces are:
    - Option configuration files
    - Database bootstrap/migrate

5. TypeScript is truly great.

6. Code duplication -- Some stuff like validation and authorization have code duplication. This is due to the specific nature of the task here. Usually I would incorporate a separate module the same way it's done for authentication, but it's a major overkill for this tiny test.

7. Unique resource name -- This is an arbitrary resource, so I went with user-picked, globally unique names approach. Similar to a "project" in the typical PaaS or to an S3 bucket.
