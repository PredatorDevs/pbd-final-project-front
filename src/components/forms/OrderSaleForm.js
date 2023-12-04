import React, { useState, useEffect, useRef } from 'react';
import { Input, Col, Row, Divider, Select, Button, PageHeader, Modal, Descriptions, Badge, Table, InputNumber, Space } from 'antd';
import { CloseOutlined, DeleteOutlined,  PlusOutlined,  PrinterOutlined,  SaveOutlined, SyncOutlined, TagsOutlined, WarningOutlined } from '@ant-design/icons';
import { forEach, includes, isEmpty } from 'lodash';
import moment from 'moment';
import 'moment/locale/es-mx';
import ReactToPrint from 'react-to-print';

import { customNot } from '../../utils/Notifications.js';
import { TableContainer } from '../../styled-components/TableContainer.js';
import { columnActionsDef, columnDef, columnMoneyDef } from '../../utils/ColumnsDefinitions.js';
import OrderSaleTicket from '../tickets/OrderSaleTicket.js';
import orderSalesServices from '../../services/OrderSalesServices.js';
import customersServices from '../../services/CustomersServices.js';
import { getUserLocation, getUserRole } from '../../utils/LocalData.js';
import ProductPricePicker from '../pickers/ProductPricePicker.js';
import productsServices from '../../services/ProductsServices.js';

const { Option } = Select;
const { confirm } = Modal;


