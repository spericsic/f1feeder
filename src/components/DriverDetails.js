import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
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

const DriverDetails = (props) => {
  const [driverDetails, setDriverDetails] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    getDriver();
  }, []);

  const getDriver = async () => {
    const id = params.driverId;
    const urlDetails = `http://ergast.com/api/f1/2013/drivers/${id}/driverStandings.json`;
    const urlList = `http://ergast.com/api/f1/2013/drivers/${id}/results.json`;

    const responseDetails = await axios.get(urlDetails);
    const dataDetails = responseDetails.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];

    const responseList = await axios.get(urlList);
    const dataList = responseList.data.MRData.RaceTable.Races;

    setDriverDetails(dataDetails);
    setDriverList(dataList);
    setIsLoading(false);
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
    <div>
      <div>
        <div>
          <p><img src={`${process.env.PUBLIC_URL}/assets/img/${params.driverId}.jpg`}  alt="Drivers" style={{ maxHeight: `60px` }} /></p>
        <div>
          <p><Flag country={getAlphaCode(props.flags,driverDetails.Driver.nationality)} size={20} /></p>
          <p>{driverDetails.Driver.givenName} {driverDetails.Driver.familyName}</p>
        </div>
      </div>

      <div>
        <p>Country: {driverDetails.Driver.nationality}</p>
        <p>Team: {driverDetails.Constructors[0].name}</p>
        <p>Birth: {driverDetails.Driver.dateOfBirth}</p>
        <p>Biography: {driverDetails.Driver.url}</p>
      </div>
    </div>

    <TableContainer component={Paper}>

      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Formula 1 2013 Results</StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Round</StyledTableCell>
            <StyledTableCell>Grand Prix</StyledTableCell>
            <StyledTableCell>Team</StyledTableCell>
            <StyledTableCell>Grid</StyledTableCell>
            <StyledTableCell>Race</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {driverList.map((race, i) =>
            <TableRow key={i}>
              <StyledTableCell>{race.round}</StyledTableCell>
              <StyledTableCell>
                  <div style={{ display: "flex", alignItems: 'center' }}>
                    <div style={{margin:"0 10px"}}>
                      <Flag country={getAlphaCode(props.flags, race.Circuit.Location.country)} size={20} />
                    </div>{race.raceName}
                  </div>
              </StyledTableCell>
              <StyledTableCell>{race.Results[0].Constructor.name}</StyledTableCell>
              <StyledTableCell>{race.Results[0].grid}</StyledTableCell>
              <StyledTableCell>{race.Results[0].position}</StyledTableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>

    </div>
  );
}
export default DriverDetails;