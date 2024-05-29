import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Flag from 'react-flagkit';

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

const StyledTableRow = styled(TableRow)(({ theme }) => ({

}));


  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>Race Calendar</TableRow>
          <TableRow>Race Calendar - 2013</TableRow>
          <TableRow>
            <StyledTableCell>Round</StyledTableCell>
            <StyledTableCell >Grand Prix</StyledTableCell>
            <StyledTableCell >Circuit</StyledTableCell>
            <StyledTableCell >Date</StyledTableCell>
            <StyledTableCell >Winner</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {races.map((race) => (
            <StyledTableRow key={race.round} onClick={() => handelClickDetails(race.round)}>
              <StyledTableCell component="th" scope="row" >{race.round}</StyledTableCell>
              <StyledTableCell><div style={{ display: "flex", alignItems: 'center' }}><div style={{margin:"0 10px"}}>{getFlag(race.Circuit.Location.country, 40)}</div> {race.raceName}</div></StyledTableCell>
              <StyledTableCell>{race.Circuit.circuitName}</StyledTableCell>
              <StyledTableCell>{race.date}</StyledTableCell>
              <StyledTableCell><div style={{ display: "flex", alignItems: 'center' }}><div style={{margin:"0 10px"}}>{getFlag(race.Results[0].Driver.nationality, 40)}</div> {race.Results[0].Driver.familyName}</div></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RacesList;
