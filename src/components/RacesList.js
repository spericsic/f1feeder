import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Flag from 'react-flagkit';


const RacesList = (props) => {

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
              <td>{getFlag(race.Circuit.Location.country, 40)} {race.raceName}</td>
              <td>{race.Circuit.circuitName}</td>
              <td>{race.date}</td>
              <td>{getFlag(race.Results[0].Driver.nationality, 40)} {race.Results[0].Driver.driverId}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
export default RacesList;