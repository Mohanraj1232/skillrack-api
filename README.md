# SkillRack API

A REST API that scrapes [SkillRack](https://www.skillrack.com) public resume pages and returns structured JSON data. Includes a built-in web frontend for browsing profiles.

## Features

- Scrapes profile info, programming stats, language breakdown, and certificates
- Clean JSON API with error handling
- Dark/light mode frontend with responsive design
- Deployable to Vercel as serverless functions
- No authentication required — uses public resume links

## API Usage

### `GET /api/profile?id={id}&key={key}`

Fetches and parses a SkillRack public resume.

**Parameters:**

| Param | Type   | Description                          |
|-------|--------|--------------------------------------|
| `id`  | string | SkillRack user ID                    |
| `key` | string | Resume key from the public share URL |

You can find these values in any SkillRack public resume URL:
```
https://www.skillrack.com/faces/resume.xhtml?id=447801&key=nitish1705
                                                 ^^^^^^     ^^^^^^^^^^
                                                   id           key
```

**Example Request:**

```bash
curl "http://localhost:3000/api/profile?id=447801&key=nitish1705"
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "profile": {
      "name": "NITISH M",
      "rollNumber": "312423104156",
      "department": "CSE",
      "college": "St.Joseph's Institute of Technology, Chennai",
      "year": "Final Year",
      "batch": 2027,
      "gender": "Male",
      "profileImage": "https://cdn.skillrack.com/profilepic/personal-2.png"
    },
    "stats": {
      "rank": 15772,
      "level": "0/10",
      "medals": { "gold": 0, "silver": 0, "bronze": 494 },
      "problemsSolved": {
        "total": 1236,
        "codeTest": 82,
        "codeTrack": 720,
        "dailyChallenge": 48,
        "dailyTest": 40,
        "codeTutor": 346
      },
      "languages": { "c": 504, "java": 364, "python3": 265, "sql": 53, "cpp23": 50 }
    },
    "certificates": {
      "count": 17,
      "list": [
        {
          "title": "C - ARITHMETIC OPERATORS (Video Explanation)",
          "date": "2024-08-26T23:58:00",
          "link": "https://www.skillrack.com/cert/522611/MAS"
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

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/skillrack-api.git
cd skillrack-api
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the web frontend, or hit the API directly.

### Build

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository
3. Click **Deploy** — no configuration needed

The `vercel.json` is already configured to route API requests to the serverless function and serve the frontend as static files.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Scraping:** Cheerio
- **Frontend:** Vanilla HTML/CSS/JS (single file, no build step)
- **Deployment:** Vercel Serverless Functions

## Project Structure

```
skillrack-api/
├── public/
│   └── index.html      # Web frontend (dark/light mode)
├── src/
│   ├── app.ts          # Express app, routes, static serving
│   ├── scraper.ts      # SkillRack HTML fetch + Cheerio parsing
│   ├── server.ts       # Local dev entry point
│   └── types.ts        # TypeScript interfaces
├── api/
│   └── index.ts        # Vercel serverless entry point
├── vercel.json         # Vercel routing config
├── tsconfig.json
└── package.json
```

## License

MIT
