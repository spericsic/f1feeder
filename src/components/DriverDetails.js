import axios from "axios";
import { useEffect, useState } from "react";
import { useParams , useNavigate } from "react-router-dom";
import Flag from 'react-flagkit';
import { getAlphaCode , goToExternalLink, getCellBackgroundColor, setSearchData, getTableColors} from '../Utils.js';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, Typography, Box }from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { CardActionArea } from '@mui/material';
import LoaderFlag from "./LoaderFlag.js";
import {SportsScore, Groups, Home, OpenInNew} from '@mui/icons-material';

const DriverDetails = (props) => {
  const [driverDetails, setDriverDetails] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredDrivers, setFilteredDrivers] = useState([]);

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getDriver();
  }, []);

  useEffect(() => {
    const filtered = setSearchData(props.searchValue, driverList, true);
    setFilteredDrivers(filtered);
  }, [props.searchValue]);

  const getDriver = async () => {

    props.main(false);

    const year = props.year
    const id = params.driverId;
    const urlDetails = `https://ergast.com/api/f1/${year}/drivers/${id}/driverStandings.json`;
    const urlList = `https://ergast.com/api/f1/${year}/drivers/${id}/results.json`;

    const responseDetails = await axios.get(urlDetails);
    const dataDetails = responseDetails.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];

    const responseList = await axios.get(urlList);
    const dataList = responseList.data.MRData.RaceTable.Races;

    const filtered = setSearchData(props.searchValue, dataList , true);

    setFilteredDrivers(filtered);
    setDriverDetails(dataDetails);
    setDriverList(dataList);
    setIsLoading(false);
  }

  const handelClickDetails = (path, id, name) => {
    const linkTo = `/${path}/${id}`;
    navigate(linkTo);
    const items = [
      { name: 'Home', link: '/', icon: <Home/>},
      { name: `${path.charAt(0).toUpperCase() + path.slice(1)}`, link: `/${path}/`, icon: path === "races" ? <SportsScore/> : <Groups/>},
      { name: `${name}`}
    ];
    props.breadcrumbs(items);
  };

  const tableColors = getTableColors();

  const StyledTableCell = styled(TableCell)(() => ({
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

  const StyledTableRow = styled(TableRow)(() => ({
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
        <Card 
          width={1/4}
          className="detail-card">
          <CardActionArea 
            className="details-card-area">
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
              <Box display='flex' justifyContent='center' alignItems='center'>
                <Typography variant="caption" display="block" fontWeight={900}>Biography: 
                </Typography><OpenInNew fontSize="small" sx={{paddingLeft: 0.5}} onClick={()=>goToExternalLink(driverDetails.Driver.url)} />
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>

      <Box 
        display="flex"
        width={3/4}
        border={15}
        className="table-background-details">              
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell  colSpan={5}>Formula 1 {props.year} Results</StyledTableCell>
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
              {filteredDrivers.map((race) =>
                <StyledTableRow key={race.round}>
                  <StyledTableCell>{race.round}</StyledTableCell>
                  <StyledTableCell>
                    <Box
                    display='flex'
                    justifyItems='center'
                    alignItems='center'
                    >
                      <Box
                        marginRight={0.8}
                        display='flex'
                        justifyItems='center'
                        alignItems='center'
                        >
                          <Flag country={getAlphaCode(props.flags, race.Circuit.Location.country)} size={30} />
                      </Box>
                      <Box 
                        onClick={() => handelClickDetails('races', race.round, race.raceName)} hover sx={{ cursor: 'pointer' }}>
                          {race.raceName}
                      </Box>
                    </Box>      
                  </StyledTableCell>
                  <StyledTableCell 
                    onClick={() => handelClickDetails('teams',race.Results[0].Constructor.constructorId,race.Results[0].Constructor.name)} 
                    hover 
                    sx={{ cursor: 'pointer' }} >
                      {race.Results[0].Constructor.name}
                  </StyledTableCell>
                  <StyledTableCell>{race.Results[0].grid}</StyledTableCell>
                    <StyledTableCell sx={{ backgroundColor: getCellBackgroundColor(race.Results[0].position), padding: 0 }}>
                      {race.Results[0].position}
                    </StyledTableCell>
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