import React, { useState, useEffect } from 'react';
import { Input, Col, Row, Divider, Button, PageHeader, Modal } from 'antd';
import { DeleteOutlined,  ForkOutlined,  SaveOutlined, WarningOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';

import { customNot } from '../utils/Notifications.js';

import deliveryRoutesServices from '../services/DeliveryRoutesServices.js';

function DeliveryRouteForm(props) {
  const [fetching, setFetching] = useState(false);

  const [formId, setId] = useState(0);
  const [formName, setFormName] = useState('');

  const { open, updateMode, dataToUpdate, onClose } = props;

  useEffect(() => {
    const { id, name } = dataToUpdate;
    setId(id || 0);
    setFormName(name || '');
  }, [ dataToUpdate ]);

  function restoreState() {
    setId(0);
    setFormName('');
  }

  function validateData() {
    const validId = updateMode ? formId !== 0 : true;
    const validFullName = !isEmpty(formName);
    if (!validFullName) customNot('warning', 'Verifique nombre', 'Dato no válido');
    return (
      validId && validFullName
    );
  }

  function formAction() {
    if (validateData()) {
      if (!updateMode) {
        setFetching(true);
        deliveryRoutesServices.add(
          formName
        )
        .then((response) => {
          customNot('success', 'Operación exitosa', 'Ruta añadido');
          restoreState();
          setFetching(false);
          onClose(true);
        })
        .catch((error) => {
          setFetching(false);
          customNot('error', 'Algo salió mal', 'Ruta no añadido');
        })
      } else {
        setFetching(true);
        deliveryRoutesServices.update(
          formName, formId
        )
        .then((response) => {
          customNot('success', 'Operación exitosa', 'Ruta actualizado');
          restoreState();
          setFetching(false);
          onClose(true);
        })
        .catch((error) => {
          setFetching(false);
          customNot('error', 'Algo salió mal', 'Ruta no actualizado');
        })
      }
    }
  }

  function deleteAction() {
    const { name } = dataToUpdate;
    Modal.confirm({
      title: '¿Desea eliminar este Ruta?',
      centered: true,
      icon: <WarningOutlined />,
      content: `${name || 'Not defined'} será eliminado de la lista de Rutas`,
      okText: 'Confirmar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        setFetching(true);
        deliveryRoutesServices.remove(formId)
        .then((response) => {
          restoreState();
          setFetching(false);
          onClose(true);
        })
        .catch((error) => {
          setFetching(false);
          customNot('info', 'Algo salió mal', 'El Ruta no pudo ser eliminado');
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
          backIcon={<ForkOutlined />}
          title={`${!updateMode ? 'Nueva' : 'Actualizar'} Ruta`}
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
          <Input onChange={(e) => setFormName(e.target.value)} name={'formName'} value={formName} placeholder={'Ruta 1'} />
        </Col>
        <Divider />
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

export default DeliveryRouteForm;
