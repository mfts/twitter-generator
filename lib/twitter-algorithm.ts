// ---------------------------
// Twitter Algorithm
// Higher score = higher reach
//
// Update: the real algorithm!
// https://github.com/twitter/the-algorithm
// ---------------------------

// ---------------------------
// CURRENTLY IMPLEMENTED
//
// tweetHasMediaBoost = 2.0,             // tweet has image or video
// tweetHasNewsUrlBoost = 1.2,           // tweet has news link
// tweetHasCompetitorUrlBoost = 0.8,     // tweet has competitor link
// multipleHashtagsOrTrendsBoost = 0.6,  // has multiple hashtags
// offensiveBoost = 0.1,                 // tweet is offensive
// ---------------------------

// ---------------------------
// OTHER FACTORS, NOT IMPLEMENTED
//
// retweetCountParams = 20.0             // retweets
// favCountParams = 30.0,                // likes
// replyCountParams =  1.0,              // replies

// reputationParams = 0.2,               // need to figure out what reputation
// luceneScoreParams = 2.0,              // need to figure out what luceneScore
// textScoreParams = 0.18,
// urlParams = 2.0,
// isReplyParams = 1.0,

// langEnglishUIBoost = 0.5,             // tweet non-English, UI English
// langEnglishTweetBoost = 0.2,          // tweet English, UI non-English
// langDefaultBoost = 0.02,              // tweet non-English, UI_lang ≠ Tweet_lang
// unknownLanguageBoost = 0.05,          // tweet not an understandable language
// inTrustedCircleBoost = 3.0,           // tweet is from a social circle (I guess followers and friends)
// inDirectFollowBoost = 4.0,            // tweet is from a direct follow
// tweetHasTrendBoost = 1.1,             // tweet has a trend
// selfTweetBoost = 2.0,                 // is my own tweet?
// ---------------------------

import { compact } from "lodash";

import { Filter } from "profanity-check";

// initialize profanity filter
const defaultFilter = new Filter();

export function rank(tweet: string, tweetMedia: boolean): RankResponse {
  const parsedTweet = tweet.toLowerCase();
  // Default score
  if (parsedTweet.length < 2) {
    return {
      score: 0,
      validations: [],
    };
  }
  const tweetData: TweetData = {
    tweet: parsedTweet,
    originalTweet: tweet,
    tweetMedia: tweetMedia,
  };
  const rules = [
    newsURLBoost(tweetData),
    competitorURLDamping(tweetData),
    offensiveDamping(defaultFilter, tweetData),
    multipleHashtagsOrTrendsDamping(tweetData),
    imageVideoBoost(tweetData),
  ];
  const scores = rules.map((item) => item.score);
  const validations: Array<Validation> = compact(
    rules.map((item) => {
      if (item.message) {
        const type = item.score >= 1 ? "positive" : "negative";
        return {
          message: `${item.message} (${Math.abs(item.score)}x)`,
          type,
        };
      }
    })
  );
  const sum = scores.reduce((partialSum, a) => partialSum * a, 1);

  return {
    score: sum,
    validations,
  };
}

// ---------------------------
// Rules
// Can return any value between -100 and 100
//
// Add new rules here!
// Returning 0 has no impact on score
// ---------------------------

// function to detect multiple hashtags
function multipleHashtagsOrTrendsDamping({ tweet }: TweetData): Rank {
  const regex = /#[\w-]+/g;
  const hashtags = tweet.match(regex);
  if (hashtags && hashtags.length > 1) {
    return {
      score: 0.6,
      message: `Contains too many hashtags.`,
    };
  }
  return {
    score: 1.0,
  };
}

// function to detect image or video
function imageVideoBoost({ tweetMedia }: TweetData): Rank {
  const has_media = tweetMedia;
  if (has_media) {
    return {
      score: 2.0,
      message: `Contains image or video.`,
    };
  }
  return {
    score: 1.0,
  };
}

// function to detect news urls in tweet
// top news domains on twitter according to chatgpt
// cnn.com, nytimes.com, bbc.com, washingtonpost.com, buzzfeednews.com, reuters.com, theguardian.com, aljazeera.com, npr.org, foxnews.com
function newsURLBoost({ tweet }: TweetData): Rank {
  const regex =
    /\bhttps:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?\b/g;
  const domainsRegex =
    /(\w+\.)?(cnn|nytimes|bbc|washingtonpost|buzzfeednews|reuters|theguardian|aljazeera|npr|foxnews)\.(com|org|co\.uk|net|gov)/g;
  const urls = tweet.match(regex)?.filter((url) => url.match(domainsRegex));
  if (urls && urls.length > 0) {
    return {
      score: 1.2,
      message: `Contains a news link.`,
    };
  }
  return {
    score: 1.0,
  };
}

// top competitors on twitter according to chatgpt
// facebook.com,instagram.com,snapchat.com,linkedin.com,tiktok.com,reddit.com,joinmastodon.org,gab.com,minds.com,parler.com,mewe.com,telegram.org,signal.org,clubhouse.com
function competitorURLDamping({ tweet }: TweetData): Rank {
  const regex =
    /\bhttps:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?\b/g;
  const domainsRegex =
    /(\w+\.)?(facebook|instagram|snapchat|linkedin|tiktok|reddit|joinmastodon|gab|minds|parler|mewe|telegram|signal|clubhouse)\.(com|org)/g;
  const urls = tweet.match(regex)?.filter((url) => url.match(domainsRegex));
  if (urls && urls.length > 0) {
    return {
      score: 0.8,
      message: `Contains link to another social network.`,
    };
  }
  return {
    score: 1.0,
  };
}

function offensiveDamping(filter: any, { tweet }: TweetData): Rank {
  const isOffensive = filter.isProfane(tweet);
  if (isOffensive) {
    return {
      score: 0.1,
      message: `Tweet is offensive.`,
    };
  }
  return {
    score: 1.0,
  };
}
