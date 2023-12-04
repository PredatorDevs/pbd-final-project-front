import React, { useState, useEffect } from 'react';
import { Input, Col, Row, Divider, Button, Modal, DatePicker, InputNumber, Select } from 'antd';
import { DeleteFilled,  ExclamationCircleOutlined,  SaveOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';

import { customNot } from '../utils/Notifications.js';

import parkingCheckoutsServices from '../services/ParkingCheckoutsServices.js';
import { getUserId } from '../utils/LocalData.js';
import { validateNumberData, validateSelectedData } from '../utils/ValidateData.js';

const { Option } = Select;
const { confirm } = Modal;

function NewParkingCheckout(props) {
  const [fetching, setFetching] = useState(false);
  const [parkingGuardsData, setParkingGuardsData] = useState(false);

  const [formDatetime, setFormDatetime] = useState(defaultDate());
  const [formParkingGuardSelected, setFormParkingGuardSelected] = useState(0);
  const [formTicketFrom, setFormTicketFrom] = useState(null);
  const [formTicketTo, setFormTicketTo] = useState(null);
  const [formNumberOfParkings, setFormNumberOfParkings] = useState(null);
  const [formTotal, setFormTotal] = useState(null);
  const [formNotes, setFormNotes] = useState('');
  const [formPendingTicketNumber, setFormPendingTicketNumber] = useState([]);
  const [formPendingTickets, setFormPendingTickets] = useState([]);

  const { open, onClose } = props;

  async function loadData() {
    setFetching(true);
    const response = await parkingCheckoutsServices.parkingGuards.find();
    setParkingGuardsData(response.data);
    setFetching(false);
  }

  useEffect(() => {
    loadData();
  }, [])

  function defaultDate() {
    return moment();
  };

  function restoreState() {
    setFormDatetime(defaultDate());
    setFormParkingGuardSelected(0);
    setFormTicketFrom(null);
    setFormTicketTo(null);
    setFormNumberOfParkings(null);
    setFormTotal(null);
    setFormNotes('');
    setFormPendingTicketNumber(null);
    setFormPendingTickets([]);
  }

  function pushPendingTicket() {
    if (
      !validateNumberData(formPendingTicketNumber, 'Debe especificar un número de ticket a definir como pendiente')
      || !validateNumberData(formTicketFrom, 'Debe especificar un ticket inicial antes de definir los pendientes')
      || !validateNumberData(formTicketTo, 'Debe especificar un ticket final antes de definir los pendientes')
    ) return;
    
    if (formPendingTicketNumber > formTicketTo || formPendingTicketNumber < formTicketFrom) {
      confirm({
        title: 'El número de ticket está fuera de rango inicial y final',
        icon: <ExclamationCircleOutlined />,
        content: '¿Desea continuar de igual forma?',
        okText: 'Continuar',
        okType: 'primary',
        onOk() {
          const newPendingTicket = [null, formPendingTicketNumber, 1];

          const newDetails = [ ...formPendingTickets, newPendingTicket ];

          setFormPendingTickets(newDetails);
          setFormPendingTicketNumber(null);

          document.getElementById('g-new-parking-checkout-pending-ticket-input').focus();
        },
        onCancel() {
          document.getElementById('g-new-parking-checkout-pending-ticket-input').select();
          return;
        },
      });
    } else {
      const newPendingTicket = [null, formPendingTicketNumber, 1];

      const newDetails = [ ...formPendingTickets, newPendingTicket ];

      setFormPendingTickets(newDetails);
      setFormPendingTicketNumber(null);

      document.getElementById('g-new-parking-checkout-pending-ticket-input').focus();
    }
  }

  function removePendingTicket(indexToRemove) {
    confirm({
      title: '¿Seguro que desea descartar este ticket de los pendientes?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: 'Descartar',
      okType: 'primary',
      onOk() {
        const newDetails = [...formPendingTickets];
        newDetails.splice(indexToRemove, 1);

        setFormPendingTickets(newDetails);
      },
      onCancel() {
        return;
      },
    });
  }

  function validateData() {
    const validDocDatetime = formDatetime !== null && formDatetime.isValid();
    if (!validDocDatetime) customNot('warning', 'Seleccione una fecha válida', 'Dato no válido');
    return (
      validDocDatetime
      && validateSelectedData(formParkingGuardSelected, 'Debe seleccionar un vigilante')
      && validateNumberData(formTicketFrom, 'Debe especificar un ticket inicial')
      && validateNumberData(formTicketTo, 'Debe especificar un ticket final')
      && validateNumberData(formNumberOfParkings, 'Debe definir un número de parqueos reportados')
      && validateNumberData(formTotal, 'Debe especificar un monto para el control')
    );
  }

  async function formAction() {
    if (validateData()) {
      const response = await parkingCheckoutsServices.add(
        formDatetime.format('YYYY-MM-DD HH:mm:ss'),
        formParkingGuardSelected,
        formTotal || 0,
        formTicketFrom,
        formTicketTo,
        formNumberOfParkings,
        formNotes || '',
        getUserId()
      );

      if (response.status === 200) {
        if (isEmpty(formPendingTickets)) {
          restoreState();
          onClose(true);
          return;
        }
        
        const insertedId = response.data?.insertId;

        const bulkData = formPendingTickets.map((element) => ([ insertedId, element[1], element[2] ]));

        const response2 = await parkingCheckoutsServices.pendingTickets.add(bulkData);

        if (response2.status === 200) {
          restoreState();
          onClose(true);
        }
      }
    }
  }

  return (
    <Modal
      centered
      width={650}
      closable={false}
      maskClosable={false}
      open={open}
      footer={null}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <p style={{ margin: '0px', fontSize: 16, fontWeight: 600 }}>
            {'Nuevo Registro de Control de Parqueos'}
          </p>
        </Col>
        <Col span={8}>
          <p style={{ margin: '0px' }}>{'Fecha:'}</p>
          <DatePicker 
            id={'g-new-parking-checkout-datepicker'}
            locale={locale}
            format="DD-MM-YYYY" 
            value={formDatetime}
            style={{ width: '100%' }}
            onFocus={() => {
              document.getElementById('g-new-parking-checkout-datepicker').select();
            }}
            onChange={(datetimeMoment, datetimeString) => {
              setFormDatetime(datetimeMoment);
              document.getElementById('parkingcheckout-form-guard-selector').focus();
            }}
          />
        </Col>
        <Col span={8}>
          <p style={{ margin: '0px' }}>{'Vigilante:'}</p>
          <Select 
            id={'parkingcheckout-form-guard-selector'}
            dropdownStyle={{ width: '100%' }} 
            style={{ width: '100%' }} 
            value={formParkingGuardSelected} 
            onChange={(value) => {
              setFormParkingGuardSelected(value);
              document.getElementById('g-new-parking-checkout-ticket-from-input').focus();
            }}
            optionFilterProp='children'
            showSearch
            showAction={'focus'}
            filterOption={(input, option) =>
              (option.children).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option key={0} value={0} disabled>{'No seleccionado'}</Option>
            {
              (parkingGuardsData || []).map(
                (element) => <Option key={element.id} value={element.id}>{`${element.fullname} (${element.schedule === 'M' ? 'Mañana' : 'Tarde'})`}</Option>
              )
            }
          </Select>
        </Col>
        <Col span={8}>
        </Col>
        <Col span={8}>
          <p style={{ margin: '0px' }}>Ticket Inicial:</p>
          <InputNumber 
            id={'g-new-parking-checkout-ticket-from-input'}
            style={{ width: '100%' }}
            placeholder={'10'} 
            value={formTicketFrom} 
            onChange={(value) => {
              setFormTicketFrom(value);
            }}
            type={'number'}
            onKeyDown={
              (e) => {
                if (e.key === 'Enter') {
                  if (validateNumberData(formTicketFrom, 'Debe definir un número de ticket inicial válido')) {
                    document.getElementById('g-new-parking-checkout-ticket-to-input').focus();
                  } else {
                    document.getElementById('g-new-parking-checkout-ticket-from-input').select();
                  }
                }
              }
            }
          />
        </Col>
        <Col span={8}>
          <p style={{ margin: '0px' }}>Ticket Final:</p>
          <InputNumber 
            id={'g-new-parking-checkout-ticket-to-input'}
            style={{ width: '100%' }}
            placeholder={'10'} 
            value={formTicketTo} 
            onChange={(value) => setFormTicketTo(value)}
            type={'number'}
            onKeyDown={
              (e) => {
                if (e.key === 'Enter') {
                  if (
                    validateNumberData(formTicketTo, 'Debe definir un número de ticket final válido')
                    && (formTicketTo >= formTicketFrom)
                  ) {
                    setFormNumberOfParkings((formTicketTo - formTicketFrom) + 1);
                    setFormTotal(((formTicketTo - formTicketFrom) + 1) * 2);
                    document.getElementById('g-new-parking-checkout-number-of-parkings-input').focus();
                    document.getElementById('g-new-parking-checkout-number-of-parkings-input').select();
                  } else {
                    customNot('warning', 'El número de ticket final debe ser válido y mayor o igual al ticket inicial', '')
                    document.getElementById('g-new-parking-checkout-ticket-to-input').select();
                  }
                }
              }
            }
          />
        </Col>
        <Col span={8}>
          <p style={{ margin: '0px' }}>Parqueos usados:</p>
          <InputNumber 
            id={'g-new-parking-checkout-number-of-parkings-input'}
            style={{ width: '100%' }}
            placeholder={'10'} 
            value={formNumberOfParkings} 
            onChange={(value) => setFormNumberOfParkings(value)}
            type={'number'}
            onKeyDown={
              (e) => {
                if (e.key === 'Enter')
                document.getElementById('g-new-parking-checkout-total-input').focus();
                document.getElementById('g-new-parking-checkout-total-input').select();
              }
            }
          />
        </Col>
        <Col span={8}>
          <p style={{ margin: '0px' }}>Efectivo a entregar:</p>
          <InputNumber 
            id={'g-new-parking-checkout-total-input'}
            style={{ width: '100%' }}
            addonBefore='$'
            placeholder={'1.25'}
            value={formTotal} 
            onChange={(value) => setFormTotal(value)}
            type={'number'}
            onKeyDown={
              (e) => {
                if (e.key === 'Enter')
                document.getElementById('g-new-parking-checkout-notes-input').focus();
              }
            }
          />
        </Col>
        <Col span={16}>
          <p style={{ margin: '0px 0px 0px 0px' }}>Observaciones:</p>  
          <Input
            id={'g-new-parking-checkout-notes-input'}
            onChange={(e) => setFormNotes(e.target.value)}
            name={'formNotes'}
            value={formNotes}
            placeholder={''}
          />
        </Col>
        <Divider>Pendientes</Divider>
        <Col span={8}>
          <p style={{ margin: '0px' }}>Nuevo ticket pendiente:</p>
          <InputNumber 
            id={'g-new-parking-checkout-pending-ticket-input'}
            style={{ width: '100%' }}
            value={formPendingTicketNumber} 
            onChange={(value) => setFormPendingTicketNumber(value)}
            type={'number'}
            onKeyDown={
              (e) => {
                if (e.key === 'Enter') {
                  pushPendingTicket();
                }
                // document.getElementById('g-new-parking-checkout-notes-input').focus();
              }
            }
          />
          <Button
            id={'g-new-parking-checkout-add-pending-ticket-button'}
            style={{ marginTop: 5 }}
            onClick={(e) => {
              pushPendingTicket();
            }}
          >
            Añadir
          </Button>
        </Col>
        <Col span={16}>
          {
            isEmpty(formPendingTickets) ? <>
              <p style={{ margin: 0, color: '#8c8c8c' }}>No hay tickets pendientes</p>
            </> : <>
              {
                formPendingTickets.map((element, index) => (
                  <div
                    key={index}
                    style={{
                      margin: '5px 0px',
                      padding: '5px 10px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: 5,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }}
                  >
                    <p style={{ margin: 0 }}>{`Ticket N° ${element[1]}`}</p>
                    <Button 
                      type="default" 
                      shape="square" 
                      size={'small'} 
                      icon={<DeleteFilled style={{ color: 'red' }} />}
                      onClick={() => removePendingTicket(index)}
                    />
                  </div>
                ))
              }
            </>
          }
        </Col>
        <Divider />
        <Col span={12}>
          <Button 
            type={'default'} 
            onClick={(e) => {
              restoreState();
              onClose(false)
            }}
            style={{ width: '100%' }} 
          >
            Cancelar
          </Button>
        </Col>
        <Col span={12}>
          <Button 
            type={'primary'} 
            icon={<SaveOutlined />} 
            onClick={(e) => formAction()} 
            style={{ width: '100%' }} 
            loading={fetching}
            disabled={fetching}
          >
            Guardar
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default NewParkingCheckout;
