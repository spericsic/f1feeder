import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Flag from 'react-flagkit';
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
  

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: grey.A200,
      color: theme.palette.common.black,
      fontWeight: 600,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      width: 1/1,
    },
  }));



  return (
    <div  style={{width: "100vw",  overflow: "hidden"}}>
      <h2>Race Calendar</h2>
      <TableContainer sx={{ color: 'grey.A400' , border: 15, borderRadius: 2,}}>
        <Table>
          <TableHead>
            <TableRow><StyledTableCell colSpan={5}>Race Calendar - 2013</StyledTableCell></TableRow>
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
              <TableRow key={race.round} onClick={() => handelClickDetails(race.round)}>
                <StyledTableCell component="th" scope="row" >{race.round}</StyledTableCell>
                <StyledTableCell>
                  <div style={{ display: "flex", alignItems: 'center' }}>
                    <div style={{margin:"0 10px"}}>
                      <Flag country={getAlphaCode(props.flags, race.Circuit.Location.country)} size={40} />
                    </div> {race.raceName}
                  </div>
                </StyledTableCell>
                <StyledTableCell>{race.Circuit.circuitName}</StyledTableCell>
                <StyledTableCell>{race.date}</StyledTableCell>
                <StyledTableCell><div style={{ display: "flex", alignItems: 'center' }}><div style={{margin:"0 10px"}}><Flag country={getAlphaCode(props.flags, race.Results[0].Driver.nationality)} size={40} /></div> {race.Results[0].Driver.familyName}</div></StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default RacesList;
