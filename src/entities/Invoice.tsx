{
  "name": "Invoice",
  "type": "object",
  "properties": {
    "invoice_number": {
      "type": "string",
      "description": "Unique invoice number"
    },
    "patient_id": {
      "type": "string",
      "description": "Patient ID"
    },
    "patient_name": {
      "type": "string"
    },
    "patient_phone": {
      "type": "string"
    },
    "appointment_id": {
      "type": "string",
      "description": "Related appointment"
    },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "service_id": {
            "type": "string"
          },
          "service_name": {
            "type": "string"
          },
          "quantity": {
            "type": "number"
          },
          "unit_price": {
            "type": "number"
          },
          "total": {
            "type": "number"
          }
        }
      }
    },
    "subtotal": {
      "type": "number"
    },
    "discount": {
      "type": "number",
      "default": 0
    },
    "discount_reason": {
      "type": "string"
    },
    "total": {
      "type": "number"
    },
    "amount_paid": {
      "type": "number",
      "default": 0
    },
    "balance": {
      "type": "number"
    },
    "status": {
      "type": "string",
      "enum": [
        "draft",
        "sent",
        "paid",
        "partial",
        "overdue",
        "cancelled"
      ],
      "default": "draft"
    },
    "due_date": {
      "type": "string",
      "format": "date"
    },
    "notes": {
      "type": "string"
    }
  },
  "required": [
    "patient_id",
    "items",
    "total"
  ]
}
