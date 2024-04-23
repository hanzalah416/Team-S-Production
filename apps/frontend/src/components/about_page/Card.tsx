import Tooltip from "@mui/material/Tooltip";

const ProjectCard = ({description, imgUrl}) => {
    return (
        <Tooltip title={description}>
            <img src={imgUrl} style={{
                width: '28%'
            }}/>
        </Tooltip>

    );
};
export default ProjectCard;
