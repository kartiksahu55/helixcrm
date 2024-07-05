import { useSelector } from "react-redux";

import Loader from "../components/UI/Loader/Loader";
import Footer from "./Footer";
import Header from "./Header";

const DefaultLayout = ({ children }) => {
  const isLoading = useSelector((state) => state.isLoadingCheck);

  return (
    <>
      {isLoading ? (
        <div className="flex h-[100vh] w-[100vw] bg-slate-500 ">
          <Loader type={"type3"}></Loader>
        </div>
      ) : (
        <div>
          <Header />
          {children}
          <Footer />
        </div>
      )}
    </>
  );
};

export default DefaultLayout;
