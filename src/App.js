import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from "react-router-dom";
import axios from "axios";
import { AppBar, Box, Button, CardMedia, TextField, Toolbar } from "@mui/material";
import DriversList from "./components/DriversList";
import TeamsList from "./components/TeamsList";
import RacesList from "./components/RacesList";
import DriverDetails from "./components/DriverDetails";
import TeamDetails from "./components/TeamDetails";
import RacesDetails from "./components/RacesDetails";
import LoaderFlag from "./components/LoaderFlag";

const App = () => {

  const [flagsList, setFlagsList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    getFlagsList();
  }, []);

  const getFlagsList = async () => {
    const url = 'https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json';

    const response = await axios.get(url);
    setFlagsList(response.data);
    setIsLoading(false)
  }

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  if (isLoading) {
    return <LoaderFlag/>
  };

  return (
    <>
      <Router>
        <Box className="main-screen">
          <AppBar 
            position="static" 
            className="app-bar">
            <Toolbar>
              <TextField
                value = {searchValue}
                id="main-search"
                onChange={handleSearchInput}
                variant="standard"
                label="Search for..."
              />
            </Toolbar>
          </AppBar>
          <Box className="nav-box">
            <Box className="nav-links">
              <Link to="/"><img src={`${process.env.PUBLIC_URL}/assets/img/rteam.jpg`} alt="Logo"></img></Link>
              <Button variant="outlined" size="large">
                <NavLink to="/drivers"><img src={`${process.env.PUBLIC_URL}/assets/img/Kaciga.png`} alt="Helmet"></img></NavLink>
              </Button>
              <Button variant="outlined" size="large">
                <NavLink to="/teams"><img src={`${process.env.PUBLIC_URL}/assets/img/Teams.png`} alt="Teams"></img></NavLink>
              </Button>
              <Button variant="outlined" size="large">
                <NavLink to="/races"><img src={`${process.env.PUBLIC_URL}/assets/img/Races.png`} alt="Races"></img></NavLink>
              </Button>
            </Box>
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
                  />
                  </Box>
                }/>
                <Route path="/drivers" element={<DriversList flags={flagsList} searchValue={searchValue} />} />
                <Route path="/drivers/details/:driverId" element={<DriverDetails flags={flagsList} />} />
                <Route path="/teams" element={<TeamsList flags={flagsList} searchValue={searchValue} />} />
                <Route path="/teams/details/:constructorId" element={<TeamDetails flags={flagsList} />} />
                <Route path="/races" element={<RacesList flags={flagsList} searchValue={searchValue} />}  />
                <Route path="/races/details/:raceId" element={<RacesDetails flags={flagsList} />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
      
    </>
  );
}
export default App;