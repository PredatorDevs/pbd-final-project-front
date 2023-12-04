import React, { useEffect, useState } from 'react';
import { Wrapper } from '../../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CompanyInformation } from '../../styled-components/CompanyInformation';
import { Button, Col, DatePicker, Divider, Input, Row, Space, Spin, Table } from 'antd';
import { TableContainer } from '../../styled-components/TableContainer';
import { columnActionsDef, columnDef, columnIfValueEqualsTo, columnMoneyDef } from '../../utils/ColumnsDefinitions';


import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import { LogoutOutlined, SearchOutlined } from '@ant-design/icons';
import rawMaterialRequisitionsServices from '../../services/RawMaterialRequisitions';
import { customNot } from '../../utils/Notifications';
import { filterData } from '../../utils/Filters';
import productionsServices from '../../services/ProductionsServices';
import ProductionPreview from '../../components/previews/ProductionPreview';
import { getUserLocation } from '../../utils/LocalData';

const { RangePicker } = DatePicker;
const { Search } = Input;

const Container = styled.div`
  background-color: #454D68;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  color: white;
`;

const InnerContainer = styled.div`
  background-color: #3E4057;
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

function ProductionRecords() {
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

  function loadData() {
    setFetching(true);
    productionsServices.findByLocationCurrentActiveShiftcut(getUserLocation())
    .then((response) => {
      setEntityData(response.data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }

  useEffect(() => {
    loadData();
  }, [ entityRefreshData ]);

  function searchByRangeDateAction() {
    if (initialDate.isValid() && finalDate.isValid()) {
      setFetching(true);
      productionsServices.findByLocationRangeDate(
        getUserLocation(), 
        initialDate.format('YYYY-MM-DD'), 
        finalDate.format('YYYY-MM-DD')
      ).then((response) => { 
        setEntityData(response.data);
        setFetching(false);
      }).catch((error) => {
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
          <p className='module-name'>Registros Producción</p>
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
              <Button danger type={'primary'} icon={<LogoutOutlined />} onClick={() => navigate('/production')}>Salir</Button> 
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
          <TableContainer
            // wrapperBgColor={'#223B66'}
            headTextColor={'#FFFFFF'}
            headColor={'#4F567B'}
          >
            <Table
              columns={
                [
                  columnDef({title: 'Código', dataKey: 'productionId'}),
                  columnDef({title: 'Fecha', dataKey: 'docDatetimeFormatted'}),
                  columnDef({title: 'Registrada por', dataKey: 'createdByFullname'}),
                  columnIfValueEqualsTo({title: '', dataKey: 'isVoided', valueToCompare: 1}),
                  columnActionsDef(
                    {
                      title: 'Acciones',
                      dataKey: 'productionId',
                      detail: true,
                      edit: false,
                      // del: true,
                      detailAction: (value) => {
                        setEntitySelectedId(value);
                        setOpenPreview(true);
                      },
                    }
                  ),
                ]
              }
              rowKey={'productionId'}
              dataSource={filterData(entityData, filter, ['productionId', 'createdByFullname']) || []}
              pagination
              size={'small'}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (e) => {
                    e.preventDefault();
                    setEntitySelectedId(record.productionId);
                        setOpenPreview(true);
                  }
                };
              }}
              // footer={{}}
            />
          </TableContainer>
        </InnerContainer>
      </Container>
      <ProductionPreview
        open={openPreview}
        productionId={entitySelectedId}
        onClose={(wasVoided) => {
          setOpenPreview(false);
          if (wasVoided) {
            loadData();
            setEntitySelectedId(0);
          }
        }}
      />
    </Wrapper>
  );
}

export default ProductionRecords;
