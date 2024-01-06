import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

import UpdatePurposeDialog from './UpdatePurposeDialog';
import RequestDetails from './RequestDetails.jsx';
import { apiUrl, apiKey } from '../utils/utils.js';

const API_ENDPOINT = `${apiUrl}request-list?subscription-key=${apiKey}`;

const SortableTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filters, setFilters] = useState({
    referenceNo: '',
    addressTo: '',
    status: '',
  });
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);

  const [showSelectedRequest, setShowSelectedRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_ENDPOINT);
        const result = await response.json();
        console.log(result);
        setData(result);
      } catch (error) {
        setError(error.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key) => {
    if (key === 'reference_no' || key === 'address_to' || key === 'purpose') {
      return; // Exclude sorting for specific columns
    }

    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    const sortedData = [...data].sort((a, b) => {
      if (key === 'issued_on') {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        if (dateA < dateB) return direction === 'ascending' ? -1 : 1;
        if (dateA > dateB) return direction === 'ascending' ? 1 : -1;
        return 0;
      } else {
        const valueA = a[key] && typeof a[key] === 'string' ? a[key] : '';
        const valueB = b[key] && typeof b[key] === 'string' ? b[key] : '';
        if (valueA < valueB) return direction === 'ascending' ? -1 : 1;
        if (valueA > valueB) return direction === 'ascending' ? 1 : -1;
        return 0;
      }
    });

    setSortConfig({ key, direction });
    setData(sortedData);
  };

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  const applyFilters = (row) => {
    if (!data.length) {
      return true;
    }

    const { referenceNo, addressTo, status } = filters;

    const valueA = row.reference_no !== undefined ? String(row.reference_no) : '';
    const referenceNoMatch = referenceNo.trim() === '' || valueA.toLowerCase() === referenceNo.toLowerCase();

    const valueB = row.status && typeof row.status === 'string' ? row.status : '';
    const statusMatch = status.trim() === '' || valueB.toLowerCase() === status.toLowerCase();

    const valueC = row.address_to && typeof row.address_to === 'string' ? row.address_to : '';
    const addressToMatch = addressTo.trim() === '' || valueC.toLowerCase().includes(addressTo.toLowerCase());

    return referenceNoMatch && statusMatch && addressToMatch;
  };

  const handleViewRequest = (row) => {
    setShowSelectedRequest(true);
    setSelectedRequest(row);
  };

  const handleOpenUpdateDialog = (row) => {
    if (row.status.toLowerCase() === 'new') {
      setSelectedRow(row);
      setUpdateDialogOpen(true);
    }
  };

  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
  };

  const handleConfirmUpdate = (updatedPurpose) => {
    // Concatenate reference_no and issued_on for a potentially unique identifier
    const uniqueIdentifier = `${selectedRow.reference_no}-${selectedRow.issued_on}`;

    // Update the data directly to reflect the change in the table
    const updatedData = data.map((row) =>
      `${row.reference_no}-${row.issued_on}` === uniqueIdentifier ? { ...row, purpose: updatedPurpose } : row,
    );
    setData(updatedData);

    handleCloseUpdateDialog();
  };

  const filteredData = data.filter(applyFilters);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div>
        <label>Reference No. Filter:</label>
        <input
          type="text"
          value={filters.referenceNo}
          onChange={(e) => handleFilterChange('referenceNo', e.target.value)}
        />
      </div>
      <div>
        <label>Address to Filter:</label>
        <input
          type="text"
          value={filters.addressTo}
          onChange={(e) => handleFilterChange('addressTo', e.target.value)}
        />
      </div>
      <div>
        <label>Status Filter:</label>
        <input type="text" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)} />
      </div>

      <br />

      <table border={1}>
        <thead>
          <tr>
            <th onClick={() => handleSort('reference_no')}>
              Reference No.{' '}
              {sortConfig.key === 'reference_no' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleSort('address_to')}>
              Address to {sortConfig.key === 'address_to' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleSort('purpose')}>Purpose</th>
            <th onClick={() => handleSort('issued_on')}>
              Issued on {sortConfig.key === 'issued_on' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleSort('status')}>
              Status {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
            <th>View</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td>{row.reference_no}</td>
              <td>{row.address_to}</td>
              <td>{row.purpose}</td>
              <td>{row.issued_on}</td>
              <td>{row.status}</td>
              <td>
                <IconButton
                  color="secondary"
                  aria-label="View request"
                  title="View request"
                  onClick={() => handleViewRequest(row)}
                >
                  <VisibilityIcon />
                </IconButton>
              </td>
              <td>
                <IconButton
                  color="secondary"
                  aria-label="Update Purpose"
                  title="Update Purpose"
                  disabled={row.status.toLowerCase() !== 'new'}
                  onClick={() => handleOpenUpdateDialog(row)}
                >
                  <EditIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <UpdatePurposeDialog
        isOpen={isUpdateDialogOpen}
        onClose={handleCloseUpdateDialog}
        onConfirm={handleConfirmUpdate}
        currentPurpose={selectedRow ? selectedRow.purpose : ''}
      />

      <RequestDetails open={showSelectedRequest} data={selectedRequest} onClose={() => setShowSelectedRequest(false)} />
    </div>
  );
};

export default SortableTable;
