# Twitter Algorithm Validator

## Backstory

- On March 24, 2022, Elon Musk tweeted: "[Twitter algorithm should be open source](https://twitter.com/elonmusk/status/1507041396242407424)"

- On April 14, 2022, Elon initiated an acquisition of Twitter. The acquisition was completed on October 27, 2022.

- On April 27, 2022, [Cory Etzkorn](https://twitter.com/coryetzkorn) built a fake Twitter Algorithm: https://github.com/coryetzkorn/twitter-algorithm

- On **March 31, 2023** Twitter released the [official Twitter Algorithm](https://github.com/twitter/the-algorithm). This is a set of rules that governs how Twitter's algorithm determines what content is shown to users in the search and For You tabs.

Today:

- I rebuilt Cory's algorithm to match the official Twitter Algorithm
- I also added ChatGPT to generate the tweet to maximize the algorithm's score

## Demo

Want to see how your tweet will score? [Try the official algorithm for yourself](https://twitter-algorithm-rank.vercel.app/).

[![Twitter Algorithm Validator Demo](./public/demo.png)](https://twitter-algorithm-rank.vercel.app/)

## Getting Started

If you would like to run this project locally, follow these steps:

1. Clone this repo

   ```bash
   git clone https://github.com/mfts/twitter-algorithm-rank.git
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and add `OPENAI_API_KEY` as an environment variable

   ```bash
   cp .env.example .env
   ```

4. Run the development server

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

If you would like to contribute, please open an issue or a pull request.

Head over to [`twitter-algorithm.ts`](https://github.com/mfts/twitter-algorithm-rank/blob/main/lib/twitter-algorithm.ts) to see the algorithm.

There are lots of rules from the official Twitter Algorithm yet to be implemented.
A good summary of the rules can be found [here](https://steventey.com/blog/twitter-algorithm/).

## Attribution 🙌

- [Cory Etzkorn](https://twitter.com/coryetzkorn) for building the [original algorithm](https://github.com/coryetzkorn/twitter-algorithm), which heavily inspired this project
- [Hassan El Mghari](https://twitter.com/nutlope) for building [Twitterbio](https://github.com/Nutlope/twitterbio), which provided the code for streaming OpenAI results via Vercel Edge Functions.
