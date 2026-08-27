export type CandidateStatus = "pending" | "processing" | "completed" | "failed";

export type Recommendation = "Strong Match" | "Potential Match" | "Not a Match";

export interface AIScreeningResult {
  match_score: number;
  recommendation: Recommendation;
  reason: string;
  relevant_experience: { facts: string; interpretation: string };
  technical_skills_match: { facts: string; interpretation: string };
  education_match: { facts: string; interpretation: string };
  missing_or_required_skills: string[];
  strengths: string[];
  concerns_or_gaps: string[];
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  cv_text: string;
  jd_text: string;
  status: CandidateStatus;
  error_message: string | null;
  match_score: number | null;
  relevant_experience: string | null;
  technical_skills_match: string | null;
  education_match: string | null;
  missing_skills: string | null;
  strengths: string | null;
  concerns: string | null;
  recommendation: Recommendation | null;
  reason: string | null;
  raw_ai_response: AIScreeningResult | null;
  retry_count: number;
  created_at: string;
  updated_at: string;
}
