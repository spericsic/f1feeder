import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const RacesDetails = () => {

  const [RacesDetails, setRacesDetails] = useState([]);
  const [RacesQualifying, setRacesQualifying] = useState([]);
  const [Card, setCard] = useState([]);

  const params = useParams()

  useEffect(() => {
    getRacesDetails();
  }, []);

  const getRacesDetails = async () => {

    const raceId = params.raceId;

    const urlDetails = `https://ergast.com/api/f1/2013/${params.raceId}/qualifying.json`;
    const urlList = `http://ergast.com/api/f1/2013/${params.raceId}/results.json`;

    const responseDetails = await axios.get(urlDetails);
    const dataCard = responseDetails.data.MRData.RaceTable.Races;
    const dataCards = dataCard[0];
    setCard(dataCards);


    const data = responseDetails.data.MRData.RaceTable.Races;
    const dataQualifying = data[0].QualifyingResults;
    setRacesQualifying(dataQualifying);

    const responseDetailsList = await axios.get(urlList);
    const dataList = responseDetailsList.data.MRData.RaceTable.Races;
    const dataRacesDetails = dataList[0].Results;
    setRacesDetails(dataRacesDetails);
  }

  return (
    <div style={{ display: "flex" }}>
      <div>
        <p>Country: {Card.raceName}</p>
        <p>Country: {Card.Circuit.Location.country}</p>
        <p>Location: {Card.Circuit.Location.locality}</p>
        <p>Date: {Card.date}</p>
        <p>Full Report: {Card.url}</p>

      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Qualifying results</th>
            </tr>
          </thead>
          <tbody>
            {RacesQualifying.map((race, i) =>
              <tr key={i}>
                <td>{race.position}</td>
                <td>{race.Driver.nationality} {race.Driver.driverId}</td>
                <td>{race.Constructor.name}</td>
                <td>{race.Q3}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Race results</th>
            </tr>
          </thead>
          <tbody>
            {RacesDetails.map((race, i) =>
              <tr key={i}>
                <td>{race.position}</td>
                <td>{race.Driver.nationality} {race.Driver.driverId}</td>
                <td>{race.Constructor.constructorId}</td>
                {/* <td>{race.Time.time}</td> */}
                <td>{race.points}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
export default RacesDetails;