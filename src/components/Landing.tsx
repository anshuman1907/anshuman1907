import { PropsWithChildren } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              ANSHUMAN
              <br />
              <span>VERMA</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>Next.js</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Web</div>
              <div className="landing-h2-2">Developer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">React</div>
              <div className="landing-h2-info-1">Next.js</div>
            </h2>
          </div>
        </div>
        <div className="scroll-down" onClick={() => {
          const smoother = (window as any).smoother;
          if (smoother) smoother.scrollTo("#about", true, "top top");
        }}>
          <MdKeyboardArrowDown />
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
