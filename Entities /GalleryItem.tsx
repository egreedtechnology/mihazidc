{
  "name": "GalleryItem",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Image or video title"
    },
    "description": {
      "type": "string",
      "description": "Description"
    },
    "media_url": {
      "type": "string",
      "description": "Image or video URL"
    },
    "thumbnail_url": {
      "type": "string",
      "description": "Thumbnail for videos"
    },
    "media_type": {
      "type": "string",
      "enum": [
        "image",
        "video"
      ],
      "description": "Type of media"
    },
    "category": {
      "type": "string",
      "enum": [
        "clinic_tour",
        "procedures",
        "team_action",
        "facilities",
        "equipment",
        "before_after"
      ],
      "description": "Gallery category"
    },
    "order": {
      "type": "number",
      "default": 0,
      "description": "Display order"
    },
    "is_featured": {
      "type": "boolean",
      "default": false
    },
    "status": {
      "type": "string",
      "enum": [
        "active",
        "inactive"
      ],
      "default": "active"
    }
  },
  "required": [
    "title",
    "media_url",
    "media_type",
    "category"
  ]
}
