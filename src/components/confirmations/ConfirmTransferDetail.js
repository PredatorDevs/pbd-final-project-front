import React, { useState, useEffect } from 'react';
import { PageHeader, Modal, Alert, Row, Col, Button, Input, Divider, InputNumber } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import 'moment/locale/es-mx';
import transfersServices from '../../services/TransfersServices';
import { customNot } from '../../utils/Notifications';
import { isFinite } from 'lodash';

function ConfirmTransferDetail(props) {
  const [fetching, setFetching] = useState(false);
  const [quantityToConfirm, setQuantityToConfirm] = useState(null);

  const { open, transferDetailId, quantityExpected, productName, onClose } = props;

  function confirmAll() {
    setFetching(true);
    transfersServices.confirmTransferDetail(transferDetailId, quantityExpected)
    .then((response) => {
      setFetching(false);
      setQuantityToConfirm(null);
      onClose(true);
    }).catch((error) => {
      setFetching(false);
      customNot('error', 'Detalle no pudo ser confirmado', 'Verifica los datos o la conexión a la red');
    });
  }

  function confirmManual() {
    const validQuantityToConfirm = isFinite(quantityToConfirm) && quantityToConfirm >= 0 && quantityToConfirm <= quantityExpected;
    if (validQuantityToConfirm) {
      setFetching(true);
      transfersServices.confirmTransferDetail(transferDetailId, quantityToConfirm)
      .then((response) => {
        setFetching(false);
        setQuantityToConfirm(null);
        onClose(true);
      }).catch((error) => {
        setFetching(false);
        customNot('error', 'Detalle no pudo ser confirmado', 'Verifica los datos o la conexión a la red');
      });
    } else {
      customNot('warning', 'Cantidad a confirmar no válida', 'Introduzca un valor válido para la operación');
    }
  }

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={null}
          title={`Detalle Traslado`}
          subTitle={`Código Interno: ${transferDetailId}`}
        />
      }
      centered
      width={500}
      closeIcon={<CloseOutlined style={{ padding: 5, backgroundColor: '#f0f0f0', borderRadius: 5, color: '#f5222d' }} />}
      onCancel={(e) => onClose(false)}
      maskClosable={false}
      visible={open}
      footer={null}
    >
      <Alert message={`${productName || ''}`} type="info" />
      <div style={{ height: 15 }} />
      <Row gutter={8}>  
        <Col span={11} style={{ backgroundColor: '#e6f7ff', borderRadius: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ margin: '10px', fontWeight: 600, fontSize: 14, color: '#0050b3' }}>Confirmar todo</p>
          <p style={{ margin: '0px', marginBottom: '10px', fontSize: 12, color: '#0050b3' }}>{`Confirma de recibido ${quantityExpected}`}</p>
          <Button disabled={fetching} type={'primary'} onClick={() => confirmAll()}>Proceder</Button>
          <p style={{ margin: '10px' }}>{''}</p>
        </Col>
        <Col span={2}>
          <Divider type='vertical' />
        </Col>
        <Col span={11} style={{ borderRadius: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ margin: '10px', fontWeight: 600, fontSize: 14, color: '#262626' }}>Cantidad a confirmar:</p>
          <InputNumber onChange={(value) => setQuantityToConfirm(value)} name={'amountToPaid'} value={quantityToConfirm} placeholder={'123'} style={{ marginBottom: '10px', width: '100%' }} />
          <Button disabled={fetching} onClick={() => confirmManual()}>Proceder</Button>
          <p style={{ margin: '10px' }}>{''}</p>
        </Col>
      </Row>
    </Modal>
  )
}

export default ConfirmTransferDetail;
