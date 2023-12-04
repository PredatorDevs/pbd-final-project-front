import styled from 'styled-components';

export const MainMenuCard = styled.div`
  width: ${props => props.size || '150px'}; 
  margin: 8px; 
  height: ${props => props.size || '150px'}; 
  background-color: ${props => props.backgroundColor || '#fafafa'};
  border: 2px solid ${props => props.borderColor || '#1677ff'};
  border-radius: 10px; 
  display: flex; 
  flex-direction: column; 
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  .label {
    margin: 0px;
    margin-top: 10px;
    color: ${props => props.labelColor || '#262626'};
    font-size: ${props => props.labelSize || '14px'};
    font-weight: ${props => props.labelWeight || 0};
    /* background-color: #3E4057; */
    /* -webkit-text-stroke: 1px black; */
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 3px;
  }
  :hover {
    cursor: pointer;
    width: ${props => props.size || '160px'};
    background-color: ${props => props.hoverBackgroundColor || '#91caff'};
    border: 2px solid ${props => props.borderHoverColor || '#5F86DC'};
    box-shadow: 3px 3px 5px 0px #6B738F;
    -webkit-box-shadow: 3px 3px 5px 0px #6B738F;
    -moz-box-shadow: 3px 3px 5px 0px #6B738F;
    .label {
      font-weight: 600;
      color: ${props => props.hoverLabelColor || '#262626'};
    }
  }
`;
