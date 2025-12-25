{
  "name": "Staff",
  "type": "object",
  "properties": {
    "full_name": {
      "type": "string",
      "description": "Staff member's full name"
    },
    "email": {
      "type": "string",
      "description": "Email address"
    },
    "phone": {
      "type": "string",
      "description": "Phone number"
    },
    "role": {
      "type": "string",
      "enum": [
        "dentist",
        "therapist",
        "receptionist",
        "admin",
        "pro",
        "assistant"
      ],
      "description": "Staff role"
    },
    "specialization": {
      "type": "string",
      "description": "For dentists - their specialization"
    },
    "bio": {
      "type": "string",
      "description": "Short biography"
    },
    "photo": {
      "type": "string",
      "description": "Profile photo URL"
    },
    "working_days": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Days of the week they work"
    },
    "start_time": {
      "type": "string",
      "description": "Work start time (HH:MM)"
    },
    "end_time": {
      "type": "string",
      "description": "Work end time (HH:MM)"
    },
    "services": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Service IDs this staff can perform"
    },
    "status": {
      "type": "string",
      "enum": [
        "active",
        "inactive"
      ],
      "default": "active"
    },
    "user_id": {
      "type": "string",
      "description": "Linked user account ID"
    }
  },
  "required": [
    "full_name",
    "role"
  ]
}
