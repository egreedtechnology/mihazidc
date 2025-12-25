{
  "name": "TreatmentRecord",
  "type": "object",
  "properties": {
    "patient_id": {
      "type": "string",
      "description": "Patient ID"
    },
    "patient_name": {
      "type": "string"
    },
    "appointment_id": {
      "type": "string"
    },
    "dentist_id": {
      "type": "string"
    },
    "dentist_name": {
      "type": "string"
    },
    "service_id": {
      "type": "string"
    },
    "service_name": {
      "type": "string"
    },
    "diagnosis": {
      "type": "string"
    },
    "treatment_performed": {
      "type": "string"
    },
    "teeth_involved": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Tooth numbers involved"
    },
    "notes": {
      "type": "string"
    },
    "prescriptions": {
      "type": "string"
    },
    "follow_up_required": {
      "type": "boolean",
      "default": false
    },
    "follow_up_date": {
      "type": "string",
      "format": "date"
    },
    "images": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "X-ray and treatment images"
    },
    "before_images": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "after_images": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "patient_id",
    "service_name",
    "treatment_performed"
  ]
}
