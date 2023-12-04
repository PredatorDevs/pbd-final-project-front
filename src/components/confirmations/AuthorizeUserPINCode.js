import React, { useState, useEffect } from 'react';
import { PageHeader, Modal, Alert, Row, Col, Button, Input, Divider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import 'moment/locale/es-mx';
import { authUserPINCode } from '../../services/AuthServices';
import { customNot } from '../../utils/Notifications';
import { includes } from 'lodash';

function AuthorizeUserPINCode(props) {
  const [fetching, setFetching] = useState(false);
  const [userPINCode, setUserPINCode] = useState('');

  const { open, title, confirmButtonText, onClose } = props;

  useEffect(() => {
    if (open) document.getElementById('input-form-user-pin-code').focus();
  }, [ open ]);

  async function formAction() {
    setFetching(true);
    const res = await authUserPINCode(userPINCode);
    const { userId, fullName, roleId, successAuth } = res.data[0];
    if (successAuth) {
      customNot('success', `Verificación exitosa`, `PIN confirmado para ${fullName}`);
      onClose(true, { userId, fullName, roleId, successAuth, userPINCode });
      setUserPINCode('');
      setFetching(false);
    } else {
      customNot('error', 'No Autorizado', 'Su PIN no cuenta con los privilegios necesarios o no es correcto');
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
      open={open}
      footer={null}
    >      
      <Alert message="Requiere el uso de su PIN personal para ejecutar esta acción" type="warning" />
      <div style={{ height: 15 }} />
      <Row gutter={8}>
        <Col span={12}>
          <p style={{ margin: '0px 0px 0px 0px' }}>PIN:</p>  
          <Input.Password
            id={'input-form-user-pin-code'}
            onChange={(e) => setUserPINCode(e.target.value)}
            name={'userPINCode'}
            maxLength={5}
            value={userPINCode}
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
            loading={fetching}
          >
            {confirmButtonText || 'Confirmar'}
          </Button>
        </Col>
        <Col span={24}>
          <Button 
            type={'default'} 
            onClick={(e) => {
              setUserPINCode('');
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

export default AuthorizeUserPINCode;
