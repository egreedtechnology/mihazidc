{
  "name": "PatientIntakeForm",
  "type": "object",
  "properties": {
    "patient_id": {
      "type": "string",
      "description": "Linked patient ID"
    },
    "patient_name": {
      "type": "string",
      "description": "Patient full name"
    },
    "patient_phone": {
      "type": "string",
      "description": "Contact phone"
    },
    "date_of_birth": {
      "type": "string",
      "format": "date"
    },
    "gender": {
      "type": "string",
      "enum": [
        "male",
        "female",
        "other"
      ]
    },
    "address": {
      "type": "string"
    },
    "emergency_contact_name": {
      "type": "string"
    },
    "emergency_contact_phone": {
      "type": "string"
    },
    "medical_conditions": {
      "type": "string",
      "description": "Existing medical conditions"
    },
    "medications": {
      "type": "string",
      "description": "Current medications"
    },
    "allergies": {
      "type": "string",
      "description": "Known allergies"
    },
    "dental_history": {
      "type": "string",
      "description": "Previous dental treatments"
    },
    "insurance_provider": {
      "type": "string"
    },
    "insurance_number": {
      "type": "string"
    },
    "preferred_dentist": {
      "type": "string"
    },
    "how_did_you_hear": {
      "type": "string"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "reviewed",
        "approved"
      ],
      "default": "pending"
    },
    "reviewed_by": {
      "type": "string"
    },
    "notes": {
      "type": "string"
    }
  },
  "required": [
    "patient_name",
    "patient_phone"
  ]
}
