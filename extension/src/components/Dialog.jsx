import { useDispatch, useSelector } from "react-redux";
import {
  deleteAnimeUserData,
  onDisconnectProvider,
} from "../features/user/userSlice";
import {
  updateConnectedProvider,
  updateSelectedProvider,
} from "../features/ui/uiSlice";

function Dialog({ category, onClose, newSelected }) {
  const dispatch = useDispatch();

  const currentConnected = useSelector(
    (state) => state.ui.connectedProviders[category]
  );
  console.log(currentConnected);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center">
        <div className="w-[300px] bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-4 shadow-md">
          <h2 className="text-sm font-semibold text-white mb-2">
            Switch Providers?
          </h2>
          <p className="text-sm text-zinc-300 mb-4">
            You're currently connected to{" "}
            <span className="font-semibold text-white">{currentConnected}</span>
            . To switch to{" "}
            <span className="font-semibold text-white">{newSelected}</span>,
            you'll be logged out first.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1 text-sm text-white bg-zinc-700 hover:bg-zinc-600 rounded-md transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                dispatch(deleteAnimeUserData());
                dispatch(onDisconnectProvider(currentConnected));
                dispatch(updateConnectedProvider({ category, provider: null }));
                dispatch(
                  updateSelectedProvider({
                    category: "anime",
                    provider: newSelected,
                  })
                );
                onClose();
              }}
              className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-500 rounded-md transition"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dialog;
