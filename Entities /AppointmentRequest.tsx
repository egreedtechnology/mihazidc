{
  "name": "AppointmentRequest",
  "type": "object",
  "properties": {
    "appointment_id": {
      "type": "string",
      "description": "Original appointment ID"
    },
    "patient_name": {
      "type": "string"
    },
    "patient_phone": {
      "type": "string"
    },
    "request_type": {
      "type": "string",
      "enum": [
        "reschedule",
        "cancel"
      ],
      "description": "Type of request"
    },
    "current_date": {
      "type": "string",
      "format": "date"
    },
    "current_time": {
      "type": "string"
    },
    "requested_date": {
      "type": "string",
      "format": "date",
      "description": "For reschedule requests"
    },
    "requested_time": {
      "type": "string",
      "description": "For reschedule requests"
    },
    "reason": {
      "type": "string",
      "description": "Reason for request"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "approved",
        "rejected"
      ],
      "default": "pending"
    },
    "handled_by": {
      "type": "string"
    },
    "admin_notes": {
      "type": "string"
    }
  },
  "required": [
    "appointment_id",
    "patient_name",
    "patient_phone",
    "request_type"
  ]
}
