import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Button, Tag } from 'antd';
import productsServices from '../../services/ProductsServices';
import { isNumber } from 'lodash';
import { customNot } from '../../utils/Notifications';
import { LockFilled } from '@ant-design/icons';

export default function ProductPricePreview(props) {
  const [fetching, setFetching] = useState(false);
  const [productPrices, setProductPrices] = useState([]);

  const { open, onClose, productId } = props;

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
      title={'Precios'}
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
              <p style={{ margin: 0, fontSize: 12 }}>{`Precio ${index + 1}`}</p>
              <Tag style={{ fontSize: 14 }}>
                {`$${element.price}`}
              </Tag>
              {/* <p style={{ margin: 0, fontSize: 10 }}>{`Margen ${element.profitRateFixed ? '$' : ''}${element.profitRate}${!!!element.profitRateFixed ? '' : '%'}`}</p> */}
            </Col>
          ))
        }
      </Row>
      <Button
        style={{ width: '100px', marginTop: '20px' }}
        type='default'
        size={'small'}
        danger
        onClick={() => onClose()}
      >
        <p style={{ margin: 0, fontSize: 13 }}>{`Cerrar`}</p>
      </Button>
    </Modal>
  );
}