import "./App.css";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes";
import NavBar from "./components/NavBar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  updateConnectedProvider,
  updateSelectedProvider,
} from "./features/ui/uiSlice";

function App() {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   async function rehydrateConnectedProviders() {
  //     const category = ["anime", "movie", "tvShow"];
  //     const result = await browser.storage.session.get("connected_providers");
  //     const data = result.connected_providers || {};
  //     category.forEach((category) => {
  //       const providerName = data[category]?.name;
  //       if (providerName) {
  //         dispatch(
  //           updateConnectedProvider({
  //             category: category,
  //             provider: providerName,
  //           })
  //         );
  //         dispatch(
  //           updateSelectedProvider({
  //             category: category,
  //             provider: providerName,
  //           })
  //         );
  //       }
  //     });
  //   }
  //   rehydrateConnectedProviders();
  // }, [dispatch]);

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
