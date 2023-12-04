import { Col, Row } from "antd";
import React from "react";
import { TicketWrapper } from "../../styled-components/TicketWrapper";
import moment from 'moment';
import 'moment/locale/es-mx';
import { isEmpty } from "lodash";

class ProductionTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ticketData: props.ticketData, ticketDetail: [] };
  }

  render() {
    const { ticketData, ticketDetail } = this.props;
    return (
      <TicketWrapper>
        <p className='header'>Todo Para Cakes</p>
        <p className="description">{`Producción #${ticketData.docNumber || '-'}`}</p>
        {/* <p className="description">Giro: Producción y distribución agua purificada</p> */}
        <div className="divider" />
        <Row gutter={8}>
          <Col span={8}><p className="col-body-left">{`Fecha:`}</p></Col>
          <Col span={16}><p className="col-body-right">{`${moment(isEmpty(ticketData) ? '1999-01-01 00:00:00' : ticketData.docDatetime).format('L LT') || '-'}`}</p></Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}><p className="col-body-left">{`Registra:`}</p></Col>
          <Col span={16}><p className="col-body-right">{`${ticketData.createdByFullname || '-'}`}</p></Col>
        </Row>
        <div className="divider" />
        {
          (ticketDetail || []).map((element, index) => (
            <Row gutter={8} key={index}>
              <Col span={6}>
                <p className="col-body-left">{element.quantity}</p>
              </Col>
              <Col span={18}>
                <p className="col-body-left">{element.productName}</p>
              </Col>
            </Row>
          ))
        }
      </TicketWrapper>
    )
  }
}

export default ProductionTicket;