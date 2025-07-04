import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { malRefreshAccessToken } from "../features/auth/authSlice";
import {
  addAnimeUserData,
  addMovieUserData,
  addTvShowUserData,
} from "../features/user/userSlice";
import LoadingAnimation from "./LoadingAnimation";
import {
  updateConnectedProvider,
  updateSelectedProvider,
} from "../features/ui/uiSlice";
function PrivateRoutes() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(false);

  const dispatch = useDispatch();

  const animeUserData = useSelector((state) => state.user.animeUserData);
  const movieUserData = useSelector((state) => state.user.movieUserData);
  const tvShowUserData = useSelector((state) => state.user.tvShowUserData);

  useEffect(() => {
    async function getUserData() {
      try {
        console.log("Hello from private route");
        const response = await browser.runtime.sendMessage({
          type: "send_user_data",
          provider: "all",
        });

        console.log("second time around:", response);

        if (response.anime) {
          dispatch(addAnimeUserData(response.anime.userData));
          dispatch(
            updateSelectedProvider({
              category: "anime",
              provider: response.anime.name,
            })
          );
          dispatch(
            updateConnectedProvider({
              category: "anime",
              provider: response.anime.name,
            })
          );
        }
        if (response.movie) {
          dispatch(addMovieUserData(response.movie.userData));
          dispatch(
            updateSelectedProvider({
              category: "movie",
              provider: response.movie.name,
            })
          );
          dispatch(
            updateConnectedProvider({
              category: "movie",
              provider: response.movie.name,
            })
          );
        }
        if (response.tvShow) {
          dispatch(addTvShowUserData(response.tvShow.userData));
          dispatch(
            updateSelectedProvider({
              category: "tvShow",
              provider: response.tvShow.name,
            })
          );
          dispatch(
            updateConnectedProvider({
              category: "tvShow",
              provider: response.tvShow.name,
            })
          );
        }

        if (
          response?.anime?.userData ||
          response?.movie?.userData ||
          response?.tvShow?.userData
        ) {
          setUserData(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getUserData();
  }, []);

  if (loading)
    return (
      <div className="h-[calc(600px-52px)]">
        <LoadingAnimation />
      </div>
    );

  return userData ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes;
