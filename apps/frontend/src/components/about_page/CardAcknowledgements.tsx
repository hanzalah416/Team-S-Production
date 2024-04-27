import * as React from "react";


import styles from "./AboutPage.module.css";

interface ProjectCardProps {


    imgUrl: string;
    label: string;
    font: string;
    color: string;
    size: string;

}


const ProjectCard: React.FC<ProjectCardProps> = ({


                                                     imgUrl,
                                                     label,
                                                     font,
                                                     color,
                                                     size,

                                                 }) => {


    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div className={styles.memberContainer}>

                <img
                    src={imgUrl}
                    style={{
                        bottom: "20px",
                        position: "relative",
                        width: "30vh",
                        height: "30vh",
                        objectFit: "cover",
                        marginLeft: "auto",
                        marginRight: "auto",
                        justifyContent: "center",
                        cursor: "pointer", // Added cursor style for better user experience
                    }}
                />

                <br/>
                <h1
                    style={{
                        position: "relative",
                        color: color,
                        fontFamily: font,
                        alignItems: "center",
                        fontSize: size,
                        textAlign: "center",
                        cursor: "pointer", // Added cursor style for better user experience
                        bottom: "20px"
                    }}
                >
                    {label}
                </h1>
            </div>

        </div>
    );
};

export default ProjectCard;
