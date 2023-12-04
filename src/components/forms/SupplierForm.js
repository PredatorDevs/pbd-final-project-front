import React, { useState, useEffect } from 'react';
import { Input, Col, Row, Divider, Button, PageHeader, Modal } from 'antd';
import { DeleteOutlined,  SaveOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';

import { customNot } from '../../utils/Notifications';

import suppliersServices from '../../services/SuppliersServices';
import { validateNit, validateStringData } from '../../utils/ValidateData';

function SupplierForm(props) {
  const [fetching, setFetching] = useState(false);

  const [formId, setId] = useState(0);
  const [formFullName, setFullName] = useState('');
  const [formAddress, setAddress] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDui, setFormDui] = useState('');
  const [formNit, setFormNit] = useState('');
  const [formNrc, setFormNrc] = useState('');
  const [formBusinessLine, setFormBusinessLine] = useState('');
  const [formOccupation, setFormOccupation] = useState('');

  const { open, updateMode, dataToUpdate, onClose } = props;

  useEffect(() => {
    const {
      id,
      name,
      address,
      phone,
      email,
      dui,
      nit,
      nrc,
      businessLine,
      occupation
    } = dataToUpdate;
    
    setId(id || 0);
    setFullName(name || '');
    setAddress(address || '');
    setFormPhone(phone || '');
    setFormEmail(email || '');
    setFormDui(dui || '');
    setFormNit(nit || '');
    setFormNrc(nrc || '');
    setFormBusinessLine(businessLine || '');
    setFormOccupation(occupation || '');
  }, [ dataToUpdate ]);

  function restoreState() {
    setId(0);
    setFullName('');
    setAddress('');
    setFormPhone('');
    setFormEmail('');
    setFormDui('');
    setFormNit('');
    setFormNrc('');
    setFormBusinessLine('');
    setFormOccupation('');
  }

  function validateData() {
    const validId = updateMode ? formId !== 0 : true;
    const validFullName = !isEmpty(formFullName);
    if (!validFullName) customNot('warning', 'Verifique nombre completo', 'Dato no válido');
    return (
      validId
      && validFullName
      && validateStringData(formAddress, 'Introduzca la dirección del proveedor')
      && validateNit(formNit, 'Introduzca un NIT válido')
      && validateStringData(formNrc, 'Introduzca un NRC válido')
      && validateStringData(formBusinessLine, 'Especifique el giro del proveedor')
    );
  }

  function formAction() {
    if (validateData()) {
      if (!updateMode) {
        setFetching(true);
        suppliersServices.add(
          formFullName,
          formAddress,
          formPhone,
          formEmail,
          formDui,
          formNit,
          formNrc,
          formBusinessLine,
          formOccupation
        )
        .then((response) => {
          customNot('success', 'Operación exitosa', 'Proveedor añadido');
          restoreState();
          setFetching(false);
          onClose(true);
        })
        .catch((error) => {
          setFetching(false);
          customNot('error', 'Algo salió mal', 'Proveedor no añadido');
        })
      } else {
        setFetching(true);
        suppliersServices.update(
          formFullName,
          formAddress,
          formPhone,
          formEmail,
          formDui,
          formNit,
          formNrc,
          formBusinessLine,
          formOccupation,
          formId
        )
        .then((response) => {
          customNot('success', 'Operación exitosa', 'Proveedor actualizado');
          restoreState();
          setFetching(false);
          onClose(true);
        })
        .catch((error) => {
          setFetching(false);
          customNot('error', 'Algo salió mal', 'Proveedor no actualizado');
        })
      }
    }
  }

  function deleteAction() {
    const { name } = dataToUpdate;
    Modal.confirm({
      title: '¿Desea eliminar este proveedor?',
      centered: true,
      icon: <WarningOutlined />,
      content: `${name || 'Not defined'} será eliminado de la lista de proveedores`,
      okText: 'Confirmar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        setFetching(true);
        suppliersServices.remove(formId)
        .then((response) => {
          restoreState();
          setFetching(false);
          onClose(true);
        })
        .catch((error) => {
          setFetching(false);
          customNot('info', 'Algo salió mal', 'El proveedor no pudo ser eliminado');
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
          backIcon={<UserOutlined />}
          title={`${!updateMode ? 'Nuevo' : 'Actualizar'} proveedor`}
          extra={!updateMode ? [] : [
            <Button key="1" type="danger" size={'small'} icon={<DeleteOutlined />} onClick={(e) => deleteAction()}>
              Eliminar
            </Button>
          ]}
        />
      }
      centered
      width={600}
      closable={false}
      maskClosable={false}
      open={open}
      footer={null}
    >      
      <Row gutter={8}>
        <Col span={24}>
          <p style={{ margin: '0px 0px 0px 0px' }}>Nombre:</p>  
          <Input onChange={(e) => setFullName(e.target.value.toUpperCase())} name={'formFullName'} value={formFullName} placeholder={'Distribuidora S.A. de C.V.'} />
        </Col>
        <Col span={24}>
          <p style={{ margin: '10px 0px 0px 0px' }}>Dirección:</p>  
          <Input onChange={(e) => setAddress(e.target.value.toUpperCase())} name={'formAddress'} value={formAddress} placeholder={'San Miguel'} />
        </Col>
        <Col span={12}>
          <p style={{ margin: '10px 0px 0px 0px' }}>Teléfono:</p>  
          <Input onChange={(e) => setFormPhone(e.target.value)} name={'formPhone'} value={formPhone} placeholder={'2666-0000'} />
        </Col>
        <Col span={12}>
          <p style={{ margin: '10px 0px 0px 0px' }}>Correo:</p>  
          <Input onChange={(e) => setFormEmail(e.target.value)} name={'formEmail'} value={formEmail} placeholder={'jhondoe@mail.com'} />
        </Col>
        <Col span={8}>
          <p style={{ margin: '10px 0px 0px 0px' }}>DUI:</p>  
          <Input onChange={(e) => setFormDui(e.target.value)} name={'formDui'} value={formDui} placeholder={'0123456-7'} />
        </Col>
        <Col span={8}>
          <p style={{ margin: '10px 0px 0px 0px' }}>NIT:</p>  
          <Input onChange={(e) => setFormNit(e.target.value)} name={'formNit'} value={formNit} placeholder={'0123-456789-012-3'} />
        </Col>
        <Col span={8}>
          <p style={{ margin: '10px 0px 0px 0px' }}>NRC:</p>  
          <Input onChange={(e) => setFormNrc(e.target.value)} name={'formNrc'} value={formNrc} placeholder={'0123-4'} />
        </Col>
        <Col span={24}>
          <p style={{ margin: '10px 0px 0px 0px' }}>Giro:</p>  
          <Input onChange={(e) => setFormBusinessLine(e.target.value.toUpperCase())} name={'formBusinessLine'} value={formBusinessLine} placeholder={'COMPRA VENTA'} />
        </Col>
        <Col span={24}>
          <p style={{ margin: '10px 0px 0px 0px' }}>Ocupacion:</p>  
          <Input onChange={(e) => setFormOccupation(e.target.value.toUpperCase())} name={'formOccupation'} value={formOccupation} placeholder={'COMERCIANTE'} />
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

export default SupplierForm;
