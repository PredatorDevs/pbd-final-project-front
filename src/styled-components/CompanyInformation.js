import styled from 'styled-components';

export const CompanyInformation = styled.div`
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
