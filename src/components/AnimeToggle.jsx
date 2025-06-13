import { useState } from "react";
import Dialog from "./Dialog";
import { useDispatch, useSelector } from "react-redux";
import { updateSelectedAnimeProvider } from "../features/ui/uiSlice";

const AnimeToggle = ({ animeProvider }) => {
  const [selected, setSelected] = useState("MyAnimeList");
  const dispatch = useDispatch();

  const currentSelected = useSelector(
    (state) => state.ui.currentSelectedAnimeProvider
  );

  const currentConnected = useSelector(
    (state) => state.ui.currentConnectedAnimeProvider
  );

  const setToggle = (option) => {
    setSelected(option);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // check if another provider is already logged in, if so, don't allow for switching, show a popup instead
  function isOtherProviderLoggedIn() {}

  return (
    <>
      <div className="inline-flex justify-between items-center outer-box bg-[#1e1e22] rounded-xl p-1 space-x-2">
        <button
          className={
            currentSelected === "MyAnimeList"
              ? "px-2 bg-sky-800 text-white rounded-xl"
              : "px-2 hover:bg-button_hover_bg rounded-xl text-white"
          }
          onClick={() => {
            console.log(animeProvider);
            if (currentSelected != "MyAnimeList") {
              if (animeProvider) {
                setIsDialogOpen(true);
              } else {
                dispatch(updateSelectedAnimeProvider("MyAnimeList"));
              }
            }
          }}
        >
          MyAnimeList
        </button>
        <button
          className={
            currentSelected === "AniList"
              ? "px-2 bg-sky-800 text-white rounded-xl"
              : "px-2 hover:bg-button_hover_bg rounded-xl text-white"
          }
          onClick={() => {
            console.log(animeProvider);

            if (currentSelected != "AniList") {
              if (animeProvider) {
                setIsDialogOpen(true);
              } else {
                dispatch(updateSelectedAnimeProvider("AniList"));
              }
            }
          }}
        >
          AniList
        </button>
      </div>

      {isDialogOpen && (
        <Dialog
          onClose={() => {
            setIsDialogOpen(false);
          }}
          setToggle={setToggle}
          current={currentSelected}
          newSelected={selected == "MyAnimeList" ? "AniList" : "MyAnimeList"}
        />
      )}
    </>
  );
};

export default AnimeToggle;
