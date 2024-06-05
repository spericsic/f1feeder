import axios from "axios";
import { useEffect, useState } from "react";
import { useParams , useNavigate } from "react-router-dom";
import Flag from 'react-flagkit';
import { getAlphaCode , goToExternalLink, getCellBackgroundColor} from '../Utils.js';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, Typography, Box }from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { grey } from "@mui/material/colors";
import { CardActionArea } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LoaderFlag from "./LoaderFlag.js";
import {SportsScore, Groups, Home} from '@mui/icons-material';

const DriverDetails = (props) => {
  const [driverDetails, setDriverDetails] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const navigate = useNavigate();

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

  const handelClickDetails = (path, id, name) => {
    const linkTo = `/${path}/${id}`;
    navigate(linkTo);
    const items = [
      {name: 'Home', link: '/', icon: <Home/>},
      { name: `${path.charAt(0).toUpperCase() + path.slice(1)}`, link: `/${path}/`, icon: path == "races" ? <SportsScore/> : <Groups/>},
      { name: `${name}`}
    ]
    props.breadcrumbs(items)
  };

  if (isLoading) {
    return <LoaderFlag/>
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

  return (
    <Box display="flex">
      <Box
        width={1/5}
      >
        <Card 
          sx={{ Width: 235 }} 
          >
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
              <Box display='flex' alignItems='center'><Typography variant="caption" display="block" fontWeight={900}>Biography: </Typography><OpenInNewIcon fontSize="small" onClick={()=>goToExternalLink(driverDetails.Driver.url)} /></Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
      <Box 
        display="flex"
        width={1/1}
        border={15}
        color="gray">              
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell  colSpan={5}>Formula 1 2013 Results</StyledTableCell>
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
              {driverList.map((race) =>
                <StyledTableRow key={race.round}>
                  <StyledTableCell>{race.round}</StyledTableCell>
                  <StyledTableCell>
                    <Box
                    display='flex'
                    justifyItems='center'
                    alignItems='center'
                    >
                      <Box
                      marginRight={2}
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
                  <StyledTableCell onClick={() => handelClickDetails('teams',race.Results[0].Constructor.constructorId,race.Results[0].Constructor.name)} hover sx={{ cursor: 'pointer' }} >{race.Results[0].Constructor.name}</StyledTableCell>
                  <StyledTableCell>{race.Results[0].grid}</StyledTableCell>
                    <TableCell sx={{ backgroundColor: getCellBackgroundColor(race.Results[0].position), padding: 0 }}>
                      {race.Results[0].position}
                    </TableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>  
    </Box>
  );
}
export default DriverDetails;