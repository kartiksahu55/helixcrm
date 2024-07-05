import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import page_not_found_404 from "../assets/404-page-not-found.svg";
import Button from "../components/UI/Button";
// import { isLoadingCheck } from "../slices/user/userDataSlice";

const NoPage = () => {
  return (
    <div>
      <img src={page_not_found_404} className="lg:w-1/2" />
      <div className="text-center">
        <Link to={"/"}>
          <Button btnName="HOME"></Button>
        </Link>
      </div>
    </div>
  );
};

export default NoPage;
