import React, { useEffect, useState, useRef } from 'react';
import { Wrapper } from '../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Col, InputNumber, Row, Select, Modal, Input, Divider, Button, Statistic, Space, Card, Tag, Spin, DatePicker } from 'antd';
import productsServices from '../services/ProductsServices';
import { customNot } from '../utils/Notifications';

import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import { DeleteFilled, DeleteOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { CompanyInformation } from '../styled-components/CompanyInformation';
import { getUserId, getUserLocation } from '../utils/LocalData';
import expensesServices from '../services/ExpensesServices';
import generalsServices from '../services/GeneralsServices';
import { verifyFileExtension } from '../utils/VerifyFileExt';
import parkingExpensesServices from '../services/ParkingExpensesServices';
import { validateNumberData, validateSelectedData, validateStringData } from '../utils/ValidateData';

const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;


function NewParkingExpense(props) {
  const navigate = useNavigate();

  const [fetching, setFetching] = useState(false);

  const [paymentMethodsData, setPaymentMethodsData] = useState([]);
  const [expenseTypesData, setExpenseTypesData] = useState([]);

  const [documentNumber, setDocumentNumber] = useState('');
  const [documentDatetime, setDocumentDatetime] = useState(defaultDate());
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(1);
  const [expenseTypeSelected, setExpenseTypeSelected] = useState(0);
  const [accountCode, setAccountCode] = useState('');
  const [expenseConcept, setExpenseConcept] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(null);

  const { open, onClose } = props;

  async function loadData() {
    setFetching(true);
    try {
      const response1 = await expensesServices.findTypes();
      const response2 = await generalsServices.findPaymentMethods();

      setExpenseTypesData(response1.data);
      setPaymentMethodsData(response2.data);

      setFetching(false);
    } catch(error) {
      setFetching(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function defaultDate() {
    return moment();
  };

  function restoreState() {
    setDocumentNumber('');
    setDocumentDatetime(defaultDate());
    setPaymentMethodSelected(1);
    setExpenseTypeSelected(0);
    setAccountCode('');
    setExpenseConcept('');
    setExpenseDescription('');
    setExpenseAmount(null);
  }

  function validateData() {
    const validDocumentDatetime = documentDatetime !== null && documentDatetime.isValid();
    if (!validDocumentDatetime) customNot('warning', 'Seleccione una fecha válida', 'Dato no válido');
    return (
      validDocumentDatetime
      && validateSelectedData(expenseTypeSelected, 'Debe seleccionar un tipo de gasto')
      && validateSelectedData(paymentMethodSelected, 'Debe seleccionar un método de pago')
      // && validateStringData(documentNumber, 'Debe seleccionar un vigilante')
      // && validateStringData(accountCode, 'Debe seleccionar un vigilante')
      && validateStringData(expenseConcept, 'Debe especificar un concepto de gasto')
      && validateNumberData(expenseAmount, 'Debe especificar un monto de gasto válido')
    );
  }

  async function formAction() {
    if (validateData()) {
      setFetching(true);
      try {
        const response = await parkingExpensesServices.add(
          expenseTypeSelected,
          paymentMethodSelected,
          documentNumber,
          documentDatetime,
          accountCode,
          expenseConcept,
          expenseDescription,
          expenseAmount,
          getUserId()
        );

        if (response.status === 200) {
          setFetching(false);
          restoreState();
          onClose(true);
          return;
        }

        setFetching(false);
      } catch(error) {
        setFetching(false);
      }
    }
  }

  return (
    <Modal
      centered
      width={650}
      closable={false}
      maskClosable={false}
      open={open}
      footer={null}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <p style={{ margin: '0px', fontSize: 16, fontWeight: 600 }}>
            {'Nuevo Gasto - Control Parqueos'}
          </p>
        </Col>
        <Col span={16}>
          <p style={{ margin: '0px' }}>{'Fecha:'}</p>
          <DatePicker
            id={'g-new-parking-checkout-datepicker'}
            locale={locale}
            format="DD-MM-YYYY"
            // showTime
            value={documentDatetime}
            style={{ width: '100%' }}
            onFocus={() => {
              document.getElementById('g-new-parking-checkout-datepicker').select();
            }}
            onChange={(datetimeMoment, datetimeString) => {
              setDocumentDatetime(datetimeMoment);
              document.getElementById('parkingcheckout-form-guard-selector').focus();
            }}
          />
        </Col>
        <Col span={8}></Col>
        <Col span={8}>
          <p style={{ margin: 0 }}>N° Documento:</p>
          <Input
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
          />
        </Col>
        <Col  span={8}>
          <p style={{ margin: 0 }}>Tipo:</p>
          <Select 
            dropdownStyle={{ width: '100%' }} 
            style={{ width: '100%' }} 
            value={expenseTypeSelected} 
            onChange={(value) => {
              setExpenseTypeSelected(value);
            }}
            optionFilterProp='children'
            showSearch
            filterOption={(input, option) =>
              (option.children).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option key={0} value={0} disabled>{'No seleccionado'}</Option>
            {
              (expenseTypesData || []).map((element, index) => (
                <Option key={index} value={element.id}>{element.name}</Option>
              ))
            }
          </Select>
        </Col>
        <Col span={8}>
          <p style={{ margin: 0 }}>Pago:</p>
          <Select 
            dropdownStyle={{ width: '100%' }} 
            style={{ width: '100%' }}
            value={paymentMethodSelected}
            onChange={(value) => {
              setPaymentMethodSelected(value);
            }}
            optionFilterProp='children'
            showSearch
            filterOption={(input, option) =>
              (option.children).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option key={0} value={0} disabled>{'No seleccionado'}</Option>
            {
              (paymentMethodsData || []).map((element, index) => (
                <Option key={index} value={element.id}>{element.name}</Option>
              ))
            }
          </Select>
        </Col>
        <Col span={12}>
          <p style={{ margin: 0 }}>Concepto:</p>
          <Input value={expenseConcept} onChange={(e) => setExpenseConcept(e.target.value)}/>
        </Col>
        <Col span={12}>
          <p style={{ margin: 0 }}>Descripción:</p>
          <TextArea style={{ resize: 'none' }} rows={3} value={expenseDescription} onChange={(e) => setExpenseDescription(e.target.value)}/>
        </Col>
        <Col span={12}>
          <p style={{ margin: 0 }}>Monto:</p>
          <InputNumber value={expenseAmount} onChange={(value) => setExpenseAmount(value)} prefix={'$'} precision={2} style={{ width: '150px' }} />
        </Col>
        <Col span={12}>
          <p style={{ margin: 0 }}>Cuenta:</p>
          <Input value={accountCode} onChange={(e) => setAccountCode(e.target.value)}/>
        </Col>
        
        <Col span={12}>
          <Button 
            type={'default'} 
            onClick={(e) => {
              restoreState();
              onClose(false)
            }}
            style={{ width: '100%' }} 
          >
            Cancelar
          </Button>
        </Col>
        <Col span={12}>
          <Button 
            type={'primary'} 
            icon={<SaveOutlined />} 
            onClick={(e) => formAction()} 
            style={{ width: '100%' }} 
            loading={fetching}
            disabled={fetching}
          >
            Guardar
          </Button>
        </Col>
      </Row>
    </Modal>
  );
}

export default NewParkingExpense;
