import React, { useState, useEffect } from 'react';
import { Button, Col, DatePicker, Input, Radio, Row, Select, Space, Table } from 'antd';
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
import parkingExpensesServices from '../services/ParkingExpensesServices.js';
import NewParkingExpense from '../components/NewParkingExpense.js';
import generalsServices from '../services/GeneralsServices.js';
import ParkingExpensePreview from '../components/previews/ParkingExpensePreview.js';

const { Search } = Input;
const { Option } = Select;

function ParkingExpenses() {
  const [fetching, setFetching] = useState(false);
  const [filter, setFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState(defaultDate());
  const [expenseTypeFilter, setExpenseTypeFilter] = useState(0);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState(0);

  const [openForm, setOpenForm] = useState(false);
  const [formUpdateMode, setFormUpdateMode] = useState(false);

  const [entityData, setEntityData] = useState([]);
  const [entityToUpdate, setEntityToUpdate] = useState({});

  const [expenseTypesData, setExpenseTypesData] = useState([]);
  const [paymentMethodsData, setPaymentMethodsData] = useState([]);

  const [openPreview, setOpenPreview] = useState(false);
  const [entitySelectedId, setEntitySelectedId] = useState(0);

  const navigate = useNavigate();

  function defaultDate() {
    return moment();
  };

  async function loadData() {
    setFetching(true);
    try {
      const response = await parkingExpensesServices.find();
      setEntityData(response.data);
      setFetching(false);
    } catch(error) {
      setFetching(false);
    }
  }

  async function loadGenData() {
    setFetching(true);
    try {
      const response1 = await generalsServices.findPaymentMethods();
      const response2 = await parkingExpensesServices.findTypes();

      setPaymentMethodsData(response1.data);
      setExpenseTypesData(response2.data);

      setFetching(false);
    } catch(error) {
      setFetching(false);
    }
  }

  useEffect(() => {
    loadData();
    loadGenData();
  }, []);

  const columns = [
    // columnNumberDef({title: 'Código', dataKey: 'parkingExpenseId', enableSort: true }),
    columnDef({title: 'N° Doc', dataKey: 'documentNumber'}),
    columnDatetimeDef({title: 'Fecha', dataKey: 'documentDatetime', enableSort: true}),
    columnDef({title: 'Tipo', dataKey: 'expenseTypeName'}),
    columnDef({title: 'Pago', dataKey: 'paymentMethodName'}),
    columnDef({title: 'Concepto', dataKey: 'concept'}),
    columnMoneyDef({title: 'Monto', dataKey: 'amount'})
  ];

  function getDataToShow() {
    if (paymentMethodFilter === 0 && expenseTypeFilter === 0 && monthFilter === null)
      return entityData;
    
    return entityData.filter((x) => (
      (paymentMethodFilter === 0 || x.paymentMethodId === paymentMethodFilter)
      &&
      (expenseTypeFilter === 0 || x.expenseTypeId === expenseTypeFilter)
      &&
      (monthFilter === null || moment(x.documentDatetime).format("MM-YYYY") === monthFilter.format("MM-YYYY"))
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
              Nuevo Gasto
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
          <Space wrap>
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
            <Select 
              dropdownStyle={{ width: '200px' }} 
              style={{ width: '200px' }} 
              value={expenseTypeFilter} 
              onChange={(value) => {
                setExpenseTypeFilter(value);
              }}
              optionFilterProp='children'
              showSearch
              filterOption={(input, option) =>
                (option.children).toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option key={0} value={0} disabled>{'Tipo'}</Option>
              {
                (expenseTypesData || []).map((element, index) => (
                  <Option key={index} value={element.id}>{element.name}</Option>
                ))
              }
            </Select>
            <Radio.Group
              options={([{id: 0, name: 'Todos'}, ...paymentMethodsData] || []).map((x) => ({ label: x.name, value: x.id }))}
              onChange={(e) => {
                setPaymentMethodFilter(e.target.value);
              }}
              value={paymentMethodFilter}
              optionType="button"
            />
            <Button
              icon={<ClearOutlined />}
              onClick={() => {
                setPaymentMethodFilter(0);
                setExpenseTypeFilter(0);
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
            dataSource={filterData(getDataToShow(), filter, ['documentNumber', 'concept']) || []}
            columns={columns}
            onRow={(record, rowIndex) => {
              return {
                onClick: (e) => {
                  e.preventDefault();
                  setEntitySelectedId(record.parkingExpenseId);
                  setOpenPreview(true);
                }
              };
            }}
          />
        </Col>
      </Row>
      <NewParkingExpense 
        open={openForm} 
        onClose={(refresh) => { 
          setOpenForm(false);
          setFormUpdateMode(false);
          if (refresh) { 
            loadData();
          }
        }}
      />
      <ParkingExpensePreview
        open={openPreview}
        parkingExpenseId={entitySelectedId}
        onClose={(reload) => {
          if (reload) loadData(); 
          setOpenPreview(false);
          setEntitySelectedId(0);
        }} 
      />
    </Wrapper>
  );
}

export default ParkingExpenses;
