import React, { useEffect, useState } from 'react';
import { Wrapper } from '../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import { CompanyInformation } from '../styled-components/CompanyInformation';
import styled from 'styled-components';
import { Button, Col, DatePicker, Row, Select, Space, Table } from 'antd';
import { SearchOutlined, PrinterOutlined, AppstoreOutlined, LogoutOutlined } from '@ant-design/icons';
import productsServices from '../services/ProductsServices';
import { customNot } from '../utils/Notifications';
import { isEmpty } from 'lodash';

import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import { TableContainer } from '../styled-components/TableContainer';
import { columnActionsDef, columnDef } from '../utils/ColumnsDefinitions';
import reportsServices from '../services/ReportsServices';
import { getUserLocation } from '../utils/LocalData';
import { BlobProvider } from '@react-pdf/renderer';
import SettlementOrderSalePDF from '../components/reports/SettlementOrderSalePDF';
import KardexPDF from '../components/reports/KardexPDF';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Container = styled.div`
  background-color: #454D68;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  box-shadow: 3px 3px 5px 0px #6B738F;
  -webkit-box-shadow: 3px 3px 5px 0px #6B738F;
  -moz-box-shadow: 3px 3px 5px 0px #6B738F;
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  color: white;
`;

function Kardex() {
  const navigate = useNavigate();

  function defaultDate() {
    return moment();
  };

  const [fetching, setFetching] = useState(false);
  const [entityRefreshData, setEntityRefreshData] = useState(0);

  const [kardexData, setKardexData] = useState([]);
  const [kardexDataToPrint, setKardexDataToPrint] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [productSelected, setProductSelected] = useState(0);
  const [productInitialStock, setProductInitialStock] = useState(0);

  const [initialDate, setInitialDate] = useState(defaultDate());
  const [finalDate, setFinalDate] = useState(defaultDate());

  useEffect(() => {
    setFetching(true);
    productsServices.findByLocationStockData(getUserLocation())
    .then((response) => {
      const { data } = response;
      setProductsData(data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }, [ entityRefreshData ]);

  function generateKardexView() {
    if (productSelected === 0 || productSelected === null) {
      customNot('warning', 'Seleccione un producto', 'Para generar datos debe seleccionar un producto');
      return;
    }
    setFetching(true);
    reportsServices.kardexByProduct(
      getUserLocation(), 
      productSelected,
      initialDate.format('YYYY-MM-DD'),
      finalDate.format('YYYY-MM-DD')
    )
    .then((response) => {
      setKardexData(response.data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }

  const columns = [
    // columnDef({title: 'Id', dataKey: 'id'}),
    columnDef({title: 'Documento', dataKey: 'referenceNumber'}),
    columnDef({title: 'Fecha', dataKey: 'referenceDatetime', ifNull: '-'}),
    columnDef({title: 'Concepto', dataKey: 'concept'}),
    columnDef({title: 'Tipo', dataKey: 'referenceType'}),
    columnDef({title: 'Ventas', dataKey: 'sales', align: 'right'}),
    columnDef({title: 'Compras', dataKey: 'purchases', align: 'right'}),
    columnDef({title: 'Saldo', dataKey: 'balance', align: 'right'})
  ];

  return (
    <Wrapper xCenter>
      <div style={{ display: 'none' }}>
        <BlobProvider
          document={
            <KardexPDF 
              reportData={kardexDataToPrint} 
            />}
        >
          {({ blob, url, loading, error }) => {
            // Do whatever you need with blob here
            return <a href={url} id={'print-kardex-1-button'} target="_blank" rel="noreferrer">Open in new tab</a>;
          }}
        </BlobProvider>
      </div>
      <CompanyInformation>
        <section className='company-info-container'>
          <p className='module-name'>Reporte Kárdex</p>
        </section>
      </CompanyInformation>
      <Container>
        <Row gutter={[16, 16]}>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }}>
            <p style={{ margin: '0px' }}>{'Producto:'}</p>
            <Select 
              dropdownStyle={{ width: '100%' }} 
              style={{ width: '100%' }} 
              value={productSelected} 
              onChange={(value) => {
                setProductInitialStock(productsData.find(x => x.productId === value).initialStock);
                setProductSelected(value);
              }}
              optionFilterProp='children'
              showSearch
              filterOption={(input, option) =>
                (option.children).toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option key={0} value={0} disabled>{'No seleccionado'}</Option>
              {
                (productsData || []).map(
                (element) => <Option key={element.productId} value={element.productId}>{element.productName}</Option>
                )
              }
            </Select>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }}>
            <p style={{ margin: '0px' }}>{'Existencia Inicial:'}</p>
            <p style={{ margin: '0px', fontWeight: 600 }}>{productInitialStock}</p>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }}>
            <p style={{ margin: '0px' }}>{'Fecha:'}</p>
            <Space>
              <RangePicker 
                locale={locale} 
                format={["DD-MM-YYYY", "DD-MM-YYYY"]}
                value={[initialDate, finalDate]} 
                // style={{ width: '100%' }}
                onChange={([initialMoment, finalMoment], [initialString, finalString]) => {
                  setInitialDate(initialMoment);
                  setFinalDate(finalMoment);
                }}
              />
              <Button icon={<SearchOutlined />} onClick={() => generateKardexView()}>Buscar</Button>
            </Space>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }}>
            <p style={{ margin: '0px' }}>{'Opciones:'}</p>
            <Space>
              {/* <Button icon={<PrinterOutlined />} onClick={() => { document.getElementById('print-kardex-1-button').click(); }}>Imprimir</Button> */}
              {/* <Button icon={<AppstoreOutlined />}>Todos los productos</Button> */}
              <Button icon={<LogoutOutlined />} type={'primary'} danger onClick={() => navigate('/main')}>Salir</Button>
            </Space>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>
            <TableContainer headColor={'#4F567B'}>
              <Table 
                columns={columns}
                rowKey={'logId'}
                size={'small'}
                dataSource={kardexData}
                loading={fetching}
              />
            </TableContainer>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default Kardex;
