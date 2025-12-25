{
  "name": "Payment",
  "type": "object",
  "properties": {
    "invoice_id": {
      "type": "string",
      "description": "Related invoice ID"
    },
    "patient_id": {
      "type": "string",
      "description": "Patient ID"
    },
    "patient_name": {
      "type": "string",
      "description": "Patient name"
    },
    "amount": {
      "type": "number",
      "description": "Payment amount in RWF"
    },
    "method": {
      "type": "string",
      "enum": [
        "cash",
        "mtn_momo",
        "airtel_money",
        "bank_transfer",
        "insurance"
      ],
      "description": "Payment method"
    },
    "reference": {
      "type": "string",
      "description": "Transaction reference number"
    },
    "status": {
      "type": "string",
      "enum": [
        "completed",
        "pending",
        "failed",
        "refunded"
      ],
      "default": "completed"
    },
    "received_by": {
      "type": "string",
      "description": "Staff who received payment"
    },
    "notes": {
      "type": "string"
    }
  },
  "required": [
    "patient_id",
    "amount",
    "method"
  ]
}
