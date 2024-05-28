import { useParams } from "react-router-dom";

const RacesDetails = () => {

  const params = useParams()

  //https://ergast.com/api/f1/2013/${params.raceId}/qualifying.json
  //http://ergast.com/api/f1/2013/${params.raceId}/results.json

  return (
    <div>

    </div>
  );
}
export default RacesDetails;