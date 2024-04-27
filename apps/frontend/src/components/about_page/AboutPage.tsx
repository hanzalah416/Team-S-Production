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
import shinn from "../assets/abtPage/andrewshinn.png";
import bgw from "../assets/abtPage/bgw.png";
import youssef from "../assets/abtPage/goat.png";
import willy from "../assets/abtPage/wilsonwong.png";
import wpi from "../assets/abtPage/WPI.png";
import Card from "./Card";
import AckCard from "./CardAcknowledgements.tsx";
import styles from "./AboutPage.module.css";
import BackgroundImg2 from "../assets/blue-background2.jpg";
import bluePin1 from "./blue-pin.png";
//import bluePin2 from "./blue-pin2.png";
//import bluePin3 from "./blue-pin3.png";
import yellowPin from "./yellow-pin.png";

const OurTeam = [
    {
        description: "“This is Snake. Do you read me, Otacon?” -Solid Snake",
        imgUrl: dor,
        label: "Dorothy Alexander",
        title: "Dorothy Alexander: Full Stack Developer ",
        font: "Elia",
        color: "#D0B136",
        size: "25px",
    },

    {
        description: "\"Entertainment is one of the most important things in people's lives. Without it, they might go off the deep end. \" -Stan Lee",
        imgUrl: jacob,
        label: "Jacob Antepli",
        title: "Jacob Antepli: Project Manager, Full Stack Developer ",
        font: "Elia",
        color: "#292877",
        size: "25px",
    },


    {
        description: "\"The average person admires perfection and seeks to obtain it. But what’s the point of achieving perfection? There is none. Nothing. Not a single thing ... If something is perfect, then there is nothing left. There is no room for imagination. No place left for that person to gain additional knowledge or abilities. Do you know what that means? For scientists such as us, perfection only brings despair. It is our job to create things more wonderful than anything before them, but never to obtain perfection.” – Kurotsuchi Mayuri  " +
            "",
        imgUrl: matt,
        label: "Matt Crane",
        title: "Matt Crane: Lead Engineer, Full Stack Developer ",
        font: "Elia",
        color: "#D0B136",
        size: "25px",
    },
    {
        description:
            "  \"The past is a basket, it catches all that's tragic. Everything is different now\"    -Mother Mother",
        imgUrl: kim,
        label: "Kim Cummings",
        title: "Kim Cummings: Assistant Lead, Full Stack Developer ",
        font: "Elia",
        color: "#292877",
        size: "25px",
    },

    {
        description: " \"Everything in moderation, including moderation\" -Oscar Wilde ",
        imgUrl: chris,
        label: "Christopher Hunt",
        title: "Christopher Hunt: Documentation Analyst, Full Stack Developer ",
        font: "Elia",
        color: "#D0B136",
        size: "25px",

    },
    {
        description: "\"You're mindful of it all when your mind full of it all \" -Drake ",
        imgUrl: li,
        label: "Jeffrey Li",
        title: "Jeffrey Li: Scrum Master, Full Stack Developer ",
        font: "Elia",
        color: "#292877",
        size: "25px",
    },
    {
        description: "\"Theory will take you only so far.\" - J. Robert Oppenheimer ",
        imgUrl: jav,
        label: "Javier Moncada",
        title: "Javier Moncada: Product Owner, Full Stack Developer ",
        font: "Elia",
        color: "#D0B136",
        size: "25px",
    },
    {
        description: " “Never look back unless you are planning to go that way.” -Henry David Thoreau",
        imgUrl: hanz,
        label: "Hanzalah Qamar",
        title: "Hanzalah Qamar: Full Stack Developer ",
        font: "Elia",
        color: "#292877",
        size: "25px",
    },

    {
        description:
            "“What Do You Care What Other People Think?”\n" +
            "-Richard Feynman ",
        imgUrl: nate,
        label: "Nathaniel Schneider",
        title: "Nathaniel Schneider: Assistant Lead, Full Stack Developer ",
        font: "Elia",
        color: "#D0B136",
        size: "25px",
    },
    {
        description: "\"To know what you know and what you do not know, that is true knowledge.\" - Confucius ",
        imgUrl: ken,
        label: "Ken Sebastian",
        title: "Ken Sebastian: Full Stack Developer ",
        font: "Elia",
        color: "#292877",
        size: "25px",
    },
    {
        description: "\"I came, I saw I conquered\" -Julius Caesar  ",
        imgUrl: went,
        label: "Wentao Yu",
        title: "Wentao Yu: Full Stack Developer ",
        font: "Elia",
        color: "#D0B136",
        size: "25px",
    },


];


const Acknowledgements = [
    {

        imgUrl: willy,
        label: "Prof Wilson Wong",
        font: "Elia",
        color: "#292877",
        size: "26px",
    },

    {

        imgUrl: youssef,
        label: "Youssef Benchikhi",
        font: "Elia",
        color: "#D0B136",
        size: "27px",
    },

    {

        imgUrl: shinn,
        label: "Andrew Shinn",
        font: "Elia",
        color: "#292877",
        size: "35px",
    },

    {

        imgUrl: bgw,
        label: "Brigham and Womens Hospital",
        font: "Elia",
        color: "#D0B136",
        size: "15px",
    },

    {
        imgUrl: wpi,
        label: "WPI CS Department",
        font: "Elia",
        color: "#292877",
        size: "23px",
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
                    {OurTeam.map((item) => (
                        <div className={styles.pictureBackground}>
                            {item.label === 'Dorothy Alexander' ? (
                                    <img src={yellowPin} className={styles.yellowPin}/>
                                ) :
                                item.label === 'Matt Crane' ? (
                                        <img src={yellowPin} className={styles.yellowPin}/>
                                    ) :
                                    item.label === 'Christopher Hunt' ? (
                                            <img src={yellowPin} className={styles.yellowPin}/>
                                        ) :
                                        item.label === 'Javier Moncada' ? (
                                                <img src={yellowPin} className={styles.yellowPin}/>
                                            ) :
                                            item.label === 'Nathaniel Schneider' ? (
                                                    <img src={yellowPin} className={styles.yellowPin}/>
                                                ) :
                                                item.label === 'Wentao Yu' ? (
                                                        <img src={yellowPin} className={styles.yellowPin}/>
                                                    ) :

                                                    (
                                                        <img src={bluePin1} className={styles.bluePin1}/>
                                                    )}
                            <Card {...item} key={item.description}/>
                        </div>
                    ))}


                </div>
                <div>
                    <h1 className={styles.heading}>Acknowledgements</h1><br/>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: "35px",
                        }}
                    >
                        {Acknowledgements.map((item) => (
                            <div className={styles.pictureBackground}>
                                {


                                    item.label === 'Youssef Benchikhi' ? (
                                            <img src={yellowPin} className={styles.yellowPin}/>
                                        ) :

                                        item.label === 'Brigham and Womens Hospital' ? (
                                                <img src={yellowPin} className={styles.yellowPin}/>
                                            ) :


                                            (
                                                <img src={bluePin1} className={styles.bluePin1}/>
                                            )}
                                <AckCard {...item} key={item.description}/>
                            </div>

                        ))}

                    </div>
                    <br/>
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
