# Event Management System

A RESTful service that manages and queries event data based on a user's geographical location and a specified date.
Built for GyanGrove

### [Live demo on Azure](https://gg.parnavh.dev/)
*cold start may take a minute*


## 🚀 Tech Stack
**Javascript**, **Bun**, **Express.js**, **PostgreSQL**, **Docker**, **Azure**, **Swagger**

For more details, see [tech-stack](tech-stack.md).

## ⚒️ Setup
Install bun if not installed: 
```bash
curl -fsSL https://bun.sh/install | bash        # MacOS/Linux

powershell -c "irm bun.sh/install.ps1 | iex"    # Windows
```

Create a `.env` file: 
```bash
cp .env.example .env    # Substitute your values in .env
```

## 🏗 Development

```
bun install
bun dev
```

## 💻 Production

```
bun install --production --frozen-lockfile
bun start
```

## 🐋 Docker

To start the application:

```bash
docker run -d -p 3000:3000 --env-file .env --name events ghcr.io/parnavh/event-management-system

# OR using docker compose:

docker compose up -d
```

To shut down your application:

```bash
docker stop events
docker rm events        # optionally remove the container

# OR using docker compose:

docker compose down
```

To view your application's logs:

```bash
docker logs events

# OR using docker compose:

docker compose logs
```
