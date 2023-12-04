import React, { useState, useEffect } from 'react';
import { Button, Col, DatePicker, Input, Radio, Row, Space, Table } from 'antd';
import { AppstoreAddOutlined, ClearOutlined, PlusOutlined, ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { useNavigate } from 'react-router-dom';

import { Wrapper } from '../styled-components/Wrapper.js';

import { customNot } from '../utils/Notifications.js';
import { filterData } from '../utils/Filters.js';
import { columnActionsDef, columnBadgeAlert, columnDatetimeDef, columnDef, columnIfValueEqualsTo, columnMoneyDef, columnNumberDef } from '../utils/ColumnsDefinitions.js';
import BrandForm from '../components/BrandForm.js';
import parkingCheckoutsServices from '../services/ParkingCheckoutsServices.js';
import NewParkingCheckout from '../components/NewParkingCheckout.js';
import ParkingCheckoutPreview from '../components/previews/ParkingCheckoutPreview.js';

import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';

const { Search } = Input;

function ParkingCheckouts() {
  const [fetching, setFetching] = useState(false);
  const [filter, setFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState(defaultDate());
  const [statusFilter, setStatusFilter] = useState(99);

  const [openForm, setOpenForm] = useState(false);
  const [formUpdateMode, setFormUpdateMode] = useState(false);

  const [entityData, setEntityData] = useState([]);
  const [entityToUpdate, setEntityToUpdate] = useState({});

  const [openPreview, setOpenPreview] = useState(false);
  const [entitySelectedId, setEntitySelectedId] = useState(0);

  const navigate = useNavigate();

  function defaultDate() {
    return moment();
  };

  async function loadData() {
    setFetching(true);
    const response = await parkingCheckoutsServices.find();
    setEntityData(response.data);
    setFetching(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    columnBadgeAlert({title: '', dataKey: 'hasPendingTickets' }),
    columnNumberDef({title: 'Código', dataKey: 'parkingCheckoutId', enableSort: true }),
    columnDatetimeDef({title: 'Fecha', dataKey: 'checkoutDatetime', enableSort: true}),
    columnDef({title: 'Inicial', dataKey: 'ticketNumberFrom'}),
    columnDef({title: 'Final', dataKey: 'ticketNumberTo'}),
    columnDef({title: 'Parqueos Usados', dataKey: 'numberOfParkings'}),
    columnDef({title: 'Vigilante', dataKey: 'parkingGuardFullname'}),
    columnDef({title: 'Observaciones', dataKey: 'notes'}),
    columnMoneyDef({title: 'Efectivo Entregado', dataKey: 'checkoutTotal'}),
  ];

  function getDataToShow() {
    if (statusFilter === 99 && monthFilter === null)
      return entityData;
    
    return entityData.filter((x) => (
      (statusFilter === 99 || x.hasPendingTickets === statusFilter)
      &&
      (monthFilter === null || moment(x.checkoutDatetime).format("MM-YYYY") === monthFilter.format("MM-YYYY"))
    ))
  }

  return (
    <Wrapper>
      <Row gutter={[16, 16]} style={{ width: '100%' }}>
        <Col span={24} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* <Search
            name={'filter'}
            value={filter} 
            placeholder="Código" 
            allowClear 
            style={{ width: 300 }}
            onChange={(e) => setFilter(e.target.value)}
            size={'large'}
          /> */}
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
              Nuevo Registro
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
        <Col span={24} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <DatePicker 
              locale={locale}
              format="MMMM-YYYY"
              picker='month'
              value={monthFilter}
              style={{ width: '100%' }}
              onChange={(datetimeMoment, datetimeString) => {
                setMonthFilter(datetimeMoment);
              }}
            />
            <Radio.Group
              options={[
                { label: 'Todos', value: 99 },
                { label: 'Pendientes', value: 1 },
                { label: 'Resueltos', value: 0 },
              ]}
              onChange={(e) => {
                setStatusFilter(e.target.value);
              }}
              value={statusFilter}
              optionType="button"
            />
            <Button
              icon={<ClearOutlined />}
              onClick={() => {
                setStatusFilter(99);
                setMonthFilter(null);
              }}
            >
              Reestablecer filtros
            </Button>
          </Space>
        </Col>
        <Col span={24}>
          <Table 
            loading={fetching}
            size='small'
            style={{ width: '100%' }}
            rowKey={'id'}
            dataSource={getDataToShow() || []}
            columns={columns}
            onRow={(record, rowIndex) => {
              return {
                onClick: (e) => {
                  e.preventDefault();
                  setEntitySelectedId(record.parkingCheckoutId);
                  setOpenPreview(true);
                }
              };
            }}
          />
        </Col>
      </Row>
      <NewParkingCheckout 
        open={openForm} 
        onClose={(refresh) => { 
          setOpenForm(false);
          setFormUpdateMode(false);
          if (refresh) { 
            loadData();
          }
        }}
      />
      <ParkingCheckoutPreview
        open={openPreview}
        parkingCheckoutId={entitySelectedId}
        onClose={(reload) => {
          if (reload) loadData(); 
          setOpenPreview(false);
          setEntitySelectedId(0);
        }} 
      />
    </Wrapper>
  );
}

export default ParkingCheckouts;
