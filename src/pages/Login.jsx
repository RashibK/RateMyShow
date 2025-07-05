import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AnimeToggle from "../components/AnimeToggle";
import MovieToggle from "../components/MovieToggle";
import {
  addAnimeUserData,
  deleteAnimeUserData,
} from "../features/user/userSlice";
import { onConnectProvider } from "../features/auth/authSlice";
import { updateConnectedProvider } from "../features/ui/uiSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const animeUserData = useSelector((state) => state.user.animeUserData);
  const movieUserData = useSelector((state) => state.user.movieUserData);
  const tvShowUserData = useSelector((state) => state.user.tvShowUserData);

  const selectedAnimeProvider = useSelector(
    (state) => state.ui.selectedProviders.anime
  );

  const connectedAnimeProvider = useSelector(
    (state) => state.ui.connectedProviders.anime
  );

  const onConnect = async (category, provider) => {
    console.log("loggin in from login component, ", provider);
    const result = await dispatch(
      onConnectProvider({ category, provider })
    ).unwrap();

    if (
      result.status === "auth_started" ||
      result.status === "already_connected"
    ) {
      if (result.status === "auth_started") {
        console.log("when auth is new", result.response);
      } else if (result.status === "already_connected") {
        console.log("when auth  not new", result.response);
      }

      const response = await browser.runtime.sendMessage({
        type: "connected_provider",
        action: "update_connected_provider",
        provider: result.provider,
        userData: result.response,
      });
      console.log("response for logging ing", response);
      dispatch(addAnimeUserData(response));
      dispatch(updateConnectedProvider({ category, provider }));
      navigate("/");
    }
  };

  function onDisconnect(category, provider) {
    (async () => {
      console.log("Hello, I am inside of disconnect function");
      const response = await browser.runtime.sendMessage({
        type: "logout",
        provider: provider,
      });

      if (response.message === `${provider.toLowerCase()}_tokens_deleted`) {
        console.log("deleting more stuffs");
        dispatch(deleteAnimeUserData());
        dispatch(updateConnectedProvider({ category, provider: null }));
      }
    })();
  }

  return (
    <>
      <div className="h-[calc(600px-52px)] bg-background flex justify-center items-center w-full">
        <div className="grid grid-rows-3 gap-4 h-[90%] w-[90%]">
          <section className="anime-card border border-border bg-[#111418] flex flex-col rounded-xl p-4 gap-4 shadow-sm">
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
                        src={animeUserData.image}
                        className="w-full h-full rounded-full cursor-pointer"
                      />
                    </div>
                    <span className="text-zinc-100 text-base">
                      Connected as{" "}
                      <span className="font-medium text-base cursor-pointer">
                        {animeUserData.username}
                      </span>
                    </span>
                  </div>
                  <div className="content-center">
                    <button
                      onClick={() => {
                        onDisconnect("anime", connectedAnimeProvider);
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
          <section className="movie-card border border-border bg-[#111418] flex flex-col rounded-xl p-4 gap-4 shadow-sm">
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
                  <span className="text-zinc-400 text-base">Coming Soon...</span>
                  <div className="content-center">
                    <button className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition shadow-sm">
                      Connect
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>
          <section className="tv-shows-card border border-border bg-[#111418] flex flex-col rounded-xl p-4 gap-4 shadow-sm ">
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
                  <span className="text-zinc-400 text-base">Coming Soon...</span>
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
