import SurveyIcon from "../../assets/survey.png";
import TxcIcon from "../../assets/txc.png";
import Github from "../../assets/github.png";
import Bruce from "../../assets/bruce.png";
import { FC } from "react";

export const SURVEY_URL = "https://wj.qq.com/s2/12557549/d61e/";
export const TXC_URL = "https://support.qq.com/products/596295";

export const Links: FC = () => {
  return (
    <div className="footer-links">
      <a className="link-icon bruce" href="https://bruceau.com" target="_blank">
        <img src={Bruce} alt="" className="link-icon-img" />
      </a>
      <a
        className="link-icon github"
        href="https://github.com/ArthurYung"
        target="_blank"
      >
        <img src={Github} alt="" className="link-icon-img" />
      </a>
      <a className="link-icon survey" href={SURVEY_URL} target="_blank">
        <img src={SurveyIcon} alt="" className="link-icon-img" />
      </a>
      <a className="link-icon txc" href={TXC_URL} target="_blank">
        <img src={TxcIcon} alt="" className="link-icon-img" />
      </a>
    </div>
  );
};
