import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Flag from 'react-flagkit';
import { getAlphaCode , setSearchData } from '../Utils.js';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import LoaderFlag from "./LoaderFlag.js";

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
  },[props.searchValue]);

  const getTeams = async () => {
    const url = "http://ergast.com/api/f1/2013/constructorStandings.json";
    const response = await axios.get(url);
    const data = response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    const filtered = setSearchData(props.searchValue, data);

    setTeams(data);
    setFilteredTeams(filtered);
    setIsLoading(false);
  };

  const handelClickDetails = (id) => {
    const linkTo = `/teams/details/${id}`;
    navigate(linkTo);
  };

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

  if (isLoading) {
    return <LoaderFlag/>
  }

  return (
    <>
      <h2>Construction Championship</h2>


      <TableContainer>
        <Table sx={{ minWidth: 1200 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell colSpan={4}> Constructors Championship Standings - 2013 </StyledTableCell>
            </TableRow>
          </TableHead>


          <TableBody>

            {filteredTeams.map((team) => {
              return (
                <TableRow hover key={team.position}
                  onClick={() => handelClickDetails(team.Constructor.constructorId)} sx={{ cursor: "pointer" }} >
                  <StyledTableCell>{team.position}</StyledTableCell>

                  <StyledTableCell>

                    <Box
                      display="flex">
                      <Box
                        marginRight={2}
                        textAlign="center">
                        <Flag country={getAlphaCode(props.flags, team.Constructor.nationality)} size={20} />
                      </Box>
                      <Box >
                        {team.Constructor.name}
                      </Box>
                    </Box>

                  </StyledTableCell>
                  <StyledTableCell>{team.Constructor.url}</StyledTableCell>
                  <StyledTableCell>{team.points}</StyledTableCell>
                </TableRow>
              );
            })}

          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
export default TeamsList;