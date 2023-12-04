import React, { useState, useEffect } from 'react';
import { Col, Row, Divider, Button, Modal, List, Avatar, Space, Tag, Tabs, InputNumber, Result } from 'antd';
import { ArrowLeftOutlined, BarcodeOutlined, CloseOutlined,  DollarOutlined,  SaveOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';

import productIcon from '../img/icons/product.png';

import { customNot } from '../utils/Notifications.js';

import productsServices from '../services/ProductsServices.js';
import { TabsContainer } from '../styled-components/TabsContainer';
import { validateStringData } from '../utils/ValidateData';
import ProductPricePicker from './pickers/ProductPricePicker';
import PurchaseDetailModel from '../models/PurchaseDetail';
import { getUserLocation } from '../utils/LocalData';

const styleSheet = {
  labelStyle: {
    margin: '0px',
    color: '#434343'
  },
  titleStyle: {
    margin: '5px 5px 10px 0px',
    fontSize: '20px',
    color: '#434343'
  }
};

function ProductSearchForPurchase(props) {
  const [fetching, setFetching] = useState(false);

  const [activeTab, setActiveTab] = useState('1');

  const [formProductFilterSearch, setFormProductFilterSearch] = useState('');

  const [openPricePicker, setOpenPricePicker] = useState(false);

  const [productsData, setProductsData] = useState([]);

  const [selectedProductData, setSelectedProductData] = useState({});

  const [detailQuantity, setDetailQuantity] = useState(null);
  const [detailUnitCost, setDetailUnitCost] = useState(null);

  const { open, productFilterSearch, onClose } = props;

  useEffect(() => {
    if (open) {
      loadProductData(productFilterSearch);
    }
  }, [ productFilterSearch, open ]);

  async function loadProductData(filter) {
    if (validateStringData(filter)) {
      setFetching(true);
      const response = await productsServices.findByMultipleParams(getUserLocation(), filter, 1);
      setProductsData(response.data);
      if (response.data.length === 0) {
        document.getElementById('product-not-found-return-button').focus();
      } 
      if (response.data.length === 1) {
        setSelectedProductData(response.data[0]);
        setDetailUnitCost(response.data[0].productCost || 0);
        setActiveTab('2');
        document.getElementById('newsale-detail-quantity-input').focus();
      }
      setFetching(false);
    }
  }

  function validateDetail() {
    const validSelectedDetail = selectedProductData !== null;
    const validDetailQuantity = detailQuantity !== null && detailQuantity > 0;
    const validUnitCost = isFinite(detailUnitCost) && detailUnitCost >= 0;

    // const validDetailQuantityLimit = (docDetails.length <= 10);

    if (!validSelectedDetail) customNot('warning', 'Debe seleccionar un producto', 'Dato no válido');
    if (!validDetailQuantity) customNot('warning', 'Debe definir una cantidad válida', 'Dato no válido');
    if (!validUnitCost) customNot('warning', 'Debe definir un costo válido', 'Dato no válido');

    // if (!validDetailQuantityLimit) customNot('warning', 'Límite de detalles de venta alcanzado', 'Actualmente el sistema solo permite diez o menos detalles por venta');

    return (
      validSelectedDetail
      && validDetailQuantity
      && validUnitCost
    );
  }

  function restoreState() {
    setActiveTab('1');
    setFormProductFilterSearch('');
    setProductsData([]);
    setSelectedProductData({});
    setDetailQuantity(null);
    setDetailUnitCost(null);
  }

  return (
    <Modal
      centered
      width={700}
      closable={false}
      maskClosable={false}
      open={open}
      // bodyStyle={{ backgroundColor: '#353941', border: '1px solid #787B80' }}
      footer={null}
    >
      {
        isEmpty(productsData) ? (
          <Result
            status="warning"
            title={<p style={{ color: '#434343' }}>No se encontró ningún producto</p>}
            extra={
              <Button
                id={'product-not-found-return-button'}
                type="primary"
                key="console"
                onClick={() => {
                  restoreState();
                  onClose({}, false);
                }}
              >
                Cerrar
              </Button>
            }
          />
        ) : (
          <>
            <Tabs 
              tabPosition={'left'}
              tabBarStyle={{ backgroundColor: 'transparent' }}
              activeKey={activeTab}
            >
              <Tabs.TabPane tab="Buscar" key={'1'}>
                <Row gutter={[12, 12]}>
                  <Col span={24} style={{ display: 'flex', flexDirection: 'column' }}>
                    <p style={styleSheet.titleStyle}>{'Búsqueda de producto'}</p>
                  </Col>
                  <Col span={24} style={{ display: 'flex', flexDirection: 'column' }}>
                    <List
                      style={{ backgroundColor: '#f5f5f5', borderRadius: 10, padding: 10 }}
                      size='small'
                      itemLayout="horizontal"
                      dataSource={productsData || []}
                      renderItem={(item, index) => (
                        <List.Item
                          // onClick={() => loadDetailData(item.customerId)}
                          style={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#f5f5f5', borderRadius: 0 }}
                          extra={[
                            <Button
                              type={'primary'}
                              onClick={() => {
                                setSelectedProductData(item);
                                setDetailUnitCost(item.productCost || 0);
                                setActiveTab('2');
                                setTimeout(() => {
                                  document.getElementById('newsale-detail-quantity-input').focus();
                                }, "500");
                              }}
                            >
                              Seleccionar
                            </Button>
                          ]}
                        >
                          <List.Item.Meta
                            avatar={
                              <Avatar 
                                src={productIcon} 
                              />
                            }
                            title={
                              <p 
                                style={{ margin: 0, color: '#434343' }}
                              >
                                {`${item.productName}`}
                              </p>
                            }
                            description={
                              <Space wrap>
                                <Tag color='blue' icon={<BarcodeOutlined />}>{`${item.productBarcode}`}</Tag>
                                <Tag color='yellow' icon={<DollarOutlined />}>{`${item.productCost}`}</Tag>
                              </Space>
                            }
                          />
                        </List.Item>
                      )}
                      pagination
                    />
                  </Col>
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Detalle" key={'2'}>
                <Row gutter={[12, 12]}>
                  <Col span={24} style={{ display: 'flex', flexDirection: 'column' }}>
                    <p style={{ color: '#434343', backgroundColor: '#f5f5f5', textAlign: 'center', padding: '5px', margin: 0, borderRadius: 10, fontSize: 16 }}>{selectedProductData.productName}</p>
                  </Col>
                  <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
                    <p style={styleSheet.labelStyle}>Cantidad:</p>
                    <InputNumber
                      id={'newsale-detail-quantity-input'}
                      style={{ width: '100%' }}
                      size={'large'}
                      placeholder={'123'} 
                      value={detailQuantity}
                      onChange={(value) => setDetailQuantity(value)}
                      type={'number'}
                      onKeyDown={
                        (e) => {
                          if (e.key === 'Enter')
                          document.getElementById('newsale-detail-unit-price-input').select();
                          // document.getElementById('newsale-detail-unit-price-input').focus();
                        }
                      }
                    />
                  </Col>
                  <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
                    <p style={styleSheet.labelStyle}>Costo:</p>
                    <InputNumber 
                      id={'newsale-detail-unit-price-input'}
                      style={{ width: '100%' }} 
                      size={'large'}
                      addonBefore='$'
                      placeholder={'1.25'} 
                      value={detailUnitCost} 
                      onChange={(value) => setDetailUnitCost(value)}
                      type={'number'}
                      onKeyDown={
                        (e) => {
                          if (e.key === 'Enter')
                          document.getElementById('new-sale-add-detail-button').click();
                        }
                      }
                    />
                  </Col>
                  {/* <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
                    
                  </Col>
                  <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                      style={{ width: '100%', backgroundColor: '#4C6AAF', color: '#E5E5E5' }}
                      // type={'primary'}
                      onClick={() => {
                        setOpenPricePicker(true);
                      }}
                      icon={<DollarOutlined />}
                    >
                      Ver precios disponibles
                    </Button>
                  </Col> */}
                  <Col span={24}>
                    <Button
                      style={{ width: '100%' }}
                      onClick={() => {
                        setActiveTab('1');
                        setSelectedProductData({});
                        setDetailQuantity(null);
                        setDetailUnitCost(null);
                      }}
                      icon={<ArrowLeftOutlined />}
                    >
                      Seleccionar otro producto
                    </Button>
                  </Col>
                </Row>
              </Tabs.TabPane>
            </Tabs>
            <Divider />
            <div 
              style={{
                width: '100%',
                backgroundColor: '#f5f5f5',
                borderRadius: 5,
                padding: 10
              }}
            >
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <p style={styleSheet.labelStyle}>Resumen</p>
                </Col>
                <Col span={12}>
                  {/* <p style={styleSheet.labelStyle}>{selectedProductData.productId}</p> */}
                  <p style={styleSheet.labelStyle}>{selectedProductData.productName}</p>
                  <p style={styleSheet.labelStyle}>{`${detailQuantity || 0} x $${detailUnitCost || 0}`}</p>
                </Col>
                <Col span={12}>
                  <p style={styleSheet.labelStyle}>{`$${((detailQuantity || 0) * (detailUnitCost || 0)).toFixed(2)}`}</p>
                </Col>
              </Row>
            </div>
            <Divider />
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Button 
                  danger
                  type={'primary'}
                  size={'large'}
                  icon={<CloseOutlined />}
                  onClick={(e) => {
                    restoreState();
                    onClose({}, false);
                  }}
                  style={{ width: '100%' }} 
                >
                  Cancelar
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  id={'new-sale-add-detail-button'}
                  type={'primary'} 
                  size={'large'}
                  icon={<SaveOutlined />} 
                  onClick={(e) => {
                    // formAction();
                    if (validateDetail()) {
                      const detailToAdd = new PurchaseDetailModel(
                        selectedProductData.productId,
                        selectedProductData.productName,
                        selectedProductData.isTaxable,
                        detailQuantity || 0,
                        detailUnitCost || 0,
                        selectedProductData.taxesData
                      );

                      restoreState();

                      onClose(detailToAdd, true);
                    }
                  }}
                  style={{ width: '100%' }} 
                  loading={fetching}
                  disabled={fetching}
                >
                  Añadir
                </Button>
              </Col>
            </Row>
          </>
        )
      }
      <ProductPricePicker
        open={openPricePicker}
        productId={selectedProductData.productId || 0}
        onClose={() => setOpenPricePicker(false)}
        onSelect={(value) => setDetailUnitCost(value)}
      />
    </Modal>
  )
}

export default ProductSearchForPurchase;
