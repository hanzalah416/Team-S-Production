import React from "react";
import "./HeroPageCard.css";
import { Link } from "react-router-dom";

interface cardInfo {
  title: string;
  image: string;
  link: string;
}

function HeroPageCard(props: cardInfo) {
  return (
    <Link to={props.link}>
      <div className={"toHover"}>
        <div className="hero-page-cards">
          <img className={"img"} src={props.image} alt="hero-card" />
          <div className={"blueTextBack"}>
            <p className={"textTitle"}>{props.title}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default HeroPageCard;
