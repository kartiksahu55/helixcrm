const CardWhite = ({ children }) => {
  return (
    <div className="flex h-96 w-[600px] flex-wrap overflow-auto rounded-3xl bg-gradient-to-t from-slate-50 to-slate-100 ">
      {children}
    </div>
  );
};

export default CardWhite;
