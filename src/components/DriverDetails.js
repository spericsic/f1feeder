import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import driverProfil from '../img/driverProfil.png';

const DriverDetails = () => {
  const [driverDetails, setDriverDetails] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    getDriver();
  }, []);

  const getDriver = async () => {
    const id = params.driverId;
    const urlDetails =`http://ergast.com/api/f1/2013/drivers/${id}/driverStandings.json`;
    const urlList =`http://ergast.com/api/f1/2013/drivers/${id}/results.json`;

    const responseDetails = await axios.get(urlDetails);
    const dataDetails = responseDetails.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];

    const responseList = await axios.get(urlList);
    const dataList = responseList.data.MRData.RaceTable.Races;

    setDriverDetails(dataDetails);
    setDriverList(dataList);
    setIsLoading(false);
  }

    if (isLoading) {
      return <LinearProgress />;
    }

    return (
      <div>
        <div>
          <div>
            <p><img src={driverProfil} alt="Drivers" style={{ maxWidth:`150px`}}/></p>
            <div>
              <p>{driverDetails.Driver.nationality}</p>
              <p>{driverDetails.Driver.givenName} {driverDetails.Driver.familyName}</p>
            </div>
          </div>

          <div>
            <p>Country: {driverDetails.Driver.nationality}</p>
            <p>Team: {driverDetails.Constructors[0].name}</p>
            <p>Birth: {driverDetails.Driver.dateOfBirth}</p>
            <p>Biography: {driverDetails.Driver.url}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Formula 1 2013 Results</th>
            </tr>
            <tr>
              <th>Round</th>
              <th>Grand Prix</th>
              <th>Team</th>
              <th>Grid</th>
              <th>Race</th>
            </tr>
          </thead>

          <tbody>
            {driverList.map((race, i) => 
              <tr key={i}>
                <td>{race.round}</td>
                <td>{race.raceName}</td>
                <td>{race.Results[0].Constructor.name}</td>
                <td>{race.Results[0].grid}</td>
                <td>{race.Results[0].position}</td>
              </tr>
            )}
          </tbody>
        </table>
  
      </div>
    );
  }
  export default DriverDetails;