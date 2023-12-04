import { Col, Row, Card } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Wrapper } from '../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';

import booksIcon from '../img/icons/docs/books.png';
import addFolderIcon from '../img/icons/docs/add-file.png';
import logoutIcon from '../img/icons/docs/logout.png';

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
    /* text-overflow: ellipsis; */
    /* background-color: red; */
    overflow-wrap: break-word;
    font-weight: 600;
    margin: 0px;
    overflow: hidden;
    /* white-space: nowrap; */
    width: 100%;
  }
`;

function RawMaterialRequisitions() {
  // const [count, setCount] = useState(0);
  const navigate = useNavigate();

  return (
    <Wrapper xCenter yCenter>
      <CompanyInformation>
        {/* <img className='logo' src={aguaLimonLogo} alt={'aguaLimonLogo'} /> */}
        <section className='company-info-container'>
          <p className='module-name'>Requisiciones</p>
        </section>
      </CompanyInformation>
      <Container>
        <Row>
          {
            [
              { title: 'Nueva Req Materia Prima', image: addFolderIcon, backgroundColor: '#87ABEB', path: '/requisitions/new' },
              { title: 'Registros', image: booksIcon, backgroundColor: '#87ABEB', path: '/requisitions/records' },
              { title: 'Salir', image: logoutIcon, backgroundColor: '#87ABEB', path: '/main' },
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
                  cover={
                    <img
                      alt="example"
                      src={element.image}
                      style={{ 
                        margin: 20, 
                        padding: 20,
                        backgroundColor: 'rgba(209, 220, 240, .5)',
                        borderRadius: 10,
                        width: 'calc(100% - 40px)'
                      }}
                    />
                  }
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

export default RawMaterialRequisitions;
