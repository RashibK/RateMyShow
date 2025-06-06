import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "../features/user/userSlice";

function HomePage() {

  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserData = async function () {
      const userData = await browser.runtime.sendMessage({type: 'send_user_data'})
      dispatch(addUserData(userData))
    }
    getUserData();
  }, [])

  return (
    <div className="text-white">Hello {userData?.name}</div>
  )
}

export default HomePage