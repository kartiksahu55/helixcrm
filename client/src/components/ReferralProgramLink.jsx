import { FaCopy } from "react-icons/fa";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

const ReferralProgramLink = () => {
  return (
    <div className="mt-6 w-[95%] overflow-hidden rounded-2xl shadow-lg">
      <div className=" bg-gradient-to-t from-black to-[#006CCF] p-5 pl-10">
        <h2 className="mb-2 text-4xl font-semibold text-slate-50">
          Refer & Earn Program
        </h2>
        <p className="text-slate-300">
          Refer a customer and get paid when the customer purchase the services
        </p>
      </div>

      {/* ##Share-My-Referal## */}
      <div className="w-[80%] p-5 pl-10 ">
        <h2 className="text-2xl font-semibold text-slate-800">
          Share my referal link with friends
        </h2>

        {/* ###Copy-Link### */}
        <div className="my-3 flex h-12 overflow-hidden rounded-full border-2 ">
          <input
            type="url"
            placeholder="https://www.referallink.com/?channel=myreferal"
            className="h-full w-[calc(100%-130px)] px-4 text-xl outline-none"
          />
          <button className="flex h-full w-[130px] cursor-pointer bg-yellow-400 px-[10px] font-semibold text-slate-900 active:bg-yellow-300">
            <FaCopy className="text-xl" />
            <span>Copy Link</span>
          </button>
        </div>

        {/* ###Social-Media### */}
        <div className="mt-10 flex flex-wrap gap-2 text-2xl text-white">
          <button className="flex w-44 cursor-pointer gap-1 rounded-full bg-[#4267B2] px-3 py-2 active:scale-95">
            <FaFacebookF className="text-3xl" />
            <span>Facebook</span>
          </button>
          <button className="flex w-44 cursor-pointer gap-1 rounded-full bg-[#25D366] px-3 py-2 active:scale-95">
            <FaWhatsapp className="text-3xl" />
            <span>WhatsApp</span>
          </button>
          <button className="flex w-44 cursor-pointer gap-1 rounded-full bg-[#0072B1] px-3 py-2 active:scale-95">
            <FaLinkedinIn className="text-3xl" />
            <span>Linkedin</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralProgramLink;
