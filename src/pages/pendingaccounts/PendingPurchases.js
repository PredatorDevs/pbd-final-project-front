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
import customersServices from '../../services/CustomersServices';
import NewSalePayment from '../../components/NewSalePayment';
import { getUserLocation, getUserMyCashier } from '../../utils/LocalData';

import personIcon from '../../img/icons/person.png';
import invoiceIcon from '../../img/icons/invoice.png';
import invoiceTaxIcon from '../../img/icons/invoicetax.png';
import { GRefreshIcon } from '../../utils/IconImageProvider';
import productPurchasesServices from '../../services/ProductPurchasesServices';
import suppliersServices from '../../services/SuppliersServices';
import NewProductPurchasePayment from '../../components/NewProductPurchasePayment';

const { confirm } = Modal;

function PendingPurchases() {
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

  const [saleProductPurchaseToPay, setProductPurchaseSelectedToPay] = useState(0);
  const [saleDocumentNumberSelected, setSaleDocumentNumberSelected] = useState(0);

  const navigate = useNavigate();
  
  function loadData() {
    setFetching(true);
    productPurchasesServices.findPendingsByLocation(getUserLocation())
    .then((response) => {
      setEntityData(response.data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }

  function loadDetailData(supplierId) {
    setFetching(true);
    suppliersServices.findPendingPurchases(supplierId || 0)
    .then((response) => {
      setEntitySelectedId(supplierId);
      setEntityDetailData(response.data);
      setEntityDataFiltered(entityData.find((x) => x.supplierId === supplierId)['supplierName'] || '');
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    columnDef({title: 'Nombre', dataKey: 'customerFullname'}),
    columnDef({title: 'C. Pendientes', dataKey: 'pendingSales'}),
    {
      title: <p style={{ margin: '0px', fontSize: 12, fontWeight: 600 }}>{'Opciones'}</p>,
      dataIndex: 'id',
      key: 'id',
      align: 'right',
      render: (text, record, index) => {
        return (
          <Space>
            <Button
              type="primary"
              size="small"
              style={{ fontSize: 10, backgroundColor: '#1890ff', borderColor: '#1890ff' }}
              onClick={() => { 
                loadDetailData(record.supplierId)
              }}
            >
              {'Detalles'}
            </Button>
          </Space>
        )
      }
    },
  ];

  return (
    <Wrapper xCenter>
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
                onClick={() => loadDetailData(item.supplierId)}
                style={{ backgroundColor: item.supplierId === entitySelectedId ? '#d9d9d9' : 'transparent', borderRadius: 10 }}
              >
                <List.Item.Meta
                  avatar={<Avatar src={personIcon} style={{ backgroundColor: '#ff4d4f' }} />}
                  title={<p style={{ margin: 0 }}>{item.supplierName}</p>}
                  description={<p style={{ margin: 0 }}>{`${item.pendingProductPurchases} ${item.pendingProductPurchases > 1 ? 'cuentas pendientes' : 'cuenta pendiente'}`}</p>}
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
            renderItem={(item, index) => (
              <List.Item
                // onClick={() => loadDetailData(item.supplierId)}
                style={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#F0F2F5', borderRadius: 10 }}
                extra={[
                  <Button
                    onClick={() => { 
                      setProductPurchaseSelectedToPay(item.productPurchaseId);
                      setSaleDocumentNumberSelected(item.documentNumber);
                      setOpenModal(true);
                    }}
                  >
                    Pagar
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
                      {`${item.documentTypeName} ${item.documentNumber}`}
                    </p>
                  }
                  description={
                    <Space wrap>
                      <p style={{ margin: 0 }}>{`Debe `}<Tag color={'red'}>{`$ ${item.productPurchasePendingAmount}`}</Tag></p>
                      <p style={{ margin: 0 }}>{`Pagado `}<Tag color={'green'}>{`$ ${item.productPurchaseTotalPaid}`}</Tag></p>
                      <p style={{ margin: 0 }}>{`Total `}<Tag>{`$ ${item.productPurchaseTotal}`}</Tag></p>
                    </Space>
                  }
                />
              </List.Item>
            )}
            pagination
          />
        </Col>
      </Row>
      <NewProductPurchasePayment 
        open={openModal}
        productPurchaseId={saleProductPurchaseToPay}
        documentNumber={saleDocumentNumberSelected}
        onClose={(success) => {
          setOpenModal(false);
          if (success) {
            loadData();
            loadDetailData(entitySelectedId);
            setProductPurchaseSelectedToPay(0);
            setSaleDocumentNumberSelected(0);
          }
        }}
      />
    </Wrapper>
  );
}

export default PendingPurchases;
