import React, { useState, useEffect } from 'react';
import { Input, Col, Row, Divider, Button, PageHeader, Modal, InputNumber, Alert } from 'antd';
import { CloseOutlined, DeleteOutlined,  SaveOutlined, TagsOutlined, WarningOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';

import { customNot } from '../utils/Notifications.js';

import brandsServices from '../services/BrandsServices.js';
import salesServices from '../services/SalesServices.js';
import { getUserLocation, getUserMyCashier } from '../utils/LocalData.js';
import productPurchasesServices from '../services/ProductPurchasesServices.js';

function NewProductPurchasePayment(props) {
  const [fetching, setFetching] = useState(false);
  const [allowToProceed, setAllowToProceed] = useState(false);
  const [pendingAmountToPay, setPendingAmountToPay] = useState(0.00);
  const [amountToPaid, setAmountToPaid] = useState(null);

  const { open, productPurchaseId, documentNumber, onClose } = props;

  async function loadAmountToPay() {
    setFetching(true);
    try {
      const res = await productPurchasesServices.findPendingAmountToPay(productPurchaseId);
      setPendingAmountToPay(res.data[0].pendingAmount);
      setAllowToProceed(true);
    } catch(error) {
      console.log(error);
    }
    setFetching(false);
  }

  useEffect(() => {
    if (productPurchaseId !== 0) {
      loadAmountToPay();
    }
  }, [ productPurchaseId ]);

  function restoreState() {
    // setId(0);
    // setFormName('');
  }

  function validateData() {
    if (amountToPaid !== null) {
      if (amountToPaid <= pendingAmountToPay) {
        return true;
      } else {
        customNot('warning', 'Verifique cantidad de Pago', 'El Pago no puede ser mayor al saldo pendiente');
        return false;
      }
    } else {
      customNot('warning', 'Verifique cantidad de Pago', 'Ingrese un valor válido de Pago');
      return false;
    }
  }

  function formAction(fullPayment) {
    if (fullPayment) {
      productPurchasesServices.payments.add(
        getUserLocation(),
        getUserMyCashier(),
        productPurchaseId,
        pendingAmountToPay
      ).then((response) => {
        customNot('success', 'Pago realizado', 'Acción exitosa');
        setAmountToPaid(null);
        onClose(true);
      }).catch((error) => {
        customNot('error', 'Error de conexión', `Message: ${error.response.data.errorContent.sqlMessage || 'No info'}`);
      });
    } else {
      if (validateData()) {
        productPurchasesServices.payments.add(
          getUserLocation(),
          getUserMyCashier(),
          productPurchaseId, 
          amountToPaid
        ).then((response) => {
          customNot('success', 'Pago realizado', 'Acción exitosa');
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
      title={`Nuevo pago - Factura #${documentNumber}`}
      centered
      width={650}
      closable={false}
      maskClosable={false}
      open={open}
      footer={null}
    >      
      <Row gutter={8}>
        <Col span={11} style={{ backgroundColor: '#e6f7ff', borderRadius: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ margin: '10px', fontWeight: 600, fontSize: 18, color: '#0050b3' }}>Pagar totalmente</p>
          <p style={{ margin: '0px', marginBottom: '10px', fontSize: 13, color: '#0050b3' }}>{`Pago a efectuar de $${Number(pendingAmountToPay).toFixed(2)}`}</p>
          <Button type={'primary'} disabled={!allowToProceed} onClick={() => formAction(true)}>Proceder</Button>
          <p style={{ margin: '10px' }}>{''}</p>
        </Col>
        <Col span={2}>
          <Divider type='vertical' />
        </Col>
        <Col span={11} style={{ borderRadius: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ margin: '10px', fontWeight: 600, fontSize: 18, color: '#262626' }}>Monto a Pagar:</p>
          <InputNumber addonBefore={'$'} onChange={(value) => setAmountToPaid(value)} name={'amountToPaid'} value={amountToPaid} placeholder={'1.00'} style={{ marginBottom: '10px' }} />
          <Button disabled={!allowToProceed} onClick={() => formAction(false)}>Proceder</Button>
          <p style={{ margin: '10px' }}>{''}</p>
        </Col>
      </Row>
      {
        allowToProceed ? <></> : (
          <>
            <div style={{ marginTop: '10px' }} />
            <Alert message="Algo salió mal. El Pago no puede ser efectuado." type="error" showIcon />
          </>
        )
      }
      <div style={{ borderRadius: 5, marginTop: '10px', display: 'flex', flexDirection: 'row-reverse' }}>
        <Button type={'default'} danger onClick={() => onClose()}>Cancelar</Button>
      </div>
    </Modal>
  )
}

export default NewProductPurchasePayment;
