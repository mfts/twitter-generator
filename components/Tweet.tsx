import { Dispatch, SetStateAction } from "react";

interface TweetProps {
  tweet: string;
  setTweet: Dispatch<SetStateAction<string>>;
  media: boolean;
  setMedia: Dispatch<SetStateAction<boolean>>;
}

export const Tweet = ({ tweet, setTweet, media, setMedia }: TweetProps) => {
  return (
    <>
      <div className="w-full">
        <textarea
          maxLength={280}
          onChange={(e) => setTweet(e.target.value)}
          placeholder="Type your tweet here"
          className="dark:text-black w-full h-56 p-2 text-lg dark:bg-white border border-gray-300 text-white bg-slate-600 rounded-md shadow-inner md:h-240"
        />
      </div>
      <div className="flex items-center mt-2">
        <input
          type="checkbox"
          id="media"
          name="media"
          className="form-checkbox h-4 w-4 text-blue-600"
          checked={media}
          onChange={(e) => setMedia(e.target.checked)}
        />
        <label htmlFor="media" className="ml-2">
          Image / GIF / Video
        </label>
      </div>
    </>
  );
};
