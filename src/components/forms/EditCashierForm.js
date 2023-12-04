import React, { useState, useEffect, useRef } from 'react';
import { Input, Col, Row, Divider, Button, PageHeader, Modal, Descriptions, Badge, Table, Tag, InputNumber, Switch } from 'antd';
import { CloseOutlined, EditTwoTone, SaveOutlined} from '@ant-design/icons';
import { isEmpty } from 'lodash';
import moment from 'moment';
import 'moment/locale/es-mx';
import { validateNumberData, validateSelectedData, validateStringData } from '../../utils/ValidateData';
import cashiersServices from '../../services/CashiersServices';

function EditCashierForm(props) {
  const [fetching, setFetching] = useState(false);

  const [formId, setFormId] = useState(0);

  const [formTicketCorrelative, setFormTicketCorrelative] = useState(null);
  const [formCfCorrelative, setFormCfCorrelative] = useState(null);
  const [formCcfCorrelative, setFormCcfCorrelative] = useState(null);
  const [formCreditNoteCorrelative, setFormCreditNoteCorrelative] = useState(null);
  const [formDebitNoteCorrelative, setFormDebitNoteCorrelative] = useState(null);
  const [formReceiptCorrelative, setFormReceiptCorrelative] = useState(null);

  const [formTicketSerie, setFormTicketSerie] = useState('');
  const [formCfSerie, setFormCfSerie] = useState('');
  const [formCcfSerie, setFormCcfSerie] = useState('');
  const [formCreditNoteSerie, setFormCreditNoteSerie] = useState('');
  const [formDebitNoteSerie, setFormDebitNoteSerie] = useState('');
  const [formReceiptSerie, setFormReceiptSerie] = useState('');

  const [formDefaultInitialCash, setFormDefaultInitialCash] = useState(null);
  const [formEnableReportCashFundMovements, setFormEnableReportCashFundMovements] = useState(false);

  const {
    open,
    cashierData,
    onClose
  } = props;

  useEffect(() => {
    if (!isEmpty(cashierData)) {
      const {
        id,
        ticketCorrelative,
        cfCorrelative,
        ccfCorrelative,
        creditNoteCorrelative,
        debitNoteCorrelative,
        receiptCorrelative,
        ticketSerie,
        cfSerie,
        ccfSerie,
        creditNoteSerie,
        debitNoteSerie,
        receiptSerie,
        defaultInitialCash,
        enableReportCashFundMovements
      } = cashierData;

      setFormId(id || 0);

      setFormTicketCorrelative(+ticketCorrelative || null);
      setFormCfCorrelative(+cfCorrelative || null);
      setFormCcfCorrelative(+ccfCorrelative || null);
      setFormCreditNoteCorrelative(+creditNoteCorrelative || null);
      setFormDebitNoteCorrelative(+debitNoteCorrelative || null);
      setFormReceiptCorrelative(+receiptCorrelative || null);

      setFormTicketSerie(ticketSerie || '');
      setFormCfSerie(cfSerie || '');
      setFormCcfSerie(ccfSerie || '');
      setFormCreditNoteSerie(creditNoteSerie || '');
      setFormDebitNoteSerie(debitNoteSerie || '');
      setFormReceiptSerie(receiptSerie || '');

      setFormDefaultInitialCash(+defaultInitialCash || 0);
      setFormEnableReportCashFundMovements(!!enableReportCashFundMovements);
    }
  }, [ cashierData ]);

  function restoreState() {
    setFormId(0);

    setFormTicketCorrelative(null);
    setFormCfCorrelative(null);
    setFormCcfCorrelative(null);
    setFormCreditNoteCorrelative(null);
    setFormDebitNoteCorrelative(null);
    setFormReceiptCorrelative(null);

    setFormTicketSerie('');
    setFormCfSerie('');
    setFormCcfSerie('');
    setFormCreditNoteSerie('');
    setFormDebitNoteSerie('');
    setFormReceiptSerie('');

    setFormDefaultInitialCash(null);
    setFormEnableReportCashFundMovements(false);
  }

  function validateData() {
    return (
      validateSelectedData(formId, 'No se ha definido una caja para editar')
      && validateNumberData(formTicketCorrelative, 'Debe especificar un correlativo para los tickets de esta caja')
      && validateNumberData(formCfCorrelative, 'Debe especificar un correlativo para las facturas de esta caja')
      && validateNumberData(formCcfCorrelative, 'Debe especificar un correlativo para los créditos fiscales de esta caja')
      && validateNumberData(formCreditNoteCorrelative, 'Debe especificar un correlativo para las notas de crédito de esta caja')
      && validateNumberData(formDebitNoteCorrelative, 'Debe especificar un correlativo para las notas de débito de esta caja')
      && validateNumberData(formReceiptCorrelative, 'Debe especificar un correlativo para los recibos de esta caja')
      && validateStringData(formTicketSerie, 'Debe especificar una serie para los tickets de esta caja')
      && validateStringData(formCfSerie, 'Debe especificar una serie para las facturas de esta caja')
      && validateStringData(formCcfSerie, 'Debe especificar una serie para los créditos fiscales de esta caja')
      && validateStringData(formCreditNoteSerie, 'Debe especificar una serie para las notas de crédito de esta caja')
      && validateStringData(formDebitNoteSerie, 'Debe especificar una serie para las notas de débito de esta caja')
      && validateStringData(formReceiptSerie, 'Debe especificar una serie para los recibos de esta caja')
      && validateNumberData(formDefaultInitialCash, 'Debe especificar un monto de efectivo inicial de caja')
    );
  }

  async function formAction() {
    if (validateData()) {
      setFetching(true);
      try {
        const updRes = await cashiersServices.update(
          formTicketCorrelative,
          formCfCorrelative,
          formCcfCorrelative,
          formCreditNoteCorrelative,
          formDebitNoteCorrelative,
          formReceiptCorrelative,
          formTicketSerie,
          formCfSerie,
          formCcfSerie,
          formCreditNoteSerie,
          formDebitNoteSerie,
          formReceiptSerie,
          formDefaultInitialCash,
          formEnableReportCashFundMovements,
          formId
        );

        restoreState();
        onClose(true);
      } catch (error) {
        console.log(error);
      }
      setFetching(false);
    }
  }

  return (
    <Modal
      centered
      width={650}
      closeIcon={<CloseOutlined style={{ padding: 5, backgroundColor: '#f0f0f0', borderRadius: 5, color: '#f5222d' }} />}
      onCancel={() => {
        onClose(false);
        restoreState();
      }}
      maskClosable={false}
      open={open}
      footer={null}
    >
      {
        isEmpty(cashierData) ? <>
        </> : <>
          <p style={{ fontSize: 14, margin: 0, fontWeight: 600 }}>{`Editando ${cashierData.name}`}</p>
          <p style={{ fontSize: 11 }}>{`Codigo Interno: ${cashierData.id}`}</p>
          <Descriptions
            bordered
            labelStyle={{
              padding: 5,
              margin: 0,
              backgroundColor: '#f0f0f0',
              border: '1px solid #bfbfbf',
              fontSize: 13
            }}
            contentStyle={{
              padding: 5,
              margin: 0,
              backgroundColor: '#fafafa',
              border: '1px solid #bfbfbf'
            }}
            style={{
              width: '100%'
            }}
            size={'small'}
          >
            <Descriptions.Item label="Corr. Ticket" span={1}>
              <InputNumber
                id={'cashier-ticket-correlative-form'}
                name={'formTicketCorrelative'}
                value={formTicketCorrelative}
                min={1}
                size={'small'}
                onChange={(val) => setFormTicketCorrelative(val)}
                onFocus={() => document.getElementById('cashier-ticket-correlative-form').select()}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Serie Ticket" span={2}>
              <Input
                id={'cashier-ticket-serie-form'}
                name={'formTicketSerie'}
                value={formTicketSerie}
                size={'small'}
                onChange={(e) => setFormTicketSerie(e.target.value)}
                onFocus={() => document.getElementById('cashier-ticket-serie-form').select()}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Corr. Factura" span={1}>
              <InputNumber
                id={'cashier-cf-correlative-form'}
                name={'formCfCorrelative'}
                value={formCfCorrelative}
                min={1}
                size={'small'}
                onChange={(val) => setFormCfCorrelative(val)}
                onFocus={() => document.getElementById('cashier-cf-correlative-form').select()}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Serie Factura" span={2}>
              <Input
                id={'cashier-cf-serie-form'}
                name={'formCfSerie'}
                value={formCfSerie}
                size={'small'}
                onChange={(e) => setFormCfSerie(e.target.value)}
                onFocus={() => document.getElementById('cashier-cf-serie-form').select()}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Corr. CCF" span={1}>
              <InputNumber
                id={'cashier-ccf-correlative-form'}
                name={'formCcfCorrelative'}
                value={formCcfCorrelative}
                min={1}
                size={'small'}
                onChange={(val) => setFormCcfCorrelative(val)}
                onFocus={() => document.getElementById('cashier-ccf-correlative-form').select()}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Serie CCF" span={2}>
              <Input
                id={'cashier-ccf-serie-form'}
                name={'formCcfSerie'}
                value={formCcfSerie}
                size={'small'}
                onChange={(e) => setFormCcfSerie(e.target.value)}
                onFocus={() => document.getElementById('cashier-ccf-serie-form').select()}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Corr. Nota Crédito" span={1}>
              <InputNumber
                id={'cashier-credit-note-correlative-form'}
                name={'formCreditNoteCorrelative'}
                value={formCreditNoteCorrelative}
                min={1}
                size={'small'}
                onChange={(val) => setFormCreditNoteCorrelative(val)}
                onFocus={() => document.getElementById('cashier-credit-note-correlative-form').select()}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Serie Nota Crédito" span={2}>
              <Input
                id={'cashier-credit-note-serie-form'}
                name={'formCreditNoteSerie'}
                value={formCreditNoteSerie}
                size={'small'}
                onChange={(e) => setFormCreditNoteSerie(e.target.value)}
                onFocus={() => document.getElementById('cashier-credit-note-serie-form').select()}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Corr. Nota Débito" span={1}>
              <InputNumber
                id={'cashier-debit-note-correlative-form'}
                name={'formDebitNoteCorrelative'}
                value={formDebitNoteCorrelative}
                min={1}
                size={'small'}
                onChange={(val) => setFormDebitNoteCorrelative(val)}
                onFocus={() => document.getElementById('cashier-debit-note-correlative-form').select()}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Serie Nota Débito" span={2}>
              <Input
                id={'cashier-debit-note-serie-form'}
                name={'formDebitNoteSerie'}
                value={formDebitNoteSerie}
                size={'small'}
                onChange={(e) => setFormDebitNoteSerie(e.target.value)}
                onFocus={() => document.getElementById('cashier-debit-note-serie-form').select()}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Corr. Recibo" span={1}>
              <InputNumber
                id={'cashier-receipt-correlative-form'}
                name={'formReceiptCorrelative'}
                value={formReceiptCorrelative}
                min={1}
                size={'small'}
                onChange={(val) => setFormReceiptCorrelative(val)}
                onFocus={() => document.getElementById('cashier-receipt-correlative-form').select()}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Serie Recibo" span={2}>
              <Input
                id={'cashier-receipt-serie-form'}
                name={'formReceiptSerie'}
                value={formReceiptSerie}
                size={'small'}
                onChange={(e) => setFormReceiptSerie(e.target.value)}
                onFocus={() => document.getElementById('cashier-receipt-serie-form').select()}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Efectivo Inicial" span={3}>
              <InputNumber
                id={'cashier-def-initial-cash-form'}
                name={'formDefaultInitialCash'}
                value={formDefaultInitialCash}
                min={0}
                size={'small'}
                onChange={(val) => setFormDefaultInitialCash(val)}
                onFocus={() => document.getElementById('cashier-def-initial-cash-form').select()}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Mov. Caja Chica" span={3}>
              <Switch
                checked={formEnableReportCashFundMovements}
                onChange={(checked) => {
                  setFormEnableReportCashFundMovements(checked);
                }}
                size='small'
              />
            </Descriptions.Item>
          </Descriptions>
          <div style={{ height: 20 }}/>
          <Row gutter={8} style={{ width: '100%' }}>
            <Col span={12}>
              <Button
                onClick={() => {
                  onClose(false);
                  restoreState();
                }}
                style={{ width: '100%' }}
              >
                Cancelar
              </Button>
            </Col>
            <Col span={12}>
              <Button
                type='primary'
                icon={<SaveOutlined />}
                onClick={() => {
                  formAction();
                }}
                style={{ width: '100%' }}
              >
                Guardar cambios
              </Button>
            </Col>
          </Row>
        </>
      }
    </Modal>
  )
}

export default EditCashierForm;
