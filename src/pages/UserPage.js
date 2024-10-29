import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import CircularProgress from '@mui/material/CircularProgress';

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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
// components
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { Icon } from '@iconify/react';
import closeIcon from '@iconify/icons-mdi/close'; // or another close icon
// import Modal from 'react-modal';
// import Icon from '../components/color-utils/Icon';
import { auth, db } from '../service/firebase';
import TableLoading from '../components/table-loading/tableLoading';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import { imgURL } from '../service/config';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'password', label: 'Password', alignRight: false },
  { id: 'challengeName', label: 'Challange', alignRight: false },
  { id: 'tradingAccountNumber', label: 'Trading Account Number', alignRight: false },
  { id: 'tradingServer', label: 'Trading Server', alignRight: false },
  { id: 'tradingAccountNumber', label: 'Trading Account Password', alignRight: false },
  { id: 'isLogin', label: 'Logged In ', alignRight: false },
  { id: '_id' },
];

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
  const [isLoading2, setIslaoading2] = useState(false);

  const handleOpenMenu = (event) => {
    setid(event.currentTarget.value);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setid('');
    setOpen(null);
  };
  const handledeleteUser = async () => {
    console.log('Delete User');
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
      setIslaoading(true); // Start loading
      const querySnapshot = await getDocs(collection(db, 'users')); // Fetch data from the 'Users' collection

      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Include document ID if needed
        ...doc.data(),
      }));

      console.log(userList);
      const reversedUserList = userList.reverse();

      setdata(reversedUserList);

      setIslaoading(false); // Stop loading
    } catch (error) {
      const message = error.message || error.toString();
      // console.error('Error fetching users: ', message);
      setIslaoading(false); // Stop loading even on error
    }
  };
  useEffect(() => {
    getdata();
  }, [deleteUser]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    challengeName: '',
    tradingAccountNumber: '',
    tradingPassword: '',
    tradingServer: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to create user in Firebase Auth
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, name, challengeName, tradingAccountNumber, tradingPassword, tradingServer } = formData;

    setIslaoading2(true); // Start loading
    setError(''); // Reset error

    try {
      // Create user with email and password in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        name,
        password,
        email,
        challengeName,
        tradingAccountNumber,
        tradingPassword,
        tradingServer,
        createdAt: new Date(),
      });

      // Show success toast
      toast.success('User created successfully!');
      getdata()
      setIsModalOpen(false);
      setFormData({
        email: '',
        password: '',
        name: '',
        challengeName: '',
        tradingAccountNumber: '',
        tradingPassword: '',
        tradingServer: '',
      });
    } catch (error) {
      // Map Firebase error codes to user-friendly messages
      let errorMessage;
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak. Please choose a stronger password.';
          break;
        default:
          errorMessage = 'An unexpected error occurred. Please try again.';
      }

      // Show error toast
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIslaoading2(false); // Stop loading
    }
  };

  return (
    <>
      <Helmet>
        <title> User </title>
      </Helmet>

      {/* Modal for Add User */}

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        PaperProps={{
          style: {
            // backgroundColor: '#1A202C', // Matches 'bg-gray-900'
            border: '1px solid #FAFF00',
            padding: '2rem', // Matches p-8
            width: '90%',
            maxWidth: '600px', // Matches md:w-[60%]
            borderRadius: '8px',
          },
        }}
      >
        <DialogTitle>
          <div className="flex justify-between" style={{ display: 'Flex', justifyContent: 'space-between' }}>
            <h2 className="text-2xl text-white">Add User</h2>
            <IconButton
              onClick={() => setIsModalOpen(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setIsModalOpen(false);
              }}
              edge="end"
              color="inherit"
              aria-label="close"
              tabIndex={0}
            >
              <Icon icon={closeIcon} width="24" height="24" />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent>
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {[
              'name',
              'email',
              'password',
              'challengeName',
              'tradingAccountNumber',
              'tradingPassword',
              'tradingServer',
            ].map((field) => (
              <Box key={field} mb={2}>
                {' '}
                {/* Adds spacing between fields */}
                <TextField
                  label={field.split(/(?=[A-Z])/).join(' ')} // Converts camelCase to spaced words
                  variant="outlined"
                  fullWidth
                  name={field}
                  type={field.includes('password') ? 'password' : 'text'}
                  value={formData[field]}
                  onChange={handleChange}
                  InputProps={{
                    style: {
                      borderColor: '#FAFF00',
                    },
                  }}
                  placeholder={field.split(/(?=[A-Z])/).join(' ')}
                  required
                />
              </Box>
            ))}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{ backgroundColor: '#FAFF00', color: 'black' }}
              disabled={isLoading2} // Disable button while loading
            >
              {isLoading2 ? <CircularProgress size={24} color="inherit" /> : 'Create User'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          User
        </Typography>
        <Box>
          <Button variant="contained" onClick={() => setIsModalOpen(true)}>
            Add User
          </Button>
        </Box>
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
                            <Typography variant="subtitle2" noWrap>
                              {row?.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="left">{row.password}</TableCell>

                        <TableCell align="left">{row?.challengeName}</TableCell>

                        <TableCell align="left">{row?.tradingAccountNumber}</TableCell>
                        <TableCell align="left">{row?.tradingServer}</TableCell>
                        <TableCell align="left">{row?.tradingPassword}</TableCell>

                        <TableCell align="left">{'False'}</TableCell>

                        {/* <TableCell align="left">
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu} value={row?.id}>
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
                    <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
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
            display: "flex",
            flexDirection: "column"
          },
        }}
      >
        <Button sx={{ color: 'info.main' }} onClick={() => navigate(`/dashboard/payout/${id}`)} >
          Payout
        </Button>
        <Button sx={{ color: 'info.main' }} onClick={() => navigate(`/dashboard/user/${id}`)} >
          Upload Statement
        </Button>

        <Button sx={{ color: 'error.main' }} onClick={handledeleteUser} disabled={isDeleteLoading}>
          <Iconify icon={'eva:trash-2-outline'} /> {isDeleteLoading ? 'Loading' : ' Delete'}
        </Button>
      </Popover>
    </>
  );
}
