import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Flag from 'react-flagkit';
import LinearProgress from '@mui/material/LinearProgress';
import { getAlphaCode } from '../Utils.js';

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
    const handleBestTime = [race.Q1, race.Q2, race.Q3]
    handleBestTime.sort()
    return handleBestTime[0]

  }

  if (isLoading) {
    return <LinearProgress />;
  }

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


  return (
    <div style={{ display: "flex" }}>
      <div>

        <p><Flag country={getAlphaCode(props.flags, Card.Circuit.Location.country)} size={150} /></p>
        <p>{Card.raceName}</p>
        <p>Country: {Card.Circuit.Location.country}</p>
        <p>Location: {Card.Circuit.Location.locality}</p>
        <p>Date: {Card.date}</p>
        <p>Full Report: {Card.url}</p>
      </div>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow><StyledTableCell>Qualifying results</StyledTableCell></TableRow>
            <TableRow>
              <StyledTableCell>Pos</StyledTableCell>
              <StyledTableCell >Driver</StyledTableCell>
              <StyledTableCell >Team</StyledTableCell>
              <StyledTableCell >Best Time</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {RacesQualifying.map((race) => (
              <TableRow key={race.position}>
                <StyledTableCell component="th" scope="row" >{race.position}</StyledTableCell>
                <StyledTableCell>
                  <div style={{ display: "flex", alignItems: 'center' }}>
                    <div style={{ margin: "0 10px" }}>
                      <Flag country={getAlphaCode(props.flags, race.Driver.nationality)} size={20} />
                    </div> {race.Driver.familyName}
                  </div>
                </StyledTableCell>
                <StyledTableCell>{race.Constructor.name}</StyledTableCell>
                <StyledTableCell>{handelTime(race)}</StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow><StyledTableCell>Race results</StyledTableCell></TableRow>
            <TableRow>
              <StyledTableCell>Pos</StyledTableCell>
              <StyledTableCell >Driver</StyledTableCell>
              <StyledTableCell >Team</StyledTableCell>
              <StyledTableCell >Result</StyledTableCell>
              <StyledTableCell >Points</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {RacesDetails.map((race) => (
              <TableRow key={race.position}>
                <StyledTableCell component="th" scope="row" >{race.position}</StyledTableCell>
                <StyledTableCell>
                  <div style={{ display: "flex", alignItems: 'center' }}>
                    <div style={{ margin: "0 10px" }}>
                      <Flag country={getAlphaCode(props.flags, race.Driver.nationality)} size={20} />
                    </div> {race.Driver.familyName}
                  </div>
                </StyledTableCell>
                <StyledTableCell>{race.Constructor.name}</StyledTableCell>
                <StyledTableCell>{race.Time ? race.Time.time : "0"}</StyledTableCell>
                <StyledTableCell>{race.points}</StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  );
}
export default RacesDetails;