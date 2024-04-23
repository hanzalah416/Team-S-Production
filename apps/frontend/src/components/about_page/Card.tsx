import Tooltip from "@mui/material/Tooltip";

const ProjectCard = ({description, imgUrl, label}) => {
    return (

        <div style={{display: 'flex', flexDirection: 'column',width: '29%'}}>
            <Tooltip title={description}>
                <img src={imgUrl} style={{
                    width: '800px',
                   height: '400px'
                }}/>

            </Tooltip>
            <h1 style={{color: "black",  alignItems:"center"}}>{label}</h1>
        </div>

    );
};
export default ProjectCard;
