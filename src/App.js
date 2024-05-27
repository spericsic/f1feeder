import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from "react-router-dom";
import DriversList from "./components/DriversList";
import TeamsList from "./components/TeamsList";
import RacesList from "./components/RacesList";
import NavHelmet from "./img/Kaciga.png";
import NavTeams from "./img/Teams.png";
import NavRaces from "./img/Races.png";
import NavLogo from "./img/rteam.jpg";

const App = () => {

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
          <Route path="/teams" element={<TeamsList/>}/>
          <Route path="/races" element={<RacesList/>}/>
        </Routes>
      </Router>
    </div>
  );
}
export default App;