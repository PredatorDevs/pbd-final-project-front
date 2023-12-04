import React, { useState, useEffect } from 'react';
import { Col, Row, Modal, Result, Descriptions, Badge, List, Avatar, Button, Divider } from 'antd';
import { CheckCircleOutlined, CloseOutlined, DeleteOutlined, QuestionCircleOutlined, WarningOutlined } from '@ant-design/icons';
import 'moment/locale/es-mx';
import parkingCheckoutsServices from '../../services/ParkingCheckoutsServices';
import { isEmpty } from 'lodash';
import moment from 'moment';
import 'moment/locale/es-mx';
import parkingExpensesServices from '../../services/ParkingExpensesServices';
import { getUserId } from '../../utils/LocalData';

const { confirm } = Modal;

function ParkingExpensePreview(props) {
  const [fetching, setFetching] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [entityDetailData, setEntityDetailData] = useState([]);
  const [reloadAtClose, setReloadAtClose] = useState(false);

  const { open, parkingExpenseId, onClose } = props;

  async function loadData() {
    if (parkingExpenseId) {
      setFetching(true);
      try {
        const response = await parkingExpensesServices.findById(parkingExpenseId);

        setEntityData(response.data);
        setFetching(false);  
      } catch(error) {
        setFetching(false);
      }
    }
  }

  useEffect(() => {
    console.log(parkingExpenseId);
    loadData();
  }, [ parkingExpenseId ]);

  async function voidExpenseAction() {
    if (parkingExpenseId) {
      confirm({
        title: '¿Desea eliminar este gasto?',
        centered: true,
        icon: <WarningOutlined />,
        content: `Será eliminado de la lista de gastos`,
        okText: 'Confirmar',
        okType: 'danger',
        cancelText: 'Cancelar',
        async onOk() {
          try {
            const response = await parkingExpensesServices.voidById(getUserId(), parkingExpenseId);
    
            if (response.status === 200) {
              setFetching(false);
              onClose(true);
              return;
            }
    
            setFetching(false);  
          } catch(error) {
            setFetching(false);
          }
        },
        onCancel() {},
      });
    }
  }

  return (
    <Modal
      centered
      width={650}
      closeIcon={<CloseOutlined style={{ padding: 5, backgroundColor: '#f0f0f0', borderRadius: 5, color: '#f5222d' }} />}
      onCancel={() => {
        setEntityData([]);
        setEntityDetailData([]);
        setReloadAtClose(false);
        onClose(reloadAtClose);
      }}
      maskClosable={false}
      open={open}
      footer={null}
    >
      <div style={{ height: 30 }}/>
      {
        !isEmpty(entityData) ?
        <Row
          gutter={[16, 16]}
        >
          <Col span={24}>
            <Descriptions bordered style={{ width: '100%' }} labelStyle={{ fontSize: 12 }} contentStyle={{ fontWeight: 600, fontSize: 12 }} size={'small'}>
              <Descriptions.Item label="Código" span={1}>{entityData[0].parkingExpenseId || 0}</Descriptions.Item>
              <Descriptions.Item label="Fecha" span={2}>{moment(entityData[0].documentDatetime).format('LLL') || ''}</Descriptions.Item>
              <Descriptions.Item label="N° Documento" span={3}>{entityData[0].documentNumber || ''}</Descriptions.Item>
              <Descriptions.Item label="Concepto" span={3}>{entityData[0].concept || 0}</Descriptions.Item>
              <Descriptions.Item label="Descripción" span={3}>{entityData[0].description || 0}</Descriptions.Item>
              <Descriptions.Item label="Monto" span={3}>{`$${entityData[0].amount}` || ''}</Descriptions.Item>
              <Descriptions.Item label="Tipo" span={1}>{entityData[0].expenseTypeName || ''}</Descriptions.Item>
              <Descriptions.Item label="Pago" span={1}>{entityData[0].paymentMethodName || ''}</Descriptions.Item>
              <Descriptions.Item label="" span={1}>{''}</Descriptions.Item>
              <Descriptions.Item label="Cuenta" span={3}>{entityData[0].accountCode || ''}</Descriptions.Item>
              <Descriptions.Item label="Registrado por" span={3}>{entityData[0].createdByFullname || ''}</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={24}>
            <Button type="danger" size={'small'} icon={<DeleteOutlined />} onClick={(e) => voidExpenseAction()}>
              Eliminar
            </Button>
          </Col>
        </Row>
        :
        <Result
          status="info"
          title={<p style={{ color: '#434343' }}>{`${fetching ? "Cargando..." : "No se ha encontrado información sobre el gasto de control de parqueos"}`}</p>}
          subTitle={<p style={{ color: '#434343' }}>{`${fetching ? "Esto no debe tomar más de un momento" : "Vuelva a intentar más tarde"}`}</p>}
        />
      }
    </Modal>
  )
}

export default ParkingExpensePreview;
