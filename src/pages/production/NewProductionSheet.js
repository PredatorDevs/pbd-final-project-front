import React, { useEffect, useRef, useState } from 'react';
import { Wrapper } from '../../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Col, DatePicker, Input, InputNumber, Row, Space, Table, Tag } from 'antd';
import productsServices from '../../services/ProductsServices';
import { customNot } from '../../utils/Notifications';

import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import { find, isEmpty } from 'lodash';
import productionsServices from '../../services/ProductionsServices';
import { CompanyInformation } from '../../styled-components/CompanyInformation';
import { getUserLocation, getUserLocationName, getUserName } from '../../utils/LocalData';
import ProductionTicket from '../../components/tickets/ProductionTicket';
import ReactToPrint from 'react-to-print';
import { verifyFileExtension } from '../../utils/VerifyFileExt';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { TableContainer } from '../../styled-components/TableContainer';
import { columnDef } from '../../utils/ColumnsDefinitions';

const Container = styled.div`
  /* align-items: center; */
  background-color: #454D68;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  color: white;
`;

function NewProductionSheet() {
  const navigate = useNavigate();
  const componentRef = useRef();


  const [fetching, setFetching] = useState(false);
  const [ableToUpload, setAbleToUpload] = useState(false);

  const [entityData, setEntityData] = useState([]);
  const [entityRefreshData, setEntityRefreshData] = useState(0);

  const [printData, setPrintData] = useState([]);
  const [printDataDetails, setPrintDataDetails] = useState([]);

  const [productionDocDatetime, setProductionDocDatetime] = useState(defaultDate());
  const [productionDocNumber, setProductionDocNumber] = useState('');
  const [productionDetailData, setProductionDetailData] = useState([]);

  const [productionAttachment, setProductionAttachment] = useState(null);

  useEffect(() => {
    setFetching(true);
    productsServices.find()
    .then((response) => {
      const { data } = response;
      setEntityData(data);
      setProductionDetailData(data.map((element, index) => ([null, element.productId, 0, 0])));
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }, [ entityRefreshData ]);

  function defaultDate() {
    return moment();
  };

  function areValidNumber(n) {
    return true;
  }

  function validateData() {
    const validDocDatetime = productionDocDatetime.isValid();
    const validDocNumber = !isEmpty(productionDocNumber);
    const validDetailData = productionDetailData.every(areValidNumber);
    const validProductionAttachment = ((productionAttachment === null) || ((productionAttachment !== null) && ableToUpload === true));
    if (!validDocDatetime) customNot('warning', 'Debe seleccionar una fecha válida', 'Dato no válido');
    if (!validDocNumber) customNot('warning', 'Debe colocar un número de documento', 'Dato no válido');
    if (!validDetailData) customNot('warning', 'Debe llenar toda la información del detalle', 'Datos no válido');
    if (!validProductionAttachment) customNot('warning', 'Debe seleccionar un archivo con formato válido', 'Adjunto no válido');
    return (validDocDatetime && validDocNumber && validDetailData && validProductionAttachment);
  }

  // function printAfterSuccessAction(insertId) {
  //   productionsServices.findById(insertId)
  //   .then((response) => {
  //     setPrintData(response.data);
  //     productionsServices.details.findByProductionId(insertId)
  //     .then((response) => {
  //       setPrintDataDetails(response.data);
  //       customNot('info', '', 'Imprimiendo');
  //       document.getElementById('print-newproduction-button').click();
  //       navigate('/production');
  //       setFetching(false);
  //     }).catch((error) => {
  //       navigate('/production');
  //       setFetching(false);
  //       customNot('error', 'Información de producción no encontrada', 'Revise conexión');
  //     });
  //   }).catch((error) => {
  //     navigate('/production');
  //     setFetching(false);
  //     customNot('error', 'Información de producción no encontrada', 'Revise conexión')
  //   });
  // }

  function formAction() {
    if (validateData()) {
      // setFetching(true);
      // productionsServices.add(
      //   getUserLocation(),
      //   productionDocDatetime.format('YYYY-MM-DD HH:mm:ss'),
      //   productionDocNumber
      // )
      // .then((response) => {
      //   customNot('success', 'Operación exitosa', 'Hoja de producción creada');
      //   const { insertId } = response.data[0];
      //   const bulkDataPrices = productionDetailData.map((element) => ([ insertId, element[1], element[2], element[3] ]));
      //   productionsServices.details.add(bulkDataPrices)
      //   .then((response) => {
      //     // printAfterSuccessAction(insertId);
      //     navigate('/production');
      //     setFetching(false);
      //   })
      //   .catch((error) => {
      //     // restoreState();
      //     setFetching(false);
      //     customNot('error', 'Algo salió mal con la creación de los detalles', 'Detalle no asignado');
      //   })
      // })
      // .catch((error) => {
      //   setFetching(false);
      //   customNot('error', 'Algo salió mal', 'Hoja de producción no creada');
      // })
      setFetching(true);
      productionsServices.add(
        getUserLocation(),
        productionDocDatetime.format('YYYY-MM-DD HH:mm:ss'),
        productionDocNumber,
        productionAttachment,
        productionDetailData
      )
      .then((response) => {
        customNot('success', 'Operación exitosa', 'Hoja de producción creada');
        setFetching(false);
        navigate('/production');
      })
      .catch((error) => {
        setFetching(false);
        customNot('error', 'Algo salió mal', 'Hoja de producción no creada');
      })
    }
  }

  return (
    <Wrapper xCenter>
      <div style={{ display: 'none' }}>
        <ReactToPrint
          trigger={() => <button id="print-newproduction-button">Print</button>}
          content={() => componentRef.current}
        />
        <ProductionTicket 
          ref={componentRef} 
          ticketData={printData[0] || {}}
          ticketDetail={printDataDetails || []}
        />
      </div>
      <CompanyInformation>
        <section className='company-info-container'>
          <p className='module-name'>Nueva hoja de producción</p>
        </section>
      </CompanyInformation>
      <Container>
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col span={24}>
            <p style={{ fontSize: 20, margin: 0 }}>{`${getUserLocationName()}`}</p>
          </Col>
          <Col 
            span={24}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}
          >
            <p style={{ margin: '0px 10px 0px 0px' }}>{'Número:'}</p>
            <Input style={{ width: '150px' }} placeholder={'0001'} value={productionDocNumber} onChange={(e) => setProductionDocNumber(e.target.value)} />
          </Col>
          <Col 
            span={24}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}
          >
            <p style={{ margin: '0px 10px 0px 0px' }}>{'Fecha:'}</p>
            <DatePicker 
              locale={locale} 
              format="DD-MM-YYYY HH:mm:ss" 
              value={productionDocDatetime} 
              style={{ width: '250px' }}
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              onChange={(datetimeMoment, datetimeString) => {
                setProductionDocDatetime(datetimeMoment);
              }}
            />
          </Col>

          {/* <Col span={8}></Col>
          <Col span={8}>
            <p style={{ margin: 0, fontWeight: 600 }}>{'Producción del día'}</p>
          </Col>
          <Col span={8}>
            <p style={{ margin: 0, fontWeight: 600 }}>{'Costo de producción por libra (En $)'}</p>
          </Col> */}
        </Row>
        {
          (productionDetailData || []).map((element, index) => {
            return (
              <Row key={index} gutter={[16, 16]} style={{ backgroundColor: index % 2 === 0 ? '#223B66' : '#3E4057', border: '1px solid #223B66', padding: '5px 0px' }}>
                <Col style={{ display: 'flex', alignItems: 'center' }} span={8}>
                  <p style={{ margin: 0, fontSize: 15 }}>{find(entityData, ['productId', element[1]]).productName}</p>
                </Col>
                <Col style={{ display: 'flex', alignItems: 'center' }} span={16}>
                  <Space direction='vertical'>
                    <p style={{ margin: 0, fontSize: 12 }}>{'Producción del día'}</p>
                    <InputNumber 
                      style={{ margin: '2px 0px 2px 0px', 
                      width: '150px' }}
                      onChange={(value) => {
                        let newArr = [...productionDetailData];
                        newArr[index] = [element[0], element[1], +value, element[3]];
                        setProductionDetailData(newArr);
                      }}
                    />
                  </Space>
                  <div style={{ width: 20 }} />
                  <Space direction='vertical'>
                    <p style={{ margin: 0, fontSize: 12 }}>{'Costo por libra (En $)'}</p>
                    <InputNumber 
                      style={{ margin: '2px 0px 2px 0px', 
                      width: '150px' }}
                      onChange={(value) => {
                        let newArr = [...productionDetailData];
                        newArr[index] = [element[0], element[1], element[2], +value];
                        setProductionDetailData(newArr);
                      }}
                    />
                  </Space>
                </Col>
                {/* <Col style={{ display: 'flex', alignItems: 'center' }} span={8}>
                  <Space direction='vertical'>
                    <p style={{ margin: 0, fontSize: 12 }}>{'Costo por libra (En $)'}</p>
                    <InputNumber 
                      style={{ margin: '2px 0px 2px 0px', 
                      width: '150px' }}
                      onChange={(value) => {
                        let newArr = [...productionDetailData];
                        newArr[index] = [element[0], element[1], element[2], +value];
                        setProductionDetailData(newArr);
                      }}
                    />
                  </Space>
                </Col> */}
              </Row>
            )
          })
        }
        <Row style={{ marginTop: 20 }}>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }}>
            <p className={'form-label'}>Adjuntar:</p>
            <Space direction='vertical'>
              <Button icon={<UploadOutlined />} size={'large'} onClick={() => { document.getElementById('g-input-production-file-uploader').click(); }}>
                Seleccionar archivo
              </Button>
              <Tag>{`${productionAttachment !== null ? productionAttachment.name : ''}`}</Tag>
              <Button danger type={'primary'} icon={<DeleteOutlined />} size={'small'} style={{ display: productionAttachment === null ? 'none' : 'inline' }} onClick={() => { setProductionAttachment(null); customNot('warning', 'Archivo removido', 'Adjunto quitado'); }}>
                Quitar
              </Button>
            </Space>
            <input
              type="file" 
              accept='.png, .jpg, .jpeg, .pdf, .xls, .xlsx, .doc, .docx'
              name="g-input-production-file-uploader" 
              id="g-input-production-file-uploader"
              style={{ display: 'none' }}
              onChange={(e) => {
                const [ file ] = e.target.files;
                if (file !== undefined) {
                  setProductionAttachment(file);
                  if (
                    verifyFileExtension(file.name, 'pdf') || 
                    verifyFileExtension(file.name, 'xls') ||
                    verifyFileExtension(file.name, 'xlsx') ||
                    verifyFileExtension(file.name, 'doc') ||
                    verifyFileExtension(file.name, 'docx') ||
                    verifyFileExtension(file.name, 'png') ||
                    verifyFileExtension(file.name, 'jpeg') ||
                    verifyFileExtension(file.name, 'jpg')
                  ) {
                    setAbleToUpload(true);
                    customNot('info', 'Archivo seleccionado', 'Adjunto válido');
                  } else {
                    setAbleToUpload(false);
                    customNot('warning', 'Debe seleccionar un archivo con formato válido', 'Adjunto no válido');
                  }
                } else {
                  setProductionAttachment(null);
                }}
              }
            />
          </Col>
          <Col 
            span={24} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}
          >
            <Space size={'large'}>
              <Button 
                size={'large'}
                onClick={(e) => {
                  navigate('/production')
                }}
              >
                Cancelar
              </Button>
              <Button 
                size={'large'}
                type={'primary'}
                onClick={(e) => {
                  formAction();
                }}
                disabled={fetching}
                loading={fetching}
              >
                Guardar
              </Button>
            </Space>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default NewProductionSheet;
