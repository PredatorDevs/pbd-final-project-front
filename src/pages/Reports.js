import { Col, Row, Card } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Wrapper } from '../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';

import { GBooksIcon, GLogoutIcon, GSaleReportIcon } from '../utils/IconImageProvider';
import { CompanyInformation } from '../styled-components/CompanyInformation';

const Container = styled.div`
  /* align-items: center; */
  background-color: #325696;
  border: 1px solid #D1DCF0;
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

function Reports() {
  // const [count, setCount] = useState(0);
  const navigate = useNavigate();

  return (
    <Wrapper xCenter yCenter>
      <CompanyInformation>
        {/* <img className='logo' src={aguaLimonLogo} alt={'aguaLimonLogo'} /> */}
        <section className='company-info-container'>
          <p className='module-name'>Reportes</p>
        </section>
      </CompanyInformation>
      <Container>
        <Row>
          {
            [
              { title: 'Liquidaciones', image: <GSaleReportIcon width='calc(100% - 40px)' addBackground colorBackground='rgba(209, 220, 240, .5)' />, backgroundColor: '#87ABEB', path: '/reports/settlements' },
              { title: 'Salir', image: <GLogoutIcon width='calc(100% - 40px)' addBackground colorBackground='rgba(209, 220, 240, .5)' />, backgroundColor: '#87ABEB', path: '/main' },
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
                <Card
                  style={{ margin: 10, borderRadius: 10, textAlign: 'center', backgroundColor: element.backgroundColor }}
                  hoverable
                  cover={element.image}
                  onClick={() => navigate(element.path)}
                >
                  <p className='card-title'>{element.title}</p>
                </Card>
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

export default Reports;
