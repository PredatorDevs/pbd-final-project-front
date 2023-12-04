import { Col, Row, Table } from "antd";
import React, { useEffect } from "react";
import { TicketWrapper } from "../../styled-components/TicketWrapper";
import { Document, Page, View, Text  } from '@react-pdf/renderer';

import moment from 'moment';
import 'moment/locale/es-mx';
import { isEmpty } from "lodash";
import { getUserLocationName } from "../../utils/LocalData";

function KardexPDF(props) {

  const { reportData } = props;

  function renderHeader() {
    return (
      <View 
        style={{ marginBottom: 5, display: 'flex', flexDirection: 'row-reverse' }}
        fixed
      >
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#8c8c8c' }}>
          {`Todo Para Cakes`}
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
            style={{ textAlign: 'left', fontSize: 7, color: '#8c8c8c' }}
          >
            {`Generado el: ${moment().format('LL')} a las ${moment().format('LT')} - Página ${pageNumber}`}
          </Text>
      )} />
    )
  }

  function renderKardexHeader() {
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
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
          {`Corr.`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
          {`Fecha`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
          {`N° Doc.`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '15.75%' }}>
          {`Proveedor/Cliente`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
          {`Nacionalidad`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
          {`Inicial`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
          {`Uds. Compradas`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
          {`Costo`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
          {`Costo Total`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
          {`Total Unidades`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
          {`Uds. Vendidas`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
          {`Precio Venta`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
          {`Venta Total`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
          {`Inventario Final`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
          {`Costo Unitario`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
          {`Costo Total`}
        </Text>
      </View>
    )
  }

  function renderKardexPreHeader() {
    return (
      <View 
        style={{
          margin: '2px 0px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          // borderBottom: '1px solid black',
          // borderStyle: 'dashed',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '42%' }}>
          {``}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '21%' }}>
          {`Compras`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '15.75%' }}>
          {`Ventas`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '15.75%' }}>
          {``}
        </Text>
      </View>
    )
  }

  // function getSumOfOrderSaleReportColumn(propertyName) {
  //   if (isEmpty(reportData[0])) return Number("0").toFixed(2)
  //   else {
  //     let value = 0;
  //     for (let i = 0; i < reportData[0].length; i++) {
  //       const { saleId } = reportData[0][i];
  //       if (saleId !== null) value += +(reportData[0][i][propertyName]);
  //     }
  //     return Number(value).toFixed(2);
  //   }
  // }

  return (
    <Document>
      <Page size={'LEGAL'} style={{ padding: '20px 40px 20px 30px' }} orientation={'landscape'}>
        {renderHeader()}
        <View 
          style={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Text style={{ fontSize: 14, color: '#000000' }}>{`Reporte de Kardex del período: ${'2023-01-01'} al ${'2023-01-01'}`}</Text>
          {/* <Text style={{ fontSize: 12, color: '#000000' }}>{`${getUserLocationName()}`}</Text> */}
          {/* <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000' }}>{`Del: ${dateRange.initialDate}`}</Text> */}
          {/* <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000' }}>{`Al: ${dateRange.finalDate}`}</Text> */}
        </View>
        <Text style={{ fontSize: 10, color: '#000000', marginTop: 10, marginBottom: 5 }}>
          {`Movimientos`}
        </Text>
        {renderKardexPreHeader()}
        {renderKardexHeader()}
        {/* {
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
        } */}
        <View 
          style={{
            margin: '2px 0px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottom: '1px solid black',
            borderStyle: 'dashed'
          }}
        >
          <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
            {`1`}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
            {`2022/01/01`}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
            {`1234`}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '15.75%' }}>
            {`Aguarrás y Limpiador Abraxo S.A. de C.V.`}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
            {`SALV.`}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
            {`0.00`}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
            {`12.00`}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
            {`1.50`}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
            {`18.00`}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
            {`12.00`}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
            {`10.00`}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
            {`2.00`}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
            {`20.00`}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
            {`2.00`}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
            {`1.50`}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 7, color: '#000000', width: '5.25%' }}>
            {`12.50`}
          </Text>
        </View>
        {renderFooter()}
      </Page>
    </Document>
  )
}

export default KardexPDF;
