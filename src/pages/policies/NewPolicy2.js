import React, { useEffect, useState, useRef } from 'react';
import { Wrapper } from '../../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Col, InputNumber, Row, Select, Modal, Input } from 'antd';
import productsServices from '../../services/ProductsServices';
import { customNot } from '../../utils/Notifications';

import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import { find, forEach, isEmpty, reduce } from 'lodash';
import { columnActionsDef, columnDef, columnMoneyDef } from '../../utils/ColumnsDefinitions';
import { DeleteOutlined } from '@ant-design/icons';
import { CompanyInformation } from '../../styled-components/CompanyInformation';
import customersServices from '../../services/CustomersServices';
import { getUserLocation, getUserLocationSalesSerie } from '../../utils/LocalData';
import orderSalesServices from '../../services/OrderSalesServices';
import ReactToPrint from 'react-to-print';
import OrderSaleTicket from '../../components/tickets/OrderSaleTicket';

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

  .section-text, .section-text-rotated {
    margin: 0px;
    font-size: 10px;
    color: #f0f0f0;
  }

  .section-text-rotated {
    transform: rotate(-90deg);
  }
  .label {
    margin: 0px;
    font-size: 11px;
    color: #f0f0f0;
  }
  .gen-input {
    background-color: #3E4057;
    color: #FFF;
    border: none;
    border-bottom: 1px solid white;
    :focus {
      background-color: #4F567B;
      border: 1px solid white;
    }
  }
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

