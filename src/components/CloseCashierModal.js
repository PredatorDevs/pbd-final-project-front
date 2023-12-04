import React, { useState, useEffect } from 'react';
import { Col, Row, Divider, Button, PageHeader, Modal, InputNumber, Space, Input } from 'antd';
import { DollarOutlined, LockOutlined, TagsOutlined } from '@ant-design/icons';

import { customNot } from '../utils/Notifications.js';

import { getUserId, getUserName } from '../utils/LocalData.js';
import cashiersServices from '../services/CashiersServices.js';
import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import reportsServices from '../services/ReportsServices.js';
import download from 'downloadjs';
import { isEmpty } from 'lodash';

function CloseCashierModal(props) {
  const [fetching, setFetching] = useState(false);

  const [remittedAmount, setRemittedAmount] = useState(null);
  const [formPINCode, setFormPINCode] = useState('');

  const { open, cashierId, finalAmount, cashFunds, onClose } = props;

  function validateData() {
    const regPINCode = /^\d+$/;
    const validRemittedAmount = isFinite(remittedAmount) && remittedAmount >= 0 && remittedAmount !== null;
    const validPINCode = !isEmpty(`${formPINCode}`) && `${formPINCode}`.length === 5 && regPINCode.test(formPINCode);
    
    if (!validRemittedAmount) customNot('warning', 'Ingrese una cantidad válida', 'Monto de efectivo no válido');
    if (!validPINCode) customNot('warning', 'El PIN único de usuario no es válido', 'Debe ser un PIN de cinco dígitos numéricos y debe cumplir la verificación');
    
    return validRemittedAmount && validPINCode;
  }

  function restoreState() {
    // setRemittedAmount(null);
    setFormPINCode('');
  }

  async function closingAction() {
    if (validateData()) {
      setFetching(true);
      try {
        const response = await cashiersServices.closeCashier(
          cashierId,
          getUserId(),
          moment().format('YYYY-MM-DD HH:mm:ss'),
          finalAmount,
          remittedAmount,
          cashFunds,
          formPINCode
        );

        const {
          cashierName,
          locationName,
          shiftcutNumber,
          closedShiftcutId
        } = response.data[0];

        customNot('info', 'Descargando Reporte', 'Espere por favor...')

        const downloadPDFRes = await reportsServices.shiftcutSettlement(closedShiftcutId);
        download(downloadPDFRes.data, `Corte${shiftcutNumber}${cashierName}${locationName}.pdf`.replace(/ /g,''));

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
          title={`Cerrar caja`}
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
          <p style={{ margin: '0px 0px 0px 0px' }}>Efectivo a entregar:</p>  
          <InputNumber
            addonBefore={<DollarOutlined />}
            onChange={(value) => setRemittedAmount(value)}
            name={'remittedAmount'}
            value={remittedAmount}
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
          <Button danger style={{ width: '100%' }} onClick={(e) => onClose(false)}>Cancelar</Button>
        </Col>
        <Col span={12}>
          <div style={{ height: 10 }}></div>
          <Button type='primary' style={{ width: '100%' }} onClick={(e) => closingAction()} loading={fetching} disabled={fetching}>Confirmar cierre</Button>
        </Col>
        <Col span={24}>
          <div style={{ height: 20 }}></div>
        </Col>
        <Col span={24}>
          <Space>
            <p style={{ color: '#CACACA', fontSize: 11 }}>{`Cerrando con usuario:`}</p>
            <p style={{ color: '#343434', fontSize: 13, fontWeight: 600 }}>{`${getUserName()}`}</p>
          </Space>
        </Col>
      </Row>
    </Modal>
  )
}

export default CloseCashierModal;
