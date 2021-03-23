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

# Development (ActiveMQ + Redis only)
$ docker-compose -f docker-compose.dev.yml up -d activemq redis

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

## Events

The API Service can message the Integration Engine by pushing Events with the following structure:
- `id` UUID that identifies the event.
  - Type: String
  - Required
- `version` Version of the event schema.
  - Type: String
  - Required
- `type` Describes the type of event related to the originating occurrence.
  - Type: String
  - Required
- `data` Event-specific data. This MAY include a property `providerConfiguration` with specific credentials/endpoints/parameters related to the provider (as specified in the [Provider Configuration](https://linestudio.stoplight.io/docs/diagnostic-modality-integration/docs/providers/readme.md#how-to-configure-a-provider)), MAY include a `integrationOptions` property with the integration specific parameters created when an [integration is configured](https://linestudio.stoplight.io/docs/diagnostic-modality-integration/docs/getting-started.md#5-connect-the-practice-with-a-provider) and MAY include a property `payload` with any specific payload included in the User's originating request.
  - Type: Object
  - Optional 
  
For example, the event object generated to create an Order for Zoetis could look like:

```json
{
  "id": "28986494-8038-11eb-9439-0242ac130002",
  "version": "1.0.0",
  "type": "zoetis-v1.orders.create",
  "data": {
    "providerConfiguration": {
      "url": "https://qa.vetscanconnect.zoetis.com",
      "partnerId": "partner-id",
      "partnerToken": "TOKEN"
    },
    "integrationOptions": {
      "clientId": "f1cc5ab3-c563-47be-86f8-837e14a2228f"
    },
    "payload": {
      "id": "659242ae-39ae-4b80-a543-3ab7a1ba2c41",
      "patient": {
        "id": "659242ae-39ae-4b80-a543-3ab7a1ba2c41",
        "lastName": "Snow",
        "firstname": "John",
        "species": "CANINE",
        "gender": "FEMALE_INTACT",
        "birthdate": "2020-10-10",
        "breed": "BOXER",
        "weight": 10.0,
        "weightUnits": "KG"
      },
      "client": {
        "id": "c9dc355c-73b5-4258-b0b6-88784bbffc76",
        "lastName": "Corleone",
        "firstName": "Michael"
      },
      "notes": "Some notes here",
      "tests": [
        {
          "code": "HEM"
        }
      ],
      "veterinarian": {
        "id": "c9dc355c-73b5-4258-b0b6-88784bbffc76",
        "lastName": "Böse",
        "firstName": "Hannah"
      },
      "technician": "John Smith",
      "editable": false
    }
  }
}
```

### Event types

Event types are specified in a hierarchical manner, according to the following hierarchy:
- Provider ID
  - Resource
    - Operation

The following are valid examples of event types:
- zoetis-v1.orders.create
- zoetis-v1.orders.cancel
- zoetis-v1.orders.search
- zoetis-v1.orders.get
- zoetis-v1.orders.results
- zoetis-v1.orders.tests.cancel
- zoetis-v1.orders.tests.add
- zoetis-v1.services.list
- zoetis-v1.genders.list
- zoetis-v1.species.list
- zoetis-v1.breeds.list

## Interface between the Integration Engine and the Provider Service

The provider service will receive a JSON object with the following structure (very similar to the events schema):

### Create order
```json
{
  "resource": "orders",
  "operation": "create",
  "data": {
    "providerConfiguration": {
      "url": "https://qa.vetscanconnect.zoetis.com",
      "partnerId": "partner-id",
      "partnerToken": "TOKEN"
    },
    "integrationOptions": {
      "clientId": "f1cc5ab3-c563-47be-86f8-837e14a2228f"
    },
    "payload": {
      "id": "659242ae-39ae-4b80-a543-3ab7a1ba2c41",
      "patient": {
        "id": "659242ae-39ae-4b80-a543-3ab7a1ba2c41",
        "lastName": "Snow",
        "firstname": "John",
        "species": "CANINE",
        "gender": "FEMALE_INTACT",
        "birthdate": "2020-10-10",
        "breed": "BOXER",
        "weight": 10.0,
        "weightUnits": "KG"
      },
      "client": {
        "id": "c9dc355c-73b5-4258-b0b6-88784bbffc76",
        "lastName": "Corleone",
        "firstName": "Michael"
      },
      "notes": "Some notes here",
      "tests": [
        {
          "code": "HEM"
        }
      ],
      "veterinarian": {
        "id": "c9dc355c-73b5-4258-b0b6-88784bbffc76",
        "lastName": "Böse",
        "firstName": "Hannah"
      },
      "technician": "John Smith",
      "editable": false
    }
  }
}
```

### Cancel order
```json
{
  "resource": "orders",
  "operation": "cancel",
  "data": {
    "providerConfiguration": {
      "url": "https://qa.vetscanconnect.zoetis.com",
      "partnerId": "partner-id",
      "partnerToken": "TOKEN"
    },
    "integrationOptions": {
      "clientId": "f1cc5ab3-c563-47be-86f8-837e14a2228f"
    },
    "payload": {
      "id": "659242ae-39ae-4b80-a543-3ab7a1ba2c41"
    }
  }
}
```

### Cancel a test in an order
```json
{
  "resource": "orders",
  "operation": "tests.cancel",
  "data": {
    "providerConfiguration": {
      "url": "https://qa.vetscanconnect.zoetis.com",
      "partnerId": "partner-id",
      "partnerToken": "TOKEN"
    },
    "integrationOptions": {
      "clientId": "f1cc5ab3-c563-47be-86f8-837e14a2228f"
    },
    "payload": {
      "id": "659242ae-39ae-4b80-a543-3ab7a1ba2c41",
      "tests": [
        {
          "code": "HEM"
        }
      ]
    }
  }
}
```

### Get a result
```json
{
  "resource": "orders",
  "operation": "results",
  "data": {
    "providerConfiguration": {
      "url": "https://qa.vetscanconnect.zoetis.com",
      "partnerId": "partner-id",
      "partnerToken": "TOKEN"
    },
    "integrationOptions": {
      "clientId": "f1cc5ab3-c563-47be-86f8-837e14a2228f"
    },
    "payload": {
      "id": "659242ae-39ae-4b80-a543-3ab7a1ba2c41"
    }
  }
}
```

### Get directory of services
```json
{
  "resource": "services",
  "operation": "list",
  "data": {
    "providerConfiguration": {
      "url": "https://qa.vetscanconnect.zoetis.com",
      "partnerId": "partner-id",
      "partnerToken": "TOKEN"
    },
    "integrationOptions": {
      "clientId": "f1cc5ab3-c563-47be-86f8-837e14a2228f"
    },
    "payload": null
  }
}
```

### Get directory of services
```json
{
  "resource": "services",
  "operation": "list",
  "data": {
    "providerConfiguration": {
      "url": "https://qa.vetscanconnect.zoetis.com",
      "partnerId": "partner-id",
      "partnerToken": "TOKEN"
    },
    "integrationOptions": {
      "clientId": "f1cc5ab3-c563-47be-86f8-837e14a2228f"
    },
    "payload": null
  }
}
```

### Get genders
```json
{
  "resource": "genders",
  "operation": "list",
  "data": {
    "providerConfiguration": {
      "url": "https://qa.vetscanconnect.zoetis.com",
      "partnerId": "partner-id",
      "partnerToken": "TOKEN"
    },
    "integrationOptions": {
      "clientId": "f1cc5ab3-c563-47be-86f8-837e14a2228f"
    },
    "payload": null
  }
}
```

### Get species
```json
{
  "resource": "species",
  "operation": "list",
  "data": {
    "providerConfiguration": {
      "url": "https://qa.vetscanconnect.zoetis.com",
      "partnerId": "partner-id",
      "partnerToken": "TOKEN"
    },
    "integrationOptions": {
      "clientId": "f1cc5ab3-c563-47be-86f8-837e14a2228f"
    },
    "payload": null
  }
}
```

### Get breeds
```json
{
  "resource": "breeds",
  "operation": "list",
  "data": {
    "providerConfiguration": {
      "url": "https://qa.vetscanconnect.zoetis.com",
      "partnerId": "partner-id",
      "partnerToken": "TOKEN"
    },
    "integrationOptions": {
      "clientId": "f1cc5ab3-c563-47be-86f8-837e14a2228f"
    },
    "payload": null
  }
}
```
