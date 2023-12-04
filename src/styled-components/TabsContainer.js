import styled from 'styled-components';

export const TabsContainer = styled.main`
  width: 100%;
  /* height: ${props => props.height || 'auto'}; */
  /* overflow-y: scroll; */
  
  .ant-tabs-tab {
    background: #1E2022;
    border-radius: 10px;
    color: white;
    padding-left: 5px;
    padding-right: 5px;
    /* margin-right: 5px; */
  }

  .ant-tabs-left>.ant-tabs-content-holder, .ant-tabs-left>div>.ant-tabs-content-holder {
    /* margin-left: 5px; */
    border-left: 1px solid transparent;
  }

  @media (min-width: 1600px) {
    
  }
  
  @media (min-width: 1200px) and (max-width: 1599px) {
    
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    
  }

  @media (min-width: 768px) and (max-width: 991px) {
    
  }

  @media (min-width: 576px) and (max-width: 767px) {
    
  }

  @media (max-width: 575px) {
    
  }
`;
