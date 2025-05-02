export interface Feedback {
    id: number;
    patientName: string;
    date: string;        // ISO date string, e.g. "2025-04-30"
    rating: number;      // 1–5 stars
    comment: string;     // the review text
    status: "pending" | "approved" | "rejected"; // moderation status
  }