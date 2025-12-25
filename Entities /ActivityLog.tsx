{
  "name": "ActivityLog",
  "type": "object",
  "properties": {
    "action": {
      "type": "string",
      "enum": [
        "create",
        "update",
        "delete",
        "login",
        "logout",
        "view",
        "export",
        "payment"
      ],
      "description": "Action type"
    },
    "entity_type": {
      "type": "string",
      "description": "Type of entity affected"
    },
    "entity_id": {
      "type": "string",
      "description": "ID of affected entity"
    },
    "user_id": {
      "type": "string",
      "description": "User who performed action"
    },
    "user_name": {
      "type": "string"
    },
    "user_role": {
      "type": "string"
    },
    "details": {
      "type": "string",
      "description": "Additional details"
    },
    "ip_address": {
      "type": "string"
    }
  },
  "required": [
    "action",
    "entity_type"
  ]
}
