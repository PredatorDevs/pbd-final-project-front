import React, { useState, useEffect } from 'react';
import { Col, Row, Divider, Button, PageHeader, Modal, InputNumber, Space } from 'antd';
import { TagsOutlined } from '@ant-design/icons';

import { customNot } from '../utils/Notifications.js';

import { getUserId, getUserName } from '../utils/LocalData.js';
import cashiersServices from '../services/CashiersServices.js';
import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';

function ClosingShiftcutModal(props) {
  const [fetching, setFetching] = useState(false);

  // const [formId, setId] = useState(0);
  const [shiftcutDatetime, setShifcutDatetime] = useState(defaultDate());
  const [remittedAmount, setRemittedAmount] = useState(null);

  const { open, locationId, cashierId, finalAmount, onClose } = props;

 
  useEffect(() => {
    // const { id, name } = dataToUpdate;
    // setId(id || 0);
    // setFormName(name || '');
  }, [ ]);

  // function restoreState() {
  //   setId(0);
  //   setFormName('');
  // }

  function defaultDate() {
    return moment();
  };

  function validateData() {
    const validRemittedAmount = isFinite(remittedAmount) && remittedAmount >= 0 && remittedAmount !== null;
    if (!validRemittedAmount) customNot('warning', 'Ingrese una cantidad válida', 'Monto de efectivo no válido');
    return validRemittedAmount;
  }

  function closingAction() {
    if (validateData()) {
      setFetching(true);
      cashiersServices.closeCurrentAndOpenNextShiftcut(
        locationId || 0, 
        cashierId || 0,
        getUserId(), 
        moment().format('YYYY-MM-DD HH:mm:ss'), 
        (finalAmount - remittedAmount), 
        finalAmount, 
        remittedAmount, 
        shiftcutDatetime.isValid() ? shiftcutDatetime.format('YYYY-MM-DD HH:mm:ss') : null
      )
      .then((response) => {
        const { closedShitcutId } = response.data[0];
        customNot('success', 'Operación exitosa', 'Turno cerrado');
        setFetching(false);
        onClose(true, closedShitcutId);
      })
      .catch((error) => {
        setFetching(false);
        customNot('error', 'Algo salió mal', 'Turno no cerrado');
      });
    }
  }

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={<TagsOutlined />}
          title={`Cerrar turno`}
          // subTitle={`El turno está siendo cerrado por: ${getUserName()}`}
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
        {/* <Col span={24}>
          <p style={{ margin: '0px 0px 0px 0px' }}>Fecha de corte:</p>  
          <DatePicker 
            locale={locale} 
            format="DD-MM-YYYY HH:mm:ss" 
            value={shiftcutDatetime} 
            style={{ width: '100%' }}
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            onChange={(datetimeMoment, datetimeString) => {
              setShifcutDatetime(datetimeMoment);
            }}
          />
        </Col> */}
        <Col span={24}>
          {/* <div style={{ height: 10 }}></div> */}
          <p style={{ margin: '0px 0px 0px 0px' }}>Efectivo a entregar:</p>  
          <InputNumber addonBefore={'$'} onChange={(value) => setRemittedAmount(value)} name={'remittedAmount'} value={remittedAmount} placeholder={'10.00'} />
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
            <p style={{ color: '#CACACA', fontSize: 11 }}>{`Cierre de turno por:`}</p>
            <p style={{ color: '#343434', fontSize: 13, fontWeight: 600 }}>{`${getUserName()}`}</p>
          </Space>
        </Col>
      </Row>
    </Modal>
  )
}

export default ClosingShiftcutModal;
