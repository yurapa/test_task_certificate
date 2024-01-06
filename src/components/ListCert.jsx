import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { getComparator, stableSort, apiUrl, apiKey } from '../util/util.js';
import RequestDetails from './RequestDetails.jsx';

const headCells = [
  {
    id: 'reference_no',
    label: 'Reference No.',
    isSortable: false,
  },
  {
    id: 'address_to',
    label: 'Address to',
    isSortable: false,
  },
  {
    id: 'purpose',
    label: 'Purpose',
    isSortable: false,
  },
  {
    id: 'issued_on',
    label: 'Issued on',
    isSortable: true,
  },
  {
    id: 'status',
    label: 'Status',
    isSortable: true,
  },
  {
    id: 'open_link',
    label: 'Open link',
    isSortable: false,
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align="center" sortDirection={orderBy === headCell.id ? order : false}>
            {headCell.isSortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

const ListCert = () => {
  const [allRequests, setAllRequests] = useState([]);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [showSelectedRequest, setShowSelectedRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState({});

  useEffect(() => {
    fetch(`${apiUrl}request-list?subscription-key=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAllRequests(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  // useEffect(() => {
  //     try {
  //         const fetchRequests = async () => {
  //             const response = await fetch(`${apiUrl}request-list?subscription-key=${apiKey}`);
  //             const data = await response.json();
  //             console.log(data);
  //             setAllRequests(data);
  //         };
  //
  //         fetchRequests();
  //     } catch (err) {
  //         console.log(err);
  //     }
  // }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';

    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allRequests.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(allRequests, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage],
  );

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
            }}
          >
            <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
              F04 - List all relevant certificates
            </Typography>
          </Toolbar>

          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />

              <TableBody>
                {visibleRows.map((row) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.issued_on}>
                      <TableCell align="center">{row.reference_no}</TableCell>
                      <TableCell align="center">{row.address_to}</TableCell>
                      <TableCell align="center">{row.purpose}</TableCell>
                      <TableCell align="center">{row.issued_on}</TableCell>
                      <TableCell align="center">{row.status}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="secondary"
                          aria-label="add an alarm"
                          onClick={() => {
                            setShowSelectedRequest(true);
                            setSelectedRequest(row);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[3, 10, 25]}
            component="div"
            count={allRequests.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      <RequestDetails open={showSelectedRequest} data={selectedRequest} onClose={() => setShowSelectedRequest(false)} />
    </>
  );
};

export default ListCert;
