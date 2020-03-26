pimpim.mangoIndexes = {
  "_id": "_design/pimpim_mango_indexes",
  "version": 20200123,
  "language": "query",
  "views": {
    "created-json-index": {
      "map": {
        "fields": {
          "created": "asc"
        },
        "partial_filter_selector": {}
      },
      "reduce": "_count",
      "options": {
        "def": {
          "fields": [
            "created"
          ]
        }
      }
    },
    "start-json-index": {
      "map": {
        "fields": {
          "start": "asc"
        },
        "partial_filter_selector": {}
      },
      "reduce": "_count",
      "options": {
        "def": {
          "fields": [
            "start"
          ]
        }
      }
    },
    "realmTags-json-index": {
      "map": {
        "fields": {
          "realm": "asc",
          "tags": "asc"
        },
        "partial_filter_selector": {}
      },
      "reduce": "_count",
      "options": {
        "def": {
          "fields": [
            "realm",
            "tags"
          ]
        }
      }
    },
    "messages-json-index": {
      "map": {
        "fields": {
          "realm": "asc"
        },
        "partial_filter_selector": {
          "realm": "messages"
        }
      },
      "reduce": "_count",
      "options": {
        "def": {
          "fields": [
            "realm"
          ]
        }
      }
    },
    "productivityOpenStatus-json-index": {
      "map": {
        "fields": {
          "realm": "asc",
          "type": "asc",
          "status": "asc"
        },
        "partial_filter_selector": {
          "realm": "productivity",
          "$nor": [
            {
              "status": "cancelled"
            },
            {
              "status": "done"
            }
          ]
        }
      },
      "reduce": "_count",
      "options": {
        "def": {
          "fields": [
            "realm",
            "type",
            "status"
          ]
        }
      }
    }
  }
}