import { Col, Row, Card } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Wrapper } from '../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';

import { GBottlesIcon, GLogoutIcon, GMaterialsIcon } from '../utils/IconImageProvider';
import { getUserLocation } from '../utils/LocalData';
import { MainMenuCard } from '../styled-components/MainMenuCard';

const CompanyInformation = styled.div`
  align-items: center;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  padding: 20px 0px;
  width: 100%;

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
  box-shadow: 3px 3px 5px 0px #6B738F;
  -webkit-box-shadow: 3px 3px 5px 0px #6B738F;
  -moz-box-shadow: 3px 3px 5px 0px #6B738F;
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
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

function Inventory() {
  // const [count, setCount] = useState(0);
  const navigate = useNavigate();

  return (
    <Wrapper xCenter>
      <CompanyInformation>
        {/* <img className='logo' src={aguaLimonLogo} alt={'aguaLimonLogo'} /> */}
        <section className='company-info-container'>
          <p className='module-name'>Inventario</p>
        </section>
      </CompanyInformation>
      <Container>
        <Row>
          {
            [
              { title: 'Productos', image: <GBottlesIcon width='calc(50%)' />, path: '/inventory/products' },
              // { title: 'Materias primas', image: <GMaterialsIcon width='calc(50%)' />, path: '/inventory/rawmaterials' },
              { title: 'Salir', image: <GLogoutIcon width='calc(50%)' />, path: '/main' },
            ].map((element, index) => (
              // <Col 
              //   xs={{ span: 12 }}
              //   sm={{ span: 8 }} 
              //   md={{ span: 6 }}
              //   lg={{ span: 4 }}
              //   xl={{ span: 3 }}
              //   xxl={{ span: 3 }}
              //   key={index}
              //   style={{ display: (getUserLocation() !== 1) && (index === 1) ? 'none' : 'inline' }}
              // >
              //   <Card
              //     style={{ margin: 10, borderRadius: 10, textAlign: 'center', backgroundColor: '#87ABEB' }}
              //     hoverable
              //     cover={element.image}
              //     onClick={() => navigate(element.path)}
              //   >
              //     <p className='card-title'>{element.title}</p>
              //   </Card>
              // </Col>
              <Col 
                xs={{ span: 12 }}
                sm={{ span: 8 }}
                md={{ span: 6 }}
                lg={{ span: 4 }}
                xl={{ span: 3 }}
                xxl={{ span: 3 }}
                key={index}
                style={{ 
                  display: (getUserLocation() !== 1) && (index === 3 || index === 5 || index === 6 || index === 7) ? 'none' : 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center'
                }}
              >
                {/* <Card
                  style={{ margin: 10, borderRadius: 10, textAlign: 'center', backgroundColor: '#87ABEB' }}
                  cover={element.image}
                  onClick={element.action}
                >
                  <p className='card-title'>{element.title}</p>
                </Card> */}
                <MainMenuCard onClick={() => navigate(element.path)}>
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

export default Inventory;
