# Document data models

In the standard apps, the document data model follows a few rules.
CouchDB's own `_id` values are replaced with UUIDv4.
Every document belongs to a "realm", for organization and making queries more effective.

## Productivity

The Tasks, Note and Journal apps all use `"realm":"prouctivity"`

realm: productivity
type: either task, project or note

**Example:**
```json
{
    "_id":"1285fefa-f648-4baa-b7e7-be9b2ab8bb6d",
    "realm":"productivity",
    "type":"task",
    "due":"2020-12-31T23:59:58",
    "start":"2020-12-31T09:00:00",
    "end":null,
    "title":"That important thing I need to do. Or else..",
    "description":"I have to do the thing on that day. Not before. Not after. No wonder why I'm stressed out.",
    "created":"2019-12-31T00:00:00",
    "status":"todo",
    "project":"Prevent disaster",
    "context":"at home",
    "priority":2,
    "tags":[]
}
```

## Messages

The Messages app uses `"realm":"messages"`. `read` is optional, but will be added during certain actions in the messages app.

**Example:**
```json
{
    "_id":"ba5b97dc-33eb-40fd-a689-e78e0ae194f3",
    "realm":"messages",
    "sender":"Hal 9000",
    "recipient":"Bender",
    "subject":"Last message",
    "body":"A Bicycle Built for Two",
    "created":"2019-12-31T00:00:00",
    "tags":["Infosphere","Central Bureaucracy"]
    "read":false,
}
```