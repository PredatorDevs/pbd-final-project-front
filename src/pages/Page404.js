import React, { useState } from 'react';
import { Wrapper } from '../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import styled from 'styled-components';

const ResultContainer = styled.div`
  padding: 5px;
  border-radius: 20px;
  background-color: rgba(209, 220, 240, 0.75);
`

function Page404() {
  const navigate = useNavigate();

  return (
    <Wrapper xCenter yCenter>
      {/* No Route */}
      <ResultContainer>
        <Result
          status="404"
          // title={<p style={{ color: '#FFFFFF', margin: 0 }}>404</p>}
          // subTitle={<p style={{ color: '#FFFFFF', margin: 0 }}>No estás autorizado a acceder a este apartado</p>}
          title="404"
          subTitle="Apartado no encontrado"
          style={{ color: '#FFFFFF' }}
        />
      </ResultContainer>      
    </Wrapper>
  );
}

export default Page404;