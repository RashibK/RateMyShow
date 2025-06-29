import React, { useEffect, useState } from "react";
import RatingBox from "../components/RatingBox";

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
        /*
        {
  {
  "data": {
    "Media": {
      "idMal": 57334,
      "id": 171018,
      "bannerImage": "https://s4.anilist.co/file/anilistcdn/media/anime/banner/171018-SpwPNAduszXl.jpg",
      "title": {
        "native": "ダンダダン",
        "english": "DAN DA DAN",
        "romaji": "Dandadan"
      },
      "startDate": {
        "day": 4,
        "month": 10,
        "year": 2024
      },
      "episodes": 12,
      "coverImage": {
        "medium": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx171018-60q1B6GK2Ghb.jpg"
      },
      "season": "FALL",
      "seasonYear": 2024
    }
  }
}*/
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
    </>
  );
}

export default Rate;
