import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Tweet } from "@/components/Tweet";
import { Ranking } from "@/components/Ranking";
import { rank } from "@/lib/twitter-algorithm";
import Github from "@/components/GitHub";
import Footer from "@/components/Footer";

export default function Home() {
  const [optimizedTweet, setOptimizedTweet] = useState<string>("");
  const [ranking, setRanking] = useState<RankResponse>({
    score: 0,
    validations: [],
  });
  const [tweet, setTweet] = useState<string>("");
  const [media, setMedia] = useState<boolean>(false);
  useEffect(() => {
    const rankResponse = rank(tweet, media);
    setRanking(rankResponse);
  }, [tweet, media]);

  // prompt for optimizing tweet
  const prompt = `
    You are a TwitterGPT, a large language model that generates viral tweets. You are given a prompt of a tweet and must generate a tweet that is more likely to be liked and retweeted than the original tweet.
    The Twitter algorithm contains boosts and demotions based on what you are writing. News links are positive boosts. Social media links (like facebook.com,instagram.com,snapchat.com,linkedin.com,tiktok.com,reddit.com,joinmastodon.org,gab.com,minds.com,parler.com,mewe.com,telegram.org,signal.org,clubhouse.com) are demotions. If there are social media links, remove them. 
    Don't add hashtags, ever! Hashtags are bad. Remove all hashtags!
    Make sure the generated tweet is less than 280 characters, has short sentences that are found in tweets, and base them on this context:
    ${tweet}
  `;
  // function to send tweet to OpenAI and get response
  const optimizeTweet = async (e: any) => {
    e.preventDefault();
    setOptimizedTweet("");
    const response = await fetch("/api/optimize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setOptimizedTweet((prev) => prev + chunkValue);
    }
  };

  return (
    <>
      <Head>
        <title>Real Twitter Algorithm Rank Validator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="See how your tweet performs against the official open-source Twitter algorithm."
        />
        <meta
          property="og:site_name"
          content="real-twitter-algorithm.vercel.app"
        />
        <meta
          property="og:description"
          content="See how your tweet performs against the official open-source Twitter algorithm."
        />
        <meta
          property="og:title"
          content="Real Twitter Algorithm Rank Validator"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Real Twitter Algorithm Rank Validator"
        />
        <meta
          name="twitter:description"
          content="See how your tweet performs against the official open-source Twitter algorithm."
        />
        <meta
          property="og:image"
          content="https://real-twitter-algorithm.vercel.app/og-image.png"
        />
        <meta
          name="twitter:image"
          content="https://real-twitter-algorithm.vercel.app/og-image.png"
        />
      </Head>

      <main>
        <nav className="bg-blue-500 text-white">
          <div className="px-5">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center h-16">
                <div className="wordmark flex items-center text-base">
                  <Image
                    src="/logo.png"
                    width={24}
                    height={24}
                    alt="logo"
                    className="mr-1"
                  />
                  Developer
                </div>
                <div>
                  <ul className="flex">
                    <li className="ml-8">
                      <a
                        target="_blank"
                        href="https://github.com/mfts/twitter-algorithm-ai"
                        rel="noreferrer"
                        className="text-white flex max-w-fit items-center justify-center space-x-2"
                      >
                        <Github />
                        <p>Star on GitHub</p>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <section className="py-10 lg:py-20">
          <div className="px-5">
            <div className="max-w-5xl mx-auto">
              <div className="w-1/2 mx-auto">
                <h1 className="text-6xl text-center font-bold pb-5 text-slate-900">
                  Algorithm Rank Validator
                </h1>
                <p className="my-4 md:my-8 text-center">
                  See how your tweet performs against <br />
                  <a
                    target="_blank"
                    href="https://github.com/twitter/the-algorithm"
                    rel="noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    the official open-source Twitter algorithm
                  </a>
                  .
                </p>
                <div className="flex flex-col w-full space-y-4">
                  <div className="">
                    <h2 className="text-xl pb-4 border-b border-gray-300">
                      Your Ranking
                    </h2>
                    <div className="pt-8">
                      <Ranking ranking={ranking} />
                    </div>
                  </div>
                  <div className="">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-300">
                      <h2 className="text-xl">Your Tweet</h2>
                      {tweet && (
                        <button
                          onClick={(e) => optimizeTweet(e)}
                          className="text-sm text-blue-500 hover:text-blue-600"
                        >
                          {" "}
                          Optimize with ChatGPT{" "}
                        </button>
                      )}
                    </div>
                    <div className="max-w-2xl my-8 mx-auto">
                      <Tweet
                        tweet={tweet}
                        setTweet={setTweet}
                        media={media}
                        setMedia={setMedia}
                      />
                    </div>
                    {tweet && (
                      <div className="my-4">
                        <button
                          onClick={(e) => optimizeTweet(e)}
                          className="bg-blue-500 font-medium rounded-md w-full text-white px-4 py-2 hover:bg-blue-600"
                        >
                          Optimize with ChatGPT
                        </button>
                      </div>
                    )}

                    {optimizedTweet && (
                      <div className="mb-4">
                        <h3 className="text-lg pb-2">Optimized Tweet</h3>
                        <p className="text-gray-500">{optimizedTweet}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="max-w-5xl mx-auto">
          <Footer />
        </div>
      </main>
    </>
  );
}
