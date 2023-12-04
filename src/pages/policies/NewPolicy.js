import React, { useEffect, useState, useRef } from 'react';
import { Wrapper } from '../../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Col, InputNumber, Row, Select, Modal, Input, Divider, Button, Statistic, Space, Card } from 'antd';
import productsServices from '../../services/ProductsServices';
import { customNot } from '../../utils/Notifications';

import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import { SaveOutlined } from '@ant-design/icons';
import { CompanyInformation } from '../../styled-components/CompanyInformation';
import { getUserId, getUserLocation } from '../../utils/LocalData';
// import orderSalesServices from '../../services/OrderSalesServices';
// import ReactToPrint from 'react-to-print';
// import OrderSaleTicket from '../../components/tickets/OrderSaleTicket';
import policiesServices from '../../services/PoliciesServices';
import generalsServices from '../../services/GeneralsServices';
import { isEmpty } from 'lodash';

const { Option } = Select;
const { confirm } = Modal;

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
`;

function NewPolicy() {
  const navigate = useNavigate();

  // const componentRef = useRef();

  const [fetching, setFetching] = useState(false);
  const [entityRefreshData, setEntityRefreshData] = useState(0);
  // const [printData, setPrintData] = useState([]);
  // const [printDataDetails, setPrintDataDetails] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [validDocNumber, setValidDocNumber] = useState(true);

  const [docNumber, setDocNumber] = useState('');
  const [docDatetime, setDocDatetime] = useState(defaultDate());
  const [supplier, setSupplier] = useState('');
  const [transactionValue, setTransactionValue] = useState(0);
  const [transportationCost, setTranportationCost] = useState(0);
  const [insuranceCost, setInsuranceCost] = useState(0);
  const [customTotalValue, setCustomTotalValue] = useState(0);
  const [incoterm, setIncoterm] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [productIdSelected, setProductIdSelected] = useState(0);
  const [measurementUnitIdSelected, setMeasurementUnitIdSelected] = useState(1);
  const [productQuantity, setProductQuantity] = useState(0);
  const [productCost, setProductCost] = useState(0);

  useEffect(() => {
    setFetching(true);
    productsServices.find()
    .then((response) => {
      const { data } = response;
      setProductsData(data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }, [ entityRefreshData ]);

  useEffect(() => {
    // setFetching(true);
    // customersServices.findByLocation(getUserLocation())
    // .then((response) => {
    //   const { data } = response;
    //   setCustomersData(data);
    //   setFetching(false);
    // })
    // .catch((error) => {
    //   customNot('error', 'Sin información', 'Revise su conexión a la red');
    //   setFetching(false);
    // });
  }, [ entityRefreshData ]);

  function defaultDate() {
    return moment();
  };

  function validateData() {
    const validDocDatetime = docDatetime.isValid();
    const validDocumentNumber = !isEmpty(docNumber);
    const validProductIdSelected = productIdSelected !== 0 && productIdSelected !== null;
    const validMeasurementUnitIdSelected = measurementUnitIdSelected !== 0 && measurementUnitIdSelected !== null;
    const validProductQuantity = productQuantity >= 0;
    const validProductCost = productCost >= 0;
    if (!validDocDatetime) customNot('warning', 'Debe seleccionar una fecha válida', 'Dato no válido');
    if (!validDocumentNumber) customNot('warning', 'Debe colocar un número de póliza', 'Dato no válido');
    if (!validDocNumber) customNot('warning', 'Correlativo ya registrado', 'El correlativo especificado ya pertenece a un documento');
    if (!validProductIdSelected) customNot('warning', 'Debe seleccionar un producto', 'Dato no válido');
    if (!validMeasurementUnitIdSelected) customNot('warning', 'Seleccione una unidad de medida', 'Dato no válido');
    if (!validProductQuantity) customNot('warning', 'Cantidad de producto debe ser igual o mayor a 0', 'Dato no válido');
    if (!validProductCost) customNot('warning', 'Costo unitario de producto debe ser igual o mayor a 0', 'Dato no válido');
    return (validDocDatetime && validDocumentNumber && validProductIdSelected && validMeasurementUnitIdSelected && validProductQuantity && validProductCost && validDocNumber);
  }

  function validateDocNumber() {
    setFetching(true);
    if (isEmpty(docNumber)) {
      setFetching(false);
      setValidDocNumber(true);
    } else {
      generalsServices.validatePolicyDocNumber(docNumber || '')
      .then((response) => {
        const { validated } = response.data[0];
        if (validated === 0) {
          setValidDocNumber(false);
          customNot('warning', 'Correlativo ya registrado', 'El correlativo especificado ya pertenece a un documento');
        } else {
          setValidDocNumber(true);
        }
        setFetching(false);
      })
      .catch((error) => {
        setFetching(false);
        setValidDocNumber(false);
        customNot('error', 'Algo salió mal', 'Verificación de correlativo fallido');
      });
    }
  }

  function formAction() {
    if (validateData()) {
      setFetching(true);
      policiesServices.add(
        getUserLocation() || 1,
        docNumber || '',
        docDatetime.format('YYYY-MM-DD HH:mm:ss'),
        supplier || '',
        transactionValue || 0.00,
        transportationCost || 0.00,
        insuranceCost || 0.00,
        customTotalValue || 0.00,
        incoterm || 0.00,
        exchangeRate || 0.00,
        getUserId()
      )
      .then((response) => {
        // customNot('success', 'Operación exitosa', 'Compra añadida');
        const { insertId } = response.data;
        policiesServices.details.add(
          insertId, 
          productIdSelected,
          measurementUnitIdSelected,
          productQuantity || 0,
          productCost || 0
        )
        .then((response) => {
          // setPrintDataDetails(response.data);
          // customNot('info', '', 'Imprimiendo');
          // document.getElementById('print-newordersale-button').click();
          navigate('/policies');
          setFetching(false);
        }).catch((error) => {
          // IF THE INFO FETCH FAILS IT RETURNS BACK
          // navigate('/policies');
          setFetching(false);
          customNot('error', 'Detalles de la póliza no fueron registrados', 'Revise conexión');
        });
      })
      .catch((error) => {
        setFetching(false);
        customNot('error', 'La póliza no fue registrada', 'Revise conexión');
      })
    }
  }

  return (
    <Wrapper xCenter>
      {/* <div style={{ display: 'none' }}>
        <ReactToPrint
          trigger={() => <button id="print-newordersale-button">Print</button>}
          content={() => componentRef.current}
        />
        <OrderSaleTicket 
          ref={componentRef} 
          ticketData={printData[0] || {}}
          ticketDetail={printDataDetails || []}
        />
      </div> */}
      <CompanyInformation>
        <section className='company-info-container'>
          <p className='module-name'>Nueva Póliza</p>
        </section>
      </CompanyInformation>
      <Container>
        <Row gutter={[10, 10]}>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
            <p>Número de Póliza</p>
            <Input value={docNumber} onChange={(e) => setDocNumber(e.target.value)} onBlur={(e) => { validateDocNumber(); }} />
          </Col>
        </Row>
        <Row gutter={[10, 10]}>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
            <p>Proveedor:</p>
            <Input value={supplier} onChange={(e) => setSupplier(e.target.value)}/>
          </Col>
        </Row>
        <Divider style={{ color: 'white' }}>Valores totales</Divider>
        <Row gutter={[10, 10]}>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 4 }} xl={{ span: 4 }} xxl={{ span: 4 }}>
            <p>Valor de transacción</p>
            <InputNumber value={transactionValue} onChange={(value) => setTransactionValue(value)} prefix={'$'} precision={2} style={{ width: '100%' }} />
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 4 }} xl={{ span: 4 }} xxl={{ span: 4 }}>
            <p>Gastos de transporte</p>
            <InputNumber value={transportationCost} onChange={(value) => setTranportationCost(value)} prefix={'$'}  precision={2} style={{ width: '100%' }} />
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 4 }} xl={{ span: 4 }} xxl={{ span: 4 }}>
            <p>Gastos de seguro</p>
            <InputNumber value={insuranceCost} onChange={(value) => setInsuranceCost(value)} prefix={'$'}  precision={2} style={{ width: '100%' }} />
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 4 }} xl={{ span: 4 }} xxl={{ span: 4 }}>
            <p>Valor en Aduana Total</p>
            <InputNumber value={customTotalValue} onChange={(value) => setCustomTotalValue(value)} prefix={'$'}  precision={2} style={{ width: '100%' }} />
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 4 }} xl={{ span: 4 }} xxl={{ span: 4 }}>
            <p>Incoterm</p>
            <InputNumber value={incoterm} onChange={(value) => setIncoterm(value)} prefix={'$'}  precision={2} style={{ width: '100%' }} />
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 4 }} xl={{ span: 4 }} xxl={{ span: 4 }}>
            <p>Tasa de Cambio</p>
            <InputNumber value={exchangeRate} onChange={(value) => setExchangeRate(value)} prefix={'$'}  precision={2} style={{ width: '100%' }} />
          </Col>
        </Row>
        <Divider style={{ color: 'white' }}>Mercancía</Divider>
        <Row gutter={[10, 10]}>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }}>
            <p>Descripción</p>
            <Select 
              dropdownStyle={{ width: '100%' }} 
              style={{ width: '100%' }} 
              value={productIdSelected} 
              onChange={(value) => {
                setProductIdSelected(value);
              }}
              optionFilterProp='children'
              showSearch
              filterOption={(input, option) =>
                (option.children).toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option key={0} value={0} disabled>{'No seleccionado'}</Option>
              {
                (productsData || []).map(
                  (element) => <Option key={element.productId} value={element.productId}>{element.productName}</Option>
                )
              }
            </Select>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 4 }} xl={{ span: 4 }} xxl={{ span: 4 }}>
            <p>Cantidad</p>
            <InputNumber value={productQuantity} onChange={(value) => setProductQuantity(value)} style={{ width: '100%' }} />
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 4 }} xl={{ span: 4 }} xxl={{ span: 4 }}>
            <p>Unidad de Medida</p>
            <Select 
              dropdownStyle={{ width: '100%' }} 
              style={{ width: '100%' }} 
              value={measurementUnitIdSelected} 
              onChange={(value) => {
                setMeasurementUnitIdSelected(value);
              }}
              optionFilterProp='children'
              showSearch
              filterOption={(input, option) =>
                (option.children).toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option key={0} value={0} disabled>{'No seleccionado'}</Option>
              <Option key={1} value={1}>{'Libras'}</Option>
            </Select>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 4 }} xl={{ span: 4 }} xxl={{ span: 4 }}>
            <p>Costo por libra</p>
            <InputNumber value={productCost} onChange={(value) => setProductCost(value)} prefix={'$'} style={{ width: '100%' }} />
          </Col>
        </Row>
        <Divider style={{ color: 'white' }}>Totales</Divider>
        <Row gutter={[10, 10]}>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
            <Card bodyStyle={{ backgroundColor: '#3E4057', borderRadius: 5 }} size={'small'}>
              <Statistic 
                title={
                  <p style={{ color: '#FFF', margin: 0 }}>Valores Totales</p>
                }
                prefix={'$'} 
                precision={2} 
                value={
                  (transactionValue || 0) + (transportationCost || 0) +
                  (insuranceCost || 0) + (customTotalValue || 0) +
                  (incoterm || 0) + (exchangeRate || 0)
                } 
                valueStyle={{ color: '#FFF' }} 
              />
            </Card>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
            <Card bodyStyle={{ backgroundColor: '#3E4057', borderRadius: 5 }} size={'small'}>
              <Statistic 
                title={
                  <p style={{ color: '#FFF', margin: 0 }}>Total Mercancía</p>
                }
                prefix={'$'} 
                precision={2} 
                value={(productQuantity || 0) * (productCost || 0)} 
                valueStyle={{ color: '#FFF' }} 
              />
            </Card>
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
            <Space>
              <Button size='large' onClick={(e) => navigate('/policies')}>Cancelar</Button>
              <Button type='primary' onClick={(e) => formAction()} size='large' icon={<SaveOutlined />} disabled={fetching}>Guardar</Button>
            </Space>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default NewPolicy;
