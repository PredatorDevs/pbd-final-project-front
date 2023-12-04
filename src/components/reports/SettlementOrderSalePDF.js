import { Col, Row, Table } from "antd";
import React, { useEffect } from "react";
import { TicketWrapper } from "../../styled-components/TicketWrapper";
import { Document, Page, View, Text  } from '@react-pdf/renderer';

import moment from 'moment';
import 'moment/locale/es-mx';
import { isEmpty } from "lodash";
import { getUserLocationName } from "../../utils/LocalData";

function SettlementOrderSalePDF(props) {

  const { reportData, hellNo, dateRange } = props;

  useEffect(() => {
    
  }, [ hellNo ]);

  function renderHeader() {
    return (
      <View 
        style={{ 
          marginBottom: 5,
          display: 'flex',
          flexDirection: 'row-reverse'
        }}
        fixed
      >
        <Text
          style={{ fontSize: 8, color: '#8c8c8c' }}
        >
          {`Agua El Limón`}
        </Text>
      </View>
    )
  }

  function renderFooter() {
    return (
      <View 
        style={{
          marginTop: 5,
          display: 'flex',
          flexDirection: 'row-reverse'
        }}
        fixed
        render={({ pageNumber }) => (
          <Text
            style={{ fontSize: 8, color: '#8c8c8c' }}
          >
            {`Generado el: ${moment().format('LL')} a las ${moment().format('LT')} - Página ${pageNumber}`}
          </Text>
      )} />
    )
  }

  function renderSalesSummaryHeader() {
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
        <Text style={{ fontSize: 9, color: '#000000', fontWeight: 600, width: '5%' }}>
          {`N°`}
        </Text>
        <Text style={{ fontSize: 9, color: '#000000', fontWeight: 600, width: '15%' }}>
          {`Fecha`}
        </Text>
        <Text style={{ fontSize: 9, color: '#000000', fontWeight: 600, width: '30%' }}>
          {`Cliente`}
        </Text>
        <Text style={{ fontSize: 9, color: '#000000', fontWeight: 600, width: '10%', textAlign: 'right' }}>
          {`Garrafa`}
        </Text>
        <Text style={{ fontSize: 9, color: '#000000', fontWeight: 600, width: '10%', textAlign: 'right' }}>
          {`Galón`}
        </Text>
        <Text style={{ fontSize: 9, color: '#000000', fontWeight: 600, width: '10%', textAlign: 'right' }}>
          {`Litro`}
        </Text>
        <Text style={{ fontSize: 9, color: '#000000', fontWeight: 600, width: '10%', textAlign: 'right' }}>
          {`600 ml`}
        </Text>
        <Text style={{ fontSize: 9, color: '#000000', fontWeight: 600, width: '10%', textAlign: 'right' }}>
          {`Fardo`}
        </Text>
      </View>
    )
  }

  function getSumOfOrderSaleReportColumn(propertyName) {
    if (isEmpty(reportData[0])) return Number("0").toFixed(2)
    else {
      let value = 0;
      for (let i = 0; i < reportData[0].length; i++) {
        const { saleId } = reportData[0][i];
        if (saleId !== null) value += +(reportData[0][i][propertyName]);
      }
      return Number(value).toFixed(2);
    }
  }

  return (
    <Document>
      <Page size={'LETTER'} style={{ padding: '20px 40px 20px 30px' }}>
        {renderHeader()}
        <View 
          style={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Text style={{ fontSize: 14, color: '#000000' }}>{`Bitácora de Pedidos`}</Text>
          <Text style={{ fontSize: 12, color: '#000000' }}>{`${getUserLocationName()}`}</Text>
          <Text style={{ fontSize: 8, color: '#000000' }}>{`Del: ${dateRange.initialDate}`}</Text>
          <Text style={{ fontSize: 8, color: '#000000' }}>{`Al: ${dateRange.finalDate}`}</Text>
        </View>
        <Text style={{ fontSize: 10, color: '#000000', marginTop: 10, marginBottom: 5 }}>
          {`Movimientos`}
        </Text>
        {renderSalesSummaryHeader()}
        {
          (reportData[0] || []).map((element, index) => (
              <View 
                key={index}
                style={{
                  margin: '2px 0px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottom: element.orderSaleId ? '1px solid white' : '1px solid black',
                  borderStyle: 'dashed',
                  backgroundColor: (index % 2 === 0) ? '#FFFFFF' : '#f5f5f5'
                }}
              >
                <Text style={{ fontSize: 9, color: '#000000', width: '5%' }}>
                  {`${element.orderSaleId || ''}`}
                </Text>
                <Text style={{ fontSize: 9, color: '#000000', width: '15%' }}>
                  {`${element.orderSaleDocDatetime || ''}`}
                </Text>
                <Text style={{ fontSize: 9, color: '#000000', width: '30%' }}>
                  {`${element.customerFullname || ''}`}
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
              </View>
            )
          )
        }
        <View 
          style={{
            margin: '2px 0px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTop: '1px solid black',
            borderBottom: '1px solid black',
            borderStyle: 'dashed'
          }}
        >
          <Text style={{ fontSize: 9, color: '#000000', width: '5%' }}>
            {`${''}`}
          </Text>
          <Text style={{ fontSize: 9, color: '#000000', width: '15%' }}>
            {`${''}`}
          </Text>
          <Text style={{ fontSize: 9, color: '#000000', width: '30%' }}>
            {`${'TOTAL' || ''}`}
          </Text>
          <Text style={{ fontSize: 9, color: '#000000', width: '10%', textAlign: 'right' }}>
            {`${getSumOfOrderSaleReportColumn('garrafon') || ''}`}
          </Text>
          <Text style={{ fontSize: 9, color: '#000000', width: '10%', textAlign: 'right' }}>
            {`${getSumOfOrderSaleReportColumn('galon') || ''}`}
          </Text>
          <Text style={{ fontSize: 9, color: '#000000', width: '10%', textAlign: 'right' }}>
            {`${getSumOfOrderSaleReportColumn('litro') || ''}`}
          </Text>
          <Text style={{ fontSize: 9, color: '#000000', width: '10%', textAlign: 'right' }}>
            {`${getSumOfOrderSaleReportColumn('botella') || ''}`}
          </Text>
          <Text style={{ fontSize: 9, color: '#000000', width: '10%', textAlign: 'right' }}>
            {`${getSumOfOrderSaleReportColumn('fardo') || ''}`}
          </Text>
        </View>
        {renderFooter()}
      </Page>
    </Document>
  )
}

export default SettlementOrderSalePDF;
