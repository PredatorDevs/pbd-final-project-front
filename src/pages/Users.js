import React, { useState, useEffect } from 'react';
import { Button, Col, Input, PageHeader, Row, Space, Spin, Table } from 'antd';
import { LogoutOutlined, PlusOutlined, SyncOutlined, UserAddOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { useNavigate } from 'react-router-dom';

import UserForm from '../components/UserForm';
import usersService from '../services/UsersService.js';

import { Wrapper } from '../styled-components/Wrapper';
import { TableContainer } from '../styled-components/TableContainer';

import { customNot } from '../utils/Notifications';
import { filterData } from '../utils/Filters';
import { columnActionsDef, columnDef } from '../utils/ColumnsDefinitions';

const { Search } = Input;

function Users() {
  const [fetching, setFetching] = useState(false);
  const [filter, setFilter] = useState('');

  const [openForm, setOpenForm] = useState(false);
  const [formUpdateMode, setFormUpdateMode] = useState(false);

  const [entityData, setEntityData] = useState([]);
  const [entityToUpdate, setEntityToUpdate] = useState({});

  const navigate = useNavigate();

  async function loadData() {
    setFetching(true);
    const response = await usersService.find();
    setEntityData(response.data);
    setFetching(false);
  }

  useEffect(() => {
    loadData();
  }, [ ]);

  const columns = [
    columnDef({title: 'Id', dataKey: 'id'}),
    columnDef({title: 'Nombres', dataKey: 'fullName'}),
    columnDef({title: 'Usuario', dataKey: 'username'}),
    columnDef({title: 'Rol', dataKey: 'roleName'}),
    columnDef({title: 'Sucursal', dataKey: 'locationName'}),
    columnActionsDef(
      {
        title: 'Acciones',
        dataKey: 'id',
        detail: false,
        // detailAction: (value) => customNot('info', 'En desarrollo', 'Próximamente'),
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
              Nuevo usuario
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
            dataSource={filterData(entityData, filter, ['fullName', 'username', 'locationName']) || []}
            columns={columns} 
          />
        </Col>
      </Row>
      <UserForm 
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

export default Users;