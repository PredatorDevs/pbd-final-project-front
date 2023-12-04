import React, { useEffect, useState, useRef } from 'react';
import { Wrapper } from '../../styled-components/Wrapper';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, DatePicker, Divider, Input, InputNumber, Row, Select, Table, Modal, Space, Tag, Result, Radio, Alert } from 'antd';
import { customNot } from '../../utils/Notifications';

import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import { filter, find, forEach, includes, isEmpty } from 'lodash';
import { columnActionsDef, columnDef, columnMoneyDef } from '../../utils/ColumnsDefinitions';
import { CloseOutlined, DeleteOutlined, DollarCircleOutlined, EditOutlined, HomeOutlined, PhoneOutlined, SaveOutlined, UserAddOutlined } from '@ant-design/icons';
import customersServices from '../../services/CustomersServices';
import salesServices from '../../services/SalesServices';
import CustomerForm from '../../components/forms/CustomerForm';
import { getUserId, getUserLocation, getUserLocationName, getUserLocationSalesSerie, getUserLocationSalesSerieCCF, getUserMyCashier } from '../../utils/LocalData';
import SaleTicket from '../../components/tickets/SaleTicket';
import ReactToPrint from 'react-to-print';
import ConsumidorFinal from '../../components/invoices/ConsumidorFinal';
import generalsServices from '../../services/GeneralsServices';
import CFFInvoice from '../../components/invoices/CFFInvoice';
import { numberToLetters } from '../../utils/NumberToLetters';
import { printerServices } from '../../services/PrintersServices';
import { MainMenuCard } from '../../styled-components/MainMenuCard';
import { GAdd1Icon, GAddFileIcon, GAddUserIcon, GCashPaymentIcon, GClearIcon, GCreditNoteIcon, GCreditPaymentIcon, GDebitNoteIcon, GEditUserIcon, GInvoice2Icon, GInvoiceTax2Icon, GRefreshIcon, GSearchForIcon, GTicketIcon } from '../../utils/IconImageProvider';
import { filterData } from '../../utils/Filters';
import ProductSearchForSale from '../../components/ProductSearchForSale';
import cashiersServices from '../../services/CashiersServices';
import LocationStockCheckPreview from '../../components/previews/LocationStockCheckPreview';
import locationsService from '../../services/LocationsServices';
import ProductSearchForTransfer from '../../components/ProductSearchForTransfer';
import transfersServices from '../../services/TransfersServices';
import { validateSelectedData } from '../../utils/ValidateData';

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

