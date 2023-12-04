import React, { useState, useEffect, useRef } from 'react';
import { Button, PageHeader, Modal, Descriptions, Spin, Table, Tag, Divider, Col, Row } from 'antd';
import { CloseOutlined, DeleteOutlined,  PrinterOutlined, SyncOutlined, TagsOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import moment from 'moment';
import 'moment/locale/es-mx';
import ReactToPrint from 'react-to-print';

import { customNot } from '../../utils/Notifications.js';
import { TableContainer } from '../../styled-components/TableContainer.js';
import { columnDef, columnMoneyDef } from '../../utils/ColumnsDefinitions.js';
import SaleTicket from '../tickets/SaleTicket.js';
import AuthorizeAction from '../confirmations/AuthorizeAction.js';
import productionsServices from '../../services/ProductionsServices.js';
import Production from '../../models/Production.js';
import ProductionTicket from '../tickets/ProductionTicket.js';

import pdfIcon from '../../img/icons/attachments/pdf.png';
import docIcon from '../../img/icons/attachments/doc.png';
import jpgIcon from '../../img/icons/attachments/jpg.png';
import pngIcon from '../../img/icons/attachments/png.png';
import xlsIcon from '../../img/icons/attachments/xls.png';

function ProductionPreview(props) {
  const [fetching, setFetching] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [entityDetailData, setEntityDetailData] = useState([]);
  const [attachmentsData, setAttachmentsData] = useState([]);
  const [wasVoided, setWasVoided] = useState(false);
  const [openVoidConfirmation, setOpenVoidConfirmation] = useState(false);

  const { open, productionId, onClose } = props;

  const componentRef = useRef();

  function loadData() {
    productionsServices.findById(productionId)
    .then((response) => {
      setEntityData(response.data);
      productionsServices.details.findByProductionId(productionId)
      .then((response) => {
        setEntityDetailData(response.data);
        productionsServices.getAttachmentsById(productionId)
        .then((response) => {
          setAttachmentsData(response.data);
          setFetching(false);
        }).catch((error) => {
          customNot('error', 'Información de adjuntos no encontrada', 'Revise conexión')
          setFetching(false);
        });
      }).catch((error) => {
        customNot('error', 'Información de producción no encontrada', 'Revise conexión')
        setFetching(false);
      });
    }).catch((error) => {
      customNot('error', 'Información de producción no encontrada', 'Revise conexión')
      setFetching(false);
    });
  }

  useEffect(() => {
    loadData();
  }, [ productionId ]);

  function voidProduction(userId) {
    setFetching(true);
    productionsServices.voidProduction(userId, productionId)
    .then((response) => {
      customNot('info', 'Producción anulada', 'Acción exitosa');
      setWasVoided(true);
      onClose(true);
    })
    .catch((error) => {
      setFetching(false);
      customNot('error', 'Algo salió mal', 'La producción no fue anulada');
    })
  }

  function getAttachmentIcon(fileExt) {
    switch(fileExt) {
      case 'pdf': return pdfIcon;
      case 'png': return pngIcon;
      case 'jpeg':
      case 'jpg':
        return jpgIcon;
      case 'xls':
      case 'xlsx':
        return xlsIcon;
      case 'doc':
      case 'docx':
        return docIcon;
      default: return pdfIcon;
    }
  }

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={<TagsOutlined />}
          title={`Producción ${isEmpty(entityData) ? '' : `#${entityData[0].docNumber}` || ''}`}
          subTitle={`${isEmpty(entityData) ? '' : entityData[0].isVoided ? 'Anulada' : ''}`}
          extra={[
            <ReactToPrint
              trigger={() => <Button key="1" size={'small'} type={'primary'} icon={<PrinterOutlined />}>Imprimir</Button>}
              content={() => componentRef.current}
            />,
            isEmpty(entityData) ? 
              <></> : 
              entityData[0].isVoided ? 
                <></> : 
                <Button key="2" size={'small'} type={'primary'} danger icon={<DeleteOutlined />} onClick={() => setOpenVoidConfirmation(true)}>Anular</Button>,
            <Button key="3" size={'small'} icon={<SyncOutlined />} onClick={() => loadData()} />,
            fetching ? <Spin /> : <></>
          ]}
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
      {
        isEmpty(entityData) ? <></> : (
          <Descriptions bordered style={{ width: '100%' }} size={'small'}>
            <Descriptions.Item label="Fecha" span={3}>{moment(entityData[0].docDatetime).format('LLL') || ''}</Descriptions.Item>
          </Descriptions>
        )
      }
      <div style={{ height: '20px' }} />
      <TableContainer>
        <Table 
          size='small'
          columns={[
            columnDef({ title: 'Cantidad', dataKey: 'quantity' }),
            columnDef({ title: 'Producto', dataKey: 'productName' }),
            // columnMoneyDef({ title: 'Precio Unitario', dataKey: 'unitCost' }),
            // columnMoneyDef({ title: 'Subtotal', dataKey: 'subTotal' })
          ]}
          dataSource={entityDetailData || []}
          pagination={false}
          loading={fetching}
        />
      </TableContainer>
      <div style={{ height: '20px' }} />
      <Descriptions bordered style={{ width: '100%' }} size={'small'}>
        <Descriptions.Item label="Registrada por" span={3}>{isEmpty(entityData) ? '' : entityData[0].createdByFullname || ''}</Descriptions.Item>
      </Descriptions>
      <Row gutter={[16, 16]}>
        {
          isEmpty(attachmentsData) ? <></> : <>
            <Divider></Divider>
            {
              attachmentsData.map((element, index) => (
                <>
                  <Col span={2} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <img src={getAttachmentIcon(element.fileExtension)} width={35} />
                  </Col>
                  <Col span={22} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <a style={{ margin: 0, fontSize: 12 }} href={element.fileUrl} target={'_blank'}>{element.fileName}</a>
                  </Col>
                </>
              ))
            }
          </>
        }
      </Row>
      <div style={{ display: 'none' }}>
        <ProductionTicket ref={componentRef} ticketData={entityData[0] || {}} ticketDetail={entityDetailData || []} />
      </div>
      <AuthorizeAction
        open={openVoidConfirmation}
        allowedRoles={[1]}
        title={`Anular producción #${isEmpty(entityData) ? '' : `#${entityData[0].docNumber}` || ''}`}
        confirmButtonText={'Confirmar anulación'}
        onClose={(authorized, userAuthorizer) => {
          const { successAuth } = userAuthorizer;
          if (authorized, successAuth) {
            const { userId } = userAuthorizer;
            voidProduction(userId);
          }
          setOpenVoidConfirmation(false);
        }}
      />
    </Modal>
  )
}

export default ProductionPreview;
