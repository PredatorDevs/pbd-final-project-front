import React, { useState, useEffect, useRef } from 'react';
import { Input, Col, Row, Divider, Button, PageHeader, Modal, Descriptions, Badge, Table, Tag, InputNumber, Switch } from 'antd';
import { CloseOutlined, DollarOutlined, EditTwoTone, LockOutlined, SaveOutlined} from '@ant-design/icons';
import { isEmpty } from 'lodash';
import moment from 'moment';
import 'moment/locale/es-mx';
import { validateNumberData, validateSelectedData, validateStringData } from '../../utils/ValidateData';
import cashiersServices from '../../services/CashiersServices';
import { customNot } from '../../utils/Notifications';

const { TextArea } = Input;

function NewCashierCashFundWithdraw(props) {
  const [fetching, setFetching] = useState(false);

  const [formMovementAmount, setFormMovementAmount] = useState(null);
  const [formComments, setFormComments] = useState('');
  const [formPINCode, setFormPINCode] = useState('');

  const {
    open,
    cashierId,
    onClose
  } = props;

  useEffect(() => {
    console.log(cashierId);
  }, [ cashierId ]);

  function restoreState() {
    setFormMovementAmount(null);
    setFormComments('');
    setFormPINCode('');
  }

  function validateData() {
    const regPINCode = /^\d+$/;
    const validMovementAmount = isFinite(formMovementAmount) && formMovementAmount > 0 && formMovementAmount !== null;
    const validPINCode = !isEmpty(`${formPINCode}`) && `${formPINCode}`.length === 5 && regPINCode.test(formPINCode);

    if (!validMovementAmount) customNot('warning', 'Ingrese una cantidad válida mayor a cero', 'Monto de efectivo no válido');
    if (!validPINCode) customNot('warning', 'El PIN único de usuario no es válido', 'Debe ser un PIN de cinco dígitos numéricos y debe cumplir la verificación');
    
    return (
      validMovementAmount
      && validPINCode
      && validateSelectedData(cashierId, 'No se puede determinar sobre que caja va a realizar la reposicion')  
      && validateStringData(formComments, 'Debe especificar una razon sobre la reposicion')  
    );
  }

  async function formAction() {
    if (validateData()) {
      setFetching(true);
      try {
        const movementRes = await cashiersServices.newCashFundWithdraw(
          cashierId,
          formMovementAmount,
          formComments,
          formPINCode
        );

        restoreState();
        onClose(true);
      } catch (error) {
        console.log(error);
      }
      setFetching(false);
    }
  }

  return (
    <Modal
      centered
      width={650}
      closeIcon={<CloseOutlined style={{ padding: 5, backgroundColor: '#f0f0f0', borderRadius: 5, color: '#f5222d' }} />}
      onCancel={() => {
        onClose(false);
        restoreState();
      }}
      bodyStyle={{ backgroundColor: '#FFF5F5' }}
      maskClosable={false}
      open={open}
      footer={null}
    >
      {
        <>
          <p style={{ fontSize: 14, margin: 0, fontWeight: 600, color: '#f5222d' }}>{`Nuevo Retiro de Caja Chica`}</p>
          <div style={{ height: 20 }}/>
          <Row gutter={8} style={{ width: '100%' }}>
            <Col span={24}>
              <p style={{ margin: '0px 0px 0px 0px' }}>Monto a retirar:</p>  
              <InputNumber
                addonBefore={<DollarOutlined />}
                onChange={(value) => setFormMovementAmount(value)}
                min={0}
                name={'formMovementAmount'}
                value={formMovementAmount}
                placeholder={'10.00'}
              />
            </Col>
            <Col span={24}>
              <div style={{ height: 5 }}/>
            </Col>
            <Col span={24}>
              <p style={{ margin: '0px 0px 0px 0px' }}>Razon:</p>  
              <TextArea
                onChange={(e) => setFormComments(e.target.value)}
                name={'formComments'}
                value={formComments}
                placeholder={'Se ha comprado X articulo para la sala de venta'}
              />
            </Col>
            <Col span={24}>
              <div style={{ height: 5 }}/>
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
              <div style={{ height: 20 }}/>
            </Col>
            <Col span={12}>
              <Button
                loading={fetching}
                onClick={() => {
                  onClose(false);
                  restoreState();
                }}
                style={{ width: '100%' }}
              >
                Cancelar
              </Button>
            </Col>
            <Col span={12}>
              <Button
                type='primary'
                loading={fetching}
                icon={<SaveOutlined />}
                onClick={() => {
                  formAction();
                }}
                style={{ width: '100%' }}
              >
                Guardar
              </Button>
            </Col>
          </Row>
        </>
      }
    </Modal>
  )
}

export default NewCashierCashFundWithdraw;
