import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DriversList = () => {
const [drivers, setDrivers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getDrivers();
  }, []);

  const getDrivers = async () => {
    const url ="http://ergast.com/api/f1/2013/driverStandings.json";
    const response = await axios.get(url);
    const data = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    setDrivers(data);
  };

  const handelClickDetails = (id) => {
    const linkTo = `/drivers/details/${id}`;
    navigate(linkTo);
  };

  return (
    <div>
        <h2>Drivers Championship</h2>
        <table>
          <thead>
            <tr>
              <th>Drivers Championship Standings - 2013</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) =>
              <tr key={driver.position}
                onClick={() => handelClickDetails(driver.Driver.driverId)}>
                <td>{driver.position}</td>
                <td>{driver.Driver.nationality} {driver.Driver.givenName} {driver.Driver.familyName}</td>
                <td>{driver.Constructors[0].name}</td>
                <td>{driver.points}</td>
              </tr>
            )}

          </tbody>
        </table>
    </div>
  );
}
export default DriversList;