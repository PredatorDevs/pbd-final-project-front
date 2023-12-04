import React, { useState, useEffect } from 'react';
import { PageHeader, Modal, Alert, Row, Col, Button, Input, Divider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import 'moment/locale/es-mx';
import { authUserPassword } from '../../services/AuthServices';
import { customNot } from '../../utils/Notifications';
import { includes } from 'lodash';

function AuthorizeAction(props) {
  const [fetching, setFetching] = useState(false);
  const [userKey, setUserKey] = useState('');

  const { open, allowedRoles, title, confirmButtonText, onClose } = props;

  async function formAction() {
    setFetching(true);
    const res = await authUserPassword(userKey);
    const { userId, roleId, successAuth } = res.data[0];
    if (successAuth && includes(allowedRoles, roleId)) {
      customNot('success', 'Autorizado', 'Acción ejecutada');
      onClose(true, { userId, roleId, successAuth });
      setUserKey('');
      setFetching(false);
    } else {
      customNot('error', 'No Autorizado', 'Su clave no cuenta con los privilegios necesarios o no es correcta');
      setFetching(false);
    }
    setFetching(false);
  }

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={null}
          title={title}
        />
      }
      centered
      width={450}
      closeIcon={<CloseOutlined style={{ padding: 5, backgroundColor: '#f0f0f0', borderRadius: 5, color: '#f5222d' }} />}
      onCancel={(e) => onClose(false, { userId: null, roleId: null, successAuth: null })}
      maskClosable={false}
      visible={open}
      footer={null}
    >      
      <Alert message="Requiere una clave de autorización para ejecutar esta acción" type="warning" />
      <div style={{ height: 15 }} />
      <Row gutter={8}>
        <Col span={12}>
          <p style={{ margin: '0px 0px 0px 0px' }}>Clave:</p>  
          <Input.Password
            onChange={(e) => setUserKey(e.target.value)}
            name={'userKey'}
            value={userKey}
            onKeyDown={
              (e) => {
                if (e.key === 'Enter')
                  formAction();
              }
            }
          />
        </Col>
      </Row>
      <Divider />
      <Row gutter={8}>
        <Col span={24}>
          <Button 
            type={'primary'} 
            onClick={(e) => {
              formAction();
            }}
            style={{ width: '100%', marginTop: 10 }}
          >
            {confirmButtonText || 'Confirmar'}
          </Button>
        </Col>
        <Col span={24}>
          <Button 
            type={'default'} 
            onClick={(e) => {
              setUserKey('');
              onClose(false, { userId: null, roleId: null, successAuth: null });
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

export default AuthorizeAction;
