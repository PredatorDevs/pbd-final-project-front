import React, { useEffect, useState } from 'react';
import { Wrapper } from '../../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CompanyInformation } from '../../styled-components/CompanyInformation';
import { Button, Col, DatePicker, Input, Row, Space, Spin, Table } from 'antd';
import { TableContainer } from '../../styled-components/TableContainer';
import { columnActionsDef, columnDef } from '../../utils/ColumnsDefinitions';


import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import { FileTextOutlined, LogoutOutlined, SearchOutlined } from '@ant-design/icons';
import { customNot } from '../../utils/Notifications';
import { filterData } from '../../utils/Filters';

import { BlobProvider } from '@react-pdf/renderer';
import SettlementOrderSalePDF from '../../components/reports/SettlementOrderSalePDF';
import orderSalesServices from '../../services/OrderSalesServices';
import { getUserLocation } from '../../utils/LocalData';

const { RangePicker } = DatePicker;
const { Search } = Input;

const Container = styled.div`
  background-color: #325696;
  border: 1px solid #D1DCF0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  color: white;
`;

const InnerContainer = styled.div`
  background-color: #223B66;
  border: 1px solid #223B66;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 10px;
  width: 100%;
  color: white;
`;

const SearchOption = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

function OrderSaleBinnacles() {
  const navigate = useNavigate();

  function defaultDate() {
    return moment();
  };

  const [fetching, setFetching] = useState(false);
  const [filter, setFilter] = useState('');
  const [entityData, setEntityData] = useState([]);
  const [entityRefreshData, setEntityRefreshData] = useState(0);

  const [entityDataToPrint, setEntityDataToPrint] = useState([]);

  const [initialDate, setInitialDate] = useState(defaultDate());
  const [finalDate, setFinalDate] = useState(defaultDate());

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setFetching(true);
    orderSalesServices.findByLocationRangeDate(getUserLocation(), initialDate.format('YYYY-MM-DD'), finalDate.format('YYYY-MM-DD'))
    .then((response) => { 
      setEntityData(response.data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }, [ entityRefreshData ]);

  function searchByRangeDateAction() {
    if (initialDate.isValid() && finalDate.isValid()) {
      setFetching(true);
      orderSalesServices.findByLocationRangeDate(getUserLocation(), initialDate.format('YYYY-MM-DD'), finalDate.format('YYYY-MM-DD'))
      .then((response) => { 
        setEntityData(response.data);
        setFetching(false);
      })
      .catch((error) => {
        customNot('error', 'Sin información', 'Revise su conexión a la red');
        setFetching(false);
      });
    } else {
      customNot('warning', 'Fechas no definidas', 'Debe colocar fechas correctas para la búsqueda')
    }
  }

  return (
    <Wrapper xCenter>
      <div style={{ display: 'none' }}>
        <BlobProvider
          document={
            <SettlementOrderSalePDF 
              reportData={entityDataToPrint} 
              hellNo={counter} 
              dateRange={ { initialDate: initialDate.format('LL'), finalDate: finalDate.format('LL') } } 
            />}
        >
          {({ blob, url, loading, error }) => {
            // Do whatever you need with blob here
            return <a href={url} id={'print-ordersalessettlement-button'} target="_blank" rel="noreferrer">Open in new tab</a>;
          }}
        </BlobProvider>
      </div>
      <CompanyInformation>
        <section className='company-info-container'>
          <p className='module-name'>Bitácora Pedidos</p>
        </section>
      </CompanyInformation>
      <Container>
        <InnerContainer>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <p style={{ margin: 0 }}>Rango de fecha:</p>
              <SearchOption>
                <Space>
                  <RangePicker 
                    locale={locale} 
                    format={["DD-MM-YYYY", "DD-MM-YYYY"]}
                    value={[initialDate, finalDate]} 
                    style={{ width: '100%' }}
                    onChange={([initialMoment, finalMoment], [initialString, finalString]) => {
                      setInitialDate(initialMoment);
                      setFinalDate(finalMoment);
                    }}
                  />
                  <Button icon={<SearchOutlined />} onClick={() => searchByRangeDateAction()}/>
                  {fetching ? <Spin /> : <></>}
                </Space>
              </SearchOption>
            </Col>
            <Col span={12}>
              <Button danger type={'primary'} icon={<LogoutOutlined />} onClick={() => navigate('/ordersales')}>Salir</Button> 
            </Col>
            <Col span={12}>
              <Button
                // type="primary"
                icon={<FileTextOutlined />}
                onClick={() => {
                  setFetching(true);
                  customNot('info', 'Generando reporte', 'Esto tomará unos segundos')
                  orderSalesServices.findSettlementByLocationRangeDate(getUserLocation(), initialDate.format('YYYY-MM-DD'), finalDate.format('YYYY-MM-DD'))
                  .then((response) => {
                    setEntityDataToPrint(response.data);
                    setCounter(counter + 1);
                    setTimeout(() => {
                    document.getElementById('print-ordersalessettlement-button').click();
                    setFetching(false);
                  }, 1000);
                  }).catch((error) => {
                  customNot('error', 'Información de liquidación no encontrada', 'Revise conexión')
                  setFetching(false);
                  });
                }}
              >
                Generar reporte
              </Button>
            </Col>
          </Row>
        </InnerContainer>
        <InnerContainer>
          <Search
            name={'filter'} 
            value={filter} 
            placeholder="Marca 1" 
            allowClear 
            style={{ width: 300 }}
            onChange={(e) => setFilter(e.target.value)}
          />
          <p style={{ margin: 0, fontSize: 9 }}>Búsqueda por: Número - Cliente - Tipo - Estado</p>
          <div style={{ height: 10 }} />
          <TableContainer>
            <Table
              columns={
                [
                  columnDef({title: 'Número', dataKey: 'id'}),
                  columnDef({title: 'Fecha', dataKey: 'docDatetime'}),
                  columnDef({title: 'Cliente', dataKey: 'customerFullname'}),
                  columnDef({title: 'Tipo', dataKey: 'docTypeName'}),
                  columnDef({title: 'Estado', dataKey: 'statusName'}),
                  // columnMoneyDef({title: 'Total', dataKey: 'total'}),
                  columnActionsDef(
                    {
                      title: 'Acciones',
                      dataKey: 'id',
                      edit: false,
                      detailAction: (value) => {
                        // setEntitySelectedId(value);
                        // setOpenPreview(true);
                      },
                    }
                  ),
                ]
              }
              rowKey={'id'}
              dataSource={filterData(entityData, filter, ['id', 'customerFullname', 'docTypeName', 'statusName']) || []}
              pagination
              size={'small'}
            />
          </TableContainer>
        </InnerContainer>
      </Container>
    </Wrapper>
  );
}

export default OrderSaleBinnacles;
