export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface Vulnerability {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  line: number | null;
  description: string;
  fix: string;
}

export interface PerformanceTip {
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  suggestion: string;
}

export interface ReviewResult {
  review_id: number;
  cached: boolean;
  language: string;
  review_focus: string;
  vulnerabilities: Vulnerability[];
  performance_tips: PerformanceTip[];
  refactored_code: string;
}

export interface ReviewHistoryItem {
  id: number;
  language: string;
  review_focus: string;
  created_at: string;
  preview: string;
  vulnerability_count: number;
}
