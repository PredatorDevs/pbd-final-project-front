import { Col, Row, Button, Table, Space, Statistic, Card, Result } from 'antd';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Wrapper } from '../styled-components/Wrapper';
import { useNavigate } from 'react-router-dom';
import { BookOutlined, DollarOutlined, FileOutlined, LogoutOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { TableContainer } from '../styled-components/TableContainer';
import { columnActionsDef, columnDef, columnIfValueEqualsTo, columnMoneyDef } from '../utils/ColumnsDefinitions';
import { customNot } from '../utils/Notifications';
import { CompanyInformation } from '../styled-components/CompanyInformation';
import salesServices from '../services/SalesServices.js';
import SalePreview from '../components/previews/SalePreview';
import { getUserLocation, getUserMyCashier } from '../utils/LocalData';
import generalsServices from '../services/GeneralsServices';
import { forEach } from 'lodash';
import cashiersServices from '../services/CashiersServices';

function Sales() {
  const [fetching, setFetching] = useState(false);
  const [ableToProcess, setAbleToProcess] = useState(false);

  const [entityData, setEntityData] = useState([]);
  const [openPreview, setOpenPreview] = useState(false);
  const [entitySelectedId, setEntitySelectedId] = useState(0);

  const navigate = useNavigate();

  async function checkIfAbleToProcess() {
    setFetching(true);

    const response = await cashiersServices.checkIfAbleToProcess(getUserMyCashier());

    const { isOpen, currentShiftcutId } = response.data[0];

    if (isOpen === 1 && currentShiftcutId !== null) {
      setAbleToProcess(true);
    }

    setFetching(false);
  }

  async function loadData() {
    setFetching(true);
    const response = await salesServices.findByMyCashier(getUserMyCashier());
    setEntityData(response.data);
    setFetching(false);
  }

  useEffect(() => {
    checkIfAbleToProcess();
    loadData();
  }, []);

  const columns = [
    // columnDef({title: 'Id', dataKey: 'id'}),
    columnDef({title: 'Código', dataKey: 'id'}),
    columnDef({title: 'Tipo', dataKey: 'documentTypeName'}),
    columnDef({title: 'N° Doc', dataKey: 'docNumber', ifNull: '-'}),
    columnDef({title: 'Fecha', dataKey: 'docDatetime'}),
    columnDef({title: 'Cliente', dataKey: 'customerFullname'}),
    // columnDef({title: 'Sucursal', dataKey: 'locationName'}),
    columnDef({title: 'Pago', dataKey: 'paymentTypeName'}),
    columnIfValueEqualsTo({title: '', dataKey: 'isVoided', text: 'Anulada', valueToCompare: 1 }),
    // columnDef({title: 'Anulada', dataKey: 'isVoided'}),
    columnMoneyDef({title: 'Total', dataKey: 'total'}),
    columnMoneyDef({title: 'Pagado', dataKey: 'saleTotalPaid'}),
    columnActionsDef(
      {
        title: 'Acciones',
        dataKey: 'id',
        edit: false,
        detailAction: (value) => {
          setEntitySelectedId(value);
          setOpenPreview(true);
        },
      }
    ),
  ];

  function getCashSaleTotal() {
    let total = 0;
    forEach(entityData, (value) => {
      total += +value.saleTotalPaid
    });
    return total || 0;
  }

  function getCreditSaleTotal() {
    let total = 0;
    forEach(entityData, (value) => {
      total += (+value.total - +value.saleTotalPaid)
    });
    return total || 0;
  }

  return (
    !ableToProcess ? <>
      <Result
        status="info"
        title={<p style={{ color: '#434343' }}>{`${fetching ? "Cargando..." : "Caja cerrada, operaciones de venta limitadas"}`}</p>}
        subTitle={<p style={{ color: '#434343' }}>{`${fetching ? "Por favor espere..." : "Usted debe aperturar un nuevo turno en su caja para poder procesar"}`}</p>}
      />
    </> : <Wrapper>
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
              <Statistic title="Ventas" value={entityData.length} prefix={<BookOutlined />} />
            </Card>
            <Card style={{ margin: '10px 5px' }}>
              <Statistic title="Total Contado" value={getCashSaleTotal()} precision={2} prefix={<DollarOutlined />} />
            </Card>
            <Card style={{ margin: '10px 5px' }}>
              <Statistic title="Total Crédito" value={getCreditSaleTotal()} precision={2} prefix={<DollarOutlined />} />
            </Card>
          </Space>
        </Col>
        <Col span={24}>
          <p style={{ fontWeight: 600, margin: '10px 0px 5px 0px' }}>Ventas del turno actual</p>
        </Col>
        <Col span={24}>
          <Table 
            columns={columns}
            rowKey={'id'}
            size={'small'}
            dataSource={entityData || []}
            loading={fetching}
            onRow={(record, rowIndex) => {
              return {
                onClick: (e) => {
                  e.preventDefault();
                  setEntitySelectedId(record.id);
                  setOpenPreview(true);
                }
              };
            }}
          />
        </Col>
      </Row>
      <SalePreview
        open={openPreview}
        saleId={entitySelectedId}
        onClose={(wasVoided) => {
          setOpenPreview(false);
          if (wasVoided) loadData();
        }}
      />
    </Wrapper>
  );
}

export default Sales;
