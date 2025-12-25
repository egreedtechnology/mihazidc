{
  "name": "Patient",
  "type": "object",
  "properties": {
    "full_name": {
      "type": "string",
      "description": "Patient's full name"
    },
    "phone": {
      "type": "string",
      "description": "Phone number"
    },
    "email": {
      "type": "string",
      "description": "Email address (optional)"
    },
    "gender": {
      "type": "string",
      "enum": [
        "male",
        "female",
        "other"
      ],
      "description": "Patient's gender"
    },
    "date_of_birth": {
      "type": "string",
      "format": "date",
      "description": "Date of birth"
    },
    "address": {
      "type": "string",
      "description": "Home address"
    },
    "emergency_contact": {
      "type": "string",
      "description": "Emergency contact name and phone"
    },
    "medical_history": {
      "type": "string",
      "description": "Relevant medical history, allergies"
    },
    "notes": {
      "type": "string",
      "description": "General notes about the patient"
    },
    "profile_image": {
      "type": "string",
      "description": "Patient photo URL"
    },
    "status": {
      "type": "string",
      "enum": [
        "active",
        "inactive"
      ],
      "default": "active"
    },
    "total_visits": {
      "type": "number",
      "default": 0
    },
    "total_spent": {
      "type": "number",
      "default": 0
    },
    "last_visit_date": {
      "type": "string",
      "format": "date"
    }
  },
  "required": [
    "full_name",
    "phone"
  ]
}
