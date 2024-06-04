import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Flag from 'react-flagkit';
import { getAlphaCode, setSearchData, goToExternalLink } from '../Utils.js';
import { styled } from '@mui/material/styles';
import {Table, TableBody, TableCell, TableContainer, TableHead,TableRow} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import LoaderFlag from "./LoaderFlag.js";
import { OpenInNew, Home, Groups } from '@mui/icons-material';


const TeamsList = (props) => {

  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getTeams();
  }, []);

  useEffect(() => {
    const filtered = setSearchData(props.searchValue, teams);
    setFilteredTeams(filtered);
  }, [props.searchValue]);

  const getTeams = async () => {

    const items = [
      {name: 'Home', link: '/', icon: <Home/>},
      { name: 'Teams', link: '/teams/', icon: <Groups/>},
    ]
    props.breadcrumbs(items)

    const url = "http://ergast.com/api/f1/2013/constructorStandings.json";
    const response = await axios.get(url);
    const data = response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    const filtered = setSearchData(props.searchValue, data);

    setTeams(data);
    setFilteredTeams(filtered);
    setIsLoading(false);
  };

  const handelClickDetails = (id, name) => {
    const linkTo = `/teams/${id}`;
    navigate(linkTo);
    const items = [
      {name: 'Home', link: '/', icon: <Home/>},
      { name: 'Teams', link: '/teams/', icon: <Groups/>},
      { name: `${name}`}
    ]
    props.breadcrumbs(items)
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

  if (isLoading) {
    return <LoaderFlag />
  }

  return (
    <>
      <Box className="list-title">
        Constructions Championship
      </Box>


      <Box
        sx={{ border: 15, borderColor: grey }}
        color="gray"
      >
        <TableContainer>

          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell colSpan={4}> Constructors Championship Standings - 2013 </StyledTableCell>
              </TableRow>
            </TableHead>


            <TableBody>

              {filteredTeams.map((team) => {
                return (
                  <StyledTableRow hover key={team.position}>
                    <StyledTableCell>{team.position}</StyledTableCell>

                    <StyledTableCell 
                      sx={{ cursor: "pointer" }}
                      onClick={() => handelClickDetails(team.Constructor.constructorId, team.Constructor.name)} 
                      >
                      <Box
                        display='flex'
                        justifyItems='center'
                        alignItems='center'>
                      <Box
                        marginRight={2}
                        display='flex'
                        justifyItems='center'
                        alignItems='center'
                        >
                          <Flag country={getAlphaCode(props.flags, team.Constructor.nationality)} size={30} />
                        </Box>
                        <Box >
                          {team.Constructor.name}
                        </Box>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell
                      onClick={() => goToExternalLink(team.Constructor.url)}
                      sx={{ cursor: "pointer" }}>
                        <Box
                          display='flex'
                          justifyItems='center'
                          alignItems='center'>
                          Details 
                          <Box
                            marginLeft={2}
                            display='flex'
                            justifyItems='center'
                            alignItems='center'
                            >
                            <OpenInNew fontSize="small" />
                          </Box>
                        </Box>
                    </StyledTableCell>
                    <StyledTableCell>{team.points}</StyledTableCell>
                  </StyledTableRow>
                );
              })}

            </TableBody>
          </Table>

        </TableContainer>
      </Box>
    </>
  );
}
export default TeamsList;