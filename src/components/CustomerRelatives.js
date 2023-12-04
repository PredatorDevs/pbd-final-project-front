import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Modal, Space, Tag, Row, Col } from 'antd';
import { BuildOutlined, DeleteFilled, DeleteOutlined,  EnvironmentOutlined,  HomeOutlined,  InboxOutlined,  PhoneOutlined,  PlusOutlined,  SaveOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons';
import { isEmpty, toUpper } from 'lodash';

import { customNot } from '../utils/Notifications';
import { onKeyDownFocusTo } from '../utils/OnEvents';

const { Option } = Select;

function CustomerRelatives(props) {
  // const [fetching, setFetching] = useState(false);

  const [formCustomerRelatives, setFormCustomerRelatives] = useState([]);

  const [formRelativeFullname, setFormRelativeFullname] = useState('');
  const [formRelativeTypeSelected, setFormRelativeTypeSelected] = useState(0);
  const [formRelativeAddress, setFormRelativeAddress] = useState('');

  const {
    updateMode,
    setResetState,
    dataToUpdate,
    onDataChange,
    elementSizes,
    focusToId
  } = props;

  useEffect(() => {
    restoreState();
  }, [ setResetState ]);

  useEffect(() => {
    onDataChange(formCustomerRelatives);
  }, [ formCustomerRelatives ]);

  function restoreState() {
    // setFetching(false);
    setFormCustomerRelatives([]);
    setFormRelativeFullname('');
    setFormRelativeTypeSelected(0);
    setFormRelativeAddress('');
  }

  function deleteDataElement(index) {
    Modal.confirm({
      title: '¿Desea eliminar este pariente?',
      centered: true,
      icon: <WarningOutlined />,
      content: `Será eliminado de la lista de parientes`,
      okText: 'Confirmar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() { setFormCustomerRelatives((prev) => prev.filter((element, prevIndex) => (prevIndex !== index))); },
      onCancel() {},
    });
  }

  function relativeTypeName(type) {
    switch(type) {
      case 1: return "Padre";
      case 2: return "Madre";
      case 3: return "Cónyuge";
      case 4: return "Hijo/a";
      case 5: return "Hermano/a";
      case 6: return "Tio/a";
      case 7: return "Primo/a";
      case 8: return "Abuelo/a";
      case 9: return "Sobrino/a";
      case 10: return "Cuñado/a";
      case 99: return "Otro/a";
      default: return "Otro";
    }
  }

  return (
    <Row gutter={8}>
      <Col span={18}>
        <p style={{ margin: '0px' }}>Nombre completo:</p>
        <Input 
          id={'g-customer-relative-fullname-input'}
          onFocus={() => document.getElementById('g-customer-relative-fullname-input').select()}
          onChange={(e) => setFormRelativeFullname(toUpper(e.target.value))} 
          name={'formRelativeFullname'} 
          value={formRelativeFullname} 
          size={elementSizes || 'middle'}
          placeholder={'Ray Carter'}
          // width={450}
          onKeyDown={(e) => onKeyDownFocusTo(e, 'g-customer-relative-type-selector')}
          style={{ width: '100%' }}
        />
      </Col>
      
      <Col span={6}>
        <p style={{ margin: '0px' }}>Parentesco:</p>
        <Select
          id={'g-customer-relative-type-selector'}
          showAction={'focus'}
          dropdownStyle={{ width: '100%' }} 
          style={{ width: '100%' }}
          value={formRelativeTypeSelected}
          size={elementSizes || 'middle'}
          onChange={(value) => {
            setFormRelativeTypeSelected(value);
            document.getElementById('g-customer-relative-address-input').focus();
          }}
        >
          <Option value={0} disabled>Seleccione</Option>
          <Option value={1}>Padre</Option>
          <Option value={2}>Madre</Option>
          <Option value={3}>Cónyuge</Option>
          <Option value={4}>Hijo/a</Option>
          <Option value={5}>Hermano/a</Option>
          <Option value={6}>Tio/a</Option>
          <Option value={7}>Primo/a</Option>
          <Option value={8}>Abuelo/a</Option>
          <Option value={9}>Sobrino/a</Option>
          <Option value={10}>Cuñado/a</Option>
          <Option value={99}>Otro/a</Option>
        </Select>
        
      </Col>
      <Col span={18}>
        <p style={{ margin: '0px' }}>Dirección:</p>
        <Input
          id={'g-customer-relative-address-input'}
          onFocus={() => document.getElementById('g-customer-relative-address-input').select()}
          onChange={(e) => setFormRelativeAddress(toUpper(e.target.value))}
          name={'formRelativeAddress'}
          value={formRelativeAddress}
          placeholder={'Av. Testa Ca. Edison 101'}
          style={{ width: '100%' }}
          size={elementSizes || 'middle'}
          onKeyDown={(e) => onKeyDownFocusTo(e, 'g-customer-relative-add-button')}
        />
      </Col>
      <Col span={6} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
        <Button 
          id={'g-customer-relative-add-button'}
          icon={<SaveOutlined />}
          size={elementSizes || 'middle'}
          type='primary'
          onClick={() => {
            if (formRelativeFullname !== '' && formRelativeAddress !== '') {
              setFormCustomerRelatives([...formCustomerRelatives, { relativeFullname: formRelativeFullname, relativeType: formRelativeTypeSelected, relativeAddress: formRelativeAddress }]);
              setFormRelativeFullname('');
              setFormRelativeTypeSelected(0);
              setFormRelativeAddress('');
              let focusTo = document.getElementById(focusToId);
              if (focusTo) focusTo.focus();
            }
            else
              customNot('warning', 'Especifique el nombre y dirección del familiar', 'Para añadir debe especificar un valor');
          }}
          style={{ width: '100%' }}
        >
          Agregar
        </Button>
      </Col>
      <Col span={24}>
        <Space direction='vertical' style={{ marginTop: 10, width: '100%' }}>
        {
          formCustomerRelatives.map((element, index) => (
            <div key={index} style={{ backgroundColor: '#f0f0f0', borderRadius: 5, padding: '5px 10px', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <Space direction='vertical'>
                <p style={{ margin: 0 }}>
                  {element.relativeFullname}
                </p>
                <p style={{ margin: 0, fontSize: 11 }}>
                  <EnvironmentOutlined /> {`${element.relativeAddress}`}
                </p>
              </Space>
              <Space>
                <Tag icon={<UserOutlined />} color="blue">{relativeTypeName(element.relativeType)}</Tag>    
                <Button 
                  // type={'primary'}
                  size={elementSizes || 'middle'}
                  danger
                  icon={<DeleteFilled />} 
                  onClick={(e) => deleteDataElement(index)}
                />
              </Space>
            </div>
          ))
        }
        </Space>
      </Col>
    </Row>
  )
}

export default CustomerRelatives;
