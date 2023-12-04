import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import orderSalesServices from "../../services/OrderSalesServices";
import { TicketWrapper } from "../../styled-components/TicketWrapper";
import moment from 'moment';
import 'moment/locale/es-mx';
import { isEmpty } from "lodash";
import { CFFInvoiceWrapper } from "../../styled-components/CFFInvoiceWrapper";

class CFFInvoice extends React.Component {
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
      <CFFInvoiceWrapper>
        <Row gutter={0} style={{ marginTop: '138px' }}>
          <Col span={24} style={{ display: 'flex', flexDirection: 'row' }}>
            <p style={{ margin: 0, marginLeft: '74px', maxWidth: '230px', fontSize: 16}}>{`${ticketData.customerFullname || '-'}`}</p>
            <p style={{ margin: 0, textAlign: 'right', marginLeft: '41px', marginRight: '26px', maxWidth: '136px', fontSize: 16}}>{`${moment(isEmpty(ticketData) ? '1999-01-01' : ticketData.docDatetime).format('L') || '-'}`}</p>
          </Col>
        </Row>
        <Row gutter={0} style={{ marginTop: '14px' }}>
          <Col span={24} style={{ display: 'flex', flexDirection: 'row' }}>
            <p style={{ margin: 0, marginLeft: '87px', maxWidth: '219px', fontSize: 16}}>{`${ticketData.customerFullname || '-'}`}</p>
            <p style={{ margin: 0, textAlign: 'right', marginLeft: '41px', marginRight: '26px', maxWidth: '98px', fontSize: 16}}>{`${moment(isEmpty(ticketData) ? '1999-01-01' : ticketData.docDatetime).format('L') || '-'}`}</p>
          </Col>
        </Row>
        
      </CFFInvoiceWrapper>
    )
  }
}

export default CFFInvoice;
