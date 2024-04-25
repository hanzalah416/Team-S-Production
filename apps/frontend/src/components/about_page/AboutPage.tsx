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
const Project = [
  {
    description: "Full Stack Developer",
    imgUrl: dor,
    label: "Dorothy Alexander",
    font: "Elia",
    color: "#D0B136",
    size: "30px",
  },
  {
    description: "Project Manager, Full Stack Developer",
    imgUrl: jacob,
    label: "Jacob Antepli",
    font: "Elia",
    color: "#292877",
    size: "35px",
  },
  {
    description: "Lead Software Engineer, Full Stack Developer",
    imgUrl: matt,
    label: "Matt Crane",
    font: "Elia",
    color: "#D0B136",
    size: "35px",
  },
  {
    description: "Assistant Lead Software Engineer, Full Stack Developer",
    imgUrl: kim,
    label: "Kim Cummings",
    font: "Elia",
    color: "#292877",
    size: "35px",
  },
  {
    description: "Documentation Analyst, Full Stack Developer",
    imgUrl: chris,
    label: "Christopher Hunt",
    font: "Elia",
    color: "#292877",
    size: "32px",
  },
  {
    description: "Full Stack Developer, Scrum Master",
    imgUrl: li,
    label: "Jeffrey Li",
    font: "Elia",
    color: "#D0B136",
    size: "35px",
  },
  {
    description: "Full Stack Developer, Product Owner",
    imgUrl: jav,
    label: "Javier Moncada",
    font: "Elia",
    color: "#292877",
    size: "35px",
  },
  {
    description: "Full Stack Developer",
    imgUrl: hanz,
    label: "Hanzalah Qamar",
    font: "Elia",
    color: "#D0B136",
    size: "33px",
  },

  {
    description: "Assistant Lead Software Engineer, Full Stack Developer",
    imgUrl: nate,
    label: "Nathaniel Schneider",
    font: "Elia",
    color: "#D0B136",
    size: "29px",
  },
  {
    description: "Full Stack Developer",
    imgUrl: ken,
    label: "Ken Sebastian",
    font: "Elia",
    color: "#292877",
    size: "35px",
  },
  {
    description: "Full Stack Developer",
    imgUrl: went,
    label: "Wentao Yu",
    font: "Elia",
    color: "#D0B136",
    size: "35px",
  },
];

export const AboutPage = () => {
  return (
      <div
          style={{
              backgroundImage: `url(${BackgroundImg2})`,
              height: "100vh",
              width: "100vw",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              minHeight: "100%",
              backgroundPosition: "center center",
              overflowX: "hidden",
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
                          <Card {...item} key={item.description}/>
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
                      *The Brigham & Women’s Hospital maps and data used in this application
                      are copyrighted and provided for the sole use of educational purposes.
                  </p>
              </div>
        </section>
      </div>
)
    ;
};
