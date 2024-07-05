import './Loader.css'

const Loader = ({ type }) => {
  return (
    <div className="w-full h-full flex">
      {type === "type1" && <span className="loader1"></span>}
      {type === "type2" && <span className="loader2"></span>}
      {type === "type3" && <span className="loader3"></span>}
    </div>
  );
};

export default Loader;
