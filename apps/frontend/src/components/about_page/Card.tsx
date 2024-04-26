import * as React from "react";
import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import styles from "./AboutPage.module.css";

interface ProjectCardProps {
  description: string;
  imgUrl: string;
  label: string;
  title: string;
  font: string;
  color: string;
  size: string;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ProjectCard: React.FC<ProjectCardProps> = ({
  description,
  imgUrl,
  label,
    title,
  font,
  color,
  size,


                                                 }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className={styles.memberContainer} onClick={handleClickOpen}>
        <Tooltip title="Click to view more">
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
        </Tooltip>
          <br />
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
          onClick={handleClickOpen}
        >
          {label}
        </h1>
      </div>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="project-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="project-dialog-title" >
          {title}
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom className = {styles.quote}>{description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
};

export default ProjectCard;