function OrderSaleForm(props) {
  const [fetching, setFetching] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [entityDetailData, setEntityDetailData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(0);
  const [docType, setDocType] = useState(1);

  const [detailSelected, setDetailSelected] = useState(0);
  const [detailQuantity, setDetailQuantity] = useState(null);
  const [detailUnitPrice, setDetailUnitPrice] = useState(null);
  const [productsData, setProductsData] = useState([]);
  const [openPricePicker, setOpenPricePicker] = useState(false);

  const { open, orderSaleId, onRefresh, onClose } = props;

  const componentRef = useRef();

  function loadData(){
    setFetching(true);
    productsServices.find()
    .then((response) => {
      const { data } = response;
      setProductsData(data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información de los productos', 'Revise su conexión a la red');
      setFetching(false);
    });
    customersServices.findByLocation(getUserLocation())
    .then((response) => {
      const { data } = response;
      setCustomersData(data);
      orderSalesServices.findById(orderSaleId)
      .then((response) => {
        setEntityData(response.data);
        setCustomerSelected(response.data[0].customerId);
        setDocType(response.data[0].docType);
        orderSalesServices.details.findByOrderSaleId(orderSaleId)
        .then((response) => {
          setFetching(false);
          setEntityDetailData(response.data);
        }).catch((error) => {
          setFetching(false);
          customNot('error', 'Información de venta no encontrada', 'Revise conexión')
        });
      }).catch((error) => {
        setFetching(false);
        customNot('error', 'Información de pedido no encontrada', 'Revise conexión');
      });
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }

  function getDetailTotal() {
    let total = 0;
    forEach(entityDetailData, (value) => {
      total += (value.quantity * value.unitPrice)
    })
    return total;
  }

  function isValidDetail(element) {
    return (element.quantity > 0) && (element.unitPrice >= 0);
  }

  function validateData() {
    const validDetailsIntegrity = entityDetailData.every(isValidDetail);
    if (!validDetailsIntegrity) customNot('warning', 'Los datos en el detalle no son admitidos', 'Dato no válido');
    return (validDetailsIntegrity);
  }

  function onSelectDetail(value) {
    setDetailSelected(value);
    setDetailUnitPrice(0.00);
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

  function formAction() {
    if (validateData()) {
      setFetching(true);
      orderSalesServices.update(null, customerSelected, docType, null, null, getDetailTotal(), orderSaleId)
      .then(() => {
        forEach(entityDetailData, (element, index) => {
          setFetching(true);
          orderSalesServices.details.update(
            null, null, element.unitPrice, element.quantity, element.id
          )
          .then((response) => {
            setFetching(false);
          })
          .catch((error) => {
            customNot('warning', 'Error', `El detalle ${element.productName} no fue modificado`);
            setFetching(false);
          });
        });
        onRefresh();
        customNot('success', 'Pedido modificado', 'Acción exitosa');
        setFetching(false);
      })
      .catch(() => {
        setFetching(false);
        customNot('warning', 'Error', `La información del producto no pudo ser modificada`);
      });
    }
  }

  useEffect(() => {
    if (orderSaleId !== 0) loadData();
  }, [ orderSaleId ]);

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={<TagsOutlined />}
          title={`Editando Pedido ${isEmpty(entityData) ? '' : entityData[0].id || ''}`}
          extra={[
            <Button size={'small'} icon={<SyncOutlined />} onClick={() => loadData()} loading={fetching} disabled={fetching}>Recargar</Button>,
            <Button size={'small'} icon={<SaveOutlined />} type={'primary'} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a'  }} onClick={(e) => {
              formAction();
            }} 
            loading={fetching} disabled={fetching}>Guardar cambios</Button>
          ]}
        />
      }
      centered
      width={700}
      closeIcon={<CloseOutlined style={{ padding: 5, backgroundColor: '#f0f0f0', borderRadius: 5, color: '#f5222d' }} />}
      onCancel={() => onClose()}
      maskClosable={false}
      visible={open}
      footer={null}
    >      
      <Descriptions bordered style={{ width: '100%' }} size={'small'}>
        <Descriptions.Item label="Fecha" span={3}>{moment(isEmpty(entityData) ? '1999-01-01 00:00:00' : entityData[0].docDatetime).format('LL') || ''}</Descriptions.Item>
        <Descriptions.Item label="Cliente" span={3}>
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
        </Descriptions.Item>
        {/* <Descriptions.Item label="Fecha">{moment(isEmpty(entityData) ? '' :entityData[0].docDatetime).format('LL') || ''}</Descriptions.Item> */}
        <Descriptions.Item label="Tipo">
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
            <Option key={3} value={4}>{'Devoluciones/Ventas'}</Option>
            <Option key={4} value={5}>{'Patrocinio'}</Option>
            <Option key={5} value={6}>{'Donación'}</Option>
            <Option key={6} value={7}>{'Regalías'}</Option>
            <Option key={7} value={8}>{'Consumo Interno'}</Option>
            <Option key={8} value={9}>{'Averías/Descartes'}</Option>
            <Option key={9} value={10}>{'Muestra'}</Option>
          </Select>
        </Descriptions.Item>
        <Descriptions.Item label="">{''}</Descriptions.Item>
        <Descriptions.Item label="">{''}</Descriptions.Item>
      </Descriptions>
      <div style={{ height: '20px' }} />
      <TableContainer>
        <Table 
          size='small'
          columns={[
            {
              title: <p style={{ margin: '0px', fontSize: 12, fontWeight: 600 }}>{'Cantidad'}</p>,
              dataIndex: 'id',
              key: 'id',
              align: 'left',
              render: (text, record, index) => {
                return (
                  <div>
                    <InputNumber
                      value={record.quantity}
                      size={'small'}
                      type={'number'}
                      style={{ display: (index === entityDetailData.length) ? 'none' : 'inline-block'  }}
                      onChange={(value) => {
                        setEntityDetailData(entityDetailData =>
                          entityDetailData.map(obj => {
                            if (entityDetailData.indexOf(obj) === index) {
                              return { ...obj, quantity: (value || 0), subTotal: ((value || 0) * obj.unitPrice)};
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
            columnDef({ title: 'Producto', dataKey: 'productName' }),
            // columnMoneyDef({ title: 'Precio Unitario', dataKey: 'unitPrice', showDefaultString: true }),
            {
              title: <p style={{ margin: '0px', fontSize: 12, fontWeight: 600 }}>{'Precio Unitario'}</p>,
              dataIndex: 'id',
              key: 'id',
              align: 'right',
              render: (text, record, index) => {
                return (
                  <div>
                    <InputNumber
                      value={record.unitPrice}
                      size={'small'}
                      type={'number'}
                      style={{ width: '125px', textAlign: 'right', display: (index === entityDetailData.length) ? 'none' : 'inline-block' }}
                      addonBefore={'$'}
                      onChange={(value) => {
                        setEntityDetailData(entityDetailData =>
                          entityDetailData.map(obj => {
                            if (entityDetailData.indexOf(obj) === index) {
                              return { ...obj, unitPrice: (value || 0), subTotal: ((value || 0) * obj.quantity)};
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
            columnMoneyDef({ title: 'Subtotal', dataKey: 'subTotal', showDefaultString: true }),
            {
              title: <p style={{ margin: '0px', fontSize: 12, fontWeight: 600 }}>{'Opciones'}</p>,
              dataIndex: 'id',
              key: 'id',
              align: 'right',
              render: (text, record, index) => {
                return (
                  <Space>
                    {
                      includes([1, 2, 3, 4], getUserRole()) ? 
                      <Button
                        type="primary"
                        disabled={fetching}
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        style={{ fontSize: 10, display: (index !== entityDetailData.length) ? 'inline-block' : 'none' }}
                        onClick={() => {
                          confirm({
                            title: '¿Desea eliminar este detalle?',
                            icon: <DeleteOutlined />,
                            content: 'Acción irreversible',
                            okType: 'danger',
                            onOk() { 
                              setFetching(true);
                              orderSalesServices.details.remove(record.id)
                              .then((response) => {
                                customNot('success', 'Detalle eliminado', `${record.quantity} ${record.productName} elminado`);
                                setFetching(false);
                                onRefresh();
                                loadData();
                              }).catch((error) => {
                                customNot('error', 'Información de pedido no encontrada', 'Revise conexión');
                                setFetching(false);
                              })
                            },
                            onCancel() { },
                          });
                          
                        }}
                      />
                       : <>
                      
                      </>
                    }
                  </Space>
                )
              }
            },
          ]}
          dataSource={[ ...entityDetailData, { quantity: '', productName: 'Total', unitPrice: '', subTotal: getDetailTotal() } ] || []}
          pagination={false}
        />
      </TableContainer>
      <div style={{ height: '20px' }} />
      <div 
        style={{ 
          border: '1px solid #91D5FF', 
          borderRadius: 5,
          padding: 10, 
          backgroundColor: '#E6F7FF' 
        }}
      >
        <Row gutter={[8, 8]}>
          <Col span={10}>
            <p style={{ margin: 0 }}>{'Detalle:'}</p>
          </Col>
          <Col span={4}>
            <p style={{ margin: 0 }}>{'Cantidad:'}</p>
          </Col>
          <Col span={4}>
            <p style={{ margin: 0 }}>{'Precio Uni:'}</p>
          </Col>
          <Col span={3}>
            <p style={{ margin: 0 }}>{'Subtotal:'}</p>
          </Col>
          <Col span={3} />
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
              onClick={(e) => {
                if(validateDetail()) {
                  setFetching(true);
                  orderSalesServices.details.add([[orderSaleId, detailSelected, detailUnitPrice, detailQuantity]])
                  .then((response) => {
                    setFetching(false);
                    setDetailSelected(0);
                    setDetailQuantity(null);
                    setDetailUnitPrice(null);
                    orderSalesServices.recalculateTotal(orderSaleId)
                    .then((response) => {
                      onRefresh();
                      loadData();
                    }).catch((error) => {
                      onRefresh();
                      loadData();
                    });
                  }).catch((error) => {
                    setFetching(false);
                    customNot('error', 'Algo salió mal', 'Detalles de despacho no añadidos');
                  });
                }
              }}
            />
          </Col>
        </Row>
      </div>
      <div style={{ height: '20px' }} />
      <Descriptions bordered style={{ width: '100%' }} size={'small'}>
        <Descriptions.Item label="Registrada por" span={3}>{isEmpty(entityData) ? '' : entityData[0].createdByFullname || ''}</Descriptions.Item>
      </Descriptions>
      <div style={{ display: 'none' }}>
        <OrderSaleTicket ref={componentRef} ticketData={entityData[0] || {}} ticketDetail={entityDetailData || []} />
      </div>
      <ProductPricePicker
        open={openPricePicker}
        productId={detailSelected}
        onClose={() => setOpenPricePicker(false)}
        onSelect={(value) => setDetailUnitPrice(value)}
      />
    </Modal>
  )
}

export default OrderSaleForm;
