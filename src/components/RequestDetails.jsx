import * as React from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { styled } from '@mui/material/styles';

import CertView from './CertView.jsx';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  background: 'none',
  boxShadow: 'none',
  color: theme.palette.text.secondary,
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RequestDetails({ open, onClose, data }) {
  const isCertificateIssued = !!data.issued_on;

  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Certificate
          </Typography>

          {isCertificateIssued && (
            <PDFDownloadLink
              document={<CertView {...data} />}
              fileName="certificate.pdf"
              style={{ color: '#ce93d8', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <FileDownloadIcon />
              SAVE
            </PDFDownloadLink>
          )}
        </Toolbar>
      </AppBar>

      <Grid container>
        <Grid item xs={12} sm={12} md={4}>
          <Item>
            <h3>Request info:</h3>

            {data.reference_no && <div>Reference No.: {data.reference_no}</div>}
            {data.employee_id && <div>Employee id: {data.employee_id}</div>}
            {data.purpose && <div>Purpose: {data.purpose}</div>}
            {data.address_to && <div>Address to: {data.address_to}</div>}
            {data.issued_on && data.status.toLowerCase() !== 'done' && <div>Issued on: {data.issued_on}</div>}
            {data.status && <div>Status: {data.status}</div>}
          </Item>
        </Grid>

        <Grid item xs={12} sm={12} md={8}>
          <Item>
            {isCertificateIssued ? (
              <PDFViewer width="600" height="450" showToolbar={false}>
                <CertView {...data} />
              </PDFViewer>
            ) : (
              <div>Certificate is yet to be issued.</div>
            )}
          </Item>
        </Grid>
      </Grid>
    </Dialog>
  );
}
