import React, { useState, useEffect } from 'react';
import { Button, Card, Col, DatePicker, Row, Space, Spin, Statistic, Table, Tabs } from 'antd';

import { Wrapper } from '../styled-components/Wrapper';
import LineChart from '../components/charts/LineChart';

import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import moment from 'moment';
import parkingReportsServices from '../services/ParkingReportsServices';
import { forEach, isEmpty } from 'lodash';
import { ArrowDownOutlined, ArrowUpOutlined, FilePdfOutlined } from '@ant-design/icons';
import { columnDef, columnMoneyDef } from '../utils/ColumnsDefinitions';
import ParkingReportPDF from '../components/reports/ParkingReportPDF';
import { BlobProvider } from '@react-pdf/renderer';

moment.updateLocale('es-mx', { week: { dow: 1 }});

function ParkingReports() {
  const [fetching, setFetching] = useState(false);

  const [selectedTabKey, setSelectedTabKey] = useState('tab-1');
  
  const [monthFilter, setMonthFilter] = useState(defaultDate());
  const [weekFilter, setWeekFilter] = useState(defaultDate());

  const [guardIncomesDataSet, setGuardIncomesDataSet] = useState([]);
  const [incomesData, setIncomesData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);

  function defaultDate() {
    return moment();
  };

  async function searchGuardIncomes() {
    setFetching(true);
    try {
      let response;
      if (selectedTabKey === 'tab-1') {
        response = await parkingReportsServices.guardIncomesByMonth(monthFilter.format("YYYY-MM"), monthFilter.format("YYYY-MM"));
      }
  
      if (selectedTabKey === 'tab-2') {
        let firstDay = weekFilter.clone().startOf('week');
        let lastDay = weekFilter.clone().endOf('week');
        response = await parkingReportsServices.guardIncomesByWeek(firstDay.format("YYYY-MM-DD"), lastDay.format("YYYY-MM-DD"));
      }

      setGuardIncomesDataSet(response.data);
      setFetching(false);
    } catch(err) {
      setFetching(false);
    }
  }

  async function searchIncomes() {
    setFetching(true);
    try {
      let response;
      if (selectedTabKey === 'tab-1') {
        response = await parkingReportsServices.incomesByMonth(monthFilter.format("YYYY-MM"), monthFilter.format("YYYY-MM"));
      }
  
      if (selectedTabKey === 'tab-2') {
        let firstDay = weekFilter.clone().startOf('week');
        let lastDay = weekFilter.clone().endOf('week');
        response = await parkingReportsServices.incomesByWeek(firstDay.format("YYYY-MM-DD"), lastDay.format("YYYY-MM-DD"));
      }

      let balance = 0;
      const data = [];

      forEach(response.data, (x) => {
        balance += +x.checkoutTotal;
        data.push({ ...x, balance });
      })

      setIncomesData(data);
      setFetching(false);
    } catch(err) {
      setFetching(false);
    }
  }

  async function searchExpenses() {
    setFetching(true);
    try {
      let response;
      if (selectedTabKey === 'tab-1') {
        response = await parkingReportsServices.expensesByMonth(monthFilter.format("YYYY-MM"), monthFilter.format("YYYY-MM"));
      }
  
      if (selectedTabKey === 'tab-2') {
        let firstDay = weekFilter.clone().startOf('week');
        let lastDay = weekFilter.clone().endOf('week');
        response = await parkingReportsServices.expensesByWeek(firstDay.format("YYYY-MM-DD"), lastDay.format("YYYY-MM-DD"));
      }

      let balance = 0;
      const data = [];

      forEach(response.data, (x) => {
        balance += +x.amount;
        data.push({ ...x, balance });
      })

      setExpensesData(data);
      setFetching(false);
    } catch(err) {
      setFetching(false);
    }
  }

  function buildGuardIncomesChartLabel() {
    let chartLabel = [];
    
    if (selectedTabKey === 'tab-1') {
      let lastDay = monthFilter.clone().endOf('month');
      for (let i = 0; i < +lastDay.format('D'); i++) {
        chartLabel.push(i + 1);
      }
    }

    if (selectedTabKey === 'tab-2') {
      let firstDay = weekFilter.clone().startOf('week');
      for (let i = 0; i <= 6; i++) {
        chartLabel.push(+moment(firstDay).add(i, 'days').format('D'));
      }
    }

    return chartLabel;
  }

  function buildGuardIncomesDataset() {
    if(!isEmpty(guardIncomesDataSet)) {
      const chartdata = guardIncomesDataSet.map((x) => ({
        label: x.parkingGuardFullname,
        data: buildGuardIncomesChartLabel().map((label) => {
          let element = 0;
          forEach(x.dataset, (z) => {
            if (+z.day === label) {
              element = +z.total;
              return;
            }
          });
          return element;
        }),
        borderColor: x.parkingGuardChartColor,
        backgroundColor: '#e6f4ff'
      }))

      return chartdata;
    }
  }

  function getTotalIncomes() {
    let total = 0;
    
    forEach(incomesData, (x) => {
      total += +x.checkoutTotal;
    });

    return total;
  }

  function getTotalExpenses() {
    let total = 0;
    
    forEach(expensesData, (x) => {
      total += +x.amount;
    });

    return total;
  }

  useEffect(() => {
    // loadData();
    searchGuardIncomes();
    searchIncomes();
    searchExpenses();
  }, [selectedTabKey, monthFilter, weekFilter]);

  function renderMonthlyTab() {
    return (
      <Row gutter={[16, 16]} style={{ width: '100%' }}>
        <Col span={24} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space wrap>
            <DatePicker 
              locale={locale}
              format="MMMM-YYYY"
              picker='month'
              value={monthFilter}
              style={{ width: '100%' }}
              onChange={(datetimeMoment, datetimeString) => {
                setMonthFilter(datetimeMoment);
              }}
            />
            <Button
              icon={<FilePdfOutlined />}
              onClick={() => {
                document.getElementById('print-report-button').click();
              }}
            >
              Generar PDF
            </Button>
          </Space>
        </Col>
        <Col span={12} style={{ padding: 5, backgroundColor: '#e6f4ff' }}>
          <p style={{ margin: '0px 0px 5px 0px' }}>
            {`Ingresos del ${monthFilter.startOf('month').format('DD')} al ${monthFilter.endOf('month').format('DD')} de ${monthFilter.format('MMMM')}`}
          </p>
          <Table 
            loading={fetching}
            size='small'
            style={{ width: '100%' }}
            rowKey={'id'}
            dataSource={incomesData}
            columns={[
              columnDef({title: 'Fecha', dataKey: 'checkoutFullDate', fSize: 10}),
              columnMoneyDef({title: 'Turno Mañana', dataKey: 'morningTotal', fSize: 10}),
              columnMoneyDef({title: 'Turno Noche', dataKey: 'noonTotal', fSize: 10}),
              columnMoneyDef({title: 'Total', dataKey: 'checkoutTotal', fSize: 10}),
              columnMoneyDef({title: 'Saldo', dataKey: 'balance', fSize: 10})
            ]} 
          />
        </Col>
        <Col span={12} style={{ padding: 5, backgroundColor: '#fff1f0' }}>
          <p style={{ margin: '0px 0px 5px 0px' }}>
            {`Egresos del ${monthFilter.startOf('month').format('DD')} al ${monthFilter.endOf('month').format('DD')} de ${monthFilter.format('MMMM')}`}
          </p>
          <Table 
            loading={fetching}
            size='small'
            style={{ width: '100%' }}
            rowKey={'id'}
            dataSource={expensesData}
            columns={[
              columnDef({title: 'Fecha', dataKey: 'documentFullDate', fSize: 10}),
              columnDef({title: 'Concepto', dataKey: 'concept', fSize: 10}),
              columnMoneyDef({title: 'Total', dataKey: 'amount', fSize: 10}),
              columnMoneyDef({title: 'Saldo', dataKey: 'balance', fSize: 10})
            ]} 
          />
        </Col>
        <Col span={12}>
          <LineChart
            legendText={'Ingresos por Vigilante'}
            chartLabels={buildGuardIncomesChartLabel()}
            chartDataset={buildGuardIncomesDataset()}
          />
        </Col>
        <Col span={12}>
          <Space>
            <Card size='small'>
              <Statistic
                title="Ingresos"
                value={getTotalIncomes()}
                precision={2}
                valueStyle={{ color: '#7cb305' }}
                prefix={'$'}
                suffix={<ArrowDownOutlined />}
              />
            </Card>
            <Card size='small'>
              <Statistic
                title="Egresos"
                value={getTotalExpenses()}
                precision={2}
                valueStyle={{ color: '#cf1322' }}
                prefix={'$'}
                suffix={<ArrowUpOutlined />}
              />
            </Card>
            <Card size='small'>
              <Statistic
                title="Utilidad"
                value={getTotalIncomes() - getTotalExpenses()}
                precision={2}
                valueStyle={{ color: (getTotalIncomes() - getTotalExpenses()) >= 0 ? '#0958d9' : '#c41d7f' }}
                prefix={'$'}
                // suffix={<GoldOutlined />}
              />
            </Card>
          </Space>
        </Col>
      </Row>
    )
  }

  function renderWeeklyTab() {
    return (
      <Row gutter={[16, 16]} style={{ width: '100%' }}>
        <Col span={24} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space wrap>
            <DatePicker
              locale={locale}
              // format="MMMM-YYYY"
              picker='week'
              value={weekFilter}
              style={{ width: '250px' }}
              onChange={(datetimeMoment, datetimeString) => {
                console.log(datetimeMoment);
                setWeekFilter(datetimeMoment);
              }}
            />
            <Button
              icon={<FilePdfOutlined />}
              onClick={() => {
                document.getElementById('print-report-button').click();
              }}
            >
              Generar PDF
            </Button>
          </Space>
        </Col>
        <Col span={12} style={{ padding: 5, backgroundColor: '#e6f4ff' }}>
          <p style={{ margin: '0px 0px 5px 0px', padding: 5, color: '#0958d9' }}>
            {`Ingresos del ${weekFilter.startOf('week').format('DD')} al ${weekFilter.endOf('week').format('DD')} de ${weekFilter.format('MMMM')}`}
          </p>
          <Table 
            loading={fetching}
            size='small'
            style={{ width: '100%' }}
            rowKey={'id'}
            dataSource={incomesData}
            columns={[
              columnDef({title: 'Fecha', dataKey: 'checkoutFullDate', fSize: 10}),
              columnMoneyDef({title: 'Turno Mañana', dataKey: 'morningTotal', fSize: 10}),
              columnMoneyDef({title: 'Turno Noche', dataKey: 'noonTotal', fSize: 10}),
              columnMoneyDef({title: 'Total', dataKey: 'checkoutTotal', fSize: 10}),
              columnMoneyDef({title: 'Saldo', dataKey: 'balance', fSize: 10})
            ]} 
          />
        </Col>
        <Col span={12} style={{ padding: 5, backgroundColor: '#fff1f0' }}>
          <p style={{ margin: '0px 0px 5px 0px', padding: 5, color: '#cf1322' }}>
            {`Egresos del ${weekFilter.startOf('week').format('DD')} al ${weekFilter.endOf('week').format('DD')} de ${weekFilter.format('MMMM')}`}
          </p>
          <Table 
            loading={fetching}
            size='small'
            style={{ width: '100%' }}
            rowKey={'id'}
            dataSource={expensesData}
            columns={[
              columnDef({title: 'Fecha', dataKey: 'documentFullDate', fSize: 10}),
              columnDef({title: 'Concepto', dataKey: 'concept', fSize: 10}),
              columnMoneyDef({title: 'Total', dataKey: 'amount', fSize: 10}),
              columnMoneyDef({title: 'Saldo', dataKey: 'balance', fSize: 10})
            ]} 
          />
        </Col>
        <Col span={12}>
          <LineChart
            legendText={'Ingresos por Vigilante'}
            chartLabels={buildGuardIncomesChartLabel()}
            chartDataset={buildGuardIncomesDataset()}
          />
        </Col>
        <Col span={12}>
          <Space>
            <Card size='small'>
              <Statistic
                title="Ingresos"
                value={getTotalIncomes()}
                precision={2}
                valueStyle={{ color: '#7cb305' }}
                prefix={'$'}
                suffix={<ArrowDownOutlined />}
              />
            </Card>
            <Card size='small'>
              <Statistic
                title="Egresos"
                value={getTotalExpenses()}
                precision={2}
                valueStyle={{ color: '#cf1322' }}
                prefix={'$'}
                suffix={<ArrowUpOutlined />}
              />
            </Card>
            <Card size='small'>
              <Statistic
                title="Utilidad"
                value={getTotalIncomes() - getTotalExpenses()}
                precision={2}
                valueStyle={{ color: (getTotalIncomes() - getTotalExpenses()) >= 0 ? '#0958d9' : '#c41d7f' }}
                prefix={'$'}
                // suffix={<GoldOutlined />}
              />
            </Card>
          </Space>
        </Col>
      </Row>
    )
  }

  console.log(monthFilter.startOf('month'));
  console.log(monthFilter.endOf('month'));

  return (
    <Wrapper>
      {fetching ? <Spin/> : <></>}
      <Tabs
        activeKey={selectedTabKey}
        style={{ width: '100%' }}
        items={[
          { label: 'Mensual', key: 'tab-1', children: renderMonthlyTab() }, // remember to pass the key prop
          { label: 'Semanal', key: 'tab-2', children: renderWeeklyTab() },
        ]}
        onChange={(activeKey) => setSelectedTabKey(activeKey)}
        type="card"
      />
      <div style={{ display: 'none' }}>
        <BlobProvider
          document={
            <ParkingReportPDF
              incomesData={incomesData}
              expensesData={expensesData}
              incomesTotal={getTotalIncomes()}
              expensesTotal={getTotalExpenses()}
              startDate={selectedTabKey === 'tab-1' ? monthFilter.clone().startOf('month') : weekFilter.clone().startOf('week')}
              finalDate={selectedTabKey === 'tab-1' ? monthFilter.clone().endOf('month') : weekFilter.clone().endOf('week')}
            />
          }
        >
          {({ blob, url, loading, error }) => {
            // Do whatever you need with blob here
            return <a href={url} id={'print-report-button'} target="_blank" rel="noreferrer">Open in new tab</a>;
          }}
        </BlobProvider>
      </div>
      {/* <PDFDownloadLink document={<ParkingReportPDF />} fileName="somename.pdf">
        {({ blob, url, loading, error }) =>
            loading ? 'Loading document...' : 'Download now!'
          }
      </PDFDownloadLink> */}
    </Wrapper>
  );
}

export default ParkingReports;
