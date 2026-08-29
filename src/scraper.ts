import * as cheerio from "cheerio";
import type { ResumeData, Profile, Stats, Certificate } from "./types.js";

const SKILLRACK_BASE = "https://www.skillrack.com/faces/resume.xhtml";

function parseNumber(text: string): number {
  const match = text.match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, ""), 10) : 0;
}

function parseDate(text: string): string {
  const match = text.match(/(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})/);
  if (!match) return text.trim();
  const [, day, month, year, hours, minutes] = match;
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
}

function parseProfile($: cheerio.CheerioAPI): Profile {
  const profileCol = $(".ui.four.wide.center.aligned.column");

  const name = profileCol.find(".ui.big.label.black").text().trim();
  const department = profileCol.find(".ui.large.label").text().trim();
  const gender = profileCol.find(".ui.fourteen.wide.left.aligned.column").text().trim();
  const profileImage = profileCol.find("img").attr("src")?.replace("?pfdrid_c=true", "") || "";

  const textNodes: string[] = [];
  profileCol.contents().each((_, node) => {
    if (node.type === "text") {
      const text = (node as unknown as Text).data?.trim() || "";
      if (text) textNodes.push(text);
    }
  });

  const rollNumber = textNodes[0] || "";
  const college = textNodes[1] || "";
  const yearText = textNodes[2] || "";

  const yearMatch = yearText.match(/\((.+?)\)\s*(\d{4})/);
  const year = yearMatch ? yearMatch[1] : yearText;
  const batch = yearMatch ? parseInt(yearMatch[2], 10) : 0;

  return { name, rollNumber, department, college, year, batch, gender, profileImage };
}

function parseStats($: cheerio.CheerioAPI): Stats {
  const statsMap: Record<string, string> = {};
  $(".statistic").each((_, el) => {
    const label = $(el).find(".label").text().trim().toUpperCase();
    const value = $(el).find(".value").text().trim();
    statsMap[label] = value;
  });

  const languages: Record<string, number> = {};
  const knownLabels = new Set([
    "RANK", "LEVEL", "GOLD", "SILVER", "BRONZE",
    "PROGRAMS SOLVED", "CODE TEST", "CODE TRACK", "DC", "DT", "CODE TUTOR",
  ]);

  for (const [label, value] of Object.entries(statsMap)) {
    if (!knownLabels.has(label)) {
      languages[label.toLowerCase()] = parseNumber(value);
    }
  }

  return {
    rank: parseNumber(statsMap["RANK"] || "0"),
    level: statsMap["LEVEL"]?.replace(/[^\d/]/g, "") || "0/10",
    medals: {
      gold: parseNumber(statsMap["GOLD"] || "0"),
      silver: parseNumber(statsMap["SILVER"] || "0"),
      bronze: parseNumber(statsMap["BRONZE"] || "0"),
    },
    problemsSolved: {
      total: parseNumber(statsMap["PROGRAMS SOLVED"] || "0"),
      codeTest: parseNumber(statsMap["CODE TEST"] || "0"),
      codeTrack: parseNumber(statsMap["CODE TRACK"] || "0"),
      dailyChallenge: parseNumber(statsMap["DC"] || "0"),
      dailyTest: parseNumber(statsMap["DT"] || "0"),
      codeTutor: parseNumber(statsMap["CODE TUTOR"] || "0"),
    },
    languages,
  };
}

function parseCertificates($: cheerio.CheerioAPI): { count: number; list: Certificate[] } {
  const countText = $(".ui.circular.big.label").text().trim();
  const count = parseInt(countText, 10) || 0;

  const list: Certificate[] = [];
  $(".ui.brown.card").each((_, el) => {
    const title = $(el).find("b").text().trim();
    const link = $(el).find("a").attr("href") || "";

    let dateText = "";
    $(el).find(".content").contents().each((_, node) => {
      if (node.type === "text") {
        const text = (node as unknown as Text).data?.trim() || "";
        if (/\d{2}-\d{2}-\d{4}/.test(text)) {
          dateText = text;
        }
      }
    });

    list.push({ title, date: parseDate(dateText), link });
  });

  return { count, list };
}

export async function fetchResume(id: string, key: string): Promise<ResumeData> {
  const url = `${SKILLRACK_BASE}?id=${encodeURIComponent(id)}&key=${encodeURIComponent(key)}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!response.ok) {
    throw new Error(`SkillRack returned HTTP ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const profileCol = $(".ui.four.wide.center.aligned.column");
  if (profileCol.length === 0) {
    throw new Error("Invalid profile: no resume data found for this id/key combination");
  }

  return {
    profile: parseProfile($),
    stats: parseStats($),
    certificates: parseCertificates($),
  };
}
