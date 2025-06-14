import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AnimeToggle from "../components/AnimeToggle";
import MovieToggle from "../components/MovieToggle";
import { deleteAnimeUserData } from "../features/user/userSlice";
import { onConnectProvider } from "../features/auth/authSlice";
import {
  updateConnectedProvider,
  updateSelectedProvider,
} from "../features/ui/uiSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const animeUserData = useSelector((state) => state.user.animeUserData);
  const movieUserData = useSelector((state) => state.user.movieUserData);
  const tvShowUserData = useSelector((state) => state.user.tvShowUserData);

  const selectedAnimeProvider = useSelector(
    (state) => state.ui.selectedProviders.anime
  );
  // async function onSubmit(event) {
  //   event.preventDefault();

  //   const category = event.target.contentCategory.value;
  //   const provider = event.target.providerOptions.value;

  //   if (category === "anime") {
  //     if (provider === "myanimelist") {
  //       try {
  //         const userData = await browser.runtime.sendMessage({
  //           type: "start_mal_auth",
  //         });
  //         navigate("/");
  //       } catch (error) {
  //         console.log("Error:", error);
  //       }
  //     }
  //   }
  // }

  // function onConnect(provider) {
  //   console.log("THe button is clicked", provider);
  //   if (provider === "MyAnimeList") {
  //     (async () => {
  //       const response = await browser.runtime.sendMessage({
  //         type: "send_user_data",
  //         provider: provider,
  //       });
  //       if (response.message === "no_mal_user_data") {
  //         (async () => {
  //           const response = await browser.runtime.sendMessage({
  //             type: "start_auth",
  //             provider: provider,
  //           });
  //           navigate("/");
  //         })();
  //       } else {
  //         navigate("/");
  //       }
  //     })();
  //   }
  // }

  const onConnect = async (category, provider) => {
    console.log("loggin in from login component, ", provider);
    const result = await dispatch(
      onConnectProvider({ category, provider })
    ).unwrap();

    if (
      result.status === "auth_started" ||
      result.status === "already_connected"
    ) {
      const response = await browser.runtime.sendMessage({
        type: "connected_provider",
        action: "update_connected_provider",
        provider: result.provider,
        userData: result.response,
      });

      dispatch(updateConnectedProvider({ category, provider }));
      navigate("/");
    }
  };

  function onDisconnect(category, provider) {
    if (provider === "MyAnimeList") {
      (async () => {
        console.log("Hello, I am inside of disconnect function");
        const response = await browser.runtime.sendMessage({
          type: "logout",
          provider: provider,
        });
        console.log("response for deleting tokens", response);
        if (response.message === "myanimelist_tokens_deleted") {
          dispatch(deleteAnimeUserData());
          dispatch(updateConnectedProvider({ category, provider: null }));
        }
      })();
    }
  }

  return (
    <>
      <div className="h-[calc(600px-48px)] flex justify-center items-center w-full">
        <div className="grid grid-rows-3 gap-4 h-[90%] w-[90%]">
          <section className="anime-card border border-border bg-zinc-900 flex flex-col rounded-xl p-4 gap-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <div className="provider-type text-zinc-100 font-semibold text-base">
                Anime
              </div>
              <AnimeToggle />
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
                    <button
                      onClick={() => {
                        onDisconnect("anime", animeUserData.provider);
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition shadow-sm"
                    >
                      Disconnect
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-zinc-400 text-base">Not Connected</span>
                  <div className="content-center">
                    <button
                      onClick={() => {
                        onConnect("anime", selectedAnimeProvider);
                      }}
                      className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition shadow-sm"
                    >
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
    </>
  );
}

export default Login;
