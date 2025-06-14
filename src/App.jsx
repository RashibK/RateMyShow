import "./App.css";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes";
import NavBar from "./components/NavBar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateConnectedProvider } from "./features/ui/uiSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function rehydrateConnectedProviders() {
      const result = await browser.storage.session.get("connected_providers");
      const data = result.connected_providers;
      if (data?.anime?.name) {
        dispatch(
          updateConnectedProvider({
            category: "anime",
            provider: data.anime.name,
          })
        );
      }
      if (data?.movie?.name) {
        dispatch(
          updateConnectedProvider({
            category: "movie",
            provider: data.movie.name,
          })
        );
      }
      if (data?.tvShow?.name) {
        dispatch(
          updateConnectedProvider({
            category: "tvShow",
            provider: data.tvShow.name,
          })
        );
      }
    }
    rehydrateConnectedProviders();
  }, [dispatch]);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
