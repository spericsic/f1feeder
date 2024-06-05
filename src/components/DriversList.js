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
import { SportsMotorsports, Home, Groups } from '@mui/icons-material';

const DriversList = (props) => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getDrivers();
  }, []);

  useEffect(() => {
    const filtered = setSearchData(props.searchValue, drivers);
    setFilteredDrivers(filtered);
  }, [props.searchValue]);

  const getDrivers = async () => {
    const items = [
      {name: 'Home', link: '/', icon: <Home/>},
      { name: 'Drivers', link: '/drivers/', icon: <SportsMotorsports/>},
    ]
    props.breadcrumbs(items)

    const url ="http://ergast.com/api/f1/2013/driverStandings.json";
    const response = await axios.get(url);
    const data = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    const filtered = setSearchData(props.searchValue, data);

    setFilteredDrivers(filtered);
    setDrivers(data);
    setIsLoading(false);
  };

  const handelClickDetails = (path, id, name) => {
    const linkTo = `/${path}/${id}`;
    navigate(linkTo);
    const items = [
      {name: 'Home', link: '/', icon: <Home/>},
      { name: `${path.charAt(0).toUpperCase() + path.slice(1)}`, link: `/${path}/`, icon: path == "drivers" ? <SportsMotorsports/> : <Groups/>},
      { name: `${name}`}
    ]
    props.breadcrumbs(items)
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: grey[400],
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
      Drivers Championship
    </Box>
      <Box
        display="flex"
        border={15}
        color="gray">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell colSpan={5}>Drivers Championship Standings - 2013</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDrivers.map((driver) =>
                <StyledTableRow hover key={driver.position}>
                  <StyledTableCell>{driver.position}</StyledTableCell>               
                  <StyledTableCell>
                  <Box
                    display='flex'
                    justifyItems='center'
                    alignItems='center'>
                    <Box
                        marginRight={0.8}
                        display='flex'
                        justifyItems='center'
                        alignItems='center'
                        >
                        <Flag country={getAlphaCode(props.flags, driver.Driver.nationality)} size={30} />
                      </Box>
                      <Box sx={{ cursor: 'pointer' }}
                    onClick={() => handelClickDetails('drivers',driver.Driver.driverId, driver.Driver.familyName)}>
                        {driver.Driver.givenName} {driver.Driver.familyName}
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handelClickDetails('teams',driver.Constructors[0].constructorId, driver.Constructors[0].name)}>
                      {driver.Constructors[0].name}
                  </StyledTableCell>
                  <StyledTableCell>{driver.points}</StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
export default DriversList;