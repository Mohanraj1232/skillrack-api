export interface Profile {
  name: string;
  rollNumber: string;
  department: string;
  college: string;
  year: string;
  batch: number;
  gender: string;
  profileImage: string;
}

export interface Medals {
  gold: number;
  silver: number;
  bronze: number;
}

export interface ProblemsSolved {
  total: number;
  codeTest: number;
  codeTrack: number;
  dailyChallenge: number;
  dailyTest: number;
  codeTutor: number;
}

export interface Stats {
  rank: number;
  level: string;
  medals: Medals;
  problemsSolved: ProblemsSolved;
  languages: Record<string, number>;
}

export interface Certificate {
  title: string;
  date: string;
  link: string;
}

export interface ResumeData {
  profile: Profile;
  stats: Stats;
  certificates: {
    count: number;
    list: Certificate[];
  };
}

export interface ApiResponse<T = ResumeData> {
  success: boolean;
  data?: T;
  error?: string;
}
