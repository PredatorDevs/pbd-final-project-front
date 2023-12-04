import styled from 'styled-components';

export const DeveloperInformation = styled.div`
align-items: center;
border-radius: 10px;
display: flex;
flex-direction: row;
justify-content: space-between;
padding: 20px 0px;
width: 100%;

.developer-company-container {
  align-items: center;
  display: flex;
  flex-direction: row;
  width: 50%;
  .logo {
    height: 100px;
    width: 100px;
  }

  .developer-company-info-container {
    margin-left: 20px;
    color: #D1DCF0;
    
    .developer-company-title, .developer-company-name, .developer-company-description {
      margin: 0px;
    }

    .developer-company-title {
      font-size: 20px;
      font-weight: 600;
    }

    .developer-company-name {
      font-size: 14px;
    }

    .developer-company-description {
      font-size: 12px;
    }

    .developer-company-copyright {
      font-size: 10px;
    }
  }
}

.developer-info-container {
  margin-left: 20px;
  color: #D1DCF0;
  width: 50%;
  .developer-name, .developer-contact, .developer-address {
    margin: 0px;
  }

  .developer-name {
    font-size: 16px;
    font-weight: 600;
  }

  .developer-contact {
    font-size: 12px;
  }

  .developer-address {
    font-size: 10px;
  }
}

@media (max-width: 767px) {
  flex-direction: column;
  .developer-company-container, .developer-info-container {
    width: 100%;
  }
}
`;