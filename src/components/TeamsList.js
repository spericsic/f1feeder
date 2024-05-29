import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Flag from 'react-flagkit';


import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { grey } from "@mui/material/colors";

const TeamsList = (props) => {

  const [teams, setTeams] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getTeams();
  }, []);

  const getTeams = async () => {
    const url = "http://ergast.com/api/f1/2013/constructorStandings.json";
    const response = await axios.get(url);
    const data = response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    setTeams(data);
  };

  const handelClickDetails = (id) => {
    const linkTo = `/teams/details/${id}`;
    navigate(linkTo);
  };

  const getFlag = (filter, size) => {
    const flagData = props.flags.filter(flag =>
      flag.en_short_name.toLowerCase() === filter.toLowerCase()
      || flag.nationality.toLowerCase() === filter.toLowerCase()
    );
    const alpha2Code = flagData.length == 1 ? flagData[0].alpha_2_code : (filter == "UK" ? "GB" : filter);
    return <Flag country={alpha2Code} size={size} />
  }

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

  return (
    <div>
      <h2>Construction Championship</h2>


      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell> Constructors Championship Standings - 2013 </StyledTableCell>
            </TableRow>
          </TableHead>


          <TableBody>

            {teams.map((team) => {
              return (
                <TableRow key={team.position}
                  onClick={() => handelClickDetails(team.Constructor.constructorId)}>
                  <StyledTableCell component="th" scope="row" >{team.position}</StyledTableCell>
                  <StyledTableCell>{team.position}</StyledTableCell>

                  <StyledTableCell><div style={{ display: "flex", alignItems: 'center' }}><div style={{ margin: "0 10px" }}>{getFlag(team.Constructor.nationality, 15)}</div> {team.Constructor.name}</div></StyledTableCell>
                  <StyledTableCell>{team.Constructor.url}</StyledTableCell>
                  <StyledTableCell>{team.points}</StyledTableCell>
                </TableRow>
              );
            })}

          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
export default TeamsList;