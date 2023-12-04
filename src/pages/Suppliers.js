import React, { useState, useEffect } from 'react';
import { Button, Col, Input, Row, Space, Table } from 'antd';
import { SyncOutlined, UserAddOutlined } from '@ant-design/icons';
import { find } from 'lodash';

import suppliersServices from '../services/SuppliersServices.js';

import { Wrapper } from '../styled-components/Wrapper';

import { customNot } from '../utils/Notifications';
import { filterData } from '../utils/Filters';
import { columnActionsDef, columnDef } from '../utils/ColumnsDefinitions';
import SupplierForm from '../components/forms/SupplierForm.js';

const { Search } = Input;

function Suppliers() {
  const [fetching, setFetching] = useState(false);
  const [filter, setFilter] = useState('');

  const [openForm, setOpenForm] = useState(false);
  const [formUpdateMode, setFormUpdateMode] = useState(false);

  const [entityData, setEntityData] = useState([]);
  const [entityToUpdate, setEntityToUpdate] = useState({});

  async function loadData() {
    setFetching(true);
    const response = await suppliersServices.find();
    setEntityData(response.data);
    setFetching(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    columnDef({title: 'Id', dataKey: 'id'}),
    columnDef({title: 'Nombres', dataKey: 'name'}),
    columnDef({title: 'Dirección', dataKey: 'address'}),
    columnDef({title: 'Teléfono', dataKey: 'phone'}),
    columnDef({title: 'DUI', dataKey: 'dui'}),
    columnDef({title: 'NIT', dataKey: 'nit'}),
    columnDef({title: 'NRC', dataKey: 'nrc'}),
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
            placeholder="Juan" 
            allowClear 
            style={{ width: 300 }}
            onChange={(e) => setFilter(e.target.value)}
            size={'large'}
          />
          <Space>
            <Button
              size='large'
              type='primary'
              icon={<UserAddOutlined />}
              onClick={() => {
                setEntityToUpdate({});
                setOpenForm(true);
              }}
            >
              Nuevo proveedor
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
            loading={fetching}
            size='small'
            style={{ width: '100%' }}
            rowKey={'id'}
            dataSource={filterData(entityData, filter, ['name', 'phone', 'email', 'dui', 'nit']) || []}
            columns={columns} 
          />
        </Col>
      </Row>
      <SupplierForm 
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

export default Suppliers;
