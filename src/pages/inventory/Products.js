import React, { useState, useEffect } from 'react';
import { Button, Col, Input, Row, Select, Space, Table, Tooltip } from 'antd';
import { ClearOutlined, DollarCircleTwoTone, EditTwoTone, FilePdfTwoTone, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { find, includes } from 'lodash';

import productsServices from '../../services/ProductsServices.js';

import { Wrapper } from '../../styled-components/Wrapper';

import { filterData } from '../../utils/Filters';
import { columnActionsDef, columnDef, columnIfValueEqualsTo, columnMoneyDef } from '../../utils/ColumnsDefinitions';
import ProductForm from '../../components/forms/ProductForm.js';
import { getUserLocation, getUserRole } from '../../utils/LocalData.js';
import categoriesServices from '../../services/CategoriesServices.js';
import brandsServices from '../../services/BrandsServices.js';
import locationsService from '../../services/LocationsServices.js';
import reportsServices from '../../services/ReportsServices.js';
import download from 'downloadjs';
import { customNot } from '../../utils/Notifications.js';
import ProductPricePreview from '../../components/previews/ProductPricePreview.js';

const { Search } = Input;
const { Option } = Select;

function Products() {
  const [fetching, setFetching] = useState(false);
  const [filter, setFilter] = useState('');

  const [openPricePreview, setOpenPricePreview] = useState(false);
  const [productIdSelected, setProductIdSelected] = useState(0);

  const [locationsData, setLocationsData] = useState([]);
  const [locationSelectedId, setLocationSelectedId] = useState(getUserLocation());

  const [categoriesData, setCategoriesData] = useState([]);
  const [categorySelectedId, setCategorySelectedId] = useState(0);

  const [brandsData, setBrandsData] = useState([]);
  const [brandSelectedId, setBrandSelectedId] = useState(0);

  const [openForm, setOpenForm] = useState(false);
  const [formUpdateMode, setFormUpdateMode] = useState(false);

  const [entityData, setEntityData] = useState([]);
  const [entityToUpdate, setEntityToUpdate] = useState({});

  async function loadData(locationId) {
    setFetching(true);
    try {
      const response = await productsServices.findByLocationStockData(locationId);
      setEntityData(response.data);
    } catch(error) {
      console.log(error);
    }
    setFetching(false);
  }

  async function loadGenData() {
    setFetching(true);
    try {
      const locRes = await locationsService.find();
      const catRes = await categoriesServices.find();
      const brandRes = await brandsServices.find();

      setLocationsData(locRes.data);
      setCategoriesData(catRes.data);
      setBrandsData(brandRes.data);
    } catch(error) {
      console.log(error);
    }
    setFetching(false);
  }

  useEffect(() => {
    loadData(locationSelectedId);
    loadGenData();
  }, []);

  async function fetchReportByCategories() {
    setFetching(true);
    try {
      const res = await reportsServices.getLocationProductsByCategory(locationSelectedId);
      /*
      const blob = res.data;
      const blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
      */
      download(res.data, `ProductosPorCategoria.pdf`);
    } catch(error) {
      console.log(error);
    }
    setFetching(false);
  }

  async function fetchReportByBrands() {
    setFetching(true);
    try {
      const res = await reportsServices.getLocationProductsByBrand(locationSelectedId);
      /*
      const blob = res.data;
      const blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
      */
      download(res.data, `ProductosPorMarca.pdf`);
    } catch(error) {
      console.log(error);
    }
    setFetching(false);
  }

  async function fetchReportByFilteredData() {
    setFetching(true);
    try {
      const res = await reportsServices.getLocationProductsByFilteredData(
        filterData(
          entityData.filter(filterByFilters),
          filter,
          [
            'productName'
          ]
        ) || []
      );
      /*
      const blob = res.data;
      const blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
      */
      download(res.data, `ProductosPorFiltroPersonalizado.pdf`);
    } catch(error) {
      console.log(error);
    }
    setFetching(false);
  }

  const columns = [
    columnDef({title: 'Id', dataKey: 'productId'}),
    columnIfValueEqualsTo({title: '', dataKey: 'productIsService', text: 'Servicio', valueToCompare: 1, color: 'blue' }),
    columnDef({title: 'Nombre', dataKey: 'productName'}),
    columnDef({title: 'Existencias', dataKey: 'currentLocationStock'}),
    columnDef({title: 'Contenido', dataKey: 'packageContent'}),
    {
      title: <p style={{ margin: '0px', fontSize: 12, fontWeight: 600 }}>{'Existencia General'}</p>,
      dataIndex: 'productId',
      key: 'productId',
      align: 'left',
      render: (text, record, index) => {
        return (
          <p style={{ margin: '0px', fontSize: 12 }}>
            {Number(+record.currentLocationStock / +record.packageContent).toFixed(2)}
          </p>
        )
      }
    },
    columnDef({title: 'Categoria', dataKey: 'productCategoryName'}),
    columnDef({title: 'Marca', dataKey: 'productBrandName'}),
    columnDef({title: 'Ud. Min. Medida', dataKey: 'productMeasurementUnitName'}),
    columnMoneyDef({title: 'Costo', dataKey: 'productCost'}),
    {
      title: <p style={{ margin: '0px', fontSize: 12, fontWeight: 600 }}>{'Acciones'}</p>,
      dataIndex: 'id',
      key: 'id',
      align: 'right',
      render: (text, record, index) => {
        return (
          <Space size={'small'}>
            <Tooltip placement="left" title={`Editar`}>
              <Button
                onClick={(e) => {
                  
                }}
                size='small'
                icon={<EditTwoTone />}
              />
            </Tooltip>
            <Tooltip placement="top" title={`Ver precios`}>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setProductIdSelected(record.productId);
                  setOpenPricePreview(true);
                  // console.log(record);
                }}
                size='small'
                icon={<DollarCircleTwoTone twoToneColor={'#52c41a'} />}
              />
            </Tooltip>
          </Space>
        )
      }
    },
    // columnActionsDef(
    //   {
    //     title: 'Acciones',
    //     dataKey: 'productId',
    //     detail: false,
    //     // detailAction: (value) => customNot('info', 'En desarrollo', 'Próximamente'),
    //     edit: includes([1, 2, 3, 4], getUserRole()) && (getUserLocation() === 1),
    //     editAction: (value) => {
    //       setOpenForm(true);
    //       setFormUpdateMode(true);
    //       setEntityToUpdate(find(entityData, ['productId', value]));
    //     },
    //   }
    // ),
  ];

  function filterByFilters(x) {
    return (
      ((x.productCategoryId === categorySelectedId) || categorySelectedId === 0)
      && ((x.productBrandId === brandSelectedId) || brandSelectedId === 0)
    )
  }

  return (
    <Wrapper>
      <Row gutter={[8, 8]} style={{ width: '100%' }}>
        <Col span={24}>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => {
                setEntityToUpdate({});
                setOpenForm(true);
              }}
            >
              Nuevo producto
            </Button>
            <Button 
              icon={<ClearOutlined />} 
              onClick={(e) => {
                setFilter('');
                setCategorySelectedId(0);
                setBrandSelectedId(0);
              }} 
            >
              Limpiar filtros
            </Button>
            <Button 
              icon={<SyncOutlined />} 
              onClick={(e) => loadData(locationSelectedId)} 
            >
              Actualizar
            </Button>
          </Space>
        </Col>
        <Col span={24}>
          <p style={{ margin: 0 }}>Generar reportes:</p>
          <Space wrap>
            <Button 
              icon={<FilePdfTwoTone twoToneColor={'green'} />} 
              onClick={(e) => {}}
              loading={fetching}
            >
              General
            </Button>
            <Button 
              icon={<FilePdfTwoTone twoToneColor={'red'} />}
              onClick={() => fetchReportByCategories()}
              loading={fetching}
            >
              Por categoria
            </Button>
            <Button 
              icon={<FilePdfTwoTone twoToneColor={'blue'} />} 
              onClick={() => fetchReportByBrands()}
              loading={fetching}
            >
              Por marca
            </Button>
            <Button 
              icon={<FilePdfTwoTone twoToneColor={'purple'} />} 
              onClick={() => fetchReportByFilteredData()}
              loading={fetching}
            >
              Por filtros
            </Button>
          </Space>
        </Col>
        
        <Col span={6}>
          <p style={{ margin: 0 }}>Sucursal:</p>
          <Select
            dropdownStyle={{ width: '100%' }} 
            style={{ width: '100%' }} 
            value={locationSelectedId} 
            onChange={(value) => {
              setLocationSelectedId(value);
              loadData(value);
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
                (element) => <Option key={element.id} value={element.id}>{element.name}</Option>
              )
            }
          </Select>
        </Col>
        <Col span={6}>
          <p style={{ margin: 0 }}>Nombre:</p>
          <Search
            name={'filter'} 
            value={filter} 
            placeholder="Producto 1" 
            allowClear 
            style={{ width: 300 }}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Col>
        <Col span={6}>
          <p style={{ margin: 0 }}>Categoría:</p>
          <Select
            dropdownStyle={{ width: '100%' }} 
            style={{ width: '100%' }} 
            value={categorySelectedId} 
            onChange={(value) => setCategorySelectedId(value)}
            optionFilterProp='children'
            showSearch
            filterOption={(input, option) =>
              (option.children).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option key={0} value={0}>{'TODAS'}</Option>
            {
              (categoriesData || []).map(
                (element) => <Option key={element.id} value={element.id}>{element.name}</Option>
              )
            }
          </Select>
        </Col>
        <Col span={6}>
          <p style={{ margin: 0 }}>Marca:</p>
          <Select
            dropdownStyle={{ width: '100%' }} 
            style={{ width: '100%' }} 
            value={brandSelectedId} 
            onChange={(value) => setBrandSelectedId(value)}
            optionFilterProp='children'
            showSearch
            filterOption={(input, option) =>
              (option.children).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option key={0} value={0}>{'TODAS'}</Option>
            {
              (brandsData || []).map(
                (element) => <Option key={element.id} value={element.id}>{element.name}</Option>
              )
            }
          </Select>
        </Col>
        <Col span={24}>
          <Table 
            size='small'
            style={{ width: '100%' }}
            rowKey={'productId'}
            loading={fetching}
            dataSource={
              filterData(
                entityData.filter(filterByFilters),
                filter,
                [
                  'productName'
                ]
              ) || []
            }
            columns={columns}
            onRow={(record, rowIndex) => {
              return {
                onClick: (e) => {
                  if (includes([1, 2], getUserRole())) {
                    e.preventDefault();
                    setOpenForm(true);
                    setFormUpdateMode(true);
                    setEntityToUpdate(find(entityData, ['productId', record?.productId]));
                  } else {
                    customNot('warning', 'No tienes permitido realizar esta acción')
                  }
                }
              };
            }}
          />
        </Col>
      </Row>
      <ProductForm
        open={openForm} 
        updateMode={formUpdateMode} 
        dataToUpdate={entityToUpdate} 
        onClose={(refresh) => { 
          setOpenForm(false);
          setFormUpdateMode(false);
          setEntityToUpdate({});
          if (refresh) { 
            loadData(locationSelectedId);
          }
        }}
      />
      <ProductPricePreview
        open={openPricePreview}
        productId={productIdSelected || 0}
        onClose={() => {
          setOpenPricePreview(false);
          setProductIdSelected(0);
        }}
      />
    </Wrapper>
  );
}

export default Products;
