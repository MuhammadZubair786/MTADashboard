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
  Button,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { getNutrition } from '../service/Nutrition.service';
import { imgURL } from '../service/config';
import { StyledNavItemIcon } from '../components/nav-section/styles';
import SvgColor from '../components/svg-color/SvgColor';

const icon = (name) => <SvgColor src={`/assets/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

export default function Nutrition() {
  const [data, setdata] = useState([]);
  const [content, setcontent] = useState({});
  const [view, setview] = useState(false);
  const [count, setcount] = useState([]);
  
  const [page, setpage] = useState(1);
  const getdata = async () => {
    const resp = await getNutrition();
    const N =
    resp.data?.length % 10 === 0
      ? parseInt(resp.data?.length / 10,10)
      : parseInt(resp.data?.length / 10,10) + 1;
  setcount(Array.from({ length: N }, (_, index) => index + 1));
    setdata(resp.data);
  };
  useEffect(() => {
    getdata();
  }, []);
  const handleviewdata = (e) => {
    setcontent(e);
    setview(true);
  };
  console.log(content);
  return (
    <>
      <Helmet>
        <title> Nutrition </title>
      </Helmet>

      <Container>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" >
            Nutrition
          </Typography>
        </Stack>

        <Box component={'div'} sx={{ display: view ? 'none' : 'block' }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Creator</TableCell>
                  <TableCell align="center">Created For</TableCell>
                  <TableCell align="center">Created At</TableCell>
                  <TableCell align="center">Start Date</TableCell>
                  <TableCell align="center">End Date</TableCell>
                  <TableCell align="center">Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                ?.slice((page - 1) * 10, (page - 1) * 10 + 10)

                .map((row) => {
                  return (
                    <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row" align="center">
                        {row.user?.fullName}
                      </TableCell>
                      <TableCell align="center">
                        {row?.createdFor ? row.createdFor?.fullName : row.user?.fullName}
                      </TableCell>

                      <TableCell component="th" align="center">
                        {row.createdAt.split('T')[0]}
                      </TableCell>

                      <TableCell align="center">{row.startDate}</TableCell>
                      <TableCell align="center">{row.endDate}</TableCell>
                      <TableCell align="center">
                        <Button variant="contained" color="secondary" onClick={(e) => handleviewdata(row)}>
                          view
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="menupagination">
                Showing{" "}
                {data?.slice((page - 1) * 10, (page - 1) * 10 + 10)?.length}-{" "}
                {data?.length} results
                <div className="pagination">
                  {page === 1 ? (
                    <button  style={{ cursor: "default" }}>
                      Prev
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setpage(page - 1);
                      }}
                    >
                      Prev
                    </button>
                  )}

                 {count?.slice(page-1,page+5).map((item, index) => {
                    return (
                      <button className={item === page ? "active" : ""} onClick={()=>{setpage(item)}}>
                        {item}
                      </button>
                    );
                  })}
                  {page === count?.length ? (
                    <button  style={{ cursor: "default" }}>
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setpage(page + 1);
                      }}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
        </Box>
        <Box component={'div'} sx={{ display: !view ? 'none' : 'block' }}>

          <StyledNavItemIcon 
          sx={{cursor: 'pointer', width:100,height:50}}
          onClick={(e)=>{
            setview(false)
            setcontent({})

          }}>{icon('back-svgrepo-com')}</StyledNavItemIcon>

{content.createdFor?.image ? (
            <>
              <Box
                component="img"
                src={imgURL + content.createdFor?.image?.file}
                alt="User profile"
                sx={{ width: 100, mr: 2 }}
              />
            </>
          ) :( content.user?.image ? (
            <>
              <Box
                component="img"
                src={imgURL + content.user?.image?.file}
                alt="User profile"
                sx={{ width: 100, mr: 2 }}
              />
            </>
          ):(
            <StyledNavItemIcon>{icon('user-circle-svgrepo-com')}</StyledNavItemIcon>
            
          )
          )}

          <h1>{content?.createdFor ? content.createdFor?.fullName : content.user?.fullName}</h1>
          <h2>Nutrition Entries</h2>
          {content?.nutritionEntries?.map((item) => (
            <>
              <h3> Title: {item.title}</h3>
              {/* <h3> Day: {item.day}</h3> */}
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Meal</TableCell>
                      <TableCell align="center">Example</TableCell>
                      <TableCell align="center">KCal</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="center">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {item.mealEntries?.map((row) => {
                      return (
                        <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row" align="center">
                            {row.meal}
                          </TableCell>
                          <TableCell align="center">{row?.example}</TableCell>

                          <TableCell component="th" align="center">
                            {row.kcal}
                          </TableCell>

                          <TableCell align="center">{row.qty}</TableCell>
                          <TableCell align="center">{row.kcal * row.qty}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <h3>
                Total Callories for day {item.day} : {item.totalCal}
              </h3>
            </>
          ))}
        </Box>
      </Container>
    </>
  );
}
