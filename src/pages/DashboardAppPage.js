import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { getdashboard } from '../service/user.service';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  const [isLoading, setIsloading] = useState(false);
  const [payload, setpayload] = useState({
    android: 0,
    ios: 0,
    web: 0,
    male: 0,
    female: 0,
    post: 0,
    Instructors: 0,
    Users: 0,
  });
  const getdata = async () => {
    try {
      // setIsloading(true);
      // const resp = await getdashboard();
      // setIsloading(false);
      // setpayload(resp.data);
    } catch (error) {
      //   setIsloading(false);
      //   const message =
      //   (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      // console.log(message);
      // toast.error(message)
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Android Users"
            total={payload.android === 0 ? '4' : payload.android}
            icon={'ant-design:android-filled'}
            isloading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Iphone Users"
            total={payload.ios === 0 ? '4' : payload.ios}
            color="info"
            icon={'ant-design:apple-filled'}
            isloading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Web Users"
            total={payload.web === 0 ? '0' : payload.web}
            color="warning"
            icon={'ant-design:windows-filled'}
            isloading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Products"
            total={payload.post === 0 ? '10' : payload.post}
            color="error"
            icon={'file-icons:postscript'}
            isloading={isLoading}
          />
        </Grid>

        {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Diet',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Nutrition',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Routine',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid> */}

        <Grid item xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="User Roles"
            isloading={isLoading}
            chartData={[
              { label: 'Instructors', value: payload.Instructors },
              { label: 'Users', value: payload.Users },
              // { label: 'Europe', value: 1443 },
              // { label: 'Africa', value: 4443 },
            ]}
            chartColors={[
              theme.palette.primary.main,
              theme.palette.info.main,
              theme.palette.warning.main,
              theme.palette.error.main,
            ]}
          />
        </Grid>

        {/* <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid> */}

        {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid> */}

        {/* <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid> */}

        {/* <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid> */}

        <Grid item xs={12} md={6} lg={4}>
          <AppTrafficBySite
            title="Traffic by Site"
            list={[
              {
                name: 'FaceBook',
                value: 323234,
                icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
              },
              {
                name: 'Google',
                value: 341212,
                icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
              },
              {
                name: 'Apple',
                value: 411213,
                icon: <Iconify icon={'mdi:apple'} width={33} />,
              },
              // {
              //   name: 'Twitter',
              //   value: 443232,
              //   icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
              // },
            ]}
          />
        </Grid>

        {/* <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
      </Grid>
    </>
  );
}
