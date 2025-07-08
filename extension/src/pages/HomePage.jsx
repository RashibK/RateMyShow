import { useDispatch, useSelector } from "react-redux";
import Rate from "./Rate";

function HomePage() {
  const animeUserData = useSelector((state) => state.user.animeUserData);
  const dispatch = useDispatch();

  return (
    <>
      <div className="bg-background h-[calc(600px-52px)]">
        {animeUserData?.username && <Rate animeUserData={animeUserData} />}
      </div>
    </>
  );
}

export default HomePage;
