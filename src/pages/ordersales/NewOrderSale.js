import React, { useEffect, useState, useRef } from 'react';
import { Wrapper } from '../../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Col, DatePicker, Divider, InputNumber, Row, Select, Statistic, Table, Modal, Space } from 'antd';
import productsServices from '../../services/ProductsServices';
import { customNot } from '../../utils/Notifications';

import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import { find, forEach, isEmpty } from 'lodash';
import { TableContainer } from '../../styled-components/TableContainer';
import { columnActionsDef, columnDef, columnMoneyDef } from '../../utils/ColumnsDefinitions';
import { DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined, UserAddOutlined } from '@ant-design/icons';
import { CompanyInformation } from '../../styled-components/CompanyInformation';
import customersServices from '../../services/CustomersServices';
import salesServices from '../../services/SalesServices';
import ProductPricePicker from '../../components/pickers/ProductPricePicker';
import { getUserLocation, getUserLocationSalesSerie } from '../../utils/LocalData';
import orderSalesServices from '../../services/OrderSalesServices';
import ReactToPrint from 'react-to-print';
import OrderSaleTicket from '../../components/tickets/OrderSaleTicket';
import CustomerForm from '../../components/forms/CustomerForm';

const { Option } = Select;
const { confirm } = Modal;

const Container = styled.div`
  background-color: #325696;
  border: 1px solid #D1DCF0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  color: white;
`;

const InnerContainer = styled.div`
  background-color: #223B66;
  border: 1px solid #223B66;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 10px;
  width: 100%;
  color: white;
`;

