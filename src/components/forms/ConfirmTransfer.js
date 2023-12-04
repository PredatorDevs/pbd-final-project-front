import React, { useState, useEffect, useRef } from 'react';
import { Input, Col, Row, Divider, Button, PageHeader, Modal, Descriptions, Badge, Table, Tag } from 'antd';
import { CloseOutlined, DeleteOutlined,  PrinterOutlined,  SaveOutlined, TagsOutlined, WarningOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import moment from 'moment';
import 'moment/locale/es-mx';
import transfersServices from '../../services/TransfersServices';
import { customNot } from '../../utils/Notifications';
import { columnDef } from '../../utils/ColumnsDefinitions';
import { TableContainer } from '../../styled-components/TableContainer';

function ConfirmTransfer(props) {
  const [fetching, setFetching] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [entityDetailData, setEntityDetailData] = useState([]);

  const { open, transferId, onClose } = props;

  const componentRef = useRef();

  useEffect(() => {
    setFetching(true);
    transfersServices.findById(transferId)
    .then((response) => {
      setEntityData(response.data);
      setFetching(false);
    }).catch((error) => {
      customNot('error', 'Información no obtenida', 'Información de traslado no pudo ser obtenida')
      setFetching(false);
    })
  }, [ transferId ]);

  function transferStatusColor(value) {
    switch(value) {
      case 1: return 'gold';
      case 2: return 'red';
      case 3: return 'blue';
      case 4: return 'green';
      default: return 'default';
    }
  }

  const columns = [
    columnDef({title: 'Producto', dataKey: 'transferId', fSize: 11}),
    columnDef({title: 'Cantidad enviada', dataKey: 'sentAt', fSize: 11}),
    columnDef({title: 'Enviado a', dataKey: 'originLocationName', ifNull: '-', fSize: 11}),
    columnDef({title: 'Enviado por', dataKey: 'sentByFullname', fSize: 11}),
    columnDef({title: 'Fecha recibido', dataKey: 'receivedAt', ifNull: 'Sin recibir', fSize: 11}),
    columnDef({title: 'Recibido por', dataKey: 'receivedByFullname', ifNull: 'Sin recibir', fSize: 11}),
    {
      title: <p style={{ margin: '0px', fontSize: 11, fontWeight: 600 }}>{'Estado'}</p>,
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => {
        return (
          <Tag style={{ fontSize: 11 }} color={transferStatusColor(record.status)}>{record.transferStatusName}</Tag>
        )
      }
    },
  ];

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={<TagsOutlined />}
          title={`Traslado ${transferId}`}
        />
      }
      centered
      width={800}
      closeIcon={<CloseOutlined style={{ padding: 5, backgroundColor: '#f0f0f0', borderRadius: 5, color: '#f5222d' }} />}
      onCancel={() => onClose()}
      maskClosable={false}
      visible={open}
      footer={null}
    >
      {
        isEmpty(entityData) || isEmpty(entityData[0]) || isEmpty(entityData[1]) ? (
          <div>No data</div>
        ) : (
          <>
            <Descriptions bordered style={{ width: '100%' }} size={'small'}>
              <Descriptions.Item label="Proviene de" span={2}>{entityData[0][0].originLocationName}</Descriptions.Item>
              <Descriptions.Item label="Enviado a" span={2}>{entityData[0][0].destinationLocationName}</Descriptions.Item>
              <Descriptions.Item label="Fecha de envío" span={2}>{entityData[0][0].sentAt}</Descriptions.Item>
              <Descriptions.Item label="Enviado por" span={2}>{entityData[0][0].sentByFullname}</Descriptions.Item>
              <Descriptions.Item label="Fecha de recibido" span={2}>{entityData[0][0].receivedAt}</Descriptions.Item>
              <Descriptions.Item label="Recibido por" span={2}>{entityData[0][0].receivedByFullname}</Descriptions.Item>
              <Descriptions.Item label="Estado" span={3}><Tag style={{ fontSize: 11 }} color={transferStatusColor(entityData[0][0].status)}>{entityData[0][0].transferStatusName}</Tag></Descriptions.Item>
            </Descriptions>
            <TableContainer headColor={'#9e1068'}>
              <Table 
                columns={columns}
                rowKey={'transferDetailId'}
                size={'small'}
                dataSource={entityData[1]}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: (e) => {
                      // setTransferIdSelected(record.transferId);
                      // setOpenModal(true);
                    }, // click row
                    // onDoubleClick: (event) => {}, // double click row
                    // onContextMenu: (event) => {}, // right button click row
                    // onMouseEnter: (event) => {}, // mouse enter row
                    // onMouseLeave: (event) => {}, // mouse leave row
                  };
                }}
                loading={fetching}
              />
            </TableContainer>
          </>
        )
      }
      
    </Modal>
  )
}

export default ConfirmTransfer;
