interface Validation {
  type: "positive" | "negative";
  message: string;
}

interface RankResponse {
  score: number;
  validations: Array<ProcessedValidation>;
}

interface Rank {
  score: number;
  message?: string;
}

interface AnalysisResult {
  score: number;
  comparative: number;
  calculation: Array<{
    [token: string]: number;
  }>;
  tokens: string[];
  words: string[];
  positive: string[];
  negative: string[];
}
interface TweetData {
  tweet: string;
  originalTweet: string;
  tweetMedia: boolean;
}
