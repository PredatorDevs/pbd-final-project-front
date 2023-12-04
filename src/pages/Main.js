import { Col, Row, Card, Modal } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Wrapper } from '../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';

import sigproLogo from '../img/logos/sigpro-logo.png';

import { LogoutOutlined } from '@ant-design/icons';
import axios from 'axios';
import { GAdministrationIcon, GCashierIcon, GCashierThreeIcon, GContractIcon, GCustomersIcon, GDispatchIcon, GExpensesIcon, GInventoryIcon, GKardexIcon, GLogoutIcon, GOrdersIcon, GPendingSalesIcon, GPolicyIcon, GProductionIcon, GPurchasesIcon, GReportsIcon, GRequisitionIcon, GShippingIcon } from '../utils/IconImageProvider';
import { DeveloperInformation } from '../styled-components/DeveloperInformation';
import { getUserLocation, getUserLocationAddress, getUserLocationName } from '../utils/LocalData';
import { MainMenuCard } from '../styled-components/MainMenuCard';
import { customNot } from '../utils/Notifications';

const { confirm } = Modal;

const Container = styled.div`
  /* align-items: center; */
  background-color: #221D47;
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

function Main() {
  // const [count, setCount] = useState(0);
  const navigate = useNavigate();

  function logoutAction() {
    confirm({
      title: '¿Desea salir?',
      icon: <LogoutOutlined />,
      content: 'Confirme cierre de sesión',
      okText: 'Salir',
      cancelText: 'Cancelar',
      onOk() {
        localStorage.removeItem('userData');
        localStorage.removeItem('userToken');
        localStorage.removeItem('isLoggedIn');
        axios.defaults.headers.common.authorization = '';
        axios.defaults.headers.common.idtoauth = '';
        navigate('/');
      },
      onCancel() {},
    });
  }

  return (
    <Wrapper xCenter yCenter>
      <Container>
        <Row gutter={8}>
          {
            [
              { title: 'Contratos', image: <GContractIcon width='calc(50%)' />, action: () => customNot('info', 'En desarrollo', 'Próximamente') }, // 0
              { title: 'Clientes', image: <GCustomersIcon width='calc(50%)' />, action: () => navigate('/main/customers') }, // 1
              { title: 'Ventas', image: <GCashierThreeIcon width='calc(50%)' />, action: () => customNot('info', 'En desarrollo', 'Próximamente') }, // 2
              { title: 'Compras', image: <GPurchasesIcon width='calc(50%)' />, action: () => customNot('info', 'En desarrollo', 'Próximamente') }, // 3
              { title: 'Gastos', image: <GExpensesIcon width='calc(50%)' />, action: () => customNot('info', 'En desarrollo', 'Próximamente') }, // 4
              { title: 'Inventario', image: <GInventoryIcon width='calc(50%)' />, action: () => customNot('info', 'En desarrollo', 'Próximamente') }, // 5
              { title: 'Caja', image: <GCashierIcon width='calc(50%)' />, action: () => customNot('info', 'En desarrollo', 'Próximamente') }, // 6
              { title: 'Reportes', image: <GReportsIcon width='calc(50%)' />, action: () => customNot('info', 'En desarrollo', 'Próximamente') }, // 7
              { title: 'Administrativo', image: <GAdministrationIcon width='calc(50%)' />, action: () => navigate('/admin') }, // 8
              { title: 'Salir', image: <GLogoutIcon width='calc(50%)' />, action: () => logoutAction() }, // 9
            ].map((element, index) => (
              <Col 
                xs={{ span: 12 }}
                sm={{ span: 8 }}
                md={{ span: 6 }}
                lg={{ span: 4 }}
                xl={{ span: 3 }}
                xxl={{ span: 3 }}
                key={index}
                style={{ 
                  // display: (getUserLocation() !== 1) && (index === 0 || index === 1 || index === 3 || index === 4 || index === 6) ? 'none' : 'flex', 
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
                <MainMenuCard onClick={element.action}>
                  {element.image}
                  <p className='label'>{element.title}</p>
                </MainMenuCard>
              </Col>
            ))
          }
        </Row>
      </Container>
      <DeveloperInformation>
        <div className='developer-company-container'>
          <img className='logo' src={sigproLogo} alt={'sigproLogo'} />
          <section className='developer-company-info-container'>
            <p className='developer-company-title'>SigPro COM</p>
            <p className='developer-company-name'>Sistemas de Información Gerencial Pro Comercios</p>
            <p className='developer-company-description'>Sistemas, Equipos informáticos, Suministros, Servicio Técnico</p>
            <p className='developer-company-copyright'>&copy; Todos los derechos reservados 2022</p>
          </section>
        </div>
        <section className='developer-info-container'>
          <p className='developer-name'>Gustavo Sánchez</p>

          <p className='developer-contact'>Contacto: (503) 7260-2996</p>
          <p className='developer-address'>11 Av Nte y 10a Ca Pte #620, Bo San Francisco, San Miguel</p>
        </section>
      </DeveloperInformation>
    </Wrapper>
  );
}

export default Main;
