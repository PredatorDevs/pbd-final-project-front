import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import orderSalesServices from "../../services/OrderSalesServices";
import { TicketWrapper } from "../../styled-components/TicketWrapper";
import moment from 'moment';
import 'moment/locale/es-mx';
import { isEmpty } from "lodash";

class RawMaterialRequisitionTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ticketData: props.ticketData, ticketDetail: [] };
  }

  componentDidMount(prevProps) {
    // const { ticketData } = this.props;
    // orderSalesServices.details.findByOrderSaleId(ticketData.id || 0)
    // .then((response) => {
    //   this.setState({ ticketDetail: response.data });
    // }).catch((error) => {

    // })
  }

  render() {
    const { ticketData, ticketDetail } = this.props;
    return (
      <TicketWrapper>
        <p className='header'>Todo Para Cakes</p>
        {/* <p className="description">Ticket pedido</p> */}
        <p className="description">{`Requisición Materia Prima #${ticketData.rawMaterialRequisitionId || '-'}`}</p>
        <div className="divider" />
        <Row gutter={8}>
          <Col span={8}><p className="col-body-left">{`Fecha:`}</p></Col>
          <Col span={16}><p className="col-body-right">{`${moment(isEmpty(ticketData) ? '1999-01-01 00:00:00' : ticketData.docDatetime).format('L LT') || '-'}`}</p></Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}><p className="col-body-left">{`Entrega:`}</p></Col>
          <Col span={16}><p className="col-body-right">{`${ticketData.givenByFullname || '-'}`}</p></Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}><p className="col-body-left">{`Recibe:`}</p></Col>
          <Col span={16}><p className="col-body-right">{`${ticketData.receivedByFullname || '-'}`}</p></Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}><p className="col-body-left">{`Registra:`}</p></Col>
          <Col span={16}><p className="col-body-right">{`${ticketData.registeredByFullname || '-'}`}</p></Col>
        </Row>
        <div className="divider" />
        {
          (ticketDetail || []).map((element, index) => (
            <Row gutter={8} key={index}>
              <Col span={5} style={{ display: 'flex', flexDirection: 'row' }}>
                <p className="col-body-left">{`${Number((element.quantity || 0)).toFixed(0)}`}</p>
              </Col>
              <Col span={19}>
                <p className="col-body-left">{element.rawMaterialName}</p>
              </Col>
            </Row>
          ))
        }
        {/* <Row gutter={8}>
          <Col span={18}><p className="col-body-left">{`Ventas Exentas USD:`}</p></Col>
          <Col span={6}><p className="col-body-right">{`1000.00`}</p></Col>
        </Row>
        <Row gutter={8}>
          <Col span={18}><p className="col-body-left">{`Ventas Total USD:`}</p></Col>
          <Col span={6}><p className="col-body-right">{`1000.00`}</p></Col>
        </Row>
        <div className="divider" />
        <Row gutter={8}>
          <Col span={12}><p className="col-body-left">{`Caja #${1}`}</p></Col>
          <Col span={12}><p className="col-body-left">{`Fecha XX/XX/XXXX`}</p></Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}><p className="col-body-left">{`Atiende: Gustavo`}</p></Col>
          <Col span={12}><p className="col-body-left">{`Hora: XX:XX`}</p></Col>
        </Row>
        <div className="divider" />
        <p className="description">{`Resolución N°XXXXX-RES-CR-XXXXX-XXXX`}</p>
        <p className="description">{`Fecha de autorización XX/XX/XXXX`}</p>
        <p className="description">*Gracias por preferirnos*</p>
        <div className="divider" /> */}
        
      </TicketWrapper>
    )
  }
}

export default RawMaterialRequisitionTicket;