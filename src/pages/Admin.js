import { Col, Row, Card } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Wrapper } from '../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';

import { GBrandIcon, GCustomersIcon, GGeneralDataIcon, GLogoutIcon, GPinIcon, GProductLineIcon, GSalesAgentIcon, GSupplierIcon, GTrackIcon, GUsersIcon } from '../utils/IconImageProvider';
import { MainMenuCard } from '../styled-components/MainMenuCard';

const CompanyInformation = styled.div`
  align-items: center;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  padding: 20px 0px;
  width: 100%;
  
  .logo {
    height: 150px;
    width: 150px;
  }

  .company-info-container {
    margin-left: 20px;
    width: 100%;
    color: #D1DCF0;
    text-align: center;
    .module-name {
      margin: 0px;
      font-size: 24px;
      font-weight: 600;
    }

    .module-description {
      margin: 0px;
      font-size: 18px;
    }
  }
`;

const Container = styled.div`
  /* align-items: center; */
  background-color: #454D68;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  .ant-card:hover {
    cursor: pointer;
  }
  .card-title {
    font-size: 15px;
    color: #223B66;
    text-overflow: ellipsis;
    /* background-color: red; */
    font-weight: 600;
    margin: 0px;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
  }
`;

function Admin() {
  // const [count, setCount] = useState(0);
  const navigate = useNavigate();

  return (
    <Wrapper xCenter yCenter>
      <CompanyInformation>
        {/* <img className='logo' src={aguaLimonLogo} alt={'aguaLimonLogo'} /> */}
        <section className='company-info-container'>
          <p className='module-name'>Administrativo</p>
        </section>
      </CompanyInformation>
      <Container>
        <Row>
          {
            [
              // { title: 'Clientes', image: <GCustomersIcon width='calc(50%)' />, action: () => navigate('/customers') },
              { title: 'Proveedores', image: <GSupplierIcon width='calc(50%)' />, action: () => navigate('/suppliers') },
              { title: 'Usuarios', image: <GUsersIcon width='calc(50%)' />, action: () => navigate('/users') },
              { title: 'Vendedores', image: <GSalesAgentIcon width='calc(50%)' />, action: () => navigate('/sellers') },
              { title: 'Categorías', image: <GProductLineIcon width='calc(50%)' />, action: () => navigate('/categories') },
              { title: 'Marcas', image: <GBrandIcon width='calc(50%)' />, action: () => navigate('/brands') },
              { title: 'Ubicaciones', image: <GPinIcon width='calc(50%)' />, action: () => navigate('/ubications') },
              { title: 'Rutas', image: <GTrackIcon width='calc(50%)' />, action: () => navigate('/deliveryroutes') },
              { title: 'Datos Generales', image: <GGeneralDataIcon width='calc(50%)' />, action: () => navigate('/main') },
              { title: 'Regresar', image: <GLogoutIcon width='calc(50%)' />, action: () => navigate('/main') },
            ].map((element, index) => (
              <Col 
                xs={{ span: 12 }}
                sm={{ span: 8 }} 
                md={{ span: 6 }} 
                lg={{ span: 4 }}
                xl={{ span: 3 }}
                xxl={{ span: 3 }}
                key={index}
              >
                {/* <Card
                  style={{ margin: 10, borderRadius: 10, textAlign: 'center', backgroundColor: element.backgroundColor }}
                  cover={element.image}
                  onClick={() => navigate(element.path)}
                >
                  <p className='card-title'>{element.title}</p>
                </Card> */}
                <MainMenuCard onClick={element.action}>
                  {element.image}
                  <p className='label'>{element.title}</p>
                </MainMenuCard>
              </Col>
            ))
          }
        </Row>
      </Container>
      <CompanyInformation>
        {/* <img className='logo' src={aguaLimonLogo} alt={'aguaLimonLogo'} /> */}
        <section className='company-info-container'>
          <p className='module-description'>SigPro COM</p>
          <p className='module-description'>&copy; Todos los derechos reservados 2022</p>
        </section>
      </CompanyInformation>
    </Wrapper>
  );
}

export default Admin;