import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, addDoc, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Tooltip, IconButton, Popover } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { db } from '../service/firebase';

function Payout() {
  const { id } = useParams();
  console.log(id);

  const [amount, setAmount] = useState('');
  const [coinName, setCoinName] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [payouts, setPayouts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPayoutId, setSelectedPayoutId] = useState('');

  // Fetch payouts from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'payout'), (snapshot) => {
      const payoutsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPayouts(payoutsData);
    });

    return () => unsubscribe();
  }, []);



  const handlePopoverOpen = (event, payoutId) => {
    setAnchorEl(event.currentTarget);
    setSelectedPayoutId(payoutId);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedPayoutId('');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, 'payout'), {
        amount,
        coinName,
        status,
        date,
        id,
      });
      console.log('Document written with ID: ', docRef.id);
      // Clear the form
      setAmount('');
      setCoinName('');
      setStatus('');
      setDate('');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
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



  return (
    <div style={{ padding: "20px" }}>
      <h1>Payout</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <TextField
            type="number"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            variant="outlined"
            sx={{ marginRight: 2, mb: 2 }}
          />
          <TextField
            type="text"
            label="Coin Name"
            value={coinName}
            onChange={(e) => setCoinName(e.target.value)}
            required
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
        </div>
        <div>
          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            variant="outlined"
            sx={{ marginRight: 2, mb: 2, width: '22%' }}
          >
            <MenuItem value="">Select Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </TextField>
          <TextField
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ marginBottom: 2, minWidth: "22%" }}
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: '16px' }}
        >
          Add Payout
        </Button>
      </form>

    </div>
  );
}

export default Payout;
