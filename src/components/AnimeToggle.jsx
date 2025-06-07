import React, { useState } from "react";
import { motion } from "framer-motion";

const AnimeToggle = () => {

  const [selected, setSelected] = useState('mal');
  const setToggle = (option) => {
    setSelected(option)
  }
  return (
    <>
    <div className="inline-flex justify-between items-center outer-box bg-[#1e1e22] rounded-xl p-1 space-x-2">
      <button className={
        selected === 'mal' ? "px-2 bg-sky-800 text-white rounded-xl": "px-2 hover:bg-button_hover_bg rounded-xl text-white"  
      }onClick={() => {
        setToggle('mal')
      }}>
        MyAnimeList</button>
      <button className={
        selected === 'anilist' ? "px-2 bg-sky-800 text-white rounded-xl": "px-2 hover:bg-button_hover_bg rounded-xl text-white"
      } onClick={() => {
        setToggle('anilist')
      }}>AniList</button>
    </div>
    </>
  );
};

export default AnimeToggle;
