import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAnimeUserData } from "../features/user/userSlice";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import Login from "./Login";
import Rate from "./Rate";

function HomePage() {

  const animeUserData = useSelector((state) => state.user.animeUserData);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const getUserData = async function () {
  //     const userData = await browser.runtime.sendMessage({type: 'send_user_data', provider:'mal'})
  //     dispatch(addAnimeUserData(userData))
  //   }
  //   getUserData();
  // }, [])

  return (
    <>
        <div className="text-white">Hello {animeUserData?.username}</div>
    {animeUserData?.username && <Rate />}
    </>

  )
}

export default HomePage