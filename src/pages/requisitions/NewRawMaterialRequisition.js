import React, { useEffect, useState, useRef } from 'react';
import { Wrapper } from '../../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Col, DatePicker, Divider, Input, InputNumber, Row, Select, Table, Modal } from 'antd';
import { customNot } from '../../utils/Notifications';

import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import { find, isEmpty } from 'lodash';
import { TableContainer } from '../../styled-components/TableContainer';
import { columnActionsDef, columnDef } from '../../utils/ColumnsDefinitions';
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { CompanyInformation } from '../../styled-components/CompanyInformation';
import usersService from '../../services/UsersService';
import rawMaterialsServices from '../../services/RawMaterialsServices';
import rawMaterialRequisitionsServices from '../../services/RawMaterialRequisitions';
import { getUserId, getUserLocation } from '../../utils/LocalData';
import UserSelector from '../../components/selectors/UserSelector';
import ReactToPrint from 'react-to-print';
import RawMaterialRequisitionTicket from '../../components/tickets/RawMaterialRequisitionTicket';
import CustomerForm from '../../components/forms/CustomerForm';

const { Option } = Select;
const { confirm } = Modal;

const Container = styled.div`
  background-color: #325696;
  border: 1px solid #D1DCF0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  color: white;
`;

const InnerContainer = styled.div`
  background-color: #223B66;
  border: 1px solid #223B66;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 10px;
  width: 100%;
  color: white;
`;

