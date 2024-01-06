import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#E4E4E4',
    border: '1px dashed #FA0',
    color: '#333',
    margin: '20px auto',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 30,
  },
  number: {
    textAlign: 'right',
  },
});

const CertView = ({ reference_no, purpose, address_to, issued_on }) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.number}>Reference No. {reference_no}</Text>
          <Text style={styles.title}>Certificate</Text>
        </View>
        <View style={styles.section}>
          <Text>Purpose: {purpose}</Text>
          <Text>Address to: {address_to}</Text>
          <Text>Issued on: {issued_on}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default CertView;
