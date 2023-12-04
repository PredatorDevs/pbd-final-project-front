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
import rawMaterialPurchasesServices from '../../services/RawMaterialPurchasesServices.js';

function RawMaterialPurchasePreview(props) {
  const [fetching, setFetching] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [entityDetailData, setEntityDetailData] = useState([]);
  const [wasVoided, setWasVoided] = useState(false);
  const [openVoidConfirmation, setOpenVoidConfirmation] = useState(false);

  const { open, rawMaterialPurchaseId, onClose } = props;

  const componentRef = useRef();

  function loadData() {
    rawMaterialPurchasesServices.findById(rawMaterialPurchaseId)
    .then((response) => {
      setEntityData(response.data);
      rawMaterialPurchasesServices.details.findByRawMaterialPurchaseId(rawMaterialPurchaseId)
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
  }, [ rawMaterialPurchaseId ]);

  function voidSale(userId) {
    setFetching(true);
    salesServices.voidSale(userId, rawMaterialPurchaseId)
    .then((response) => {
      customNot('info', 'Despacho anulado', 'Acción exitosa');
      setWasVoided(true);
      loadData();
    })
    .catch((error) => {
      setFetching(false);
      customNot('error', 'Algo salió mal', 'El despacho no fue anulado');
    })
  }

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={<TagsOutlined />}
          title={`Compra ${isEmpty(entityData) ? '' : `#${entityData[0].docNumber}` || ''}`}
          subTitle={`${isEmpty(entityData) ? '' : entityData[0].isVoided ? 'Anulada' : ''}`}
          // extra={[
          //   <ReactToPrint
          //     trigger={() => <Button key="1" size={'small'} type={'primary'} icon={<PrinterOutlined />}>Imprimir</Button>}
          //     content={() => componentRef.current}
          //   />,
          //   isEmpty(entityData) ? 
          //     <></> : 
          //     entityData[0].isVoided ? 
          //       <></> : 
          //       <Button key="2" size={'small'} type={'primary'} danger icon={<DeleteOutlined />} onClick={() => setOpenVoidConfirmation(true)}>Anular</Button>,
          //   fetching ? <Spin /> : <></>
          // ]}
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
        <Descriptions.Item label="Fecha" span={3}>{moment(isEmpty(entityData) ? '1999-01-01 00:00:00' :entityData[0].docDatetime).format('LL') || ''}</Descriptions.Item>
        <Descriptions.Item label="Proveedor" span={3}>{isEmpty(entityData) ? '' : entityData[0].supplierName || ''}</Descriptions.Item>
        {/* <Descriptions.Item label="Fecha">{moment(isEmpty(entityData) ? '' :entityData[0].docDatetime).format('LL') || ''}</Descriptions.Item> */}
        {/* <Descriptions.Item label="Tipo">{isEmpty(entityData) ? '' : entityData[0].docTypeName || ''}</Descriptions.Item> */}
        <Descriptions.Item label="">{''}</Descriptions.Item>
        <Descriptions.Item label="">{''}</Descriptions.Item>
      </Descriptions>
      <div style={{ height: '20px' }} />
      <TableContainer>
        <Table 
          size='small'
          columns={[
            columnDef({ title: 'Cantidad', dataKey: 'quantity' }),
            columnDef({ title: 'Descripción', dataKey: 'rawMaterialName' }),
            columnMoneyDef({ title: 'Costo Unitario', dataKey: 'unitCost' }),
            columnMoneyDef({ title: 'Subtotal', dataKey: 'subTotal' })
          ]}
          dataSource={[ ...entityDetailData, { quantity: '', rawMaterialName: 'Total', unitCost: '', subTotal: isEmpty(entityData) ? '' : entityData[0].total || '' } ] || []}
          pagination={false}
        />
      </TableContainer>
      <div style={{ height: '20px' }} />
      <Descriptions bordered style={{ width: '100%' }} size={'small'}>
        <Descriptions.Item label="Registrada por" span={3}>{isEmpty(entityData) ? '' : entityData[0].registeredByFullname || ''}</Descriptions.Item>
      </Descriptions>
      {/* <div style={{ display: 'none' }}>
        <SaleTicket ref={componentRef} ticketData={entityData[0] || {}} ticketDetail={entityDetailData || []} />
      </div> */}
      {/* <AuthorizeAction
        open={openVoidConfirmation}
        allowedRoles={[1]}
        title={`Anular despacho #${rawMaterialPurchaseId}`}
        confirmButtonText={'Confirmar anulación'}
        onClose={(authorized, userAuthorizer) => {
          const { successAuth } = userAuthorizer;
          if (authorized, successAuth) {
            const { userId } = userAuthorizer;
            voidSale(userId);
          }
          setOpenVoidConfirmation(false);
        }}
      /> */}
    </Modal>
  )
}

export default RawMaterialPurchasePreview;
