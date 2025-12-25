{
  "name": "Appointment",
  "type": "object",
  "properties": {
    "patient_id": {
      "type": "string",
      "description": "Patient ID"
    },
    "patient_name": {
      "type": "string",
      "description": "Patient name (for quick reference)"
    },
    "patient_phone": {
      "type": "string",
      "description": "Patient phone"
    },
    "staff_id": {
      "type": "string",
      "description": "Assigned dentist/staff ID"
    },
    "staff_name": {
      "type": "string",
      "description": "Staff name for quick reference"
    },
    "service_id": {
      "type": "string",
      "description": "Service ID"
    },
    "service_name": {
      "type": "string",
      "description": "Service name for quick reference"
    },
    "date": {
      "type": "string",
      "format": "date",
      "description": "Appointment date"
    },
    "time": {
      "type": "string",
      "description": "Appointment time (HH:MM)"
    },
    "end_time": {
      "type": "string",
      "description": "End time (HH:MM)"
    },
    "duration": {
      "type": "number",
      "description": "Duration in minutes"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "no_show"
      ],
      "default": "pending"
    },
    "notes": {
      "type": "string",
      "description": "Appointment notes"
    },
    "treatment_notes": {
      "type": "string",
      "description": "Notes from the treatment"
    },
    "source": {
      "type": "string",
      "enum": [
        "online",
        "phone",
        "walk_in"
      ],
      "default": "online"
    },
    "reminder_sent": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "patient_name",
    "patient_phone",
    "service_id",
    "date",
    "time"
  ]
}
