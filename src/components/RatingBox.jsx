import React, { useEffect, useState } from "react";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingAnimation from "../utils/LoadingAnimation";
import { Film, Link, Plus, Star, X } from "lucide-react";

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

  useEffect(() => {
    async function checkActiveTab() {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab?.url?.includes("crunchyroll.com/watch/")) {
        onClose();
        toast.error(
          <div>
            Action not available on this page.{" "}
            <a
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-400"
            >
              Learn more
            </a>
          </div>
        );
      }
    }
    checkActiveTab();
  }, []);

  async function onRate(rating, episode) {
    const match = rating.match(/(^\d+)[.].+/);
    let ratingNum = match ? match[1] : null;

    let status =
      media.episodes === mediaInfo?.episode_number ? "completed" : "watching";

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
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="w-[400px] bg-[#0E1113] rounded-lg px-4 py-4 shadow-md border border-[#3F3F46]">
        {loading ? (
          <LoadingAnimation />
        ) : (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
              className="w-[400px] rounded-lg px-4 py-4 shadow-md border"
              style={{
                backgroundColor: "rgba(30, 35, 40, 0.6)",
                backdropFilter: "blur(10px)",
                borderColor: "rgba(255, 255, 255, 0.15)",
                borderStyle: "solid",
              }}
            >
              {/* Header */}
              <div
                className="px-4 py-3 border-b"
                style={{
                  background:
                    "linear-gradient(to right, rgba(37,99,235,0.25), rgba(59,130,246,0.25))",
                  borderColor: "#3F3F46",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="p-1.5 rounded-full"
                      style={{ backgroundColor: "rgba(96,165,250,0.2)" }}
                    >
                      <Star className="w-4 h-4 text-blue-400" />
                    </div>
                    <h2 className="text-base font-semibold text-[#F1F5F9]">
                      Rate {mediaType}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full transition-colors group hover:bg-[#475569]"
                  >
                    <X className="w-5 h-5 group-hover:text-white text-[#94A3B8]" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 text-sm text-[#F1F5F9]">
                <div className="space-y-4">
                  {/* Cover and Info */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 relative group">
                      <img
                        src={media.coverImage.large}
                        alt="cover"
                        className="rounded-lg w-32 h-48 object-cover shadow-lg border border-[#3F3F46] group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute bottom-1 left-1 right-1 bg-black/80 rounded px-2 py-1 text-xs text-white text-center">
                        {media.season} {media.seasonYear}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold mb-2 truncate text-[#F1F5F9]">
                        {media.title.english || media.title.romaji}
                      </h3>

                      {/* Score */}
                      <div className="mb-3">
                        <div
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border"
                          style={{
                            backgroundColor: "rgba(59,130,246,0.2)",
                            color: "#60A5FA",
                            borderColor: "rgba(59,130,246,0.3)",
                          }}
                        >
                          ★ {media.averageScore}%
                        </div>
                      </div>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-1">
                        {media.genres.slice(0, 3).map((genre, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs rounded-full"
                            style={{
                              backgroundColor: "#1C1F26",
                              color: "#94A3B8",
                              border: "1px solid #3F3F46",
                            }}
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rating Dropdown */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2 text-[#94A3B8]">
                      <Star className="w-4 h-4" />
                      Your Rating
                    </label>
                    <div className="relative">
                      <select
                        className="w-full h-11 px-3 rounded-lg font-medium appearance-none cursor-pointer text-sm focus:outline-none"
                        style={{
                          backgroundColor: "#1C1F26",
                          color: "#F1F5F9",
                          border: "1px solid #3F3F46",
                        }}
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option
                          value=""
                          style={{
                            backgroundColor: "#1C1F26",
                            color: "#94A3B8",
                          }}
                        >
                          Select Rating
                        </option>
                        {ratingOptions.map((opt, i) => (
                          <option
                            key={opt}
                            value={opt}
                            style={{
                              backgroundColor: "#1C1F26",
                              color: "#F1F5F9",
                            }}
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-[#94A3B8]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Episode Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2 text-[#94A3B8]">
                      <Film className="w-4 h-4" />
                      Episode Progress
                    </label>
                    <div className="flex items-center gap-2">
                      <div
                        className="flex items-center rounded-lg overflow-hidden"
                        style={{
                          backgroundColor: "#1C1F26",
                          border: "1px solid #3F3F46",
                        }}
                      >
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
                            const val = e.target.value;
                            if (
                              /^\d+$/.test(val) &&
                              val <=
                                (media.episodes ||
                                  media.nextAiringEpisode?.episode - 1)
                            ) {
                              setEpisode(val);
                            }
                          }}
                          className="w-20 h-10 px-2 text-center font-mono focus:outline-none text-sm bg-transparent text-[#F1F5F9]"
                        />
                        <button
                          onClick={() => {
                            const next = parseInt(episode || "0") + 1;
                            if (
                              next <=
                              (media.episodes ||
                                media.nextAiringEpisode?.episode - 1)
                            ) {
                              setEpisode(String(next));
                            }
                          }}
                          className="h-10 px-3 transition-colors border-l group text-[#F1F5F9]"
                          style={{
                            backgroundColor: "#3F3F46",
                            borderColor: "#3F3F46",
                          }}
                        >
                          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>

                      <div
                        className="flex-1 rounded-full h-2 overflow-hidden"
                        style={{ backgroundColor: "#1C1F26" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            background:
                              "linear-gradient(to right, #3B82F6, #60A5FA)",
                            width: `${
                              (parseInt(episode) / (media.episodes || 1)) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div
                    className="flex gap-2 mt-6 pt-4"
                    style={{ borderTop: "1px solid #3F3F46" }}
                  >
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 text-sm rounded-lg font-medium border"
                      style={{
                        backgroundColor: "#3F3F46",
                        borderColor: "#3F3F46",
                        color: "#F1F5F9",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!rating}
                      onClick={async () => {
                        await onRate(rating, episode);
                        onClose();
                      }}
                      className={`flex-1 px-4 py-2.5 text-sm rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg transition-all duration-200 ${
                        rating
                          ? "hover:brightness-110 hover:shadow-blue-500/30"
                          : ""
                      }`}
                      style={{
                        backgroundColor: "#3B82F6", // base blue
                        color: "#F1F5F9",
                        opacity: rating ? 1 : 0.5,
                        cursor: rating ? "pointer" : "not-allowed",
                        boxShadow: "0 0 10px rgba(37,99,235,0.25)",
                      }}
                    >
                      <Star className="w-4 h-4" />
                      Rate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RatingBox;
