import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import orderSalesServices from "../../services/OrderSalesServices";
import { TicketWrapper } from "../../styled-components/TicketWrapper";
import moment from 'moment';
import 'moment/locale/es-mx';
import { isEmpty } from "lodash";
import { PageLetterWrapper } from "../../styled-components/PageLetterWrapper";

class ProductInventoryByCategoriesDocument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoriesData: props.categoriesData,
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
      categoriesData,
      productStockData,
      locationName
    } = this.props;
    return (
      <PageLetterWrapper>
        <p className='header'>Reporte de Inventario por Categorias</p>
        <p className="description">{`${locationName}`}</p>
        <p className="description">{`Al ${moment().format('LL')} a las ${moment().format('LT')}`}</p>
        {/* <div className="divider" /> */}
        {
          (categoriesData || []).map((element, index) => (
            <Row gutter={[0, 0]} key={index} style={{ }}>
              <Col span={24}>
                <p className="col-body-left" style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid black', borderTop: '1px solid black' }}>{element.name}</p>
              </Col>
              <Col span={2}>
                <p className="col-body-left" style={{ textDecoration: 'underline' }}>{'CODIGO'}</p>
              </Col>
              <Col span={10}>
                <p className="col-body-left" style={{ textDecoration: 'underline' }}>{'NOMBRE'}</p>
              </Col>
              <Col span={4}>
                <p className="col-body-right" style={{ textDecoration: 'underline' }}>{'EXISTENCIAS'}</p>
              </Col>
              <Col span={4}>
                <p className="col-body-right" style={{ textDecoration: 'underline' }}>{'CONTENIDO'}</p>
              </Col>
              <Col span={4}>
                <p className="col-body-right" style={{ textDecoration: 'underline' }}>{'GENERAL'}</p>
              </Col>
              {
                (productStockData.filter((x) => x.productCategoryId === element.id) || []).map((subelement, subindex) => (
                  <>
                    <Col span={2}>
                      <p className="col-body-left">{subelement.productId}</p>
                    </Col>
                    <Col span={10}>
                      <p className="col-body-left">{subelement.productName}</p>
                    </Col>
                    <Col span={4}>
                      <p className="col-body-right">{subelement.currentLocationStock}</p>
                    </Col>
                    <Col span={4}>
                      <p className="col-body-right">{subelement.packageContent}</p>
                    </Col>
                    <Col span={4}>
                      <p className="col-body-right">{Number(subelement.currentLocationStock / subelement.packageContent).toFixed(2)}</p>
                    </Col>
                  </>
                ))
              }
            </Row>
          ))
        }
        {/* {
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
        } */}
        {/* <div className="divider" />
        <Row gutter={8}>
          <Col span={18}><p className="col-body-left">{`Total:`}</p></Col>
          <Col span={6}><p className="col-body-right">{`$${Number((ticketData.total || 0.00)).toFixed(2)}`}</p></Col>
        </Row> */}
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
        
      </PageLetterWrapper>
    )
  }
}

export default ProductInventoryByCategoriesDocument;