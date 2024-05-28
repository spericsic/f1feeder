import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const TeamsList = () => {

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
            <td>{team.Constructor.nationality} {team.Constructor.name}</td>
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