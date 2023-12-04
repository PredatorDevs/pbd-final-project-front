import React, { useState, useEffect } from 'react';
import { Input, Col, Row, Divider, Button, PageHeader, Modal, Select, Tag } from 'antd';
import { DeleteOutlined,  SaveOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import { GithubPicker } from 'react-color';

import { customNot } from '../../utils/Notifications';

import parkingCheckoutsServices from '../../services/ParkingCheckoutsServices';

const { Option } = Select;

function ParkingGuardForm(props) {
  const [fetching, setFetching] = useState(false);

  const [formId, setId] = useState(0);
  const [formFullName, setFullName] = useState('');
  const [formSchedule, setFormSchedule] = useState('');
  const [formChartColor, setFormChartColor] = useState('#FFFFFF');

  const { open, updateMode, dataToUpdate, onClose } = props;

  useEffect(() => {
    const { id, fullname, schedule, chartColor } = dataToUpdate;
    setId(id || 0);
    setFullName(fullname || '');
    setFormSchedule(schedule || '');
    setFormChartColor(chartColor || '#FFFFFF');
  }, [ dataToUpdate ]);

  function restoreState() {
    setId(0);
    setFullName('');
    setFormSchedule('');
    setFormChartColor('#FFFFFF');
  }

  function validateData() {
    const validId = updateMode ? formId !== 0 : true;
    const validFullName = !isEmpty(formFullName);
    const validSchedule = !isEmpty(formSchedule);
    if (!validFullName) customNot('warning', 'Verifique nombre completo', 'Dato no válido');
    if (!validSchedule) customNot('warning', 'Seleccione un turno', 'Dato no válido');
    return (
      validId && validFullName && validSchedule
    );
  }

  async function formAction() {
    if (validateData()) {
      if (!updateMode) {
        try {
          setFetching(true);
          const response = await parkingCheckoutsServices.parkingGuards.add(formFullName, formSchedule, formChartColor);

          setFetching(false);
          restoreState();
          onClose(true);
        } catch (error) {
          setFetching(false);
        }
      } else {
        try {
          setFetching(true);
          const response = await parkingCheckoutsServices.parkingGuards.update(formFullName, formSchedule, formChartColor, formId);

          setFetching(false);
          restoreState();
          onClose(true);
        } catch (error) {
          setFetching(false);
        }
      }
    }
  }

  function deleteAction() {
    const { fullname } = dataToUpdate;
    Modal.confirm({
      title: '¿Desea eliminar este proveedor?',
      centered: true,
      icon: <WarningOutlined />,
      content: `${fullname || 'Not defined'} será desactivado`,
      okText: 'Confirmar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        setFetching(true);
        parkingCheckoutsServices.parkingGuards.delete(formId)
        .then((response) => {
          restoreState();
          setFetching(false);
          onClose(true);
        })
        .catch((error) => {
          setFetching(false);
          customNot('warning', 'Algo salió mal', 'El vigilante no pudo ser desactivado');
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
          backIcon={<UserOutlined />}
          title={`${!updateMode ? 'Nuevo' : 'Actualizar'} vigilante`}
          extra={!updateMode ? [] : [
            <Button key="1" type="danger" size={'small'} icon={<DeleteOutlined />} onClick={(e) => deleteAction()}>
              Desactivar
            </Button>
          ]}
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
          <p style={{ margin: '0px 0px 0px 0px' }}>Nombre completo:</p>  
          <Input onChange={(e) => setFullName(e.target.value)} name={'formFullName'} value={formFullName} placeholder={'Distribuidora S.A. de C.V.'} />
        </Col>
        <Col span={24}>
          <p style={{ margin: '10px 0px 0px 0px' }}>Turno:</p>  
          <Select
            dropdownStyle={{ width: '100%' }} 
            style={{ width: '100%' }} 
            value={formSchedule} 
            onChange={(value) => setFormSchedule(value)}
            optionFilterProp='children'
            showSearch
            filterOption={(input, option) =>
              (option.children).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option key={0} value={''} disabled>{'No seleccionado'}</Option>
            <Option key={0} value={'M'}>{'Mañana'}</Option>
            <Option key={0} value={'V'}>{'Tarde'}</Option>
          </Select>
        </Col>
        <Col span={24}>
          <p style={{ margin: '10px 0px 0px 0px' }}>Color:</p>
          <GithubPicker
            colors={['#f5222d', '#fa541c', '#fa8c16', '#faad14', '#fadb14', '#a0d911', '#52c41a', '#13c2c2', '#1677ff', '#2f54eb', '#722ed1', '#eb2f96']}
            width='170px'
            triangle='hide'
            color={formChartColor}
            onChangeComplete={(color) => {
              setFormChartColor(color.hex);
            }}
          />
          <div style={{ height: 10 }}/>
          <Tag color={formChartColor}>Color Seleccionado</Tag>
        </Col>
        <Divider />
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

export default ParkingGuardForm;
