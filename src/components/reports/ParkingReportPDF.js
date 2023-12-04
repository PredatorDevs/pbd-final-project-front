import { Col, Row, Table } from "antd";
import React, { useEffect } from "react";
import { TicketWrapper } from "../../styled-components/TicketWrapper";
import { Document, Page, View, Text  } from '@react-pdf/renderer';

import moment from 'moment';
import 'moment/locale/es-mx';
import { isEmpty } from "lodash";
import { getUserLocationName } from "../../utils/LocalData";

function ParkingReportPDF(props) {
  const {
    incomesData,
    expensesData,
    incomesTotal,
    expensesTotal,
    startDate,
    finalDate
  } = props;

  console.log("REPORT START DATE: ", startDate,
    "REPORT END DATE: ", finalDate);

  function renderIncomesHeader() {
    return (
      <View 
        style={{
          margin: '2px 0px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottom: '1px solid black',
          borderStyle: 'dashed',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Text style={{ textAlign: 'left', fontSize: 10, color: '#000000', width: '20%' }}>
          {`Fecha`}
        </Text>
        <Text style={{ textAlign: 'right', fontSize: 10, color: '#000000', width: '20%' }}>
          {`Turno Mañana`}
        </Text>
        <Text style={{ textAlign: 'right', fontSize: 10, color: '#000000', width: '20%' }}>
          {`Turno Noche`}
        </Text>
        <Text style={{ textAlign: 'right', fontSize: 10, color: '#000000', width: '20%' }}>
          {`Total`}
        </Text>
        <Text style={{ textAlign: 'right', fontSize: 10, color: '#000000', width: '20%' }}>
          {`Saldo`}
        </Text>
      </View>
    )
  }

  function renderExpensesHeader() {
    return (
      <View 
        style={{
          margin: '2px 0px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottom: '1px solid black',
          borderStyle: 'dashed',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Text style={{ textAlign: 'left', fontSize: 10, color: '#000000', width: '20%' }}>
          {`Fecha`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 10, color: '#000000', width: '40%' }}>
          {`Concepto`}
        </Text>
        <Text style={{ textAlign: 'right', fontSize: 10, color: '#000000', width: '20%' }}>
          {`Monto`}
        </Text>
        <Text style={{ textAlign: 'right', fontSize: 10, color: '#000000', width: '20%' }}>
          {`Saldo`}
        </Text>
      </View>
    )
  }

  return (
    <Document>
      <Page size={'LETTER'} style={{ padding: '20px 40px 20px 30px' }} orientation={'portrait'}>
        <View 
          style={{
            margin: '5px 0px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#000000', width: '100%' }}>
            {'Control de Parqueos'}
          </Text>
          <Text style={{ textAlign: 'center', fontSize: 11, color: '#000000', width: '100%' }}>
            {`Reporte del ${startDate.format('LL')} al ${finalDate.format('LL')}`}
          </Text>
        </View>
        <View 
          style={{
            margin: '5px 0px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Text style={{ textAlign: 'left', fontSize: 11, color: '#000000', width: '100%' }}>
            {'Ingresos'}
          </Text>
        </View>
        {renderIncomesHeader()}
        {
          (incomesData || []).map((x, index) => (
            <View 
              key={index}
              style={{
                margin: '2px 0px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                // borderBottom: '1px solid black',
                // borderStyle: 'dashed',
                backgroundColor: index % 2 === 0 ? 'transparent' : '#fafafa'
              }}
            >
              <Text style={{ textAlign: 'left', fontSize: 9, color: '#000000', width: '20%' }}>
                {x.checkoutFullDate}
              </Text>
              <Text style={{ textAlign: 'right', fontSize: 9, color: '#000000', width: '20%' }}>
                {Number(x.morningTotal).toFixed(2)}
              </Text>
              <Text style={{ textAlign: 'right', fontSize: 9, color: '#000000', width: '20%' }}>
                {Number(x.noonTotal).toFixed(2)}
              </Text>
              <Text style={{ textAlign: 'right', fontSize: 9, color: '#000000', width: '20%' }}>
                {Number(x.checkoutTotal).toFixed(2)}
              </Text>
              <Text style={{ textAlign: 'right', fontSize: 9, color: '#000000', width: '20%' }}>
                {Number(x.balance).toFixed(2)}
              </Text>
            </View>
          ))
        }
        <View 
          style={{
            margin: '5px 0px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Text style={{ textAlign: 'left', fontSize: 11, color: '#000000', width: '100%' }}>
            {'Egresos'}
          </Text>
        </View>
        {renderExpensesHeader()}
        {
          (expensesData || []).map((x, index) => (
            <View 
              key={index}
              style={{
                margin: '2px 0px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                // borderBottom: '1px solid black',
                // borderStyle: 'dashed',
                backgroundColor: index % 2 === 0 ? 'transparent' : '#fafafa'
              }}
            >
              <Text style={{ textAlign: 'left', fontSize: 9, color: '#000000', width: '20%' }}>
                {x.documentFullDate}
              </Text>
              <Text style={{ textAlign: 'left', fontSize: 9, color: '#000000', width: '40%' }}>
                {x.concept}
              </Text>
              <Text style={{ textAlign: 'right', fontSize: 9, color: '#000000', width: '20%' }}>
                {Number(x.amount).toFixed(2)}
              </Text>
              <Text style={{ textAlign: 'right', fontSize: 9, color: '#000000', width: '20%' }}>
                {Number(x.balance).toFixed(2)}
              </Text>
            </View>
          ))
        }
        <View 
          style={{
            margin: '5px 0px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Text style={{ textAlign: 'left', fontSize: 11, color: '#000000', width: '100%' }}>
            {'Resumen'}
          </Text>
        </View>
        <View 
          style={{
            margin: '5px 0px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Text style={{ textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#000000', width: '100%' }}>
            {'Ingresos'}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 9, color: '#000000', width: '100%' }}>
            {`$${Number(incomesTotal).toFixed(2)}`}
          </Text>
          <Text style={{ textAlign: 'left', marginTop: 10, fontWeight: 600, fontSize: 10, color: '#000000', width: '100%' }}>
            {'Egresos'}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 9, color: '#000000', width: '100%' }}>
            {`$${Number(expensesTotal).toFixed(2)}`}
          </Text>
          <Text style={{ textAlign: 'left', marginTop: 10, fontWeight: 600, fontSize: 10, color: '#000000', width: '100%' }}>
            {'Utilidad'}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 9, color: '#000000', width: '100%' }}>
            {`$${Number(incomesTotal - expensesTotal).toFixed(2)}`}
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default ParkingReportPDF;
