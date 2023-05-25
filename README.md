# Description
A Node.js CRUD app with Hapi(Backend), Prisma(ORM) PostgreSQL(Database) and Typescript for domain modeling.
Containarized in a production manner.

# Requirements
- Docker >=24.0.1

# How To
Run:

```
git clone https://github.com/ed3899/node-crud-school-courses
./run.sh
```

`run.sh` is a helper script that populates files used for secrets that are requested in `docker-compose.yml`

Usually these secrets would live elsewhere in a real production app (i.e AWS Secrets)

Once both containers are running, give the **prismaproject** service 1 extra minute, you can view the logs of the container by `docker logs --tail 1000 -f <CONTAINER_ID OBTAINED VIA "docker ps" and look for edca3899/node-crud-...>`. Under the hood, it runs pending database migrations, uninstalls prisma to avoid accidentally messsing up the production database and finally serves the app via **localhost:3000**, displaying that in the container logs.

# API
There is a `rest.json` file you can import to either [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) or (Postman)[https://www.postman.com/].

It contains all the endpoints.