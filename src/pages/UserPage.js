import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';

import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Box,
  Switch,
  Skeleton,
} from '@mui/material';
// components
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import TableLoading from '../components/table-loading/tableLoading';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
// import USERLIST from '../_mock/user';
import { deleteSelectedUser, getUsers } from '../service/user.service';

import { imgURL } from '../service/config';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'profile.image.file', label: 'Image', alignRight: false },
  { id: 'profile.fullName', label: 'Name', alignRight: false },
  { id: 'isCompleteProfile', label: 'Role', alignRight: false },
  { id: 'userType', label: 'Profile Complete', alignRight: false },
  { id: 'status', label: 'Posts', alignRight: false },
  { id: '_id' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.profile?.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string?.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}
export default function UserPage() {
  const navigate = useNavigate();
  const [id, setid] = useState('');
  const [open, setOpen] = useState(null);
  const [data, setdata] = useState([]);

  const [deleteUser, setdeletedUser] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isLoading, setIslaoading] = useState(false);

  const handleOpenMenu = (event) => {
    setid(event.currentTarget.value);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setid('');
    setOpen(null);
  };
  const handledeleteUser = async () => {
    try {
      setIsDeleteLoading(true);
      const deletedata = await deleteSelectedUser(id);
      if (deletedata.message === 'Unauthorized') {
        localStorage.setItem('token', '');
        navigate('/');
      }
      if (deletedata.status === true) {
        toast.success('User Deleted Successfully');
        handleCloseMenu();
      }
      getdata();
      setIsDeleteLoading(false);
    } catch (error) {
      setIsDeleteLoading(false);
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      console.log(message);
      toast.error(message);
      handleCloseMenu();
    }
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  // const userdata = useSelector((state) => state.userListState);
  const getdata = async () => {
    try {
      setIslaoading(true);
      const user = [
        {
          _id: '6707b4ed56c8206a003c7f51',
          identifier: '$2b$12$OSHUicJPx99s9FVWucVZKuNqjLitmJUGyzZUOWzN867Yk4ecg8j6O',
          password: '$2b$12$OSHUicJPx99s9FVWucVZKu8W761kJSOBJJbF/eNmDmRZfYj0yj9fO',
          userType: 'Customer',
          devices: ['66a725c9cbf740f66ca5eedb', '67061e76d0026a998639e3e4'],
          loggedOutDevices: ['67078f5446fe1f164eea60df'],
          notificationOn: true,
          socialType: null,
          isDeleted: false,
          blockedMeUsers: [],
          blockedUsers: [],
          isCompleteProfile: true,
          isVerify: true,
          reportUsers: [],
          createdAt: '2024-10-10T11:05:17.364Z',
          updatedAt: '2024-10-11T13:09:13.111Z',
          __v: 0,
          OTP: '6707b4ee56c8206a003c7f53',
          profile: {
            _id: '6707b4ee56c8206a003c7f55',
            fullName: 'Jacob',
            auth: '6707b4ed56c8206a003c7f51',
            age: 23,
            bio: 'new',
            post: ['6707b72456c8206a003c816f'],
            follower: [
              {
                _id: '66be175ef38438bb6948e1b9',
                identifier: '$2b$12$OSHUicJPx99s9FVWucVZKufLiFWMuJEWKpgqrV/KBwx7sXzdNipXG',
                password: '$2b$12$OSHUicJPx99s9FVWucVZKu8W761kJSOBJJbF/eNmDmRZfYj0yj9fO',
                userType: 'Customer',
                devices: ['66be1760f8a9ad2071e2a36f', '67078f5446fe1f164eea60df'],
                loggedOutDevices: ['66a724cdcbf740f66ca3c4cf', '66a725c9cbf740f66ca5eedb', '67061e76d0026a998639e3e4'],
                notificationOn: true,
                socialType: null,
                isDeleted: false,
                blockedMeUsers: [],
                blockedUsers: [],
                isCompleteProfile: true,
                isVerify: true,
                reportUsers: [],
                createdAt: '2024-08-15T14:57:34.351Z',
                updatedAt: '2024-10-11T13:09:12.725Z',
                __v: 0,
                OTP: null,
                profile: '66be175ff38438bb6948e1bd',
              },
            ],
            following: [],
            createdAt: '2024-10-10T11:05:18.668Z',
            updatedAt: '2024-10-11T12:14:22.634Z',
            __v: 0,
            hobies: 'new',
            image: {
              _id: '6707b51d56c8206a003c7f6a',
              file: '4-1728558365098.jpg',
              fileType: 'Image',
              fileRole: 'image',
              userType: 'Customer',
              user: '6707b4ee56c8206a003c7f55',
              createdAt: '2024-10-10T11:06:05.104Z',
              updatedAt: '2024-10-10T11:06:05.104Z',
              __v: 0,
            },
            song: 'new',
          },
        },
        {
          _id: '6707b54b56c8206a003c7f7f',
          identifier: '$2b$12$OSHUicJPx99s9FVWucVZKuwMhygIGvmcFwF6lq4GTC4XrGiLzSCbi',
          password: '$2b$12$OSHUicJPx99s9FVWucVZKu8W761kJSOBJJbF/eNmDmRZfYj0yj9fO',
          userType: 'Instructor',
          devices: [],
          loggedOutDevices: ['67061e76d0026a998639e3e4'],
          notificationOn: true,
          socialType: null,
          isDeleted: false,
          blockedMeUsers: [],
          blockedUsers: [],
          isCompleteProfile: true,
          isVerify: true,
          reportUsers: [],
          createdAt: '2024-10-10T11:06:51.112Z',
          updatedAt: '2024-10-11T12:09:06.003Z',
          __v: 0,
          OTP: '6707b54b56c8206a003c7f81',
          profile: {
            _id: '6707b54c56c8206a003c7f83',
            fullName: 'Elias',
            auth: '6707b54b56c8206a003c7f7f',
            age: 23,
            certificate: ['6707b57656c8206a003c7f99'],
            dietRate: 120,
            routineRate: 100,
            stripeConnected: false,
            post: [],
            follower: [],
            following: [],
            createdAt: '2024-10-10T11:06:52.482Z',
            updatedAt: '2024-10-10T11:53:20.881Z',
            __v: 0,
            address: 'tesat',
            bio: 'twast',
            experience: 'test',
            image: {
              _id: '6707b57656c8206a003c7f98',
              file: '4-1728558454704.jpg',
              fileType: 'Image',
              fileRole: 'image',
              userType: 'Instructor',
              user: '6707b54c56c8206a003c7f83',
              createdAt: '2024-10-10T11:07:34.718Z',
              updatedAt: '2024-10-10T11:07:34.718Z',
              __v: 0,
            },
            skills: 'test',
            workingAt: 'testtes',
          },
        },
        {
          _id: '670e92efb65e95c0d114bd00',
          identifier: '$2b$12$OSHUicJPx99s9FVWucVZKuZR26gmPU2ly7ZiyiK2ekNKE5iuz6jse',
          password: '$2b$12$OSHUicJPx99s9FVWucVZKucit/o3MPg.gkC/SpHQ17MrA8fmY9l/m',
          userType: 'Instructor',
          devices: ['670e92f177e1dd5f335fc36c'],
          loggedOutDevices: [],
          notificationOn: true,
          socialType: null,
          isDeleted: false,
          blockedMeUsers: [],
          blockedUsers: [],
          isCompleteProfile: true,
          isVerify: true,
          reportUsers: [],
          createdAt: '2024-10-15T16:06:07.567Z',
          updatedAt: '2024-10-15T16:07:05.285Z',
          __v: 0,
          OTP: '670e92f0b65e95c0d114bd02',
          profile: {
            _id: '670e92f0b65e95c0d114bd04',
            fullName: 'Trainer103',
            auth: '670e92efb65e95c0d114bd00',
            age: 30,
            certificate: ['670e9329b65e95c0d114bd19', '670e9329b65e95c0d114bd1a'],
            dietRate: 20,
            routineRate: 30,
            stripeConnected: false,
            post: [
              '670e9849b65e95c0d114bfba',
              '670e9d14b65e95c0d114ca19',
              '670e9d30b65e95c0d114ca39',
              '670e9d5fb65e95c0d114ca5a',
            ],
            follower: [],
            following: [],
            createdAt: '2024-10-15T16:06:08.921Z',
            updatedAt: '2024-10-15T16:50:40.134Z',
            __v: 0,
            address: 'test',
            bio: 'test',
            experience: '2',
            image: {
              _id: '670e9329b65e95c0d114bd18',
              file: '098b618f-2152-4f1c-bbba-0207a13912504173602957782588029-1729008423907.jpg',
              fileType: 'Image',
              fileRole: 'image',
              userType: 'Instructor',
              user: '670e92f0b65e95c0d114bd04',
              createdAt: '2024-10-15T16:07:05.091Z',
              updatedAt: '2024-10-15T16:07:05.091Z',
              __v: 0,
            },
            skills: 'test',
            workingAt: 'test',
            routine: '670e965ab65e95c0d114bda8',
            dietplane: '670e978eb65e95c0d114be87',
          },
        },
        {
          _id: '670ea002b65e95c0d114d33f',
          devices: ['670ea00377e1dd5f337d647c'],
          loggedOutDevices: [],
          notificationOn: true,
          socialType: 'google',
          isDeleted: false,
          blockedMeUsers: [],
          blockedUsers: [],
          isCompleteProfile: true,
          isVerify: false,
          reportUsers: [],
          identifier: '$2b$12$OSHUicJPx99s9FVWucVZKui1MiZqhAuLL8Kde2VEko8XFdtgrJ6IS',
          userType: 'Instructor',
          createdAt: '2024-10-15T17:01:54.490Z',
          updatedAt: '2024-10-15T17:02:28.928Z',
          __v: 0,
          profile: {
            _id: '670ea003b65e95c0d114d344',
            fullName: 'Tommy Robert Jr.',
            auth: '670ea002b65e95c0d114d33f',
            age: 2,
            certificate: ['670ea024b65e95c0d114d34f'],
            dietRate: 20,
            routineRate: 30,
            stripeConnected: false,
            post: [],
            follower: [],
            following: [],
            createdAt: '2024-10-15T17:01:55.634Z',
            updatedAt: '2024-10-15T17:03:29.845Z',
            __v: 0,
            address: 'test',
            bio: 'test',
            experience: '2',
            image: {
              _id: '670ea024b65e95c0d114d34e',
              file: '45174525-537f-4de2-b123-2b3b278a0bf13093050785059029481-1729011747226.jpg',
              fileType: 'Image',
              fileRole: 'image',
              userType: 'Instructor',
              user: '670ea003b65e95c0d114d344',
              createdAt: '2024-10-15T17:02:28.729Z',
              updatedAt: '2024-10-15T17:02:28.729Z',
              __v: 0,
            },
            skills: 'test',
            workingAt: 'test',
          },
        },
        {
          _id: '670f6ea8b65e95c0d114e1ef',
          devices: ['670f6ea977e1dd5f33303bb5'],
          loggedOutDevices: [],
          notificationOn: false,
          socialType: 'google',
          isDeleted: false,
          blockedMeUsers: [],
          blockedUsers: [],
          isCompleteProfile: true,
          isVerify: false,
          reportUsers: [],
          identifier: '$2b$12$OSHUicJPx99s9FVWucVZKuNVZ9Rn.NdrqCASEOCuG3ZNHRVG7vEC2',
          userType: 'Customer',
          createdAt: '2024-10-16T07:43:36.517Z',
          updatedAt: '2024-10-17T07:12:26.332Z',
          __v: 0,
          profile: {
            _id: '670f6ea9b65e95c0d114e1f4',
            fullName: 'jack beck',
            auth: '670f6ea8b65e95c0d114e1ef',
            age: 23,
            bio: '23',
            post: [],
            follower: [],
            following: [],
            createdAt: '2024-10-16T07:43:37.604Z',
            updatedAt: '2024-10-17T07:25:57.738Z',
            __v: 0,
            hobies: '23',
            image: {
              _id: '670f6eb6b65e95c0d114e20d',
              file: 'image_2024_01_02T21_07_01_366Z-1729064630807.png',
              fileType: 'Image',
              fileRole: 'image',
              userType: 'Customer',
              user: '670f6ea9b65e95c0d114e1f4',
              createdAt: '2024-10-16T07:43:50.998Z',
              updatedAt: '2024-10-16T07:43:50.998Z',
              __v: 0,
            },
            song: '23',
            dietplane: '6710bc05b65e95c0d114f698',
          },
        },
        {
          _id: '670fae6db65e95c0d114e661',
          devices: ['670fae6d77e1dd5f33c564aa'],
          loggedOutDevices: [],
          notificationOn: true,
          socialType: 'google',
          isDeleted: false,
          blockedMeUsers: [],
          blockedUsers: [],
          isCompleteProfile: true,
          isVerify: false,
          reportUsers: [],
          identifier: '$2b$12$OSHUicJPx99s9FVWucVZKu0vSZQL9Ek3wLNK0MURhGBndLEjAx7h2',
          userType: 'Instructor',
          createdAt: '2024-10-16T12:15:41.078Z',
          updatedAt: '2024-10-16T12:31:48.177Z',
          __v: 0,
          profile: {
            _id: '670fae6eb65e95c0d114e666',
            fullName: 'Paulina Patrova',
            auth: '670fae6db65e95c0d114e661',
            age: 20,
            certificate: ['670fae95b65e95c0d114e682', '670fae95b65e95c0d114e683'],
            dietRate: 20,
            routineRate: 30,
            stripeConnected: false,
            post: [],
            follower: [
              {
                _id: '665d8296ef23b647b481e015',
                identifier: '$2b$12$OSHUicJPx99s9FVWucVZKuV3lK9FGUXmLv6urVRuy0CYU0VWJvk4K',
                password: '$2b$12$OSHUicJPx99s9FVWucVZKu8W761kJSOBJJbF/eNmDmRZfYj0yj9fO',
                userType: 'Customer',
                devices: ['670faedd77e1dd5f33c68279'],
                loggedOutDevices: [
                  '665d855c4ea20e442e938661',
                  '665d82984ea20e442e8ceb9e',
                  '6660638b6233d900449267b7',
                  '670f52c377e1dd5f33efae05',
                ],
                notificationOn: true,
                socialType: null,
                isDeleted: false,
                blockedMeUsers: ['665d81ebef23b647b481dfbf'],
                blockedUsers: [],
                isCompleteProfile: true,
                isVerify: true,
                reportUsers: [],
                createdAt: '2024-06-03T08:45:10.502Z',
                updatedAt: '2024-10-16T12:17:33.332Z',
                __v: 0,
                OTP: '665d8297ef23b647b481e017',
                profile: '665d8297ef23b647b481e019',
              },
            ],
            following: [],
            createdAt: '2024-10-16T12:15:42.146Z',
            updatedAt: '2024-10-16T12:32:36.030Z',
            __v: 0,
            address: 'test',
            bio: 'test',
            experience: '2',
            image: {
              _id: '670fae95b65e95c0d114e681',
              file: '75f8a204-8cdd-4cc9-aa0a-5246eb857f4a6326879692963075693-1729080975915.jpg',
              fileType: 'Image',
              fileRole: 'image',
              userType: 'Instructor',
              user: '670fae6eb65e95c0d114e666',
              createdAt: '2024-10-16T12:16:21.239Z',
              updatedAt: '2024-10-16T12:16:21.239Z',
              __v: 0,
            },
            skills: 'test test',
            workingAt: 'test',
            dietplane: '670faf77b65e95c0d114e8e9',
          },
        },
      ];
      setIslaoading(false);
      setdata(user);
    } catch (error) {
      //   const message =
      //     (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      //   console.log(message);
      //   toast.error(message);
      //   setIslaoading(false);
    }
  };
  useEffect(() => {
    getdata();
  }, [deleteUser]);

  return (
    <>
      <Helmet>
        <title> User </title>
      </Helmet>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          User
        </Typography>
        <Box component={'div'}>
          <Typography variant="p" gutterBottom>
            Deleted Users
          </Typography>
          <Switch
            checked={deleteUser}
            onChange={() => {
              setdeletedUser(!deleteUser);
            }}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Box>
        {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button> */}
      </Stack>

      <Card>
        <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={data.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />

              <TableBody>
                {isLoading ? <TableLoading tableHeading={TABLE_HEAD} /> : ''}
                <>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    // const { _id, name, role, status, company, avatarUrl, isVerified } = row;
                    const selectedUser = selected.indexOf(row._id) !== -1;

                    return (
                      <TableRow hover key={row._id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, row._id)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {row.profile?.image?.file ? (
                              <Box
                                sx={{ width: 40, height: 40, borderRadius: '50px', margin: '12px' }}
                                component="img"
                                alt={row.profile?.fullName}
                                src={imgURL + row.profile?.image?.file}
                              />
                            ) : (
                              <Avatar
                                style={{ margin: '12px' }}
                                sx={{
                                  bgcolor: stringToColor(row.profile?.fullName),
                                }}
                                children={
                                  row.profile?.fullName.split(' ').length > 1
                                    ? `${row.profile?.fullName.split(' ')[0][0]}${
                                        row.profile.fullName.split(' ')[1][0]
                                      }`
                                    : `${row.profile?.fullName.split(' ')[0][0]}`
                                }
                              />
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {row.profile?.fullName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{row.userType}</TableCell>

                        <TableCell align="left">{row.isCompleteProfile ? 'Complete' : 'Pending'}</TableCell>

                        <TableCell align="left">{row.profile?.post?.length}</TableCell>

                        {/* <TableCell align="left">
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu} value={row?.profile?._id}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </>
              </TableBody>

              {isNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <Paper
                        sx={{
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="h6" paragraph>
                          Not found
                        </Typography>

                        <Typography variant="body2">
                          No results found for &nbsp;
                          <strong>&quot;{filterName}&quot;</strong>.
                          <br /> Try checking for typos or using complete words.
                        </Typography>
                      </Paper>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}

              {!isLoading && data?.length === 0 && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <Paper
                        sx={{
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="h6" paragraph>
                          No User Found
                        </Typography>
                      </Paper>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,

            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        {/* <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem> */}

        <Button sx={{ color: 'error.main' }} onClick={handledeleteUser} disabled={isDeleteLoading}>
          <Iconify icon={'eva:trash-2-outline'} /> {isDeleteLoading ? 'Loading' : ' Delete'}
        </Button>
      </Popover>
    </>
  );
}
