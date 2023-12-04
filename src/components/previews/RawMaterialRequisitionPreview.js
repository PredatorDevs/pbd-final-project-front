import React, { useState, useEffect, useRef } from 'react';
import { Input, Col, Row, Divider, Button, PageHeader, Modal, Descriptions, Badge, Spin, Table } from 'antd';
import { CloseOutlined, DeleteOutlined,  PrinterOutlined,  SaveOutlined, SyncOutlined, TagsOutlined, WarningOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import moment from 'moment';
import 'moment/locale/es-mx';
import ReactToPrint from 'react-to-print';

import salesServices from '../../services/SalesServices.js';
import { customNot } from '../../utils/Notifications.js';
import { TableContainer } from '../../styled-components/TableContainer.js';
import { columnDef, columnMoneyDef } from '../../utils/ColumnsDefinitions.js';
import ComponentToPrint from '../tickets/ComponentToPrint.js';
import OrderSaleTicket from '../tickets/OrderSaleTicket.js';
import SaleTicket from '../tickets/SaleTicket.js';
import AuthSaleVoid from '../confirmations/AuthSaleVoid.js';
import AuthorizeAction from '../confirmations/AuthorizeAction.js';
import rawMaterialRequisitionsServices from '../../services/RawMaterialRequisitions.js';
import RawMaterialRequisitionTicket from '../tickets/RawMaterialRequisitionTicket.js';

function RawMaterialRequisitionPreview(props) {
  const [fetching, setFetching] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [entityDetailData, setEntityDetailData] = useState([]);
  const [wasVoided, setWasVoided] = useState(false);
  const [openVoidConfirmation, setOpenVoidConfirmation] = useState(false);

  const { open, rawMaterialRequisitionId, onClose } = props;

  const componentRef = useRef();

  function loadData() {
    rawMaterialRequisitionsServices.findById(rawMaterialRequisitionId)
    .then((response) => {
      setEntityData(response.data);
      rawMaterialRequisitionsServices.details.findByRawMaterialRequisitionId(rawMaterialRequisitionId)
      .then((response) => {
        setEntityDetailData(response.data);
        setFetching(false);
      }).catch((error) => {
        customNot('error', 'Información de despacho no encontrada', 'Revise conexión')
        setFetching(false);
      });
    }).catch((error) => {
      customNot('error', 'Información de venta no encontrada', 'Revise conexión')
      setFetching(false);
    });
  }

  useEffect(() => {
    loadData();
  }, [ rawMaterialRequisitionId ]);

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={<TagsOutlined />}
          title={`Requisición ${isEmpty(entityData) ? '' : `#${entityData[0].rawMaterialRequisitionId}` || ''}`}
          extra={[
            <ReactToPrint
              trigger={() => <Button key="1" size={'small'} type={'primary'} icon={<PrinterOutlined />}>Imprimir</Button>}
              content={() => componentRef.current}
            />,
            fetching ? <Spin /> : <></>
          ]}
        />
      }
      centered
      width={650}
      closeIcon={<CloseOutlined style={{ padding: 5, backgroundColor: '#f0f0f0', borderRadius: 5, color: '#f5222d' }} />}
      onCancel={() => onClose(wasVoided)}
      maskClosable={false}
      visible={open}
      footer={null}
    >
      <Descriptions bordered style={{ width: '100%' }} size={'small'}>
        <Descriptions.Item label="Fecha" span={3}>{moment(isEmpty(entityData) ? '1999-01-01 00:00:00' :entityData[0].docDatetime).format('LLL') || ''}</Descriptions.Item>
        <Descriptions.Item label="Entregada por"  span={3}>{isEmpty(entityData) ? '' : entityData[0].givenByFullname || ''}</Descriptions.Item>
        <Descriptions.Item label="Recibida por"  span={3}>{isEmpty(entityData) ? '' : entityData[0].receivedByFullname || ''}</Descriptions.Item>
      </Descriptions>
      <div style={{ height: '20px' }} />
      <TableContainer>
        <Table 
          size='small'
          rowKey={'id'}
          columns={[
            columnDef({ title: 'Cantidad', dataKey: 'quantity' }),
            columnDef({ title: 'Producto', dataKey: 'rawMaterialName' }),
          ]}
          dataSource={entityDetailData || []}
          pagination={false}
        />
      </TableContainer>
      <div style={{ height: '20px' }} />
      <Descriptions bordered style={{ width: '100%' }} size={'small'}>
        <Descriptions.Item label="Registrada por" span={3}>{isEmpty(entityData) ? '' : entityData[0].registeredByFullname || ''}</Descriptions.Item>
      </Descriptions>
      <div style={{ display: 'none' }}>
        <RawMaterialRequisitionTicket ref={componentRef} ticketData={entityData[0] || {}} ticketDetail={entityDetailData || []} />
      </div>
    </Modal>
  )
}

export default RawMaterialRequisitionPreview;
