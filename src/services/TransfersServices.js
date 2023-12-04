import { genRequest } from "./Requests";

const transfersServices = {};

transfersServices.add = (originLocationId, destinationLocationid, sentBy, sentAt, status) => 
  genRequest(`post`, `/transfers`, { originLocationId, destinationLocationid, sentBy, sentAt, status });

transfersServices.addDetails = (bulkData) => 
  genRequest(`post`, `/transfers/details`, { bulkData });

transfersServices.incomingTransfers = (destinationLocationId) => 
  genRequest(`get`, `/transfers/incoming/${destinationLocationId}`, {});

transfersServices.incomingTransfersBySentAtRange = (destinationLocationId, initialDate, finalDate) => 
  genRequest(`get`, `/transfers/incoming/sent-at/${destinationLocationId}/${initialDate}/${finalDate}`, {});

transfersServices.incomingTransfersByReceivedAtRange = (destinationLocationId, initialDate, finalDate) => 
  genRequest(`get`, `/transfers/incoming/received-at/${destinationLocationId}/${initialDate}/${finalDate}`, {});

transfersServices.outcomingTransfers = (originLocationId) => 
  genRequest(`get`, `/transfers/outcoming/${originLocationId}`, {});

transfersServices.outcomingTransfersBySentAtRange = (originLocationId, initialDate, finalDate) => 
  genRequest(`get`, `/transfers/outcoming/sent-at/${originLocationId}/${initialDate}/${finalDate}`, {});

transfersServices.outcomingTransfersByReceivedAtRange = (originLocationId, initialDate, finalDate) => 
  genRequest(`get`, `/transfers/outcoming/received-at/${originLocationId}/${initialDate}/${finalDate}`, {});

transfersServices.findById = (transferId) => 
  genRequest(`get`, `/transfers/${transferId}`, {});

transfersServices.confirmTransfer = (transferId) => 
  genRequest(`put`, `/transfers/confirm/${transferId}`, {});

transfersServices.confirmTransferDetail = (transferDetailId, quantityToConfirm) => 
  genRequest(`put`, `/transfers/confirm-detail/${transferDetailId}`, { quantityToConfirm });

transfersServices.rejectTransfer = (transferId) => 
  genRequest(`put`, `/transfers/reject/${transferId}`, {});

transfersServices.rejectTransferDetail = (transferDetailId) => 
  genRequest(`put`, `/transfers/reject-detail/${transferDetailId}`, {});


export default transfersServices;
