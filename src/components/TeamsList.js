import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Flag from 'react-flagkit';


const TeamsList = (props) => {

  const [teams, setTeams] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getTeams();
  }, []);

  const getTeams = async () => {
    const url = "http://ergast.com/api/f1/2013/constructorStandings.json";
    const response = await axios.get(url);
    const data = response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    setTeams(data);
  };

  const handelClickDetails = (id) => {
    const linkTo = `/teams/details/${id}`;
    navigate(linkTo);
  };

  const getFlag = (filter, size) => {
    const flagData = props.flags.filter(flag => 
        flag.en_short_name.toLowerCase() === filter.toLowerCase() 
      || flag.nationality.toLowerCase() === filter.toLowerCase()
      );
    const alpha2Code = flagData.length == 1 ? flagData[0].alpha_2_code : (filter == "UK" ? "GB" : filter);
    return <Flag country={alpha2Code} size={size} />
  }

  return (
    <div>
      <h2>Construction Championship</h2>
      <table>
        <thead>
          <tr>
            <th>Constructors Championship Standings - 2013 </th>
          </tr>
        </thead>

        <tbody>

        {teams.map((team) => {
          return(
          <tr key={team.position}
            onClick={() => handelClickDetails(team.Constructor.constructorId)}>
            <td>{team.position}</td>
            <td>{getFlag(team.Constructor.nationality, 15)} {team.Constructor.name}</td>
            <td>{team.Constructor.url}</td>
            <td>{team.points}</td>
          </tr>
          );
        })}

        </tbody>
      </table>
    </div>
  );
}
export default TeamsList;