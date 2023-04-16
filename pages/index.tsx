import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Tweet } from "@/components/Tweet";
import { Ranking } from "@/components/Ranking";
import { rank } from "@/lib/twitter-algorithm";
import Github from "@/components/GitHub";
import Footer from "@/components/Footer";
import LoadingDots from "@/components/LoadingDots";

export default function Home() {
  const [loading, setLoading] = useState(false);
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
    You are a TwitterGPT, a large language model that generates viral tweets, follow instructions. 
    ---
    You are given an original tweet as reference and you must generate a tweet that is more likely to be liked and retweeted than the original tweet.
    The Twitter algorithm contains boosts and demotions based on what you are writing. News links are positive boosts. Social media links (like facebook.com,instagram.com,snapchat.com,linkedin.com,tiktok.com,reddit.com,joinmastodon.org,gab.com,minds.com,parler.com,mewe.com,telegram.org,signal.org,clubhouse.com) are demotions. If there are social media links, remove them. 
    Please generate a tweet without any hashtags, social media links, or tags.
    Make sure the generated tweet is less than 280 characters and base them on this context:
    ${tweet}
    ---
    Output only the generated text without any introductory or helping words.
    --- 
    Review the generated text before you post it and remove any words that start with "#".
  `;
  // function to send tweet to OpenAI and get response
  const optimizeTweet = async (e: any) => {
    e.preventDefault();
    setOptimizedTweet("");
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Real Twitter Algorithm Rank Validator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="See how your tweet performs against the official open-source Twitter algorithm and generate better ones."
        />
        <meta property="og:site_name" content="twitter-generator.vercel.app" />
        <meta
          property="og:description"
          content="See how your tweet performs against the official open-source Twitter algorithm and generate better ones."
        />
        <meta
          property="og:title"
          content="Twitter Generator and Algorithm Validator"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Twitter Generator and Algorithm Validator"
        />
        <meta
          name="twitter:description"
          content="See how your tweet performs against the official open-source Twitter algorithm and generate better ones."
        />
        <meta
          property="og:image"
          content="https://twitter-generator.vercel.app/og-image.png"
        />
        <meta
          name="twitter:image"
          content="https://twitter-generator.vercel.app/og-image.png"
        />
      </Head>

      <main>
        <nav className="bg-blue-500 text-white">
          <div className="px-5">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center text-base">
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
        <section className="pt-10 lg:pt-20 pb-8">
          <div className="px-5">
            <div className="max-w-5xl mx-auto">
              <div className="mx-auto">
                <h1 className="text-6xl text-center font-bold pb-5 text-slate-900">
                  Twitter Generator
                </h1>
                <p className="mb-4 md:mb-4 text-center text-slate-500">
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
              </div>
              <div className="md:w-1/2 mx-auto">
                <div className="flex flex-col w-full space-y-4 mt-8">
                  <div>
                    <h2 className="text-xl pb-2 border-b border-gray-300">
                      Your Score
                    </h2>
                    <div className="pt-8">
                      <Ranking ranking={ranking} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-300">
                      <h2 className="text-xl">Your Tweet</h2>
                    </div>
                    <div className="max-w-2xl my-8 mx-auto">
                      <Tweet
                        tweet={tweet}
                        setTweet={setTweet}
                        media={media}
                        setMedia={setMedia}
                      />
                    </div>

                    <div className="my-4">
                      <button
                        onClick={(e) => optimizeTweet(e)}
                        className="bg-blue-500 font-medium rounded-md w-full text-white px-4 py-2 hover:bg-blue-600"
                      >
                        {loading && <LoadingDots color="white" style="large" />}
                        {!loading && `Generate your tweet`}
                      </button>
                    </div>
                    <Toaster
                      position="top-right"
                      reverseOrder={false}
                      toastOptions={{ duration: 2000 }}
                    />
                    {optimizedTweet && (
                      <div className="my-8">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-300">
                          <h2 className="text-xl font-bold">
                            Your Generated Tweet
                          </h2>
                        </div>
                        <div className="max-w-2xl my-4 mx-auto">
                          <div
                            className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                            onClick={() => {
                              navigator.clipboard.writeText(optimizedTweet);
                              toast("Tweet copied to clipboard", {
                                icon: "📋",
                              });
                            }}
                            key={optimizedTweet}
                          >
                            <p className="text-blue-500">{optimizedTweet}</p>
                          </div>
                        </div>
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
