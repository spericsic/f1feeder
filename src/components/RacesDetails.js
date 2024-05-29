import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Flag from 'react-flagkit';
import LinearProgress from '@mui/material/LinearProgress';

const RacesDetails = (props) => {

  const [RacesDetails, setRacesDetails] = useState([]);
  const [RacesQualifying, setRacesQualifying] = useState([]);
  const [Card, setCard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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


    const data = responseDetails.data.MRData.RaceTable.Races;
    const dataQualifying = data[0].QualifyingResults;

    const responseDetailsList = await axios.get(urlList);
    const dataList = responseDetailsList.data.MRData.RaceTable.Races;
    const dataRacesDetails = dataList[0].Results;

    setCard(dataCards);
    setRacesQualifying(dataQualifying);
    setRacesDetails(dataRacesDetails);
    setIsLoading(false);
  }

  const handelTime = (race) => {
    let min = race.Q1;
    if (typeof(race.Q2) !== 'undefined') min = min < race.Q2 ? min : race.Q2;
    if (typeof(race.Q3) !== 'undefined') min = min < race.Q3 ? min : race.Q3;
    min = typeof(min) !== 'undefined' ? min : "Didn't Attend";
    return min
  }


  if (isLoading) {
    return <LinearProgress />;
  } 

  
  const getFlag = (filter, size) => {
    const flagData = props.flags.filter(flag => flag.en_short_name.toLowerCase() === filter.toLowerCase() );
    const alpha2Code = flagData.length == 1 ? flagData[0].alpha_2_code : (filter == "UK" ? "GB" : filter);
    return <Flag country={alpha2Code} size={size} />
  }

  return (
    <div style={{ display: "flex" }}>
      <div>
        
        <p>{getFlag(Card.Circuit.Location.country, 150)}</p>
        <p>{Card.raceName}</p>
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
            <tr>
              <th>Pos</th>
              <th>Driver</th>
              <th>Team</th>
              <th>Best Time</th>
            </tr>
          </thead>
          <tbody>
            {RacesQualifying.map((race) =>
              <tr key={race.position}>
                <td>{race.position}</td>
                <td>{race.Driver.nationality} {race.Driver.familyName}</td>
                <td>{race.Constructor.name}</td>
                <td>{handelTime(race)}</td>
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
            <tr>
              <th>Pos</th>
              <th>Driver</th>
              <th>Team</th>
              <th>Result</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {RacesDetails.map((race) =>
              <tr key={race.position}>
                <td>{race.position}</td>
                <td>{race.Driver.nationality} {race.Driver.familyName}</td>
                <td>{race.Constructor.name}</td>
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