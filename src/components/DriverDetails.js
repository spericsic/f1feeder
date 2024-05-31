import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import Flag from 'react-flagkit';
import { getAlphaCode } from '../Utils.js';


import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { grey } from "@mui/material/colors";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Box from "@mui/material/Box";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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
      padding: 10,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: 5,
    },
  }));

  const handleOpenLink= ()=> window.open(driverDetails.Driver.url, "_blank");

  return (
    <div style={{ display: "flex"}}>
      <Card sx={{ maxWidth: 235 }} onClick={(handleOpenLink)}>
        <CardActionArea>
          <CardContent>
            <Box
              display='flex'
              flex='1'
              justifyContent='center'
              flexDirection='column'
              alignItems='center'
              margin='auto'>
                <Box 
                  component='img'
                  sx={{ 
                    width: 140,
                  }}
                  alt='Drivers'
                  src={`${process.env.PUBLIC_URL}/assets/img/${params.driverId}.jpg`}/>
            
              <Typography variant="caption" fontWeight={700} style={{fontSize: "20px"}}>
                <Flag country={getAlphaCode(props.flags,driverDetails.Driver.nationality)} size={40} />
              </Typography>
              <Typography variant="caption" fontWeight={700} style={{fontSize: "20px", color: "pink"}}>
                {driverDetails.Driver.givenName} 
                {driverDetails.Driver.familyName}
              </Typography>
            </Box>

            <Typography variant="caption" display="block" fontWeight={900}>Country: {driverDetails.Driver.nationality}</Typography>
            <Typography variant="caption" display="block" fontWeight={900}>Team: {driverDetails.Constructors[0].name}</Typography>
            <Typography variant="caption" display="block" fontWeight={900}>Birth: {driverDetails.Driver.dateOfBirth}</Typography>
            <Box display='flex' alignItems='center'><Typography variant="caption" display="block" fontWeight={900}>Biography: </Typography><OpenInNewIcon fontSize="small" /></Box>
          </CardContent>
        </CardActionArea>
      </Card>

    <TableContainer>

    <Table sx={{ minWidth: 1000 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell colSpan={5}>Formula 1 2013 Results</StyledTableCell>
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
            <TableRow hover key={i}>
              <StyledTableCell>{race.round}</StyledTableCell>
              <StyledTableCell sx={{ cursor: 'pointer' }}>
                <Box
                 display='flex' 
                 >
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
              <StyledTableCell sx={{ cursor: 'pointer' }}>{race.Results[0].Constructor.name}</StyledTableCell>
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