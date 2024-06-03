import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Flag from 'react-flagkit';
import { getAlphaCode , setSearchData } from '../Utils.js';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from "@mui/material/Box";
import { grey } from "@mui/material/colors";
import LoaderFlag from "./LoaderFlag.js";

const RacesList = (props) => {

  const [races, setRaces] = useState([]);
  const [filteredRaces, setFilteredRaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getRaces();
  }, []);
  
  useEffect(() => {
    const filtered = setSearchData(props.searchValue, races);
    setFilteredRaces(filtered);
  }, [props.searchValue]);

  const getRaces = async () => {
    const url = 'http://ergast.com/api/f1/2013/results/1.json'

    const response = await axios.get(url);
    const data = response.data.MRData.RaceTable.Races;
    const filtered = setSearchData(props.searchValue, data);
    
    setFilteredRaces(filtered);
    setRaces(data);
    setIsLoading(false);
  }

  const handelClickDetails = (id) => {
    const linkTo = `/races/${id}`;
    navigate(linkTo);
  };


  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: grey.A200,
      color: theme.palette.common.black,
      fontWeight: 600,
      padding: 10,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: 5,
    },
  }));

  if (isLoading) {
    return <LoaderFlag/>
  }

  return (
    <div style={{ width: "100vw", overflow: "hidden" }}>
      <h2>Race Calendar</h2>
      <TableContainer sx={{ color: 'grey.A400', border: 15, borderRadius: 2, }}>
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
            {filteredRaces.map((race) => (
              <TableRow key={race.round} onClick={() => handelClickDetails(race.round)} hover sx={{ cursor: 'pointer' }}>
                <StyledTableCell component="th" scope="row" >{race.round}</StyledTableCell>

                <StyledTableCell>
                  <Box
                    display="flex">
                    <Box
                      marginRight={2}
                      textAlign="center">
                      <Flag country={getAlphaCode(props.flags, race.Circuit.Location.country)} size={20} />
                    </Box>
                    <Box>
                      {race.raceName}
                    </Box>
                  </Box>                 
                </StyledTableCell>
                <StyledTableCell>{race.Circuit.circuitName}</StyledTableCell>
                <StyledTableCell>{race.date}</StyledTableCell>
                <StyledTableCell>
                  <Box
                    display="flex">
                    <Box
                      marginRight={2}
                      textAlign="center">
                      <Flag country={getAlphaCode(props.flags, race.Results[0].Driver.nationality)} size={20} />
                    </Box>
                    <Box>
                      {race.Results[0].Driver.familyName}
                    </Box>
                  </Box>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  );
}

export default RacesList;
