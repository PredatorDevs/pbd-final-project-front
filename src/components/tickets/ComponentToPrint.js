import { Col, Row } from "antd";
import React from "react";
import styled from 'styled-components';

export default class ComponentToPrint extends React.PureComponent {
  render() {
    return (
      <Wrapper>
        <p className='header'>Todo Para Cakes</p>
        <Row gutter={8}>
          <Col span={9}>
            <p className="legal-info-caption">{`NRC: XXXXXX-X`}</p>
          </Col>
          <Col span={15}>
            <p className="legal-info-caption">{`NIT: XXXX-XXXXXX-XXX-X`}</p>
          </Col>
        </Row>
        <p className="description">Nombre titular</p>
        <p className="description">Giro: Producción y distribución agua purificada</p>
        <div className="divider" />
        <p className="info-left">{`Sucursal: ${'Santa Rosa'}`}</p>
        <p className="info-left">{`Cantón La Chorrera, Santa Rosa de Lima`}</p>
        <p className="info-left">{`Teléfono: ${'2666-6666'}`}</p>
        {/* <div className="divider" />
        <Row gutter={8}>
          <Col span={12}><p className="col-body-left">{`Venta por tiquete`}</p></Col>
          <Col span={12}><p className="col-body-right">{`#000000`}</p></Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}><p className="col-body-left">{`Autorización`}</p></Col>
          <Col span={12}><p className="col-body-right">{`#123456789`}</p></Col>
        </Row> */}
        <div style={{ height: 5 }} />
        <Row gutter={8}>
          <Col span={4}><p className="col-header-left">Cant</p></Col>
          <Col span={14}><p className="col-header-centered">Descripción</p></Col>
          <Col span={6}><p className="col-header-right">Total</p></Col>
        </Row>
        {
          [
            {cant: 10, desc: 'Garrafas 5 L', total: 10.25}, 
            {cant: 2, desc: 'Fardos', total: 204.86}, 
            // {cant: 150, desc: 'Estofado de carne y manzana del Norte', total: 12.45}, 
            // {cant: 3506, desc: 'Fideos con delicias de montaña del Rito de la Linterna', total: 10502.35}
          ].map((elem, index) => (
            <Row gutter={8} key={index}>
              <Col span={4}><p className="col-body-left">{elem.cant}</p></Col>
              <Col span={14}><p className="col-body-left">{elem.desc}</p></Col>
              <Col span={6}><p className="col-body-right">{`${elem.total}`}</p></Col>
            </Row>
          ))
        }
        {/* <div className="divider" />
        <Row gutter={8}>
          <Col span={18}><p className="col-body-left">{`Ventas Gravadas USD:`}</p></Col>
          <Col span={6}><p className="col-body-right">{`1000.00`}</p></Col>
        </Row>
        <Row gutter={8}>
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
        <p className="description">*Gracias por preferirnos*</p> */}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  width: 226px;
  display: flex;
  flex-direction: column;
  .header {
    font-size: 20px;
    /* font-weight: 600; */
    margin: 0px;
    text-align: center;
  }
  .legal-info-caption {
    font-size: 11px;
    margin: 0px;
    /* font-weight: 600; */
  }
  .description {
    font-size: 12px;
    margin: 0px;
    text-align: center;
  }
  .divider {
    border: 1px solid black;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .info-left {
    font-size: 12px;
    margin: 0px;
    text-align: left;
  }
  .col-header, 
  .col-header-centered,
  .col-header-left,
  .col-header-right {
    font-size: 13px;
    margin: 0px;
    /* font-weight: 600; */
    border-top: 1px solid black;
    border-bottom: 1px solid black;
  }
  .col-header-centered {
    text-align: center;
  }
  .col-header-left {
    text-align: left;
  }
  .col-header-right {
    text-align: right;
  }
  .col-body, 
  .col-body-centered,
  .col-body-left,
  .col-body-right {
    font-size: 12px;
    margin: 0px;
  }
  .col-body-centered {
    text-align: center;
  }
  .col-body-left {
    text-align: left;
  }
  .col-body-right {
    text-align: right;
  }
`;