{
  "name": "Service",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Service name"
    },
    "name_rw": {
      "type": "string",
      "description": "Service name in Kinyarwanda"
    },
    "description": {
      "type": "string",
      "description": "Service description"
    },
    "description_rw": {
      "type": "string",
      "description": "Description in Kinyarwanda"
    },
    "category": {
      "type": "string",
      "enum": [
        "routine",
        "cosmetic",
        "emergency",
        "surgical",
        "preventive"
      ],
      "description": "Service category"
    },
    "price": {
      "type": "number",
      "description": "Price in RWF"
    },
    "duration": {
      "type": "number",
      "description": "Duration in minutes"
    },
    "icon": {
      "type": "string",
      "description": "Icon name for display"
    },
    "status": {
      "type": "string",
      "enum": [
        "active",
        "inactive"
      ],
      "default": "active"
    },
    "popular": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "name",
    "price",
    "duration",
    "category"
  ]
}
