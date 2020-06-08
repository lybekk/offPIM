---
title: Behind the scenes
---

* TOC
{:toc}

## Document data models

**(Not finalized)**

The document data model follows a few rules.
CouchDB's own `_id` values are replaced with UUIDv4.
Every document has a certain boolean field, for organization and making queries more effective.

### Tasks, projects and notes

**(Tasks, projects and notes will be migrated to fit a model from Schema.org)**

The Tasks and Note apps use `"productivity": true`

type: either task, project or note
created: required for Mango queries to find and sort documents.
project: For tasks. Holds the _id of the project the task belongs to.

**Example:**
```json
{
    "_id":"1285fefa-f648-4baa-b7e7-be9b2ab8bb6d",
    "productivity":true,
    "type":"task",
    "due":"2020-12-31T23:59:58",
    "start":"2020-12-31T09:00:00",
    "end":null,
    "title":"That important thing I need to do. Or else..",
    "description":"I have to do the thing on that day. Not before. Not after.",
    "created":"2019-12-31T00:00:00",
    "status":"todo",
    "project":"466e5986-b157-4951-9e24-f627ea1dd8ea",
    "context":"at home",
    "priority":2,
    "tags":["crucial", "chores"]
}
```

### Contacts

Contacts semi-adheres to [Schema.org](https://schema.org), simplifying export for rich search results (JSON-LD).

#### Person

Key distinguishing property:
    `"@type": "Person"`

**Example:**
```json
{
    "_id":"65584923-2a21-47b3-8fd0-0ac5ad34a4bd",
    "created":"2019-12-31T00:00:00",
    "@type": "Person",
    "givenName": "Man",
    "additionalName": "Bro",
    "familyName": "Dudeson",
    "gender": "cyborg",
    "contactPoint": [
        {
            "email": "mail.e@company.com",
            "contactType": "Work"
        },
        {
            "telephone": "555-123456789",
            "contactType": "Work"
        },
    ],
    "spouse": {
        "identifier": "e4bb600d-60a5-4ef5-bad7-851fd4c6f508",
        "name": "Signi Ficanto Ther"
    },
    "keywords": [
        "Will be implemented",
        "Soon"
    ],
    "birthDate": "1970-12-31T00:00:00.000Z",

    "knowsAbout": [
        "Finance",
        "Javascript"
    ],
    "description": "Important detail that best not be forgotten",
    "knowsLanguage": [
        "no",
        "en"
    ],
    "jobTitle": "Hyperbole",
    "telephone": "555-987654321",
    "email": "funnyname70@coldmail.com",
    "url": "https://lybekk.tech",
    "address": {
        "streetAddress": "Wayroad 1",
        "addressLocality": "Citypart",
        "postalCode": "1234",
        "addressRegion": "New Bark",
        "addressCountry": "Youessay"
    },
    "favorite": true
}
```

#### Organization

Key distinguishing property:
    `"@type": "Organization"`

**Example:**
```json
{
    "_id":"635ca124-b060-455f-8a1b-61885ccff0ea",
    "created":"2005-12-31T00:00:00",
    "@type": "Organization",
    "address": {
        "streetAddress": "Slough Avenue",
        "postalCode": "1725",
        "addressLocality": "Scranton ",
        "addressRegion": "Pennsylvania ",
        "addressCountry": "USA"
    },
    "email": "creed.bratton@dundermifflin.com",
    "url": "dundermifflin.com",
    "legalName": "Dunder Mifflin Paper Company, Inc.",
    "description": "Doing biznus, as in Boboddy",
    "telephone": "555-444888222",
    "contactPoint": [],
    "keywords": [
        "paper",
        "threat level midnight"
    ],
    "location": {
        "@type": "Place",
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "34.210704",
            "longitude": "-118.436473"
        }
    },
    "additionalType": "Office supplies"
}
```

### Logbook (Logs)

**Example:**
```json
{
    "_id":"fc869aa0-84d1-458c-8c91-41d707f281ea",
    "logbook": true,
    "title":"Replaced items in vending machine",
    "description":"Lemon-lime soda cans replaced with orange flavored ones",
    "start":"2020-12-31T09:00:00",
    "end":null,
    "category": "Plot",
    "tags": ["conspiracy", "gunther"],
    "created":"2019-12-31T00:00:00"
}
```

### Messages

Key distinguishing property:
    `"@type": "Message"`

`dateRead` is optional, but will be added during certain actions in the messages app.

**Example:**
```json
{
    "_id": "22036bd4-d63d-40a4-be0f-f394360e8228",
    "@type": "Message",
    "sender": {
        "name": "Hal 9000"
    },
    "recipient": {
        "name": "Bender"
    },
    "messageAttachment": {
        "headline": "Last message",
        "text": "A bicycle built for two"
    },
    "keywords": ["Infosphere","Central Bureaucracy"],
    "dateRead": "2020-06-03T01:21:59.694Z",
    "dateSent": "2020-06-02T14:28:31.925Z"
}
```

### Finance

The finance module will be rebuilt to fit Schema.org's model.

#### Budget

Type: income or expense

**Example:**
```json
{
    "_id":"17b6524b-54fc-43d4-929f-2bdd5368637c",
    "finance": true,
    "type": "income",
    "created": "2020-05-22T11:52:09.706Z",
    "description": "Free form description",
    "category": "income/expense category",
    "active": true,
    "currency": "USD",
    "amount": 0.0,
    "name": "Label distinguishing the entry",
    "institution": "Company name"
}
```

#### Transaction

Not finalized. Sender and recipient may be connected to contacts in some way.

type: will always be 'transaction'

**Example:**
```json
{
    "_id":"346d8f3d-8e47-4b27-8809-5400b9a5a60a",
    "finance": true,
    "type": "transaction",
    "created": "2020-05-22T11:52:09.706Z",
    "description": "Free form description",
    "category": "transaction category",
    "amount": 0.0,
    "sender": "Sender name",
    "recipient":"Recipient name"
}
```

#### Account

balanceUpdatedDate: When the balance was last updated

**Example:**
```json
{
    "_id":"875ec6aa-3bc2-4c53-a5b3-080ca7592311",
    "finance": true,
    "type": "i.e. cash or credit card",
    "created": "2020-05-22T11:52:09.706Z",
    "description": "Free form description",
    "category": "account category dependent on type",
    "active": true,
    "currency": "USD",
    "balance": 0.0,
    "name": "Account label",
    "institution": "Company name holding the account",
    "number": "account identifier issued by the institution",
    "balanceUpdatedDate": "2020-05-21T11:52:09.706Z"
}
```