import React, { useState, useEffect } from 'react';
import { Input, Col, Row, Divider, Button, PageHeader, Modal, InputNumber, Alert } from 'antd';
import { CloseOutlined, DeleteOutlined,  SaveOutlined, TagsOutlined, WarningOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';

import { customNot } from '../utils/Notifications.js';

import brandsServices from '../services/BrandsServices.js';
import salesServices from '../services/SalesServices.js';
import { getUserLocation, getUserMyCashier } from '../utils/LocalData.js';

function NewSalePayment(props) {
  const [fetching, setFetching] = useState(false);
  const [allowToProceed, setAllowToProceed] = useState(false);
  const [pendingAmountToPay, setPendingAmountToPay] = useState(0.00);
  const [amountToPaid, setAmountToPaid] = useState(null);

  const { open, saleId, docNumber, onClose } = props;

  useEffect(() => {
    if (saleId !== 0) {
      salesServices.findPendingAmountToPay(saleId)
      .then((response) => {
        setPendingAmountToPay(response.data[0].pendingAmount);
        setAllowToProceed(true);
      }).catch((error) => {
        setAllowToProceed(false);
        customNot('error', 'Error de conexión', 'Revise su conexión a la red');
      });
    }
  }, [ saleId ]);

  function validateData() {
    if (amountToPaid !== null) {
      if (amountToPaid <= pendingAmountToPay) {
        return true;
      } else {
        customNot('warning', 'Verifique cantidad de cobro', 'El cobro no puede ser mayor al saldo pendiente');
        return false;
      }
    } else {
      customNot('warning', 'Verifique cantidad de cobro', 'Ingrese un valor válido de cobro');
      return false;
    }
  }

  function formAction(fullPayment) {
    if (fullPayment) {
      salesServices.payments.add(
        getUserLocation(),
        getUserMyCashier(),
        saleId,
        pendingAmountToPay
      ).then((response) => {
        customNot('success', 'Cobro realizado', 'Acción exitosa');
        setAmountToPaid(null);
        onClose(true);
      }).catch((error) => {
        customNot('error', 'Error de conexión', `Message: ${error.response.data.errorContent.sqlMessage || 'No info'}`);
      });
    } else {
      if (validateData()) {
        salesServices.payments.add(
          getUserLocation(),
          getUserMyCashier(),
          saleId, 
          amountToPaid
        ).then((response) => {
          customNot('success', 'Cobro realizado', 'Acción exitosa');
          setAmountToPaid(null);
          onClose(true);
        }).catch((error) => {
        customNot('error', 'Error de conexión', `Message: ${error.response.data.errorContent.sqlMessage || 'No info'}`);
        });
      }
    }
  }

  return (
    <Modal
      title={`Nuevo cobro - Factura #${docNumber}`}
      centered
      width={650}
      closable={false}
      maskClosable={false}
      open={open}
      footer={null}
    >      
      <Row gutter={8}>
        <Col span={11} style={{ backgroundColor: '#e6f7ff', borderRadius: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ margin: '10px', fontWeight: 600, fontSize: 18, color: '#0050b3' }}>Cobrar totalmente</p>
          <p style={{ margin: '0px', marginBottom: '10px', fontSize: 13, color: '#0050b3' }}>{`Cobro a efectuar de $${Number(pendingAmountToPay).toFixed(2)}`}</p>
          <Button type={'primary'} disabled={!allowToProceed} onClick={() => formAction(true)}>Proceder</Button>
          <p style={{ margin: '10px' }}>{''}</p>
        </Col>
        <Col span={2}>
          <Divider type='vertical' />
        </Col>
        <Col span={11} style={{ borderRadius: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ margin: '10px', fontWeight: 600, fontSize: 18, color: '#262626' }}>Monto a cobrar:</p>
          <InputNumber addonBefore={'$'} onChange={(value) => setAmountToPaid(value)} name={'amountToPaid'} value={amountToPaid} placeholder={'1.00'} style={{ marginBottom: '10px' }} />
          <Button disabled={!allowToProceed} onClick={() => formAction(false)}>Proceder</Button>
          <p style={{ margin: '10px' }}>{''}</p>
        </Col>
      </Row>
      {
        allowToProceed ? <></> : (
          <>
            <div style={{ marginTop: '10px' }} />
            <Alert message="Algo salió mal. El cobro no puede ser efectuado." type="error" showIcon />
          </>
        )
      }
      <div style={{ borderRadius: 5, marginTop: '10px', display: 'flex', flexDirection: 'row-reverse' }}>
        <Button type={'default'} danger onClick={() => onClose()}>Cancelar</Button>
      </div>
    </Modal>
  )
}

export default NewSalePayment;
