import { Link, NavLink } from "react-router-dom";

import analyzing_process_icon from "../assets/analyzing-process-outline.svg";
import market_process_icon from "../assets/market-analysis-isometric.svg";
import Button from "../components/UI/Button";
import DefaultLayout from "../layouts/DefaultLayout";

const Home = () => {
  return (
    <DefaultLayout>
      <main className="h-[calc(100vh-50px)]">
        <section className="flex h-full w-full flex-col overflow-auto bg-gradient-to-t from-slate-700 via-slate-600 to-slate-900 lg:flex-row">
          <div className="top-[8%] px-[10%] lg:top-[0%] lg:w-3/5 ">
            <h2 className="text-6xl font-bold text-white">
            Automate Lead Management For All Your Teams
            </h2>
            <p className="my-6 text-xl text-slate-200">
            Instantly capture, sort, and distribute leads to the right sales reps with powerful lead management automation. Slash your response time and never lose a lead.
            </p>
            <div>
              <Link to={"/get-started/signin"}>
              <Button btnName={"Get Started"}></Button>
              </Link>
            </div>
          </div>

          <div className=" relative">
            <img
              className="left-12 top-10 w-[100%] md:right-0 md:top-0 md:w-[400px] lg:left-0 lg:top-[100px]  lg:w-[500px]"
              src={analyzing_process_icon}
              alt=""
            />
            <img
              className="left-[-50px] top-[-40px] w-[80%] md:w-[400px] lg:left-[-180px] lg:top-[-100px] lg:w-[400px]"
              src={market_process_icon}
              alt=""
            />
          </div>
        </section>
      </main>
    </DefaultLayout>
  );
};

export default Home;