function NewPolicy() {
  const navigate = useNavigate();

  const componentRef = useRef();

  const [fetching, setFetching] = useState(false);
  // const [entityData, setEntityData] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const [printData, setPrintData] = useState([]);
  const [printDataDetails, setPrintDataDetails] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [entityRefreshData, setEntityRefreshData] = useState(0);

  const [customerSelected, setCustomerSelected] = useState(0);
  const [docDatetime, setDocDatetime] = useState(defaultDate());
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

  return (
    <Wrapper xCenter>
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
          <p className='module-name'>Nueva Póliza</p>
        </section>
      </CompanyInformation>
      <Container>
        <Row gutter={[0, 0]}>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }}>
            <Row>
              <Col span={1} style={{ border: '1px solid white', backgroundColor: '#780650', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p className='section-text-rotated'>Exportador/Proveedor</p>
              </Col>
              <Col span={23}>
                <Row>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>4.1 Número de Identificación</p>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                  <p className='label'>4.2 Tipo de Identificación</p>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={5} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={4} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>4.3 País Emisión</p>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={6} className='gen-input' size='small'/>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>4.4 Nombre o Razón Social</p>
                  </Col>
                  <Col span={16} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={7} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>4.5 Domicilio Fiscal</p>
                  </Col>
                  <Col span={16} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={8} className='gen-input' size='small'/>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={1} style={{ border: '1px solid white', backgroundColor: '#22075e', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p className='section-text-rotated'>Importador/Destinatario</p>
              </Col>
              <Col span={23}>
                <Row>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>5.1 Número de Identificación</p>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>5.2 Tipo de Identificación</p>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={10} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={9} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>5.3 País Emisión</p>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={11} className='gen-input' size='small'/>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>5.4 Nombre o Razón Social</p>
                  </Col>
                  <Col span={16} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={12} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>5.5 Domicilio Fiscal</p>
                  </Col>
                  <Col span={16} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={13} className='gen-input' size='small'/>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={1} style={{ border: '1px solid white', backgroundColor: '#061178', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p className='section-text-rotated'>Declarante</p>
              </Col>
              <Col span={23}>
                <Row>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>6.1 Código</p>
                  </Col>
                  <Col span={16} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={14} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>6.2 No. Identificación</p>
                  </Col>
                  <Col span={16} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={15} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>6.3 Nombre o Razón Social</p>
                  </Col>
                  <Col span={16} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={16} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>6.4 Domicilio Fiscal</p>
                  </Col>
                  <Col span={16} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={17} className='gen-input' size='small'/>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={1} style={{ border: '1px solid white', backgroundColor: '#00474f', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p className='section-text-rotated'>Transportista</p>
              </Col>
              <Col span={23}>
                <Row>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>19.1 Código</p>
                  </Col>
                  <Col span={10} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={28} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>20. Modo de transporte</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>19.2 Nombre</p>
                  </Col>
                  <Col span={10} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={29} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={30} className='gen-input' size='small'/>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={1} style={{ border: '1px solid white', backgroundColor: '#873800', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p className='section-text-rotated'>Conductor</p>
              </Col>
              <Col span={23}>
                <Row>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>23.1 No Identificación</p>
                  </Col>
                  <Col span={16} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>23.2 No Licencia del Conducir</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={33} className='gen-input' size='small'/>
                  </Col>
                  <Col span={16}>
                    <Row>
                      <Col span={24} style={{ border: '1px solid white', padding: 5 }}>
                        <Input tabIndex={34} className='gen-input' size='small'/>
                      </Col>
                      <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                        <p className='label'>23.3 País Expedición</p>
                      </Col>
                      <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                        <Input tabIndex={35} className='gen-input' size='small'/>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col span={24} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>23.4 Nombres y apellidos</p>
                  </Col>
                  <Col span={24} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={36} className='gen-input' size='small'/>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={1} style={{ border: '1px solid white', backgroundColor: '#3f6600', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p className='section-text-rotated'>Valores totales</p>
              </Col>
              <Col span={23}>
                <Row>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>25. Valor de transacción</p>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>26. Gastos de transporte</p>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>27. Gastos de seguro</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={48} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={49} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={50} className='gen-input' size='small'/>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>29. Valor en Aduana total</p>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>30. Incoterm</p>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>31. Tasa de cambio</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={52} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={53} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={54} className='gen-input' size='small'/>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={1} style={{ border: '1px solid white', backgroundColor: '#135200', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p className='section-text-rotated'>Mercancías</p>
              </Col>
              <Col span={23}>
                <Row>
                  <Col span={5} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>35. Cantidad de Bultos</p>
                  </Col>
                  <Col span={5} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>36. Clase de Bultos</p>
                  </Col>
                  <Col span={5} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>37. Peso neto</p>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>38. Peso Bruto</p>
                  </Col>
                  <Col span={5} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>39. Cuota contingente</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={5} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={61} className='gen-input' size='small'/>
                  </Col>
                  <Col span={5} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={62} className='gen-input' size='small'/>
                  </Col>
                  <Col span={5} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={63} className='gen-input' size='small'/>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={64} className='gen-input' size='small'/>
                  </Col>
                  <Col span={5} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={65} className='gen-input' size='small'/>
                  </Col>
                </Row>
                <Row>
                  <Col span={5} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>40. Número de Línea</p>
                  </Col>
                  <Col span={5} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>41. País de Origen</p>
                  </Col>
                  <Col span={5} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>42. Unidad de Medida</p>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>43. Cantidad</p>
                  </Col>
                  <Col span={5} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>44. Acuerdo</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={5} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={66} className='gen-input' size='small'/>
                  </Col>
                  <Col span={5} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={67} className='gen-input' size='small'/>
                  </Col>
                  <Col span={5} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={68} className='gen-input' size='small'/>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={69} className='gen-input' size='small'/>
                  </Col>
                  <Col span={5} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={70} className='gen-input' size='small'/>
                  </Col>
                </Row>
                <Row>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>45. Clasificación Arancelaria</p>
                  </Col>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>46. Descripción de las Mercancías</p>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>47.1 Criterio para certificar origen</p>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>47.2 Reglas accesorias</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={71} className='gen-input' size='small'/>
                  </Col>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={72} className='gen-input' size='small'/>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={73} className='gen-input' size='small'/>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={74} className='gen-input' size='small'/>
                  </Col>
                </Row>
                <Row>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>48. Valor de transacción</p>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>49. Gastos de transporte</p>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>50. Seguro</p>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>51. Otros gastos</p>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>52. Valor en aduana</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={75} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={76} className='gen-input' size='small'/>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={77} className='gen-input' size='small'/>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={78} className='gen-input' size='small'/>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={79} className='gen-input' size='small'/>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }}>
            <Row>
              <Col span={16}>
                <Row>
                  <Col span={24} style={{ border: '1px solid white', backgroundColor: '#061178', padding: 5 }}>
                    <p className='section-text'>Identificación de la declaración</p>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>1. No. Correlativo o Referencia</p>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>2. No. de DUCA</p>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>3. Fecha de aceptación</p>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={1} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={2} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={3} className='gen-input' size='small'/>
                  </Col>
                </Row>
              </Col>
              <Col span={8} style={{ border: '1px solid white', padding: 5 }}>

              </Col>
            </Row>  
            <Row>
              <Col span={24}>
                <Row>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>7. Aduana Registro/Inicio Tránsito</p>
                  </Col>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>8. Aduana Salida</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={18} className='gen-input' size='small'/>
                  </Col>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={19} className='gen-input' size='small'/>
                  </Col>
                </Row>
                <Row>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>9. Aduana Ingreso</p>
                  </Col>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>10. Aduana Destino</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={20} className='gen-input' size='small'/>
                  </Col>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={21} className='gen-input' size='small'/>
                  </Col>
                </Row>
                <Row>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>11. Régimen aduanero</p>
                  </Col>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>12. Modalidad</p>
                  </Col>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>13. Clase</p>
                  </Col>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>14. Fecha vencimiento</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={22} className='gen-input' size='small'/>
                  </Col>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={23} className='gen-input' size='small'/>
                  </Col>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={24} className='gen-input' size='small'/>
                  </Col>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={25} className='gen-input' size='small'/>
                  </Col>
                </Row>
                <Row>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>15. País Procedencia</p>
                  </Col>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>16. País Exportación</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={26} className='gen-input' size='small'/>
                  </Col>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={27} className='gen-input' size='small'/>
                  </Col>
                </Row>
                <Row>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>17. País Destino</p>
                  </Col>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>18. Depósito aduanero/Zona Franca</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={26} className='gen-input' size='small'/>
                  </Col>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={27} className='gen-input' size='small'/>
                  </Col>
                </Row>
                <Row>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>21. Lugar de embarque</p>
                  </Col>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>22. Lugar de desembarque</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={31} className='gen-input' size='small'/>
                  </Col>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={32} className='gen-input' size='small'/>
                  </Col>
                </Row>
                <Row>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>24.1 Identificación de la unidad de transporte</p>
                  </Col>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>24.2 País de Registro</p>
                  </Col>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>24.3 Marca</p>
                  </Col>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>24.4 Chasis/Vin</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={37} className='gen-input' size='small'/>
                  </Col>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={38} className='gen-input' size='small'/>
                  </Col>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={38} className='gen-input' size='small'/>
                  </Col>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={40} className='gen-input' size='small'/>
                  </Col>
                </Row>
                <Row>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>24.5 Identificación del remolque o semirremolque</p>
                  </Col>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>{`24.6 Cantidad de unidades de carga (remolques o semirremolques)`}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={41} className='gen-input' size='small'/>
                  </Col>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={42} className='gen-input' size='small'/>
                  </Col>
                </Row>
                <Row>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>24.7 No de Dispositivos o de Seguridad</p>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>24.8 Equipamento</p>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>24.9 Tamaño del equipamento</p>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>24.10 Tipo de Carga</p>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>24.11 Números de Identificación de los contenedores</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={43} className='gen-input' size='small'/>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={44} className='gen-input' size='small'/>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={45} className='gen-input' size='small'/>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={46} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={47} className='gen-input' size='small'/>
                  </Col>
                </Row>
                <Row>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>28. Otros gastos</p>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>32. Peso Bruto</p>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>33. Peso Neto total</p>
                  </Col>
                  <Col span={12} style={{ border: '1px solid white', padding: 5, backgroundColor: '#820014', textAlign: 'center' }}>
                    <p className='label'>Liquidación general</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={51} className='gen-input' size='small'/>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={55} className='gen-input' size='small'/>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={56} className='gen-input' size='small'/>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>34.1 Tipo de tributo</p>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>34.2 Total por tributo</p>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>34.3 Modalidad pago</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={57} className='gen-input' size='small'/>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={58} className='gen-input' size='small'/>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={59} className='gen-input' size='small'/>
                  </Col>
                </Row>
                <Row>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>34.4 Total General</p>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={60} className='gen-input' size='small'/>
                  </Col>
                  <Col span={4} style={{ border: '1px solid white', padding: 5 }}>
                  </Col>
                </Row>
                <Row>
                  <Col span={24} style={{ border: '1px solid white', padding: 5, backgroundColor: '#820014', textAlign: 'center' }}>
                    <p className='label'>Liquidación por línea</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>53.1 Tipo</p>
                  </Col>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>53.2 Tasas</p>
                  </Col>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>53.3 Total</p>
                  </Col>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>53.4 MP</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={80} className='gen-input' size='small'/>
                  </Col>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={81} className='gen-input' size='small'/>
                  </Col>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={82} className='gen-input' size='small'/>
                  </Col>
                  <Col span={6} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={83} className='gen-input' size='small'/>
                  </Col>
                </Row>
                <Row>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>53.5 Total General</p>
                  </Col>
                  <Col span={12} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={84} className='gen-input' size='small'/>
                  </Col>
                </Row>
              </Col>
            </Row>                        
          </Col>
        </Row>
        <Row gutter={[0, 0]}>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: 24 }}>
            <Row>
              <Col span={1} style={{ border: '1px solid white', backgroundColor: '#780650', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p className='section-text-rotated'>Documentos de soporte</p>
              </Col>
              <Col span={23}>
                <Row>
                  <Col span={3} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>54.1 Código del tipo de documento</p>
                  </Col>
                  <Col span={3} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>54.2 Número de documento</p>
                  </Col>
                  <Col span={3} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>54.3 Fecha de emisión</p>
                  </Col>
                  <Col span={3} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>54.4 Fecha de vencimiento</p>
                  </Col>
                  <Col span={3} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>54.5 País de emisión</p>
                  </Col>
                  <Col span={3} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>{`54.6 Línea (sí aplica)`}</p>
                  </Col>
                  <Col span={3} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>54.7 Entidad o autoridad que emitió el documento</p>
                  </Col>
                  <Col span={3} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>54.8 Monto</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={3} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={85} className='gen-input' size='small'/>
                  </Col>
                  <Col span={3} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={86} className='gen-input' size='small'/>
                  </Col>
                  <Col span={3} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={87} className='gen-input' size='small'/>
                  </Col>
                  <Col span={3} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={88} className='gen-input' size='small'/>
                  </Col>
                  <Col span={3} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={89} className='gen-input' size='small'/>
                  </Col>
                  <Col span={3} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={90} className='gen-input' size='small'/>
                  </Col>
                  <Col span={3} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={91} className='gen-input' size='small'/>
                  </Col>
                  <Col span={3} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={92} className='gen-input' size='small'/>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={1} style={{ border: '1px solid white', backgroundColor: '#876800', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p className='section-text-rotated'>Observaciones</p>
              </Col>
              <Col span={23}>
                <Row>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>55. Observaciones</p>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>56. Válido hasta</p>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <p className='label'>57. Código Exportador</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={93} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={94} className='gen-input' size='small'/>
                  </Col>
                  <Col span={8} style={{ border: '1px solid white', padding: 5 }}>
                    <Input tabIndex={95} className='gen-input' size='small'/>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default NewPolicy;
