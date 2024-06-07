import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from 'dayjs';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Box, Breadcrumbs, Button, CardMedia, Chip, TextField, Typography } from "@mui/material";
import DriversList from "./components/DriversList";
import TeamsList from "./components/TeamsList";
import RacesList from "./components/RacesList";
import DriverDetails from "./components/DriverDetails";
import TeamDetails from "./components/TeamDetails";
import RacesDetails from "./components/RacesDetails";
import LoaderFlag from "./components/LoaderFlag";
import { Home } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const App = () => {

  const [flagsList, setFlagsList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [breadCrumbs, setBreadCrumbs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMain, setIsMain] = useState(true);
  const [yearSelect, setYearSelect] = useState('2013');

  useEffect(() => {
    getFlagsList();
  }, []);

  const getFlagsList = async () => {
    const url = 'https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json';

    const response = await axios.get(url);

    const breadCrumbsList = [];
    const item = {name: 'Home', link: '/', icon: <Home/>}
    breadCrumbsList.push(item);

    setBreadCrumbs(breadCrumbsList);
    setFlagsList(response.data);
    setIsLoading(false);
    setIsMain(true);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const handleYearSelected = (e) => {
    if (e && e.$y) {
      setYearSelect(e.$y);
    } else {
      setYearSelect('2013');
    }
    
  };

  if (isLoading) {
    return <LoaderFlag/>
  };

  const getBreadCrums = (value) => {
    const breadCrumbsList = value.slice();
    setBreadCrumbs(breadCrumbsList);
  }

  const getIsInMain = (value) => {
    setIsMain(value);
  }

  const searchBoxShow = () => {
    if (!isMain) { 
      return <TextField
                size="small"
                className="app-bar-search"
                value = {searchValue}
                id="main-search"
                onChange={handleSearchInput}
                type="search"
                color="error"
                variant="filled"
                label="Search for.." />
    }
  };

  const breadCrumbsRender = (bread, i) => {
    if (i === breadCrumbs.length-1 && breadCrumbs.length !== 1 ) {
      return <Typography key={i}
                color="white"
                variant="caption" 
                display="block" 
                fontWeight={900}>
                  {bread.name}
              </Typography>
    } else {
      return <Chip key={i}
                color="error"
                icon={bread.icon}
                component="a"
                href= {bread.link}
                label= {bread.name}
                sx={{cursor:'pointer'}}
              /> 
    }
  }

  return (
    <>
      <Router>
        <Box className="main-screen">
          <Box className="nav-box">
            <Box className="nav-links">
              <Box 
                className="nav-logo"
                sx={{ 
                  objectFit: "contain"  
                }}
                component='img'
                width={1/1}
                alt='Logo'
                src={`${process.env.PUBLIC_URL}/assets/img/f1wlogo.png`}/>
                <Button variant="filled" size="large">
                  <Link 
                    className="nav-bar-link"
                    to="/drivers">
                    <Box 
                      className="nav-bar-img"
                      sx={{ 
                        objectFit: "contain"  
                      }}
                      component='img'
                      width={1/1}
                      alt="Helmet"
                      src={`${process.env.PUBLIC_URL}/assets/img/Kaciga.png`}/>
                      <Box className="nav-bar-text">DRIVERS</Box>
                  </Link>
                </Button>
                <Button variant="filled" size="large">
                  <Link 
                    className="nav-bar-link"
                    to="/teams">
                    <Box 
                      className="nav-bar-img"
                      sx={{ 
                        objectFit: "contain"  
                      }}
                      component='img'
                      width={1/1}
                      alt="Teams"
                      src={`${process.env.PUBLIC_URL}/assets/img/Teams.png`} />
                      <Box className="nav-bar-text">TEAMS</Box>
                  </Link>
                </Button>
                <Button variant="filled" size="large">
                  <Link 
                    className="nav-bar-link"
                    to="/races">
                    <Box 
                      className="nav-bar-img"
                      sx={{ 
                        objectFit: "contain"  
                      }}
                      component='img'
                      width={1/1}
                      alt="Races"
                      src={`${process.env.PUBLIC_URL}/assets/img/Races1.png`} />
                      <Box className="nav-bar-text">RACES</Box>
                  </Link>
                </Button>
              </Box>
              <Box className="footer">Team 6</Box>
            </Box>
          <Box className="main-content">
            <AppBar 
              position="static"
              className="app-bar">
              <Breadcrumbs>
                {breadCrumbs.map((bread, i) =>
                  breadCrumbsRender(bread, i)
                )}
              </Breadcrumbs>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker defaultValue={dayjs(yearSelect)}
                            views={['year']}
                            onChange={handleYearSelected}
                            disableFuture 
                            variant="inline"
                            color="error"
                            className= { isMain ? "app-bar-inputenable" : "app-bar-inputdisable"}
                            slotProps={{ textField: { size: 'small' } }}
                />
              </LocalizationProvider>
              <Box>
                {searchBoxShow()}
              </Box>
            </AppBar>
            <Box
              width={1/1}>
              <Routes>
                <Route path="/" element={
                  <Box
                    position="fixed"
                    display="flex"
                    justifyItems="center">
                  <CardMedia
                      component='video'
                      title="Main Video"
                      image={`${process.env.PUBLIC_URL}/assets/video/F1 2024.mp4`}
                      autoPlay
                      muted
                  />
                  </Box>
                }/>
                <Route path="/drivers" element={<DriversList 
                                                  flags={flagsList} 
                                                  searchValue={searchValue} 
                                                  breadcrumbs={getBreadCrums}
                                                  main={getIsInMain} 
                                                  year={yearSelect}/>} 
                />
                <Route path="/drivers/:driverId" element={<DriverDetails 
                                                            flags={flagsList}
                                                            searchValue={searchValue}
                                                            breadcrumbs={getBreadCrums}
                                                            main={getIsInMain}
                                                            year={yearSelect}/>} 
                />
                <Route path="/teams" element={<TeamsList 
                                                flags={flagsList} 
                                                searchValue={searchValue} 
                                                breadcrumbs={getBreadCrums}
                                                main={getIsInMain}
                                                year={yearSelect}/>} 
                />
                <Route path="/teams/:constructorId" element={<TeamDetails 
                                                                flags={flagsList} 
                                                                searchValue={searchValue}
                                                                breadcrumbs={getBreadCrums}
                                                                main={getIsInMain} 
                                                                year={yearSelect} />} 
                />
                <Route path="/races" element={<RacesList 
                                                flags={flagsList} 
                                                searchValue={searchValue} 
                                                breadcrumbs={getBreadCrums}
                                                main={getIsInMain}
                                                year={yearSelect} />}  
                />
                <Route path="/races/:raceId" element={<RacesDetails 
                                                        flags={flagsList} 
                                                        searchValue={searchValue} 
                                                        main={getIsInMain}
                                                        breadcrumbs={getBreadCrums}
                                                        year={yearSelect} />} 
                />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
      
    </>
  );
}
export default App;