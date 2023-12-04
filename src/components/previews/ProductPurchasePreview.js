import React, { useState, useEffect, useRef } from 'react';
import { Col, Row, Button, PageHeader, Modal, Descriptions, Table, Tag, Result } from 'antd';
import { CloseOutlined,  DeleteOutlined,  FileOutlined, PrinterTwoTone } from '@ant-design/icons';
import { find, forEach, isEmpty } from 'lodash';
import moment from 'moment';
import 'moment/locale/es-mx';
import ReactToPrint from 'react-to-print';

import salesServices from '../../services/SalesServices.js';
import { columnDef, columnMoneyDef } from '../../utils/ColumnsDefinitions.js';
import AuthorizeAction from '../confirmations/AuthorizeAction.js';
import ConsumidorFinal from '../invoices/ConsumidorFinal.js';
import generalsServices from '../../services/GeneralsServices.js';
import productPurchasesServices from '../../services/ProductPurchasesServices.js';
import { numberToLetters } from '../../utils/NumberToLetters.js';

function ProductPurchasePreview(props) {
  const [fetching, setFetching] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [entityDetailData, setEntityDetailData] = useState([]);
  const [wasVoided, setWasVoided] = useState(false);
  const [openVoidConfirmation, setOpenVoidConfirmation] = useState(false);

  const [taxesData, setTaxesData] = useState([]);

  const { open, productPurchaseId, onClose } = props;

  const ticketComponentRef = useRef();
  const cfComponentRef = useRef();
  const ccfComponentRef = useRef();

  function paymentStatusColor(status) {
    switch(status) {
      case 1: return 'green';
      case 2: return 'orange';
      case 3: return 'red';
      default: return 'gray';
    }
  }

  async function loadData() {
    setFetching(true);
    try {
      const saleRes = await productPurchasesServices.findById(productPurchaseId);
      setEntityData(saleRes.data);
      const saleDetRes = await productPurchasesServices.details.findByProductPurchaseId(productPurchaseId);
      setEntityDetailData(saleDetRes.data);
      const taxesResponse = await generalsServices.findTaxes();
      setTaxesData(taxesResponse.data);
    } catch (error) {
      console.log(error);
    }
    setFetching(false);
  }

  useEffect(() => {
    loadData();
  }, [ productPurchaseId ]);

  async function voidProductPurchaseAction(userId) {
    setFetching(true);
    try {
      if (productPurchaseId !== null && productPurchaseId > 0) {
        await productPurchasesServices.voidProductPurchase(userId, productPurchaseId);
        onClose(true);
      }
    } catch(error) {
      console.log(error);
    }
    setFetching(false);
  }

  function getDetailTotalTaxesById(taxId) {
    let totalTaxes = 0;

    forEach(entityDetailData, (productPurchaseDetail) => {
      forEach(productPurchaseDetail.taxesData, (taxDetail) => {
        if (taxId === taxDetail.taxId) {
          if (taxDetail.isPercentage === 1) {
            totalTaxes += ((productPurchaseDetail.quantity * productPurchaseDetail.unitCost)  * +taxDetail.taxRate);
          } else {
            totalTaxes += (productPurchaseDetail.quantity * ++taxDetail.taxRate);
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
          backIcon={<FileOutlined />}
          title={`${`${entityData[0]?.documentTypeName} #${entityData[0]?.documentNumber}` || ''}`}
          subTitle={`${entityData[0]?.documentSerie}`}
          extra={[
            <Button
              // type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                setOpenVoidConfirmation(true);
              }}
            >
              Anular
            </Button>,
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
        </Result> : <Row gutter={[16, 16]}>
          <Col span={24}>
            <Descriptions
              bordered
              labelStyle={{ fontSize: 10, padding: '3px 5px', margin: 0, backgroundColor: '#f0f0f0', border: '1px solid #bfbfbf' }}
              contentStyle={{ fontSize: 12, padding: '3px 5px', margin: 0, border: '1px solid #bfbfbf' }}
              style={{ width: '100%' }}
              size={'small'}
            >
              <Descriptions.Item label="Fecha" span={3}>{moment(entityData[0]?.documentDatetime).format('LL') || ''}</Descriptions.Item>
              <Descriptions.Item label="Proveedor" span={3}>{entityData[0]?.supplierName || ''}</Descriptions.Item>
              <Descriptions.Item label="Dirección" span={3}>{entityData[0]?.supplierAddress || ''}</Descriptions.Item>
              <Descriptions.Item label="DUI" span={1}>{entityData[0]?.supplierDui || ''}</Descriptions.Item>
              <Descriptions.Item label="NIT" span={1}>{entityData[0]?.supplierNit || ''}</Descriptions.Item>
              <Descriptions.Item label="NRC" span={1}>{entityData[0]?.supplierNrc || ''}</Descriptions.Item>
              <Descriptions.Item label="Giro" span={1}>{entityData[0]?.supplierDui || ''}</Descriptions.Item>
              <Descriptions.Item label="Pago" span={1}>{entityData[0]?.paymentTypeName || ''}</Descriptions.Item>
              {
                /*
                WHEN prmt_status = 1 THEN "Pagada"
                WHEN prmt_status = 2 THEN "Parcial"
                WHEN prmt_status = 3 THEN "Pendiente"
                */
              }
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
              size='small'
              columns={[
                columnDef({title: 'Cantidad', dataKey: 'quantity'}),
                columnDef({title: 'Detalle', dataKey: 'productName'}),
                columnMoneyDef({
                  title: 'Costo Unitario',
                  dataKey: 'unitCost',
                  showDefaultString: true, fSize: 11
                }),
                columnMoneyDef({title: 'Exento', dataKey: 'noTaxableSubTotal', showDefaultString: true, fSize: 11}),
                columnMoneyDef({
                  title: 'Gravado',
                  fSize: 11,
                  dataKey: 'taxableSubTotal', showDefaultString: true}),
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
                {`$${entityData[0]?.taxableSubTotal || 0}`}
              </Descriptions.Item>
              {/* {
                taxesData.map((element, index) => {
                  let dataValue = getDetailTotalTaxesById(element.id).toFixed(2);
                  return (
                    <Descriptions.Item key={index} label={`${element.name}`} span={3}>{`$${dataValue}`}</Descriptions.Item>
                  );
                })
              } */}
              {
                !(entityData[0]?.documentTypeId === 1 || entityData[0]?.documentTypeId === 2) ? taxesData.map((element, index) => {
                  let dataValue = getDetailTotalTaxesById(element.id).toFixed(2);
                  return (
                    <Descriptions.Item key={index} label={`${element.name}`} span={3}>{`$${dataValue}`}</Descriptions.Item>
                  );
                }) : <></>
              }
              <Descriptions.Item label="SUBTOTAL" span={3}>
                {`$${
                  (entityData[0]?.documentTypeId === 1 || entityData[0]?.documentTypeId === 2)
                    ? entityData[0]?.taxableSubTotal || 0 
                    : (+entityData[0]?.taxableSubTotal + +entityData[0]?.totalTaxes) || 0
                }`}
              </Descriptions.Item>
              <Descriptions.Item label="EXENTO" span={3}>
                {`$${entityData[0]?.noTaxableSubTotal}`}
              </Descriptions.Item>
              <Descriptions.Item label="IVA PERCIBIDO (+)" span={3}>
                {`$${entityData[0]?.IVAperception}`}
              </Descriptions.Item>
              <Descriptions.Item label="IVA RETENIDO (-)" span={3}>
                {`$${entityData[0]?.IVAretention}`}
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

      {/* <div style={{ height: '20px' }} />
      
      <div style={{ display: 'none' }}>
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
        title={`Anular ${`${entityData[0]?.documentTypeName} #${entityData[0]?.documentNumber}` || ''}`}
        confirmButtonText={'Confirmar anulación'}
        onClose={(authorized, userAuthorizer) => {
          const { successAuth } = userAuthorizer;
          if (authorized, successAuth) {
            const { userId } = userAuthorizer;
            voidProductPurchaseAction(userId);
          }
          setOpenVoidConfirmation(false);
        }}
      />
    </Modal>
  )
}

export default ProductPurchasePreview;
