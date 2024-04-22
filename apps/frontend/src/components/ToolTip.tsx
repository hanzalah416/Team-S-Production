import { useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { marked } from "marked";

export default function ToolTip({
  className,
  style,
  tips,
}: {
  className?: string;
  style?: React.CSSProperties;
  tips: string;
}) {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className={className} style={style}>
      <ErrorOutlineOutlinedIcon
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography style={{ width: "500px", padding: "10px" }}>
          <div dangerouslySetInnerHTML={renderMarkdownToHTML(tips)} />
        </Typography>
      </Popover>
    </div>
  );
}

function renderMarkdownToHTML(markdown: string) {
  const renderedHTML = marked.parse(markdown);
  return { __html: renderedHTML };
}
