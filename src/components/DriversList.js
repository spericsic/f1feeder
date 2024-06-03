import axios from "axios";
import { useState, useEffect } from "react";
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
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import LoaderFlag from "./LoaderFlag.js";

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
    const url ="http://ergast.com/api/f1/2013/driverStandings.json";
    const response = await axios.get(url);
    const data = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    const filtered = setSearchData(props.searchValue, data);

    setFilteredDrivers(filtered);
    setDrivers(data);
    setIsLoading(false);
  };

  const handelClickDetails = (id) => {
    const linkTo = `/drivers/details/${id}`;
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
    <>
    <Box className="list-title">
      Drivers Championship
    </Box>
      <Box 
        border={15}
        color="gray">
        <TableContainer>
          <Table sx={{ minWidth: 1200 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell colSpan={5}>Drivers Championship Standings - 2013</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDrivers.map((driver) =>
                <TableRow hover key={driver.position}
                  onClick={() => handelClickDetails(driver.Driver.driverId)}>
                  <StyledTableCell>{driver.position}</StyledTableCell>               
                  <StyledTableCell sx={{ cursor: 'pointer' }}>
                  <Box
                  display='flex' 
                  >
                      <Box
                    marginRight={2}
                    textAlign="center">
                        <Flag country={getAlphaCode(props.flags, driver.Driver.nationality)} size={20} />
                      </Box>
                        <Box>
                          {driver.Driver.givenName} {driver.Driver.familyName}
                        </Box>
                      </Box>
                  </StyledTableCell>
                  <StyledTableCell sx={{ cursor: 'pointer' }}>{driver.Constructors[0].name}</StyledTableCell>
                  <StyledTableCell>{driver.points}</StyledTableCell>
                </TableRow>
              )}

            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
export default DriversList;