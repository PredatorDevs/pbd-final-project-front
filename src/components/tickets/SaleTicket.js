import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import orderSalesServices from "../../services/OrderSalesServices";
import { TicketWrapper } from "../../styled-components/TicketWrapper";
import moment from 'moment';
import 'moment/locale/es-mx';
import { isEmpty } from "lodash";

class SaleTicket extends React.Component {
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
        {/* <p className='header'>Todo Para Cakes</p> */}
        <p className="description">{`${ticketData.locationName || '-'}`}</p>
        <p className="description">{`Venta #${ticketData.docNumber || '-'}`}</p>
        {/* <p className="description">Giro: Producción y distribución agua purificada</p> */}
        <div className="divider" />
        <Row gutter={8}>
          <Col span={8}><p className="col-body-left">{`Fecha:`}</p></Col>
          <Col span={16}><p className="col-body-right">{`${moment(isEmpty(ticketData) ? '1999-01-01 00:00:00' : ticketData.docDatetime).format('L LT') || '-'}`}</p></Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}><p className="col-body-left">{`Cliente:`}</p></Col>
          <Col span={16}><p className="col-body-right">{`${ticketData.customerFullname || '-'}`}</p></Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}><p className="col-body-left">{`Tipo:`}</p></Col>
          <Col span={16}><p className="col-body-right">{`${ticketData.documentTypeName || '-'}`}</p></Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}><p className="col-body-left">{`Registra:`}</p></Col>
          <Col span={16}><p className="col-body-right">{`${ticketData.createdByFullname || '-'}`}</p></Col>
        </Row>
        <div className="divider"/>
        {
          (ticketDetail || []).map((element, index) => (
            <Row gutter={8} key={index}>
              <Col span={24}>
                <p className="col-body-left">{element.productName}</p>
              </Col>
              <Col span={12} style={{ display: 'flex', flexDirection: 'row' }}>
                <p className="col-body-left">{`${Number((element.quantity || 0)).toFixed(0)} X $${Number((element.unitPrice || 0.00)).toFixed(2)}`}</p>
              </Col>
              <Col span={12}><p className="col-body-right">{`$${Number((element.subTotal || 0.00)).toFixed(2)}`}</p></Col>
            </Row>
          ))
        }
        <div className="divider" />
        <Row gutter={8}>
          <Col span={18}><p className="col-body-left">{`Venta total:`}</p></Col>
          <Col span={6}><p className="col-body-right">{`$${Number((ticketData.total || 0.00)).toFixed(2)}`}</p></Col>
        </Row>
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

export default SaleTicket;