import React, { useEffect, useState } from "react";

function RatingBox({
  mediaType,
  onClose,
  loading,
  setLoading,
  metaData,
  mediaInfo,
}) {
  console.log(
    "Data I receive in ratingbox: ",
    metaData,
    mediaInfo?.episode_number
  );
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
                    onClick={() => {
                      onClose();
                      console.log("Rating:", rating);
                      console.log("Episode:", episode);
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
