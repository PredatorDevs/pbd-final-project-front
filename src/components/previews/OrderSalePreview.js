import React, { useState, useEffect, useRef } from 'react';
import { Input, Col, Row, Divider, Button, PageHeader, Modal, Descriptions, Badge, Table } from 'antd';
import { CloseOutlined, DeleteOutlined,  PrinterOutlined,  SaveOutlined, TagsOutlined, WarningOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import moment from 'moment';
import 'moment/locale/es-mx';
import ReactToPrint from 'react-to-print';

import { customNot } from '../../utils/Notifications.js';
import { TableContainer } from '../../styled-components/TableContainer.js';
import { columnDef, columnMoneyDef } from '../../utils/ColumnsDefinitions.js';
import OrderSaleTicket from '../tickets/OrderSaleTicket.js';
import orderSalesServices from '../../services/OrderSalesServices.js';

function OrderSalePreview(props) {
  const [fetching, setFetching] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [entityDetailData, setEntityDetailData] = useState([]);

  const { open, orderSaleId, onClose } = props;

  const componentRef = useRef();

  useEffect(() => {
    orderSalesServices.findById(orderSaleId)
    .then((response) => {
      setEntityData(response.data);
    }).catch((error) => {
      customNot('error', 'Información de pedido no encontrada', 'Revise conexión')
    });
    orderSalesServices.details.findByOrderSaleId(orderSaleId)
    .then((response) => {
      setEntityDetailData(response.data);
    }).catch((error) => {
      customNot('error', 'Información de venta no encontrada', 'Revise conexión')
    });
  }, [ orderSaleId ]);

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={<TagsOutlined />}
          title={`Pedido ${isEmpty(entityData) ? '' : entityData[0].id || ''}`}
          extra={[
            <ReactToPrint
              trigger={() => <Button key="1" size={'small'} type={'primary'} icon={<PrinterOutlined />}>Imprimir</Button>}
              content={() => componentRef.current}
            />
          ]}
        />
      }
      centered
      width={650}
      closeIcon={<CloseOutlined style={{ padding: 5, backgroundColor: '#f0f0f0', borderRadius: 5, color: '#f5222d' }} />}
      onCancel={() => onClose()}
      maskClosable={false}
      visible={open}
      footer={null}
    >      
      <Descriptions bordered style={{ width: '100%' }} size={'small'}>
        <Descriptions.Item label="Fecha" span={3}>{moment(isEmpty(entityData) ? '1999-01-01 00:00:00' : entityData[0].docDatetime).format('LL') || ''}</Descriptions.Item>
        <Descriptions.Item label="Cliente" span={3}>{isEmpty(entityData) ? '' : entityData[0].customerFullname || ''}</Descriptions.Item>
        {/* <Descriptions.Item label="Fecha">{moment(isEmpty(entityData) ? '' :entityData[0].docDatetime).format('LL') || ''}</Descriptions.Item> */}
        <Descriptions.Item label="Tipo">{isEmpty(entityData) ? '' :entityData[0].docTypeName || ''}</Descriptions.Item>
        <Descriptions.Item label="">{''}</Descriptions.Item>
        <Descriptions.Item label="">{''}</Descriptions.Item>
      </Descriptions>
      <div style={{ height: '20px' }} />
      <TableContainer>
        <Table 
          size='small'
          columns={[
            columnDef({ title: 'Cantidad', dataKey: 'quantity' }),
            columnDef({ title: 'Producto', dataKey: 'productName' }),
            columnMoneyDef({ title: 'Precio Unitario', dataKey: 'unitPrice', showDefaultString: true }),
            columnMoneyDef({ title: 'Subtotal', dataKey: 'subTotal', showDefaultString: true })
          ]}
          dataSource={[ ...entityDetailData, { quantity: '', productName: 'Total', unitCost: '', subTotal: isEmpty(entityData) ? '' : entityData[0].total || '' } ] || []}
          pagination={false}
        />
      </TableContainer>
      <div style={{ height: '20px' }} />
      <Descriptions bordered style={{ width: '100%' }} size={'small'}>
        <Descriptions.Item label="Registrada por" span={3}>{isEmpty(entityData) ? '' : entityData[0].createdByFullname || ''}</Descriptions.Item>
      </Descriptions>
      <div style={{ display: 'none' }}>
        <OrderSaleTicket ref={componentRef} ticketData={entityData[0] || {}} ticketDetail={entityDetailData || []} />
      </div>
    </Modal>
  )
}

export default OrderSalePreview;
