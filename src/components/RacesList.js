import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Flag from 'react-flagkit';
import { getAlphaCode, setSearchData, getTableColors } from '../Utils.js';
import { styled } from '@mui/material/styles';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
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
    props.breadcrumbs(items);
    props.main(false);

    const year = props.year
    const url = `https://ergast.com/api/f1/${year}/results/1.json`;
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
      { name: `${path.charAt(0).toUpperCase() + path.slice(1)}`, link: `/${path}/`, icon: path === "drivers" ? <SportsMotorsports/> : <SportsScore/>},
      { name: `${name}`}
    ];
    props.breadcrumbs(items);
  };

  const tableColors = getTableColors();

  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: tableColors.tableHeadBackgroundColor,
      color: tableColors.tableTextColor,
      fontWeight: 900,
      fontSize: 20,
      padding: 10,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      fontWeight: 600,
      color: tableColors.tableTextColor,
      padding: 5,
    },
  }));

  const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(odd)': {
      backgroundColor: tableColors.tableRowBackgroundColor,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  if (isLoading) {
    return <LoaderFlag/>
  };

  return (
    <>
    <Box className="list-title">
    Race Calendar
    </Box>
      <Box
          display="flex"
          border={15}
          className="table-background">
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow><StyledTableCell colSpan={5}>Race Calendar - {props.year}</StyledTableCell></TableRow>
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
                <StyledTableRow key={race.round}>
                  <StyledTableCell >{race.round}</StyledTableCell>
                  <StyledTableCell>
                    <Box
                      display="flex"
                      justifyItems='center'
                      alignItems='center'
                      >
                      <Box
                        marginRight={0.8}
                        display='flex'
                        justifyItems='center'
                        alignItems='center'
                        >
                        <Flag country={getAlphaCode(props.flags, race.Circuit.Location.country)} size={30} />
                      </Box>
                      <Box onClick={() => handelClickDetails('races',race.round,race.raceName)} hover sx={{ cursor: 'pointer' }}>
                        {race.raceName}
                      </Box>
                    </Box>                 
                  </StyledTableCell>
                  <StyledTableCell>{race.Circuit.circuitName}</StyledTableCell>
                  <StyledTableCell>{race.date}</StyledTableCell>
                  <StyledTableCell 
                    onClick={() => handelClickDetails('drivers',race.Results[0].Driver.driverId,race.Results[0].Driver.familyName)} 
                    hover
                    sx={{ cursor: 'pointer' }}>
                    <Box
                      display="flex"
                      justifyItems='center'
                      alignItems='center'
                      >
                      <Box
                         marginRight={0.8}
                         display='flex'
                         justifyItems='center'
                         alignItems='center'
                         >
                        <Flag country={getAlphaCode(props.flags, race.Results[0].Driver.nationality)} size={30} />
                      </Box>
                      <Box>
                        {race.Results[0].Driver.familyName}
                      </Box>
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default RacesList;
