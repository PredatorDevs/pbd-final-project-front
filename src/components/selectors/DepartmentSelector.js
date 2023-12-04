import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col, Select, Space, Button, Spin } from 'antd';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';

import { customNot } from '../../utils/Notifications';
import usersService from '../../services/UsersService';
import generalsServices from '../../services/GeneralsServices';
import { filterData } from '../../utils/Filters';
import { filter } from 'lodash';

const { Option } = Select;

const Wrapper = styled.div`
  width: 100%;
`;

export default function DepartmentSelector(props) {
  const [fetching, setFetching] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [subEntityData, setSubEntityData] = useState([]);
  const [valueSelected, setValueSelected] = useState(0);
  const [subValueSelected, setSubValueSelected] = useState(0);
  const [entityRefreshData, setEntityRefreshData] = useState(0);

  const {
    onSelect,
    selectorSize,
    label,
    focusToId,
    defDepartmentId,
    defCityId,
    setResetState
  } = props;

  useEffect(() => {
    loadData();
  }, [ entityRefreshData ]);

  useEffect(() => {
    restoreState();
  }, [ setResetState ]);

  function restoreState() {
    setValueSelected(13);
    setSubValueSelected(0);
  }

  useEffect(() => {
    if (defDepartmentId) setValueSelected(defDepartmentId);
    if (defCityId) setSubValueSelected(defCityId);
  }, [ defDepartmentId, defCityId ]);

  const loadData = async () => {
    setFetching(true);
    const departments = await generalsServices.findDepartments();
    const cities = await generalsServices.findCities();
    setEntityData(departments.data);
    setSubEntityData(cities.data);
    setValueSelected(13);
    setFetching(false);
  }

  return (
    <Wrapper>
      <Row gutter={[8, 2]}>
        {/* <Col span={24}>
          <p style={{ margin: 0 }}>{label || ''}</p>
        </Col> */}
        <Col span={12}>
          <p style={{ margin: 0 }}>{'Departamento:'}</p>
          <Select
            id={'g-department-selector-select'}
            dropdownStyle={{ width: '100%' }} 
            style={{ width: '100%' }} 
            value={valueSelected} 
            onChange={(value) => {
              setValueSelected(value);
              onSelect({departmentSelected: value, citySelected: subValueSelected});
              document.getElementById('g-city-selector-select').focus();
            }}
            optionFilterProp='children'
            size={selectorSize || 'middle'}
            showSearch
            showAction={'focus'}
            filterOption={(input, option) =>
              (option.children).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option key={0} value={0} disabled>{'No seleccionado'}</Option>
            {
              (entityData || []).map(
                (element) => <Option key={element.departmentId} value={element.departmentId}>{element.departmentName}</Option>
              )
            }
          </Select>
        </Col>
        <Col span={12}>
          <p style={{ margin: 0 }}>{'Municipio:'}</p>
          <Select
            id={'g-city-selector-select'}
            dropdownStyle={{ width: '100%' }} 
            style={{ width: '100%' }} 
            value={subValueSelected} 
            size={selectorSize || 'middle'}
            showAction={'focus'}
            onChange={(value) => {
              setSubValueSelected(value);
              onSelect({departmentSelected: valueSelected, citySelected: value});
              let focusTo = document.getElementById(focusToId);
              if (focusTo) focusTo.focus();
            }}
            optionFilterProp='children'
            showSearch
            filterOption={(input, option) =>
              (option.children).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option key={0} value={0} disabled>{'No seleccionado'}</Option>
            {
              (filter(subEntityData, ['departmentId', valueSelected]) || []).map(
                (element) => <Option key={element.cityId} value={element.cityId}>{element.cityName}</Option>
              )
            }
          </Select>
        </Col>
      </Row> 
    </Wrapper>
  );
}