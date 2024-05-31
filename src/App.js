import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from "react-router-dom";
import axios from "axios";
import DriversList from "./components/DriversList";
import TeamsList from "./components/TeamsList";
import RacesList from "./components/RacesList";
import DriverDetails from "./components/DriverDetails";
import TeamDetails from "./components/TeamDetails";
import RacesDetails from "./components/RacesDetails";
import { Box } from "@mui/system";
import { TextField } from "@mui/material";

const App = () => {

  const [flagsList, setFlagsList] = useState([]);
  
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    getFlagsList();
  }, []);

  const getFlagsList = async () => {
    const url = 'https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json';

    const response = await axios.get(url);
    setFlagsList(response.data);
  }

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  return (
    <div className="main-screen">
      <Router>
        <nav>
          <Link to="/"><img src={`${process.env.PUBLIC_URL}/assets/img/rteam.jpg`} alt="Logo"></img></Link>
          <li>
            <NavLink to="/drivers"><img src={`${process.env.PUBLIC_URL}/assets/img/Kaciga.png`} alt="Helmet"></img></NavLink>
          </li>
          <li>
            <NavLink to="/teams"><img src={`${process.env.PUBLIC_URL}/assets/img/Teams.png`} alt="Teams"></img></NavLink>
          </li>
          <li>
            <NavLink to="/races"><img src={`${process.env.PUBLIC_URL}/assets/img/Races.png`} alt="Races"></img></NavLink>
          </li>
        </nav>
        <TextField
          value = {searchValue}
          id="main-search"
          onChange={handleSearchInput}
          variant="outlined"
          label="Search for..."
        />
        <Routes>
          <Route path="/" element={<div></div>} />
          <Route path="/drivers" element={<DriversList flags={flagsList} searchValue={searchValue} />} />
          <Route path="/drivers/details/:driverId" element={<DriverDetails flags={flagsList} />} />
          <Route path="/teams" element={<TeamsList flags={flagsList} />} searchValue={searchValue} />
          <Route path="/teams/details/:constructorId" element={<TeamDetails flags={flagsList} />} />
          <Route path="/races" element={<RacesList flags={flagsList} />} searchValue={searchValue} />
          <Route path="/races/details/:raceId" element={<RacesDetails flags={flagsList} />} />
        </Routes>
      </Router>
      {/* <Box>
        <video autoPlay muted loop style={{ width: "100%" }}>
          <source src={`${process.env.PUBLIC_URL}/assets/video/F1 2024.mp4`} type="video/mp4" />
        </video>
      </Box> */}
    </div>
  );
}
export default App;