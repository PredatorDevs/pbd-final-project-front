import React, { useState, useEffect } from 'react';
import { Avatar, Button, Card, Col, List, Modal, PageHeader, Result, Row, Space, Spin, Statistic, Table, Tag } from 'antd';
import { FileProtectOutlined, LogoutOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { Wrapper } from '../../styled-components/Wrapper';

import { customNot } from '../../utils/Notifications';
import styled from 'styled-components';
import cashiersServices from '../../services/CashiersServices.js';
import { isEmpty } from 'lodash';
import moment from 'moment';
import 'moment/locale/es-mx';
import ClosingShiftcutModal from '../../components/ClosingShiftcutModal.js';
import { TableContainer } from '../../styled-components/TableContainer.js';
import { columnDef, columnMoneyDef } from '../../utils/ColumnsDefinitions.js';
import salesServices from '../../services/SalesServices';
import customersServices from '../../services/CustomersServices';
import NewSalePayment from '../../components/NewSalePayment';
import { getUserLocation, getUserMyCashier } from '../../utils/LocalData';

import personIcon from '../../img/icons/person.png';
import invoiceIcon from '../../img/icons/invoice.png';
import invoiceTaxIcon from '../../img/icons/invoicetax.png';
import { GRefreshIcon } from '../../utils/IconImageProvider';

const { confirm } = Modal;

function PendingSales() {
  const [fetching, setFetching] = useState(false);
  const [filter, setFilter] = useState('');

  const [ableToProcess, setIsAbleToProcess] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [formUpdateMode, setFormUpdateMode] = useState(false);

  const [entityData, setEntityData] = useState([]);
  const [entitySelectedId, setEntitySelectedId] = useState(0);
  const [entityDataFiltered, setEntityDataFiltered] = useState('');
  const [entityDetailData, setEntityDetailData] = useState([]);
  const [entityRefreshData, setEntityRefreshData] = useState(0);
  const [entityToUpdate, setEntityToUpdate] = useState({});

  const [saleSelectedToPay, setSaleSelectedToPay] = useState(0);
  const [saleDocNumberSelected, setSaleDocNumberSelected] = useState(0);

  const navigate = useNavigate();

  async function checkIfAbleToProcess() {
    setFetching(true);

    const response = await cashiersServices.checkIfAbleToProcess(getUserMyCashier());

    const { isOpen, currentShiftcutId } = response.data[0];

    if (isOpen === 1 && currentShiftcutId !== null) {
      setIsAbleToProcess(true);
    }

    setFetching(false);
  }
  
  function loadData() {
    setFetching(true);
    salesServices.findPendingsByLocation(getUserLocation())
    .then((response) => {
      setEntityData(response.data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }

  function loadDetailData(customerId) {
    setFetching(true);
    customersServices.findPendingSales(customerId || 0)
    .then((response) => {
      setEntitySelectedId(customerId);
      setEntityDetailData(response.data);
      setEntityDataFiltered(entityData.find((x) => x.customerId === customerId)['customerFullname'] || '');
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }

  useEffect(() => {
    checkIfAbleToProcess();
    loadData();
  }, []);

  return (
    !ableToProcess ? <>
      <Result
        status="info"
        title={<p style={{ color: '#434343' }}>{`${fetching ? "Cargando..." : "Caja cerrada, operaciones de cobro limitadas"}`}</p>}
        subTitle={<p style={{ color: '#434343' }}>{`${fetching ? "Por favor espere..." : "Usted debe aperturar un nuevo turno en su caja para poder procesar"}`}</p>}
      />
    </> : <Wrapper xCenter>
      <Row gutter={[8, 8]} style={{ width: '100%' }}>
      <Col
          span={24}
          style={{
            paddingTop: '10px',
            paddingBottom: '10px',
            paddingLeft: '10px',
            paddingRight: '10px',
            backgroundColor: '#e6f4ff',
            borderRadius: '5px'
          }}
        >
          <p style={{ margin: '0px', fontSize: 12 }}>{'Opciones:'}</p>
          <Space wrap>
            <Button
              // type='primary'
              onClick={() => loadData()}
            >
              <Space>
                <GRefreshIcon width={'16px'} />
                {'Actualizar'}
              </Space>
            </Button>
          </Space>
        </Col>
        <Col span={8}>
          {/* <p style={{ fontWeight: 600, fontSize: 20 }}>Clientes pendientes</p> */}
          <List
            style={{ backgroundColor: '#F0F2F5', borderRadius: 5, padding: 10 }}
            size='small'
            itemLayout="horizontal"
            dataSource={entityData || []}
            renderItem={item => (
              <List.Item
                onClick={() => loadDetailData(item.customerId)}
                style={{ backgroundColor: item.customerId === entitySelectedId ? '#d9d9d9' : 'transparent', borderRadius: 10 }}
              >
                <List.Item.Meta
                  avatar={<Avatar src={personIcon} style={{ backgroundColor: '#ff4d4f' }} />}
                  title={<p style={{ margin: 0 }}>{item.customerFullname}</p>}
                  description={<p style={{ margin: 0 }}>{`${item.pendingSales} ${item.pendingSales > 1 ? 'cuentas pendientes' : 'cuenta pendiente'}`}</p>}
                />
              </List.Item>
            )}
            pagination
          />
        </Col>
        <Col span={16}>
          {/* <p style={{ fontSize: 18 }}>{`${entityDataFiltered}`}</p> */}
          <List
            style={{ backgroundColor: '#F0F2F5', borderRadius: 5, padding: 10 }}
            size='small'
            itemLayout="horizontal"
            dataSource={entityDetailData || []}
            loading={fetching}
            renderItem={(item, index) => (
              <List.Item
                // onClick={() => loadDetailData(item.customerId)}
                style={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#F0F2F5', borderRadius: 10 }}
                extra={[
                  <Button
                    onClick={() => { 
                      setSaleSelectedToPay(item.saleId);
                      setSaleDocNumberSelected(item.docNumber);
                      setOpenModal(true);
                    }}
                  >
                    Cobrar
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      src={item.documentTypeId === 3 ? invoiceTaxIcon : invoiceIcon} 
                    />
                  }
                  title={
                    <p 
                      style={{ }}
                    >
                      {`${item.documentTypeName} ${item.docNumber}`}
                    </p>
                  }
                  description={
                    <Space wrap>
                      <p style={{ margin: 0 }}>{`Debe `}<Tag color={'red'}>{`$ ${item.salePendingAmount}`}</Tag></p>
                      <p style={{ margin: 0 }}>{`Pagado `}<Tag color={'green'}>{`$ ${item.saleTotalPaid}`}</Tag></p>
                      <p style={{ margin: 0 }}>{`Total `}<Tag>{`$ ${item.saleTotal}`}</Tag></p>
                    </Space>
                  }
                />
              </List.Item>
            )}
            pagination
          />
        </Col>
      </Row>
      <NewSalePayment 
        open={openModal}
        saleId={saleSelectedToPay}
        docNumber={saleDocNumberSelected}
        onClose={(success) => {
          setOpenModal(false);
          if (success) {
            loadData();
            loadDetailData(entitySelectedId);
            setSaleSelectedToPay(0);
          }
        }}
      />
    </Wrapper>
  );
}

export default PendingSales;
