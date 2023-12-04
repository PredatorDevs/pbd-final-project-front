import { Col, Row, Button, Table, Space } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Wrapper } from '../styled-components/Wrapper';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookOutlined, LogoutOutlined, SnippetsOutlined } from '@ant-design/icons';
import { TableContainer } from '../styled-components/TableContainer';
import { columnActionsDef, columnBtnAction, columnDef, columnMoneyDef } from '../utils/ColumnsDefinitions';
import { customNot } from '../utils/Notifications';
import { CompanyInformation } from '../styled-components/CompanyInformation';
import SalePreview from '../components/previews/SalePreview';
import orderSalesServices from '../services/OrderSalesServices';
import { useReactToPrint } from 'react-to-print';
import OrderSaleTicket from '../components/tickets/OrderSaleTicket';
import OrderSalePreview from '../components/previews/OrderSalePreview';
import OrderSaleForm from '../components/forms/OrderSaleForm';
import { includes } from 'lodash';
import { getUserLocation, getUserRole } from '../utils/LocalData';

const Container = styled.div`
  /* align-items: center; */
  background-color: #325696;
  border: 1px solid #D1DCF0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  .ant-card:hover {
    cursor: pointer;
  }
  .card-title {
    font-size: 15px;
    color: #223B66;
    text-overflow: ellipsis;
    /* background-color: red; */
    font-weight: 600;
    margin: 0px;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
  }
`;

function OrderSales() {
  const [fetching, setFetching] = useState(false);
  const [entityRefreshData, setEntityRefreshData] = useState(0);

  const [entityData, setEntityData] = useState([]);
  const [openPreview, setOpenPreview] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [entitySelectedId, setEntitySelectedId] = useState(0);

  const navigate = useNavigate();

  function loadData(){
    setFetching(true);
    orderSalesServices.findByLocationCurrentActiveShiftcut(getUserLocation())
    .then((response) => {
      setEntityData(response.data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }

  useEffect(() => {
    loadData();
  }, [ entityRefreshData ]);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const columns = [
    columnDef({title: 'Código', dataKey: 'id'}),
    columnDef({title: 'Fecha', dataKey: 'docDatetime'}),
    columnDef({title: 'Cliente', dataKey: 'customerFullname'}),
    // columnDef({title: 'Sucursal', dataKey: 'locationName'}),
    columnDef({title: 'Tipo', dataKey: 'docTypeName'}),
    columnDef({title: 'Estado', dataKey: 'statusName'}),
    columnMoneyDef({title: 'Total', dataKey: 'total'}),
    {
      title: <p style={{ margin: '0px', fontSize: 12, fontWeight: 600 }}>{'Opciones'}</p>,
      dataIndex: 'id',
      key: 'id',
      align: 'right',
      render: (text, record, index) => {
        return (
          <Space>
            {
              includes([1, 2, 3, 4], getUserRole()) ? 
              <Button
                type="primary"
                size="small"
                style={{ fontSize: 10, backgroundColor: '#1890ff', borderColor: '#1890ff', display: (record.status === 1) ? 'inline-block' : 'none' }}
                onClick={() => { navigate('/sales/new', { state: { orderSaleId: record.id } })}}
              >
                {'Despachar'}
              </Button>
               : <>
              
              </>
            }
          </Space>
        )
      }
    },
    columnActionsDef(
      {
        title: 'Acciones',
        dataKey: 'id',
        detailAction: (value) => {
          setEntitySelectedId(value);
          setOpenPreview(true);
        },
        editAction: (value) => {
          setEntitySelectedId(value);
          setOpenForm(true);
        }
      }
    ),
  ];

  return (
    <Wrapper xCenter yCenter>
      <CompanyInformation>
        <section className='company-info-container'>
          <p className='module-name'>Pedidos</p>
        </section>
      </CompanyInformation>
      <Container>
        <Row gutter={[8, 8]}>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }}>
            <p style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 600 }}>Resumen</p>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }}>
            <Space>
              <Button 
                type={'primary'} 
                icon={<BookOutlined />}
                onClick={() => navigate('/ordersales/new')}
                size={'large'}
                >
                Nuevo pedido
              </Button>
              <div style={{ width: '10px' }} />
              <Button 
                // type={'primary'} 
                icon={<SnippetsOutlined />}
                onClick={() => navigate('/reports/ordersales/binnacles')}
                size={'large'}
              >
                Bitácora
              </Button>
              <div style={{ width: '10px' }} />
              <Button 
                type={'primary'} 
                icon={<LogoutOutlined />}
                onClick={() => navigate('/main')}
                size={'large'}
                danger
                >
                Salir
              </Button>
            </Space>
          </Col>
        </Row>
      </Container>
      <TableContainer>
        <p style={{ color: '#FFFFFF', marginTop: 10, fontSize: 18 }}>Recientes</p>
        <Table 
          columns={columns}
          rowKey={'id'}
          size={'small'}
          dataSource={entityData || []}
        />
      </TableContainer>
      <CompanyInformation>
        <section className='company-info-container'>
          <p className='module-description'>SigPro COM</p>
          <p className='module-description'>&copy; Todos los derechos reservados 2022</p>
        </section>
      </CompanyInformation>
      <OrderSalePreview
        open={openPreview}
        orderSaleId={entitySelectedId}
        onClose={() => setOpenPreview(false)}
      />
      <OrderSaleForm
        open={openForm}
        orderSaleId={entitySelectedId}
        onRefresh={() => loadData()}
        onClose={() => setOpenForm(false)}
      />
    </Wrapper>
  );
}

export default OrderSales;
