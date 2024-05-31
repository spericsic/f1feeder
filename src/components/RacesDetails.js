import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Flag from 'react-flagkit';
import LinearProgress from '@mui/material/LinearProgress';
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


const RacesDetails = (props) => {

  const [RacesDetails, setRacesDetails] = useState([]);
  const [RacesQualifying, setRacesQualifying] = useState([]);
  const [CardX, setCard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams()

  useEffect(() => {
    getRacesDetails();
  }, []);

  const getRacesDetails = async () => {

    const raceId = params.raceId;

    const urlDetails = `https://ergast.com/api/f1/2013/${params.raceId}/qualifying.json`;
    const urlList = `http://ergast.com/api/f1/2013/${params.raceId}/results.json`;

    const responseDetails = await axios.get(urlDetails);
    const dataCard = responseDetails.data.MRData.RaceTable.Races;
    const dataCards = dataCard[0];


    const data = responseDetails.data.MRData.RaceTable.Races;
    const dataQualifying = data[0].QualifyingResults;

    const responseDetailsList = await axios.get(urlList);
    const dataList = responseDetailsList.data.MRData.RaceTable.Races;
    const dataRacesDetails = dataList[0].Results;

    setCard(dataCards);
    setRacesQualifying(dataQualifying);
    setRacesDetails(dataRacesDetails);
    setIsLoading(false);
  }

  const handelTime = (race) => {
    const handleBestTime = [race.Q1, race.Q2, race.Q3]
    handleBestTime.sort()
    return handleBestTime[0]

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

  const handleOpenLink= ()=> window.open(CardX.url, "_blank");

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <div style={{ display: "flex" }}>
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

              <Typography variant="caption" fontWeight={700} style={{ fontSize: "20px" }}>
                <Flag country={getAlphaCode(props.flags, CardX.Circuit.Location.country)} size={200} />
              </Typography>
            </Box>

            <Typography variant="caption" display="block" fontWeight={900}>{CardX.raceName}</Typography>
            <Typography variant="caption" display="block" fontWeight={900}>Country: {CardX.Circuit.Location.country}</Typography>
            <Typography variant="caption" display="block" fontWeight={900}>Location: {CardX.Circuit.Location.locality}</Typography>
            <Typography variant="caption" display="block" fontWeight={900}>Date: {CardX.date}</Typography>
            <Box display='flex' alignItems='center'><Typography variant="caption" display="block" fontWeight={900}>Full Report: </Typography><OpenInNewIcon fontSize="small" /></Box>
          </CardContent>
        </CardActionArea>
      </Card>

      <div style={{ display: "flex", width: "80vw" }}>
      <TableContainer>
        <Table sx={{ minWidth: 1000 }} aria-label="customized table">
            <TableHead>
              <TableRow><StyledTableCell colSpan={5}>Qualifying results</StyledTableCell></TableRow>
              <TableRow>
                <StyledTableCell>Pos</StyledTableCell>
                <StyledTableCell >Driver</StyledTableCell>
                <StyledTableCell >Team</StyledTableCell>
                <StyledTableCell >Best Time</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {RacesQualifying.map((race) => (
                <TableRow key={race.position} hover sx={{ cursor: 'pointer' }}>
                  <StyledTableCell >{race.position}</StyledTableCell>
                  <StyledTableCell>
                    <Box
                    display="flex">
                      <Box
                      marginRight={2}
                      textAlign="center">
                        <Flag country={getAlphaCode(props.flags, race.Driver.nationality)} size={20} />
                      </Box>
                      {race.Driver.familyName}
                    </Box>
                    
                  </StyledTableCell>
                  <StyledTableCell>{race.Constructor.name}</StyledTableCell>
                  <StyledTableCell>{handelTime(race)}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>


        <TableContainer>
        <Table sx={{ minWidth: 1000 }} aria-label="customized table">
            <TableHead>
              <TableRow><StyledTableCell colSpan={5}>Race results</StyledTableCell></TableRow>
              <TableRow>
                <StyledTableCell>Pos</StyledTableCell>
                <StyledTableCell >Driver</StyledTableCell>
                <StyledTableCell >Team</StyledTableCell>
                <StyledTableCell >Result</StyledTableCell>
                <StyledTableCell >Points</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {RacesDetails.map((race) => (
                <TableRow key={race.position} hover sx={{ cursor: 'pointer' }}>
                  <StyledTableCell>{race.position}</StyledTableCell>
                  <StyledTableCell>
                    
                  <Box
                    display='flex'
                  >
                    <Box
                      marginRight={2}
                      textAlign="center"
                    >
                      <Flag country={getAlphaCode(props.flags, race.Driver.nationality)} size={20} />
                    </Box> 
                      <Box>
                        {race.Driver.familyName}
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>{race.Constructor.name}</StyledTableCell>
                  <StyledTableCell>{race.Time ? race.Time.time : "0"}</StyledTableCell>
                  <StyledTableCell>{race.points}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

    </div>
  );
}
export default RacesDetails;