import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import orderSalesServices from "../../services/OrderSalesServices";
import { TicketWrapper } from "../../styled-components/TicketWrapper";
import moment from 'moment';
import 'moment/locale/es-mx';
import { isEmpty } from "lodash";
import { PageLetterWrapper } from "../../styled-components/PageLetterWrapper";

class ProductInventoryDocument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportTitle: props.reportTitle,
      productStockData: props.productStockData,
      locationName: props.locationName
    };
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
    const {
      reportTitle,
      productStockData,
      locationName
    } = this.props;
    return (
      <PageLetterWrapper>
        <p className='header'>{`${reportTitle || 'Reporte de Inventario General'}`}</p>
        <p className="description">{`${locationName}`}</p>
        <p className="description">{`Al ${moment().format('LL')} a las ${moment().format('LT')}`}</p>
        {/* <div className="divider" /> */}
        <Row gutter={[0, 0]} style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid black', borderTop: '1px solid black' }}>
          <Col span={2}>
            <p className="col-body-left" style={{ textDecoration: 'underline' }}>{'CODIGO'}</p>
          </Col>
          <Col span={7}>
            <p className="col-body-left" style={{ textDecoration: 'underline' }}>{'NOMBRE'}</p>
          </Col>
          <Col span={3}>
            <p className="col-body-right" style={{ textDecoration: 'underline' }}>{'EXISTENCIAS'}</p>
          </Col>
          <Col span={3}>
            <p className="col-body-right" style={{ textDecoration: 'underline' }}>{'CONTENIDO'}</p>
          </Col>
          <Col span={3}>
            <p className="col-body-right" style={{ textDecoration: 'underline' }}>{'GENERAL'}</p>
          </Col>
          <Col span={3}>
            <p className="col-body-right" style={{ textDecoration: 'underline' }}>{'COSTO'}</p>
          </Col>
          <Col span={3}>
            <p className="col-body-right" style={{ textDecoration: 'underline' }}>{'VALOR'}</p>
          </Col>
        </Row>
        <Row gutter={[0, 0]} style={{ }}>
          {
            (productStockData || []).map((element, index) => (
              <>
                <Col span={2}>
                  <p className="col-body-left">{element.productId}</p>
                </Col>
                <Col span={7}>
                  <p className="col-body-left">{element.productName}</p>
                </Col>
                <Col span={3}>
                  <p className="col-body-right">{element.currentLocationStock}</p>
                </Col>
                <Col span={3}>
                  <p className="col-body-right">{element.packageContent}</p>
                </Col>
                <Col span={3}>
                  <p className="col-body-right">{Number(element.currentLocationStock / element.packageContent).toFixed(2)}</p>
                </Col>
                <Col span={3}>
                  <p className="col-body-right">{element.productCost}</p>
                </Col>
                <Col span={3}>
                  <p className="col-body-right">{Number(element.currentLocationStock * element.productCost).toFixed(2)}</p>
                </Col>
              </>
            ))
          }
        </Row>
      </PageLetterWrapper>
    )
  }
}

export default ProductInventoryDocument;
