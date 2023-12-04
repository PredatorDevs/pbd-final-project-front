import React, { useState, useEffect } from 'react';
import { Input, Col, Row, Divider, Button, PageHeader, Modal, InputNumber, Space, Table } from 'antd';
import { DeleteOutlined,  SaveOutlined, SyncOutlined, TagsOutlined, WarningOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';

import { customNot } from '../utils/Notifications.js';

import brandsServices from '../services/BrandsServices.js';
import { getUserId, getUserName } from '../utils/LocalData.js';
import cashiersServices from '../services/CashiersServices.js';
import moment from 'moment';
import { TableContainer } from '../styled-components/TableContainer.js';
import rawMaterialsServices from '../services/RawMaterialsServices.js';
import { columnDef, columnMoneyDef } from '../utils/ColumnsDefinitions.js';

function CurrentStocks(props) {
  const [fetching, setFetching] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [entityData, setEntityData] = useState(false);

  const { open, onClose } = props;

  function loadData() {
    setFetching(true);
    rawMaterialsServices.findCurrentStock()
    .then((response) => {
      setEntityData(response.data);
      setFetching(false);
    }).catch((error) => {
      customNot('error', 'Error de conexión', 'No se pudo obtener información de las existencias')
      setFetching(false);
    });
  }

  useEffect(() => {
    loadData();
  }, [ refresh ]);

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={<TagsOutlined />}
          title={`Existencias`}
          subTitle={`Materia prima`}
          extra={[
            <Button icon={<SyncOutlined />} onClick={() => { loadData(); }}/>,
            <Button danger onClick={() => onClose()}>Salir</Button>
          ]}
        />
      }
      centered
      width={550}
      closable={false}
      maskClosable={false}
      visible={open}
      footer={null}
    >      
      <TableContainer height={'300px'}>
        <Table 
          size='small'
          columns={[
            columnDef({ title: 'Descripción', dataKey: 'rawMaterialName' }),
            columnDef({ title: 'Existencia actual', dataKey: 'rawMaterialStock' }),
            columnMoneyDef({ title: 'Costo', dataKey: 'rawMaterialCost' })
          ]}
          dataSource={entityData || []}
          loading={fetching}
          pagination={false}
        />
      </TableContainer>
    </Modal>
  )
}

export default CurrentStocks;
