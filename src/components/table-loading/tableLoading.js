import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Skeleton,
  } from '@mui/material';
  
  import { UserListHead } from '../../sections/@dashboard/user';
  
  function TableLoading({ tableHeading }) {
    const rowCount = 10; // Set the number of rows
  
    return (
      <>
       
     
        
            <>
              {[...Array(rowCount)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {tableHeading?.map((heading, index) => (
                    <TableCell key={index}>
                      <Skeleton animation="wave" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
       
      
      </>
    );
  }
  
  export default TableLoading;
  