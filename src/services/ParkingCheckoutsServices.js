import { genRequest } from "./Requests";

const parkingCheckoutsServices = {};
parkingCheckoutsServices.pendingTickets = {};
parkingCheckoutsServices.parkingGuards = {};

parkingCheckoutsServices.find = () => 
  genRequest(
    `get`,
    `/parking-checkouts`,
    {},
    '',
    '',
    'La información de los controles de parqueo no pudo ser obtenida',
    'Error desconocido'
  );

parkingCheckoutsServices.findById = (parkingCheckoutId) => 
  genRequest(
    `get`,
    `/parking-checkouts/${parkingCheckoutId}`,
    {},
    '',
    '',
    'La información del control de parqueo no pudo ser obtenida',
    'Error desconocido'
  );

parkingCheckoutsServices.add = (
  checkoutDatetime,
  parkingGuardId,
  checkoutTotal,
  ticketNumberFrom,
  ticketNumberTo,
  numberOfParkings,
  notes,
  checkoutBy
) => 
  genRequest(`post`, `/parking-checkouts`, {
    checkoutDatetime,
    parkingGuardId,
    checkoutTotal,
    ticketNumberFrom,
    ticketNumberTo,
    numberOfParkings,
    notes,
    checkoutBy
  },
  'Registro de control de parqueo añadido con éxito', 'Acción terminada', 'No se pudo realizar el registro del control de parqueo', 'Error desconocido');

parkingCheckoutsServices.update = (
  checkoutDatetime,
  parkingGuardId,
  checkoutTotal,
  ticketNumberFrom,
  ticketNumberTo,
  numberOfParkings,
  notes,
  checkoutBy,
  parkingCheckoutId
) => 
  genRequest(`put`, `/parking-checkouts`, {
    checkoutDatetime,
    parkingGuardId,
    checkoutTotal,
    ticketNumberFrom,
    ticketNumberTo,
    numberOfParkings,
    notes,
    checkoutBy,
    parkingCheckoutId
  });

parkingCheckoutsServices.remove = (parkingCheckoutId) => 
  genRequest(`delete`, `/parking-checkouts/${parkingCheckoutId}`);

  parkingCheckoutsServices.voidById = (userId, parkingExpenseId) => 
  genRequest(`put`, `/parking-checkouts/void`, { voidedBy: userId, parkingExpenseId });

parkingCheckoutsServices.pendingTickets.findByParkingCheckoutId = (parkingCheckoutId) =>
  genRequest(`get`, `/parking-checkouts/pending-tickets/${parkingCheckoutId}`);

parkingCheckoutsServices.pendingTickets.add = (
  pendingTicketBulk // Expeceted = [[parkingCheckoutId, ticketNumber, status], ...]
) =>
  genRequest(
    `post`,
    `/parking-checkouts/pending-tickets`,
    { pendingTicketBulk },
    '',
    '', 
    'No se han podido añadir los tickets pendientes',
    ''
  );

parkingCheckoutsServices.pendingTickets.checkoutPendingById = (
  parkingCheckoutPendingTicketId
) =>
  genRequest(
    `post`,
    `/parking-checkouts/pending-tickets/${parkingCheckoutPendingTicketId}`,
    {},
    '',
    '', 
    'No se han podido añadir los tickets pendientes',
    ''
  );
  
parkingCheckoutsServices.pendingTickets.update = (
  parkingCheckoutId,
  ticketNumber,
  status,
  checkoutDatetime,
  parkingCheckoutPendingTicketId
) =>
  genRequest(
    `put`,
    `/parking-checkouts/pending-tickets`,
    {
      parkingCheckoutId,
      ticketNumber,
      status,
      checkoutDatetime,
      parkingCheckoutPendingTicketId
    },
    '',
    '',
    'No se han podido añadir los tickets pendientes',
    ''
  );

parkingCheckoutsServices.parkingGuards.find = () =>
  genRequest(`get`, `/parking-checkouts/parking-guards`);

parkingCheckoutsServices.parkingGuards.add = (fullname, schedule, chartColor)  =>
  genRequest(`post`, `/parking-checkouts/parking-guards`, { fullname, schedule, chartColor });

parkingCheckoutsServices.parkingGuards.update = (fullname, schedule, chartColor, parkingGuardId) =>
  genRequest(`put`, `/parking-checkouts/parking-guards`, { fullname, schedule, chartColor, parkingGuardId });

parkingCheckoutsServices.parkingGuards.delete = (parkingGuardId) =>
  genRequest(`delete`, `/parking-checkouts/parking-guards/${parkingGuardId}`, { parkingGuardId });

export default parkingCheckoutsServices;