function NewRawMaterialRequisition() {
  const navigate = useNavigate();

  const componentRef = useRef();

  const [fetching, setFetching] = useState(false);
  // const [entityData, setEntityData] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const [printData, setPrintData] = useState([]);
  const [printDataDetails, setPrintDataDetails] = useState([]);
  const [rawMaterialsData, setRawMaterialsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [entityRefreshData, setEntityRefreshData] = useState(0);

  const [givenBySelected, setGivenBySelected] = useState(0);
  const [receivedBySelected, setReceivedBySelected] = useState(0);
  const [docDatetime, setDocDatetime] = useState(defaultDate());
  const [docNumber, setDocNumber] = useState('');
  const [detailSelected, setDetailSelected] = useState(0);
  const [detailQuantity, setDetailQuantity] = useState(null);
  const [docDetails, setDocDetails] = useState([]);

  useEffect(() => {
    setFetching(true);
    usersService.find()
    .then((response) => {
      const { data } = response;
      setUsersData(data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }, [ entityRefreshData ]);

  useEffect(() => {
    setFetching(true);
    rawMaterialsServices.find()
    .then((response) => {
      const { data } = response;
      setRawMaterialsData(data);
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

  function validateData() {
    const validDocDatetime = docDatetime.isValid();
    // const validDocNumber = !isEmpty(docNumber);
    const validGivenBySelected = givenBySelected !== 0 && givenBySelected !== null;
    const validReceivedBySelected = receivedBySelected !== 0 && receivedBySelected !== null;
    const validDocDetals = !isEmpty(docDetails);
    if (!validDocDatetime) customNot('warning', 'Debe seleccionar una fecha válida', 'Dato no válido');
    // if (!validDocNumber) customNot('warning', 'Debe colocar un número de documento', 'Dato no válido');
    if (!validGivenBySelected) customNot('warning', 'Debe seleccionar un proveedor', 'Dato no válido');
    if (!validReceivedBySelected) customNot('warning', 'Debe seleccionar un proveedor', 'Dato no válido');
    if (!validDocDetals) customNot('warning', 'Debe añadir por lo menos un detalle a la compra', 'Dato no válido');
    return (validDocDatetime && validReceivedBySelected && validDocDetals);
  }

  function formAction() {
    if (validateData()) {
      setFetching(true);
      rawMaterialRequisitionsServices.add(
        getUserLocation(),
        getUserId() || 0,
        givenBySelected,
        receivedBySelected,
        docDatetime.format('YYYY-MM-DD HH:mm:ss'),
      )
      .then((response) => {
        // customNot('success', 'Operación exitosa', 'Compra añadida');
        const { insertId } = response.data[0];
        const bulkData = docDetails.map(
          (element) => ([ insertId, element.detailId, element.detailQuantity ])
        );
        rawMaterialRequisitionsServices.details.add(bulkData)
        .then((response) => {
          rawMaterialRequisitionsServices.findById(insertId)
          .then((response) => {
            setPrintData(response.data);
            rawMaterialRequisitionsServices.details.findByRawMaterialRequisitionId(insertId)
            .then((response) => {
              setPrintDataDetails(response.data);
              customNot('info', '', 'Imprimiendo');
              document.getElementById('print-newrawmaterialrequisition-button').click();
              navigate('/requisitions');
              setFetching(false);
            }).catch((error) => {
              // IF THE INFO FETCH FAILS IT RETURNS BACK
              navigate('/requisitions');
              setFetching(false);
              customNot('error', 'Información de venta no encontrada', 'Revise conexión');
            });
          }).catch((error) => {
            // IF THE INFO FETCH FAILS IT RETURNS BACK
            navigate('/requisitions');
            setFetching(false);
            customNot('error', 'Información de venta no encontrada', 'Revise conexión')
          });
          
        }).catch((error) => {
          setFetching(false);
          customNot('error', 'Algo salió mal', 'Detalles de Requisición no añadidos');
        })
      })
      .catch((error) => {
        setFetching(false);
        customNot('error', 'Algo salió mal', 'Requisición no añadido');
      })
    }
  }

  function validateDetail() {
    const validSelectedDetail = detailSelected !== 0 && !!detailSelected;
    const validDetailQuantity = isFinite(detailQuantity) && detailQuantity >= 0;
    if (!validSelectedDetail) customNot('warning', 'Debe seleccionar un detalle para añadir', 'Dato no válido');
    if (!validDetailQuantity) customNot('warning', 'Debe definir una cantidad válida', 'Dato no válido');
    return (validSelectedDetail && validDetailQuantity);
  }

  function pushDetail() {
    if(validateDetail()) {
      const newDetails = [
        ...docDetails,
        { 
          index: docDetails.length,
          detailId: detailSelected, 
          detailName: find(rawMaterialsData, ['id', detailSelected]).name,
          detailQuantity: detailQuantity,
        }
      ]
      setDocDetails(newDetails);
      setDetailSelected(0);
      setDetailQuantity(null);
    }
  }

  function popDetail(index) {
    const newDetail = docDetails;
    newDetail.splice(index, 1);
    setDocDetails(newDetail);
  }

  const columns = [
    columnDef({title: 'Cantidad', dataKey: 'detailQuantity'}),
    columnDef({title: 'Detalle', dataKey: 'detailName'}),
    columnActionsDef(
      {
        title: 'Acciones',
        dataKey: 'index',
        detail: false,
        edit: false,
        del: true,
        delAction: (value) => {
          confirm({
            title: '¿Desea eliminar este detalle?',
            icon: <DeleteOutlined />,
            content: 'Acción irreversible',
            okType: 'danger',
            onOk() { setDocDetails(docDetails.filter((x) => x.index !== value)); },
            onCancel() { },
          });
        },
      }
    ),
  ];

  return (
    <Wrapper xCenter yCenter>
      <div style={{ display: 'none' }}>
        <ReactToPrint
          trigger={() => <button id="print-newrawmaterialrequisition-button">Print</button>}
          content={() => componentRef.current}
        />
        <RawMaterialRequisitionTicket 
          ref={componentRef} 
          ticketData={printData[0] || {}}
          ticketDetail={printDataDetails || []}
        />
      </div>
      <CompanyInformation>
        <section className='company-info-container'>
          <p className='module-name'>Nueva Requisición Materia Prima</p>
        </section>
      </CompanyInformation>
      <Container>
        <Row gutter={[8, 8]}>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
            <InnerContainer>
              <Row gutter={[8, 8]}>
                {/* <Col 
                  xs={{ span: 12 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }} 
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                >
                  <p style={{ margin: '0px 0px 0px 0px' }}>{'Número:'}</p>
                  <Input 
                    style={{ width: '150px' }} 
                    placeholder={'0001'} 
                    value={docNumber} 
                    type={'number'} 
                    onChange={(e) => setDocNumber(e.target.value)} 
                  />
                </Col> */}
                <Col 
                  xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }} 
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                >
                  <p style={{ margin: '0px 0px 0px 0px' }}>{'Fecha:'}</p>
                  <DatePicker 
                    locale={locale} 
                    format="DD-MM-YYYY HH:mm:ss" 
                    value={docDatetime} 
                    style={{ width: '100%' }}
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    onChange={(datetimeMoment, datetimeString) => {
                      setDocDatetime(datetimeMoment);
                    }}
                  />
                </Col>
                <Col span={24} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                  <UserSelector onSelect={(value) => setGivenBySelected(value)} label={'Entrega'} />
                </Col>
                <Col span={24} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                  <UserSelector onSelect={(value) => setReceivedBySelected(value)} label={'Recibe'} />
                </Col>
              </Row>
              <Divider />
              <Button 
                type={'primary'} 
                icon={<SaveOutlined />}
                onClick={(e) => {
                  formAction();
                }}
                disabled={fetching}
                loading={fetching}
              >
                Guardar
              </Button>
              <div style={{ height: '10px' }} />
              <Button 
                type={'primary'} 
                danger
                onClick={(e) => navigate('/requisitions')}
              >
                Cancelar
              </Button>
            </InnerContainer>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 16 }} lg={{ span: 16 }} xl={{ span: 16 }} xxl={{ span: 16 }}>
            <InnerContainer>
              <Row gutter={[8, 8]}>
                <Col span={16}>
                  <p>{'Detalle:'}</p>
                </Col>
                <Col span={8}>
                  <p>{'Cantidad:'}</p>
                </Col>
              </Row>
              <Row gutter={[8, 8]}>
                <Col span={16}>
                  <Select 
                    dropdownStyle={{ width: '100%' }} 
                    style={{ width: '100%' }} 
                    value={detailSelected} 
                    onChange={(value) => setDetailSelected(value)}
                    optionFilterProp='children'
                    showSearch
                    filterOption={(input, option) =>
                      (option.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Option key={0} value={0} disabled>{'No seleccionado'}</Option>
                    {
                      (rawMaterialsData || []).map(
                        (element) => <Option key={element.id} value={element.id}>{element.name}</Option>
                      )
                    }
                  </Select>
                </Col>
                <Col span={4}>
                  <InputNumber 
                    style={{ width: '100%' }} 
                    placeholder={'123'} 
                    value={detailQuantity} 
                    onChange={(value) => setDetailQuantity(value)}
                    type={'number'}
                  />
                </Col>
                <Col span={4}>
                  <Button 
                    style={{ width: '100%' }} 
                    type={'default'} 
                    icon={<PlusOutlined />}
                    onClick={(e) => pushDetail()}
                  >
                    Añadir
                  </Button>
                </Col>
              </Row>
            </InnerContainer>
            <InnerContainer>
              <TableContainer
                headColor={'#223B66'}
                wrapperBgColor={'#223B66'}
                headTextColor={'#FFFFFF'}
              >
                <Table 
                  bordered
                  columns={columns}
                  rowKey={'index'}
                  size={'small'}
                  dataSource={docDetails || []}
                  pagination={false}
                />
              </TableContainer>
            </InnerContainer>
          </Col>
        </Row>
      </Container>
      <CustomerForm 
        open={openForm} 
        updateMode={false}
        dataToUpdate={{}} 
        onClose={(refresh) => { 
          setOpenForm(false);
          if (refresh) { 
            setEntityRefreshData(entityRefreshData => entityRefreshData + 1); 
          }
        }}
      />
    </Wrapper>
  );
}

export default NewRawMaterialRequisition;
