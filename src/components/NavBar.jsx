import { ChevronLeft, UserRoundCog } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import Login from "../pages/Login";
import { useState } from "react";

function NavBar() {
  const animeUserData = useSelector((state) => state.user.animeUserData);
  const movieUserData = useSelector((state) => state.user.movieUserData);
  const tvShowUserData = useSelector((state) => state.user.tvShowUserData);

  console.log(
    "userData from navbar:",
    animeUserData,
    movieUserData,
    tvShowUserData
  );
  const currentPage = useLocation();

  return (
    <div>
      <nav className="flex navbar bg-[#0B0F10] border-b border-border h-[52px] w-full">
        <ul className="flex justify-between items-center w-full pr-4 pl-2 h-full">
          <li className="list-none">
            {(animeUserData || movieUserData || tvShowUserData) &&
              currentPage.pathname === "/login" && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.8 }}
                  className=""
                >
                  <Link to="/">
                    <ChevronLeft
                      width={38}
                      height={38}
                      color="white"
                      className="left-button cursor-pointer"
                    />
                  </Link>
                </motion.div>
              )}
          </li>
          <li>
            {currentPage.pathname === "/" && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
                <Link to="/login">
                  <UserRoundCog
                    width={38}
                    height={38}
                    color="white"
                    className="user-settings cursor-pointer"
                  />
                </Link>
              </motion.div>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
