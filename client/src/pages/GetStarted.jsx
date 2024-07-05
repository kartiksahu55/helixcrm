import { Outlet } from "react-router-dom";

import DefaultLayout from "../layouts/DefaultLayout";

const GetStarted = () => {
  return (
    <DefaultLayout>
      <div className="flex h-[calc(100vh-50px-50px)] overflow-hidden">
        <Outlet />
      </div>
    </DefaultLayout>
  );
};

export default GetStarted;