function NewTransfer() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const ticketComponentRef = useRef();
  const cfComponentRef = useRef();
  const ccfComponentRef = useRef();

  // const [counter, setCounter] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openStockPreview, setOpenStockPreview] = useState(false);

  const [productSearchFilter, setProductSearchFilter] = useState('');

  const [openProductSearchForTransfer, setOpenProductSearchForTransfer] = useState(false);
  
  const [printData, setPrintData] = useState([]);
  const [printDataDetails, setPrintDataDetails] = useState([]);

  const [locationsData, setLocationsData] = useState([]);

  const [destinationLocationId, setDestinationLocationId] = useState(0);

  const [customerSelected, setCustomerSelected] = useState(0);
  const [customerUpdateMode, setCustomerUpdateMode] = useState(false);
  const [customerToUpdate, setCustomerToUpdate] = useState({});
  const [validDocNumberAndSerie, setValidDocNumberAndSerie] = useState(true);
  
  const [documentTypeSelected, setDocumentTypeSelected] = useState(0);
  const [paymentTypeSelected, setPaymentTypeSelected] = useState(0);

  const [docDatetime, setDocDatetime] = useState(defaultDate());
  const [docNumber, setDocNumber] = useState('');
  const [docType, setDocType] = useState(1);
  const [docDetails, setDocDetails] = useState([]);

  const [docIVAretention, setDocIVAretention] = useState(null);
  const [docIVAperception, setDocIVAperception] = useState(null);

  function restoreState() {
    setFetching(false);
    setOpenForm(false);
    setOpenStockPreview(false);
    setProductSearchFilter('');
    setOpenProductSearchForTransfer(false);
    setDestinationLocationId(0);
    setPrintData([]);
    setPrintDataDetails([]);
    setCustomerSelected(0);
    setCustomerUpdateMode(false);
    setCustomerToUpdate({});
    setValidDocNumberAndSerie(false);
    setDocumentTypeSelected(0);
    setPaymentTypeSelected(0);
    setDocDatetime(defaultDate());
    setDocNumber('');
    setDocType(1);
    setDocDetails([]);
    setDocIVAperception(null);
    setDocIVAretention(null);
  }

  async function loadData() {
    try {
      setFetching(true);
      const locationRes = await locationsService.find();
      setLocationsData(locationRes.data);
      setFetching(false);
    } catch(err) {
      setFetching(false);
      console.log(err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function defaultDate() {
    return moment();
  };

  function isValidDetail(element) {
    return (element.detailQuantity > 0) && (element.detailUnitPrice >= 0);
  }

  function validateData() {
    const validDocDetals = !isEmpty(docDetails);
    const validDocDetailsIntegrity = docDetails.every(isValidDetail);
    if (!validDocDetals) customNot('warning', 'Debe añadir por lo menos un detalle al traslado', 'Dato no válido');
    if (!validDocDetailsIntegrity) customNot('warning', 'Los datos en el detalle no son admitidos', 'Dato no válido');
    return (
      validDocDetals && validDocDetailsIntegrity 
      && validateSelectedData(destinationLocationId, 'Debe seleccionar una sucursal a la que mandar el traslado')
    );
  }

  async function formAction() {
    if (validateData()) {
      setFetching(true);

      // START THE PROCESS OF SAVE THE SALE
      const transferRes = await transfersServices.add(
        getUserLocation(),
        destinationLocationId,
        getUserId(),
        moment().format('YYYY-MM-DD HH:mm:ss'),
        1
      );

      const { insertId } = transferRes.data;
    
      // transferId, productId, quantityExpected, quantityConfirmed, status
      const bulkData = docDetails.map((element) => ([ insertId, element.detailId, element.detailQuantity, 0, 1 ]));

      const saleDetailResponse = await transfersServices.addDetails(bulkData);
      
      restoreState();

      window.scrollTo(0, 0);
    }
  }

  function pushDetail(data) {
    const newDetails = [ ...docDetails, data ];

    setDocDetails(newDetails);
  }

  function getQuantitySumProductDetail(productId) {
    let sum = 0;
    forEach(docDetails, (x, index) => {
      sum += x.detailId === productId ? x.detailQuantity : 0;
    });
    return sum;
  }

  function getDetailTotal() {
    let total = 0;
    forEach(docDetails, (value) => {
      total += (value.detailQuantity * value.detailUnitPrice)
    });

    total = total + docIVAperception;
    total = total - docIVAretention;
    
    return total || 0;
  }

  const columns = [
    columnDef({title: 'Cantidad', dataKey: 'detailQuantity'}),
    columnDef({title: 'Detalle', dataKey: 'detailName'}),
    // columnMoneyDef({title: 'Precio Unitario', dataKey: (documentTypeSelected === 1 || documentTypeSelected === 2) ? 'detailUnitPrice' : 'detailUnitPriceWithoutTax'}),
    // columnMoneyDef({title: 'Exento', dataKey: 'detailNoTaxableTotal', showDefaultString: true}),
    // columnMoneyDef({title: 'Gravado', dataKey: (documentTypeSelected === 1 || documentTypeSelected === 2) ? 'detailTaxableTotal' : 'detailTaxableWithoutTaxesTotal', showDefaultString: true}),
    // columnMoneyDef({title: 'GravadoNoTaxes', dataKey: 'detailTaxableWithoutTaxesTotal', showDefaultString: true}),
    // columnMoneyDef({title: 'Taxes', dataKey: 'detailTotalTaxes', showDefaultString: true}),
    columnActionsDef(
      {
        title: 'Acciones',
        dataKey: 'uuid',
        detail: false,
        edit: false,
        del: true,
        delAction: (value) => {
          confirm({
            centered: true,
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
      <div style={{ display: 'none' }}>
        <ReactToPrint
          trigger={() => <button id="print-newsale-button">Print</button>}
          content={() => ticketComponentRef.current}
        />
        <SaleTicket 
          ref={ticketComponentRef} 
          ticketData={printData[0] || {}}
          ticketDetail={printDataDetails || []}
        />
      </div>
      <div style={{ display: 'none' }}>
        <ReactToPrint
          trigger={() => <button id="print-newsale-cf-button">Print</button>}
          content={() => cfComponentRef.current}
        />
        <ConsumidorFinal
          ref={cfComponentRef} 
          ticketData={printData[0] || {}}
          ticketDetail={printDataDetails || []}
        />
      </div>
      <div style={{ display: 'none' }}>
        <ReactToPrint
          trigger={() => <button id="print-newsale-ccf-button">Print</button>}
          content={() => ccfComponentRef.current}
        />
        <CFFInvoice 
          ref={ccfComponentRef} 
          ticketData={printData[0] || {}}
          ticketDetail={printDataDetails || []}
        />
      </div>
      <Row gutter={[8, 4]} style={{ width: '100%' }}>
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
          </Space>
        </Col>
        <Col span={12}>
          <p style={{ margin: 0 }}>Traslado desde:</p>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{getUserLocationName()}</p>
        </Col>
        <Col span={12}>
          <p style={{ margin: 0 }}>Enviar traslado a:</p>
          <Select
            dropdownStyle={{ width: '100%' }} 
            style={{ width: '100%' }} 
            value={destinationLocationId} 
            onChange={(value) => {
              setDestinationLocationId(value);
              // loadData(value);
            }}
            optionFilterProp='children'
            showSearch
            filterOption={(input, option) =>
              (option.children).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option key={0} value={0} disabled>{'Seleccione sucursal'}</Option>
            {
              (locationsData || []).map(
                (element) => <Option key={element.id} value={element.id} disabled={element.id === getUserLocation()} >{element.name}</Option>
              )
            }
          </Select>
        </Col>
        <Col span={24} />
        <Col span={24}>
          <p style={{ margin: '0px', fontSize: 12 }}>{'Buscar producto:'}</p>
          <Search
            id={'newsale-product-search-input'}
            name={'filter'} 
            value={productSearchFilter} 
            placeholder="Código, Nombre, Cód. Barra"
            allowClear
            disabled={!(docDetails.length < 18)}
            style={{ width: 300, marginBottom: 5 }}
            onChange={(e) => setProductSearchFilter(e.target.value)}
            onSearch={() => setOpenProductSearchForTransfer(true)}
            onKeyDown={
              (e) => {
                if (e.key === 'Enter')
                  setOpenProductSearchForTransfer(true);
              }
            }
          />
          {!(docDetails.length < 18) ? <Alert message="Ha llegado al máximo de articulos que puede facturar por cada venta" type="warning" /> : <></>}
        </Col>
        <Col span={24} />
        <Col span={24}>
          <Table 
            bordered
            loading={fetching}
            columns={columns}
            rowKey={'uuid'}
            size={'small'}
            dataSource={[
              ...docDetails
            ] || []}
            pagination={false}
            footer={() => {
              return(
                <Row gutter={[8, 4]}>
                  <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }} xl={{ span: 6 }} xxl={{ span: 6 }}>
                    {/* <Space wrap direction='horizontal'> */}
                    <Button
                        type={'primary'}
                        icon={<SaveOutlined />}
                        style={{ margin: 5 }}
                        onClick={() => formAction()}
                        disabled={fetching}
                      >
                        CONFIRMAR TRASLADO
                      </Button>
                      <Button
                        danger
                        icon={<CloseOutlined />}
                        style={{ margin: 5 }}
                        onClick={() => formAction()}
                        disabled={fetching}
                      >
                        CANCELAR OPERACIÓN
                      </Button>
                    {/* </Space> */}
                  </Col>
                </Row>
              )
            }}
          />
        </Col>
      </Row>
      <ProductSearchForTransfer
        open={openProductSearchForTransfer} 
        priceScale={1}
        productFilterSearch={productSearchFilter}
        onClose={(saleDetailToPush, executePush, currentStock) => { 
          setOpenProductSearchForTransfer(false);
          const { detailId, detailName, detailQuantity, detailIsService } = saleDetailToPush;
          const currentDetailQuantity = getQuantitySumProductDetail(detailId);
          if (executePush) {
            if (!(currentStock < (currentDetailQuantity + detailQuantity)) || detailIsService) {
              pushDetail(saleDetailToPush);
            } else {
              customNot(
                'error',
                `No puede añadir más ${detailName}`,
                `Solo hay ${currentStock} y ya ha añadido ${currentDetailQuantity} por lo que no se pueden añadir ${detailQuantity} más`
              );
            }
          }
          document.getElementById('newsale-product-search-input').focus();
          document.getElementById('newsale-product-search-input').select();
        }}
      />
      <CustomerForm
        open={openForm} 
        updateMode={customerUpdateMode}
        dataToUpdate={customerToUpdate}
        showDeleteButton={false}
        onClose={(refresh) => { 
          setOpenForm(false);
          setCustomerUpdateMode(false);
          setCustomerToUpdate({});
          if (refresh) { 
            document.getElementById('g-customer-new-sale-selector').focus();
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
    </Wrapper>
  );
}

export default NewTransfer;
