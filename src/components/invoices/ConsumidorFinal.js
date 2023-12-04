import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import orderSalesServices from "../../services/OrderSalesServices";
import { TicketWrapper } from "../../styled-components/TicketWrapper";
import moment from 'moment';
import 'moment/locale/es-mx';
import { isEmpty } from "lodash";
import { ConsumidorFinalWrapper } from "../../styled-components/ConsumidorFinalWrapper";

class ConsumidorFinal extends React.Component {
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
      <ConsumidorFinalWrapper>
        <Row gutter={8}>
          <Col span={12}>
            <p className='header'>Todo Para Cakes</p>
          </Col>
          <Col span={12}>
            <p className="header-description">{`${ticketData.documentTypeName || '-'}`}</p>
            <p className="header-description">{`${ticketData.docNumber || '-'}`}</p>
            <p className="header-description">{`Fecha:`}</p>
            <p className="header-description">{`${moment(isEmpty(ticketData) ? '1999-01-01 00:00:00' : ticketData.docDatetime).format('L LT') || '-'}`}</p>
          </Col>
        </Row>
        <div className="divider" />
        <Row gutter={8}>
          <Col span={4}><p className="col-body-left">{`Cliente:`}</p></Col>
          <Col span={20}><p className="col-body-left">{`${ticketData.customerFullname || '-'}`}</p></Col>
          <Col span={4}><p className="col-body-left">{`Tipo:`}</p></Col>
          <Col span={20}><p className="col-body-left">{`${ticketData.paymentTypeName || '-'}`}</p></Col>
          <Col span={4}><p className="col-body-left">{`Registra:`}</p></Col>
          <Col span={20}><p className="col-body-left">{`${ticketData.createdByFullname || '-'}`}</p></Col>
        </Row>
        {/* <p className="dashed-line">{'............................'}</p> */}
        <div className="divider" />
        <Row gutter={8} >
          <Col span={4} style={{ border: '1px solid black'}}>
            <p className="col-body-left">{'Cantidad'}</p>
          </Col>
          <Col span={12} style={{ border: '1px solid black'}}>
            <p className="col-body-left">{`Descripción`}</p>
          </Col>
          <Col span={4} style={{ border: '1px solid black'}}>
            <p className="col-body-right">{`Precio Unitario`}</p>
          </Col>
          <Col span={4} style={{ border: '1px solid black'}}>
            <p className="col-body-right">{`Ventas Afectas`}</p>
          </Col>
        </Row>
        {
          (ticketDetail || []).map((element, index) => (
            // <Row gutter={8} key={index}>
            //   <Col span={24}>
            //     <p className="col-body-left">{element.productName}</p>
            //   </Col>
            //   <Col span={12} style={{ display: 'flex', flexDirection: 'row' }}>
            //     <p className="col-body-left">{`${Number((element.quantity || 0)).toFixed(0)} X $${Number((element.unitPrice || 0.00)).toFixed(2)}`}</p>
            //   </Col>
            //   <Col span={12}><p className="col-body-right">{`$${Number((element.subTotal || 0.00)).toFixed(2)}`}</p></Col>
            // </Row>
            <Row gutter={8}>
              <Col span={4} style={{ border: '1px solid black'}}>
                <p className="col-body-left">{`${Number((element.quantity || 0)).toFixed(0)}`}</p>
              </Col>
              <Col span={12} style={{ border: '1px solid black'}}>
                <p className="col-body-left">{element.productName}</p>
              </Col>
              <Col span={4} style={{ border: '1px solid black'}}>
                <p className="col-body-right">{`$${Number((element.unitPrice || 0.00)).toFixed(2)}`}</p>
              </Col>
              <Col span={4} style={{ border: '1px solid black'}}>
                <p className="col-body-right">{`$${Number((element.subTotal || 0.00)).toFixed(2)}`}</p>
              </Col>
            </Row>
          ))
        }
        {/* <p className="dashed-line">{'............................'}</p> */}
        {/* <div className="divider" /> */}
        <Row gutter={8}>
          <Col span={18} style={{ border: '1px solid black'}}><p className="col-body-left">{`Total:`}</p></Col>
          <Col span={6} style={{ border: '1px solid black'}}><p className="col-body-right">{`$${Number((ticketData.total || 0.00)).toFixed(2)}`}</p></Col>
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
        
      </ConsumidorFinalWrapper>
    )
  }
}

export default ConsumidorFinal;