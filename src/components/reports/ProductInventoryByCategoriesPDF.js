import { Col, Row, Table } from "antd";
import React, { useEffect } from "react";
import { TicketWrapper } from "../../styled-components/TicketWrapper";
import { Document, Page, View, Text  } from '@react-pdf/renderer';

import moment from 'moment';
import 'moment/locale/es-mx';
import { isEmpty } from "lodash";
import { getUserLocationName } from "../../utils/LocalData";

function ProductInventoryByCategoriesPDF(props) {
  const {
    categoriesData,
    productStockData,
    locationName
  } = props;

  function renderHeader() {
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
        fixed
      >
        <Text style={{ textAlign: 'left', fontSize: 10, color: '#000000', width: '10%' }}>
          {`Código`}
        </Text>
        <Text style={{ textAlign: 'left', fontSize: 10, color: '#000000', width: '45%' }}>
          {`Nombre`}
        </Text>
        <Text style={{ textAlign: 'right', fontSize: 10, color: '#000000', width: '15%' }}>
          {`Existencias`}
        </Text>
        <Text style={{ textAlign: 'right', fontSize: 10, color: '#000000', width: '15%' }}>
          {`Contenido`}
        </Text>
        <Text style={{ textAlign: 'right', fontSize: 10, color: '#000000', width: '15%' }}>
          {`Existencia general`}
        </Text>
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
          <Text style={{ textAlign: 'left', fontSize: 14, fontWeight: 600, color: '#000000', width: '100%' }}>
            {'Reporte de Inventario por Categorias'}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 12, color: '#000000', width: '100%' }}>
            {`${locationName}`}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 11, color: '#000000', width: '100%' }}>
            {`Al ${moment().format('LL')} a las ${moment().format('LT')}`}
          </Text>
        </View>
        {/* {renderHeader()} */}
        {
          (categoriesData || []).map((element, index) => (
            <View 
              style={{
                margin: '2px 0px',
                display: 'flex',
                flexDirection: 'row',
                // justifyContent: 'space-between',
                flexWrap: 'wrap',
                // borderBottom: '1px solid black',
                borderStyle: 'dashed',
                // backgroundColor: '#f5f5f5'
                marginTop: 5
              }}
              key={index}
            >
              <Text
                style={{
                  textAlign: 'left',
                  fontSize: 10,
                  color: '#000000',
                  width: '100%',
                  backgroundColor: '#f5f5f5',
                  borderTop: '1px solid black',
                  borderBottom: '1px solid black',
                  borderStyle: 'dashed',
                  marginTop: 5,
                  marginBottom: 5
                }}
              >
                {`${element.name}`}
              </Text>
              <Text style={{ textAlign: 'left', fontSize: 10, color: '#000000', width: '10%' }}>
                {`CÓDIGO`}
              </Text>
              <Text style={{ textAlign: 'left', fontSize: 10, color: '#000000', width: '45%' }}>
                {`NOMBRE`}
              </Text>
              <Text style={{ textAlign: 'right', fontSize: 10, color: '#000000', width: '15%' }}>
                {`EXISTENCIAS`}
              </Text>
              <Text style={{ textAlign: 'right', fontSize: 10, color: '#000000', width: '15%' }}>
                {`CONTENIDO`}
              </Text>
              <Text style={{ textAlign: 'right', fontSize: 10, color: '#000000', width: '15%' }}>
                {`GENERAL`}
              </Text>
              {
                (productStockData.filter((x) => x.productCategoryId === element.id) || []).map((subelement, subindex) => (
                  <>
                    <Text style={{ textAlign: 'left', fontSize: 9, color: '#000000', width: '10%' }}>
                      {subelement.productId}
                    </Text>
                    <Text style={{ textAlign: 'left', fontSize: 9, color: '#000000', width: '45%' }}>
                      {subelement.productName}
                    </Text>
                    <Text style={{ textAlign: 'right', fontSize: 9, color: '#000000', width: '15%' }}>
                      {subelement.currentLocationStock}
                    </Text>
                    <Text style={{ textAlign: 'right', fontSize: 9, color: '#000000', width: '15%' }}>
                      {subelement.packageContent}
                    </Text>
                    <Text style={{ textAlign: 'right', fontSize: 9, color: '#000000', width: '15%' }}>
                      {Number(subelement.currentLocationStock / subelement.packageContent).toFixed(2)}
                    </Text>
                  </>
                ))
              }
            </View>
          ))
        }
        {renderFooter()}
      </Page>
    </Document>
  )
}

export default ProductInventoryByCategoriesPDF;
