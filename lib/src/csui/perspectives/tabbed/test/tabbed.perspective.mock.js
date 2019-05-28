/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define({
  "header": {
    "widget": {
      "type": "favorites"
    }
  },
  "tabs": [
    {
      "title": "Overview",
      "columns": [
        {
          "sizes": {
            "md": 6,
            "xl": 4
          },
          "widget": {
            "type": "myassignments"
          }
        }
      ]
    },
    {
      "title": "Documents",
      "columns": [
        {
          "sizes": {
            "md": 6,
            "xl": 4
          },
          "widget": {
            "type": "recentlyaccessed"
          }
        }
      ]
    }
  ]
});
