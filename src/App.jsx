import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import SortableTable from "./components/SortableTable.jsx";
import RequestForm from "./components/RequestForm.jsx";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const App = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* CssBaseline => for theming background */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="instead of navigation"
            variant="fullWidth"
            centered
          >
            <Tab label="List of Requests" {...a11yProps(0)} />
            <Tab label="Request Certificate" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
          <h1>The list of all submitted requests</h1>
          <SortableTable />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <RequestForm />
        </CustomTabPanel>
      </Box>
    </ThemeProvider>
  );
};

export default App;
