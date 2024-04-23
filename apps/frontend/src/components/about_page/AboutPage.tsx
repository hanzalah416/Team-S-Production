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
import Card from './Card';
import styles from "./AboutPage.module.css";
const Project = [
     {

        description: "Full Stack",
        imgUrl: dor,
        label: "Dorothy Alexander",
    },
    {

        description: "Project Manager, Full Stack Developer",
        imgUrl: jacob,
        label: "Jacob Antepli",
    },
    {

        description: "Lead Software Engineer, Full Stack Developer",
        imgUrl: matt,
        label: "Matthew Crane",

    },
    {

        description: "Assistant Lead Software Engineers, Full Stack Developer",
        imgUrl: kim,
        label: "Kimberly Cummings",
    },
    {
        description: "Documentation Analyst, Full Stack Developer" ,
        imgUrl: chris,
        label: "Christopher Hunt",

    },
    {

        description: "Full Stack, Scrum Master",
        imgUrl: li,
        label: "Jeffrey Li",
    },
    {

        description: "Full Stack Developer, Product Owner",
        imgUrl: jav,
        label: "Javier Moncada",
    },
    {

        description: "Full Stack Developer",
        imgUrl: hanz,
        label: "Hanzalah Qamar",
    },




    {

        description: "Assistant Lead Software Engineers, Full Stack Developer",
        imgUrl: nate,
        label: "Nathaniel Schneider",
    },
    {

        description: "Full Stack",
        imgUrl: ken,
        label: "Ken Sebastian",
    },
    {

        description: "Full Stack Developer",
        imgUrl: went,
        label: "Wentao Yu",
    },

];

export const AboutPage = () => {
    return (

        <section style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '30px',
            paddingTop: '120px',
            paddingBottom: '40px',
        }}>
            <h1 className={styles.heading}>Our Team</h1>

            <h1 className={styles.secondary}>Organization: WPI Computer Science Department</h1>
            <h1 className={styles.secondary}>Course: CS3733-D24 Software Engineering</h1>

          <p className={styles.iaintreadinallat}>We would first like to extend our gratitute towards Professor Wilson Wong for his guidance and direction throughout the entirety of this project and for being extremely understanding when circumstances arose that were outside of our control. We also like to extend our appreciation to our team coach, Youssef Benchikhi for being extremely helpful in our development process as well as for consistently being present at our meetings. Finally, we would like to thank Brigham and Women's Hospital and Andrew Shinn for providing us with this opportunity to develop this application.</p>


            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '35px'}}>
                {
                    Project.map(item => <Card {...item} key={item.description}/>)

                }
            </div>
            <p className={styles.text}>
                *The Brigham & Women’s Hospital maps and data used in
                this application are copyrighted and provided for the sole use of educational purposes.
            </p>
        </section>
    );
};
