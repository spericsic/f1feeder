import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import TeamsLogo from "../img/TeamsLogo.png";
import Flag from "react-flagkit";

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { grey } from "@mui/material/colors";




const TeamDetails = (props) => {
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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: grey.A200,
      color: theme.palette.common.black,
      fontWeight: 600,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));



  if (isLoading) {
    return <LinearProgress />;
  }

  const getFlag = (filter, size) => {
    const flagData = props.flags.filter(flag =>
      flag.en_short_name.toLowerCase() === filter.toLowerCase()
      || flag.nationality.toLowerCase() === filter.toLowerCase()
    );
    const alpha2Code = flagData.length == 1 ? flagData[0].alpha_2_code : (filter == "UK" ? "GB" : filter);
    return <Flag country={alpha2Code} size={size} />
  }
  console.log(teamList);

  return (
    <div>
      <div>

        <div>
          <p><img src={`${process.env.PUBLIC_URL}/assets/img/${params.constructorId}.png`} alt="Teams" style={{ maxHeight: '60px' }} /></p>
          <div>
            <p>{getFlag(teamDetails.Constructor.nationality, 20)}</p>
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


      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Formula 1 2013 Results </StyledTableCell>
            </TableRow>

            <TableRow>
              <StyledTableCell>Round</StyledTableCell>
              <StyledTableCell>Ground prix</StyledTableCell>
              <StyledTableCell>{teamList[0].Results[0].Driver.familyName}</StyledTableCell>
              <StyledTableCell>{teamList[0].Results[1].Driver.familyName}</StyledTableCell>
              <StyledTableCell>Points</StyledTableCell>
            </TableRow>
          </TableHead>


          <TableBody>

            {teamList.map((result) =>
              <TableRow key={result.round}>
                <StyledTableCell>{result.round}</StyledTableCell>

                <StyledTableCell>{getFlag(result.Circuit.Location.country, 20)} {result.raceName}</StyledTableCell>
                <StyledTableCell>{result.Results[0].position}</StyledTableCell>
                <StyledTableCell>{result.Results[1].position}</StyledTableCell>
                <StyledTableCell>{parseInt(result.Results[0].points) + parseInt(result.Results[1].points)}</StyledTableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
export default TeamDetails;