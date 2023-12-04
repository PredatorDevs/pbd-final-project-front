import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col, Select, Space, Button, Spin } from 'antd';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';

import { customNot } from '../../utils/Notifications';
import usersService from '../../services/UsersService';

const { Option } = Select;

const Wrapper = styled.div`
  width: 100%;
`;

export default function UserSelector(props) {
  const [fetching, setFetching] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [valueSelected, setValueSelected] = useState(0);
  const [entityRefreshData, setEntityRefreshData] = useState(0);

  const { onSelect, label } = props;

  useEffect(() => {
    setFetching(true);
    usersService.find()
    .then((response) => {
      const { data } = response;
      setEntityData(data);
      setFetching(false);
    })
    .catch((error) => {
      customNot('error', 'Usuarios - Datos no obtenidos', error.message || 'Sin información del problema');
      setFetching(false);
    });
  }, [ entityRefreshData ]);

  return (
    <Wrapper>
      <Row gutter={[8, 2]}>
        <Col span={24}>
          <p style={{ margin: 0 }}>{label || ''}</p>
        </Col>
        <Col span={24}>
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
            <Option key={0} value={0} disabled>{'No seleccionado'}</Option>
            {
              (entityData || []).map(
                (element) => <Option key={element.id} value={element.id}>{element.fullName}</Option>
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