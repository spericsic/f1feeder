import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Flag from 'react-flagkit';
import { getAlphaCode , goToExternalLink, getCellBackgroundColor, getTableColors, setSearchData} from '../Utils.js';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead,TableRow, Card, CardContent, Typography, Box } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { CardActionArea } from '@mui/material';
import LoaderFlag from "./LoaderFlag.js";
import {SportsMotorsports, Groups, Home, OpenInNew} from '@mui/icons-material';


const RacesDetails = (props) => {

  const [RacesDetails, setRacesDetails] = useState([]);
  const [CardX, setCard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredQualifyData, setFilteredQualifyData] = useState([]);

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getRacesDetails();
  }, []);

  useEffect(() => {

    const filtered = setSearchData(props.searchValue, RacesDetails, true);
    const filteredQualify = CardX.QualifyingResults ? setSearchData(props.searchValue, CardX.QualifyingResults , true) : [];
    setFilteredData(filtered);
    setFilteredQualifyData(filteredQualify);

  }, [props.searchValue]);

  const getRacesDetails = async () => {
    
    props.main(false);

    const year = props.year;
    const raceId = params.raceId;

    const urlDetails = `https://ergast.com/api/f1/${year}/${raceId}/qualifying.json`;
    const urlList = `http://ergast.com/api/f1/${year}/${raceId}/results.json`;

    const responseDetails = await axios.get(urlDetails);
    const dataCard = responseDetails.data.MRData.RaceTable.Races;
    const dataCards = dataCard[0];

    const responseDetailsList = await axios.get(urlList);
    const dataList = responseDetailsList.data.MRData.RaceTable.Races;
    const dataRacesDetails = dataList[0].Results;
    
    const filteredRace = setSearchData(props.searchValue, dataRacesDetails , true);
    const filteredQualify = setSearchData(props.searchValue, dataCards.QualifyingResults , true);

    setCard(dataCards);
    setRacesDetails(dataRacesDetails);
    setFilteredData(filteredRace);
    setFilteredQualifyData(filteredQualify);
    setIsLoading(false);
  };

  const handelTime = (race) => {
    const handleBestTime = [race.Q1, race.Q2, race.Q3];
    handleBestTime.sort();
    return handleBestTime[0];

  };

  const handelClickDetails = (path, id, name) => {
    const linkTo = `/${path}/${id}`;
    navigate(linkTo);
    const items = [
      {name: 'Home', link: '/', icon: <Home/>},
      { name: `${path.charAt(0).toUpperCase() + path.slice(1)}`, link: `/${path}/`, icon: path === "drivers" ? <SportsMotorsports/> : <Groups/>},
      { name: `${name}`}
    ];
    props.breadcrumbs(items);
  };

  const tableColors = getTableColors();

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: tableColors.tableHeadBackgroundColor,
      color: tableColors.tableTextColor,
      fontWeight: 900,
      fontSize: 15,
      padding: 10,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      fontWeight: 600,
      color: tableColors.tableTextColor,
      padding: 5,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: tableColors.tableRowBackgroundColor,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  if (isLoading) {
    return <LoaderFlag/>
  };  

  return (
    <Box display="flex">
      <Box>
        <Card width={1/1}
          className="detail-card">
          <CardActionArea
            className="details-card-area"
            height={1/1}>
            <CardContent>
              <Box
                display='flex'
                flex='1'
                justifyContent='center'
                flexDirection='column'
                alignItems='center'
                margin='auto'>
                <Flag country={getAlphaCode(props.flags, CardX.Circuit.Location.country)} size={150}/>
              </Box>
              <Typography variant="caption" display="block" fontWeight={700} style={{fontSize: "20px", color: "pink", textAlign:"center"}}>
                {CardX.raceName}
              </Typography>
              <Typography variant="caption" display="block" fontWeight={900}>Country: {CardX.Circuit.Location.country}</Typography>
              <Typography variant="caption" display="block" fontWeight={900}>Location: {CardX.Circuit.Location.locality}</Typography>
              <Typography variant="caption" display="block" fontWeight={900}>Date: {CardX.date}</Typography>
              <Box display='flex' justifyContent='center' alignItems='center'>
                <Typography variant="caption" display="block" fontWeight={900}>Full Report: </Typography>
                <OpenInNew fontSize="small" sx={{paddingLeft: 0.5}} onClick={()=>goToExternalLink(CardX.url)} />
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>

      <Box 
        display="flex" 
        width={1/1}
        border={15}
        className="table-background-details">
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell colSpan={4}>Qualifying results</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Pos</StyledTableCell>
                <StyledTableCell >Driver</StyledTableCell>
                <StyledTableCell >Team</StyledTableCell>
                <StyledTableCell >Best Time</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQualifyData.map((race) => (
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
                  <StyledTableCell onClick={() => handelClickDetails('teams',race.Constructor.constructorId,race.Constructor.name)} hover sx={{ cursor: 'pointer' }} >
                    {race.Constructor.name}
                  </StyledTableCell>
                  <StyledTableCell>{handelTime(race)}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box backgroundColor={tableColors.tableHeadBackgroundColor} width={1/30}></Box>
        <TableContainer>
          <Table stickyHeader>
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
              {filteredData.map((race) => (
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
                        alignItems='center'>
                          <Flag country={getAlphaCode(props.flags, race.Driver.nationality)} size={30} />
                      </Box> 
                      <Box 
                        onClick={() => handelClickDetails('drivers', race.Driver.driverId, race.Driver.familyName)} hover sx={{ cursor: 'pointer' }} >
                        {race.Driver.familyName}
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell 
                    onClick={() => handelClickDetails('teams',race.Constructor.constructorId,race.Constructor.name)} 
                    hover 
                    sx={{ cursor: 'pointer' }} >
                      {race.Constructor.name}
                  </StyledTableCell>
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