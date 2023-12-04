import React, { useState, useEffect, useRef } from 'react';
import { Button, PageHeader, Modal, Spin, Table } from 'antd';
import { CloseOutlined, PrinterOutlined, SyncOutlined, TagsOutlined } from '@ant-design/icons';
import 'moment/locale/es-mx';
import ReactToPrint from 'react-to-print';

import { customNot } from '../../utils/Notifications.js';
import shiftcutsService from '../../services/ShiftcutsServices.js';
import { TableContainer } from '../../styled-components/TableContainer.js';
import { columnDef, columnMoneyDef } from '../../utils/ColumnsDefinitions.js';

function SettlementPreview(props) {
  const [fetching, setFetching] = useState(false);
  const [entityData, setEntityData] = useState([]);

  const { open, shiftcutId, onClose } = props;

  const componentRef = useRef();

  function loadData() {
    if (shiftcutId !== null) {
      shiftcutsService.settlementsById(shiftcutId)
      .then((response) => {
        setEntityData(response.data);
      }).catch((error) => {
        customNot('error', 'Información de liquidación no encontrada', 'Revise conexión')
        setFetching(false);
      });
    }
  }

  useEffect(() => {
    loadData();
  }, [ shiftcutId ]);

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={<TagsOutlined />}
          title={`Liquidación Turno #${shiftcutId}`}
          extra={[
            <ReactToPrint
              trigger={() => <Button key="1" size={'small'} type={'primary'} icon={<PrinterOutlined />}>Imprimir</Button>}
              content={() => componentRef.current}
            />,
            <Button key="3" size={'small'} icon={<SyncOutlined />} onClick={() => loadData()} />,
            fetching ? <Spin /> : <></>
          ]}
        />
      }
      centered
      width={750}
      closeIcon={<CloseOutlined style={{ padding: 5, backgroundColor: '#f0f0f0', borderRadius: 5, color: '#f5222d' }} />}
      onCancel={() => onClose()}
      maskClosable={false}
      visible={open}
      footer={null}
    >
      <TableContainer>
        <Table
          columns={[
            columnDef({ title: 'Producto', dataKey: 'name', fSize: 11 }),
            columnDef({ title: 'Saldo Anterior', dataKey: 'lastBalance', fSize: 11 }),
            columnDef({ title: 'Producido', dataKey: 'produced', fSize: 11 }),
            columnDef({ title: 'Vendido', dataKey: 'selled', fSize: 11 }),
            columnDef({ title: 'Saldo Final', dataKey: 'finalBalance', fSize: 11 }),
          ]}
          dataSource={entityData[0] || []}
          size={'small'}
          pagination={false}
        />
      </TableContainer>
      <TableContainer>
        <Table 
          columns={[
            columnDef({title: '# Despacho', dataKey: 'saleId'}),
            columnDef({title: 'Cliente', dataKey: 'customerFullname'}),
            columnDef({title: 'Producto', dataKey: 'productName'}),
            // columnDef({title: 'Anulada', dataKey: 'isVoided'}),
            columnMoneyDef({title: 'Contado', dataKey: 'cashSale'}),
            columnMoneyDef({title: 'Crédito', dataKey: 'creditSale'}),
          ]}
          scroll={{ y: 300 }}
          rowKey={'id'}
          size={'small'}
          dataSource={entityData[1] || []}
          pagination={false}
          loading={fetching}
        />
      </TableContainer>
    </Modal>
  )
}

export default SettlementPreview;
