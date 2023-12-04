import React, { useEffect, useState, useRef } from 'react';
import { Wrapper } from '../../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Col, InputNumber, Row, Select, Modal, Input, Divider, Button, Statistic, Space, Card, Tag, Spin, DatePicker } from 'antd';
import productsServices from '../../services/ProductsServices';
import { customNot } from '../../utils/Notifications';

import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import { DeleteFilled, DeleteOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { CompanyInformation } from '../../styled-components/CompanyInformation';
import { getUserId, getUserLocation } from '../../utils/LocalData';
import expensesServices from '../../services/ExpensesServices';
import generalsServices from '../../services/GeneralsServices';
import { verifyFileExtension } from '../../utils/VerifyFileExt';

const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;

const Container = styled.div`
  background-color: #454D68;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  box-shadow: 3px 3px 5px 0px #6B738F;
  -webkit-box-shadow: 3px 3px 5px 0px #6B738F;
  -moz-box-shadow: 3px 3px 5px 0px #6B738F;
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  padding: 20px;
  width: 100%;
  color: white;
  .form-label {
    margin: 0px;
  }
`;

function NewExpense() {
  const navigate = useNavigate();

  // const componentRef = useRef();

  const [fetching, setFetching] = useState(false);
  const [entityRefreshData, setEntityRefreshData] = useState(0);

  const [ableToUpload, setAbleToUpload] = useState(false);

  // const [printData, setPrintData] = useState([]);
  // const [printDataDetails, setPrintDataDetails] = useState([]);
  const [paymentMethodsData, setPaymentMethodsData] = useState([]);
  const [expenseTypesData, setExpenseTypesData] = useState([]);

  const [docNumber, setDocNumber] = useState('');
  const [docDatetime, setDocDatetime] = useState(defaultDate());
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(1);
  const [expenseTypeSelected, setExpenseTypeSelected] = useState(0);
  const [accountCode, setAccountCode] = useState('');
  const [expenseConcept, setExpenseConcept] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(null);

  const [expenseAttachment, setExpenseAttachment] = useState(null);

  useEffect(() => {
    setFetching(true);
    expensesServices.findTypes()
    .then((response) => {
      const { data } = response;
      setExpenseTypesData(data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }, [ entityRefreshData ]);

  useEffect(() => {
    setFetching(true);
    generalsServices.findPaymentMethods()
    .then((response) => {
      const { data } = response;
      setPaymentMethodsData(data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }, [ entityRefreshData ]);

  function defaultDate() {
    return moment();
  };

  function validateData() {
    const validDocDatetime = docDatetime.isValid();
    const validExpenseTypeSelected = expenseTypeSelected !== 0 && expenseTypeSelected !== null;
    const validPaymentMethodSelected = paymentMethodSelected !== 0 && paymentMethodSelected !== null;
    const validExpenseConcept = expenseConcept !== '';
    const validExpenseAmount = expenseAmount >= 0;
    const validExpenseAttachment = ((expenseAttachment === null) || ((expenseAttachment !== null) && ableToUpload === true));
    if (!validDocDatetime) customNot('warning', 'Debe seleccionar una fecha válida', 'Dato no válido');
    if (!validExpenseTypeSelected) customNot('warning', 'Debe seleccionar un tipo de gasto', 'Dato no válido');
    if (!validPaymentMethodSelected) customNot('warning', 'Debe seleccionar un tipo de pago', 'Dato no válido');
    if (!validExpenseConcept) customNot('warning', 'Debe definir un concepto de gasto', 'Dato no válido');
    if (!validExpenseAmount) customNot('warning', 'Debe definir una monto de gasto', 'Dato no válido');
    if (!validExpenseAttachment) customNot('warning', 'Debe seleccionar un archivo con formato válido', 'Adjunto no válido');
    return (
      validDocDatetime && validExpenseTypeSelected && validPaymentMethodSelected && validExpenseConcept && validExpenseAmount && validExpenseAttachment
    );
  }

  function formAction() {
    if (validateData()) {
      // customNot('success', 'Operación exitosa', 'Gasto añadido');
      setFetching(true);
      expensesServices.add(
        getUserLocation() || 1,
        expenseTypeSelected,
        paymentMethodSelected,
        docNumber || '',
        docDatetime.format('YYYY-MM-DD HH:mm:ss'),
        accountCode || '',
        expenseConcept || '',
        expenseDescription || '',
        expenseAmount || 0,
        getUserId(),
        expenseAttachment
      )
      .then((response) => {
        // alert("SUCESS");
        customNot('success', 'Operación exitosa', 'Gasto añadido');
        setFetching(false);
        navigate('/main/expenses/summary');
      })
      .catch((error) => {
        setFetching(false);
        customNot('error', 'El gasto no fue registrado', 'Revise conexión');
      })
    }
  }

  return (
    <Wrapper>
      <Row gutter={[16, 16]} style={{ width: '100%' }}>
        <Col span={12}>
          <p style={{ margin: '0px' }}>{'Fecha:'}</p>
          <DatePicker
            id={'g-new-parking-checkout-datepicker'}
            locale={locale}
            format="DD-MM-YYYY"
            // showTime
            value={docDatetime}
            style={{ width: '100%' }}
            onFocus={() => {
              document.getElementById('g-new-parking-checkout-datepicker').select();
            }}
            onChange={(datetimeMoment, datetimeString) => {
              setDocDatetime(datetimeMoment);
              document.getElementById('parkingcheckout-form-guard-selector').focus();
            }}
          />
        </Col>
        <Col span={12}>

        </Col>
        <Col span={8}>
          <p style={{ margin: 0 }}>N° Documento:</p>
          <Input
            value={docNumber}
            onChange={(e) => setDocNumber(e.target.value)}
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
        <Col span={8}>
        </Col>
        <Col span={8}>
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
        <Col span={8}>
        </Col>
      </Row>
      {/* <Container>
        <Spin tip="Aplicando cambios" size="large" spinning={fetching}>
          <Row gutter={[16, 16]}>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 4 }} xxl={{ span: 4 }}>
              <p className={'form-label'}>N° Doc / Referencia:</p>
              <Input value={docNumber} onChange={(e) => setDocNumber(e.target.value)}/>
            </Col>
            <Col  xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 4 }} xxl={{ span: 4 }}>
              <p className={'form-label'}>Tipo:</p>
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
            <Col  xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 4 }} xxl={{ span: 4 }}>
              <p className={'form-label'}>Pago:</p>
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
            <Col  xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }}>
              <p className={'form-label'}>Cuenta:</p>
              <Input value={accountCode} onChange={(e) => setAccountCode(e.target.value)}/>
            </Col>
            <Col  xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
              <p className={'form-label'}>Concepto:</p>
              <Input value={expenseConcept} onChange={(e) => setExpenseConcept(e.target.value)}/>
            </Col>
            <Col  xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 4 }} xxl={{ span: 4 }}>
              <p className={'form-label'}>Monto:</p>
              <InputNumber value={expenseAmount} onChange={(value) => setExpenseAmount(value)} prefix={'$'} precision={2} style={{ width: '100%' }} />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }}>
              <p className={'form-label'}>Descripción:</p>
              <TextArea style={{ resize: 'none' }} rows={3} value={expenseDescription} onChange={(e) => setExpenseDescription(e.target.value)}/>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }}>
              <p className={'form-label'}>Adjuntar:</p>
              <Space direction='vertical'>
                <Button icon={<UploadOutlined />} size={'large'} onClick={() => { document.getElementById('g-input-expense-file-uploader').click(); }}>
                  Seleccionar archivo
                </Button>
                <Tag>{`${expenseAttachment !== null ? expenseAttachment.name : ''}`}</Tag>
                <Button danger type={'primary'} icon={<DeleteOutlined />} size={'small'} style={{ display: expenseAttachment === null ? 'none' : 'inline' }} onClick={() => { setExpenseAttachment(null); customNot('warning', 'Archivo removido', 'Adjunto quitado'); }}>
                  Quitar
                </Button>
              </Space>
              <input
                type="file" 
                accept='.png, .jpg, .jpeg, .pdf, .xls, .xlsx, .doc, .docx'
                name="g-input-expense-file-uploader" 
                id="g-input-expense-file-uploader"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const [ file ] = e.target.files;
                  if (file !== undefined) {
                    setExpenseAttachment(file);
                    if (
                      verifyFileExtension(file.name, 'pdf') || 
                      verifyFileExtension(file.name, 'xls') ||
                      verifyFileExtension(file.name, 'xlsx') ||
                      verifyFileExtension(file.name, 'doc') ||
                      verifyFileExtension(file.name, 'docx') ||
                      verifyFileExtension(file.name, 'png') ||
                      verifyFileExtension(file.name, 'jpeg') ||
                      verifyFileExtension(file.name, 'jpg')
                    ) {
                      setAbleToUpload(true);
                      customNot('info', 'Archivo seleccionado', 'Adjunto válido');
                    } else {
                      setAbleToUpload(false);
                      customNot('warning', 'Debe seleccionar un archivo con formato válido', 'Adjunto no válido');
                    }
                  } else {
                    setExpenseAttachment(null);
                  }}
                }
              />
            </Col>
            <Col style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', padding: 20 }} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>
              <Space>
                <Button size='large' onClick={(e) => navigate('/expenses')}>Cancelar</Button>
                <Button type='primary' onClick={(e) => formAction()} size='large' icon={<SaveOutlined />} disabled={fetching}>Guardar</Button>
              </Space>
            </Col>
          </Row>
        </Spin>
      </Container> */}
    </Wrapper>
  );
}

export default NewExpense;
