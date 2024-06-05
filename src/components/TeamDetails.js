import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Flag from "react-flagkit";
import { getAlphaCode, getCellBackgroundColor, goToExternalLink } from '../Utils.js';
import { styled } from '@mui/material/styles';
import { Box, Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Card, CardContent, Typography } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { grey } from "@mui/material/colors";
import { CardActionArea } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LoaderFlag from "./LoaderFlag.js";
import {SportsScore, Home} from '@mui/icons-material';


const TeamDetails = (props) => {
  const [teamDetails, setTeamDetails] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getTeam();
  }, []);

  const getTeam = async () => {
    const id = params.constructorId;
    const urlDetails = `http://ergast.com/api/f1/2013/constructors/${id}/constructorStandings.json`;
    const urlList = `http://ergast.com/api/f1/2013/constructors/${id}/results.json`;

    const responseDetails = await axios.get(urlDetails);
    const dataDetails = responseDetails.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[0];

    const responseList = await axios.get(urlList);
    const dataList = responseList.data.MRData.RaceTable.Races;

    setTeamDetails(dataDetails);
    setTeamList(dataList);
    setIsLoading(false);

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
      padding: 6,
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

  const handelClickDetails = (id, name) => {
    const linkTo = `/races/${id}`;
    navigate(linkTo);
    const items = [
      {name: 'Home', link: '/', icon: <Home/>},
      { name: `Races`, link: `/races/`, icon: <SportsScore/>},
      { name: `${name}`}
    ]
    props.breadcrumbs(items)
  };

  if (isLoading) {
    return <LoaderFlag />
  }

  return (
    <Box display="flex"  >

      <Box width={1 / 5}>
        <Card
          sx={{ maxWidth: 235 }}>
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
                  sx={{
                    objectFit: "contain"
                  }}
                  component='img'
                  width={140}
                  height={190}
                  //margin="auto"
                  alt='Teams'
                  src={`${process.env.PUBLIC_URL}/assets/img/${params.constructorId}.png`} />

                <Typography variant="caption" fontWeight={700} style={{ fontSize: "20px" }} >
                  <Flag country={getAlphaCode(props.flags, teamDetails.Constructor.nationality)} size={40} />
                </Typography>

                <Typography variant="caption" fontWeight={700} style={{ fontSize: "20px", color: "pink" }} >
                  {teamDetails.Constructor.name}
                </Typography>
              </Box>

              <Typography variant="caption" display="block" fontWeight={900}>Country: {teamDetails.Constructor.nationality}</Typography>
              <Typography variant="caption" display="block" fontWeight={900} >Position: {teamDetails.position}</Typography>
              <Typography variant="caption" display="block" fontWeight={900}>Points: {teamDetails.points}</Typography>

              <Box display='flex' alignItems='center'>
                <Typography variant="caption" display="block" fontWeight={900}>History:  </Typography><OpenInNewIcon fontSize="small" onClick={() => goToExternalLink(teamDetails.Constructor.url)} />
              </Box>

            </CardContent>
          </CardActionArea>
        </Card>
      </Box>

      {/* novi box sa parametrima sx */}
      <Box
        display="flex" width={1 / 1}
        border={15}
        borderColor="grey"
        color="gray">

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow >
                <StyledTableCell colSpan={5}>Formula 1 2013 Results </StyledTableCell>
              </TableRow>

              <TableRow >
                <StyledTableCell>Round</StyledTableCell>
                <StyledTableCell>Ground prix</StyledTableCell>
                <StyledTableCell>{teamList[0].Results[0].Driver.familyName}</StyledTableCell>
                <StyledTableCell>{teamList[0].Results[1].Driver.familyName}</StyledTableCell>
                <StyledTableCell>Points</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody >
              {teamList.map((result) =>
                <StyledTableRow key={result.round}>
                  <StyledTableCell>{result.round}</StyledTableCell>

                  <StyledTableCell>
                    <Box
                      display='flex'
                      justifyItems='center'
                      alignItems='center'>
                      <Box
                        marginRight={2}
                        display='flex'
                        justifyItems='center'
                        alignItems='center'>
                        <Flag country={getAlphaCode(props.flags, result.Circuit.Location.country)} size={30} />
                      </Box>
                      <Box onClick={() => handelClickDetails(result.round,result.raceName)} hover sx={{ cursor: 'pointer' }}>
                        {result.raceName}
                      </Box>
                    </Box>
                  </StyledTableCell>

                  <TableCell sx={{ backgroundColor: getCellBackgroundColor(result.Results[0].position), padding: 0 }}>{result.Results[0].position}</TableCell>
                  <TableCell sx={{ backgroundColor: getCellBackgroundColor(result.Results[0].points), padding: 0 }}>{result.Results[1].points}</TableCell>
                  <StyledTableCell>{parseInt(result.Results[0].points) + parseInt(result.Results[1].points)}</StyledTableCell>
                </StyledTableRow>
              )}

            </TableBody>
          </Table>
        </TableContainer>
      </Box>


    </Box>
  );
}
export default TeamDetails;