import React from 'react';
import { Badge, Button, Space, Tag } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, DeleteFilled, EditFilled, EyeFilled } from '@ant-design/icons';

import moment from 'moment';
import 'moment/locale/es-mx';
// import locale from 'antd/es/date-picker/locale/es_ES';

let reA = /[^a-zA-Z]/g;
let reN = /[^0-9]/g;

const sortAlphaNum = (a, b, dataKey) => {
  let aA = a[dataKey].toUpperCase().replace(reA, "");
  let bA = b[dataKey].toUpperCase().replace(reA, "");
  if (aA === bA) {
    let aN = parseInt(a[dataKey].toUpperCase().replace(reN, ""), 10);
    let bN = parseInt(b[dataKey].toUpperCase().replace(reN, ""), 10);
    return aN === bN ? 0 : aN > bN ? 1 : -1;
  }
  return aA > bA ? 1 : -1;
}


export const columnDef = ({
  title = 'Title',
  dataKey = 'key',
  fSize = 12,
  align = 'left',
  ifNull = '',
  enableSort = false
}) => ({
  title: <p style={{ margin: '0px', fontSize: fSize, fontWeight: 600 }}>{title}</p>,
  dataIndex: dataKey,
  key: dataKey,
  align: align,
  sorter: enableSort ? (a, b) => sortAlphaNum(a, b, dataKey) : null,
  showSorterTooltip: false,
  render: value => <p style={{ margin: '0px', fontSize: fSize }}>{value || ifNull}</p>,
})

export const columnNumberDef = ({
  title = 'Title',
  dataKey = 'key',
  fSize = 12,
  align = 'left',
  ifNull = '',
  enableSort = false
}) => ({
  title: <p style={{ margin: '0px', fontSize: fSize, fontWeight: 600 }}>{title}</p>,
  dataIndex: dataKey,
  key: dataKey,
  align: align,
  sorter: enableSort ? (a, b) => a[dataKey] - b[dataKey] : null,
  showSorterTooltip: false,
  render: value => <p style={{ margin: '0px', fontSize: fSize }}>{value || ifNull}</p>,
})

export const columnDatetimeDef = ({
  title = 'Title',
  dataKey = 'key',
  fSize = 12,
  align = 'left',
  ifNull = '',
  enableSort = false
}) => ({
  title: <p style={{ margin: '0px', fontSize: fSize, fontWeight: 600 }}>{title}</p>,
  dataIndex: dataKey,
  key: dataKey,
  align: align,
  sorter: enableSort ? (a, b) => new Date(a[dataKey]) - new Date(b[dataKey]) : null,
  showSorterTooltip: false,
  render: value => <p style={{ margin: '0px', fontSize: fSize }}>{moment(value).format("LL") || ifNull}</p>,
})

export const columnMoneyDef = ({
  title = 'Title',
  dataKey = 'key',
  fSize = 12,
  showDefaultString = false,
  precision = 2
}) => ({
  title: <p style={{ margin: '0px', fontSize: fSize, fontWeight: 600 }}>{title}</p>,
  dataIndex: dataKey,
  key: dataKey,
  align: 'right',
  render: value => <p style={{ margin: '0px', fontSize: fSize }}>{value ? `$${Number(value).toFixed(precision)}` : showDefaultString ? '$0.00' : ''}</p>,
})

export const columnActionsDef = ({
  title = 'Title', 
  dataKey = 'key',
  fSize = 12,
  detail = true,
  detailAction = () => {},
  disableDetail = false,
  edit = true,
  editAction = () => {},
  del = false,
  delAction = () => {}
}) => {
  let actions = [];
  if (detail) actions.push({ caption: 'Ver', disableButton: disableDetail, icon: <EyeFilled style={{ color: '#1890FF'}} />, action: detailAction });
  if (edit) actions.push({caption: 'Editar', disableButton: false, icon: <EditFilled style={{ color: '#52C41A'}} />, action: editAction });
  if (del) actions.push({ caption: 'Borrar', disableButton: false, icon: <DeleteFilled style={{ color: '#FF4D4F'}} />, action: delAction });
  const def = {
    title: <p style={{ margin: '0px', fontSize: fSize, fontWeight: 600 }}>{title}</p>,
    dataIndex: dataKey,
    key: dataKey,
    align: 'right',
    render: value => (
      <Space>
        {
          actions.map((item, index) => (
            <Button 
              key={index}
              type="default" 
              shape="square" 
              size={'small'} 
              icon={item.icon}
              disabled={item.disableButton}
              style={{ backgroundColor: '#FFFFFF' }}
              onClick={() => item.action(value)}
            />
          ))
        }
      </Space>
    ),
  };
  return def;
}

