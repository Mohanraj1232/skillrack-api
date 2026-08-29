# SkillRack API

A REST API that scrapes [SkillRack](https://www.skillrack.com) public resume pages and returns structured JSON data. Includes a built-in web frontend for browsing profiles.

**Live**: [skillrack-api.mohanrajg.me](https://skillrack-api.mohanrajg.me/)

## How to Find Your SkillRack ID and Resume Key

1. Log in to [skillrack.com](https://www.skillrack.com)
2. Go to **Profile** and click **Share Resume** (or navigate to the public resume page)
3. Your public resume URL will look like this:

```
https://www.skillrack.com/faces/resume.xhtml?id=447787&key=mohanraj-g
                                                 ^^^^^^     ^^^^^^^^^^
                                                   id           key
```

4. Copy the `id` and `key` values from the URL — that's all you need

## Frontend Usage

Visit the web app and enter your SkillRack ID and Resume Key:

```
https://skillrack-api.mohanrajg.me/?id=447787&key=mohanraj-g
```

The page displays your complete SkillRack profile including:
- Profile info (name, college, department, year)
- Programming stats (rank, medals, problems solved)
- Language breakdown (C, Java, Python, etc.)
- All certificates with links

You can also bookmark or share the URL — the ID and key are stored in the query params.

## API Usage

### `GET /api/profile?id={id}&key={key}`

```bash
curl "https://skillrack-api.mohanrajg.me/api/profile?id=447787&key=mohanraj-g"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "profile": {
      "name": "MOHANRAJ G",
      "rollNumber": "312423104142",
      "department": "CSE",
      "college": "St.Joseph's Institute of Technology, Chennai",
      "year": "Final Year",
      "batch": 2027,
      "gender": "Male",
      "profileImage": "https://cdn.skillrack.com/profilepic/personal-2.png"
    },
    "stats": {
      "rank": 1845,
      "level": "0/10",
      "medals": { "gold": 0, "silver": 0, "bronze": 846 },
      "problemsSolved": {
        "total": 2287,
        "codeTest": 108,
        "codeTrack": 1528,
        "dailyChallenge": 86,
        "dailyTest": 54,
        "codeTutor": 511
      },
      "languages": { "c": 1140, "java": 576, "python3": 375, "cpp23": 141, "sql": 53, "cpp": 2 }
    },
    "certificates": {
      "count": 26,
      "list": [
        {
          "title": "Bronze Medals - 700",
          "date": "2025-09-17T19:05:00",
          "link": "https://www.skillrack.com/cert/589773/DRG"
        }
      ]
    }
  }
}
```

**Error Responses:**

| Status | Reason                              |
|--------|-------------------------------------|
| 400    | Missing `id` or `key` parameter    |
| 404    | Invalid profile (no data found)     |
| 502    | SkillRack is unreachable            |

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Scraping:** Cheerio
- **Frontend:** Vanilla HTML/CSS/JS (dark/light mode, responsive)
- **Deployment:** Vercel Serverless Functions (Mumbai region)

## License

MIT

## Author

Developed by **Mohanraj G**
