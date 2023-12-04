import React, { useState, useEffect, useRef } from 'react';
import { Input, Col, Row, Divider, Button, PageHeader, Modal, Descriptions, Badge, Table, Tag } from 'antd';
import { CloseOutlined, EditTwoTone} from '@ant-design/icons';
import { isEmpty } from 'lodash';
import moment from 'moment';
import 'moment/locale/es-mx';

function CashierInformationPreview(props) {
  const { open, cashierData, onClose } = props;

  return (
    <Modal
      centered
      width={650}
      closeIcon={<CloseOutlined style={{ padding: 5, backgroundColor: '#f0f0f0', borderRadius: 5, color: '#f5222d' }} />}
      onCancel={() => onClose()}
      maskClosable={false}
      open={open}
      footer={null}
    >
      {
        isEmpty(cashierData) ? <>
        </> : <>
          <p style={{ fontSize: 14, margin: 0, fontWeight: 600 }}>{cashierData.name}</p>
          <p style={{ fontSize: 11 }}>{`Codigo Interno: ${cashierData.id}`}</p>
          <Descriptions bordered style={{ width: '100%' }} size={'small'}>
            <Descriptions.Item label="Correlativo Ticket" span={1}>{cashierData.ticketCorrelative}</Descriptions.Item>
            <Descriptions.Item label="Serie Ticket" span={2}>{cashierData.ticketSerie}</Descriptions.Item>
            <Descriptions.Item label="Correlativo Factura" span={1}>{cashierData.cfCorrelative}</Descriptions.Item>
            <Descriptions.Item label="Serie Factura" span={2}>{cashierData.cfSerie}</Descriptions.Item>
            <Descriptions.Item label="Correlativo CCF" span={1}>{cashierData.ccfCorrelative}</Descriptions.Item>
            <Descriptions.Item label="Serie CCF" span={2}>{cashierData.ccfSerie}</Descriptions.Item>
            <Descriptions.Item label="Correlativo Nota Crédito" span={1}>{cashierData.creditNoteCorrelative}</Descriptions.Item>
            <Descriptions.Item label="Serie Nota Crédito" span={2}>{cashierData.creditNoteSerie}</Descriptions.Item>
            <Descriptions.Item label="Correlativo Nota Débito" span={1}>{cashierData.debitNoteCorrelative}</Descriptions.Item>
            <Descriptions.Item label="Serie Nota Débito" span={2}>{cashierData.debitNoteSerie}</Descriptions.Item>
            <Descriptions.Item label="Correlativo Recibo" span={1}>{cashierData.receiptCorrelative}</Descriptions.Item>
            <Descriptions.Item label="Serie Recibo" span={2}>{cashierData.receiptSerie}</Descriptions.Item>
            <Descriptions.Item label="Turno actual" span={1}>{cashierData.currentShiftcutNumber || 'Cerrado'}</Descriptions.Item>
            <Descriptions.Item label="Próximo turno" span={1}>{cashierData.nextShiftcutNumber}</Descriptions.Item>
            <Descriptions.Item label="" span={1}></Descriptions.Item>
            <Descriptions.Item label="Efectivo Inicial" span={3}>{`$${cashierData.defaultInitialCash}`}</Descriptions.Item>
            <Descriptions.Item label="Fondo Caja Chica" span={3}>{`$${cashierData.cashFunds}`}</Descriptions.Item>
            <Descriptions.Item label="Habilitado Mov. Caja Chica" span={3}>
              {
                !!cashierData.enableReportCashFundMovements ? <Tag color={'green'}>Si</Tag> : <Tag color={'red'}>No</Tag>
              }
            </Descriptions.Item>
          </Descriptions>
        </>
      }
    </Modal>
  )
}

export default CashierInformationPreview;
