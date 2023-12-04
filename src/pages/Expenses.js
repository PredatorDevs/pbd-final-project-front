import { Col, Row, Button, DatePicker, Table, Space, Select, Input, Radio } from 'antd';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Wrapper } from '../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import { ClearOutlined, LogoutOutlined, PlusOutlined } from '@ant-design/icons';
import { TableContainer } from '../styled-components/TableContainer';
import { columnActionsDef, columnDatetimeDef, columnDef, columnIfValueEqualsTo, columnMoneyDef } from '../utils/ColumnsDefinitions';
import { customNot } from '../utils/Notifications';
import { CompanyInformation } from '../styled-components/CompanyInformation';
import expensesServices from '../services/ExpensesServices';
import ExpensePreview from '../components/previews/ExpesePreview';

import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import generalsServices from '../services/GeneralsServices';
import { filterData } from '../utils/Filters';

const { Search } = Input;
const { Option } = Select;

function Expenses() {
  const [fetching, setFetching] = useState(false);
  const [entityRefreshData, setEntityRefreshData] = useState(0);

  const [filter, setFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState(defaultDate());
  const [expenseTypeFilter, setExpenseTypeFilter] = useState(0);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState(0);

  const [expenseTypesData, setExpenseTypesData] = useState([]);
  const [paymentMethodsData, setPaymentMethodsData] = useState([]);

  const [entityData, setEntityData] = useState([]);
  const [openPreview, setOpenPreview] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [entitySelectedId, setEntitySelectedId] = useState(0);

  const navigate = useNavigate();

  function loadData(){
    setFetching(true);
    expensesServices.find()
    .then((response) => {
      setEntityData(response.data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }

  async function loadGenData() {
    setFetching(true);
    try {
      const response1 = await generalsServices.findPaymentMethods();
      const response2 = await expensesServices.findTypes();

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
  }, [ entityRefreshData ]);

  const columns = [
    columnDef({title: 'Id', dataKey: 'expenseId', ifNull: '-'}),
    columnDef({title: 'N° Doc', dataKey: 'docNumber', ifNull: '-'}),
    columnDatetimeDef({title: 'Fecha', dataKey: 'docDatetime'}),
    columnDef({title: 'Tipo', dataKey: 'expenseTypeName', ifNull: '-'}),
    columnDef({title: 'Pago', dataKey: 'paymentMethodName'}),
    columnDef({title: 'Concepto', dataKey: 'concept'}),
    columnIfValueEqualsTo({title: '', dataKey: 'isVoided', valueToCompare: 1 }),
    columnMoneyDef({title: 'Monto', dataKey: 'amount'}),
    columnActionsDef(
      {
        title: 'Acciones',
        dataKey: 'expenseId',
        detailAction: (value) => {
          setEntitySelectedId(value);
          setOpenPreview(true);
          // alert(value);
        },
        edit: false
      }
    ),
  ];

  function defaultDate() {
    return moment();
  };

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
            columns={columns}
            rowKey={'expenseId'}
            size={'small'}
            dataSource={filterData(getDataToShow(), filter, ['documentNumber', 'concept']) || [] || []}
            loading={fetching}
            onRow={(record, rowIndex) => {
              return {
                onClick: (e) => {
                  e.preventDefault();
                  setEntitySelectedId(record.expenseId);
                  setOpenPreview(true);
                }
              };
            }}
          />
        </Col>
      </Row>
      <ExpensePreview
        open={openPreview}
        expenseId={entitySelectedId}
        onClose={(wasVoided) => {
          setOpenPreview(false);
          if (wasVoided) loadData();
        }}
      />
      {/* <OrderSaleForm
        open={openForm}
        orderSaleId={entitySelectedId}
        onRefresh={() => loadData()}
        onClose={() => setOpenForm(false)}
      /> */}
    </Wrapper>
  );
}

export default Expenses;
