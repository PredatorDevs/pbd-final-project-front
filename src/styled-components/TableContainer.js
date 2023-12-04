import styled from 'styled-components';

export const TableContainer = styled.main`
  width: 100%;
  height: ${props => props.height || 'auto'};
  overflow-y: scroll;
  thead[class*="ant-table-thead"] th{
    background-color: ${props => props.headColor || '#325696'} !important;
    font-size: 14px;
    color: ${props => props.headTextColor || '#fafafa'};
  }
  thead[class*="ant-table-tbody"] th{
    background-color: ${props => props.headColor || '#325696'} !important;
    font-size: 14px;
    color: ${props => props.headTextColor || '#fafafa'};
  }
  tr:nth-child(even) { 
    background-color: ${props => props.evenColor || '#DDDDDD'};
  }
  tr:nth-child(odd) {
    background-color: ${props => props.oddColor || '#f0f0f0'};
  }
  .ant-table-wrapper {
    background-color: ${props => props.wrapperBgColor || '#f0f0f0'};
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
