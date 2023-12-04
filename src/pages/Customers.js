import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Button, Col, Input, Row, Space, Table } from 'antd';
import { SyncOutlined, UserAddOutlined } from '@ant-design/icons';

import customersServices from '../services/CustomersServices.js';

import { customNot } from '../utils/Notifications';
import { filterData } from '../utils/Filters';
import { columnActionsDef, columnBoolean, columnDef } from '../utils/ColumnsDefinitions';

import { Wrapper } from '../styled-components/Wrapper';

import CustomerForm from '../components/forms/CustomerForm.js';

const { Search } = Input;

function Customers() {
  const [fetching, setFetching] = useState(false);
  const [filter, setFilter] = useState('');

  const [openForm, setOpenForm] = useState(false);
  const [formUpdateMode, setFormUpdateMode] = useState(false);

  const [entityData, setEntityData] = useState([]);
  const [entityToUpdate, setEntityToUpdate] = useState([]);

  // const navigate = useNavigate();

  async function loadData() {
    setFetching(true);
    const response = await customersServices.find();
    setEntityData(response.data);
    setFetching(false);
  }

  useEffect(() => {
    loadData();
  }, [ ]);

  const columns = [
    // columnDef({title: 'Id', dataKey: 'id'}),
    columnDef({title: 'Código', dataKey: 'code'}),
    columnDef({title: 'Nombres', dataKey: 'fullName'}),
    columnDef({title: 'Tipo', dataKey: 'customerTypeName'}),
    columnDef({title: 'Correo', dataKey: 'email', ifNull: '-'}),
    // columnDef({title: 'Teléfono', dataKey: 'phone'}),
    columnDef({title: 'DUI', dataKey: 'dui'}),
    columnDef({title: 'NIT', dataKey: 'nit'}),
    columnBoolean({ title: 'Aplica Créd', dataKey: 'applyForCredit', trueText: 'SI', falseText: 'NO' }),
    columnActionsDef(
      {
        title: 'Acciones',
        dataKey: 'id',
        detailAction: (value) => customNot('info', 'En desarrollo', 'Próximamente'),
        editAction: async (value) => {
          const response = await customersServices.findById(value);
          setEntityToUpdate(response.data);
          setFormUpdateMode(true);
          setOpenForm(true);
        },
        // editAction: (value) => {
        //   setOpenForm(true);
        //   setFormUpdateMode(true);
        //   setEntityToUpdate(find(entityData, ['id', value]));
        // },
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
              Nuevo cliente
            </Button>
            <Button
              size='large'
              icon={<SyncOutlined />}
              onClick={() => {
                loadData({});
              }}
            >
              Refrescar
            </Button>
          </Space>
        </Col>
        <Col span={24}>
          <Table 
            bordered
            size='small'
            // style={{ width: '100%' }}
            rowKey={'id'}
            dataSource={filterData(entityData, filter, ['code', 'fullName', 'phone', 'email', 'dui', 'nit']) || []}
            columns={columns}
            loading={fetching}
          />
        </Col>
      </Row>
      <CustomerForm 
        open={openForm} 
        updateMode={formUpdateMode} 
        dataToUpdate={entityToUpdate} 
        onClose={(refresh) => { 
          setOpenForm(false);
          setFormUpdateMode(false);
          setEntityToUpdate([]);
          if (refresh) { 
            loadData();
          }
        }}
      />
    </Wrapper>
  );
}

export default Customers;