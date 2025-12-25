{
  "name": "PatientHealthRecord",
  "type": "object",
  "properties": {
    "patient_id": {
      "type": "string",
      "description": "Patient ID"
    },
    "patient_name": {
      "type": "string",
      "description": "Patient name"
    },
    "record_type": {
      "type": "string",
      "enum": [
        "medical_history",
        "allergy",
        "treatment_note",
        "diagnostic_report",
        "prescription",
        "x_ray",
        "lab_result",
        "consultation"
      ],
      "description": "Type of health record"
    },
    "title": {
      "type": "string",
      "description": "Record title"
    },
    "description": {
      "type": "string",
      "description": "Detailed description"
    },
    "diagnosis": {
      "type": "string",
      "description": "Medical diagnosis"
    },
    "treatment": {
      "type": "string",
      "description": "Treatment provided"
    },
    "medications": {
      "type": "string",
      "description": "Prescribed medications"
    },
    "allergies": {
      "type": "string",
      "description": "Known allergies"
    },
    "symptoms": {
      "type": "string",
      "description": "Patient symptoms"
    },
    "files": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Uploaded file URLs (X-rays, reports, images)"
    },
    "dentist_id": {
      "type": "string",
      "description": "Treating dentist ID"
    },
    "dentist_name": {
      "type": "string",
      "description": "Treating dentist name"
    },
    "visit_date": {
      "type": "string",
      "format": "date",
      "description": "Date of visit or record"
    },
    "follow_up_required": {
      "type": "boolean",
      "default": false
    },
    "follow_up_date": {
      "type": "string",
      "format": "date"
    },
    "is_confidential": {
      "type": "boolean",
      "default": true
    },
    "ai_summary": {
      "type": "string",
      "description": "AI-generated summary"
    }
  },
  "required": [
    "patient_id",
    "record_type",
    "title"
  ]
}
