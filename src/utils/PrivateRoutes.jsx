import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { malRefreshAccessToken } from "../features/auth/authSlice";
import {
  addAnimeUserData,
  addMovieUserData,
  addTvShowUserData,
} from "../features/user/userSlice";
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
        }
        if (response.movie) {
          dispatch(addMovieUserData(response.movie.userData));
        }
        if (response.tv_show) {
          dispatch(addTvShowUserData(response.tv_show.userData));
        }

        if (
          response?.anime?.userData ||
          response?.movie?.userData ||
          response?.tv_show?.userData
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

  if (loading) return <div>Loading...</div>;

  return userData ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes;