export const columnImgDef = ({
  title = 'Title', 
  dataKey = 'PicName',
  fSize = 12,
  source = (value) => (`${value}`),
  alternative = 'img',
  cntSize = [30, 30],
  imgSize = [20, 20]
}) => {
  const def = {
    title: <p style={{ margin: '0px', fontSize: fSize, fontWeight: 600 }}>{title}</p>,
    dataIndex: dataKey,
    key: dataKey,
    align: 'left',
    render: value => (
      <div 
        style={
          { 
            backgroundColor: 'transparent', 
            padding: 5,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: cntSize[0],
            height: cntSize[1]
          }
        }
      >
        <img src={source(value)} alt={alternative} width={imgSize[0]} height={imgSize[0]} />
      </div>
    )
  };
  return def;
}

export const columnBtnAction = ({
  title = 'Title', 
  dataKey = 'key',
  fSize = 12,
  btnText = 'Action',
  btnColor = '#73d13d',
  btnAction = () => {},
  btn2Text = null,
  btn2Color = null,
  btn2Action = null,
  btn3Text = null,
  btn3Color = null,
  btn3Action = null
}) => {
  const def = {
    title: <p style={{ margin: '0px', fontSize: fSize, fontWeight: 600 }}>{title}</p>,
    dataIndex: dataKey,
    key: dataKey,
    align: 'right',
    render: value => (
      <>
        <Button
          type="primary"
          size="small"
          style={{ fontSize: 10, backgroundColor: btnColor, borderColor: btnColor }} 
          onClick={() => btnAction(value)}
        >
          {btnText}
        </Button>
        {
          btn2Text !== null ? <>
            <Button
              type="primary"
              size="small"
              style={{ fontSize: 10, marginLeft: 10, backgroundColor: btn2Color, borderColor: btnColor }} 
              onClick={() => btn2Action(value)}
            >
              {btn2Text}
            </Button>
          </> : <></>
        }
        {
          btn3Text !== null ? <>
            <Button
              type="primary"
              size="small"
              style={{ fontSize: 10, marginLeft: 10, backgroundColor: btn3Color, borderColor: btnColor }} 
              onClick={() => btn3Action(value)}
            >
              {btn3Text}
            </Button>
          </> : <></>
        }
      </>
    ),
  };
  return def;
}

export const columnBoolean = ({
  title = 'Title', 
  dataKey = 'key',
  fSize = 12,
  trueText = 'Si',
  falseText = 'No',
  trueColor = 'blue',
  falseColor = 'red',
}) => {
  const def = {
    title: <p style={{ margin: '0px', fontSize: fSize, fontWeight: 600 }}>{title}</p>,
    dataIndex: dataKey,
    key: dataKey,
    align: 'left',
    render: value => <Tag color={+!!value ? trueColor : falseColor}>{+!!value ? trueText : falseText}</Tag>,
  };
  return def;
}

export const columnColorTag = ({
  title = 'Title', 
  dataKey = 'key',
  fSize = 12
}) => {
  const def = {
    title: <p style={{ margin: '0px', fontSize: fSize, fontWeight: 600 }}>{title}</p>,
    dataIndex: dataKey,
    key: dataKey,
    align: 'left',
    render: value => <Tag color={value}>{value}</Tag>,
  };
  return def;
}

export const columnIfValueEqualsTo = ({
  title = 'Title', 
  dataKey = 'key',
  fSize = 12,
  text = 'Anulado',
  color = 'red',
  valueToCompare = 1
}) => {
  const def = {
    title: <p style={{ margin: '0px', fontSize: fSize, fontWeight: 600 }}>{title}</p>,
    dataIndex: dataKey,
    key: dataKey,
    align: 'left',
    render: value => value === valueToCompare ? <Tag color={color}>{text}</Tag> : <></>
  };
  return def;
}

export const columnBadgeAlert = ({
  title = 'Title',
  dataKey = 'key',
  fSize = 12
}) => {
  const def = {
    title: <p style={{ margin: '0px', fontSize: fSize, fontWeight: 600 }}>{title}</p>,
    dataIndex: dataKey,
    key: dataKey,
    align: 'left',
    render: value => <Badge
      count={
        +value ? 
          <ClockCircleOutlined style={{ color: '#f5222d' }} /> :
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
      }
    />
  };
  return def;
}
