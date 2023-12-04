import React from 'react';
import { Wrapper } from '../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import styled from 'styled-components';

const ResultContainer = styled.div`
  padding: 5px;
  border-radius: 20px;
  background-color: rgba(209, 220, 240, 0.75);
`

function TokenExpired() {
  const navigate = useNavigate();

  return (
    <Wrapper xCenter yCenter heightFitScreen>
      <ResultContainer>
        <Result
          status="500"
          // title={<p style={{ color: '#FFFFFF', margin: 0 }}>500</p>}
          // subTitle={<p style={{ color: '#FFFFFF', margin: 0 }}>No estás autorizado a acceder a este apartado</p>}
          title="Sesión expirada"
          subTitle="Su token de autenticación ha expirado, por favor inicie sesión nuevamente"
          style={{ color: '#FFFFFF' }}
          extra={
            <Button 
              type="primary" 
              style={{ width: '100%', backgroundColor: '#4B81E1' }}
              onClick={() => navigate('/')}
            >
              Iniciar sesión
            </Button>
          }
        />
      </ResultContainer>      
    </Wrapper>
  );
}

export default TokenExpired;