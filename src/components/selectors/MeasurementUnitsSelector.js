import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col, Select, Space, Button, Spin } from 'antd';

import { customNot } from '../../utils/Notifications';
import measurementUnitsServices from '../../services/MeasurementUnitsServices';

const { Option } = Select;

const Wrapper = styled.div`
  width: 100%;
`;

export default function MeasurementUnitSelector(props) {
  const { onSelect, label, defUnitSelectedId } = props;

  const [fetching, setFetching] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [valueSelected, setValueSelected] = useState(0);
  
  async function loadData() {
    setFetching(true);
    const response = await measurementUnitsServices.find();
    setEntityData(response.data);
    setFetching(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (defUnitSelectedId) {
      setValueSelected(defUnitSelectedId);
    } else {
      setValueSelected(0);
    }
  }, [ defUnitSelectedId ]);


  return (
    <Wrapper>
      <Row gutter={[8, 2]}>
        <Col span={24}>
          <p style={{ margin: 0, color: '#434343' }}>{label || ''}</p>
          <Select
            dropdownStyle={{ width: '100%' }} 
            style={{ width: '100%' }} 
            value={valueSelected} 
            onChange={(value) => {
              setValueSelected(value);
              onSelect(value);
            }}
            optionFilterProp='children'
            showSearch
            filterOption={(input, option) =>
              (option.children).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option key={0} value={0}>{'No seleccionado'}</Option>
            {
              (entityData || []).map(
                (element) => <Option key={element.measurementUnitId} value={element.measurementUnitId}>{element.measurementUnitName}</Option>
              )
            }
          </Select>
        </Col>
        <Col span={24}>
          <Space align='center'>
            {/* <Button icon={<PlusOutlined />} /> */}
            {/* <Button icon={<SyncOutlined />} onClick={() => setEntityRefreshData(entityRefreshData + 1)} /> */}
            {
              fetching ? <Spin /> : <></>
            }
          </Space>
        </Col>
      </Row>
    </Wrapper>
  );
}