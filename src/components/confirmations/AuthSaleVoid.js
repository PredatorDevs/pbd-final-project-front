import React, { useState, useEffect } from 'react';
import { PageHeader, Modal, Alert, Row, Col, Button, Input, Divider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import 'moment/locale/es-mx';

function AuthSaleVoid(props) {
  const [fetching, setFetching] = useState(false);

  const { open, saleId, onClose } = props;

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={null}
          title={`Anular despacho #${saleId || ''}`}
          // subTitle={`Usted necesita la clave de autorización para proceder con esta acción`}
        />
      }
      centered
      width={400}
      closeIcon={<CloseOutlined style={{ padding: 5, backgroundColor: '#f0f0f0', borderRadius: 5, color: '#f5222d' }} />}
      onCancel={(e) => onClose()}
      maskClosable={false}
      visible={open}
      footer={null}
    >      
      <Alert message="Requiere una clave de autorización para ejecutar esta acción" type="warning" />
      <div style={{ height: 15 }} />
      <Row gutter={8}>
        <Col span={12}>
          <p style={{ margin: '0px 0px 0px 0px' }}>Clave:</p>  
          <Input />
        </Col>
      </Row>
      <Divider />
      <Row gutter={8}>
        <Col span={24}>
          <Button 
            type={'primary'} 
            onClick={(e) => {
              
            }}
            style={{ width: '100%', marginTop: 10 }}
          >
            Confirmar anulación
          </Button>
        </Col>
        <Col span={24}>
          <Button 
            type={'default'} 
            onClick={(e) => {
              onClose();
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

export default AuthSaleVoid;
