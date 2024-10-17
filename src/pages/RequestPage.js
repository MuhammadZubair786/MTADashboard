import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import {
  Container,
  Stack,
  Typography,
  Box,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

// import { DataGrid } from '@mui/x-data-grid';

import { getReuqest } from '../service/Request.service';
import { imgURL } from '../service/config';
import { StyledNavItemIcon } from '../components/nav-section/styles';
import SvgColor from '../components/svg-color/SvgColor';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 40, height: 40 }} />;

export default function RequestPage() {
  const [data, setdata] = useState([]);
  const getdata = async () => {
    const resp = await getReuqest();
    console.log(resp.data);
    setdata(resp.data);
  };
  useEffect(() => {
    getdata();
  }, []);
  //   const columns = [
  //     // {field:"_id", headerName: 'ID', width: 130 },
  //     { field: 'requestType', headerName: 'Request Type', width: 130 },
  //     // { field: 'status', headerName: 'Status', width: 130 },
  //     // {
  //     //   field: 'senderType',
  //     //   headerName: 'Sender Type',
  //     //   width: 130,
  //     // },
  //     // {
  //     //   field: 'receiverType',
  //     //   headerName: 'Receiver Type',
  //     //   width: 130,

  //     // }
  //   ];

  return (
    <>
      <Helmet>
        <title> Request </title>
      </Helmet>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Request
        </Typography>
      </Stack>
      <Box component={'div'}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Sender Type</TableCell>
                <TableCell align="center">Sender</TableCell>
                <TableCell align="center">Receiver Type</TableCell>
                <TableCell align="center">Receiver</TableCell>
                <TableCell align="center">Request Type</TableCell>
                <TableCell align="center">Request Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" align="center">
                    {row.senderType}
                  </TableCell>
                  <TableCell align="center" sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex' }}>
                      {row.senderID?.image?.file ? (
                        <Box
                          component="img"
                          alt="sender profile"
                          src={imgURL + row.senderID?.image?.file}
                          sx={{ width: 50, mr: 2 }}
                        />
                      ) : (
                        <StyledNavItemIcon>{icon('user-circle-svgrepo-com')}</StyledNavItemIcon>
                      )}

                      {/* <img alt="sender profile"  src={imgURL + row.senderID?.image?.file} /> */}
                      {row.senderID?.fullName}
                    </div>
                  </TableCell>
                  <TableCell align="center">{row.receiverType}</TableCell>
                  <TableCell align="center" sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{display:"flex"}}>
                    {row.receiverID?.image?.file ? (
                      <>
                        <Box
                          component="img"
                          alt="receiver profile"
                          src={imgURL + row.receiverID?.image?.file}
                          sx={{ width: 45, mr:2 ,}}
                        />
                        {row.receiverID?.fullName}
                      </>
                    ) : (
                      <>
                        <Box component="div" sx={{ width: 45 }}>
                          <StyledNavItemIcon>{icon('user-circle-svgrepo-com')}</StyledNavItemIcon>
                        </Box>
                        <span>{row.receiverID?.fullName}</span>
                      </>
                    )}
                    </div>
                  </TableCell>
                  <TableCell align="center">{row.requestType}</TableCell>
                  <TableCell align="center" >
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {row.status === 'pending' ? (
                      <Box
                        component="div"
                        sx={{
                          borderRadius: '50%',
                          height: 10,
                          width: 10,
                          backgroundColor: 'yellow',
                          border: '2px solid yellow',
                        }}
                      />
                    ) : row.status === 'rejected' ? (
                      <Box
                        component="div"
                        sx={{
                          borderRadius: '50%',
                          height: 10,
                          width: 10,
                          backgroundColor: 'red',
                          border: '2px solid red',
                        }}
                      />
                    ) : (
                      <Box
                        component="div"
                        sx={{
                          borderRadius: '50%',
                          height: 10,
                          width: 10,
                          backgroundColor: 'green',
                          border: '2px solid green',
                        }}
                      />
                    )}
                    <Box component="p" sx={{ ml: 1 }}>
                      {row.status}
                    </Box>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
