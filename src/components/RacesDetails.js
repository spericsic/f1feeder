import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Flag from 'react-flagkit';
import { getAlphaCode , goToExternalLink, getCellBackgroundColor} from '../Utils.js';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead,TableRow, Card, CardContent, Typography, Box } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { grey } from "@mui/material/colors";
import { CardActionArea } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LoaderFlag from "./LoaderFlag.js";
import {SportsMotorsports, Groups, Home} from '@mui/icons-material';


const RacesDetails = (props) => {

  const [RacesDetails, setRacesDetails] = useState([]);
  const [CardX, setCard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const navigate = useNavigate();

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

    const responseDetailsList = await axios.get(urlList);
    const dataList = responseDetailsList.data.MRData.RaceTable.Races;
    const dataRacesDetails = dataList[0].Results;

    setCard(dataCards);
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
      backgroundColor: grey[400],
      border: 0,
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

  if (isLoading) {
    return <LoaderFlag/>
  }

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: grey[300],
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <Box display="flex">
      <Box
        width={1/5}
      >
        <Card sx={{ maxWidth: 235 }}>
          <CardActionArea>
            <CardContent>
              <Box
                display='flex'
                flex='1'
                justifyContent='center'
                flexDirection='column'
                alignItems='center'
                margin='auto'>
                <Flag country={getAlphaCode(props.flags, CardX.Circuit.Location.country)} size={200} />
              </Box>

              <Typography variant="caption" display="block" fontWeight={700} style={{fontSize: "20px", color: "pink", textAlign:"center"}}>{CardX.raceName}</Typography>
              <Typography variant="caption" display="block" fontWeight={900}>Country: {CardX.Circuit.Location.country}</Typography>
              <Typography variant="caption" display="block" fontWeight={900}>Location: {CardX.Circuit.Location.locality}</Typography>
              <Typography variant="caption" display="block" fontWeight={900}>Date: {CardX.date}</Typography>
              <Box display='flex' alignItems='center'><Typography variant="caption" display="block" fontWeight={900}>Full Report: </Typography><OpenInNewIcon fontSize="small"  onClick={()=>goToExternalLink(CardX.url)} /></Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
      <Box 
        display="flex" 
        width={1/1}
        border={15}
        color="gray">
        <TableContainer sx={{ color: 'grey', border: 15 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell colSpan={5}>Qualifying results</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Pos</StyledTableCell>
                <StyledTableCell >Driver</StyledTableCell>
                <StyledTableCell >Team</StyledTableCell>
                <StyledTableCell >Best Time</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CardX.QualifyingResults.map((race) => (
                <StyledTableRow key={race.position}>
                  <StyledTableCell >{race.position}</StyledTableCell>
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
                          <Flag country={getAlphaCode(props.flags, race.Driver.nationality)} size={30} />
                      </Box>
                      <Box 
                        onClick={() => handelClickDetails('drivers', race.Driver.driverId, race.Driver.familyName)} hover sx={{ cursor: 'pointer' }}>
                          {race.Driver.familyName}
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell onClick={() => handelClickDetails('teams',race.Constructor.constructorId,race.Constructor.name)} hover sx={{ cursor: 'pointer' }} >{race.Constructor.name}</StyledTableCell>
                  <StyledTableCell>{handelTime(race)}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>


        <TableContainer  sx={{ color: 'grey', border: 15 }}>
        <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell colSpan={5}>Race results</StyledTableCell>
              </TableRow>
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
                <StyledTableRow key={race.position}>
                  <StyledTableCell>{race.position}</StyledTableCell>
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
                          <Flag country={getAlphaCode(props.flags, race.Driver.nationality)} size={30} />
                      </Box> 
                      <Box 
                        onClick={() => handelClickDetails('drivers', race.Driver.driverId, race.Driver.familyName)} hover sx={{ cursor: 'pointer' }} >
                        {race.Driver.familyName}
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell onClick={() => handelClickDetails('teams',race.Constructor.constructorId,race.Constructor.name)} hover sx={{ cursor: 'pointer' }} >{race.Constructor.name}</StyledTableCell>
                  <StyledTableCell>{race.Time ? race.Time.time : "0"}</StyledTableCell>
                    <StyledTableCell sx={{ backgroundColor: getCellBackgroundColor(race.points)}}>
                    {race.points}
                    </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
export default RacesDetails;