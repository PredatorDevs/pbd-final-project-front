import React, { useState, useEffect } from 'react';
import { PageHeader, Modal, Alert, Row, Col, Button, Input, Divider, InputNumber, Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import 'moment/locale/es-mx';
import { customNot } from '../../utils/Notifications';
import { includes } from 'lodash';

function NewSaleCashExchange(props) {
  const [fetching, setFetching] = useState(false);
  const [quantityReceived, setQuantityReceived] = useState(null);

  const { open, onClose, amountToExchange } = props;

  useEffect(() => {
    if (open) document.getElementById('input-form-quantity-to-exchange').focus();
  }, [ open ]);

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={null}
          title={'Cambio de efectivo'}
        />
      }
      centered
      width={450}
      closeIcon={<CloseOutlined style={{ padding: 5, backgroundColor: '#f0f0f0', borderRadius: 5, color: '#f5222d' }} />}
      onCancel={(e) => {
        setQuantityReceived(null);
        onClose();
      }}
      maskClosable={false}
      open={open}
      footer={null}
    >      
      <Row gutter={8}>
        <Col span={12}>
          <p style={{ margin: '0px 0px 0px 0px' }}>Esta venta:</p>
          <p style={{ margin: '0px 0px 10px 0px', fontSize: 18, color: '#1677ff' }}>{`$${amountToExchange}`}</p>
        </Col>
        <Col span={12}>
        </Col>
        <Col span={12}>
          <p style={{ margin: '0px 0px 0px 0px' }}>Recibe:</p>  
          <InputNumber
            prefix={'$'}
            id={'input-form-quantity-to-exchange'}
            style={{ width: 150, marginBottom: 10 }}
            size='large'
            onChange={(val) => setQuantityReceived(val)}
            name={'quantityReceived'}
            value={quantityReceived}
            onKeyDown={
              (e) => {
                if (e.key === 'Enter')
                  onClose();
              }
            }
          />
        </Col>
        <Col span={12}>
        </Col>
        <Col span={12}>
          <p style={{ margin: '0px 0px 0px 0px' }}>Cambio:</p>
          <p
            style={{
              margin: '0px 0px 10px 0px',
              fontSize: 18,
              color: quantityReceived < amountToExchange ? '#f5222d' : '#52c41a',
              backgroundColor: '#f5f5f5',
              borderRadius: 5,
              padding: 5
            }}
          >
            {`$${(quantityReceived - amountToExchange).toFixed(2)}`}
          </p>
        </Col>
        <Col span={12}>
        </Col>
      </Row>
      <Divider />
      <Row gutter={8}>
        <Col span={24}>
          <Button 
            type={'primary'} 
            onClick={(e) => {
              setQuantityReceived(null);
              onClose();
            }}
            style={{ width: '100%', marginTop: 10 }}
            loading={fetching}
            disabled={quantityReceived < amountToExchange}
          >
            {'Terminar'}
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default NewSaleCashExchange;
