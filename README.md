
## About
Simple login authentication system ( signup / login / logout )

### function
#### basic
- use `express-validator` for validate post value
- use `cookie-parser` for control user login token

#### advance
- use `crypto` for email and password encrypt
- use `csurf` for CSRF
- use `redis(ioredis)` for control user login session
- add `redirectUrl` value for after login redirect

##  Setup flow

*use Docker Compose !!*

### 1. build docker-compose container
```
$ docker-compose up --build -d
```

After build, create 3 container and can accees web page

```
$ docker ps
CONTAINER ID        IMAGE                  COMMAND                  CREATED             STATUS              PORTS                    NAMES
2f52cc98a3eb        node2_web              "sh -c 'npm install …"   21 minutes ago      Up 20 minutes       0.0.0.0:3000->3000/tcp   node2_web_1
9f320ba5d419        redis:latest           "docker-entrypoint.s…"   21 minutes ago      Up 20 minutes       0.0.0.0:6379->6379/tcp   node2_redis_1
ec3325fc6caa        postgres:10.8-alpine   "docker-entrypoint.s…"   21 minutes ago      Up 20 minutes       0.0.0.0:5432->5432/tcp   node2_postgres_1
```

```
$ curl http://{192.168.99.100 or 127.0.0.1}:3000/ -I
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 334
Set-Cookie: connect.sid=s%3AhpTrHFicuJFsEi3-ywuL9yTFFSuGESGb.nd8yfaBe%2BKKVef7B4u%2BVpCguIdX1NDMAMv3YWh4QNj0; Path=/; HttpOnly
Date: Sun, 19 May 2019 05:13:07 GMT
Connection: keep-alive
```

### 2. setup db setting

```
$ docker exec -i -t {postgres_container_id} bash

$ psql -U postgres

postgres=# CREATE ROLE dev LOGIN CREATEDB PASSWORD 'dev';
postgres=# CREATE DATABASE database_development OWNER dev;
```

### 3. migrate db

```
$ docker exec -i -t {web_container_id} sh
$ sequelize db:migrate --env development
```
