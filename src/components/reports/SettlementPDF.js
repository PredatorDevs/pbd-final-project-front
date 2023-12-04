import { Col, Row, Table } from "antd";
import React, { useEffect } from "react";
import { TicketWrapper } from "../../styled-components/TicketWrapper";
import { Document, Page, View, Text  } from '@react-pdf/renderer';

import moment from 'moment';
import 'moment/locale/es-mx';
import { isEmpty } from "lodash";

const styles = {
  headerView: {
    margin: '2px 0px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px solid black',
    borderStyle: 'dashed',
    backgroundColor: '#f5f5f5'
  },
  rowView: {
    margin: '2px 0px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px solid black',
    borderStyle: 'dashed'
  },
  rowData: {
    margin: '2px 0px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderStyle: 'dashed'
  },
  headerText: {
    fontSize: 8, 
    color: '#000000', 
    fontWeight: 600
  },
  rowText: {
    fontSize: 8, 
    color: '#000000'
  }
}

function SettlementPDF(props) {

  const { reportData, hellNo } = props;

  useEffect(() => {
    
  }, [ hellNo ]);

  function renderHeader() {
    return (
      <View 
        style={{ marginBottom: 5, display: 'flex', flexDirection: 'row-reverse' }}
        fixed
      >
        <Text style={{ fontSize: 8, color: '#8c8c8c' }}>{`Planta Procesadora Agua El Limón`}</Text>
      </View>
    )
  }

  function renderFooter() {
    return (
      <View 
        style={{ marginTop: 5, display: 'flex', flexDirection: 'row-reverse' }}
        fixed
        render={({ pageNumber }) => (
          <Text style={{ fontSize: 8, color: '#8c8c8c' }}>
            {`Generado el: ${moment().format('LL')} a las ${moment().format('LT')} - Página ${pageNumber}`}
          </Text>
      )} />
    )
  }

  function renderStockHeader() {
    return (
      <View style={styles.headerView}>
        <Text style={{ ...styles.headerText, width: '30%' }}>{`Concepto`}</Text>
        <Text style={{ ...styles.headerText, width: '10%', textAlign: 'right' }}>{`Garrafa`}</Text>
        <Text style={{ ...styles.headerText, width: '10%', textAlign: 'right' }}>{`Galón`}</Text>
        <Text style={{ ...styles.headerText, width: '10%', textAlign: 'right' }}>{`Litro`}</Text>
        <Text style={{ ...styles.headerText, width: '10%', textAlign: 'right' }}>{`600 ml`}</Text>
        <Text style={{ ...styles.headerText, width: '10%', textAlign: 'right' }}>{`Fardo`}</Text>
        <Text style={{ ...styles.headerText, width: '20%', textAlign: 'right' }}>{``}</Text>
      </View>
    )
  }

  function renderGeneralSummaryHeader() {
    return (
      <View style={{ ...styles.headerView, width: '50%' }}>
        <Text style={{ ...styles.headerText, width: '60%' }}>{`Concepto`}</Text>
        <Text style={{ ...styles.headerText, width: '40%', textAlign: 'right' }}>{`Monto`}</Text>
      </View>
    )
  }

  function renderSalesSummaryHeader() {
    return (
      <View style={styles.headerView}>
        <Text style={{ ...styles.headerText, width: '6%' }}>{`Factura`}</Text>
        <Text style={{ ...styles.headerText, width: '18%' }}>{`Cliente`}</Text>
        <Text style={{ ...styles.headerText, width: '8%', textAlign: 'right' }}>{`Garrafa`}</Text>
        <Text style={{ ...styles.headerText, width: '8%', textAlign: 'right' }}>{`Galón`}</Text>
        <Text style={{ ...styles.headerText, width: '8%', textAlign: 'right' }}>{`Litro`}</Text>
        <Text style={{ ...styles.headerText, width: '8%', textAlign: 'right' }}>{`600 ml`}</Text>
        <Text style={{ ...styles.headerText, width: '8%', textAlign: 'right' }}>{`Fardo`}</Text>
        <Text style={{ ...styles.headerText, width: '8%', textAlign: 'right' }}>{`Oasis`}</Text>
        <Text style={{ ...styles.headerText, width: '8%', textAlign: 'right' }}>{`Rep. Oasis`}</Text>
        <Text style={{ ...styles.headerText, width: '10%', textAlign: 'right' }}>{`Contado`}</Text>
        <Text style={{ ...styles.headerText, width: '10%', textAlign: 'right' }}>{`Crédito`}</Text>
      </View>
    )
  }

  function renderPaymentsSummaryHeader() {
    return (
      <View style={styles.headerView}>
        <Text style={{ ...styles.headerText, width: '10%' }}>{`Factura`}</Text>
        <Text style={{ ...styles.headerText, width: '20%' }}>{`Fecha`}</Text>
        <Text style={{ ...styles.headerText, width: '45%' }}>{`Cliente`}</Text>
        <Text style={{ ...styles.headerText, width: '25%', textAlign: 'right' }}>{`Monto`}</Text>
      </View>
    )
  }

  function renderReportRow(rowData, index) {
    return (
      <View 
        key={index}
        style={{
          ...styles.rowData,
          borderBottom: rowData.saleDocNumber ? '1px solid white' : '1px solid black',
          backgroundColor: (index % 2 === 0) ? '#FFFFFF' : '#f5f5f5'
        }}
      >
        <Text style={{ ...styles.rowText, width: '6%' }}>{`${rowData.saleDocNumber || ''}`}</Text>
        <Text style={{ ...styles.rowText, width: '18%' }}>{`${rowData.customerFullname || ''}`}</Text>
        <Text style={{ ...styles.rowText, width: '8%', textAlign: 'right' }}>{`${rowData.garrafon || ''}`}</Text>
        <Text style={{ ...styles.rowText, width: '8%', textAlign: 'right' }}>{`${rowData.galon || ''}`}</Text>
        <Text style={{ ...styles.rowText, width: '8%', textAlign: 'right' }}>{`${rowData.litro || ''}`}</Text>
        <Text style={{ ...styles.rowText, width: '8%', textAlign: 'right' }}>{`${rowData.botella || ''}`}</Text>
        <Text style={{ ...styles.rowText, width: '8%', textAlign: 'right' }}>{`${rowData.fardo || ''}`}</Text>
        <Text style={{ ...styles.rowText, width: '8%', textAlign: 'right' }}>{`${rowData.fardo || ''}`}</Text>
        <Text style={{ ...styles.rowText, width: '8%', textAlign: 'right' }}>{`${rowData.fardo || ''}`}</Text>
        <Text style={{ ...styles.rowText, width: '10%', textAlign: 'right' }}>{`${rowData.cashSale || ''}`}</Text>
        <Text style={{ ...styles.rowText, width: '10%', textAlign: 'right' }}>{`${rowData.creditSale || ''}`}</Text>
      </View>
    )
  }

  function renderReportFooterSection(totalConcept, arrayIndex) {
    return (
      <View style={styles.rowView}>
        <Text style={{ ...styles.rowText, width: '6%' }}>{``}</Text>
        <Text style={{ ...styles.rowText, width: '18%' }}>{`${totalConcept}`}</Text>
        <Text style={{ ...styles.rowText, width: '8%', textAlign: 'right' }}>{`${getSumOfReportColumn(arrayIndex, 'garrafon')}`}</Text>
        <Text style={{ ...styles.rowText, width: '8%', textAlign: 'right' }}>{`${getSumOfReportColumn(arrayIndex, 'galon')}`}</Text>
        <Text style={{ ...styles.rowText, width: '8%', textAlign: 'right' }}>{`${getSumOfReportColumn(arrayIndex, 'litro')}`}</Text>
        <Text style={{ ...styles.rowText, width: '8%', textAlign: 'right' }}>{`${getSumOfReportColumn(arrayIndex, 'botella')}`}</Text>
        <Text style={{ ...styles.rowText, width: '8%', textAlign: 'right' }}>{`${getSumOfReportColumn(arrayIndex, 'fardo')}`}</Text>
        <Text style={{ ...styles.rowText, width: '8%', textAlign: 'right' }}>{`${getSumOfReportColumn(arrayIndex, 'fardo')}`}</Text>
        <Text style={{ ...styles.rowText, width: '8%', textAlign: 'right' }}>{`${getSumOfReportColumn(arrayIndex, 'fardo')}`}</Text>
        <Text style={{ ...styles.rowText, width: '10%', textAlign: 'right' }}>{`${getSumOfReportColumn(arrayIndex, 'cashSale')}`}</Text>
        <Text style={{ ...styles.rowText, width: '10%', textAlign: 'right' }}>{`${getSumOfReportColumn(arrayIndex, 'creditSale')}`}</Text>
      </View>
    )
  }

  function getSumOfReportColumn(arrayIndex, propertyName) {
    if (isEmpty(reportData[arrayIndex])) return Number("0").toFixed(2)
    else {
      let value = 0;
      for (let i = 0; i < reportData[arrayIndex].length; i++) {
        const { saleId } = reportData[arrayIndex][i];
        if (saleId !== null) value += +(reportData[arrayIndex][i][propertyName]);
      }
      return Number(value).toFixed(2);
    }
  }

  return (
    <Document>
      <Page size={'LETTER'} style={{ padding: '55px 40px 20px 30px' }} orientation={'landscape'}>
        {renderHeader()}
        {
          (reportData[0] || []).map((element, index) => (
            <View 
              key={index}
              style={{
                marginTop: 5,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Text style={{ fontSize: 7, color: '#8c8c8c' }}>{`Internal code ${element.shiftcutId}`}</Text>
              <Text style={{ fontSize: 14, color: '#000000' }}>{`Liquidación #${element.shiftcutNumber}`}</Text>
              <Text style={{ fontSize: 12, color: '#000000', marginTop: 3 }}>{element.locationName}</Text>
              <Text style={{ fontSize: 10, color: '#000000' }}>{element.locationAddress}</Text>
              <Text style={{ fontSize: 8.5, color: '#000000', marginTop: 3 }}>
                {`Apertura por ${element.openedByFullname} el ${moment(element.openedAt).format('LL')} a las ${moment(element.openedAt).format('LT')}`}
              </Text>
              <Text style={{ fontSize: 8.5, color: '#000000', marginTop: 3 }}>
                {`Cierre por ${element.closedByFullname} el ${moment(element.shiftcutDatetime).format('LL')} a las ${moment(element.shiftcutDatetime).format('LT')}`}
              </Text>
            </View>
          ))
        }
        <Text style={{ fontSize: 12, color: '#000000', marginTop: 5, marginBottom: 5 }}>
          {''}
        </Text>
        {renderStockHeader()}
        {
          (reportData[1] || []).map((element, index) => (
              <View key={index} style={styles.rowView}>
                <Text style={{ fontSize: 9, color: '#000000', width: '30%' }}>
                  {`${element.concept || ''}`}
                </Text>
                <Text style={{ fontSize: 9, color: '#000000', width: '10%', textAlign: 'right' }}>
                  {`${element.garrafon || ''}`}
                </Text>
                <Text style={{ fontSize: 9, color: '#000000', width: '10%', textAlign: 'right' }}>
                  {`${element.galon || ''}`}
                </Text>
                <Text style={{ fontSize: 9, color: '#000000', width: '10%', textAlign: 'right' }}>
                  {`${element.litro || ''}`}
                </Text>
                <Text style={{ fontSize: 9, color: '#000000', width: '10%', textAlign: 'right' }}>
                  {`${element.botella || ''}`}
                </Text>
                <Text style={{ fontSize: 9, color: '#000000', width: '10%', textAlign: 'right' }}>
                  {`${element.fardo || ''}`}
                </Text>
                <Text style={{ fontSize: 9, color: '#000000', width: '20%', textAlign: 'right' }}>
                  {``}
                </Text>
              </View>
            )
          )
        }
        <Text style={{ fontSize: 10, color: '#000000', marginTop: 10, marginBottom: 5 }}>
          {`Movimientos`}
        </Text>
        {renderSalesSummaryHeader()}
        {(reportData[2] || []).map((element, index) => (renderReportRow(element, index)))}
        {renderReportFooterSection('TOTAL MOVIMIENTOS', 2)}
        {
          isEmpty(reportData[3]) ? <></> : <>
            <Text style={{ fontSize: 10, color: '#000000', marginTop: 10, marginBottom: 5 }}>
              {`Traslados`}
            </Text>
            {renderSalesSummaryHeader()}
            {(reportData[3] || []).map((element, index) => (renderReportRow(element, index)))}
            {renderReportFooterSection('TOTAL TRASLADOS', 3)}
          </>
        }
        {
          isEmpty(reportData[4]) ? <></> : <>
            <Text style={{ fontSize: 10, color: '#000000', marginTop: 10, marginBottom: 5 }}>
              {`Devoluciones/Ventas`}
            </Text>
            {renderSalesSummaryHeader()}
            {(reportData[4] || []).map((element, index) => (renderReportRow(element, index)))}
            {renderReportFooterSection('TOTAL DEVOLUCIONES/VENTAS', 4)}
          </>
        }
        {
          isEmpty(reportData[5]) ? <></> : <>
            <Text style={{ fontSize: 10, color: '#000000', marginTop: 10, marginBottom: 5 }}>
              {`Patrocinios`}
            </Text>
            {renderSalesSummaryHeader()}
            {(reportData[5] || []).map((element, index) => (renderReportRow(element, index)))}
            {renderReportFooterSection('TOTAL PATROCINIOS', 5)}
          </>
        }
        {
          isEmpty(reportData[6]) ? <></> : <>
            <Text style={{ fontSize: 10, color: '#000000', marginTop: 10, marginBottom: 5 }}>
              {`Donaciones`}
            </Text>
            {renderSalesSummaryHeader()}
            {(reportData[6] || []).map((element, index) => (renderReportRow(element, index)))}
            {renderReportFooterSection('TOTAL DONACIONES', 6)}
          </>
        }
        {
          isEmpty(reportData[7]) ? <></> : <>
            <Text style={{ fontSize: 10, color: '#000000', marginTop: 10, marginBottom: 5 }}>
              {`Regalías`}
            </Text>
            {renderSalesSummaryHeader()}
            {(reportData[7] || []).map((element, index) => (renderReportRow(element, index)))}
            {renderReportFooterSection('TOTAL REGALÍAS', 7)}
          </>
        }
        {
          isEmpty(reportData[8]) ? <></> : <>
            <Text style={{ fontSize: 10, color: '#000000', marginTop: 10, marginBottom: 5 }}>
              {`Consumo Interno`}
            </Text>
            {renderSalesSummaryHeader()}
            {(reportData[8] || []).map((element, index) => (renderReportRow(element, index)))}
            {renderReportFooterSection('TOTAL CONSUMO INTERNO', 8)}
          </>
        }
        {
          isEmpty(reportData[9]) ? <></> : <>
            <Text style={{ fontSize: 10, color: '#000000', marginTop: 10, marginBottom: 5 }}>
              {`Averías/Descartes`}
            </Text>
            {renderSalesSummaryHeader()}
            {(reportData[9] || []).map((element, index) => (renderReportRow(element, index)))}
            {renderReportFooterSection('TOTAL AVERÍAS/DESCARTES', 9)}
          </>
        }
        {
          isEmpty(reportData[10]) ? <></> : <>
            <Text style={{ fontSize: 10, color: '#000000', marginTop: 10, marginBottom: 5 }}>
              {`Muestras`}
            </Text>
            {renderSalesSummaryHeader()}
            {(reportData[10] || []).map((element, index) => (renderReportRow(element, index)))}
            {renderReportFooterSection('TOTAL MUESTRAS', 10)}
          </>
        }
        <Text style={{ fontSize: 12, color: '#000000', marginTop: 5, marginBottom: 5 }}>
          {''}
        </Text>
        {renderStockHeader()}
        {
          (reportData[11] || []).map((element, index) => (
              <View key={index} style={styles.rowView}>
                <Text style={{ fontSize: 9, color: '#000000', width: '30%' }}>
                  {`${element.concept || ''}`}
                </Text>
                <Text style={{ fontSize: 9, color: '#000000', width: '10%', textAlign: 'right' }}>
                  {`${element.garrafon || ''}`}
                </Text>
                <Text style={{ fontSize: 9, color: '#000000', width: '10%', textAlign: 'right' }}>
                  {`${element.galon || ''}`}
                </Text>
                <Text style={{ fontSize: 9, color: '#000000', width: '10%', textAlign: 'right' }}>
                  {`${element.litro || ''}`}
                </Text>
                <Text style={{ fontSize: 9, color: '#000000', width: '10%', textAlign: 'right' }}>
                  {`${element.botella || ''}`}
                </Text>
                <Text style={{ fontSize: 9, color: '#000000', width: '10%', textAlign: 'right' }}>
                  {`${element.fardo || ''}`}
                </Text>
                <Text style={{ fontSize: 9, color: '#000000', width: '10%', textAlign: 'right' }}>
                  {`${element.cashSale || ''}`}
                </Text>
                <Text style={{ fontSize: 9, color: '#000000', width: '10%', textAlign: 'right' }}>
                  {`${element.creditSale || ''}`}
                </Text>
              </View>
            )
          )
        }

        <Text style={{ fontSize: 10, color: '#000000', marginTop: 10, marginBottom: 5 }}>
          {`Recuperación de crédito`}
        </Text>
        {renderPaymentsSummaryHeader()}
        {
          (reportData[12] || []).map((element, index) => (
            <View key={index} style={styles.rowView}> 
              <Text style={{ ...styles.headerText, width: '10%' }}>
                {`${element.saleId || ''}`}
              </Text>
              <Text style={{ ...styles.headerText, width: '20%' }}>
                {`${element.saleDocDatetime || ''}`}
              </Text>
              <Text style={{ ...styles.headerText, width: '45%' }}>
                {`${element.customerFullname || ''}`}
              </Text>
              <Text style={{ ...styles.headerText, width: '25%', textAlign: 'right' }}>
                {`${element.totalPaid || 0}`}
              </Text>
            </View>
            )
          )
        }
        <Text style={{ fontSize: 10, color: '#000000', marginTop: 10, marginBottom: 5 }}>
          {`Resumen General`}
        </Text>
        {renderGeneralSummaryHeader()}
        {
          (reportData[13] || []).map((element, index) => (
              <View key={index} style={{ ...styles.rowView, width: '50%' }}>
                <Text style={{ fontSize: 9, color: '#000000', width: '60%' }}>
                  {`${element.movementType}`}
                </Text>
                <Text style={{ fontSize: 9, color: '#000000', width: '40%', textAlign: 'right' }}>
                  {`${element.totalAmount || 0.00}`}
                </Text>
              </View>
            )
          )
        }
        {renderFooter()}
      </Page>
    </Document>
  )
}

export default SettlementPDF;
