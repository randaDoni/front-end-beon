import "./navbar.scss";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <img src="robot.png" className="icon" alt="" />
        <span>RT Maju</span>
      </div>
      <div className="icons">
        {/* <img src="/search.svg" alt="" className="icon" />
        <img src="/app.svg" alt="" className="icon" />
        <img src="/expand.svg" alt="" className="icon" />
        <div className="notification">
          <img src="/notifications.svg" alt="" />
          <span>1</span>
        </div> */}
        <div className="user">
          <img
            src="/panda.png"
            alt="Icon"
          />
          <span>Hallo Pak RT</span>
        </div>
        <img src="/settings.svg" alt="" className="icon" />
      </div>
    </div>
  );
};

export default Navbar;
