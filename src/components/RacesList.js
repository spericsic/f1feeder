import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RacesList = () => {

  const [races, setRaces] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getRaces();
  }, []);

  const getRaces = async () => {
    const url = 'http://ergast.com/api/f1/2013/results/1.json'
    
    const response = await axios.get(url);
    const data = response.data.MRData.RaceTable.Races;
    setRaces(data);
  }

  const handelClickDetails = (id) => {
    const linkTo = `/races/details/${id}`;
    navigate(linkTo);
  };
  

  return (
    <div>
      <h2>Race Calendar</h2>
      <table>
        <thead>
          <tr>
            <th>Race Calendar - 2013</th>
          </tr>
        </thead>
        <tbody>
          {races.map((race)=>
            <tr key={race.round}
              onClick={() => handelClickDetails(race.round)}>
              <td>{race.round}</td>
              <td>{race.Circuit.Location.country} {race.raceName}</td>
              <td>{race.Circuit.circuitName}</td>
              <td>{race.date}</td>
              <td>{race.Results[0].Driver.nationality} {race.Results[0].Driver.driverId}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
export default RacesList;