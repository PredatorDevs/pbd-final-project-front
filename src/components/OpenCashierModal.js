import React, { useState, useEffect } from 'react';
import { Col, Row, Divider, Button, PageHeader, Modal, InputNumber, Space, Input } from 'antd';
import { DollarOutlined, LockOutlined, TagsOutlined } from '@ant-design/icons';

import { customNot } from '../utils/Notifications.js';

import { getUserId, getUserName } from '../utils/LocalData.js';
import cashiersServices from '../services/CashiersServices.js';
import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import { isEmpty } from 'lodash';

function OpenCashierModal(props) {
  const [fetching, setFetching] = useState(false);

  const [initialAmount, setInitialAmount] = useState(null);
  const [formPINCode, setFormPINCode] = useState('');

  const { open, cashierId, onClose } = props;

  useEffect(() => {
    if (cashierId !== 0 || cashierId !== null || cashierId !== undefined) {
      getCashierInitialInfo();
    }
  }, [ cashierId ]);

  async function getCashierInitialInfo() {
    setFetching(true);
    try {
      const res = await cashiersServices.getDefaultInitialCashById(cashierId);
      const { defaultInitialCash } = res.data[0];
      setInitialAmount(defaultInitialCash || 0);
    } catch(error) {
      
    }
    setFetching(false);
  }

  function restoreState() {
    // setInitialAmount(null);
    setFormPINCode('');
  }

  function validateData() {
    const regPINCode = /^\d+$/;
    const validInitialAmount = isFinite(initialAmount) && initialAmount >= 0 && initialAmount !== null;
    const validPINCode = !isEmpty(`${formPINCode}`) && `${formPINCode}`.length === 5 && regPINCode.test(formPINCode);
    
    if (!validInitialAmount) customNot('warning', 'Ingrese una cantidad válida', 'Monto de efectivo no válido');
    if (!validPINCode) customNot('warning', 'El PIN único de usuario no es válido', 'Debe ser un PIN de cinco dígitos numéricos y debe cumplir la verificación');
    
    return validInitialAmount && validPINCode;
  }

  async function openingAction() {
    if (validateData()) {
      setFetching(true);
      try {
        const response = await cashiersServices.openCashier(
          cashierId,
          getUserId(),
          moment().format('YYYY-MM-DD HH:mm:ss'),
          initialAmount,
          formPINCode
        );
  
        setFetching(false);
        
        restoreState();
        onClose(true);
      } catch(error) {

      }
      setFetching(false);
    }
  }

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={<TagsOutlined />}
          title={`Aperturar caja`}
          // subTitle={`El turno está siendo cerrado por: ${getUserName()}`}
        />
      }
      centered
      width={450}
      closable={false}
      maskClosable={false}
      open={open}
      footer={null}
    >
      <Row gutter={8}>
        <Col span={24}>
          <p style={{ margin: '0px 0px 0px 0px' }}>Efectivo inicial:</p>  
          <InputNumber
            addonBefore={<DollarOutlined />}
            onChange={(value) => setInitialAmount(value)}
            name={'initialAmount'}
            value={initialAmount}
            placeholder={'10.00'}
          />
        </Col>
        <Col span={24}>
          <div style={{ height: 5 }}></div>
        </Col>
        <Col span={24}>
          <p style={{ margin: '0px 0px 0px 0px' }}>PIN Personal:</p>  
          <Input.Password
            addonBefore={<LockOutlined />}
            onChange={(e) => {
              setFormPINCode(e.target.value);
            }}
            maxLength={5}
            name={'formPINCode'}
            value={formPINCode}
          />
        </Col>
        <Col span={24}>
          <Divider />
        </Col>
        <Col span={12}>
          <div style={{ height: 10 }}></div>
          <Button
            danger
            style={{ width: '100%' }}
            onClick={(e) => {
              restoreState();
              onClose(false);
            }}
          >
            Cancelar
          </Button>
        </Col>
        <Col span={12}>
          <div style={{ height: 10 }}></div>
          <Button type='primary' style={{ width: '100%' }} onClick={(e) => openingAction()} loading={fetching} disabled={fetching}>Confirmar apertura</Button>
        </Col>
        <Col span={24}>
          <div style={{ height: 20 }}></div>
        </Col>
        <Col span={24}>
          <Space>
            <p style={{ color: '#CACACA', fontSize: 11 }}>{`Aperturando con usuario:`}</p>
            <p style={{ color: '#343434', fontSize: 13, fontWeight: 600 }}>{`${getUserName()}`}</p>
          </Space>
        </Col>
      </Row>
    </Modal>
  )
}

export default OpenCashierModal;
