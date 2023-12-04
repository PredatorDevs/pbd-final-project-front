import React, { useEffect, useState } from 'react';
import { Wrapper } from '../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CompanyInformation } from '../styled-components/CompanyInformation';
import { Button, Col, DatePicker, Radio, Row, Space, Table, Tag } from 'antd';
import { TableContainer } from '../styled-components/TableContainer';
import { columnActionsDef, columnDef } from '../utils/ColumnsDefinitions';
import transfersServices from '../services/TransfersServices';
import { getUserLocation } from '../utils/LocalData';
import { customNot } from '../utils/Notifications';
import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import { LogoutOutlined, PlusOutlined } from '@ant-design/icons';
import { filter, last } from 'lodash';
import ConfirmTransfer from '../components/forms/ConfirmTransfer';
import TransferPreview from '../components/previews/TransferPreview';

const { RangePicker } = DatePicker;

const Container = styled.div`
  /* align-items: center; */
  background-color: #325696;
  border: 1px solid #D1DCF0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
  .subtitle {
    margin: 0px;
    color: #fff;
    font-size: 18px;
  }

  .label {
    margin: 0px;
    color: #fff;
    font-size: 13px;
    margin-top: 10px;
  }

  .disclaimer {
    margin: 0px;
    color: #fff;
    font-size: 10px;
    margin-top: 10px;
  }
`;

const InnerContainer = styled.div`
  background-color: #223B66;
  border: 1px solid #223B66;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 0px;
  width: calc(100%);
  color: white;
`;

