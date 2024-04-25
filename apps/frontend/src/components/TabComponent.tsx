import React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

interface TabsProps {
  tabNames: string[];
  tabContents: JSX.Element[];
}

const Tabs: React.FC<TabsProps> = ({ tabNames, tabContents }) => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} variant="scrollable"
                   scrollButtons="auto" aria-label="lab API tabs example">
            {tabNames.map((name, index) => (
              <Tab key={index} label={name} value={(index + 1).toString()} />
            ))}
          </TabList>
        </Box>
        {tabContents.map((content, index) => (
          <TabPanel key={index} value={(index + 1).toString()}>
            {content}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default Tabs;
