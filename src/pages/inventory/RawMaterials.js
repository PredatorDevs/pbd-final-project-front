import React, { useState, useEffect } from 'react';
import { Button, Input, PageHeader, Space, Spin, Table } from 'antd';
import { LogoutOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { find, includes } from 'lodash';
import { useNavigate } from 'react-router-dom';

import rawMaterialsServices from '../../services/RawMaterialsServices.js';

import { Wrapper } from '../../styled-components/Wrapper';
import { TableContainer } from '../../styled-components/TableContainer';

import { customNot } from '../../utils/Notifications';
import { filterData } from '../../utils/Filters';
import { columnActionsDef, columnDef, columnMoneyDef } from '../../utils/ColumnsDefinitions';
import RawMaterialForm from '../../components/forms/RawMaterialForm.js';
import { getUserLocation, getUserRole } from '../../utils/LocalData.js';

const { Search } = Input;

function RawMaterials() {
  const [fetching, setFetching] = useState(false);
  const [filter, setFilter] = useState('');

  const [openForm, setOpenForm] = useState(false);
  const [formUpdateMode, setFormUpdateMode] = useState(false);

  const [entityData, setEntityData] = useState([]);
  const [entityRefreshData, setEntityRefreshData] = useState(0);
  const [entityToUpdate, setEntityToUpdate] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    setFetching(true);
    rawMaterialsServices.findByLocationStockData(getUserLocation())
    .then((response) => { 
      setEntityData(response.data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }, [ entityRefreshData ]);

  const columns = [
    columnDef({title: 'Id', dataKey: 'id'}),
    columnDef({title: 'Nombre', dataKey: 'name'}),
    columnDef({title: 'Existencias', dataKey: 'currentLocationStock'}),
    columnMoneyDef({title: 'Costo', dataKey: 'cost'}),
    columnActionsDef(
      {
        title: 'Acciones',
        dataKey: 'id',
        detailAction: (value) => customNot('info', 'En desarrollo', 'Próximamente'),
        edit: includes([1, 2, 3, 4], getUserRole()),
        editAction: (value) => {
          setOpenForm(true);
          setFormUpdateMode(true);
          setEntityToUpdate(find(entityData, ['id', value]));
        },
      }
    ),
  ];

  return (
    <Wrapper xCenter>
      <PageHeader
        backIcon={false}
        onBack={() => null}
        title={<p style={{ color: '#FFFFFF' }}>Archivo de Materias Primas</p>}
        style={{ width: '100%' }}
        extra={[
          <Button key="1" type={'danger'} icon={<LogoutOutlined />} onClick={() => navigate('/inventory')}>
            Salir
          </Button>,
        ]}
      />
      <TableContainer>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <Space>
            <Search
              name={'filter'} 
              value={filter} 
              placeholder="Materia prima 1" 
              allowClear 
              style={{ width: 300 }}
              onChange={(e) => setFilter(e.target.value)}
            />
            <Button 
              type="primary" 
              style={{ backgroundColor: '#87ABEB', borderColor: '#325696' }} 
              icon={<SyncOutlined />} 
              onClick={(e) => setEntityRefreshData(entityRefreshData + 1)} 
            />
            { fetching ? <Spin /> : <></> }
          </Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            style={{ backgroundColor: '#4B81E1' }} 
            onClick={() => {
              setEntityToUpdate({});
              setOpenForm(true);
            }}
          >
            Nuevo
          </Button>
        </div>
        <Table 
          size='small'
          style={{ width: '100%' }}
          rowKey={'id'}
          dataSource={filterData(entityData, filter, ['name', 'cost']) || []}
          columns={columns} 
        />
      </TableContainer>
      <RawMaterialForm
        open={openForm} 
        updateMode={formUpdateMode} 
        dataToUpdate={entityToUpdate} 
        onClose={(refresh) => { 
          setOpenForm(false);
          setFormUpdateMode(false);
          if (refresh) { 
            setEntityRefreshData(entityRefreshData => entityRefreshData + 1); 
          }
        }}
      />
    </Wrapper>
  );
}

export default RawMaterials;
