import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Button } from 'antd';
import productsServices from '../../services/ProductsServices';
import { isNumber } from 'lodash';
import { customNot } from '../../utils/Notifications';
import { LockFilled } from '@ant-design/icons';

export default function ProductPricePicker(props) {
  const [fetching, setFetching] = useState(false);
  const [productPrices, setProductPrices] = useState([]);

  const { onSelect, open, onClose, productId } = props;

  useEffect(() => {
    if (isNumber(productId) && productId !== 0) {
      setFetching(true);
      productsServices.prices.findByProductId(productId)
      .then((response) => {
        const { data } = response;
        console.log(data);
        setProductPrices(data);
        setFetching(false);
      })
      .catch((error) => {
        customNot('error', 'Sin información', 'Revise su conexión a la red');
        setFetching(false);
      });
    }
  }, [ productId ])

  return (
    <Modal
      title={'Seleccione un precio'}
      centered
      width={450}
      closable={false}
      maskClosable={false}
      open={open}
      footer={null}
    >      
      <Row gutter={[8, 8]}>
        {
          (productPrices || []).map((element, index) => (
            <Col key={index} span={8}>
              <p>{`Precio ${index + 1}`}</p>
              <Button
                type={'primary'}
                onClick={() => {
                  onSelect(element.price || 0.00);
                  onClose();
                }}
                // icon={index !== 0 ? <LockFilled /> : <></>}
              >
                {`$${element.price}`}
              </Button>
            </Col>
          ))
        }
      </Row>
      <Button style={{ width: '100%', marginTop: '20px' }} type='default' danger onClick={() => onClose()} >Cerrar</Button>
    </Modal>
  );
}