function NewOrderSale() {
  const navigate = useNavigate();

  const componentRef = useRef();

  const [fetching, setFetching] = useState(false);
  // const [entityData, setEntityData] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const [printData, setPrintData] = useState([]);
  const [printDataDetails, setPrintDataDetails] = useState([]);
  const [openPricePicker, setOpenPricePicker] = useState(false);
  const [customersData, setCustomersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [entityRefreshData, setEntityRefreshData] = useState(0);

  const [customerSelected, setCustomerSelected] = useState(0);
  const [customerUpdateMode, setCustomerUpdateMode] = useState(false);
  const [customerToUpdate, setCustomerToUpdate] = useState({});
  const [validDocNumberAndSerie, setValidDocNumberAndSerie] = useState(false);
  const [docDatetime, setDocDatetime] = useState(defaultDate());
  const [docNumber, setDocNumber] = useState('');
  const [docType, setDocType] = useState(1);
  const [detailSelected, setDetailSelected] = useState(0);
  const [detailQuantity, setDetailQuantity] = useState(null);
  const [detailUnitPrice, setDetailUnitPrice] = useState(null);
  const [docDetails, setDocDetails] = useState([]);

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
    setFetching(true);
    customersServices.findByLocation(getUserLocation())
    .then((response) => {
      const { data } = response;
      setCustomersData(data);
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

  function isValidDetail(element) {
    return (element.detailQuantity > 0) && (element.detailUnitPrice >= 0);
  }

  function validateData() {
    const validDocDatetime = docDatetime.isValid();
    const validCustomerSelected = customerSelected !== 0 && customerSelected !== null;
    const validDocDetails = !isEmpty(docDetails);
    const validDocDetailsIntegrity = docDetails.every(isValidDetail);
    if (!validDocDatetime) customNot('warning', 'Debe seleccionar una fecha válida', 'Dato no válido');
    if (!validCustomerSelected) customNot('warning', 'Debe seleccionar un cliente', 'Dato no válido');
    if (!validDocDetails) customNot('warning', 'Debe añadir por lo menos un detalle a la compra', 'Dato no válido');
    if (!validDocDetailsIntegrity) customNot('warning', 'Los datos en el detalle no son admitidos', 'Dato no válido');
    return (validDocDatetime && validCustomerSelected && validDocDetails && validDocDetailsIntegrity);
  }

  function formAction() {
    if (validateData()) {
      setFetching(true);
      orderSalesServices.add(
        getUserLocation() || 1,
        customerSelected,
        docType || 1,
        docDatetime.format('YYYY-MM-DD HH:mm:ss'),
        getDetailTotal() || 0.00 // TOTAL
      )
      .then((response) => {
        // customNot('success', 'Operación exitosa', 'Compra añadida');
        const { insertId } = response.data[0];
        const bulkData = docDetails.map(
          (element) => ([ insertId, element.detailId, element.detailUnitPrice, element.detailQuantity ])
        );
        orderSalesServices.details.add(bulkData)
        .then((response) => {
          orderSalesServices.findById(insertId)
          .then((response) => {
            setPrintData(response.data);
            orderSalesServices.details.findByOrderSaleId(insertId)
            .then((response) => {
              setPrintDataDetails(response.data);
              customNot('info', '', 'Imprimiendo');
              document.getElementById('print-newordersale-button').click();
              navigate('/ordersales');
              setFetching(false);
            }).catch((error) => {
              // IF THE INFO FETCH FAILS IT RETURNS BACK
              navigate('/ordersales');
              setFetching(false);
              customNot('error', 'Información de venta no encontrada', 'Revise conexión');
            });
          }).catch((error) => {
            // IF THE INFO FETCH FAILS IT RETURNS BACK
            navigate('/ordersales');
            setFetching(false);
            customNot('error', 'Información de venta no encontrada', 'Revise conexión')
          });
        }).catch((error) => {
          setFetching(false);
          customNot('error', 'Algo salió mal', 'Detalles de despacho no añadidos');
        })
      })
      .catch((error) => {
        setFetching(false);
        customNot('error', 'Algo salió mal', 'Despacho no añadido');
      })
    }
  }

  function validateDetail() {
    const validSelectedDetail = detailSelected !== 0 && !!detailSelected;
    const validDetailQuantity = detailQuantity !== null && detailQuantity > 0;
    // const validUnitPrice = detailUnitPrice !== null && detailUnitPrice >= 0;
    if (!validSelectedDetail) customNot('warning', 'Debe seleccionar un detalle para añadir', 'Dato no válido');
    if (!validDetailQuantity) customNot('warning', 'Debe definir una cantidad válida', 'Dato no válido');
    // if (!validUnitPrice) customNot('warning', 'Debe definir un costo válido', 'Dato no válido');
    return (validSelectedDetail && validDetailQuantity);
  }

  function pushDetail() {
    if(validateDetail()) {
      const newDetails = [
        ...docDetails,
        { 
          index: docDetails.length,
          detailId: detailSelected, 
          detailName: find(productsData, ['id', detailSelected]).name,
          detailQuantity: detailQuantity,
          detailUnitPrice: detailUnitPrice || 0.00,
          detailSubTotal: detailQuantity * detailUnitPrice
        }
      ]
      setDocDetails(newDetails);
      setDetailSelected(0);
      setDetailQuantity(null);
      setDetailUnitPrice(null);
    }
  }

  function getDetailTotal() {
    let total = 0;
    forEach(docDetails, (value) => {
      total += (value.detailQuantity * value.detailUnitPrice)
    })
    return total;
  }

  const columns = [
    // columnDef({title: 'Cantidad', dataKey: 'detailQuantity'}),
    {
      title: <p style={{ margin: '0px', fontSize: 12, fontWeight: 600 }}>{'Cantidad'}</p>,
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      render: (text, record, index) => {
        return (
          <div>
            <InputNumber
              value={record.detailQuantity}
              size={'small'}
              type={'number'} 
              onChange={(value) => {
                setDocDetails(docDetails =>
                  docDetails.map(obj => {
                    if (obj.index === index) {
                      return { ...obj, detailQuantity: (value || 0), detailSubTotal: (value || 0) * obj.detailUnitPrice};
                    }
                    return obj;
                  }),
                );
              }}
              onBlur={(e) => { if (e.target.value === '' || e.target.value <= 0) customNot('warning', 'Verifique el dato', 'Introduzca una cantidad válida'); }}
            />
          </div>
        )
      }
    },
    columnDef({title: 'Detalle', dataKey: 'detailName'}),
    // columnMoneyDef({title: 'Precio Unitario', dataKey: 'detailUnitPrice'}),
    {
      title: <p style={{ margin: '0px', fontSize: 12, fontWeight: 600 }}>{'Precio Unitario'}</p>,
      dataIndex: 'id',
      key: 'id',
      align: 'right',
      render: (text, record, index) => {
        return (
          <div>
            <InputNumber
              value={record.detailUnitPrice}
              size={'small'}
              type={'number'}
              style={{ width: '125px', textAlign: 'right' }}
              addonBefore={'$'}
              onChange={(value) => {
                setDocDetails(docDetails =>
                  docDetails.map(obj => {
                    if (obj.index === index) {
                      return { ...obj, detailUnitPrice: (value || 0), detailSubTotal: (value || 0) * obj.detailQuantity};
                    }
                    return obj;
                  }),
                );
              }}
              onBlur={(e) => { if (e.target.value === '' || e.target.value < 0) customNot('warning', 'Verifique el dato', 'Introduzca una precio válido'); }}
            />
          </div>
        )
      }
    },
    columnMoneyDef({title: 'Subtotal', dataKey: 'detailSubTotal'}),
    columnActionsDef(
      {
        title: 'Acciones',
        dataKey: 'index',
        detail: false,
        edit: false,
        del: true,
        delAction: (value) => {
          confirm({
            title: '¿Desea eliminar este detalle?',
            icon: <DeleteOutlined />,
            content: 'Acción irreversible',
            okType: 'danger',
            onOk() { setDocDetails(docDetails.filter((x) => x.index !== value)); },
            onCancel() { },
          });
        },
      }
    ),
  ];

  function onSelectDetail(value) {
    setDetailSelected(value);
    setDetailUnitPrice(0.00);
  }

  return (
    <Wrapper xCenter yCenter>
      <div style={{ display: 'none' }}>
        <ReactToPrint
          trigger={() => <button id="print-newordersale-button">Print</button>}
          content={() => componentRef.current}
        />
        <OrderSaleTicket 
          ref={componentRef} 
          ticketData={printData[0] || {}}
          ticketDetail={printDataDetails || []}
        />
      </div>
      <CompanyInformation>
        <section className='company-info-container'>
          <p className='module-name'>Nuevo Pedido</p>
        </section>
      </CompanyInformation>
      <Container>
        <Row gutter={[8, 8]}>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
            <InnerContainer>
              <Row gutter={[8, 8]}>
                <Col
                  xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }} 
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                >
                  <p style={{ margin: '0px 0px 0px 0px' }}>{'Fecha:'}</p>
                  <DatePicker 
                    locale={locale} 
                    format="DD-MM-YYYY HH:mm:ss" 
                    value={docDatetime} 
                    style={{ width: '100%' }}
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    onChange={(datetimeMoment, datetimeString) => {
                      setDocDatetime(datetimeMoment);
                    }}
                  />
                </Col>
                <Col span={18}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                >
                  <p style={{ margin: '0px 0px 0px 0px' }}>{'Cliente:'}</p>
                  <Select 
                    dropdownStyle={{ width: '100%' }} 
                    style={{ width: '100%' }} 
                    value={customerSelected} 
                    onChange={(value) => setCustomerSelected(value)}
                    optionFilterProp='children'
                    showSearch
                    filterOption={(input, option) =>
                      (option.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Option key={0} value={0} disabled>{'No seleccionado'}</Option>
                    {
                      (customersData || []).map(
                        (element) => <Option key={element.id} value={element.id}>{element.fullName}</Option>
                      )
                    }
                  </Select>
                </Col>
                <Col span={6}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}
                >
                  <Space>
                    {
                      customerSelected !== 0 ? 
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => {
                            setOpenForm(true);
                            setCustomerToUpdate(find(customersData, ['id', customerSelected]));
                            setCustomerUpdateMode(true);
                          }}
                        /> : <></>
                    }
                    <Button
                      icon={<UserAddOutlined />}
                      onClick={() => setOpenForm(true)}
                    />
                  </Space>
                </Col>
                <Col 
                  xs={{ span: 12 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }} 
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                >
                  <p style={{ margin: '0px 0px 0px 0px' }}>{'Tipo:'}</p>
                  <Select 
                    dropdownStyle={{ width: '100%' }} 
                    style={{ width: '100%' }} 
                    value={docType} 
                    onChange={(value) => setDocType(value)}
                    optionFilterProp='children'
                    showSearch
                    filterOption={(input, option) =>
                      (option.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Option key={0} value={1}>{'Contado'}</Option>
                    <Option key={1} value={2}>{'Crédito'}</Option>
                    <Option key={2} value={3}>{'Traslado'}</Option>
                    <Option key={3} value={4}>{'Bonificación'}</Option>
                    <Option key={4} value={5}>{'Patrocinio'}</Option>
                    <Option key={5} value={6}>{'Donación'}</Option>
                    <Option key={6} value={7}>{'Regalías'}</Option>
                    <Option key={7} value={8}>{'Consumo Interno'}</Option>
                    <Option key={8} value={9}>{'Averías/Descartes'}</Option>
                    <Option key={9} value={10}>{'Muestra'}</Option>
                  </Select>
                </Col>
              </Row>
              <Divider />
              <Statistic 
                title={<p style={{ color: '#FFFFFF', fontSize: 12 }}>Total</p>}
                prefix={'$'}
                valueStyle={{ color: '#FFF' }} 
                value={getDetailTotal().toFixed(2)}
              />
              <Divider />
              <Button 
                type={'primary'} 
                icon={<SaveOutlined />}
                onClick={(e) => {
                  formAction();
                }}
                disabled={fetching}
                loading={fetching}
              >
                Guardar
              </Button>
              <div style={{ height: '10px' }} />
              <Button 
                type={'primary'} 
                danger
                onClick={(e) => navigate('/ordersales')}
              >
                Cancelar
              </Button>
            </InnerContainer>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 16 }} lg={{ span: 16 }} xl={{ span: 16 }} xxl={{ span: 16 }}>
            <InnerContainer>
              <Row gutter={[8, 8]}>
                <Col span={10}>
                  <p>{'Detalle:'}</p>
                </Col>
                <Col span={4}>
                  <p>{'Cantidad:'}</p>
                </Col>
                <Col span={4}>
                  <p>{'Precio Unitario:'}</p>
                </Col>
                <Col span={3}>
                  <p>Subtotal:</p>
                </Col>
                <Col span={3}>
                </Col>
                <Col span={10}>
                  <Select 
                    dropdownStyle={{ width: '100%' }} 
                    style={{ width: '100%' }} 
                    value={detailSelected} 
                    onChange={(value) => onSelectDetail(value)}
                    optionFilterProp='children'
                    showSearch
                    filterOption={(input, option) =>
                      (option.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Option key={0} value={0} disabled>{'No seleccionado'}</Option>
                    {
                      (productsData || []).map(
                        (element) => <Option key={element.id} value={element.id}>{element.name}</Option>
                      )
                    }
                  </Select>
                </Col>
                <Col span={4}>
                  <InputNumber 
                    style={{ width: '100%' }} 
                    placeholder={'123'} 
                    value={detailQuantity} 
                    onChange={(value) => setDetailQuantity(value)}
                    type={'number'}
                  />
                </Col>
                <Col span={4}>
                  <InputNumber 
                    style={{ width: '100%' }} 
                    addonBefore='$'
                    placeholder={'1.25'} 
                    value={detailUnitPrice} 
                    onChange={(value) => setDetailUnitPrice(value)}
                    type={'number'}
                  />
                </Col>
                <Col span={3}>
                  <p>{`$${Number(detailUnitPrice * detailQuantity).toFixed(2) || 0.00}`}</p>
                </Col>
                <Col span={3}>
                  <Button 
                    style={{ width: '100%', backgroundColor: '#52c41a', color: '#FFF' }} 
                    type={'default'} 
                    icon={<PlusOutlined />}
                    onClick={(e) => pushDetail()}
                  >
                    Añadir
                  </Button>
                </Col>
                <Col span={12}>
                </Col>
                <Col span={4}>
                </Col>
                <Col span={4} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  {
                    (detailSelected !== 0 && !!detailSelected) ? <Button onClick={(e) => setOpenPricePicker(true)}>Ver precios</Button> : <></>
                  }
                </Col>
                <Col span={4}>
                </Col>
              </Row>
            </InnerContainer>
            <InnerContainer>
              <TableContainer
                headColor={'#223B66'}
                wrapperBgColor={'#223B66'}
                headTextColor={'#FFFFFF'}
              >
                <Table 
                  bordered
                  columns={columns}
                  rowKey={'index'}
                  size={'small'}
                  dataSource={docDetails || []}
                  pagination={false}
                />
              </TableContainer>
            </InnerContainer>
          </Col>
        </Row>
      </Container>
      <CustomerForm 
        open={openForm} 
        updateMode={customerUpdateMode}
        dataToUpdate={customerToUpdate}
        showDeleteButton={false}
        onClose={(refresh) => { 
          setOpenForm(false);
          setCustomerUpdateMode(false);
          if (refresh) { 
            setEntityRefreshData(entityRefreshData => entityRefreshData + 1); 
          }
        }}
      />
      <ProductPricePicker
        open={openPricePicker}
        productId={detailSelected}
        onClose={() => setOpenPricePicker(false)}
        onSelect={(value) => setDetailUnitPrice(value)}
      />
    </Wrapper>
  );
}

export default NewOrderSale;
