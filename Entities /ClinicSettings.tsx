{
  "name": "ClinicSettings",
  "type": "object",
  "properties": {
    "clinic_name": {
      "type": "string",
      "default": "Muhazi Dental Clinic"
    },
    "tagline": {
      "type": "string"
    },
    "phone": {
      "type": "string"
    },
    "whatsapp": {
      "type": "string"
    },
    "email": {
      "type": "string"
    },
    "address": {
      "type": "string"
    },
    "city": {
      "type": "string"
    },
    "country": {
      "type": "string",
      "default": "Rwanda"
    },
    "opening_time": {
      "type": "string",
      "default": "08:00"
    },
    "closing_time": {
      "type": "string",
      "default": "20:00"
    },
    "working_days": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "currency": {
      "type": "string",
      "default": "RWF"
    },
    "logo": {
      "type": "string"
    },
    "primary_color": {
      "type": "string",
      "default": "#0D9488"
    },
    "appointment_buffer": {
      "type": "number",
      "default": 15,
      "description": "Minutes between appointments"
    },
    "reminder_hours_before": {
      "type": "number",
      "default": 24
    },
    "enable_online_booking": {
      "type": "boolean",
      "default": true
    },
    "require_approval": {
      "type": "boolean",
      "default": true
    },
    "payment_methods": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "clinic_name"
  ],
  "rls": {
    "create": {
      "created_by": "{{user.email}}"
    }
  }
}
