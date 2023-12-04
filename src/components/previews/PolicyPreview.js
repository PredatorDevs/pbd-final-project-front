import React, { useState, useEffect, useRef } from 'react';
import { Col, Row, Divider, PageHeader, Modal, Statistic, Card, Descriptions, List, Button } from 'antd';
import { CloseOutlined, DeleteOutlined, TagsOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import moment from 'moment';
import 'moment/locale/es-mx';
import ReactToPrint from 'react-to-print';

import salesServices from '../../services/SalesServices.js';
import { customNot } from '../../utils/Notifications.js';
import policiesServices from '../../services/PoliciesServices.js';
import AuthorizeAction from '../confirmations/AuthorizeAction.js';

function PolicyPreview(props) {
  const [fetching, setFetching] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [entityDetailData, setEntityDetailData] = useState([]);
  const [wasVoided, setWasVoided] = useState(false);
  const [openVoidConfirmation, setOpenVoidConfirmation] = useState(false);

  const { open, policyId, onClose } = props;

  const componentRef = useRef();

  function loadData() {
    if (policyId)
      policiesServices.findById(policyId)
      .then((response) => {
        setEntityData(response.data);
        setFetching(false);
      }).catch((error) => {
        customNot('error', 'Información de póliza no encontrada', 'Revise conexión')
        setFetching(false);
      });
  }

  useEffect(() => {
    loadData();
  }, [ policyId ]);

  function voidPolicy(userId) {
    setFetching(true);
    policiesServices.voidPolicy(userId, policyId)
    .then((response) => {
      customNot('info', 'Póliza anulada', 'Acción exitosa');
      setWasVoided(true);
      onClose(true);
    })
    .catch((error) => {
      setFetching(false);
      customNot('error', 'Algo salió mal', 'La Póliza no fue anulada');
    })
  }

  return (
    <Modal
      title={
        <PageHeader
          onBack={() => null}
          backIcon={<TagsOutlined />}
          title={`Póliza ${isEmpty(entityData) ? '' : `#${entityData[0][0].docNumber}` || ''}`}
          subTitle={`${isEmpty(entityData) ? '' : entityData[0][0].isVoided ? 'Anulada' : ''}`}
          extra={[
            isEmpty(entityData) ? 
              <></> : 
              entityData[0][0].isVoided ? 
                <></> : 
                <Button key="1" size={'small'} type={'primary'} danger icon={<DeleteOutlined />} onClick={() => setOpenVoidConfirmation(true)}>Anular</Button>
            // <ReactToPrint
            //   trigger={() => <Button key="1" size={'small'} type={'primary'} icon={<PrinterOutlined />}>Imprimir</Button>}
            //   content={() => componentRef.current}
            // />,
            // isEmpty(entityData) ? 
            //   <></> : 
            //   entityData[0].isVoided ? 
            //     <></> : 
            //     <Button key="2" size={'small'} type={'primary'} danger icon={<DeleteOutlined />} onClick={() => setOpenVoidConfirmation(true)}>Anular</Button>,
            // <Button key="3" size={'small'} icon={<SyncOutlined />} onClick={() => loadData()} />,
            // fetching ? <Spin /> : <></>
            // <Button type={'primary'} danger size={'small'}>Anular</Button>
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
      <Descriptions bordered size='small'>
        <Descriptions.Item label="Proveedor">{`${isEmpty(entityData) ? '' : `${entityData[0][0].supplier}` || ''}`}</Descriptions.Item>
      </Descriptions>
      <Divider>Valores totales</Divider>
      <Descriptions layout="vertical" bordered size='small'>
        <Descriptions.Item label="Valor Transacción">{`${isEmpty(entityData) ? '' : `$${entityData[0][0].transactionValue}` || ''}`}</Descriptions.Item>
        <Descriptions.Item label="Gastos Transporte">{`${isEmpty(entityData) ? '' : `$${entityData[0][0].transportationCost}` || ''}`}</Descriptions.Item>
        <Descriptions.Item label="Gastos Seguro">{`${isEmpty(entityData) ? '' : `$${entityData[0][0].insuranceCost}` || ''}`}</Descriptions.Item>
        <Descriptions.Item label="Valor Total Aduana">{`${isEmpty(entityData) ? '' : `$${entityData[0][0].customTotalValue}` || ''}`}</Descriptions.Item>
        <Descriptions.Item label="Incoterm">{`${isEmpty(entityData) ? '' : `$${entityData[0][0].incoterm}` || ''}`}</Descriptions.Item>
        <Descriptions.Item label="Tasa de Cambio">{`${isEmpty(entityData) ? '' : `${entityData[0][0].exchangeRate}` || ''}`}</Descriptions.Item>
      </Descriptions>
      <Divider>Mercancía</Divider>
      {
        isEmpty(entityData) ? <></> : (
          <List
            itemLayout="horizontal"
            dataSource={entityData[1] || [{}]}
            rowKey={'policyDetailId'}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title={<a href="https://ant.design">{item.productName}</a>}
                  description={`${item.quantity} ${item.measurementUnitName}`}
                />
                <div>{`$${Number((item.quantity || 0) * (item.unitCost || 0)).toFixed(2)}`}</div>
              </List.Item>
            )}
          />
        )
      }
      <Divider style={{ color: 'white' }}>Totales</Divider>
      <Row gutter={[10, 10]}>
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
          <Card bodyStyle={{ backgroundColor: '#3E4057', borderRadius: 5 }} size={'small'}>
            <Statistic 
              title={<p style={{ color: '#FFF', margin: 0 }}>Valores Totales</p>}
              prefix={'$'} 
              precision={2} 
              value={isEmpty(entityData) ? '' : `${entityData[0][0].totalValues}`} 
              valueStyle={{ color: '#FFF' }} 
            />
          </Card>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
          <Card bodyStyle={{ backgroundColor: '#3E4057', borderRadius: 5 }} size={'small'}>
            <Statistic 
              title={<p style={{ color: '#FFF', margin: 0 }}>Total Mercancía</p>}
              prefix={'$'} 
              precision={2} 
              value={isEmpty(entityData) ? '' : isEmpty(entityData[1][0]) ? '' : `${entityData[1][0].quantity * entityData[1][0].unitCost}`}
              valueStyle={{ color: '#FFF' }} 
            />
          </Card>
        </Col>
      </Row>
      <AuthorizeAction
        open={openVoidConfirmation}
        allowedRoles={[1]}
        title={`Anular póliza #${isEmpty(entityData) ? '' : `#${entityData[0][0].docNumber}` || ''}`}
        confirmButtonText={'Confirmar anulación'}
        onClose={(authorized, userAuthorizer) => {
          const { successAuth } = userAuthorizer;
          if (authorized, successAuth) {
            const { userId } = userAuthorizer;
            voidPolicy(userId);
          }
          setOpenVoidConfirmation(false);
        }}
      />
    </Modal>
  )
}

export default PolicyPreview;
