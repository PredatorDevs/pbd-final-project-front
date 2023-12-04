import React, { useState, useEffect } from 'react';
import { Input, Col, Row, Divider, Button, PageHeader, Modal, Descriptions, Table, Space, Alert, InputNumber, Tag } from 'antd';
import { CheckOutlined, DeleteOutlined,  SaveOutlined, UndoOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';

import { customNot } from '../utils/Notifications.js';

import sellersServices from '../services/SellersServices.js';
import { TableContainer } from '../styled-components/TableContainer.js';
import { columnBoolean, columnDef, columnMoneyDef } from '../utils/ColumnsDefinitions.js';

function ConfirmMovementForm(props) {
  const [fetching, setFetching] = useState(false);

  const [formId, setId] = useState(0);
  const [formName, setFormName] = useState('');

  const { open, updateMode, dataToUpdate, onClose } = props;

  useEffect(() => {
    const { id, name } = dataToUpdate;
    setId(id || 0);
    setFormName(name || '');
  }, [ dataToUpdate ]);

  function restoreState() {
    setId(0);
    setFormName('');
  }

  function validateData() {
    const validId = updateMode ? formId !== 0 : true;
    const validFullName = !isEmpty(formName);
    if (!validFullName) customNot('warning', 'Verifique nombre', 'Dato no válido');
    return (
      validId && validFullName
    );
  }

  function formAction() {
    if (validateData()) {
      if (!updateMode) {
        setFetching(true);
        sellersServices.add(
          formName
        )
        .then((response) => {
          customNot('success', 'Operación exitosa', 'Vendedor añadido');
          restoreState();
          setFetching(false);
          onClose(true);
        })
        .catch((error) => {
          setFetching(false);
          customNot('error', 'Algo salió mal', 'Vendedor no añadido');
        })
      } else {
        setFetching(true);
        sellersServices.update(
          formName, formId
        )
        .then((response) => {
          customNot('success', 'Operación exitosa', 'Vendedor actualizado');
          restoreState();
          setFetching(false);
          onClose(true);
        })
        .catch((error) => {
          setFetching(false);
          customNot('error', 'Algo salió mal', 'Vendedor no actualizado');
        })
      }
    }
  }

  function deleteAction() {
    const { name } = dataToUpdate;
    Modal.confirm({
      title: '¿Desea eliminar este vendedor?',
      centered: true,
      icon: <WarningOutlined />,
      content: `${name || 'Not defined'} será eliminado de la lista de vendedores`,
      okText: 'Confirmar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        setFetching(true);
        sellersServices.remove(formId)
        .then((response) => {
          restoreState();
          setFetching(false);
          onClose(true);
        })
        .catch((error) => {
          setFetching(false);
          customNot('info', 'Algo salió mal', 'El vendedor no pudo ser eliminado');
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
          backIcon={null}
          title={`Confirmar traslado #${123}`}
          subTitle={``}
          extra={!updateMode ? [] : [
            <Button key="1" type="danger" size={'small'} icon={<DeleteOutlined />} onClick={(e) => deleteAction()}>
              Eliminar
            </Button>
          ]}
        />
      }
      centered
      width={650}
      closable={false}
      maskClosable={false}
      visible={open}
      footer={null}
    >
      <Descriptions bordered style={{ width: '100%' }} size={'small'}>
        <Descriptions.Item label="Fecha" span={3}>{'Jueves 20 de noviembre 2022'}</Descriptions.Item>
        <Descriptions.Item label="Enviado desde" span={3}>{'Planta Procesadora'}</Descriptions.Item>
        {/* <Descriptions.Item label="Tipo" span={3}>{'Hello'}</Descriptions.Item> */}
      </Descriptions>
      <div style={{ height: 15 }}/>
        <Alert message="Sí no ha recibido todo lo detallado puede indicar la cantidad realmente recibida" banner type="info" showIcon />
      <div style={{ height: 15 }}/>
      <TableContainer>
        <Table 
          size='small'
          columns={[
            columnDef({ title: 'Cantidad', dataKey: 'quantity' }),
            columnDef({ title: 'Producto', dataKey: 'productName' }),
            {
              title: <p style={{ margin: '0px', fontSize: 12, fontWeight: 600 }}>{'Acciones'}</p>,
              dataIndex: 'id',
              key: 'id',
              align: 'left',
              render: (text, record, index) => {
                return (
                  <Space wrap >
                    {record.status ? <></> : <Button size={'small'} type="primary">Confirmar</Button>}
                    <p style={{ margin: 0 }}>Recibido:</p>
                    <InputNumber value={record.quantity} disabled={record.status} />
                    {record.status ? <Button icon={<UndoOutlined/>} size={'small'} type="default" /> : <Button icon={<CheckOutlined/>} size={'small'} type="primary" />}
                    {/* {record.status ? <Tag color="green">Confirmado</Tag> : <Tag color="yellow">Pendiente</Tag>} */}
                  </Space>
                )
              }
            },
            columnBoolean({ title: 'Estado', dataKey: 'status', trueText: 'Confirmado', trueColor: 'green', falseText: 'Pendiente', falseColor: 'yellow' })
          ]}
          dataSource={[{ id: 1, quantity: 10, productName: 'Garrafon', status: 1 }, { id: 2, quantity: 29, productName: 'Litro'}, { id: 3, quantity: 45, productName: 'Galón'}] || []}
          pagination={false}
          loading={fetching}
        />
      </TableContainer>
      <Row gutter={8}>
        <Col span={24}>
          <Button 
            type={'primary'} 
            icon={<CheckOutlined />} 
            onClick={(e) => formAction()} 
            style={{ width: '100%', marginTop: 20 }} 
            loading={fetching}
            disabled={fetching}
          >
            Confirmar
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

export default ConfirmMovementForm;
