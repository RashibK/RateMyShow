import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  malOauth,
  exchangeCodeForRefreshToken,
} from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import AnimeToggle from "../components/AnimeToggle";
import MovieToggle from "../components/MovieToggle";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const data = {
    anime: ["MyAnimeList", "AniList"],
    movie: ["LetterBoxd", "Trakt"],
    tvshow: ["Trakt"],
  };

  const [selectedFirstOption, setSelectedFirstOption] = useState("");
  const [selectSecondOption, setSelectSecondOption] = useState([]);

  function getProvider(event) {
    setSelectedFirstOption(event.target.value);
    setSelectSecondOption(data[event.target.value] || []);
  }

  async function onSubmit(event) {
    event.preventDefault();

    const category = event.target.contentCategory.value;
    const provider = event.target.providerOptions.value;

    if (category === "anime") {
      if (provider === "myanimelist") {
        try {
          const userData = await browser.runtime.sendMessage({
            type: "start_mal_auth",
          });
          navigate("/");
        } catch (error) {
          console.log("Error:", error);
        }
      }
    }
  }

  function checkConnectedProviders() {
    // send message to background.js
    // it goes and looks for mal user data, if there is, it returns it, if not, it uses mal refresh tokens, get the access token and sends the user data, and I show it here
    // same for movies and tv, if none of
  }

  const animeUserData = {
    id: 15328537,
    name: "poke1",
    birthday: "1999-01-01",
    location: "",
    joined_at: "2022-07-12T02:48:34+00:00",
    picture:
      "https://cdn.myanimelist.net/s/common/userimages/0b067390-6d23-45f0-959c-226fc16bf87b_225w?s=1ed5cee1e64005f9a9b1070eeb3ec927",
    provider: "anilist",
  };

  const tvShowUserData = null;
  const movieUserData = null;
  return (
    <div className="h-[calc(600px-48px)] flex justify-center items-center w-full">
      <div className="grid grid-rows-3 gap-4 h-[90%] w-[90%]">
        <section className="anime-card border border-border bg-zinc-900 flex flex-col rounded-xl p-4 gap-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <div className="provider-type text-zinc-100 font-semibold text-base">
              Anime
            </div>
            <AnimeToggle animeProvider={animeUserData?.provider} />
          </div>
          <div className="flex justify-between">
            {animeUserData ? (
              <>
                <div className="flex items-center justify-between gap-x-3">
                  <div className="bg-white w-10 h-10 overflow-hidden border border-border rounded-full">
                    <img
                      src={animeUserData.picture}
                      className="w-full h-full rounded-full cursor-pointer"
                    />
                  </div>
                  <span className="text-zinc-100 text-base">
                    Connected as{" "}
                    <span className="font-medium text-base cursor-pointer">
                      {animeUserData.name}
                    </span>
                  </span>
                </div>
                <div className="content-center">
                  <button className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition shadow-sm">
                    Disconnect
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-zinc-400 text-base">Not Connected</span>
                <div className="content-center">
                  <button className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition shadow-sm">
                    Connect
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
        <section className="movie-card border border-border bg-zinc-900 flex flex-col rounded-xl p-4 gap-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <div className="provider-type text-zinc-100 font-semibold text-base">
              Movie
            </div>

            <MovieToggle />
          </div>
          <div className="flex justify-between">
            {movieUserData ? (
              <>
                <div className="flex items-center justify-between gap-x-3">
                  <div className="bg-white w-10 h-10 overflow-hidden border border-border rounded-full">
                    <img
                      src={movieUserData.picture}
                      className="w-full h-full rounded-full cursor-pointer"
                    />
                  </div>
                  <span className="text-zinc-100 text-base">
                    Connected as{" "}
                    <span className="font-medium text-base cursor-pointer">
                      {movieUserData.name}
                    </span>
                  </span>
                </div>
                <div className="content-center">
                  <button className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition shadow-sm">
                    Disconnect
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-zinc-400 text-base">Not Connected</span>
                <div className="content-center">
                  <button className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition shadow-sm">
                    Connect
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
        <section className="tv-shows-card border border-border bg-zinc-900 flex flex-col rounded-xl p-4 gap-4 shadow-sm ">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <div className="provider-type text-zinc-100 font-semibold text-base">
              TV Show
            </div>

            <MovieToggle />
          </div>
          <div className="flex justify-between">
            {tvShowUserData ? (
              <>
                <div className="flex items-center justify-between gap-x-3">
                  <div className="bg-white w-10 h-10 overflow-hidden border border-border rounded-full">
                    <img
                      src={tvShowUserData.picture}
                      className="w-full h-full rounded-full cursor-pointer"
                    />
                  </div>
                  <span className="text-zinc-100 text-base">
                    Connected as{" "}
                    <span className="font-medium text-base cursor-pointer">
                      {tvShowUserData.name}
                    </span>
                  </span>
                </div>
                <div className="content-center">
                  <button className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition shadow-sm">
                    Disconnect
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-zinc-400 text-base">Not Connected</span>
                <div className="content-center">
                  <button className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition shadow-sm">
                    Connect
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
