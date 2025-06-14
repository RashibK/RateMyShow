import { useState } from "react";
import Dialog from "./Dialog";
import { useDispatch, useSelector } from "react-redux";
import { updateSelectedProvider } from "../features/ui/uiSlice";

const AnimeToggle = () => {
  const [selected, setSelected] = useState("MyAnimeList");
  const dispatch = useDispatch();

  const currentSelected = useSelector(
    (state) => state.ui.selectedProviders.anime
  );

  console.log("this is the currently selected value", currentSelected);
  const currentConnected = useSelector(
    (state) => state.ui.connectedProviders.anime
  );
  console.log("This is the currently connected provider: ", currentConnected);
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
            if (currentSelected != "MyAnimeList") {
              if (currentConnected) {
                setIsDialogOpen(true);
              } else {
                dispatch(
                  updateSelectedProvider({
                    category: "anime",
                    provider: "MyAnimeList",
                  })
                );
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
            if (currentSelected != "AniList") {
              if (currentConnected) {
                setIsDialogOpen(true);
              } else {
                dispatch(
                  updateSelectedProvider({
                    category: "anime",
                    provider: "AniList",
                  })
                );
              }
            }
          }}
        >
          AniList
        </button>
      </div>

      {isDialogOpen && (
        <Dialog
        category = {'anime'}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          setToggle={setToggle}
          current={currentSelected}
          newSelected={
            currentSelected == "MyAnimeList" ? "AniList" : "MyAnimeList"
          }
        />
      )}
    </>
  );
};

export default AnimeToggle;
