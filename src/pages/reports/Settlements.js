import React, { useEffect, useState } from 'react';
import { Wrapper } from '../../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CompanyInformation } from '../../styled-components/CompanyInformation';
import { Button, Col, Input, Row, Space, Table } from 'antd';
import { TableContainer } from '../../styled-components/TableContainer';
import { columnDef, columnMoneyDef } from '../../utils/ColumnsDefinitions';

import { FilePdfTwoTone, LogoutOutlined, PrinterFilled } from '@ant-design/icons';
import { customNot } from '../../utils/Notifications';
import { filterData } from '../../utils/Filters';
import shiftcutsService from '../../services/ShiftcutsServices';

import { BlobProvider } from '@react-pdf/renderer';
import SettlementPDF from '../../components/reports/SettlementPDF';
import { includes } from 'lodash';
import { getUserLocation, getUserRole } from '../../utils/LocalData';
import LocationSelector from '../../components/selectors/LocationSelector';
import reportsServices from '../../services/ReportsServices';
import download from 'downloadjs';

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

function Settlements() {
  const navigate = useNavigate();

  const [fetching, setFetching] = useState(false);
  const [filter, setFilter] = useState('');
  const [entityData, setEntityData] = useState([]);
  const [entityRefreshData, setEntityRefreshData] = useState(0);
  const [locationSelected, setLocationSelected] = useState(getUserLocation());

  const [entityDataToPrint, setEntityDataToPrint] = useState([]);

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    loadData(getUserLocation());
  }, []);

  async function loadData(locationId) {
    try {
      setFetching(true);
      const res = await shiftcutsService.settlementsByLocation(locationId);
      setEntityData(res.data);
      setFetching(false);
    } catch(err) {
      setFetching(false);
      console.log(err);
    }
  }

  return (
    <Wrapper>
      <Row gutter={[8, 8]} style={{ width: '100%' }}>
        <Col span={12}>
          <LocationSelector
            label={'Sucursal:'}
            onSelect={(value) => {
              setLocationSelected(value);
              loadData(value);
            }}
          />
        </Col>
        <Col span={24}>
          <Table
            columns={
              [
                columnDef({title: 'Cod', dataKey: 'shiftcutId'}),
                columnDef({title: 'Caja', dataKey: 'cashierName'}),
                columnDef({title: 'Número', dataKey: 'shiftcutNumber'}),
                columnDef({title: 'Apertura', dataKey: 'openedAt'}),
                columnDef({title: 'Cierre', dataKey: 'shiftcutDatetime'}),
                columnMoneyDef({title: 'Inicial', dataKey: 'initialAmount'}),
                columnMoneyDef({title: 'Final', dataKey: 'finalAmount'}),
                columnMoneyDef({title: 'Entregado', dataKey: 'remittedAmount'}),
                {
                  title: <p style={{ margin: '0px', fontSize: 12, fontWeight: 600 }}>{'Opciones'}</p>,
                  dataIndex: 'id',
                  key: 'id',
                  align: 'right',
                  render: (text, record, index) => {
                    return (
                      <Space>
                        <Button
                          icon={<FilePdfTwoTone twoToneColor={'red'} />}
                          onClick={async (e) => {
                            setFetching(true);
                            try {
                              const res = await reportsServices.shiftcutSettlement(record.shiftcutId);

                              download(res.data, `Corte${record.shiftcutNumber}${record.cashierName}${record.locationName}.pdf`.replace(/ /g,''));
                            } catch(error) {

                            }
                            setFetching(false);
                          }}
                        />
                      </Space>
                    )
                  }
                },
              ]
            }
            rowKey={'shiftcutId'}
            dataSource={filterData(entityData, filter, ['shiftcutNumber']) || []}
            pagination
            size={'small'}
            loading={fetching}
          />
        </Col>
      </Row>
      {/* <div style={{ display: 'none' }}>
        <BlobProvider
          document={<SettlementPDF reportData={entityDataToPrint} hellNo={counter} />}
        >
          {({ blob, url, loading, error }) => {
            // Do whatever you need with blob here
            return <a href={url} id={'print-settlement1-button'} target="_blank" rel="noreferrer">Open in new tab</a>;
          }}
        </BlobProvider>
      </div>
      <CompanyInformation>
        <section className='company-info-container'>
          <p className='module-name'>Liquidaciones</p>
        </section>
      </CompanyInformation>
      <Container>
        <InnerContainer>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Button loading={fetching} disabled={fetching} danger type={'primary'} icon={<LogoutOutlined />} onClick={() => navigate('/reports')}>Salir</Button> 
            </Col>
          </Row>
        </InnerContainer>
        <InnerContainer>
          <Search
            name={'filter'} 
            value={filter} 
            placeholder="" 
            allowClear 
            style={{ width: 300 }}
            onChange={(e) => setFilter(e.target.value)}
          />
          <p style={{ margin: 0, fontSize: 9 }}>Búsqueda por: Número - Cliente - Tipo - Estado</p>
          <div style={{ height: 10 }} />
          <TableContainer>
            <Table
              columns={
                [
                  columnDef({title: 'Número', dataKey: 'shiftcutNumber'}),
                  columnDef({title: 'Apertura', dataKey: 'openedAt'}),
                  columnDef({title: 'Cierre', dataKey: 'shiftcutDatetime'}),
                  columnMoneyDef({title: 'Inicial', dataKey: 'initialAmount'}),
                  columnMoneyDef({title: 'Final', dataKey: 'finalAmount'}),
                  columnMoneyDef({title: 'Remesado', dataKey: 'remittedAmount'}),
                  {
                    title: <p style={{ margin: '0px', fontSize: 12, fontWeight: 600 }}>{'Opciones'}</p>,
                    dataIndex: 'id',
                    key: 'id',
                    align: 'right',
                    render: (text, record, index) => {
                      return (
                        <Space>
                          {
                            includes([1, 2, 3, 4], getUserRole()) ? 
                            <Button
                              type="primary"
                              size="small"
                              icon={<PrinterFilled />}
                              onClick={() => {
                                setFetching(true);
                                customNot('info', 'Generando reporte', 'Esto tomará unos segundos')
                                shiftcutsService.settlementsById(record.shiftcutId)
                                .then((response) => {
                                  setEntityDataToPrint(response.data);
                                  setCounter(counter + 1);
                                  setTimeout(() => {
                                    document.getElementById('print-settlement1-button').click();
                                    setFetching(false);
                                  }, 1000);
                                }).catch((error) => {
                                  customNot('error', 'Información de liquidación no encontrada', 'Revise conexión')
                                  setFetching(false);
                                });
                              }}
                            />
                             : <>
                            
                            </>
                          }
                        </Space>
                      )
                    }
                  },
                ]
              }
              rowKey={'shiftcutId'}
              dataSource={filterData(entityData, filter, ['shiftcutNumber']) || []}
              pagination
              size={'small'}
            />
          </TableContainer>
        </InnerContainer>
      </Container> */}
    </Wrapper>
  );
}

export default Settlements;
