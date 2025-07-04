import React, { useEffect, useState } from "react";
import RatingBox from "../components/RatingBox";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Film, Heart, Tv2, UserRoundCog } from "lucide-react";
import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import Settings from "../pages/Settings";

function Rate({ animeUserData }) {
  const [mediaType, setMediaType] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [mediaInfoFromWebPage, setmediaInfoFromWebPage] = useState(null);
  const [loading, setLoading] = useState(true);

  function handleRating(mediaType) {
    setMediaType(mediaType);
  }

  function onClose() {
    setMediaType(null);
  }

  useEffect(() => {
    if (mediaType === "Anime") {
      // To-Do - Add a check to see if the user is logged in into any one anime provider, after that
      console.log("I am inside of useeffecr");

      (async () => {
        const response = await browser.runtime.sendMessage({
          // this returns the metadata of currently playing media to show in rating box frotend
          type: "rate_media",
          site: "CR",
          action: "send_media_detail",
        });
        console.log(
          "response in rate frontend",
          response.dataFromProvider.data.Media
        );

        setMetaData(response.dataFromProvider);
        setmediaInfoFromWebPage(response.metaData);
        setLoading(false);
      })();
    }
  }, [mediaType]);

  return (
    <>
      <div className="bg-transparent text-white flex flex-col">
        {/* Content */}
        <div className="flex-1 flex justify-center px-4 py-6">
          <div className="w-full max-w-[440px] bg-[#111418] rounded-2xl border border-[#1f2937] shadow-lg p-6 flex flex-col gap-6">
            {/* Greeting */}
            <div>
              <h1 className="text-3xl font-semibold leading-snug">
                Hello,{" "}
                <span className="text-[#4CC9F0]">
                  {animeUserData?.username || "User"}
                </span>
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Ready to rate something today?
              </p>
            </div>

            {/* Rating Cards */}
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleRating("Anime")}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#1f2937] hover:bg-[#374151] transition"
              >
                <Heart className="text-[#4CC9F0]" />
                <div className="text-left">
                  <p className="font-medium text-base">Rate Anime</p>
                  <p className="text-xs text-gray-400">
                    Track your favorite anime shows
                  </p>
                </div>
              </button>
              <button
                onClick={() => {
                  toast.info("Coming Soon!");
                }}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#1f2937] hover:bg-[#374151] transition"
              >
                <Film className="text-[#4CC9F0]" />
                <div className="text-left">
                  <p className="font-medium text-base">Rate Movie</p>
                  <p className="text-xs text-gray-400">
                    Add your latest movie watches
                  </p>
                </div>
              </button>
              <button
                onClick={() => {
                  toast.info("Coming Soon!");
                }}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#1f2937] hover:bg-[#374151] transition"
              >
                <Tv2 className="text-[#4CC9F0]" />
                <div className="text-left">
                  <p className="font-medium text-base">Rate Show</p>
                  <p className="text-xs text-gray-400">
                    Rate your newly watched TV shows
                  </p>
                </div>
              </button>
            </div>

            {/* Optional footer */}
            <div className="mt-4 text-center text-xs text-gray-500">
              Choose what you want to rate and it do it for you.
            </div>
          </div>
        </div>
      </div>

      {mediaType && (
        <RatingBox
          mediaType={mediaType}
          onClose={onClose}
          loading={loading}
          setLoading={setLoading}
          metaData={metaData}
          mediaInfo={mediaInfoFromWebPage}
        />
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
        transition={Slide}
        toastClassName="!w-fit !max-w-[420px] !text-sm !px-3 !py-2 !pr-8"
        bodyClassName="!m-0 !p-0"
        limit={3}
      />
    </>
  );
}

export default Rate;
