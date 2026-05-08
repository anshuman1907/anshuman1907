import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>Barabanki, U.P., India</p>
            <p>
              <a
                href="mailto:anshumanv1907@gmail.com"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                anshumanv1907@gmail.com
              </a>
            </p>
            <p>+91-8765180699</p>
            <h4>Education</h4>
            <p>B.Tech Computer Science — 2020–2024</p>
            <p>Intermediate — 2018–2019</p>
            <p>High School — 2016–2017</p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/anshuman1907"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>
            <a
              href="https://leetcode.com/u/anshuman1907/"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LeetCode <MdArrowOutward />
            </a>
            <a
              href="https://github.com/anshuman1907"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Portfolio <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Anshuman Verma</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
