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
import "./AboutPage.module.css";
import Card from './Card';

const Project = [
    {

        description: "Documentation Analyst, Full Stack" ,
        imgUrl: chris,
    },
    {

        description: "Project Manager, Full Stack",
        imgUrl: jacob,
    },
    {

        description: "Full Stack",
        imgUrl: hanz,
    },
    {

        description: "Full Stack, Product Owner",
        imgUrl: jav,
    },
    {

        description: "Full Stack",
        imgUrl: went,
    },
    {

        description: "Assistant Lead Software Engineers, Full Stack",
        imgUrl: kim,
    },
    {

        description: "Lead Software Engineer, Full Stack",
        imgUrl: matt,
    },
    {

        description: "Assistant Lead Software Engineers, Full stack",
        imgUrl: nate,
    },
    {

        description: "Full Stack",
        imgUrl: ken,
    },
    {

        description: "Full Stack",
        imgUrl: dor,
    },
    {
        description: "Full Stack, Scrum Master",
        imgUrl: li,
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
            <h2 className="text-7xl text-bold">AboutPage </h2>
            <p>
                WPI Computer Science Department, CS3733-D24 Software Engineering, Prof. Wilson Wong,
                Team S coach: Youssef Benchikhi Thank Brigham and Women’s Hospital and their representative, Andrew
                Shinn.
            </p>

            {
                Project.map(item => <Card {...item} key={item.description}/>)
            }
            <p>
                The Brigham & Women’s Hospital maps and data used in
                this application are copyrighted and provided for the sole use of educational purposes.
            </p>
        </section>
    );
};
