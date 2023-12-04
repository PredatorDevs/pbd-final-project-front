import React, { useState, useEffect } from 'react';
import { Input, Col, Row, Button, PageHeader, Modal, InputNumber, Tabs, Space } from 'antd';
import { ArrowRightOutlined, DeleteOutlined,  SaveOutlined, TagsOutlined, WarningOutlined } from '@ant-design/icons';
import { isEmpty, isNumber } from 'lodash';

import { customNot } from '../../utils/Notifications.js';

import rawMaterialsServices from '../../services/RawMaterialsServices.js';

function RawMaterialForm(props) {
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  // FIRST STAGE FORM VALUES
  const [formId, setId] = useState(0);
  const [formName, setFormName] = useState('');
  const [formCost, setFormCost] = useState(0);

  // SECOND STAGE FORM VALUES
  const [formStocks, setFormStocks] = useState([]);

  const { open, updateMode, dataToUpdate, onClose } = props;

  useEffect(() => {
    const { id, name, cost } = dataToUpdate;
    setId(id || 0);
    setFormName(name || '');
    setFormCost(cost || 0);
    if (id !== undefined) {
      rawMaterialsServices.stocks.findByRawMaterialId(id)
      .then((response) => {
        setFormStocks(response.data);
      })
      .catch((error) => {
        customNot('error', 'Sin información', 'Revise su conexión a la red');
      });
    } else {
      setActiveTab('1');
      setFormStocks([]);
    }
  }, [ dataToUpdate ]);

  function restoreState() {
    setId(0);
    setFormName('');
    setFormCost(0);
    setActiveTab('1');
    setFormStocks([]);
  }

  function firstStageAction() {
    const validName = !isEmpty(formName);
    if (!validName) {
      customNot('warning', 'Verifique nombre de la materia prima', 'Dato no válido');
      return;
    }
    const validCost = isNumber(+formCost) && +formCost >= 0;
    if (!validCost) {
      customNot('warning', 'Verifique costo', 'Dato no válido');
      return;
    }
    setFetching(true);
    rawMaterialsServices.add(formName, formCost)
    .then((response) => {
      const { insertId } = response.data;
      rawMaterialsServices.stocks.findByRawMaterialId(insertId)
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
      customNot('error', 'Algo salió mal', 'Materia prima no añadido');
    });
  }

  function secondStageAction() {
    for (let i = 0; i < formStocks.length; i++) {
      const { initialStock, stock, rawMaterialStockId } = formStocks[i];
      setFetching(true);
      rawMaterialsServices.stocks.updateById(initialStock || 0, stock || 0, rawMaterialStockId)
      .then((response) => {
        setFetching(false);
        if ((i + 1) === formStocks.length) {
          customNot('success', 'Operación exitosa', 'Materia prima añadido');
          restoreState();
          onClose(true);
        }
      })
      .catch((error) => {
        setFetching(false);
        customNot('error', 'Algo salió mal', 'Existencias no establecidas');
      });
    }
  }

  function validateData() {
    const validId = updateMode ? formId !== 0 : true;
    const validName = !isEmpty(formName);
    const validCost = isNumber(+formCost) && +formCost >= 0;
    if (!validName) customNot('warning', 'Verifique nombre', 'Dato no válido');
    if (!validCost) customNot('warning', 'Verifique costo', 'Dato no válido');
    return (validId && validName && validCost);
  }

  function updateAction() {
    if (validateData()) {
      setFetching(true);
      rawMaterialsServices.update(formName, formCost, formId)
      .then((response) => {
        for (let i = 0; i < formStocks.length; i++) {
          const { initialStock, stock, rawMaterialStockId } = formStocks[i];
          setFetching(true);
          rawMaterialsServices.stocks.updateById(initialStock || 0, stock || 0, rawMaterialStockId)
          .then((response) => {
            setFetching(false);
            if ((i + 1) === formStocks.length) {
              customNot('success', 'Operación exitosa', 'Materia prima añadido');
              restoreState();
              onClose(true);
            }
          })
          .catch((error) => {
            setFetching(false);
            customNot('error', 'Algo salió mal', 'Existencias no establecidas');
          });
        }
      })
      .catch((error) => {
        setFetching(false);
        customNot('error', 'Algo salió mal', 'Materia prima no actualizado');
      });
    }
  }

  function deleteAction() {
    const { name } = dataToUpdate;
    Modal.confirm({
      title: '¿Desea eliminar este Materia Prima?',
      centered: true,
      icon: <WarningOutlined />,
      content: `${name || 'Not defined'} será eliminado de la lista de Materia Primas`,
      okText: 'Confirmar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        setFetching(true);
        rawMaterialsServices.remove(formId)
        .then((response) => {
          restoreState();
          setFetching(false);
          onClose(true);
        })
        .catch((error) => {
          setFetching(false);
          customNot('info', 'Algo salió mal', 'El Materia Prima no pudo ser eliminado');
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
          backIcon={<TagsOutlined />}
          title={`${!updateMode ? 'Nueva' : 'Actualizar'} Materia prima`}
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
              <Input onChange={(e) => setFormName(e.target.value)} name={'formName'} value={formName} placeholder={'Materia prima 1'} />
            </Col>
            <Col span={12}>
              <p style={{ margin: '10px 0px 0px 0px' }}>Costo:</p>  
              <InputNumber 
                onChange={(value) => setFormCost(value)}
                addonBefore="$"
                name={'formCost'} 
                value={formCost} 
                placeholder={'1.00'} 
              />
            </Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Existencias" key={'2'} disabled={!updateMode}>
          {
            (formStocks || []).map((element, index) => {
              return (
                <Row gutter={8} key={index}>
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
                </Row>
              )
            })
          }
        </Tabs.TabPane>
      </Tabs>
      <Row gutter={8}>
        
        <Col span={24}>
          <Button 
            type={'primary'} 
            icon={
              updateMode ?
                <SaveOutlined /> : 
                activeTab === '1' ? 
                  <ArrowRightOutlined /> : <SaveOutlined />
            } 
            onClick={
              updateMode ?
                (e) => updateAction() : 
                activeTab === '1' ? 
                  (e) => firstStageAction() : 
                  activeTab === '2' ? 
                    (e) => secondStageAction() :
                    null
            } 
            style={{ width: '100%', marginTop: 20 }} 
            loading={fetching}
            disabled={fetching}
          >
            {
              updateMode ?
                'Guardar' :
                activeTab === '1' ?
                  'Siguiente' : 'Guardar'
            }
          </Button>
        </Col>
        <Col span={24}>
          <Button 
            type={'default'} 
            onClick={(e) => {
              if (!updateMode) restoreState();
              onClose(false)
            }}
            style={{ width: '100%', marginTop: 10 }} 
          >
            Cancelar
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default RawMaterialForm;
