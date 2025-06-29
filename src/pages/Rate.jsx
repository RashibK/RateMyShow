import React, { useEffect, useState } from "react";
import RatingBox from "../components/RatingBox";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Rate() {
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
      <div
        className="text-white cursor-pointer"
        onClick={() => handleRating("Anime")}
      >
        Rate Anime
      </div>
      <div className="text-white">Rate Movie</div>
      <div className="text-white">Rate Show</div>

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
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
        transition={Slide}
        toastClassName="!max-w-[240px] !text-sm !px-3 !py-2"
        bodyClassName="!m-0 !p-0"
      />
    </>
  );
}

export default Rate;
