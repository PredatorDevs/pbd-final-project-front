import React, { useState, useEffect, useRef } from 'react';
import { Input, Col, Row, Divider, Button, PageHeader, Modal, Descriptions, Badge, Table, Tag, Space } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined,  InfoCircleFilled,  InfoOutlined,  PrinterOutlined,  SaveOutlined, StopOutlined, TagsOutlined, WarningOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import moment from 'moment';
import 'moment/locale/es-mx';
import transfersServices from '../../services/TransfersServices';
import { customNot } from '../../utils/Notifications';
import { columnDef } from '../../utils/ColumnsDefinitions';
import { TableContainer } from '../../styled-components/TableContainer';
import ConfirmTransferDetail from '../confirmations/ConfirmTransferDetail';

const { confirm } = Modal;

function TransferPreview(props) {
  const [fetching, setFetching] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [entityDetailData, setEntityDetailData] = useState([]);
  const [refreshAfterClose, setRefreshAfterClose] = useState(false);

  const [transferDetailSelectedToConfirm, setTransferDetailSelectedToConfirm] = useState(0);
  const [transferDetailSelectedQuantityExpected, setTransferDetailSelectedQuantityExpected] = useState(null);
  const [transferDetailSelectedProductName, setTransferDetailSelectedProductName] = useState('');

  const { open, transferId, ableToConfirm, onClose } = props;

  const componentRef = useRef();

  function loadData() {
    setFetching(true);
    transfersServices.findById(transferId)
    .then((response) => {      
      setEntityData(response.data);
      setFetching(false);
    }).catch((error) => {
      customNot('error', 'Información no obtenida', 'Información de traslado no pudo ser obtenida')
      setFetching(false);
    });
  }

  useEffect(() => {
    loadData();
  }, [ transferId ]);

  function transferStatusColor(value) {
    switch(value) {
      case 1: return 'gold'; // Pendiente
      case 2: return 'cyan'; // En proceso
      case 3: return 'red'; // Rechazado
      case 4: return 'blue'; // Parcial
      case 5: return 'green'; // Aceptado
      default: return 'default';
    }
  }

  function rejectTransferDetail(transferDetailId) {
    setFetching(true);
    transfersServices.rejectTransferDetail(transferDetailId)
    .then((response) => {
      setFetching(false);
      setRefreshAfterClose(true);
      loadData();
    }).catch((error) => {
      setFetching(false);
      customNot('error', 'Detalle no pudo ser confirmado', 'Verifica los datos o la conexión a la red');
    });
  }

  function confirmAllOrRemainingTransfer() {
    setFetching(true);
    transfersServices.confirmTransfer(transferId)
    .then((response) => {
      setFetching(false);
      setRefreshAfterClose(true);
      loadData();
    }).catch((error) => {
      setFetching(false);
      customNot('error', 'Transferencia no pudo ser confirmada', 'Verifica la conexión a la red');
    });
  }

  function rejectAllOrRemainingTransfer() {
    setFetching(true);
    transfersServices.rejectTransfer(transferId)
    .then((response) => {
      setFetching(false);
      setRefreshAfterClose(true);
      loadData();
    }).catch((error) => {
      setFetching(false);
      customNot('error', 'Transferencia no pudo ser confirmada', 'Verifica la conexión a la red');
    });
  }

  const columns = [
    columnDef({title: 'Cód Det', dataKey: 'transferDetailId', fSize: 11}),
    columnDef({title: 'Producto', dataKey: 'productName', fSize: 11}),
    columnDef({title: 'Cantidad enviada', dataKey: 'quantityExpected', fSize: 11}),
    columnDef({title: 'Cantidad recibida', dataKey: 'quantityConfirmed', ifNull: '-', fSize: 11}),
    {
      title: <p style={{ margin: '0px', fontSize: 11, fontWeight: 600 }}>{'Estado'}</p>,
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => {
        return (
          <Tag style={{ fontSize: 11 }} color={transferStatusColor(record.transferDetailStatus)}>{record.transferDetailStatusName}</Tag>
        )
      }
    },
    ableToConfirm ? {
      title: <p style={{ margin: '0px', fontSize: 11, fontWeight: 600 }}>{'Acciones'}</p>,
      dataIndex: 'id',
      align: 'right',
      key: 'id',
      render: (text, record, index) => {
        return (
          <Space>
            <Button 
              size={'small'} 
              disabled={record.transferDetailStatus !== 1}
              onClick={() => {
                setOpenConfirmationModal(true);
                setTransferDetailSelectedToConfirm(record.transferDetailId);
                setTransferDetailSelectedQuantityExpected(record.quantityExpected);
                setTransferDetailSelectedProductName(record.productName);
              }}
              type={'primary'}
              icon={<CheckOutlined />} 
            >
              Aceptar
            </Button>
            <Button 
              size={'small'} 
              disabled={record.transferDetailStatus !== 1}
              onClick={() => {
                confirm({
                  title: `¿Desea rechazar ${record.quantityExpected} ${record.productName}?`,
                  centered: true,
                  icon: <StopOutlined color='red' />,
                  content: 'Confirme que no recibirá este detalle',
                  okType: 'danger',
                  onOk() { rejectTransferDetail(record.transferDetailId); },
                  onCancel() {},
                });
              }}
              danger
            >
              Rechazar
            </Button>
          </Space>
        )
      }
    } : {},
  ];

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={<TagsOutlined />}
          title={`Traslado ${transferId}`}
          extra={[
            ableToConfirm && (isEmpty(entityData) || isEmpty(entityData[0]) ? false : entityData[0][0].status === 1 || entityData[0][0].status === 2) ? 
              <Button 
                icon={<CheckOutlined />} 
                type={'primary'}
                onClick={() => {
                  confirm({
                    title: `¿Está seguro de aceptar todo el traslado?`,
                    centered: true,
                    icon: <InfoCircleFilled color='red' />,
                    content: 'Confirme que recibe todo conforme a la información del traslado y se marcará como aceptado',
                    cancelText: 'Cancelar',
                    okText: 'Aceptar',
                    onOk() { confirmAllOrRemainingTransfer(); },
                    onCancel() {},
                  });
                }}
              >
                {`Aceptar ${entityData[0][0].status === 1 ? 'todo' : 'restantes'}`}
              </Button> : <></>,
            ableToConfirm && (isEmpty(entityData) || isEmpty(entityData[0]) ? false : entityData[0][0].status === 1 || entityData[0][0].status === 2) ? 
              <Button 
                icon={<DeleteOutlined />} 
                danger 
                type={'primary'}
                onClick={() => {
                  confirm({
                    title: `¿Está seguro de rechazar todo el traslado?`,
                    centered: true,
                    icon: <StopOutlined color='red' />,
                    content: 'Confirme que no recibirá este traslado y se marcará como rechazado',
                    okType: 'danger',
                    cancelText: 'Cancelar',
                    okText: 'Rechazar',
                    onOk() { rejectAllOrRemainingTransfer(); },
                    onCancel() {},
                  });
                }}
              >
                {`Rechazar ${entityData[0][0].status === 1 ? 'todo' : 'restantes'}`}
              </Button> : <></>
          ]}
        />
      }
      centered
      width={800}
      closeIcon={<CloseOutlined style={{ padding: 5, backgroundColor: '#f0f0f0', borderRadius: 5, color: '#f5222d' }} />}
      onCancel={() => {
        onClose(refreshAfterClose);
        setRefreshAfterClose(false);
      }}
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
            <div style={{ height: 15 }} />
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
      <ConfirmTransferDetail 
        open={openConfirmationModal}
        transferDetailId={transferDetailSelectedToConfirm}
        quantityExpected={transferDetailSelectedQuantityExpected}
        productName={transferDetailSelectedProductName}
        onClose={(successOperation) => {
          setOpenConfirmationModal(false);
          setTransferDetailSelectedToConfirm(0);
          setTransferDetailSelectedQuantityExpected(null);
          setTransferDetailSelectedProductName('');
          if (successOperation) {
            loadData();
            setRefreshAfterClose(true);
          }
        }}
      />
    </Modal>
  )
}

export default TransferPreview;
