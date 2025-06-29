import React, { useEffect, useState } from "react";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RatingBox({
  mediaType,
  onClose,
  loading,
  setLoading,
  metaData,
  mediaInfo,
}) {
  const [rating, setRating] = useState("");
  const [episode, setEpisode] = useState(
    String(mediaInfo?.episode_number || null)
  );
  const [isEditingEpisode, setIsEditingEpisode] = useState(false);

  const ratingOptions = [
    "10. Masterpiece",
    "9. Great",
    "8. Very Good",
    "7. Good",
    "6. Fine",
    "5. Average",
    "4. Bad",
    "3. Very Bad",
    "2. Horrible",
    "1. Appalling",
  ];

  const media = metaData?.data?.Media;

  useEffect(() => {
    setEpisode(String(mediaInfo?.episode_number || 1));
  }, [loading]);

  async function onRate(rating, episode) {
    console.log("I am iside of ratingBox");
    const match = rating.match(/(^\d+)[.].+/);
    let ratingNum;
    if (match) {
      console.log("I am inside of mathc");
      ratingNum = match[1];
    }

    // if it's the last episode of the series/season; then -completed else - watching
    let status = null;
    if (media.episodes === mediaInfo?.episode_number) {
      status = "completed";
    } else {
      status = "watching";
    }

    console.log(
      "Data sending to bg: ",
      ratingNum,
      Number(episode),
      status,
      metaData,
      mediaInfo
    );

    const response = await browser.runtime.sendMessage({
      type: "rate_media",
      action: "rate",
      data: {
        ratingNum,
        episode: Number(episode),
        status,
        metaData,
        dataFromSite: mediaInfo,
      },
    });

    if (response?.status || response?.data?.SaveMediaListEntry) {
      toast.success("Rating Successful!");
    } else {
      toast.error("Rating Failed");
    }

    console.log(
      "The response I got in RatingBox after successful rating: ",
      response
    );
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center">
      <div className="w-[440px] bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-4 shadow-md">
        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : (
          <>
            <h2 className="text-base font-semibold text-white mb-2">
              Rate {mediaType}
            </h2>

            <div className="flex gap-4">
              {/* Left Image & Season Info */}
              <div className="flex flex-col items-center">
                <img
                  src={media.coverImage.large}
                  alt="cover"
                  className="rounded-md border border-zinc-700 w-48"
                />
                <p className="text-gray-400 text-xs mt-1">
                  {media.season} {media.seasonYear}
                </p>
              </div>

              {/* Right Content Area */}
              <div className="flex-1 flex flex-col gap-3 justify-between">
                {/* Title */}
                <h3 className="text-white text-lg font-bold">
                  {media.title.english || media.title.romaji}
                </h3>

                {/* Rating & Episode input */}
                <div className="flex gap-2">
                  {/* Rating Options */}
                  <select
                    className="flex-1 h-9 bg-zinc-800 text-white border border-zinc-700 px-2 py-0.5 rounded-md"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="">Select</option>
                    {ratingOptions.map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  {/* Episode input & + button */}
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={
                        isEditingEpisode
                          ? episode
                          : `${episode} / ${media.episodes || "?"}`
                      }
                      onFocus={() => setIsEditingEpisode(true)}
                      onBlur={() => setIsEditingEpisode(false)}
                      onChange={(e) => {
                        if (isEditingEpisode) {
                          const val = e.target.value;
                          if (
                            /^\d+$/.test(val) &&
                            val <=
                              (media.episodes ||
                                media.nextAiringEpisode.episode - 1)
                          ) {
                            setEpisode(val);
                          }
                        }
                      }}
                      className="w-20 h-full bg-zinc-800 text-white border border-zinc-700 px-2 rounded-md text-sm text-center"
                    />
                    <button
                      onClick={() => {
                        const next = parseInt(episode || "0") + 1;
                        if (
                          next <=
                          (media.episodes ||
                            media.nextAiringEpisode.episode - 1)
                        )
                          setEpisode(String(next));
                      }}
                      className="bg-zinc-700 hover:bg-zinc-600 text-white px-2 py-1 rounded-md text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    className="px-3 py-1 text-sm text-white bg-zinc-700 hover:bg-zinc-600 rounded-md"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!rating}
                    onClick={async () => {
                      await onRate(rating, episode);
                      onClose();
                    }}
                    className="px-4 py-1 text-sm text-white bg-red-600 hover:bg-red-500 rounded-md disabled:opacity-50"
                  >
                    Rate
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RatingBox;
