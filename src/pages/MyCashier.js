import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Button, Card, Col, Collapse, Modal, PageHeader, Result, Row, Space, Statistic, Table, Tag } from 'antd';
import { ArrowDownOutlined, BookOutlined, DollarOutlined, DollarTwoTone, DownSquareTwoTone, FileAddOutlined, FileProtectOutlined, LogoutOutlined, MinusCircleTwoTone, MoneyCollectOutlined, PlusCircleTwoTone, SyncOutlined, UpSquareTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { Wrapper } from '../styled-components/Wrapper';

import cashiersServices from '../services/CashiersServices.js';
import moment from 'moment';
import 'moment/locale/es-mx';
import { getUserCanCloseCashier, getUserIsAdmin, getUserLocation, getUserMyCashier } from '../utils/LocalData';

import Meta from 'antd/lib/card/Meta';

import cashierIcon from '../img/icons/main/cashier.png'
import { isEmpty } from 'lodash';
import CashierInformationPreview from '../components/previews/CashierInfomationPreview';
import { columnDef, columnMoneyDef } from '../utils/ColumnsDefinitions';
import CloseCashierModal from '../components/CloseCashierModal';
import OpenCashierModal from '../components/OpenCashierModal';
import NewCashierCashFundDeposit from '../components/forms/NewCashierCashFundDeposit.js';
import NewCashierCashFundWithdraw from '../components/forms/NewCashierCashFundWithdraw.js';

const { Panel } = Collapse;

function MyCashier() {
  // console.log("CAN CLOSE: ", !(!getUserCanCloseCashier() || getUserIsAdmin()));
  const [fetching, setFetching] = useState(false);
  const [openCashierInfoPrev, setOpenCashierInfoPrev] = useState(false);
  const [openNewCashierCashFundDeposit, setOpenNewCashierCashFundDeposit] = useState(false);
  const [openNewCashierCashFundWithdraw, setOpenNewCashierCashFundWithdraw] = useState(false);
  const [openCloseCashier, setOpenCloseCashier] = useState(false);
  const [openOpenCashier, setOpenOpenCashier] = useState(false);

  const [entityData, setEntityData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]);
  const [movementsData, setMovementsData] = useState([]);
  const [entityDataSelected, setEntityDataSelected] = useState({});

  async function loadData() {
    setFetching(true);

    const response = await cashiersServices.findMyCashier(getUserMyCashier());
    setEntityData(response.data);

    if (response.data[0].isOpen) {
      const summaryResponse = await cashiersServices.getCurrentShiftcutSummary(response.data[0].currentShiftcutId);
      const reportResponse = await cashiersServices.getCurrentShiftcutReport(response.data[0].currentShiftcutId);
      const paymentsResponse = await cashiersServices.getCurrentShiftcutPayments(response.data[0].currentShiftcutId);
      const movementsResponse = await cashiersServices.getCurrentShiftcutCashFundMovements(response.data[0].currentShiftcutId);

      setSummaryData(summaryResponse.data);
      setReportData(reportResponse.data);
      setPaymentsData(paymentsResponse.data);
      setMovementsData(movementsResponse.data);
    }

    setFetching(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function getReportTotalCash() {
    if (isEmpty(reportData)) return 0
    else {
      let value = 0;
      for (let i = 0; i < reportData.length; i++) {
        const { saleId, cashSale } = reportData[i];
        if (saleId !== null) value += +(cashSale);
      }
      return value;
    }
  }

  function getReportTotalCredit() {
    if (isEmpty(reportData)) return 0
    else {
      let value = 0;
      for (let i = 0; i < reportData.length; i++) {
        const { saleId, creditSale } = reportData[i];
        if (saleId !== null) value += +(creditSale);
      }
      return value;
    }
  }

  function getReportTotalSale() {
    if (isEmpty(reportData)) return 0
    else {
      let value = 0;
      for (let i = 0; i < reportData.length; i++) {
        const { saleId, totalSale } = reportData[i];
        if (saleId !== null) value += +(totalSale);
      }
      return value;
    }
  }

  function getTotalCashFromSummary() {
    return isEmpty(summaryData) ? 
      0 : 
      +(summaryData[0].totalAmount || 0) + 
      +(summaryData[1].totalAmount || 0) +
      +(summaryData[2].totalAmount || 0)
  }

  function getCashInCashier() {
    return (
      isEmpty(entityData) && isEmpty(summaryData) ?
        0 :
        (getTotalCashFromSummary()) + +(entityData[0].cashFunds || 0)
    )
  }

  return (
    <Wrapper>
      {
        isEmpty(entityData) ? <>
          <Result
            status="warning"
            title={<p style={{ color: '#434343' }}>{`${fetching ? "Cargando..." : "Información de caja no disponible"}`}</p>}
            subTitle={<p style={{ color: '#434343' }}>{`${fetching ? "Cargando..." : "Vuelva a intentar más tarde"}`}</p>}
          />
        </> : <>
          <Row gutter={[8, 8]} style={{ width: '100%' }}>
            <Col span={24} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Space wrap>
                <Button
                  size='large'
                  icon={<SyncOutlined />}
                  onClick={() => {
                    loadData();
                  }}
                  loading={fetching}
                >
                  Actualizar
                </Button>
                <Button
                  size='large'
                  // style={{ backgroundColor: '#722ed1', color: 'white' }}
                  icon={<MinusCircleTwoTone twoToneColor={'red'} />}
                  disabled={!entityData[0]?.enableReportCashFundMovements}
                  loading={fetching}
                  onClick={() => {
                    setEntityDataSelected(entityData[0]);
                    setOpenNewCashierCashFundWithdraw(true);
                  }}
                >
                  Retiro Caja Chica
                </Button>
                <Button
                  size='large'
                  // style={{ backgroundColor: '#2f54eb', color: 'white' }}
                  icon={<PlusCircleTwoTone />}
                  loading={fetching}
                  disabled={!entityData[0]?.enableReportCashFundMovements}
                  onClick={() => {
                    setEntityDataSelected(entityData[0]);
                    setOpenNewCashierCashFundDeposit(true);
                  }}
                >
                  Reposición Caja Chica
                </Button>
              </Space>
            </Col>
            <Col span={12}>
              <Card
                style={{
                  width: 300,
                  margin: 10,
                  backgroundColor: entityData[0].isOpen ? "#d9f7be" : "#fafafa",
                  boxShadow: '3px 3px 5px 0px #d9d9d9',
                  border: '1px solid #d9d9d9'
                }}
                loading={fetching}
                actions={[
                  <Button
                    key="1"
                    onClick={() => {
                      setEntityDataSelected(entityData[0]);
                      setOpenCashierInfoPrev(true);
                    }}
                    loading={fetching}
                  >
                    Informacion
                  </Button>,
                  <Button
                    key="2"
                    type={'primary'}
                    disabled={(!(!getUserCanCloseCashier() || getUserIsAdmin()))}
                    onClick={() => {
                      if (entityData[0].isOpen) {
                        setOpenCloseCashier(true);
                      } else {
                        setOpenOpenCashier(true);
                      }
                    }}
                    loading={fetching}
                  >
                    {
                      entityData[0].isOpen ? 'Cerrar caja' : 'Aperturar caja'
                    }
                  </Button>,
                ]}
              >
                <Meta
                  avatar={<Avatar src={cashierIcon} shape='square' />}
                  title={entityData[0].name}
                  description={
                    <>
                      <p style={{ margin: 0 }}>{`${entityData[0].isOpen ? `Caja abierta - Turno #${entityData[0].currentShiftcutNumber}` : "Caja cerrada"}`}</p>
                      <p style={{ margin: '5px 0px 0px 0px', fontSize: 11 }}>{entityData[0].locationName}</p>
                      <p style={{ margin: '5px 0px 0px 0px', fontSize: 9 }}>{`CId: ${entityData[0].id} - SId: ${entityData[0].currentShiftcutId || ''}`}</p>
                    </>
                  }
                />
              </Card>
            </Col>
            <Col span={12}>
              
            </Col>
            {
              entityData[0].isOpen ? <Col span={24} style={{ backgroundColor: '#FAFAFA' }}>
                <Space wrap>
                  <Card
                    style={{ margin: '10px 5px' }}
                    size='small'
                  >
                    <Statistic
                      title={<p style={{ color: 'black' }}>{'Fondo Caja Chica'}</p>}
                      value={entityData[0].cashFunds || 0}
                      precision={2}
                      prefix={<DollarTwoTone twoToneColor={'#13c2c2'} style={{ fontSize: 16 }} />}
                    />
                  </Card>
                  {
                    summaryData.map((element, index) => (
                      <Card
                        key={index}
                        style={{ margin: '10px 5px' }}
                        size='small'
                      >
                        <Statistic
                          title={<p style={{ color: 'black' }}>{element.movementType}</p>}
                          value={element.totalAmount || 0}
                          precision={2}
                          prefix={<DollarTwoTone twoToneColor={index === 3 ? '#eb2f96' : '#1677ff'} style={{ fontSize: 16 }} />}
                        />
                      </Card>
                    ))
                  }
                  {/* <Card
                    style={{ margin: '10px 5px' }}
                    size='small'
                  >
                    <Statistic
                      title={<p style={{ color: 'black' }}>{'Total Efectivo'}</p>}
                      value={getCashInCashier() || 0}
                      precision={2}
                      prefix={<DollarTwoTone twoToneColor={'#52c41a'} style={{ fontSize: 16 }} />}
                    />
                  </Card> */}
                  <Card
                    style={{ margin: '10px 5px' }}
                    size='small'
                  >
                    <Statistic
                      title={<p style={{ color: 'black' }}>{'Total Efectivo En Caja'}</p>}
                      value={getTotalCashFromSummary() || 0}
                      precision={2}
                      prefix={<DollarTwoTone twoToneColor={'#52c41a'} style={{ fontSize: 16 }} />}
                    />
                  </Card>
                </Space>
              </Col>
              : <></>
            }
            {
              entityData[0].isOpen ? <Col span={24} style={{ backgroundColor: '#FAFAFA' }}>
                <Collapse>
                  <Panel header="Ventas" key="1">
                    <Table 
                      columns={[
                        columnDef({title: 'Documento', dataKey: 'document'}),
                        columnDef({title: 'Tipo', dataKey: 'paymentTypeName'}),
                        columnDef({title: 'Cliente', dataKey: 'customerFullname'}),
                        columnDef({title: 'Descripción', dataKey: 'productName'}),
                        // columnDef({title: 'Anulada', dataKey: 'isVoided'}),
                        // columnMoneyDef({title: 'Contado', dataKey: 'cashSale'}),
                        // columnMoneyDef({title: 'Crédito', dataKey: 'creditSale'}),
                        columnMoneyDef({title: 'Monto', dataKey: 'totalSale'}),
                      ]}
                      scroll={{ y: 300 }}
                      rowKey={'id'}
                      size={'small'}
                      dataSource={
                        [
                          ...reportData,
                          {
                            dataKey: null,
                            customerFullname: null,
                            productName: "TOTAL",
                            cashSale: getReportTotalCash(),
                            creditSale: getReportTotalCredit(),
                            totalSale: getReportTotalSale()
                          }
                        ] || []
                      }
                      pagination={false}
                      loading={fetching}
                      onRow={(record, index) => ({
                        style: {
                            background: record.isHeader === 1 && record.isFooter === 0 ? '#adc6ff' : record.isHeader === 0 && record.isFooter === 1 ? '#f0f5ff' : index % 2 === 0 ? '#f0f5ff' :  'inherit',
                            // color: record.isHeader === 1 && record.isFooter === 0 ? '#ffffff' : '#000000'
                        }
                      })}
                    />
                  </Panel>
                  <Panel header="Abonos" key="2">
                    <Table 
                      columns={[
                        columnDef({title: 'Registrado por', dataKey: 'registeredByFullname'}),
                        columnDef({title: 'Documento', dataKey: 'document'}),
                        columnDef({title: 'Cliente', dataKey: 'customerFullname'}),
                        // columnDef({title: 'Anulada', dataKey: 'isVoided'}),
                        columnMoneyDef({title: 'Monto', dataKey: 'totalPaid'}),
                      ]}
                      scroll={{ y: 300 }}
                      rowKey={'paymentId'}
                      size={'small'}
                      dataSource={paymentsData || []}
                      pagination={false}
                      loading={fetching}
                      onRow={(record, index) => ({
                        style: {
                            background: index % 2 === 0 ? '#f0f5ff' :  'inherit',
                            // color: record.isHeader === 1 && record.isFooter === 0 ? '#ffffff' : '#000000'
                        }
                      })}
                    />
                  </Panel>
                  <Panel header="Movimientos Caja Chica" key="3">
                    <Table 
                      columns={[
                        columnDef({title: 'Operacion', dataKey: 'movementTypeName'}),
                        columnDef({title: 'Por', dataKey: 'userPINCodeFullname'}),
                        columnDef({title: 'Razon', dataKey: 'comments'}),
                        // columnDef({title: 'Anulada', dataKey: 'isVoided'}),
                        columnMoneyDef({title: 'Anterior', dataKey: 'prevAmount'}),
                        columnMoneyDef({title: 'Monto', dataKey: 'amount'}),
                        columnMoneyDef({title: 'Saldo', dataKey: 'newAmount'})
                      ]}
                      scroll={{ y: 300 }}
                      rowKey={'shiftcutCashFundMovementId'}
                      size={'small'}
                      dataSource={movementsData || []}
                      pagination={false}
                      loading={fetching}
                      onRow={(record, index) => ({
                        style: {
                            background: record.movementType === 'deposit' ? '#EEF7FF' :  '#FFF5F5',
                            // color: record.isHeader === 1 && record.isFooter === 0 ? '#ffffff' : '#000000'
                        }
                      })}
                    />
                  </Panel>
                </Collapse>
              </Col>
              : <></>
            }
            {
              entityData[0].isOpen ?
              <CloseCashierModal
                open={openCloseCashier}
                cashierId={entityData[0].id}
                finalAmount={getCashInCashier() || 0}
                cashFunds={Number(entityData[0]?.cashFunds)}
                onClose={(refresh) => {
                  setOpenCloseCashier(false);
                  if (refresh) loadData();
                }}
              />
              : <></>
            }
            {
              !entityData[0].isOpen ?
              <OpenCashierModal
                open={openOpenCashier}
                cashierId={entityData[0].id}
                onClose={(refresh) => {
                  setOpenOpenCashier(false);
                  if (refresh) loadData();
                }}
              />
              : <></>
            }
          </Row>
        </>
      }
      <CashierInformationPreview
        open={openCashierInfoPrev}
        cashierData={entityDataSelected || {}}
        onClose={() => {
          setEntityDataSelected({});
          setOpenCashierInfoPrev(false);
        }}
      />
      <NewCashierCashFundDeposit
        open={openNewCashierCashFundDeposit}
        cashierId={entityDataSelected?.id || {}}
        onClose={(refresh) => {
          if (refresh) loadData();
          setEntityDataSelected({});
          setOpenNewCashierCashFundDeposit(false);
        }}
      />
      <NewCashierCashFundWithdraw
        open={openNewCashierCashFundWithdraw}
        cashierId={entityDataSelected?.id || {}}
        onClose={(refresh) => {
          if (refresh) loadData();
          setEntityDataSelected({});
          setOpenNewCashierCashFundWithdraw(false);
        }}
      />
    </Wrapper>
  );
}

export default MyCashier;
