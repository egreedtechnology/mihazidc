{
  "name": "Notification",
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "appointment_reminder",
        "appointment_confirmation",
        "appointment_cancelled",
        "payment_received",
        "system_alert"
      ],
      "description": "Notification type"
    },
    "recipient_type": {
      "type": "string",
      "enum": [
        "patient",
        "staff",
        "admin"
      ]
    },
    "recipient_id": {
      "type": "string"
    },
    "recipient_phone": {
      "type": "string"
    },
    "recipient_email": {
      "type": "string"
    },
    "title": {
      "type": "string"
    },
    "message": {
      "type": "string"
    },
    "channel": {
      "type": "string",
      "enum": [
        "whatsapp",
        "sms",
        "email",
        "in_app"
      ],
      "default": "whatsapp"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "sent",
        "delivered",
        "failed"
      ],
      "default": "pending"
    },
    "related_id": {
      "type": "string",
      "description": "Related appointment/payment ID"
    },
    "read": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "type",
    "message"
  ]
}
