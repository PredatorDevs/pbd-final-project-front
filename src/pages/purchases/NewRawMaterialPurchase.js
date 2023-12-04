import React, { useEffect, useState } from 'react';
import { Wrapper } from '../../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Col, DatePicker, Divider,Modal, Input, InputNumber, Row, Select, Statistic, Table } from 'antd';
import productsServices from '../../services/ProductsServices';
import { customNot } from '../../utils/Notifications';

import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import { find, forEach, isEmpty } from 'lodash';
import { TableContainer } from '../../styled-components/TableContainer';
import { columnActionsDef, columnDef, columnMoneyDef } from '../../utils/ColumnsDefinitions';
import suppliersServices from '../../services/SuppliersServices';
import rawMaterialsServices from '../../services/RawMaterialsServices';
import { DeleteOutlined, PlusOutlined, SaveOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import rawMaterialPurchasesServices from '../../services/RawMaterialPurchasesServices';
import { CompanyInformation } from '../../styled-components/CompanyInformation';
import SupplierForm from '../../components/SupplierForm';
import CurrentStocks from '../../components/CurrentStocks';
import { getUserLocation } from '../../utils/LocalData';

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

function NewRawMaterialPurchase() {
  const navigate = useNavigate();

  const [fetching, setFetching] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openShowStocks, setOpenShowStocks] = useState(false);
  const [suppleirsData, setSuppliersData] = useState([]);
  const [rawMaterialsData, setRawMaterialsData] = useState([]);
  const [entityRefreshData, setEntityRefreshData] = useState(0);

  const [supplierSelected, setSupplierSelected] = useState(0);
  const [docDatetime, setDocDatetime] = useState(defaultDate());
  const [docNumber, setDocNumber] = useState('');
  const [docTotal, setDocTotal] = useState(0.00);
  const [detailSelected, setDetailSelected] = useState(0);
  const [detailQuantity, setDetailQuantity] = useState(null);
  const [detailCost, setDetailCost] = useState(null);
  const [docDetails, setDocDetails] = useState([]);

  useEffect(() => {
    setFetching(true);
    productsServices.find()
    .then((response) => {
      const { data } = response;
      setEntityData(data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Sin información', 'Revise su conexión a la red');
      setFetching(false);
    });
  }, [ entityRefreshData ]);

  useEffect(() => {
    setFetching(true);
    suppliersServices.find()
    .then((response) => {
      const { data } = response;
      setSuppliersData(data);
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
    const validDocNumber = !isEmpty(docNumber);
    const validSupplierSelected = supplierSelected !== 0 && supplierSelected !== null;
    const validDocDetals = !isEmpty(docDetails);
    if (!validDocDatetime) customNot('warning', 'Debe seleccionar una fecha válida', 'Dato no válido');
    if (!validDocNumber) customNot('warning', 'Debe colocar un número de documento', 'Dato no válido');
    if (!validSupplierSelected) customNot('warning', 'Debe seleccionar un proveedor', 'Dato no válido');
    if (!validDocDetals) customNot('warning', 'Debe añadir por lo menos un detalle a la compra', 'Dato no válido');
    return (validDocDatetime && validDocNumber && validSupplierSelected && validDocDetals);
  }

  function formAction() {
    if (validateData()) {
      setFetching(true);
      rawMaterialPurchasesServices.add(
        getUserLocation(),
        supplierSelected,
        docDatetime.format('YYYY-MM-DD HH:mm:ss'),
        docNumber,
        getDetailTotal() || 0.00 // TOTAL
      )
      .then((response) => {
        // customNot('success', 'Operación exitosa', 'Compra añadida');
        const { insertId } = response.data[0];
        const bulkData = docDetails.map(
          (element) => ([ insertId, element.detailId, element.detailCost, element.detailQuantity ])
        );
        rawMaterialPurchasesServices.details.add(bulkData)
        .then((response) => {
          navigate('/purchases');
          setFetching(false);
        }).catch((error) => {
          setFetching(false);
          customNot('error', 'Algo salió mal', 'Detalles de compra no añadidos');
        })
      })
      .catch((error) => {
        setFetching(false);
        customNot('error', 'Algo salió mal', 'Compra no añadida');
      })
    }
  }

  function validateDetail() {
    const validSelectedDetail = detailSelected !== 0 && !!detailSelected;
    const validDetailQuantity = isFinite(detailQuantity) && detailQuantity >= 0;
    const validDetailCost = isFinite(detailCost) && detailCost >= 0;
    if (!validSelectedDetail) customNot('warning', 'Debe seleccionar un detalle para añadir', 'Dato no válido');
    if (!validDetailQuantity) customNot('warning', 'Debe definir una cantidad válida', 'Dato no válido');
    if (!validDetailCost) customNot('warning', 'Debe definir un costo válido', 'Dato no válido');
    return (validSelectedDetail && validDetailQuantity && validDetailCost);
  }

  function pushDetail() {
    if(validateDetail()) {
      const newDetails = [
        ...docDetails,
        { 
          index: docDetails.length + 1,
          detailId: detailSelected, 
          detailName: find(rawMaterialsData, ['id', detailSelected]).name,
          detailQuantity: detailQuantity,
          detailCost: detailCost,
          detailSubTotal: detailQuantity * detailCost
        }
      ]
      setDocDetails(newDetails);
      setDetailSelected(0);
      setDetailQuantity(null);
      setDetailCost(null);
    }
  }

  function getDetailTotal() {
    let total = 0;
    forEach(docDetails, (value) => {
      total += (value.detailQuantity * value.detailCost)
    })
    return total;
  }

  const columns = [
    columnDef({title: 'Cantidad', dataKey: 'detailQuantity'}),
    columnDef({title: 'Detalle', dataKey: 'detailName'}),
    columnMoneyDef({title: 'Costo', dataKey: 'detailCost'}),
    columnMoneyDef({title: 'Subtotal', dataKey: 'detailSubTotal'}),
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
      <CompanyInformation>
        <section className='company-info-container'>
          <p className='module-name'>Nueva compra</p>
        </section>
      </CompanyInformation>
      <Container>
        <Row gutter={[8, 8]}>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
            <InnerContainer>
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <Button icon={<SearchOutlined />} onClick={() => setOpenShowStocks(true)}>Mostrar existencias</Button>
                </Col>
              </Row>
            </InnerContainer>
            <InnerContainer>
              <Row gutter={[8, 8]}>
                <Col 
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
                </Col>
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
                <Col span={18}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                >
                  <p style={{ margin: '0px 0px 0px 0px' }}>{'Proveedor:'}</p>
                  <Select 
                    dropdownStyle={{ width: '100%' }} 
                    style={{ width: '100%' }} 
                    value={supplierSelected} 
                    onChange={(value) => setSupplierSelected(value)}
                    optionFilterProp='children'
                    showSearch
                    filterOption={(input, option) =>
                      (option.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Option key={0} value={0} disabled>{'No seleccionado'}</Option>
                    {
                      (suppleirsData || []).map(
                        (element) => <Option key={element.id} value={element.id}>{element.name}</Option>
                      )
                    }
                  </Select>
                </Col>
                <Col span={6}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}
                >
                  <Button
                    icon={<UserAddOutlined />}
                    onClick={() => setOpenForm(true)}
                  >
                    Añadir
                  </Button>
                </Col>
              </Row>
              <Divider />
              <Statistic 
                title={<p style={{ color: '#FFFFFF', fontSize: 12 }}>Total compra</p>}
                prefix={'$'}
                valueStyle={{ color: '#FFF' }} 
                value={getDetailTotal().toFixed(2)}
              />
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
                onClick={(e) => navigate('/purchases')}
              >
                Cancelar
              </Button>
            </InnerContainer>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 16 }} lg={{ span: 16 }} xl={{ span: 16 }} xxl={{ span: 16 }}>
            <InnerContainer>
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <p>{'Detalle:'}</p>
                </Col>
                <Col span={4}>
                  <p>{'Cantidad:'}</p>
                </Col>
                <Col span={4}>
                  <p>{'Costo:'}</p>
                </Col>
                <Col span={4}>
                  <p>{'SubTotal:'}</p>
                </Col>
              </Row>
              <Row gutter={[8, 8]}>
                <Col span={10}>
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
                  <InputNumber 
                    style={{ width: '100%' }} 
                    placeholder={'1.25'} 
                    value={detailCost} 
                    onChange={(value) => setDetailCost(value)}
                    type={'number'}
                  />
                </Col>
                <Col span={3}>
                  <p>{`$${Number(detailCost * detailQuantity).toFixed(2) || 0.00}`}</p>
                </Col>
                <Col span={3}>
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
      <SupplierForm 
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
      <CurrentStocks 
        open={openShowStocks}
        onClose={() => setOpenShowStocks(false)}
      />
    </Wrapper>
  );
}

export default NewRawMaterialPurchase;
