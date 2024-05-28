import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import TeamsLogo from "../img/TeamsLogo.png";


const TeamDetails = () => {
  const [teamDetails, setTeamDetails] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    getTeam();
  }, []);

  const getTeam = async () => {
    const id = params.constructorId;
    const urlDetails = `http://ergast.com/api/f1/2013/constructors/${id}/constructorStandings.json`;
    const urlList = `http://ergast.com/api/f1/2013/constructors/${id}/results.json`;

    const responseDetails = await axios.get(urlDetails);
    const dataDetails = responseDetails.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[0];

    const responseList = await axios.get(urlList);
    const dataList = responseList.data.MRData.RaceTable.Races;

    setTeamDetails(dataDetails);
    setTeamList(dataList);
    setIsLoading(false);

  };


  if (isLoading) {
    return <LinearProgress />;
  }
  
  return (
    <div>
      <div>

        <div>
          <p><img src={TeamsLogo} alt="Teams" style={{ maxWidth: '150px' }} /></p>
          <div>
            <p>{teamDetails.Constructor.nationality}</p>
            <p>{teamDetails.Constructor.name}</p>
          </div>
        </div>

        <div>
          <p>Country: {teamDetails.Constructor.nationality}</p>
          <p>Position: {teamDetails.position}</p>
          <p>Points: {teamDetails.points}</p>
          <p>History: {teamDetails.Constructor.url}</p>
        </div>

      </div>

      <table>
        <thead>
          <tr><th>Formula 1 2013 Results</th></tr>
          <tr>
            <th>Round </th>
            <th>Grand prix</th>
            <th>{teamList[0].Results[0].Driver.familyName}</th>
            <th>{teamList[0].Results[1].Driver.familyName}</th>
            <th>Points</th>
          </tr>
        </thead>

        <tbody>
          {teamList.map((result) => 
            <tr key={result.round}>
              <td>{result.round}</td>
              <td>{result.raceName}</td>
              <td>{result.Results[0].position}</td>
              <td>{result.Results[1].position}</td>
              <td>{parseInt(result.Results[0].points) + parseInt(result.Results[1].points)}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
export default TeamDetails;