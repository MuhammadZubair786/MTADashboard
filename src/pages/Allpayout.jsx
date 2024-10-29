import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Popover, Typography } from '@mui/material';
import { db } from '../service/firebase';

function Allpayout() {
    const [payouts, setPayouts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedPayoutId, setSelectedPayoutId] = useState('');

    const [users, setUsers] = useState([])
    const [Data, setData] = useState([])
    // Fetch payouts from Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'payout'), (snapshot) => {
            const payoutsData = snapshot.docs.map((doc) => ({
                docId: doc.id,
                ...doc.data(),
            }));
            setPayouts(payoutsData);
            return payoutsData
        });

        const getAllUser = onSnapshot(collection(db, "users"), (snapshot) => {
            const users = snapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            console.log(users)
            // return users
            setUsers(users)
        })

        return () => {
            unsubscribe()
            getAllUser()
        };
    }, []);

    useEffect(() => {
        const combined = payouts.map((payout) => ({
            ...payout,
            user: users.find((user) => user.id === payout.id) || {}, // Finds matching user by userId
        }));
        console.log(combined)
        setData(combined);
    }, [users, payouts])


    const handlePopoverOpen = (event, payoutId) => {
        setAnchorEl(event.currentTarget);
        setSelectedPayoutId(payoutId);
        console.log(payoutId)
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setSelectedPayoutId('');
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const updateStatus = async (payoutId, newStatus) => {
        const payoutRef = doc(db, 'payout', payoutId);
        try {
            await updateDoc(payoutRef, { status: newStatus });
            console.log('Document updated with ID: ', payoutId);
        } catch (e) {
            console.error('Error updating document: ', e);
        }
    };

    const handleStatusChange = (status) => {
        if (selectedPayoutId) {
            updateStatus(selectedPayoutId, status);
            handlePopoverClose();
        }
    };

    const open = Boolean(anchorEl);
    const idPopover = open ? 'simple-popover' : undefined;

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ marginTop: '20px' }}>All Payouts</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User Name</TableCell>
                            <TableCell>User Email</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Coin Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    {Data.length > 0 ? (
                        <TableBody>
                            {Data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((payout) => (
                                <TableRow key={payout.id}>
                                    <TableCell>{payout?.user?.name}</TableCell>
                                    <TableCell>{payout?.user?.email}</TableCell>
                                    <TableCell>{payout.amount}</TableCell>
                                    <TableCell>{payout.coinName}</TableCell>
                                    <TableCell>
                                        <span style={{ color: "white", backgroundColor: payout.status.toLowerCase() === "pending" ? "rgb(29 129 252)" : payout.status.toLowerCase() === "rejected" ? "red" : "green", padding: "10px", borderRadius: "10px" }}>
                                            {payout.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" onClick={(e) => handlePopoverOpen(e, payout.docId)}>
                                            Change Status
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell align="center" colSpan={5} sx={{ py: 3 }}>
                                    <Paper sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6" paragraph>
                                            No Payouts to show
                                        </Typography>
                                    </Paper>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={Data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Status Change Popover */}
            <Popover
                id={idPopover}
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div style={{ padding: '10px', display: "flex", flexDirection: "column" }}>
                    <Button onClick={() => handleStatusChange('Completed')}>Completed</Button>
                    <Button onClick={() => handleStatusChange('Rejected')}>Reject</Button>
                    <Button onClick={() => handleStatusChange('Pending')}>Pending</Button>
                </div>
            </Popover>
        </div>
    );
}

export default Allpayout;
