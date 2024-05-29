import axios from "axios";
import { useState, useEffect } from "react";
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

const DriversList = (props) => {
const [drivers, setDrivers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getDrivers();
  }, []);

  const getDrivers = async () => {
    const url ="http://ergast.com/api/f1/2013/driverStandings.json";
    const response = await axios.get(url);
    const data = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    setDrivers(data);
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
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));


  return (
    <div>
      <h2>Drivers Championship</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Drivers Championship Standings - 2013</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver) =>
              <TableRow key={driver.position}
                onClick={() => handelClickDetails(driver.Driver.driverId)}>
                <StyledTableCell>{driver.position}</StyledTableCell>
                <StyledTableCell>
                  <div style={{ display: "flex", alignItems: 'center' }}>
                    <div style={{margin:"0 10px"}}>
                    <Flag country={getAlphaCode(props.flags, driver.Driver.nationality)} size={20} />
                    </div> {driver.Driver.givenName} {driver.Driver.familyName}
                  </div>
                </StyledTableCell>
                <StyledTableCell>{driver.Constructors[0].name}</StyledTableCell>
                <StyledTableCell>{driver.points}</StyledTableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
export default DriversList;