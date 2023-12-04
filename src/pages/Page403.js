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

function Page403() {
  const navigate = useNavigate();

  return (
    <Wrapper xCenter yCenter>
      <ResultContainer>
        <Result
          status="403"
          // title={<p style={{ color: '#FFFFFF', margin: 0 }}>403</p>}
          // subTitle={<p style={{ color: '#FFFFFF', margin: 0 }}>No estás autorizado a acceder a este apartado</p>}
          title="403"
          subTitle="No estás autorizado a acceder a este apartado"
          style={{ color: '#FFFFFF' }}
        />
      </ResultContainer>      
    </Wrapper>
  );
}

export default Page403;