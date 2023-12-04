import React, { useState, useEffect } from 'react';
import { Input, Col, Row, Divider, Button, PageHeader, Modal, InputNumber, Space, Tabs } from 'antd';
import { ArrowRightOutlined, DeleteOutlined,  EditOutlined,  PlusOutlined,  SaveOutlined, ShoppingOutlined, WarningOutlined } from '@ant-design/icons';
import { isEmpty, isNumber } from 'lodash';

import { customNot } from '../../utils/Notifications.js';

import productsServices from '../../services/ProductsServices.js';

const { confirm } = Modal;

function ProductPreview(props) {
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  // FIRST STAGE FORM VALUES
  const [formId, setId] = useState(0);
  const [formName, setFormName] = useState('');
  
  // SECOND STAGE FORM VALUES
  const [formStocks, setFormStocks] = useState([]);

  // THIRD STAGE FORM VALUES
  const [formPrices, setFormPrices] = useState([[null, null]]);
  const [formPriceIndexSelected, setFormPriceIndexSelected] = useState(null);

  const { open, updateMode, dataToUpdate, onClose } = props;

  useEffect(() => {
    const { id, name } = dataToUpdate;
    setId(id || 0);
    setFormName(name || '');
    if (id !== undefined) {
      productsServices.prices.findByProductId(id)
      .then((response) => {
        if (isEmpty(response.data)) {
          setFormPrices([[null, null]]);
        } else {
          let newArr = (response.data || []).map((element) => ([ element.productId, +element.price, element.id ]));
          setFormPrices(newArr);
        }
      })
      .catch((error) => {
        customNot('error', 'Sin información', 'Revise su conexión a la red');
      });
      productsServices.stocks.findByProductId(id)
      .then((response) => {
        setFormStocks(response.data);
      })
      .catch((error) => {
        customNot('error', 'Sin información', 'Revise su conexión a la red');
      });
    } else {
      setActiveTab('1');
      setFormStocks([]);
      setFormPrices([[null, null]]);
      setFormPriceIndexSelected(null);
    }
  }, [ dataToUpdate ]);

  function restoreState() {
    setActiveTab('1');
    setId(0);
    setFormName('');
    setFormStocks([]);
    setFormPrices([[null, null]]);
    setFormPriceIndexSelected(null);
  }

  function firstStageAction() {
    const validFullName = !isEmpty(formName);
    if (!validFullName) {
      customNot('warning', 'Verifique nombre del producto', 'Dato no válido');
      return;
    }
    setFetching(true);
    productsServices.add(formName)
    .then((response) => {
      const { insertId } = response.data;
      setId(insertId);
      productsServices.stocks.findByProductId(insertId)
      .then((response) => {
        setFetching(false);
        setActiveTab('2');
        setFormStocks(response.data);
      })
      .catch((error) => {
        setFetching(false);
        customNot('error', 'Sin información', 'Revise su conexión a la red');
      });
    })
    .catch((error) => {
      setFetching(false);
      customNot('error', 'Algo salió mal', 'Producto no añadido');
    });
  }

  function secondStageAction() {
    for (let i = 0; i < formStocks.length; i++) {
      const { initialStock, stock, productStockId } = formStocks[i];
      setFetching(true);
      productsServices.stocks.updateById(initialStock, stock, productStockId)
      .then((response) => {
        setFetching(false);
        if ((i + 1) === formStocks.length) {
          setActiveTab('3');
          setFetching(true);
          productsServices.prices.findByProductId(formId)
          .then((response) => {
            if (isEmpty(response.data)) {
              setFormPrices([[null, null]]);
            } else {
              let newArr = (response.data || []).map((element) => ([ element.productId, +element.price, element.id ]));
              setFormPrices(newArr);
            }
            setFetching(false);
          })
          .catch((error) => {
            setFetching(false);
            customNot('error', 'Sin información', 'Revise su conexión a la red');
          });
        }
      })
      .catch((error) => {
        setFetching(false);
        customNot('error', 'Algo salió mal', 'Existencias no establecidas');
      });
    }
  }

  function thirdStageAction() {
    const validPrices = updateMode ? true : !(formPrices[formPrices.length - 1][1] === null);
    if (!validPrices) {
      customNot('warning', 'Debe tener al menos un precio o un valor correcto', 'Dato no válido');
      return;
    }
    setFetching(true);
    const bulkDataPrices = formPrices.map((element) => ([ formId, element[1] ]));
    productsServices.prices.add(bulkDataPrices)
    .then((response) => {
      customNot('success', 'Producto añadido', 'Información correctamente guardada');
      restoreState();
      setFetching(false);
      onClose(true);
    })
    .catch((error) => {
      restoreState();
      setFetching(false);
      customNot('error', 'Algo salió mal con la asignación de precios', 'Precios no asignados');
      onClose(true);
    });
  }

  function validateData() {
    const validId = updateMode ? formId !== 0 : true;
    const validFullName = !isEmpty(formName);
    const validPrices = updateMode ? true : !(formPrices[formPrices.length - 1][1] === null);
    if (!validFullName) customNot('warning', 'Verifique nombre del producto', 'Dato no válido');
    if (!validPrices) customNot('warning', 'Debe tener al menos un precio o un valor correcto', 'Dato no válido');
    return (
      validId && validFullName && validPrices
    );
  }

  function formAction() {
    if (validateData()) {
      if (!updateMode) {
        setFetching(true);
        productsServices.add(
          formName
        )
        .then((response) => {
          customNot('success', 'Operación exitosa', 'Producto añadido');
          const { insertId } = response.data;
          const bulkDataPrices = formPrices.map((element) => ([ insertId, element[1] ]));
          productsServices.prices.add(bulkDataPrices)
          .then((response) => {
            restoreState();
            setFetching(false);
            onClose(true);
          })
          .catch((error) => {
            restoreState();
            setFetching(false);
            customNot('error', 'Algo salió mal con la asignación de precios', 'Precios no asignados');
            onClose(true);
          })
        })
        .catch((error) => {
          setFetching(false);
          customNot('error', 'Algo salió mal', 'Producto no añadido');
        })
      } else {
        setFetching(true);
        productsServices.update(
          formName, formId
        )
        .then((response) => {
          customNot('success', 'Operación exitosa', 'Producto actualizado');
          restoreState();
          setFetching(false);
          onClose(true);
        })
        .catch((error) => {
          setFetching(false);
          customNot('error', 'Algo salió mal', 'Producto no actualizado');
        })
      }
    }
  }

  function deleteAction() {
    const { name } = dataToUpdate;
    Modal.confirm({
      title: '¿Desea eliminar este Producto?',
      centered: true,
      icon: <WarningOutlined />,
      content: `${name || 'Not defined'} será eliminado de la lista de Productos`,
      okText: 'Confirmar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        setFetching(true);
        productsServices.remove(formId)
        .then((response) => {
          restoreState();
          setFetching(false);
          onClose(true);
        })
        .catch((error) => {
          setFetching(false);
          customNot('info', 'Algo salió mal', 'El Producto no pudo ser eliminado');
        });
      },
      onCancel() {},
    });
  }

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={<ShoppingOutlined />}
          title={`${!updateMode ? 'Nuevo' : 'Actualizar'} Producto`}
          extra={!updateMode ? [] : [
            <Button key="1" type="danger" size={'small'} icon={<DeleteOutlined />} onClick={(e) => deleteAction()}>
              Eliminar
            </Button>
          ]}
        />
      }
      centered
      width={450}
      closable={false}
      maskClosable={false}
      visible={open}
      footer={null}
    >
      <Tabs 
        activeKey={activeTab}
        onChange={(activeKey) => { setActiveTab(activeKey); }}
      >
        <Tabs.TabPane tab="Información" key={'1'} disabled={!updateMode}>
          <Row gutter={8}>
            <Col span={24}>
              <p style={{ margin: '0px 0px 0px 0px' }}>Nombre:</p>  
              <Input onChange={(e) => setFormName(e.target.value)} name={'formName'} value={formName} placeholder={'Producto 1'} />
            </Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Existencias" key={'2'} disabled={!updateMode}>
          <Row gutter={8}>
            {
              (formStocks || []).map((element, index) => {
                return (
                  <>
                    <Col span={24}>
                      <p style={{ margin: '5px 0px 0px 0px', fontWeight: 600 }}>{`${(element.locationName)}`}</p>
                    </Col>
                    <Col span={12}>
                      <p style={{ margin: '3px 0px 0px 0px', fontSize: 11 }}>{`Inicial:`}</p>
                      <Space>
                        <InputNumber
                          type={'number'}
                          precision={2} 
                          value={element.initialStock}
                          onChange={(value) => {
                            let newArr = [...formStocks];
                            newArr[index] = { ...newArr[index], initialStock: value };
                            setFormStocks(newArr);
                          }}
                        />
                      </Space>
                    </Col>
                    <Col span={12}>
                      <p style={{ margin: '3px 0px 0px 0px', fontSize: 11 }}>{`Actual:`}</p>
                      <Space>
                        <InputNumber
                          type={'number'}
                          precision={2} 
                          value={element.stock}
                          onChange={(value) => {
                            let newArr = [...formStocks];
                            newArr[index] = { ...newArr[index], stock: value };
                            setFormStocks(newArr);
                          }}
                        />
                      </Space>
                    </Col>
                  </>
                )
              })
            }
          </Row>
        </Tabs.TabPane>
        {/* <Tabs.TabPane tab="Precios" key={'3'} disabled={!updateMode}>
          <Row gutter={8}>
            {
              (formPrices || []).map((element, index) => {
                return (
                  <Col span={12} key={index}>
                    <p style={{ margin: '5px 0px 0px 0px' }}>{`Precio ${(index + 1)}`}</p>
                    <Space>
                      <InputNumber
                        type={'number'}
                        precision={2} 
                        value={element[1]}
                        disabled={updateMode && (formPriceIndexSelected !== index)}
                        onChange={(value) => {
                          let newArr = [...formPrices];
                          newArr[index] = [updateMode ? element[0] : null, +value, updateMode ? element[2] : null];
                          setFormPrices(newArr);
                        }}
                      />
                      {
                        !updateMode ? <></> : (
                          <Button
                            icon={(formPriceIndexSelected !== index) ? <EditOutlined /> : <SaveOutlined />}
                            onClick={(e) => {
                              if (!(formPriceIndexSelected !== index)) {
                                if (element[0] === null) {
                                  productsServices.prices.add([[formId, element[1]]])
                                  .then((response) => {
                                    customNot('success', 'Precio añadido', 'Operación exitosa');
                                    setFormPriceIndexSelected(null);
                                  })
                                  .catch((error) => {
                                    customNot('success', 'Precio no añadido', 'Operación fallida');
                                  });
                                } else {
                                  productsServices.prices.update(+element[1], element[2])
                                  .then((response) => {
                                    customNot('success', 'Precio modificado', 'Operación exitosa');
                                    setFormPriceIndexSelected(null);
                                  })
                                  .catch((error) => {
                                    customNot('success', 'Precio modificado', 'Operación fallida');
                                  });
                                }
                              } else {
                                setFormPriceIndexSelected(index);
                              }
                            }}
                          />
                        )
                      }
                      {
                        !updateMode ? <></> : (
                          <Button
                            icon={<DeleteOutlined />}
                            onClick={(e) => {
                              confirm({
                                title: '¿Desea remover este precio?',
                                icon: <DeleteOutlined />,
                                content: 'Acción irreversible',
                                okType: 'danger',
                                onOk() { 
                                  setFetching(true);
                                  productsServices.prices.remove(element[2] || 0)
                                  .then((response) => {
                                    setFetching(false);
                                    const { id } = dataToUpdate;
                                    productsServices.prices.findByProductId(id)
                                    .then((response) => {
                                      setFetching(false);
                                      if (isEmpty(response.data)) {
                                        setFormPrices([[null, null]]);
                                      } else {
                                        let newArr = (response.data || []).map((element) => ([ element.productId, +element.price, element.id ]));
                                        setFormPrices(newArr);
                                      }
                                    })
                                    .catch((error) => {
                                      setFetching(false);
                                      customNot('error', 'Sin información', 'Revise su conexión a la red');
                                    });
                                    customNot('success', 'Precio removido', 'Operación exitosa');
                                  })
                                  .catch((error) => {
                                    setFetching(false);
                                    customNot('success', 'Precio no removido', 'Operación fallida');
                                  });
                                },
                                onCancel() { },
                              });
                              
                            }}
                            disabled={(index === 0)}
                            type={'primary'}
                            danger
                          />
                        )
                      }
                    </Space>
                  </Col>
                )
              })
            }
            <Col span={24}>
              <Button
                type={'default'} 
                icon={<PlusOutlined />} 
                onClick={(e) => {
                  let newArr = [...formPrices];
                  newArr.push([null, null]);
                  setFormPrices(newArr);
                  if (updateMode) setFormPriceIndexSelected(newArr.length - 1);
                }} 
                style={{ width: '50%', marginTop: 20 }}
                loading={fetching}
                disabled={fetching || (formPrices[formPrices.length - 1][1] === null)}
              >
                Añadir precio
              </Button>
            </Col>
          </Row>
        </Tabs.TabPane> */}
      </Tabs>
    </Modal>
  )
}

export default ProductPreview;
