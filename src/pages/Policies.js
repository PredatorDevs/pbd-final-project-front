import { Col, Row, Button, Table, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Wrapper } from '../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { TableContainer } from '../styled-components/TableContainer';
import { columnActionsDef, columnDef, columnIfValueEqualsTo, columnMoneyDef } from '../utils/ColumnsDefinitions';
import { customNot } from '../utils/Notifications';
import { CompanyInformation } from '../styled-components/CompanyInformation';
import orderSalesServices from '../services/OrderSalesServices';
import OrderSalePreview from '../components/previews/OrderSalePreview';
import OrderSaleForm from '../components/forms/OrderSaleForm';
import { includes } from 'lodash';
import { getUserLocation, getUserRole } from '../utils/LocalData';
import policiesServices from '../services/PoliciesServices';
import PolicyPreview from '../components/previews/PolicyPreview';

const Container = styled.div`
  /* align-items: center; */
  background-color: #454D68;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  box-shadow: 3px 3px 5px 0px #6B738F;
  -webkit-box-shadow: 3px 3px 5px 0px #6B738F;
  -moz-box-shadow: 3px 3px 5px 0px #6B738F;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
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

function Policies() {
  const [fetching, setFetching] = useState(false);
  const [entityRefreshData, setEntityRefreshData] = useState(0);

  const [entityData, setEntityData] = useState([]);
  const [openPreview, setOpenPreview] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [entitySelectedId, setEntitySelectedId] = useState(0);

  const navigate = useNavigate();

  function loadData(){
    setFetching(true);
    policiesServices.find()
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

  const columns = [
    columnDef({title: 'Id', dataKey: 'policyId', ifNull: '-'}),
    columnDef({title: 'Código', dataKey: 'docNumber', ifNull: '-'}),
    columnDef({title: 'Fecha', dataKey: 'docDatetime'}),
    columnDef({title: 'Proveedor', dataKey: 'supplier', ifNull: '-'}),
    columnIfValueEqualsTo({title: '', dataKey: 'isVoided', text: 'Anulada', valueToCompare: 1 }),
    columnMoneyDef({title: 'Valores Totales', dataKey: 'totalValues'}),
    columnActionsDef(
      {
        title: 'Acciones',
        dataKey: 'policyId',
        detailAction: (value) => {
          setEntitySelectedId(value);
          setOpenPreview(true);
          // alert(value);
        },
        edit: false
      }
    ),
  ];

  return (
    <Wrapper xCenter>
      <CompanyInformation>
        <section className='company-info-container'>
          <p className='module-name'>Pólizas</p>
        </section>
      </CompanyInformation>
      <Container>
        <Row gutter={[8, 8]}>
          <Col 
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}
            xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}
          >
            <Space>
              <Button 
                type={'primary'} 
                icon={<PlusOutlined />}
                onClick={() => navigate('/policies/new')}
                size={'large'}
                >
                Nueva póliza
              </Button>
              <Button 
                // type={'primary'} 
                icon={<SyncOutlined />}
                onClick={() => loadData()}
                // size={'large'}
                >
                Actualizar
              </Button>
              <Button 
                type={'primary'} 
                icon={<LogoutOutlined />}
                onClick={() => navigate('/main')}
                size={'default'}
                danger
                >
                Salir
              </Button>
            </Space>
          </Col>
        </Row>
      </Container>
      {/* <div style={{ width: '100%' }}>
        <p style={{ color: '#FFFFFF', marginTop: 10, fontSize: 18 }}>Recientes</p>
      </div> */}
      <TableContainer headColor={'#4F567B'}>
        <Table 
          columns={columns}
          rowKey={'policyId'}
          size={'small'}
          dataSource={entityData || []}
          loading={fetching}
          onRow={(record, rowIndex) => {
            return {
              onClick: (e) => {
                e.preventDefault();
                setEntitySelectedId(record.policyId);
                setOpenPreview(true);
              }
            };
          }}
        />
      </TableContainer>
      <CompanyInformation>
        <section className='company-info-container'>
          <p className='module-description'>SigPro COM</p>
          <p className='module-description'>&copy; Todos los derechos reservados 2022</p>
        </section>
      </CompanyInformation>
      <PolicyPreview
        open={openPreview}
        policyId={entitySelectedId}
        onClose={(wasVoided) => {
          setOpenPreview(false);
          if (wasVoided) {
            loadData();
            setEntitySelectedId(0);
          }
        }}
      />
      {/* <OrderSaleForm
        open={openForm}
        orderSaleId={entitySelectedId}
        onRefresh={() => loadData()}
        onClose={() => setOpenForm(false)}
      /> */}
    </Wrapper>
  );
}

export default Policies;
