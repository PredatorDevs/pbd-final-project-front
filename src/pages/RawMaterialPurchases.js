import { Col, Row, Card, Button, Statistic, Table, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Wrapper } from '../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { TableContainer } from '../styled-components/TableContainer';
import { columnActionsDef, columnDef, columnMoneyDef } from '../utils/ColumnsDefinitions';
import rawMaterialPurchasesServices from '../services/RawMaterialPurchasesServices';
import { customNot } from '../utils/Notifications';
import { isEmpty } from 'lodash';
import { CompanyInformation } from '../styled-components/CompanyInformation';
import RawMaterialPurchasePreview from '../components/previews/RawMaterialPurchasePreview';

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

function RawMaterialPurchases() {
  const [fetching, setFetching] = useState(false);
  const [entityRefreshData, setEntityRefreshData] = useState(0);

  const [entitySelectedId, setEntitySelectedId] = useState(0);
  const [openPreview, setOpenPreview] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [purchaseResumeData, setPurchaseResumeData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setFetching(true);
    rawMaterialPurchasesServices.findRecents()
    .then((response) => { 
      setEntityData(response.data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }, [ entityRefreshData ]);

  useEffect(() => {
    setFetching(true);
    rawMaterialPurchasesServices.findResume()
    .then((response) => { 
      setPurchaseResumeData(response.data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }, [ entityRefreshData ]);

  const columns = [
    // columnDef({title: 'Id', dataKey: 'id'}),
    columnDef({title: 'Código', dataKey: 'docNumber'}),
    columnDef({title: 'Fecha', dataKey: 'docDatetime'}),
    columnDef({title: 'Proveedor', dataKey: 'supplierName'}),
    columnMoneyDef({title: 'Total', dataKey: 'total'}),
    columnActionsDef(
      {
        title: 'Acciones',
        dataKey: 'id',
        edit: false,
        detailAction: (value) => {
          setEntitySelectedId(value);
          setOpenPreview(true);
        },
      }
    ),
  ];

  return (
    <Wrapper xCenter yCenter>
      <CompanyInformation>
        <section className='company-info-container'>
          <p className='module-name'>Compras</p>
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
                icon={<ShoppingCartOutlined />}
                onClick={() => navigate('/purchases/new')}
              >
                Nueva compra
              </Button>
              <div style={{ width: '10px' }} />
              <Button 
                type={'primary'}
                danger 
                icon={<LogoutOutlined />}
                onClick={() => navigate('/main')}
              >
                Salir
              </Button>
            </Space>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col xs={{ span: 12 }} sm={{ span: 12 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }} xxl={{ span: 6 }}>
            <Card bodyStyle={{ backgroundColor: '#3F506E' }}>
              <Statistic
                title={<p style={{ color: '#FFFFFF', fontSize: 12 }}>Compras registradas</p>}
                valueStyle={{ color: '#FFF' }} 
                value={!isEmpty(purchaseResumeData) ? purchaseResumeData[0].PurchaseQuantity : 'No info'} 
              />
            </Card>
          </Col>
          <Col xs={{ span: 12 }} sm={{ span: 12 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }} xxl={{ span: 6 }}>
            <Card bodyStyle={{ backgroundColor: '#3F506E' }}>
              <Statistic 
                title={<p style={{ color: '#FFFFFF', fontSize: 12 }}>Total registrado</p>}
                prefix={'$'}
                valueStyle={{ color: '#FFF' }} 
                value={!isEmpty(purchaseResumeData) ? purchaseResumeData[0].PurchaseTotal : 'No info'} 
              />
            </Card>
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
        {/* <img className='logo' src={aguaLimonLogo} alt={'aguaLimonLogo'} /> */}
        <section className='company-info-container'>
          <p className='module-description'>SigPro COM</p>
          <p className='module-description'>&copy; Todos los derechos reservados 2022</p>
        </section>
      </CompanyInformation>
      <RawMaterialPurchasePreview
        open={openPreview}
        rawMaterialPurchaseId={entitySelectedId}
        onClose={() => {
          setOpenPreview(false);
        }}
      />
    </Wrapper>
  );
}

export default RawMaterialPurchases;
