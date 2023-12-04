import { Col, Row, Card, Button, Statistic, Table, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Wrapper } from '../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import { BookOutlined, DollarOutlined, LogoutOutlined, ShoppingCartOutlined, SyncOutlined } from '@ant-design/icons';
import { TableContainer } from '../styled-components/TableContainer';
import { columnActionsDef, columnBoolean, columnDatetimeDef, columnDef, columnIfValueEqualsTo, columnMoneyDef } from '../utils/ColumnsDefinitions';
import productPurchasesServices from '../services/ProductPurchasesServices';
import { customNot } from '../utils/Notifications';
import { forEach, isEmpty } from 'lodash';
import { CompanyInformation } from '../styled-components/CompanyInformation';
import RawMaterialPurchasePreview from '../components/previews/RawMaterialPurchasePreview';
import { MainMenuCard } from '../styled-components/MainMenuCard';
import { GAddFileIcon, GGoBackIcon, GRefreshIcon } from '../utils/IconImageProvider';
import { getUserLocation } from '../utils/LocalData';
import ProductPurchasePreview from '../components/previews/ProductPurchasePreview';

const Container = styled.div`
  /* align-items: center; */
  background-color: #353941;
  border: 1px solid #787B80;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  .ant-card:hover {
    cursor: pointer;
  }
  .card-title {
    font-size: 15px;
    color: #223B66;
    text-overflow: ellipsis;
    /* background-color: red; */
    font-weight: 600;
    margin: 0px;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
  }
`;

function ProductPurchases() {
  const [fetching, setFetching] = useState(false);
  const [entityRefreshData, setEntityRefreshData] = useState(0);

  const [entitySelectedId, setEntitySelectedId] = useState(0);
  const [openPreview, setOpenPreview] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [purchaseResumeData, setPurchaseResumeData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setFetching(true);
    const response = await productPurchasesServices.find()
    setEntityData(response.data);
    setFetching(false);
  };

  const columns = [
    columnDef({title: 'Código', dataKey: 'productPurchaseId'}),
    columnDef({title: 'N° Doc', dataKey: 'documentNumber'}),
    columnDef({title: 'Sucursal', dataKey: 'locationName'}),
    columnDatetimeDef({title: 'Fecha', dataKey: 'documentDatetime', enableSort: true }),
    columnDef({title: 'Proveedor', dataKey: 'supplierName'}),
    columnDef({title: 'Tipo', dataKey: 'documentTypeName'}),
    columnDef({title: 'Pago', dataKey: 'paymentTypeName'}),
    columnMoneyDef({title: 'Total', dataKey: 'total'}),
    columnIfValueEqualsTo({title: '', dataKey: 'isVoided', valueToCompare: 1, text: 'Anulada'}),
    columnActionsDef(
      {
        title: 'Acciones',
        dataKey: 'productPurchaseId',
        edit: false,
        detailAction: (value) => {
          setEntitySelectedId(value);
          setOpenPreview(true);
        },
      }
    ),
  ];

  function getPurchaseTotal(paymentType) {
    let total = 0;
    forEach(entityData, (value) => {
      if (value.paymentTypeId === paymentType)
        total += +value.total
    });
    return total || 0;
  }

  return (
    <Wrapper>
      <Row gutter={[8, 8]} style={{ width: '100%' }}>
        <Col span={24}>
          <Space>
            <Button 
              icon={<SyncOutlined />}
              onClick={() => loadData()}
              // size={'large'}
              >
              Actualizar
            </Button>
          </Space>
        </Col>
        <Col span={24} style={{ backgroundColor: '#FAFAFA' }}>
          <Space wrap>
            <Card style={{ margin: '10px 5px' }}>
              <Statistic title="Compras" value={entityData.length} prefix={<BookOutlined />} />
            </Card>
            <Card style={{ margin: '10px 5px' }}>
              <Statistic title="Total Contado" value={getPurchaseTotal(1)} precision={2} prefix={<DollarOutlined />} />
            </Card>
            <Card style={{ margin: '10px 5px' }}>
              <Statistic title="Total Crédito" value={getPurchaseTotal(2)} precision={2} prefix={<DollarOutlined />} />
            </Card>
          </Space>
        </Col>
        <Col span={24}>
          <Table
            loading={fetching}
            columns={columns}
            rowKey={'productPurchaseId'}
            size={'small'}
            dataSource={entityData || []}
            onRow={(record, rowIndex) => {
              return {
                onClick: (e) => {
                  e.preventDefault();
                  setEntitySelectedId(record.productPurchaseId);
                  setOpenPreview(true);
                }
              };
            }}
          />
        </Col>
      </Row>
      <ProductPurchasePreview
        open={openPreview}
        productPurchaseId={entitySelectedId}
        onClose={(wasVoided) => {
          setOpenPreview(false);
          if(wasVoided) loadData();
        }}
      />
    </Wrapper>
  );
}

export default ProductPurchases;
