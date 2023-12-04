import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import orderSalesServices from "../../services/OrderSalesServices";
import { TicketWrapper } from "../../styled-components/TicketWrapper";
import moment from 'moment';
import 'moment/locale/es-mx';
import { isEmpty } from "lodash";
import shiftcutsService from "../../services/ShiftcutsServices";

class ShiftcutTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ticketData: [] };
  }

  // componentDidMount() {
    
  // }

  render() {
    const { shiftcutId, ticketData } = this.props;
    const { 
      shiftcutNumber,
      cashierName,
      locationName,
      initialAmount,
      cashSales,
      creditSales,
      payments,
      finalAmount,
      remittedAmount,
      openedAt,
      openedByFullname,
      closedAt,
      closedByFullname
    } = ticketData[0] || [];
    return (
      <TicketWrapper>
        {/* <p style={{ fontSize: 22, color: 'red' }}>{shiftcutId || 0}</p> */}
        {/* <p className='header'>Todo Para Cakes</p>
        <p className="description">Ticket pedido</p>
        <p className="description">{`Cierre de turno #${ticketData.id || '-'}`}</p>
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
          <Col span={16}><p className="col-body-right">{`${ticketData.docTypeName || '-'}`}</p></Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}><p className="col-body-left">{`Registra:`}</p></Col>
          <Col span={16}><p className="col-body-right">{`${ticketData.createdByFullname || '-'}`}</p></Col>
        </Row>
        <div className="divider" />
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
          <Col span={18}><p className="col-body-left">{`Total:`}</p></Col>
          <Col span={6}><p className="col-body-right">{`$${Number((ticketData.total || 0.00)).toFixed(2)}`}</p></Col>
        </Row> */}
        <p className="header">AGUA LIMÓN</p>
        <p className="description">{`${locationName}`}</p>
        <p className="description">{`Turno #${shiftcutNumber}`}</p>
        <Row gutter={8}>
          <Col span={24}><p className="col-body-centered">{`${cashierName}`}</p></Col>
          <Col span={12}><p className="col-body-left">{`Apertura:`}</p></Col>
          <Col span={12}><p className="col-body-right">{`${moment(openedAt).format('L LT')}`}</p></Col>
          <Col span={12}><p className="col-body-left">{`Por:`}</p></Col>
          <Col span={12}><p className="col-body-right">{`${openedByFullname}`}</p></Col>
          <Col span={12}><p className="col-body-left">{`Cierre:`}</p></Col>
          <Col span={12}><p className="col-body-right">{`${moment(closedAt).format('L LT')}`}</p></Col>
          <Col span={12}><p className="col-body-left">{`Por:`}</p></Col>
          <Col span={12}><p className="col-body-right">{`${closedByFullname}`}</p></Col>
        </Row>
        <div className="divider" />
        <Row gutter={8}>
          <Col span={18}><p className="col-body-left" style={{ marginLeft: 10 }}>{`Efectivo inicial:`}</p></Col>
          <Col span={6}><p className="col-body-right">{`$${Number(initialAmount || 0).toFixed(2)}`}</p></Col>
        </Row>
        <Row gutter={8}>
          <Col span={18}><p className="col-body-left" style={{ marginLeft: 10 }}>{`(+) Contado:`}</p></Col>
          <Col span={6}><p className="col-body-right">{`$${Number(cashSales || 0).toFixed(2)}`}</p></Col>
        </Row>
        <Row gutter={8}>
          <Col span={18}><p className="col-body-left" style={{ marginLeft: 10 }}>{`(+) Abonos:`}</p></Col>
          <Col span={6}><p className="col-body-right">{`$${Number(payments || 0).toFixed(2)}`}</p></Col>
        </Row>
        <div className="divider" />
        <Row gutter={8}>
          <Col span={18}><p className="col-body-left" style={{ fontWeight: 600 }}>{`Efectivo final:`}</p></Col>
          <Col span={6}><p className="col-body-right" style={{ fontWeight: 600 }}>{`$${Number(finalAmount || 0).toFixed(2)}`}</p></Col>
        </Row>
        <Row gutter={8}>
          <Col span={18}><p className="col-body-left" style={{ marginLeft: 10 }}>{`(-) Remesado:`}</p></Col>
          <Col span={6}><p className="col-body-right">{`$${Number(remittedAmount || 0).toFixed(2)}`}</p></Col>
        </Row>
        <div className="divider" />
        <Row gutter={8}>
          <Col span={18}><p className="col-body-left" style={{ fontWeight: 600 }}>{`Efectivo en caja:`}</p></Col>
          <Col span={6}><p className="col-body-right" style={{ fontWeight: 600 }}>{`$${Number(finalAmount - remittedAmount || 0).toFixed(2)}`}</p></Col>
        </Row>
        <Row gutter={8}>
          <Col span={18}><p className="col-body-left" style={{ fontWeight: 600 }}>{`Créditos:`}</p></Col>
          <Col span={6}><p className="col-body-right" style={{ fontWeight: 600 }}>{`$${Number(creditSales || 0).toFixed(2)}`}</p></Col>
        </Row>
        <div className="divider" />
        <div className="divider" />
        {/* <Row gutter={8}>
          <Col span={12}><p className="col-body-left">{`Atiende: Gustavo`}</p></Col>
          <Col span={12}><p className="col-body-left">{`Hora: XX:XX`}</p></Col>
        </Row> */}
        {/* <div className="divider" /> */}
        {/* <p className="description">{`Resolución N°XXXXX-RES-CR-XXXXX-XXXX`}</p> */}
        {/* <p className="description">{`Fecha de autorización XX/XX/XXXX`}</p> */}
        {/* <p className="description">*Gracias por preferirnos*</p> */}
        
      </TicketWrapper>
    )
  }
}

export default ShiftcutTicket;