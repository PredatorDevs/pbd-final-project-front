import React, { useState, useEffect } from 'react';
import { Col, Row, Modal, Result, Descriptions, Badge, List, Avatar, Button, Divider } from 'antd';
import { CheckCircleOutlined, CloseOutlined, DeleteOutlined, QuestionCircleOutlined, WarningOutlined } from '@ant-design/icons';
import 'moment/locale/es-mx';
import parkingCheckoutsServices from '../../services/ParkingCheckoutsServices';
import { isEmpty } from 'lodash';
import moment from 'moment';
import 'moment/locale/es-mx';
import { getUserId } from '../../utils/LocalData';

const { confirm } = Modal;

function ParkingCheckoutPreview(props) {
  const [fetching, setFetching] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [entityDetailData, setEntityDetailData] = useState([]);
  const [reloadAtClose, setReloadAtClose] = useState(false);

  const { open, parkingCheckoutId, onClose } = props;

  async function loadData() {
    if (parkingCheckoutId) {
      setFetching(true);
      const response = await parkingCheckoutsServices.findById(parkingCheckoutId);
      const response2 = await parkingCheckoutsServices.pendingTickets.findByParkingCheckoutId(parkingCheckoutId);

      setEntityData(response.data);
      setEntityDetailData(response2.data);
      setFetching(false);
    }
  }

  async function checkoutPendingTicket(pendingTicketId) {
    if (pendingTicketId) {
      setFetching(true);
      
      const response = await parkingCheckoutsServices.pendingTickets.checkoutPendingById(pendingTicketId);

      if (response.status === 200) {
        setReloadAtClose(true);
        loadData();
      }
      setFetching(false);
    }
  }

  async function voidCheckoutAction() {
    if (parkingCheckoutId) {
      confirm({
        title: '¿Desea eliminar este ingreso?',
        centered: true,
        icon: <WarningOutlined />,
        content: `Será eliminado de la lista de ingresos`,
        okText: 'Confirmar',
        okType: 'danger',
        cancelText: 'Cancelar',
        async onOk() {
          try {
            const response = await parkingCheckoutsServices.voidById(getUserId(), parkingCheckoutId);
    
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

  useEffect(() => {
    loadData();
  }, [ parkingCheckoutId ]);

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
              <Descriptions.Item label="Código" span={1}>{entityData[0].parkingCheckoutId || 0}</Descriptions.Item>
              <Descriptions.Item label="Fecha" span={2}>{moment(entityData[0].checkoutDatetime).format('LLL') || ''}</Descriptions.Item>
              <Descriptions.Item label="Inicial" span={1}>{entityData[0].ticketNumberFrom || 0}</Descriptions.Item>
              <Descriptions.Item label="Final" span={1}>{entityData[0].ticketNumberTo || 0}</Descriptions.Item>
              <Descriptions.Item label="Parq. Usados" span={1}>{entityData[0].numberOfParkings || 0}</Descriptions.Item>
              <Descriptions.Item label="Efectivo entregado" span={2}>{`$${entityData[0].checkoutTotal}` || 0}</Descriptions.Item>
              <Descriptions.Item label="Pendientes" span={1}>
                <Badge count={entityData[0].hasPendingTickets ? entityData[0].pendingTickets : <CheckCircleOutlined style={{ color: '#52c41a' }} />} />
              </Descriptions.Item>
              <Descriptions.Item label="Vigilante" span={3}>{entityData[0].parkingGuardFullname || ''}</Descriptions.Item>
              <Descriptions.Item label="Registrado por" span={3}>{entityData[0].checkoutByFullname || ''}</Descriptions.Item>
              <Descriptions.Item label="Observaciones" span={3}>{entityData[0].notes || 0}</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <List
              itemLayout="horizontal"
              size='small'
              dataSource={entityDetailData}
              renderItem={item => (
                <List.Item
                  actions={[
                    item.status === 1 ? <Button
                      size={'small'}
                      loading={fetching}
                      disabled={fetching}
                      onClick={() => {
                        confirm({
                          title: '¿Desea quitar este ticket de los pendientes?',
                          icon: <QuestionCircleOutlined />,
                          content: '',
                          okText: 'Continuar',
                          okType: 'primary',
                          onOk() {
                            checkoutPendingTicket(item.id);
                          },
                          onCancel() {
                            return;
                          },
                        });
                      }}
                    >
                      Recibir
                    </Button> : null
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor: item.status === 1 ? '#f5222d' : '#52c41a',
                          color: item.status === 1 ? '#ffffff' : '#ffffff'
                        }}
                      >
                        {item.ticketNumber}
                      </Avatar>
                    }
                  />
                </List.Item>
              )}
            />
          </Col>
          <Col span={24}>
            <Button type="danger" size={'small'} icon={<DeleteOutlined />} onClick={(e) => voidCheckoutAction()}>
              Eliminar
            </Button>
          </Col>
        </Row>
        :
        <Result
          status="info"
          title={<p style={{ color: '#434343' }}>{`${fetching ? "Cargando..." : "No se ha encontrado información sobre el control de parqueos"}`}</p>}
          subTitle={<p style={{ color: '#434343' }}>{`${fetching ? "Esto no debe tomar más de un momento" : "Vuelva a intentar más tarde"}`}</p>}
        />
      }
    </Modal>
  )
}

export default ParkingCheckoutPreview;
