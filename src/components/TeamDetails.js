import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import Flag from "react-flagkit";
import { getAlphaCode } from '../Utils.js';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { grey } from "@mui/material/colors";


import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Box from "@mui/material/Box";





const TeamDetails = (props) => {
  const [teamDetails, setTeamDetails] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();

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
      backgroundColor: grey.A200,
      color: theme.palette.common.black,
      fontWeight: 600,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));





  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <div style={{ display: "flex" }}>
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
              margin='auto'
              >
              <Box
              sx = {{
              objectFit:"contain"
              }}
                component='img'
                width={140}
                height={190}
                margin="auto"
                alt='Teams'
                src={`${process.env.PUBLIC_URL}/assets/img/${params.constructorId}.png`}
              />

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
            <Typography variant="caption" display="block" fontWeight={900}>History:  {teamDetails.Constructor.url}</Typography>

          </CardContent>
        </CardActionArea>
      </Card>




      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Formula 1 2013 Results </StyledTableCell>
            </TableRow>

            <TableRow>
              <StyledTableCell>Round</StyledTableCell>
              <StyledTableCell>Ground prix</StyledTableCell>
              <StyledTableCell>{teamList[0].Results[0].Driver.familyName}</StyledTableCell>
              <StyledTableCell>{teamList[0].Results[1].Driver.familyName}</StyledTableCell>
              <StyledTableCell>Points</StyledTableCell>
            </TableRow>
          </TableHead>


          <TableBody>

            {teamList.map((result) =>
              <TableRow hover key={result.round} sx={{ cursor: "pointer" }}>
                <StyledTableCell>{result.round}</StyledTableCell>

                <StyledTableCell>
                  <Flag country={getAlphaCode(props.flags, result.Circuit.Location.country)} size={20} /> {result.raceName}
                </StyledTableCell>
                <StyledTableCell>{result.Results[0].position}</StyledTableCell>
                <StyledTableCell>{result.Results[1].position}</StyledTableCell>
                <StyledTableCell>{parseInt(result.Results[0].points) + parseInt(result.Results[1].points)}</StyledTableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
export default TeamDetails;