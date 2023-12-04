import React, { useState, useEffect, useRef } from 'react';
import { Col, Row, Button, PageHeader, Modal, Descriptions, Table, Tag, Result } from 'antd';
import { CloseOutlined,  DeleteOutlined,  DeleteTwoTone,  FileExcelTwoTone,  FileOutlined, FilePdfTwoTone, PrinterFilled, SyncOutlined } from '@ant-design/icons';
import { find, forEach, isEmpty } from 'lodash';
import moment from 'moment';
import 'moment/locale/es-mx';
import ReactToPrint from 'react-to-print';

import salesServices from '../../services/SalesServices.js';
import { columnDef, columnMoneyDef } from '../../utils/ColumnsDefinitions.js';
import AuthorizeAction from '../confirmations/AuthorizeAction.js';
import ConsumidorFinal from '../invoices/ConsumidorFinal.js';
import generalsServices from '../../services/GeneralsServices.js';
import { printerServices } from '../../services/PrintersServices.js';
import { numberToLetters } from '../../utils/NumberToLetters.js';
import { customNot } from '../../utils/Notifications.js';

function SalePreview(props) {
  const [fetching, setFetching] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [entityDetailData, setEntityDetailData] = useState([]);
  const [wasVoided, setWasVoided] = useState(false);
  const [openVoidConfirmation, setOpenVoidConfirmation] = useState(false);

  const [taxesData, setTaxesData] = useState([]);

  const { open, saleId, onClose } = props;

  const ticketComponentRef = useRef();
  const cfComponentRef = useRef();
  const ccfComponentRef = useRef();

  async function loadData() {
    setFetching(true);
    try {
      const saleRes = await salesServices.findById(saleId);
      setEntityData(saleRes.data);
      const saleDetRes = await salesServices.details.findBySaleId(saleId);
      setEntityDetailData(saleDetRes.data);
      const taxesResponse = await generalsServices.findTaxes();
      setTaxesData(taxesResponse.data);
    } catch (error) {
    }
    setFetching(false);
  }

  function paymentStatusColor(status) {
    switch(status) {
      case 1: return 'green';
      case 2: return 'orange';
      case 3: return 'red';
      default: return 'gray';
    }
  }

  useEffect(() => {
    loadData();
  }, [ saleId ]);

  async function voidSale(userId) {
    setFetching(true);
    try {
      await salesServices.voidSale(userId, saleId);
      setWasVoided(true);
    } catch(error) {
    }
    setFetching(false);
  }

  async function rePrintSale() {
    setFetching(true);
    try {
      if (entityData[0]?.documentTypeId === 2) {
        customNot('info', '', 'Reimprimiendo Factura');
        await printerServices.printCF(
          {
            customerFullname: `${entityData[0]?.customerFullname || '-'}`,
            documentDatetime: `${moment(isEmpty(entityData[0]) ? '1999-01-01' : entityData[0]?.docDatetime).format('L') || '-'}`,
            customerAddress: `${entityData[0]?.customerAddress || '-'}`,
            customerDui: `${entityData[0]?.customerDui || '-'}`,
            customerNit: `${entityData[0]?.customerNit || '-'}`,
            customerPhone: `${entityData[0]?.customerPhone || '-'}`,
            totalSale: entityData[0]?.total || 0,
            totalToLetters: `${numberToLetters(entityData[0]?.total)}`
          },
          entityDetailData
        );
      }

      if (entityData[0]?.documentTypeId === 3) {
        customNot('info', '', 'Reimprimiendo Comprobante de Crédito Fiscal');
        await printerServices.printCCF(
          {
            customerFullname: `${entityData[0]?.customerFullname || '-'}`,
            documentDatetime: `${moment(isEmpty(entityData[0]) ? '1999-01-01' : entityData[0]?.docDatetime).format('L') || '-'}`,
            customerAddress: `${entityData[0]?.customerAddress || '-'}`,
            customerState: `${'' || '-'}`,
            customerNit: `${entityData[0]?.customerNit || '-'}`,
            customerNrc: `${entityData[0]?.customerNrc || '-'}`,
            customerBusinessType: `${entityData[0]?.customerBusinessLine || '-'}`,
            customerOccupation: `${entityData[0]?.customerOccupation || '-'}`,
            customerDepartmentName: `${entityData[0]?.customerDepartmentName || '-'}`,
            customerCityName: `${entityData[0]?.customerCityName || '-'}`,
            paymentTypeName: `${entityData[0]?.paymentTypeName || '-'}`,
            taxableSale: entityData[0]?.totalTaxable || 0,
            taxableSaleWithoutTaxes: entityData[0]?.taxableSubTotalWithoutTaxes || 0,
            noTaxableSale: entityData[0]?.totalNoTaxable || 0,
            totalTaxes: entityData[0]?.totalTaxes || 0,
            totalSale: entityData[0]?.total || 0,
            totalToLetters: `${numberToLetters(entityData[0]?.total)}`
          },
          entityDetailData
        );
      }
    } catch(error) {

    }

    setFetching(false);
  }

  function getDetailTotalTaxesById(taxId) {
    let totalTaxes = 0;

    forEach(entityDetailData, (saleDetail) => {
      forEach(saleDetail.taxesData, (taxDetail) => {
        if (taxId === taxDetail.taxId) {
          if (taxDetail.isPercentage === 1) {
            totalTaxes += (((saleDetail.quantity * saleDetail.unitPrice) / (1 + +taxDetail.taxRate)) * +taxDetail.taxRate);
          } else {
            totalTaxes += (saleDetail.quantity * ++taxDetail.taxRate);
          }
        }
      });
    });

    return totalTaxes || 0;
  }

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={null}
          title={`${`${entityData[0]?.documentTypeName} #${entityData[0]?.docNumber}` || ''}`}
          subTitle={`${entityData[0]?.serie}`}
          style={{ padding: 0 }}
          extra={[
            <Button
              type="primary"
              icon={<PrinterFilled />}
              onClick={() => {
                rePrintSale();
              }}
            >Imprimir</Button>,
            !entityData[0]?.isVoided ? <Button
              // type="primary"
              danger
              icon={<DeleteOutlined color='red' />}
              onClick={() => {
                setOpenVoidConfirmation(true);
              }}
            >Anular</Button> : <></>,
            <Button
              // type="primary"
              danger
              icon={<SyncOutlined />}
              onClick={() => {
                loadData();
              }}
            />,
            <Button
              type="primary"
              danger
              icon={<CloseOutlined />}
              onClick={() => {
                onClose(wasVoided);
              }}
            />
          ]}
        />
      }
      centered
      bodyStyle={{ padding: 15 }}
      width={650}
      closeIcon={<></>}
      onCancel={() => onClose(wasVoided)}
      maskClosable={false}
      open={open}
      footer={null}
    >
      {
        isEmpty(entityData) || isEmpty(entityDetailData) ? <Result>
          <Result
            status="warning"
            title={<p style={{ color: '#FAAD14' }}>{fetching ? 'Cargando...' : 'No se pudo obtener información de esta venta'}</p>}
            extra={
              <Button
                type="primary"
                key="console"
                onClick={() => {
                  onClose(wasVoided);
                }}
              >
                Cerrar
              </Button>
            }
          />
        </Result> : <Row gutter={[8, 16]}>
          <Col span={24}>
            <Descriptions
              bordered
              labelStyle={{ fontSize: 10, padding: '3px 5px', margin: 0, backgroundColor: '#f0f0f0', border: '1px solid #bfbfbf' }}
              contentStyle={{ fontSize: 12, padding: '3px 5px', margin: 0, border: '1px solid #bfbfbf' }}
              style={{ width: '100%' }}
              size={'small'}
            >
              <Descriptions.Item label="Fecha" span={3}>{moment(entityData[0]?.docDatetime).format('LL') || ''}</Descriptions.Item>
              <Descriptions.Item label="Cliente" span={3}>{entityData[0]?.customerFullname || ''}</Descriptions.Item>
              <Descriptions.Item label="Dirección" span={3}>{entityData[0]?.customerAddress || ''}</Descriptions.Item>
              {!(entityData[0]?.documentTypeId === 1 || entityData[0]?.documentTypeId === 2) ? <Descriptions.Item label="Departamento" span={1}>{entityData[0]?.customerDepartmentName || ''}</Descriptions.Item> : <></>}
              {!(entityData[0]?.documentTypeId === 1 || entityData[0]?.documentTypeId === 2) ? <Descriptions.Item label="Municipio" span={1}>{entityData[0]?.customerCityName || ''}</Descriptions.Item> : <></>}
              {!(entityData[0]?.documentTypeId === 1 || entityData[0]?.documentTypeId === 2) ? <Descriptions.Item label="Giro" span={1}>{entityData[0]?.customerBusinessLine || ''}</Descriptions.Item> : <></>}
              <Descriptions.Item label="DUI" span={1}>{entityData[0]?.customerDui || ''}</Descriptions.Item>
              <Descriptions.Item label="NIT" span={1}>{entityData[0]?.customerNit || ''}</Descriptions.Item>
              {!(entityData[0]?.documentTypeId === 1 || entityData[0]?.documentTypeId === 2) ? <Descriptions.Item label="NRC" span={1}>{entityData[0]?.customerNrc || ''}</Descriptions.Item> : <></>}
              <Descriptions.Item label="Pago" span={2}>{entityData[0]?.paymentTypeName || ''}</Descriptions.Item>
              <Descriptions.Item label="Estado" span={1}>
                <Tag color={paymentStatusColor(entityData[0]?.paymentStatus)}>{entityData[0]?.paymentStatusName || ''}</Tag>
              </Descriptions.Item>
              {
                entityData[0]?.paymentStatus !== 1 && entityData[0]?.paymentTypeId === 2 ? (
                  <>
                    <Descriptions.Item label="Plazo" span={1}>
                      {`${entityData[0]?.expirationDays} días` || ''}
                    </Descriptions.Item>
                    <Descriptions.Item label="Vencimiento" span={1}>
                      {`${entityData[0]?.expirationInformation}` || ''}
                    </Descriptions.Item>
                  </>
                ) : <></>
              }
            </Descriptions>
          </Col>
          <Col span={24}>
            <Table
              bordered
              size='small'
              columns={[
                columnDef({ title: 'Cantidad', dataKey: 'quantity', fSize: 11 }),
                columnDef({title: 'Descripcion', dataKey: 'productName', fSize: 11}),
                columnMoneyDef({
                  title: 'Precio Unitario',
                  dataKey: (entityData[0]?.documentTypeId === 1 || entityData[0]?.documentTypeId === 2) ? 'unitPrice' : 'unitPriceNoTaxes',
                  showDefaultString: true, fSize: 11
                }),
                columnMoneyDef({title: 'Exento', dataKey: 'noTaxableSubTotal', showDefaultString: true, fSize: 11}),
                columnMoneyDef({
                  title: 'Gravado',
                  fSize: 11,
                  dataKey: (entityData[0]?.documentTypeId === 1 || entityData[0]?.documentTypeId === 2) ? 'taxableSubTotal' : 'taxableSubTotalWithoutTaxes', showDefaultString: true}),
              ]}
              rowKey={'id'}
              dataSource={[
                ...entityDetailData,
              ] || []}
              pagination={false}
              loading={fetching}
            />
          </Col>
          <Col span={12}>
            <Descriptions
              bordered
              style={{ width: '100%' }}
              labelStyle={{ fontSize: 10, padding: '3px 5px', margin: 0, backgroundColor: '#f0f0f0', border: '1px solid #bfbfbf' }}
              contentStyle={{ fontSize: 12, padding: '3px 5px', margin: 0, border: '1px solid #bfbfbf' }}
              size={'small'}
            >
              <Descriptions.Item label="SON" span={3}>
                {`${numberToLetters(entityData[0]?.total)}`}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <Descriptions
              bordered
              style={{ width: '100%' }}
              labelStyle={{ fontSize: 10, padding: '3px 5px', margin: 0, backgroundColor: '#f0f0f0', border: '1px solid #bfbfbf', textAlign: 'right' }}
              contentStyle={{ fontSize: 12, padding: '3px 5px', margin: 0, border: '1px solid #bfbfbf', textAlign: 'right' }}
              size={'small'}
            >
              <Descriptions.Item label="GRAVADO" span={3}>
                {`$${
                  (entityData[0]?.documentTypeId === 1 || entityData[0]?.documentTypeId === 2)
                    ? entityData[0]?.taxableSubTotal || 0 
                    : entityData[0]?.taxableSubTotalWithoutTaxes || 0
                }`}
              </Descriptions.Item>
              {
                !(entityData[0]?.documentTypeId === 1 || entityData[0]?.documentTypeId === 2) ? taxesData.map((element, index) => {
                  let dataValue = getDetailTotalTaxesById(element.id).toFixed(2);
                  return (
                    <Descriptions.Item key={index} label={`${element.name}`} span={3}>{`$${dataValue}`}</Descriptions.Item>
                  );
                }) : <></>
              }
              <Descriptions.Item label="SUBTOTAL" span={3}>
                {`$${entityData[0]?.taxableSubTotal}`}
              </Descriptions.Item>
              <Descriptions.Item label="EXENTO" span={3}>
                {`$${entityData[0]?.noTaxableSubTotal}`}
              </Descriptions.Item>
              <Descriptions.Item label="TOTAL" span={3}>
                {`$${entityData[0]?.total}`}
              </Descriptions.Item>
            </Descriptions>
            <Descriptions bordered style={{ width: '100%' }} size={'small'}>
              <Descriptions.Item label="Registrada por" span={3}>{entityData[0]?.createdByFullname || ''}</Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      }
      <div style={{ height: '20px' }} />
     
      {/* <div style={{ display: 'none' }}>
        <ReactToPrint
          trigger={() => <Button id="reprint-sale-ticket-button" key="1" size={'small'} type={'primary'} icon={<PrinterOutlined />}>Imprimir</Button>}
          content={() => ticketComponentRef.current}
        />
        <SaleTicket ref={ticketComponentRef} ticketData={entityData[0] || {}} ticketDetail={entityDetailData || []} />
        <ReactToPrint
          trigger={() => <Button id="reprint-sale-cf-button" key="2" size={'small'} type={'primary'} icon={<PrinterOutlined />}>Imprimir</Button>}
          content={() => cfComponentRef.current}
        />
        <ConsumidorFinal ref={cfComponentRef} ticketData={entityData[0] || {}} ticketDetail={entityDetailData || []} />
        <ReactToPrint
          trigger={() => <Button id="reprint-sale-ccf-button" key="3" size={'small'} type={'primary'} icon={<PrinterOutlined />}>Imprimir</Button>}
          content={() => ccfComponentRef.current}
        />
        <SaleTicket ref={ccfComponentRef} ticketData={entityData[0] || {}} ticketDetail={entityDetailData || []} />
      </div> */}
      <AuthorizeAction
        open={openVoidConfirmation}
        allowedRoles={[1]}
        title={`Anular Venta Cod Int #${saleId}`}
        confirmButtonText={'Confirmar anulación'}
        onClose={(authorized, userAuthorizer) => {
          const { successAuth } = userAuthorizer;
          if (authorized, successAuth) {
            const { userId } = userAuthorizer;
            voidSale(userId);
            loadData();
          }
          setOpenVoidConfirmation(false);
        }}
      />
    </Modal>
  )
}

export default SalePreview;
