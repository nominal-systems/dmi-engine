# Diagnostic Modality Integration Engine

## Description

Diagnostic Modality Integration Engine built using [Nest](https://github.com/nestjs/nest).

## Installation

```bash
$ npm install
```

## Running the app

1. Create a `.env` file if it doesn't already exist. Take a look at the `.env.example` file for reference.
2. Change parameters in the `docker-compose*.yaml` files as you see fit, and make sure they match with the ones specified in the `.env` file.
3. Choose one of the methods below

### Docker
```bash
# Development
$ docker-compose -f docker-compose.dev.yml up -d

# Development (ActiveMQ broker only)
$ docker-compose -f docker-compose.dev.yml up -d activemq

# Production
$ docker-compose up -d
```

### Local
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```