function Transfers() {
  const navigate = useNavigate();

  function defaultDate() {
    return moment();
  };

  const [fetching, setFetching] = useState(false);
  const [transferTabToRender, setTransferTabToRender] = useState(getUserLocation() === 1 ? 2 : 1);
  const [lastSearchMethod, setLastSearchMethod] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [transferAbleToConfirm, setTransferAbleToConfirm] = useState(false);

  const [incomingInitialDate, setIncomingInitialDate] = useState(defaultDate());
  const [incomingFinalDate, setIncomingFinalDate] = useState(defaultDate());
  const [incomingSearchOption, setIncomingSearchOption] = useState(1);
  const [incomingFilterStatusOption, setIncomingFilterStatusOption] = useState(0);

  const [outcomingInitialDate, setOutcomingInitialDate] = useState(defaultDate());
  const [outcomingFinalDate, setOutcomingFinalDate] = useState(defaultDate());
  const [outcomingSearchOption, setOutcomingSearchOption] = useState(1);
  const [outcomingFilterStatusOption, setOutcomingFilterStatusOption] = useState(0);

  const [refreshIncomingTransfers, setRefreshIncomingTransfers] = useState(0);
  const [refreshOutcomingTransfers, setRefreshOutcomingTransfers] = useState(0);

  const [incomingTransfersData, setIncomingTransfersData] = useState(false);
  const [outcomingTransfersData, setOutcomingTransfersData] = useState(false);

  const [transferIdSelected, setTransferIdSelected] = useState(0);

  function loadIncomingTransfers() {
    setFetching(true);
    transfersServices.incomingTransfers(getUserLocation())
    .then((response) => { 
      setIncomingTransfersData(response.data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información de los traslados entrantes', 'Revise su conexión a la red');
      setFetching(false);
    });
  }

  function loadOutcomingTransfers() {
    setFetching(true);
    transfersServices.outcomingTransfers(getUserLocation())
    .then((response) => { 
      setOutcomingTransfersData(response.data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información de los traslados salientes', 'Revise su conexión a la red');
      setFetching(false);
    });
  }

  function searchIncomingTransfers() {
    setFetching(true);
    if (incomingSearchOption === 1) {
      transfersServices.incomingTransfersBySentAtRange(
        getUserLocation(),
        incomingInitialDate.format('YYYY-MM-DD'),
        incomingFinalDate.format('YYYY-MM-DD')
      ).then((response) => {
        setIncomingTransfersData(response.data);
        setLastSearchMethod(2);
        setFetching(false);
      }).catch((error) => {
        customNot('error', 'Sin información de los traslados entrantes', 'Revise su conexión a la red');
        setFetching(false);
      });
    }
    else if (incomingSearchOption === 2) {
      transfersServices.incomingTransfersByReceivedAtRange(
        getUserLocation(),
        incomingInitialDate.format('YYYY-MM-DD'),
        incomingFinalDate.format('YYYY-MM-DD')
      ).then((response) => {
        setIncomingTransfersData(response.data);
        setLastSearchMethod(2);
        setFetching(false);
      }).catch((error) => {
        customNot('error', 'Sin información de los traslados entrantes', 'Revise su conexión a la red');
        setFetching(false);
      });
    } else {
      setFetching(false);
    }
  }

  function searchOutcomingTransfers() {
    setFetching(true);
    if (outcomingSearchOption === 1) {
      transfersServices.outcomingTransfersBySentAtRange(
        getUserLocation(),
        outcomingInitialDate.format('YYYY-MM-DD'),
        outcomingFinalDate.format('YYYY-MM-DD')
      ).then((response) => {
        setOutcomingTransfersData(response.data);
        setFetching(false);
      }).catch((error) => {
        customNot('error', 'Sin información de los traslados salientes', 'Revise su conexión a la red');
        setFetching(false);
      });
    }
    else if (outcomingSearchOption === 2) {
      transfersServices.outcomingTransfersByReceivedAtRange(
        getUserLocation(),
        outcomingInitialDate.format('YYYY-MM-DD'),
        outcomingFinalDate.format('YYYY-MM-DD')
      ).then((response) => {
        setOutcomingTransfersData(response.data);
        setFetching(false);
      }).catch((error) => {
        customNot('error', 'Sin información de los traslados salientes', 'Revise su conexión a la red');
        setFetching(false);
      });
    } else {
      setFetching(false);
    }
  }

  useEffect(() => {
    loadIncomingTransfers();
  }, [ refreshIncomingTransfers ]);

  useEffect(() => {
    loadOutcomingTransfers();
  }, [ refreshOutcomingTransfers ]);

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

  const incomingColumns = [
    columnDef({title: 'Cód', dataKey: 'transferId', fSize: 11}),
    columnDef({title: 'Fecha envío', dataKey: 'sentAt', fSize: 11}),
    columnDef({title: 'Proviene de', dataKey: 'originLocationName', ifNull: '-', fSize: 11}),
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

  const outcomingColumns = [
    columnDef({title: 'Cód', dataKey: 'transferId', fSize: 11}),
    columnDef({title: 'Fecha envío', dataKey: 'sentAt', fSize: 11}),
    columnDef({title: 'Enviado a', dataKey: 'destinationLocationName', ifNull: '-', fSize: 11}),
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
    <Wrapper>
      <Row gutter={[8, 8]} style={{ width: '100%' }}>
        <Col span={24} style={{
          // backgroundColor: element.isOpen ? "#d9f7be" : "#fafafa",
          boxShadow: '3px 3px 5px 0px #d9d9d9',
          border: '1px solid #d9d9d9',
          borderRadius: 5
        }}>
          <Space>
            <Button
              icon={<PlusOutlined />}
              style={{ backgroundColor: '#52c41a', color: 'white', margin: 5 }}
              onClick={(e) => {
                navigate('/main/transfers/new');
              }}
              disabled={getUserLocation() !== 2}
            >
              Nuevo Traslado
            </Button>
          </Space>
        </Col>
        <Col span={12}>
          <Radio.Group buttonStyle="solid" onChange={(e) => setTransferTabToRender(e.target.value)} value={transferTabToRender}>
            <Radio.Button 
              value={1} 
              // disabled={getUserLocation() === 1}
            >
              Entrantes
            </Radio.Button>
            <Radio.Button 
              value={2} 
              // disabled={getUserLocation() !== 1}
            >
              Salientes
            </Radio.Button>
          </Radio.Group>
        </Col>
        <Col span={12}>
        </Col>
      </Row>
      <div style={{ height: 20 }} />
      <Row gutter={[8, 8]} style={{ width: '100%' }}>
        {
          transferTabToRender === 1 ? (
            <Col span={24}>
                <Row gutter={[8, 8]}>
                  <Col span={24}>
                    <Radio.Group buttonStyle="solid" onChange={(e) => setIncomingSearchOption(e.target.value)} value={incomingSearchOption}>
                      <Radio.Button value={1}>Enviado</Radio.Button>
                      <Radio.Button value={2}>Recibido</Radio.Button>
                    </Radio.Group>
                  </Col>
                  <Col span={24}>
                    <Space>
                      <RangePicker 
                        locale={locale} 
                        format={["DD-MM-YYYY", "DD-MM-YYYY"]}
                        value={[incomingInitialDate, incomingFinalDate]} 
                        // style={{ width: '100%' }}
                        onChange={([initialMoment, finalMoment], [initialString, finalString]) => {
                          setIncomingInitialDate(initialMoment);
                          setIncomingFinalDate(finalMoment);
                        }}
                      />
                      <Button
                        onClick={(e) => searchIncomingTransfers()}
                      >
                        Buscar
                      </Button>
                    </Space>
                  </Col>
                </Row>
                <p className='label'>Estado:</p>
                <Row gutter={[8, 8]}>
                  <Col span={24}>
                    <Radio.Group buttonStyle="solid" onChange={(e) => setIncomingFilterStatusOption(e.target.value)} value={incomingFilterStatusOption}>
                      <Radio.Button value={0}>Todos</Radio.Button>
                      <Radio.Button value={1}>Pendientes</Radio.Button>
                      <Radio.Button value={2}>En Proceso</Radio.Button>
                      <Radio.Button value={3}>Rechazados</Radio.Button>
                      <Radio.Button value={4}>Parciales</Radio.Button>
                      <Radio.Button value={5}>Aceptados</Radio.Button>
                    </Radio.Group>
                  </Col>
                </Row>
                <p className='label'>Resultados:</p>
                {/* <TableContainer headColor={'#9e1068'}> */}
                  <Table 
                    columns={incomingColumns}
                    rowKey={'transferId'}
                    size={'small'}
                    dataSource={
                      incomingFilterStatusOption === 0 ? incomingTransfersData : filter(incomingTransfersData, ['status', incomingFilterStatusOption]) || []
                    }
                    onRow={(record, rowIndex) => {
                      return {
                        onClick: (e) => {
                          setTransferIdSelected(record.transferId);
                          setTransferAbleToConfirm(true);
                          setOpenModal(true);
                        },
                        // onDoubleClick: (event) => {}, // double click row
                        // onContextMenu: (event) => {}, // right button click row
                        // onMouseEnter: (event) => {}, // mouse enter row
                        // onMouseLeave: (event) => {}, // mouse leave row
                      };
                    }}
                    loading={fetching}
                  />
                {/* </TableContainer> */}
                <p className='disclaimer'>Previo a una primera búsqueda se muestran los últimos 50 traslados</p>
            </Col>
          ) : (
            <Col span={24}>
                <Row gutter={[8, 8]}>
                  <Col span={24}>
                    <Radio.Group buttonStyle="solid" onChange={(e) => setOutcomingSearchOption(e.target.value)} value={outcomingSearchOption}>
                      <Radio.Button value={1}>Enviado</Radio.Button>
                      <Radio.Button value={2}>Recibido</Radio.Button>
                    </Radio.Group>
                  </Col>
                  <Col span={24}>
                    <Space>
                      <RangePicker 
                        locale={locale} 
                        format={["DD-MM-YYYY", "DD-MM-YYYY"]}
                        value={[outcomingInitialDate, outcomingFinalDate]} 
                        // style={{ width: '100%' }}
                        onChange={([initialMoment, finalMoment], [initialString, finalString]) => {
                          setOutcomingInitialDate(initialMoment);
                          setOutcomingFinalDate(finalMoment);
                        }}
                      />
                      <Button
                        onClick={(e) => searchOutcomingTransfers()}
                      >
                        Buscar
                      </Button>
                    </Space>
                  </Col>
                </Row>
                <p className='label'>Estado:</p>
                <Row gutter={[8, 8]}>
                  <Col span={24}>
                    <Radio.Group buttonStyle="solid" onChange={(e) => setOutcomingFilterStatusOption(e.target.value)} value={outcomingFilterStatusOption}>
                      <Radio.Button value={0}>Todos</Radio.Button>
                      <Radio.Button value={1}>Pendientes</Radio.Button>
                      <Radio.Button value={2}>En Proceso</Radio.Button>
                      <Radio.Button value={3}>Rechazados</Radio.Button>
                      <Radio.Button value={4}>Parciales</Radio.Button>
                      <Radio.Button value={5}>Aceptados</Radio.Button>
                    </Radio.Group>
                  </Col>
                </Row>
                <p className='label'>Resultados:</p>
                {/* <TableContainer headColor={'#006d75'}> */}
                  <Table 
                    columns={outcomingColumns}
                    rowKey={'transferId'}
                    size={'small'}
                    dataSource={
                      outcomingFilterStatusOption === 0 ? outcomingTransfersData : filter(outcomingTransfersData, ['status', outcomingFilterStatusOption]) || []
                    }
                    onRow={(record, rowIndex) => {
                      return {
                        onClick: (e) => { 
                          setTransferIdSelected(record.transferId);
                          setOpenModal(true);  
                        }, // click row
                        // onDoubleClick: (event) => {}, // double click row
                        // onContextMenu: (event) => {}, // right button click row
                        // onMouseEnter: (event) => {}, // mouse enter row
                        // onMouseLeave: (event) => {}, // mouse leave row
                      };
                    }}
                    loading={fetching}
                  />
                {/* </TableContainer> */}
                <p className='disclaimer'>Previo a una primera búsqueda se muestran los últimos 50 traslados</p>
            </Col>
          )
        }
      </Row>
      <TransferPreview
        open={openModal}
        ableToConfirm={transferAbleToConfirm}
        transferId={transferIdSelected}
        onClose={(refreshAfterClose) => {
          setOpenModal(false);
          setTransferAbleToConfirm(false);
          setTransferIdSelected(0);
          if (refreshAfterClose) {
            if (lastSearchMethod === 1) loadIncomingTransfers();
            if (lastSearchMethod === 2) searchIncomingTransfers();
          }
        }}
      />
    </Wrapper>
  );
}

export default Transfers;
