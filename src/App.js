import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from "react-router-dom";
import axios from "axios";
import DriversList from "./components/DriversList";
import TeamsList from "./components/TeamsList";
import RacesList from "./components/RacesList";
import DriverDetails from "./components/DriverDetails";
import TeamDetails from "./components/TeamDetails";
import RacesDetails from "./components/RacesDetails";
import NavHelmet from "./img/Kaciga.png";
import NavTeams from "./img/Teams.png";
import NavRaces from "./img/Races.png";
import NavLogo from "./img/rteam.jpg";

const App = () => {

  const [flagsList, setFlagsList] = useState([]);

  useEffect(() => {
    getFlagsList();
  }, []);

  const getFlagsList = async () => {
    const url = `https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json`;

    const response = await axios.get(url);
    setFlagsList(response.data);
  }

  return (
    <div className="main-screen">
      <Router>
        <nav>
          <Link to="/"><img src={NavLogo} alt="Logo"></img></Link>
          <li>
            <NavLink to="/drivers"><img src={NavHelmet} alt="Helmet"></img></NavLink>
          </li>
          <li>
            <NavLink to="/teams"><img src={NavTeams} alt="Teams"></img></NavLink>
          </li>
          <li>
            <NavLink to="/races"><img src={NavRaces} alt="Races"></img></NavLink>
          </li>
        </nav>
        <Routes>
          <Route path="/" element={<div></div>}/> 
          <Route path="/drivers" element={<DriversList/>}/>
          <Route path="/drivers/details/:driverId" element={<DriverDetails/>}/>
          <Route path="/teams" element={<TeamsList/>}/>
          <Route path="/teams/details/:constructorId" element={<TeamDetails/>}/>
          <Route path="/races" element={<RacesList/>}/>
          <Route path="/races/details/:raceId" element={<RacesDetails flags={flagsList}/>}/>
        </Routes>
      </Router>
    </div>
  );
}
export default App;