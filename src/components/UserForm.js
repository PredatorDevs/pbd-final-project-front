import React, { useState, useEffect } from 'react';
import { Input, Col, Row, Divider, Button, Select, PageHeader, Modal, Radio, Checkbox, InputNumber } from 'antd';
import { DeleteOutlined,  SaveOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';

import { customNot } from '../utils/Notifications';
import { getUserId, getUserIsAdmin } from '../utils/LocalData';

import usersService from '../services/UsersService';
import rolesService from '../services/RolesServices';
import locationsService from '../services/LocationsServices';
import cashiersServices from '../services/CashiersServices';

const { Option } = Select;

function UserForm(props) {
  const [fetching, setFetching] = useState(false);

  const [formId, setId] = useState(0);
  const [formFullName, setFullName] = useState('');
  const [formUsername, setUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formPasswordVal, setFormPasswordVal] = useState('');
  const [formPINCode, setFormPINCode] = useState('');
  const [formPINCodeVal, setFormPINCodeVal] = useState(null);
  const [formRoleId, setFormRoleId] = useState(0);
  const [formLocationId, setFormLocationId] = useState(0);
  const [formCashierId, setFormCashierId] = useState(0);
  const [formIsAdmin, setFormIsAdmin] = useState(0);
  const [formCanCloseCashier, setFormCanCloseCashier] = useState(false);

  const [rolesData, setRolesData] = useState([]);
  const [locationsData, setLocationsData] = useState([]);
  const [cashiersData, setCashiersData] = useState([]);

  const { open, updateMode, dataToUpdate, onClose } = props;

  useEffect(() => {
    const { id, fullName, username, roleId, locationId, cashierId, isAdmin, canCloseCashier } = dataToUpdate;
    setId(id || 0);
    setFullName(fullName || '');
    setUsername(username || '');
    setFormRoleId(roleId || 0);
    setFormLocationId(locationId || 0);
    setFormCashierId(cashierId || 0);
    setFormIsAdmin(isAdmin || 0);
    setFormCanCloseCashier(canCloseCashier || false);
  }, [ dataToUpdate ]);

  async function loadData() {
    setFetching(true);

    const rolesResponse = await rolesService.find();
    const locationsResponse = await locationsService.find();
    const cashiersResponse = await cashiersServices.find();

    setRolesData(rolesResponse.data);
    setLocationsData(locationsResponse.data);
    setCashiersData(cashiersResponse.data);

    setFetching(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function restoreState() {
    setId(0);
    setFullName('');
    setUsername('');
    setFormPassword('');
    setFormPasswordVal('');
    setFormPINCode(null);
    setFormPINCodeVal(null);
    setFormRoleId(0);
    setFormLocationId(0);
    setFormCashierId(0);
    setFormIsAdmin(0);
    setFormCanCloseCashier(false);
  }

  function validateData() {
    const regPINCode = /^\d+$/;
    const validId = updateMode ? formId !== 0 : true;
    const validFullName = !isEmpty(formFullName);
    const validUsername = !isEmpty(formUsername);
    const validPassword = !updateMode ? !isEmpty(formPassword) && (formPassword === formPasswordVal) : true;
    const validPINCode = !isEmpty(`${formPINCode}`) && `${formPINCode}`.length === 5 && regPINCode.test(formPINCode) && (formPINCode === formPINCodeVal);
    const validRoleId = formRoleId !== 0;
    const validLocationId = formLocationId !== 0;
    const validCashierId = formCashierId !== 0;
    if (!validFullName) customNot('warning', 'Verifique nombre completo', 'Dato no válido');
    if (!validUsername) customNot('warning', 'Verifique nombre de usuario', 'Dato no válido');
    if (!validPassword) customNot('warning', 'Verifique contraseña', 'Dato no válido');
    if (!validPINCode) customNot('warning', 'El PIN único de usuario no es válido', 'Debe ser un PIN de cinco dígitos numéricos y debe cumplir la verificación');
    if (!validRoleId) customNot('warning', 'Seleccione un rol', 'Dato no válido');
    if (!validLocationId) customNot('warning', 'Seleccione una sucursal', 'Dato no válido');
    if (!validCashierId) customNot('warning', 'Asigne una caja al usuario', 'Dato no válido');

    return (
      validId
      && validFullName
      && validUsername
      && validPassword
      && validPINCode
      && validRoleId
      && validLocationId
      && validCashierId
    );
  }

  function formAction() {
    if (validateData()) {
      if (!updateMode) {
        setFetching(true);
        usersService.add(formFullName, formUsername, formPassword, formPINCode, formRoleId, formLocationId, formCashierId, formIsAdmin, formCanCloseCashier)
        .then((response) => {
          customNot('success', 'Operación exitosa', 'Usuario añadido');
          setFetching(false);
          restoreState();
          onClose(true);
        })
        .catch((error) => {
          setFetching(false);
          customNot('error', 'Algo salió mal', 'Usuario no añadido');
        })
      } else {
        setFetching(true);
        usersService.update(formFullName, formUsername, formRoleId, formLocationId, formCashierId, formIsAdmin, formCanCloseCashier, formId)
        .then((response) => {
          customNot('success', 'Operación exitosa', 'Usuario actualizado');
          setFetching(false);
          restoreState();
          onClose(true);
        })
        .catch((error) => {
          setFetching(false);
          customNot('error', 'Algo salió mal', 'Usuario no actualizado');
        })
      }
    }
  }

  function deleteAction() {
    const { fullName } = dataToUpdate;
    Modal.confirm({
      title: '¿Desea eliminar este usuario?',
      centered: true,
      icon: <WarningOutlined />,
      content: `${fullName} será eliminado de la lista de usuarios`,
      okText: 'Confirmar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        setFetching(true);
        usersService.remove(formId)
        .then((response) => {
          setFetching(false);
          restoreState();
          onClose(true);
        })
        .catch((error) => {
          setFetching(false);
          customNot('info', 'Algo salió mal', 'El usuario no pudo ser eliminado')
        });
      },
      onCancel() {},
    });
  }

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={<UserOutlined/>}
          title={`${!updateMode ? 'Nuevo' : 'Actualizar'} usuario`}
          extra={!updateMode || (formId === getUserId()) ? [] : [
            <Button key="1" type="danger" size={'small'} icon={<DeleteOutlined />} onClick={(e) => deleteAction()}>
              Eliminar
            </Button>
          ]}
        />
      }
      centered
      width={600}
      closable={false}
      maskClosable={false}
      open={open}
      footer={null}
    >      
      <Row gutter={8}>
        <Col span={24}>
          <p style={{ margin: '0px 0px 0px 0px' }}>Nombre:</p>  
          <Input onChange={(e) => setFullName(e.target.value)} name={'formFullName'} value={formFullName} placeholder={'Juan'} />
        </Col>
        <Col span={24}>
          <p style={{ margin: '10px 0px 0px 0px' }}>Usuario:</p>  
          <Input onChange={(e) => setUsername(e.target.value)} name={'formUsername'} value={formUsername} placeholder={'juan01'} />
        </Col>
        {
          updateMode ? <></> : (
            <>
              <Col span={12}>
                <p style={{ margin: '10px 0px 0px 0px' }}>Contraseña:</p>
                <Input.Password onChange={(e) => setFormPassword(e.target.value)} name={'formPassword'} value={formPassword} size={'middle'}/>
              </Col>
              <Col span={12}>
                <p style={{ margin: '10px 0px 0px 0px' }}>Confirme contraseña:</p>
                <Input.Password onChange={(e) => setFormPasswordVal(e.target.value)} name={'formPasswordVal'} value={formPasswordVal} size={'middle'}/>
              </Col>
            </>
          )
        }
        {
          updateMode ? <></> : (
            <>
              <Col span={12}>
                <p style={{ margin: '10px 0px 0px 0px' }}>PIN:</p>
                <InputNumber
                  type='password'
                  onChange={(value) => {
                    setFormPINCode(value);
                  }}
                  name={'formPINCode'}
                  value={formPINCode}
                  size={'middle'}
                />
              </Col>
              <Col span={12}>
                <p style={{ margin: '10px 0px 0px 0px' }}>Confirme PIN:</p>
                <InputNumber
                  type='password'
                  onChange={(value) => {
                    setFormPINCodeVal(value);
                  }}
                  name={'formPINCodeVal'}
                  value={formPINCodeVal}
                  size={'middle'}
                />
              </Col>
            </>
          )
        }
        <Col span={12}>
          <p style={{ margin: '10px 0px 0px 0px' }}>Rol:</p>  
          <Select 
            dropdownStyle={{ width: '100%' }} 
            style={{ width: '100%' }} 
            value={formRoleId} 
            onChange={(value) => setFormRoleId(value)}
            optionFilterProp='children'
            showSearch
            filterOption={(input, option) =>
              (option.children).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option key={0} value={0} disabled>{'No seleccionado'}</Option>
            {
              (rolesData || []).map(
                (element) => <Option key={element.id} value={element.id}>{element.name}</Option>
              )
            }
          </Select>
        </Col>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Radio.Group
            onChange={(e) => {
              setFormIsAdmin(e.target.value);
            }}
            disabled={updateMode && !getUserIsAdmin()}
            value={formIsAdmin}
          >
            <Radio value={0}>Operativo</Radio>
            <Radio value={1}>Administrativo</Radio>
          </Radio.Group>
        </Col>
        <Col span={12}>
          <div style={{ height: 10 }} />
          <Checkbox
            checked={formCanCloseCashier}
            onChange={(e) => setFormCanCloseCashier(e.target.checked)}
            style={{ color: '#434343' }}
          >
            Puede cerrar cajas
          </Checkbox>
        </Col>
        <Divider />
        
        <Col span={24}>
          <p style={{ margin: '10px 0px 0px 0px' }}>Sucursal:</p>
          <Select 
            dropdownStyle={{ width: '100%' }} 
            style={{ width: '100%' }} 
            value={formLocationId} 
            onChange={(value) => setFormLocationId(value)}
            optionFilterProp='children'
            showSearch
            filterOption={(input, option) =>
              (option.children).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option key={0} value={0} disabled>{'No seleccionado'}</Option>
            {
              (locationsData || []).map(
                (element) => <Option key={element.id} value={element.id}>{element.name}</Option>
              )
            }
          </Select>
        </Col>
        <Col span={24}>
          <p style={{ margin: '10px 0px 0px 0px' }}>Caja:</p>
          <Select 
            dropdownStyle={{ width: '100%' }} 
            style={{ width: '100%' }} 
            value={formCashierId} 
            onChange={(value) => setFormCashierId(value)}
            optionFilterProp='children'
            showSearch
            filterOption={(input, option) =>
              (option.children).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option key={0} value={0} disabled>{'No seleccionado'}</Option>
            {
              (cashiersData.filter(x => x.locationId === formLocationId) || []).map(
                (element) => <Option key={element.id} value={element.id}>{element.name}</Option>
              )
            }
          </Select>
        </Col>
        <Col span={24}>
          <Button 
            type={'primary'} 
            icon={<SaveOutlined />} 
            onClick={(e) => formAction()} 
            style={{ width: '100%', marginTop: 20 }}
            loading={fetching}
            disabled={fetching}
          >
            Guardar
          </Button>
        </Col>
        <Col span={24}>
          <Button 
            type={'default'} 
            onClick={(e) => {
              if (!updateMode) restoreState();
              onClose(false)
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

export default UserForm;