import chris from "../assets/abtPage/chris.png";
import hanz from "../assets/abtPage/hanz.png";
import jacob from "../assets/abtPage/jacob.png";
import dor from "../assets/abtPage/dor.png";
import jav from "../assets/abtPage/jav.png";
import kim from "../assets/abtPage/kim.png";
import went from "../assets/abtPage/went.png";
import matt from "../assets/abtPage/matt.png";
import nate from "../assets/abtPage/nate.png";
import ken from "../assets/abtPage/ken.png";
import li from "../assets/abtPage/li.png";
import Card from "./Card";
import styles from "./AboutPage.module.css";
import BackgroundImg2 from "../assets/blue-background2.jpg";
import bluePin1 from "./blue-pin.png";
//import bluePin2 from "./blue-pin2.png";
//import bluePin3 from "./blue-pin3.png";
import yellowPin from "./yellow-pin.png";

const Project = [
    {
        description: "",
        imgUrl: dor,
        label: "Dorothy Alexander",
        title: "Position: Full Stack Developer ",
        font: "Elia",
        color: "#D0B136",
        size: "25px",
    },

  {
    description: "Project Manager, Full Stack Developer, quote1:TBD",
    imgUrl: jacob,
    label: "Jacob Antepli",
      title: "Position: Project Manager, Full Stack Developer ",
    font: "Elia",
    color: "#292877",
    size: "35px",
  },



  {
    description: "\"The average person admires perfection and seeks to obtain it. But what’s the point of achieving perfection? There is none. Nothing. Not a single thing ... If something is perfect, then there is nothing left. There is no room for imagination. No place left for that person to gain additional knowledge or abilities. Do you know what that means? For scientists such as us, perfection only brings despair. It is our job to create things more wonderful than anything before them, but never to obtain perfection.” – Kurotsuchi Mayuri  " +
        "",
    imgUrl: matt,
    label: "Matt Crane",
      title: "Position: Lead Software Engineer, Full Stack Developer ",
    font: "Elia",
      color: "#D0B136",
    size: "35px",
  },
    {
        description:
            "  \"The past is a basket, it catches all that's tragic. Everything is different now\" - Mother Mpther",
        imgUrl: kim,
        label: "Kim Cummings",
        title: "Position: Assistant Lead, Full Stack Developer ",
        font: "Elia",
        color: "#D0B136",
        size: "30px",
    },

  {
    description: " \"Everything in moderation, including moderation\" -Oscar Wilde ",
    imgUrl: chris,
    label: "Christopher Hunt",
      title: "Position: Documentation Analyst, Full Stack Developer ",
    font: "Elia",
      color: "#D0B136",
    size: "29px",

  },
  {
    description: " ",
    imgUrl: li,
    label: "Jeffrey Li",
      title: "Position: Scrum Master, Full Stack Developer ",
    font: "Elia",
      color: "#292877",
    size: "35px",
  },
  {
    description: " ",
    imgUrl: jav,
    label: "Javier Moncada",
      title: "Position: Product Owner, Full Stack Developer ",
    font: "Elia",
      color: "#D0B136",
    size: "30px",
  },
  {
    description: " “Never look back unless you are planning to go that way.” -Henry David Thoreau",
    imgUrl: hanz,
    label: "Hanzalah Qamar",
      title: "Position: Full Stack Developer ",
    font: "Elia",
      color: "#292877",
    size: "29px",
  },

  {
    description:
      " ",
    imgUrl: nate,
    label: "Nathaniel Schneider",
      title: "Position: Assistant Lead, Full Stack Developer ",
    font: "Elia",
      color: "#D0B136",
    size: "25px",
  },
  {
    description: "\"To know what you know and what you do not know, that is true knowledge.\" - Confucius ",
    imgUrl: ken,
    label: "Ken Sebastian",
      title: "Position: Full Stack Developer ",
    font: "Elia",
      color: "#292877",
    size: "35px",
  },
    {
        description: "\"I came, I saw I conquered\" -Julius Caesar  ",
        imgUrl: went,
        label: "Wentao Yu",
        title: "Position: Full Stack Developer ",
        font: "Elia",
        color: "#D0B136",
        size: "35px",
    },
];

export const AboutPage = () => {
  return (
    <div
      style={{
        zIndex: '2',
        top: "10px",
        backgroundImage: `url(${BackgroundImg2})`,
        height: "100vh",
        width: "100vw",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100%",
        backgroundPosition: "center center",
        overflowX: "hidden",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "30px",
          paddingTop: "120px",
          paddingBottom: "40px",
        }}
      >
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: "30px",
          }}
        >
          <h1 className={styles.heading}>Our Team</h1>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "35px",
          }}
        >
          {Project.map((item) => (
            <div className={styles.pictureBackground}>
                {item.label === 'Dorothy Alexander' ? (
                    <img src={yellowPin} className={styles.yellowPin} />
                ) :
                item.label === 'Kim Cummings' ? (
                    <img src={yellowPin} className={styles.yellowPin} />
                ) :
                item.label === 'Wentao Yu' ? (
                    <img src={yellowPin} className={styles.yellowPin} />
                ) :
                item.label === 'Jeffrey Li' ? (
                    <img src={yellowPin} className={styles.yellowPin} />
                ) :
                item.label === 'Hanzalah Qamar' ? (
                    <img src={yellowPin} className={styles.yellowPin} />
                ) :
                item.label === 'Ken Sebastian' ? (
                    <img src={yellowPin} className={styles.yellowPin} />
                ) :
                (
                    <img src={bluePin1} className={styles.bluePin1} />
                )}
                <Card {...item} key={item.description} />
            </div>
          ))}
        </div>
        <div>
          <h1 className={styles.secondary}>WPI Computer Science Department</h1>

          <h1 className={styles.secondary}>Professor Wilson Wong</h1>

          <h1 className={styles.secondary}>Team Coach: Youssef Benchikhi </h1>

          <p className={styles.iaintreadinallat}>
            We would like to thank Brigham and Women's Hospital and their
            representative Andrew Shinn
          </p>
          <p className={styles.text}>
            *The Brigham & Women’s Hospital maps and data used in this
            application are copyrighted and provided for the sole use of
            educational purposes.
          </p>
        </div>
      </section>
    </div>
  );
};
