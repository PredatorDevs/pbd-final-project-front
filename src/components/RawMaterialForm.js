import React, { useState, useEffect } from 'react';
import { Input, Col, Row, Divider, Button, PageHeader, Modal, InputNumber } from 'antd';
import { DeleteOutlined,  SaveOutlined, TagsOutlined, WarningOutlined } from '@ant-design/icons';
import { isEmpty, isNumber } from 'lodash';

import { customNot } from '../utils/Notifications.js';

import rawMaterialsServices from '../services/RawMaterialsServices.js';

function RawMaterialForm(props) {
  const [fetching, setFetching] = useState(false);

  const [formId, setId] = useState(0);
  const [formName, setFormName] = useState('');
  const [formCost, setFormCost] = useState(0);

  const { open, updateMode, dataToUpdate, onClose } = props;

  useEffect(() => {
    const { id, name, cost, initialStock, stock } = dataToUpdate;
    setId(id || 0);
    setFormName(name || '');
    setFormCost(cost || 0);
    setFormInitialStock(initialStock || 0);
    setFormStock(stock || 0);
  }, [ dataToUpdate ]);

  function restoreState() {
    setId(0);
    setFormName('');
    setFormCost(0);
    setFormInitialStock(0);
    setFormStock(0);
  }

  function validateData() {
    const validId = updateMode ? formId !== 0 : true;
    const validName = !isEmpty(formName);
    const validCost = isNumber(+formCost) && +formCost >= 0;
    if (!validName) customNot('warning', 'Verifique nombre', 'Dato no válido');
    if (!validCost) customNot('warning', 'Verifique costo', 'Dato no válido');
    return (validId && validName && validCost);
  }

  function formAction() {
    if (validateData()) {
      if (!updateMode) {
        setFetching(true);
        rawMaterialsServices.add(
          formName,
          formCost
        )
        .then((response) => {
          customNot('success', 'Operación exitosa', 'Materia prima añadido');
          restoreState();
          setFetching(false);
          onClose(true);
        })
        .catch((error) => {
          setFetching(false);
          customNot('error', 'Algo salió mal', 'Materia prima no añadido');
        })
      } else {
        setFetching(true);
        rawMaterialsServices.update(
          formName, formCost, formId
        )
        .then((response) => {
          customNot('success', 'Operación exitosa', 'Materia prima actualizado');
          restoreState();
          setFetching(false);
          onClose(true);
        })
        .catch((error) => {
          setFetching(false);
          customNot('error', 'Algo salió mal', 'Materia prima no actualizado');
        })
      }
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
      <Row gutter={8}>
        <Col span={24}>
          <p style={{ margin: '0px 0px 0px 0px' }}>Nombre:</p>  
          <Input onChange={(e) => setFormName(e.target.value)} name={'formName'} value={formName} placeholder={'Materia prima 1'} />
        </Col>
        <Divider />
        <Col span={24}>
          <p style={{ margin: '0px 0px 0px 0px' }}>Costo:</p>  
          <InputNumber 
            onChange={(value) => setFormCost(value)}
            name={'formCost'} 
            value={formCost} 
            placeholder={'1.00'} 
          />
        </Col>
        <Col span={24}>
          <Button 
            type={'primary'} 
            icon={<SaveOutlined />} 
            onClick={(e) => formAction()} 
            style={{ width: '100%', marginTop: 20 }} 
            loading={fetching}
            disabled={fetching}
          >
            Guardar
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
