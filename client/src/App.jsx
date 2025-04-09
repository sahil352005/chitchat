import { useEffect } from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getUserProfileThunk } from "./store/slice/user/user.thunk";
import { Outlet } from "react-router-dom";

function App() {
  
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(getUserProfileThunk());
    })();
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Outlet />
    </>
  );
}

export default App;
