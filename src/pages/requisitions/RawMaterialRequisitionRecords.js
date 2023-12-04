import React, { useEffect, useState } from 'react';
import { Wrapper } from '../../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CompanyInformation } from '../../styled-components/CompanyInformation';
import { Button, Col, DatePicker, Divider, Input, Row, Space, Spin, Table } from 'antd';
import { TableContainer } from '../../styled-components/TableContainer';
import { columnActionsDef, columnDef, columnMoneyDef } from '../../utils/ColumnsDefinitions';


import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import { LogoutOutlined, SearchOutlined } from '@ant-design/icons';
import rawMaterialRequisitionsServices from '../../services/RawMaterialRequisitions';
import { customNot } from '../../utils/Notifications';
import { filterData } from '../../utils/Filters';
import RawMaterialRequisitionPreview from '../../components/previews/RawMaterialRequisitionPreview';
import { getUserLocation } from '../../utils/LocalData';

const { RangePicker } = DatePicker;
const { Search } = Input;

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

const SearchOption = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

function RawMaterialRequisitionsRecords() {
  const navigate = useNavigate();

  function defaultDate() {
    return moment();
  };

  const [fetching, setFetching] = useState(false);
  const [filter, setFilter] = useState('');
  const [entityData, setEntityData] = useState([]);
  const [entityRefreshData, setEntityRefreshData] = useState(0);
  const [entitySelectedId, setEntitySelectedId] = useState(0);
  const [openPreview, setOpenPreview] = useState(false);

  const [initialDate, setInitialDate] = useState(defaultDate());
  const [finalDate, setFinalDate] = useState(defaultDate());

  useEffect(() => {
    setFetching(true);
    rawMaterialRequisitionsServices.findByLocationCurrentActiveShiftcut(getUserLocation())
    .then((response) => { 
      setEntityData(response.data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }, [ entityRefreshData ]);

  function searchByRangeDateAction() {
    if (initialDate.isValid() && finalDate.isValid()) {
      setFetching(true);
      rawMaterialRequisitionsServices.findByLocationRangeDate(getUserLocation(), initialDate.format('YYYY-MM-DD'), finalDate.format('YYYY-MM-DD'))
      .then((response) => { 
        setEntityData(response.data);
        setFetching(false);
      })
      .catch((error) => {
        customNot('error', 'Sin información', 'Revise su conexión a la red');
        setFetching(false);
      });
    } else {
      customNot('warning', 'Fechas no definidas', 'Debe colocar fechas correctas para la búsqueda')
    }
  }

  return (
    <Wrapper xCenter>
      <CompanyInformation>
        <section className='company-info-container'>
          <p className='module-name'>Registros Requisiciones Materia Prima</p>
        </section>
      </CompanyInformation>
      <Container>
        <InnerContainer>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <p style={{ margin: 0 }}>Por fecha</p>
              <SearchOption>
                <Space>
                  <RangePicker 
                    locale={locale} 
                    format={["DD-MM-YYYY", "DD-MM-YYYY"]}
                    value={[initialDate, finalDate]} 
                    style={{ width: '100%' }}
                    onChange={([initialMoment, finalMoment], [initialString, finalString]) => {
                      setInitialDate(initialMoment);
                      setFinalDate(finalMoment);
                    }}
                  />
                  <Button icon={<SearchOutlined />} onClick={() => searchByRangeDateAction()}>Buscar</Button>
                  {fetching ? <Spin /> : <></>}
                </Space>
              </SearchOption>
            </Col>
            <Col span={12}>
              <Button danger type={'primary'} icon={<LogoutOutlined />} onClick={() => navigate('/requisitions')}>Salir</Button> 
            </Col>
          </Row>
          <p style={{ margin: 0, marginTop: 5 }}>Filtrar</p>
          <SearchOption>
            <Search
              name={'filter'} 
              value={filter} 
              placeholder="" 
              allowClear 
              style={{ width: 300 }}
              onChange={(e) => setFilter(e.target.value)}
            />
          </SearchOption>
        </InnerContainer>
        <InnerContainer>
          <TableContainer>
            <Table
              columns={
                [
                  columnDef({title: 'Código', dataKey: 'rawMaterialRequisitionId'}),
                  columnDef({title: 'Fecha', dataKey: 'docDatetime'}),
                  columnDef({title: 'Registrada por', dataKey: 'registeredByFullname'}),
                  columnDef({title: 'Entrega', dataKey: 'givenByFullname'}),
                  columnDef({title: 'Recibe', dataKey: 'receivedByFullname'}),
                  columnActionsDef(
                    {
                      title: 'Acciones',
                      dataKey: 'rawMaterialRequisitionId',
                      edit: false,
                      detailAction: (value) => {
                        setEntitySelectedId(value);
                        setOpenPreview(true);
                      },
                    }
                  ),
                ]
              }
              rowKey={'rawMaterialRequisitionId'}
              dataSource={filterData(entityData, filter, ['rawMaterialRequisitionId', 'registeredByFullname', 'givenByFullname', 'receivedByFullname']) || []}
              pagination
              size={'small'}
            />
          </TableContainer>
        </InnerContainer>
      </Container>
      <RawMaterialRequisitionPreview 
        open={openPreview}
        rawMaterialRequisitionId={entitySelectedId}
        onClose={() => setOpenPreview(false)}
      />
    </Wrapper>
  );
}

export default RawMaterialRequisitionsRecords;
