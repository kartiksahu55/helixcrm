const Button = ({ btnType, onClick, btnName }) => {
  return (
    <button
      className={`w-32 rounded-lg border border-2 px-2 py-1 text-lg text-white active:scale-95  ${
        btnType === "secondaryButton"
          ? "border-white hover:bg-slate-100 hover:text-black"
          : "border-none bg-gradient-to-t from-[#0093C1] to-[#004280] hover:bg-gradient-to-b"
      } `}
      onClick={onClick}
    >
      {btnName}
    </button>
  );
};

export default Button;
