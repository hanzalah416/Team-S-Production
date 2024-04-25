import Tooltip from "@mui/material/Tooltip";
import styles from "./AboutPage.module.css";
interface ProjectCardProps {
  description: string;
  imgUrl: string;
  label: string;
  font: string;
  color: string;
  size: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  description,
  imgUrl,
  label,
  font,
  color,
  size,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className={styles.memberContainer}>
        <Tooltip title={description}>
          <img
            src={imgUrl}
            style={{
              width: "30vh",
              height: "30vh",
              objectFit: "cover",
              justifyContent: "center",
            }}
          />
        </Tooltip>
        <h1
          style={{
            width: "30vh",
            height: "30vh",
            objectFit: "cover",
            marginLeft: "auto",
            marginRight: "auto",
            justifyContent: "center",
          }}
        />
      </Tooltip>
        <br />
      <h1
        style={{
          color: color,
          fontFamily: font,
          alignItems: "center",
          fontSize: size,
          textAlign: "center",
        }}
      >
        {label}
      </h1>
    </div>
  );
};
export default ProjectCard;
