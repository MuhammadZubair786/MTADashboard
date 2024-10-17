import React, { useEffect, useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import { Box, Container, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { paymentData } from '../service/orderServices';



const Orders = () => {
  const [tableData, setTableData] = useState({
    paymentData: [],
    totalItems: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const PAGE_SIZE = 1000;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await paymentData(currentPage, PAGE_SIZE);
        console.log(response);
        setTableData({
          paymentData: response.data.paymentData || [],
          totalItems: response.data.totalItems || 0,
        });
      } catch (error) {
        setError(true);
        setTableData({ paymentData: [], totalItems: 0 });
        const message =
          (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        console.log(message);
        toast.error(message)
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // const customRenderer = (value)=>{
  //   return <span>{value?.renderedCellValue?.charAt(0).toUpperCase()+ value?.renderedCellValue?.slice(1)}</span>
  // }
  const columns = useMemo(
    () => [
      {
        accessorKey: 'senderID.fullName',
        // Cell: customRenderer,
        header: 'Customer',
        enableColumnActions: true,
        enableSorting: true,
        enableGlobalFilterRankedResults: false,
        size: 30,
      },
      {
        accessorKey: 'requestType',
        // Cell: customRenderer,
        header: 'Requested Plan',
        enableColumnActions: false,
        enableSorting: false,
        size: 30,
      },
      {
        accessorKey: 'receiverID.fullName',
        // Cell: customRenderer,
        header: 'Trainer ',
        enableColumnActions: false,
        enableSorting: false,

        size: 30,
      },
      {
        accessorKey: 'startDate',
        header: 'Requested Date ',
        enableColumnActions: false,
        enableSorting: false,
        size: 30,
      },
      {
        accessorKey: 'price',
        header: 'Payment',
        enableColumnActions: false,
        enableSorting: false,

        size: 30,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor: theme.palette.success.dark,
              // cell.getValue() < 50
              //   ? theme.palette.error.dark
              //   : cell.getValue() >= 50 && cell.getValue() < 100
              //   ? theme.palette.warning.dark
              //   : theme.palette.success.dark,
              borderRadius: '0.25rem',
              color: '#fff',
              maxWidth: '9ch',
              p: '0.25rem',
            })}
          >
            {cell.getValue()?.toLocaleString?.('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </Box>
        ),
      },
      {
        accessorFn: (row) =>
          `${
            row.paymentStatus === 'completed'
              ? 'Completed'
              : row.paymentStatus === 'onhold'
              ? 'On-Hold'
              : row.paymentStatus
          }`,
        accessorKey: 'paymentStatus',
        header: 'Status',
        enableColumnActions: false,
        enableSorting: false,
        size: 30,
        Cell: ({ cell }) => (
          <Box
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() === 'Completed'
                  ? theme.palette.success.dark
                  : cell.getValue() === 'On-Hold'
                  ? theme.palette.warning.dark
                  : theme.palette.error.dark,
              borderRadius: '0.25rem',
              color: '#fff',
              maxWidth: '12ch',
              p: '0.25rem',
              textAlign: 'center',
            })}
          >
            {cell.getValue()}
          </Box>
        ),
      },
      {
        accessorFn: (row) => `${row.deliveryStatus ? 'True' : 'False'}`,
        accessorKey: 'deliveryStatus',
        header: 'Delivery Status ',
        enableColumnActions: false,
        enableSorting: false,
        size: 30,
      },
    ],
    []
  );
  console.log(tableData, '$$$$$$$$$');
  return (
    <>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      {/* <Container> */}

      <Stack direction="row" alignItems="center" justifyContent="space-between" >
          <Typography variant="h4" >
          Orders
          </Typography>
        </Stack>

      <MaterialReactTable
        state={{
          isLoading,
          showAlertBanner: isError,
        }}
        columns={columns}
        data={tableData.paymentData || []}
        isSearchEnabled={false}
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: 'error',
                children: 'Error loading data',
              }
            : undefined
        }
      />
            {/* </Container> */}
    </>
  );
};

export default Orders;
