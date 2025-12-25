{
  "name": "SocialMedia",
  "type": "object",
  "properties": {
    "platform": {
      "type": "string",
      "enum": [
        "facebook",
        "instagram",
        "twitter",
        "linkedin",
        "youtube",
        "tiktok",
        "whatsapp"
      ],
      "description": "Social media platform"
    },
    "handle": {
      "type": "string",
      "description": "Username or handle"
    },
    "url": {
      "type": "string",
      "description": "Full URL to profile"
    },
    "icon": {
      "type": "string",
      "description": "Icon identifier"
    },
    "is_active": {
      "type": "boolean",
      "default": true
    },
    "order": {
      "type": "number",
      "default": 0
    }
  },
  "required": [
    "platform",
    "url"
  ]
}
