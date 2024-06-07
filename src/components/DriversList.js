import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Flag from 'react-flagkit';
import { getAlphaCode, setSearchData, getTableColors } from '../Utils.js';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import LoaderFlag from "./LoaderFlag.js";
import { SportsMotorsports, Home, Groups } from '@mui/icons-material';

const DriversList = (props) => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getDrivers();
  }, []);

  useEffect(() => {
    const filtered = setSearchData(props.searchValue, drivers);
    setFilteredDrivers(filtered);
  }, [props.searchValue]);

  const getDrivers = async () => {
    const items = [
      {name: 'Home', link: '/', icon: <Home/>},
      { name: 'Drivers', link: '/drivers/', icon: <SportsMotorsports/>},
    ]
    props.breadcrumbs(items);
    props.main(false);
    
    const year = props.year;
    const url =`http://ergast.com/api/f1/${year}/driverStandings.json`;
    const response = await axios.get(url);
    const data = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    const filtered = setSearchData(props.searchValue, data);

    setFilteredDrivers(filtered);
    setDrivers(data);
    setIsLoading(false);
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

  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: tableColors.tableHeadBackgroundColor,
      color: tableColors.tableTextColor,
      fontWeight: 900,
      fontSize: 20,
      padding: 10,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
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
    <>
    <Box className="list-title">
      Drivers Championship
    </Box>
      <Box
        display="flex"
        border={15}
        className="table-background">
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell colSpan={5}>Drivers Championship Standings - {props.year}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDrivers.map((driver) =>
                <StyledTableRow hover key={driver.position}>
                  <StyledTableCell>{driver.position}</StyledTableCell>               
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
                        <Flag country={getAlphaCode(props.flags, driver.Driver.nationality)} size={30} />
                      </Box>
                      <Box sx={{ cursor: 'pointer' }}
                    onClick={() => handelClickDetails('drivers',driver.Driver.driverId, driver.Driver.familyName)}>
                        {driver.Driver.givenName} {driver.Driver.familyName}
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handelClickDetails('teams',driver.Constructors[0].constructorId, driver.Constructors[0].name)}>
                      {driver.Constructors[0].name}
                  </StyledTableCell>
                  <StyledTableCell>{driver.points}</StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
export default DriversList;