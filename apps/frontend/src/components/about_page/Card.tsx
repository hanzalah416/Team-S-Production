import Tooltip from "@mui/material/Tooltip";

interface ProjectCardProps {
  description: string;
  imgUrl: string;
  label: string;
}


const ProjectCard: React.FC<ProjectCardProps> = ({description, imgUrl, label}) => {
    return (

        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Tooltip title={description}>
                <img src={imgUrl} style={{

                    width: '30vh',
                    height: '30vh',
                    objectFit: 'cover',
                    justifyContent: 'center',
                }}/>

            </Tooltip>
            <h1 style={{color: "black",  alignItems:"center", fontSize: '30px',textAlign: 'center',}}>{label}</h1>
        </div>

    );


};
export default ProjectCard;
