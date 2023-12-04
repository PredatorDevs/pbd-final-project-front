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

function PageUnderConstruction() {
  const navigate = useNavigate();

  return (
    <Wrapper xCenter yCenter>
      {/* No Route */}
      <ResultContainer>
        <Result
          status="500"
          // title={<p style={{ color: '#FFFFFF', margin: 0 }}>404</p>}
          // subTitle={<p style={{ color: '#FFFFFF', margin: 0 }}>No estás autorizado a acceder a este apartado</p>}
          title="En desarrollo"
          subTitle="Apartado no encontrado"
          style={{ color: '#FFFFFF' }}
        />
      </ResultContainer>      
    </Wrapper>
  );
}

export default PageUnderConstruction;