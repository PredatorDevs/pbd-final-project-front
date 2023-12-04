import React, { useEffect, useState } from 'react';
import { Wrapper } from '../../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import { Button, Col, DatePicker, Divider,Modal, Input, InputNumber, Row, Select, Statistic, Table, Space, Tag, Spin, Radio } from 'antd';
import { customNot } from '../../utils/Notifications';

import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import { filter, find, forEach, isEmpty } from 'lodash';
import { columnActionsDef, columnDef, columnMoneyDef } from '../../utils/ColumnsDefinitions';
import suppliersServices from '../../services/SuppliersServices';
import { DeleteOutlined, HomeOutlined, PhoneOutlined, PlusOutlined, SaveOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import SupplierForm from '../../components/forms/SupplierForm';
import CurrentStocks from '../../components/CurrentStocks';
import { getUserLocation } from '../../utils/LocalData';
import generalsServices from '../../services/GeneralsServices';
import { GAddFileIcon, GAddProductIcon, GAddUserIcon, GCashPaymentIcon, GClearIcon, GCreditNoteIcon, GCreditPaymentIcon, GDebitNoteIcon, GInvoice2Icon, GInvoiceTax2Icon, GRefreshIcon, GSearchForIcon, GSupplier2Icon, GTicketIcon } from '../../utils/IconImageProvider';
import { MainMenuCard } from '../../styled-components/MainMenuCard';
import { filterData } from '../../utils/Filters';
import ProductSearchForPurchase from '../../components/ProductSearchForPurchase';
import { numberToLetters } from '../../utils/NumberToLetters';
import productPurchasesServices from '../../services/ProductPurchasesServices';
import { validateArrayData, validateSelectedData, validateStringData } from '../../utils/ValidateData';
import ProductForm from '../../components/forms/ProductForm';
import LocationStockCheckPreview from '../../components/previews/LocationStockCheckPreview';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

const styleSheet = {
  tableFooter: {
    footerCotainer: {
      backgroundColor: '#d9d9d9',
      borderRadius: '5px',
      display: 'flex',
      flexDirection: 'column',
      padding: 5,
      width: '100%',
      height: '100%'
    },
    detailContainer: {
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderRadius: '5px',
      marginBottom: '5px',
      padding: 5,
      width: '100%'
    },
    detailLabels: {
      normal: {
        margin: 0,
        fontSize: 12,
        color: '#434343'
      },
      emphatized: {
        margin: 0,
        fontSize: 12,
        color: '#434343',
        fontWeight: 600
      }
    }
  }
};

function NewProductPurchase() {
  const navigate = useNavigate();

  const [documentTypesData, setDocumentTypesData] = useState([]);
  const [paymentTypesData, setPaymentTypesData] = useState([]);
  const [taxesData, setTaxesData] = useState([]);

  const [documentTypeSelected, setDocumentTypeSelected] = useState(0);
  const [paymentTypeSelected, setPaymentTypeSelected] = useState(0);

  const [fetching, setFetching] = useState(false);

  const [supplierSearchFilter, setSupplierSearchFilter] = useState('');
  const [productSearchFilter, setProductSearchFilter] = useState('');

  const [openSupplierSelector, setOpenSupplierSelector] = useState(false);
  const [openProductSearchForPurchase, setOpenProductSearchForPurchase] = useState(false);
  
  const [openForm, setOpenForm] = useState(false);
  const [openProductForm, setOpenProductForm] = useState(false);
  const [openShowStocks, setOpenShowStocks] = useState(false);
  const [openStockPreview, setOpenStockPreview] = useState(false);
  const [suppliersData, setSuppliersData] = useState([]);

  const [supplierSelected, setSupplierSelected] = useState(0);
  const [docDatetime, setDocDatetime] = useState(defaultDate());
  const [docNumber, setDocNumber] = useState('');
  const [docDetails, setDocDetails] = useState([]);

  const [docIVAretention, setDocIVAretention] = useState(null);
  const [docIVAperception, setDocIVAperception] = useState(null);

  async function loadData() {
    setFetching(true);

    const suppliersResponse = await suppliersServices.find();
    const documentTypesResponse = await generalsServices.findDocumentTypes();
    const paymentTypesResponse = await generalsServices.findPaymentTypes();
    const taxesResponse = await generalsServices.findTaxes();

    setSuppliersData(suppliersResponse.data);
    setDocumentTypesData(documentTypesResponse.data);
    setPaymentTypesData(paymentTypesResponse.data);
    setTaxesData(taxesResponse.data);

    setFetching(false);
  }

  function restoreState() {
    setDocumentTypeSelected(0);
    setPaymentTypeSelected(0);
    setFetching(false);
    setSupplierSearchFilter('');
    setProductSearchFilter('');
    setOpenSupplierSelector(false);
    setOpenProductSearchForPurchase(false);
    setOpenForm(false);
    setOpenProductForm(false);
    setOpenShowStocks(false);
    setOpenStockPreview(false);
    setSupplierSelected(0);
    setDocDatetime(defaultDate());
    setDocNumber('');
    setDocDetails([]);
    setDocIVAperception(null);
    setDocIVAretention(null);
  }

  useEffect(() => {
    loadData();
  }, []);

  function defaultDate() {
    return moment();
  };

  function validateData() {
    const validDocDatetime = docDatetime.isValid();
    if (!validDocDatetime) customNot('warning', 'Debe seleccionar una fecha válida', 'Dato no válido');

    return (
      validDocDatetime
      && validateStringData(docNumber, 'Debe colocar un número de documento')
      && validateSelectedData(documentTypeSelected, 'Debe seleccionar un tipo de documento')
      && validateSelectedData(paymentTypeSelected, 'Debe seleccionar un tipo de pago')
      && validateSelectedData(supplierSelected, 'Debe seleccionar un proveedor')
      && validateArrayData(docDetails, 1, 'Debe añadir por lo menos un detalle a la compra')
    );
  }

  function formAction() {
    if (validateData()) {
      setFetching(true);
      productPurchasesServices.add(
        getUserLocation(),
        supplierSelected,
        documentTypeSelected,
        paymentTypeSelected,
        1,
        docDatetime.format('YYYY-MM-DD HH:mm:ss'),
        docNumber,
        Number(getDetailTotal().toFixed(2)) || 0.00, // TOTAL
        docIVAretention || 0,
        docIVAperception || 0
      )
      .then((response) => {
        customNot('success', 'Operación exitosa', 'Compra añadida');
        const { insertId } = response.data[0];
        const bulkData = docDetails.map(
          (element) => ([ insertId, element.detailId, element.detailUnitCost, element.detailQuantity ])
        );
        productPurchasesServices.details.add(bulkData)
        .then((response) => {
          // navigate('/main/purchases/products/summary');
          customNot('success', 'Operación exitosa', 'Detalles de compra añadidos');
          restoreState();
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

  function pushDetail(data) {
    const newDetails = [ ...docDetails, data ];

    setDocDetails(newDetails);
  }

  // ESTA FUNCION DEVUELVE EL TOTAL DE LOS DETALLES (ASUMIENDO QUE NO INCLUYEN TAX)
  function getDetailTotal() {
    let total = 0;
    forEach(docDetails, (value) => {
      total += (value.detailQuantity * value.detailUnitCost)
    });

    total = total + docIVAperception;
    total = total - docIVAretention;

    return total + ((documentTypeSelected === 1 || documentTypeSelected === 2) ? 0 : getDetailTotalTaxes());
  }

  // ESTA FUNCION DEVUELVE EL SUBTOTAL DE LOS DETALLES QUE SON GRAVADOS (ASUMIENDO QUE NO INCLUYEN TAX)
  function getDetailTaxableTotal() {
    let total = 0;
    forEach(docDetails, (value) => {
      if (value.detailIsTaxable === 1)
        total += (value.detailQuantity * value.detailUnitCost);
    });
    return total || 0;
  }

  // ESTA FUNCION DEVUELVE EL SUBTOTAL DE LOS DETALLES QUE SON EXENTOS (ASUMIENDO QUE NO INCLUYEN TAX)
  function getDetailNoTaxableTotal() {
    let total = 0;
    forEach(docDetails, (value) => {
      if (value.detailIsTaxable === 0)
        total += (value.detailQuantity * value.detailUnitCost);
    });
    return total || 0;
  }

  // ESTA FUNCION DEVUELVE EL TOTAL DE TAXES DE TODOS LOS DETALLES
  function getDetailTotalTaxes() {
    let totalTaxes = 0;
    forEach(docDetails, (docdetail) => {
      if (docdetail.detailIsTaxable === 1) {
        forEach(docdetail.detailTaxesData, (detailtax) => {
          const targetTax = find(taxesData, (x) => x.id === detailtax.taxId);
          
          if (targetTax.isPercentage === 1) {
            let subTotal = (docdetail.detailQuantity * docdetail.detailUnitCost);
            let taxRate = (+targetTax.taxRate);

            totalTaxes += (subTotal * taxRate);
          } else {
            totalTaxes += (docdetail.detailQuantity * ++targetTax.taxRate);
          }
        })
        
      }
    });
    return totalTaxes || 0;
  }

  // ESTA FUNCION DEVUELVE EL TOTAL DE TAXES PARA UN SOLO TAX DE TODOS LOS DETALLES
  function getDetailTotalTaxesById(targetTaxId) {
    let totalTaxes = 0;

    forEach(docDetails, (docdetail) => {
      if (docdetail.detailIsTaxable === 1) {
        forEach(docdetail.detailTaxesData, (detailtax) => {
          if (targetTaxId === detailtax.taxId) {
            const targetTax = find(taxesData, (x) => x.id === targetTaxId);
            if (targetTax.isPercentage === 1) {
              let subTotal = (docdetail.detailQuantity * docdetail.detailUnitCost);
              let taxRate = (+targetTax.taxRate);

              totalTaxes += (subTotal * taxRate);
            } else {
              totalTaxes += (docdetail.detailQuantity * ++targetTax.taxRate);
            }
          }
        })
      }
    });

    return totalTaxes || 0;
  }

  const columns = [
    columnDef({title: 'Cantidad', dataKey: 'detailQuantity'}),
    columnDef({title: 'Detalle', dataKey: 'detailName'}),
    columnMoneyDef({title: 'Costo Unitario', dataKey: 'detailUnitCost'}),
    columnMoneyDef({title: 'Exento', dataKey: 'detailNoTaxableTotal', showDefaultString: true}),
    columnMoneyDef({title: 'Gravado', dataKey: 'detailTaxableTotal', showDefaultString: true}),
    columnActionsDef(
      {
        title: 'Acciones',
        dataKey: 'uuid',
        detail: false,
        edit: false,
        del: true,
        delAction: (value) => {
          if (value)
            confirm({
              title: '¿Desea eliminar este detalle?',
              icon: <DeleteOutlined />,
              content: 'Acción irreversible',
              okType: 'danger',
              onOk() { setDocDetails(docDetails.filter((x) => x.uuid !== value)); },
              onCancel() { },
            });
        },
      }
    ),
  ];

  function getDocumentTypeIcon(type, size = '36px') {
    switch(type) {
      case 1: return <GTicketIcon width={size} />;
      case 2: return <GInvoice2Icon width={size} />;
      case 3: return <GInvoiceTax2Icon width={size} />;
      case 4: return <GCreditNoteIcon width={size} />;
      case 5: return <GDebitNoteIcon width={size} />;
      default: return <GAddFileIcon width={size} />;
    }
  }

  function getPaymentTypeIcon(type, size = '36px') {
    switch(type) {
      case 1: return <GCashPaymentIcon width={size} />;
      case 2: return <GCreditPaymentIcon width={size} />;
      default: return <GAddFileIcon width={size} />;
    }
  }

  return (
    <Wrapper>
      <Row gutter={[8, 8]} style={{ width: '100%' }}>
        <Col
          span={24}
          style={{
            paddingTop: '10px',
            paddingBottom: '10px',
            paddingLeft: '10px',
            paddingRight: '10px',
            backgroundColor: '#e6f4ff',
            borderRadius: '5px'
          }}
        >
          <p style={{ margin: '0px', fontSize: 12 }}>{'Opciones:'}</p>
          <Space wrap>
            <Button
              // type='primary'
              disabled
              onClick={() => restoreState()}
            >
              <Space>
                <GClearIcon width={'16px'} />
                {'Limpiar todo'}
              </Space>
            </Button>
            <Button
              // type='primary'
              onClick={() => loadData()}
            >
              <Space>
                <GRefreshIcon width={'16px'} />
                {'Refrescar'}
              </Space>
            </Button>
            <Button
              // type='primary'
              onClick={() => setOpenProductForm(true)}
            >
              <Space>
                <GAddProductIcon width={'16px'} />
                {'Añadir producto'}
              </Space>
            </Button>
            <Button
              // type='primary'
              onClick={() => setOpenForm(true)}
            >
              <Space>
                <GSupplier2Icon width={'16px'} />
                {'Añadir proveedor'}
              </Space>
            </Button>
            {/* <Button
              // type='primary'
              onClick={() => setOpenForm(true)}
            >
              <Space>
                <GAdd1Icon width={'16px'} />
                {'Añadir producto'}
              </Space>
            </Button> */}
            <Button
              // type='primary'
              onClick={() => setOpenStockPreview(true)}
            >
              <Space>
                <GSearchForIcon width={'16px'} />
                {'Ver existencias'}
              </Space>
            </Button>
          </Space>
        </Col>
        <Col span={12}>
          <p style={{ margin: '0px' }}>{'Documento:'}</p>
          <Space wrap>
            <Radio.Group value={documentTypeSelected} onChange={e => setDocumentTypeSelected(e.target.value)}>
            {
              (filter(documentTypesData, ['enableForPurchases', 1]) || []).map((element) => {
                return (
                  <Radio.Button key={element.id} value={element.id}>
                    <Space>
                    {getDocumentTypeIcon(element.id, '16px')}
                    {element.name}
                    </Space>
                  </Radio.Button>
                )
              })
            }
            </Radio.Group>
          </Space>
        </Col>
        <Col span={12}>
          <p style={{ margin: '0px' }}>{'Pago:'}</p>
          <Space wrap>
            <Radio.Group value={paymentTypeSelected} onChange={e => setPaymentTypeSelected(e.target.value)}>
            {
              (paymentTypesData || []).map((element) => {
                return (
                  <Radio.Button key={element.id} value={element.id}>
                    <Space>
                      {getPaymentTypeIcon(element.id, '16px')}
                      {element.name}
                    </Space>
                  </Radio.Button>
                )
              })
            }
            </Radio.Group>
          </Space>
        </Col>
        <Col span={6}>
          <p style={{ margin: '0px' }}>{'N° Documento:'}</p>
          <Input 
            id='g-new-sale-doc-number-input'
            style={{ width: '100%' }} 
            placeholder={'0001'}
            min={0}
            value={docNumber} 
            type={'number'} 
            onChange={(e) => setDocNumber(e.target.value)}
            // onBlur={(e) => { validateDocNumber(); }}
            onKeyDown={
              (e) => {
                if (e.key === 'Enter')
                  document.getElementById('g-new-sale-datepicker').focus();
              }
            }
          />
        </Col>
        <Col span={6}>
          <p style={{ margin: '0px' }}>{'Fecha:'}</p>
          <DatePicker 
            id={'g-new-sale-datepicker'}
            locale={locale} 
            format="DD-MM-YYYY" 
            value={docDatetime} 
            style={{ width: '100%' }}
            // open={false}
            onFocus={() => {
              document.getElementById('g-new-sale-datepicker').select();
            }}
            onChange={(datetimeMoment, datetimeString) => {
              setDocDatetime(datetimeMoment);
              document.getElementById('g-supplier-new-product-purchase-selector').focus();
            }}
          />
        </Col>
        <Col span={12}>
          <p style={{ margin: '0px' }}>{'Proveedor:'}</p>
          <Select
            id={'g-supplier-new-product-purchase-selector'}
            dropdownStyle={{ width: '100%' }} 
            style={{ width: '100%' }} 
            value={supplierSelected} 
            onChange={(value) => {
              // console.log(value);
              setSupplierSelected(value);
              setSupplierSearchFilter('');
              document.getElementById('newsale-product-search-input').focus();
            }}
            onFocus={() => setOpenSupplierSelector(true)}
            onBlur={() => setOpenSupplierSelector(false)}
            open={openSupplierSelector}
            optionFilterProp='children'
            showSearch
            filterOption={false}
            onSearch={(value) => {
              setSupplierSearchFilter(value);
            }}
          >
            <Option key={0} value={0} disabled>{'No seleccionado'}</Option>
            {
              (filterData(suppliersData, supplierSearchFilter, ['id', 'name', 'phone', 'address']) || []).map(
                (element) => (
                  <Option key={element.id} value={element.id} style={{ borderBottom: '1px solid #E5E5E5'}}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <p style={{ margin: 0 }}>{element.name}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                      <Tag icon={<HomeOutlined />}>{`${element.address || '-'}`}</Tag>
                      <Tag icon={<PhoneOutlined />}>{`${element.phone || '-'}`}</Tag>
                    </div>
                  </Option>
                )
              )
            }
          </Select>
        </Col>
        <Col span={24}></Col>
        <Col span={24}>
          <p style={{ margin: '0px' }}>{'Buscar producto:'}</p>
          <Search
            id={'newsale-product-search-input'}
            name={'filter'}
            value={productSearchFilter} 
            placeholder="Código, Nombre, Cód. Barra"
            allowClear 
            style={{ width: 300 }}
            onChange={(e) => setProductSearchFilter(e.target.value)}
            onSearch={(e) => setOpenProductSearchForPurchase(true)}
            onKeyDown={
              (e) => {
                if (e.key === 'Enter')
                  setOpenProductSearchForPurchase(true);
              }
            }
          />
        </Col>
        <Col span={24}>
          <Table 
            // bordered
            columns={columns}
            rowKey={'uuid'}
            size={'small'}
            dataSource={[ ...docDetails ] || []}
            pagination={false}
            footer={() => {
              return(
                <Row gutter={[8, 8]}>
                  <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 16 }} lg={{ span: 18 }} xl={{ span: 18 }} xxl={{ span: 18 }}>
                    <div style={styleSheet.tableFooter.footerCotainer}>
                      <div style={styleSheet.tableFooter.detailContainer}>
                        <p style={styleSheet.tableFooter.detailLabels.normal}>{`SON:`}</p>
                        <p style={styleSheet.tableFooter.detailLabels.normal}>{`${numberToLetters(getDetailTotal())}`}</p>
                      </div>
                    </div>
                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }} xl={{ span: 6 }} xxl={{ span: 6 }}>
                    <div style={styleSheet.tableFooter.footerCotainer}>
                      <div style={styleSheet.tableFooter.detailContainer}>
                        <p style={styleSheet.tableFooter.detailLabels.normal}>{`GRAVADO`}</p>
                        <p style={styleSheet.tableFooter.detailLabels.normal}>
                          {`$${(getDetailTaxableTotal()).toFixed(2)}`}
                        </p>
                      </div>
                      {
                        (documentTypeSelected === 1 || documentTypeSelected === 2) || isEmpty(taxesData) ? <></> : (
                          taxesData.map((element, index) => {
                            let dataValue = getDetailTotalTaxesById(element.id).toFixed(2);
                            return (
                              <div key={index} style={styleSheet.tableFooter.detailContainer}>
                                <p style={styleSheet.tableFooter.detailLabels.normal}>{`${element.name}`}</p>
                                <p style={styleSheet.tableFooter.detailLabels.normal}>{`$${dataValue}`}</p>
                              </div>
                            );
                          })
                        )
                      }
                      <div style={styleSheet.tableFooter.detailContainer}>
                        <p style={styleSheet.tableFooter.detailLabels.normal}>{`SUBTOTAL`}</p>
                        <p style={styleSheet.tableFooter.detailLabels.normal}>{`$${(getDetailTaxableTotal() + ((documentTypeSelected === 1 || documentTypeSelected === 2) ? 0 : getDetailTotalTaxes())).toFixed(2)}`}</p>
                      </div>
                      <div style={styleSheet.tableFooter.detailContainer}>
                        <p style={styleSheet.tableFooter.detailLabels.normal}>{`EXENTO`}</p>
                        <p style={styleSheet.tableFooter.detailLabels.normal}>{`$${getDetailNoTaxableTotal().toFixed(2)}`}</p>
                      </div>
                      <div style={styleSheet.tableFooter.detailContainer}>
                        <p style={styleSheet.tableFooter.detailLabels.normal}>{`IVA PERCIBIDO (+)`}</p>
                        <InputNumber 
                          prefix={'$'}
                          size='small'
                          id='g-new-productpurchase-iva-perception'
                          style={{ width: '50%' }} 
                          placeholder={''}
                          disabled={docIVAretention !== null || docIVAretention > 0}
                          min={0}
                          value={docIVAperception} 
                          type={'docIVAperception'} 
                          onChange={(value) => setDocIVAperception(value)}
                          onKeyDown={
                            (e) => {
                              if (e.key === 'Enter')
                                document.getElementById('g-new-productpurchase-iva-retention').focus();
                            }
                          }
                        />
                      </div>
                      <div style={styleSheet.tableFooter.detailContainer}>
                        <p style={styleSheet.tableFooter.detailLabels.normal}>{`IVA RETENIDO (-)`}</p>
                        <InputNumber 
                          prefix={'$'}
                          size='small'
                          id='g-new-productpurchase-iva-retention'
                          style={{ width: '50%' }} 
                          placeholder={''}
                          min={0}
                          value={docIVAretention}
                          disabled={docIVAperception !== null || docIVAperception > 0}
                          type={'docIVAretention'} 
                          onChange={(value) => setDocIVAretention(value)}
                        />
                      </div>
                      <div style={styleSheet.tableFooter.detailContainer}>
                        <p style={styleSheet.tableFooter.detailLabels.emphatized}>{`COMPRA TOTAL`}</p>
                        <p style={styleSheet.tableFooter.detailLabels.emphatized}>{`$${getDetailTotal().toFixed(2)}`}</p>
                      </div>
                      <Button
                        size={'large'}
                        type={'primary'}
                        icon={<SaveOutlined />}
                        style={{ margin: 5 }}
                        onClick={() => formAction()}
                        disabled={fetching}
                      >
                        CONFIRMAR
                      </Button>
                    </div>
                  </Col>
                </Row>
              )
            }}
          />
        </Col>
      </Row>
      <ProductSearchForPurchase 
        open={openProductSearchForPurchase} 
        productFilterSearch={productSearchFilter}
        onClose={(purchaseDetailToPush, executePush) => { 
          setOpenProductSearchForPurchase(false);
          if (executePush) {
            pushDetail(purchaseDetailToPush);
          }
          document.getElementById('newsale-product-search-input').focus();
          document.getElementById('newsale-product-search-input').select();
        }}
      />
      <SupplierForm 
        open={openForm} 
        updateMode={false} 
        dataToUpdate={{}}
        onClose={(refresh) => { 
          setOpenForm(false);
          if (refresh) {
            loadData();
          }
        }}
      />
      <ProductForm
        open={openProductForm} 
        updateMode={false} 
        dataToUpdate={{}}
        onClose={(refresh) => { 
          setOpenProductForm(false);
          if (refresh) { 
            loadData();
          }
        }}
      />
      <LocationStockCheckPreview
        open={openStockPreview}
        onClose={(refresh) => { 
          setOpenStockPreview(false);
        }}
      />
      <CurrentStocks 
        open={openShowStocks}
        onClose={() => setOpenShowStocks(false)}
      />
    </Wrapper>
  );
}

export default NewProductPurchase;
