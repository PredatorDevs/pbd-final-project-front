import styled from 'styled-components';

export const Wrapper = styled.main`
  align-items: ${props => props.xCenter ? 'center' : 'flex-start'};
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.yCenter ? 'center' : 'flex-start'};
  margin: 0px 0px;
  min-width: 100%;
  min-height: ${props => props.heightFitScreen ? '100vh' : '250px'};

  /* @media (min-width: 1600px) {
    min-width: 1600px;
  }
  
  @media (min-width: 1200px) and (max-width: 1599px) {
    min-width: 1200px;
    max-width: 1599px;
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    min-width: 992px;
    max-width: 1199px;
  }

  @media (min-width: 768px) and (max-width: 991px) {
    min-width: 768px;
    max-width: 991px;
  }

  @media (min-width: 576px) and (max-width: 767px) {
    min-width: 576px;
    max-width: 767px;
  }

  @media (max-width: 575px) {
    max-width: 575px;
  } */
`;

// export const Wrapper = styled.main`
//   align-items: ${props => props.xCenter ? 'center' : 'flex-start'};
//   display: flex;
//   flex-direction: column;
//   justify-content: ${props => props.yCenter ? 'center' : 'flex-start'};
//   min-height: 100vh;
//   width: 1280px;
//   /* DESKTOPS | 1281px to higher resolution */
//   @media (min-width: 1281px) {
//     width: 1280px;
//   }
//   /* DESKTOPS - LAPTOPS | 1025px to 1281px */
//   @media (min-width: 1025px) and (max-width: 1280px) {
//     width: 1025px;
//   }
//   /* TABLETS - IPADS (Portrait) | 768px to 1024px */
//   @media (min-width: 768px) and (max-width: 1024px) {
//     width: 768px;
//   }
//   /* TABLETS - IPADS (Landscape) | 768px to 1024px */
//   @media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
//     width: 768px;
//   }
//   /* LOW RESOLUTION TABLES - MOBILES (Landscape) | 481px to 767px */
//   @media (min-width: 481px) and (max-width: 767px) {
//     width: 481px;
//   }
//   /* MOST OF THE SMARTPHONES MOBILES (PORTRAIT) */
//   @media (min-width: 320px) and (max-width: 480px) {
//     width: 320px;
//   }
// `;
