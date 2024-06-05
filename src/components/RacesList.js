import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Flag from 'react-flagkit';
import { getAlphaCode , setSearchData } from '../Utils.js';
import { styled } from '@mui/material/styles';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { grey } from "@mui/material/colors";
import LoaderFlag from "./LoaderFlag.js";
import {SportsScore, Home, SportsMotorsports} from '@mui/icons-material';

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
    const items = [
      {name: 'Home', link: '/', icon: <Home/>},
      { name: 'Races', link: '/races/', icon: <SportsScore/>},
    ]
    props.breadcrumbs(items)

    const url = "http://ergast.com/api/f1/2013/results/1.json";
    const response = await axios.get(url);
    const data = response.data.MRData.RaceTable.Races;
    const filtered = setSearchData(props.searchValue, data);
    
    setFilteredRaces(filtered);
    setRaces(data);
    setIsLoading(false);
  };

  const handelClickDetails = (path, id, name) => {
    const linkTo = `/${path}/${id}`;
    navigate(linkTo);
    const items = [
      {name: 'Home', link: '/', icon: <Home/>},
      { name: `${path.charAt(0).toUpperCase() + path.slice(1)}`, link: `/${path}/`, icon: path == "drivers" ? <SportsMotorsports/> : <SportsScore/>},
      { name: `${name}`}
    ]
    props.breadcrumbs(items)
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: grey[500],
      color: theme.palette.common.black,
      fontWeight: 600,
      padding: 10,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      fontWeight: 600,
      color: `#3a587f`,
      padding: 5,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: grey[300],
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  if (isLoading) {
    return <LoaderFlag/>
  }

  return (
    <>
    <Box className="list-title">
    Race Calendar
    </Box>
      <TableContainer sx={{ color: 'grey', border: 15 }}>
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
              <TableRow key={race.round}>
                <StyledTableCell component="th" scope="row" >{race.round}</StyledTableCell>
                <StyledTableCell>
                  <Box
                    display="flex">
                    <Box
                      marginRight={2}
                      textAlign="center">
                      <Flag country={getAlphaCode(props.flags, race.Circuit.Location.country)} size={20} />
                    </Box>
                    <Box onClick={() => handelClickDetails('races',race.round,race.raceName)} hover sx={{ cursor: 'pointer' }}>
                      {race.raceName}
                    </Box>
                  </Box>                 
                </StyledTableCell>
                <StyledTableCell>{race.Circuit.circuitName}</StyledTableCell>
                <StyledTableCell>{race.date}</StyledTableCell>
                <StyledTableCell onClick={() => handelClickDetails('drivers',race.Results[0].Driver.driverId,race.Results[0].Driver.familyName)} hover sx={{ cursor: 'pointer' }}>
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
    </>
  );
}

export default RacesList;
