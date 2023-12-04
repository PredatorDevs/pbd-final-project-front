import React, { useState, useEffect } from 'react';
import { Avatar, Button, Col, Input, List, PageHeader, Radio, Row, Skeleton, Space, Spin, Table } from 'antd';
import { CheckOutlined, LogoutOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { useNavigate } from 'react-router-dom';

import brandsServices from '../services/BrandsServices.js';

import { Wrapper } from '../styled-components/Wrapper';
import { TableContainer } from '../styled-components/TableContainer';

import { customNot } from '../utils/Notifications';
import { filterData } from '../utils/Filters';
import { columnActionsDef, columnDef } from '../utils/ColumnsDefinitions';
import BrandForm from '../components/BrandForm.js';
import ConfirmMovementForm from '../components/ConfirmMovementForm.js';

const { Search } = Input;

function Movements() {
  const [fetching, setFetching] = useState(false);
  const [filter, setFilter] = useState('');

  const [tabIndex, setTabIndex] = useState(1);
  
  const [openForm, setOpenForm] = useState(false);
  const [formUpdateMode, setFormUpdateMode] = useState(false);

  const [entityData, setEntityData] = useState([]);
  const [entityRefreshData, setEntityRefreshData] = useState(0);
  const [entityToUpdate, setEntityToUpdate] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    setFetching(true);
    brandsServices.find()
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
    columnDef({title: 'Nombres', dataKey: 'name'}),
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
    <Wrapper xCenter>
      <PageHeader
        backIcon={false}
        onBack={() => null}
        title={<p style={{ color: '#FFFFFF' }}>Traslados</p>}
        style={{ width: '100%' }}
        extra={[
          <Button key="1" type={'danger'} icon={<LogoutOutlined />} onClick={() => navigate('/main')}>
            Salir
          </Button>,
        ]}
      />
      {/* <div style={{ width: '100%' }}>
        <Space wrap>
          <Button type={tabIndex === 1 ? 'primary' : 'default'} onClick={(e) => { setTabIndex(1) }}>
            Pendientes
          </Button>
          <Button type={tabIndex === 2 ? 'primary' : 'default'} onClick={(e) => { setTabIndex(2) }}>
            Confirmados
          </Button>
          <Button type={tabIndex === 3 ? 'primary' : 'default'} onClick={(e) => { setTabIndex(3) }}>
            Rechazados
          </Button>
        </Space>
      </div> */}
      <Row gutter={8} style={{ width: '100%', marginTop: 10 }}>
        <Col span={12}>
          <div style={{ width: '100%', borderRadius: 10, padding: 5, backgroundColor: '#325696' }}>
            <List
              className="demo-loadmore-list"
              loading={false}
              itemLayout="horizontal"
              pagination
              // loadMore={loadMore}
              size='small'
              dataSource={[{ src: 'https://cdn-icons-png.flaticon.com/512/2183/2183565.png' }, {}, {src: 'https://cdn-icons-png.flaticon.com/512/9013/9013827.png'}, { src: 'https://cdn-icons-png.flaticon.com/512/2183/2183565.png' }, {}, {src: 'https://cdn-icons-png.flaticon.com/512/9013/9013827.png'}, {}, {src: 'https://cdn-icons-png.flaticon.com/512/9013/9013827.png'}, {}, {}, {}, {}, {}, {}, {}]}
              renderItem={(element, index) => (
                <List.Item
                  style={{ backgroundColor: index % 2 !== 0 ? '#213964' : 'inherit' }}
                  actions={[
                    <Button type={'primary'} icon={<CheckOutlined/>} onClick={(e) => setOpenForm(true)}>Recibir</Button>
                  ]}
                >
                  <Skeleton avatar title={false} loading={false} active>
                    <List.Item.Meta
                      avatar={<Avatar src={element.src || 'https://cdn-icons-png.flaticon.com/512/5290/5290058.png'} />}
                      title={<p style={{ margin: 0, color: 'white' }}>{'Traslado #123'}</p>}
                      // description="Este traslado aún no ha sido confirmado de recibido"
                    />
                    {/* <div><p style={{ margin: 0, color: 'white' }}>{'Este traslado aún no ha sido confirmado de recibido'}</p></div> */}
                  </Skeleton>
                </List.Item>
              )}
            />
            </div>
        </Col>
        <Col span={12}>
        
        </Col>
      </Row>
      
      
      {/* <TableContainer>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <Space>
            <Search
              name={'filter'} 
              value={filter} 
              placeholder="Marca 1" 
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
          dataSource={filterData(entityData, filter, ['name']) || []}
          columns={columns} 
        />
      </TableContainer> */}
      <ConfirmMovementForm 
        open={openForm} 
        updateMode={formUpdateMode} 
        dataToUpdate={entityToUpdate} 
        onClose={(refresh) => { 
          setOpenForm(false);
        }}
      />
    </Wrapper>
  );
}

export default Movements;
