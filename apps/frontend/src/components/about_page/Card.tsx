import Tooltip from "@mui/material/Tooltip";

interface ProjectCardProps {
    description: string;
    imgUrl: string;
    label: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({description, imgUrl, label}) => {
    return (

        <div style={{display: 'flex', flexDirection: 'column', width: '29%'}}>
            <Tooltip title={description}>
                <img src={imgUrl} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}/>

            </Tooltip>
            <h1 style={{color: "black",  alignItems:"center", fontSize: '40px'}}>{label}</h1>
        </div>

    );
};
export default ProjectCard;
