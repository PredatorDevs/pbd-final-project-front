import React, { useState, useEffect } from 'react';
import { Button, Col, Input, PageHeader, Row, Space, Spin, Table } from 'antd';
import { LogoutOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { useNavigate } from 'react-router-dom';

import deliveryRoutesServices from '../services/DeliveryRoutesServices.js';

import { Wrapper } from '../styled-components/Wrapper';
import { TableContainer } from '../styled-components/TableContainer';

import { customNot } from '../utils/Notifications';
import { filterData } from '../utils/Filters';
import { columnActionsDef, columnDef } from '../utils/ColumnsDefinitions';
import DeliveryRouteForm from '../components/DeliveryRouteForm.js';

const { Search } = Input;

function DeliveryRoutes() {
  const [fetching, setFetching] = useState(false);
  const [filter, setFilter] = useState('');

  const [openForm, setOpenForm] = useState(false);
  const [formUpdateMode, setFormUpdateMode] = useState(false);

  const [entityData, setEntityData] = useState([]);
  const [entityRefreshData, setEntityRefreshData] = useState(0);
  const [entityToUpdate, setEntityToUpdate] = useState({});

  const navigate = useNavigate();

  async function loadData() {
    setFetching(true);
    const response = await deliveryRoutesServices.find();
    setEntityData(response.data);
    setFetching(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    columnDef({title: 'Id', dataKey: 'id'}),
    columnDef({title: 'Nombre', dataKey: 'name'}),
    columnActionsDef(
      {
        title: 'Acciones',
        dataKey: 'id',
        detailAction: (value) => customNot('info', 'En desarrollo', 'Próximamente'),
        editAction: (value) => {
          setOpenForm(true);
          setFormUpdateMode(true);
          setEntityToUpdate(find(entityData, ['id', value]));
        },
      }
    ),
  ];

  return (
    <Wrapper>
      <Row gutter={[16, 16]} style={{ width: '100%' }}>
        <Col span={24} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Search
            name={'filter'}
            value={filter} 
            placeholder="ZONA CENTRO" 
            allowClear 
            style={{ width: 300 }}
            onChange={(e) => setFilter(e.target.value)}
            size={'large'}
          />
          <Space>
            <Button
              size='large'
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => {
                setEntityToUpdate({});
                setOpenForm(true);
              }}
            >
              Nueva ruta
            </Button>
            <Button
              size='large'
              icon={<SyncOutlined />}
              onClick={() => {
                loadData();
              }}
            >
              Actualizar
            </Button>
          </Space>
        </Col>
        <Col span={24}>
          <Table 
            size='small'
            style={{ width: '100%' }}
            rowKey={'id'}
            dataSource={filterData(entityData, filter, ['name']) || []}
            columns={columns} 
          />
        </Col>
      </Row>
      <DeliveryRouteForm
        open={openForm} 
        updateMode={formUpdateMode} 
        dataToUpdate={entityToUpdate} 
        onClose={(refresh) => { 
          setOpenForm(false);
          setFormUpdateMode(false);
          if (refresh) { 
            loadData();
          }
        }}
      />
    </Wrapper>
  );
}

export default DeliveryRoutes;
