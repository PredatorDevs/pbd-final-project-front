// ADMIN
import brandIcon from '../img/icons/admin/brand.png';
import customersIcon from '../img/icons/admin/customers.png';
import generalDataIcon from '../img/icons/admin/general-data.png';
import generalInformationIcon from '../img/icons/admin/general-information.png';
import pinIcon from '../img/icons/admin/pin.png';
import placesIcon from '../img/icons/admin/places.png';
import productBrandIcon from '../img/icons/admin/product-brand.png';
import productLineIcon from '../img/icons/admin/product-line.png';
import providerIcon from '../img/icons/admin/provider.png';
import rolesIcon from '../img/icons/admin/roles.png';
import routesIcon from '../img/icons/admin/routes.png';
import salesAgentIcon from '../img/icons/admin/sales-agents.png';
import supplierIcon from '../img/icons/admin/supplier.png';
import trackIcon from '../img/icons/admin/track.png';
import usersIcon from '../img/icons/admin/users.png';

// ATTACHMENTS
import pdfFileIcon from '../img/icons/attachments/pdf.png';

// DOCS
import addFileIcon from '../img/icons/docs/add-file.png';
import addFolderIcon from '../img/icons/docs/add-folder.png';
import booksIcon from '../img/icons/docs/books.png';
import saleReportIcon from '../img/icons/docs/salereport.png';

// INVENTORY
import bottlesIcon from '../img/icons/inventory/bottles.png';
import materialsIcon from '../img/icons/inventory/materials.png';

// MAIN
import administrationIcon from '../img/icons/main/administration.png';
import administratorIcon from '../img/icons/main/administrator.png';
import cashierThreeIcon from '../img/icons/main/cashier-three.png';
import cashierTwoIcon from '../img/icons/main/cashier-two.png';
import cashierIcon from '../img/icons/main/cashier.png';
import contractIcon from '../img/icons/main/contract.png';
import dispatchIcon from '../img/icons/main/dispatch.png';
import expensesIcon from '../img/icons/main/expenses.png';
import generalReportsIcon from '../img/icons/main/general-reports.png';
import inventoryIcon from '../img/icons/main/inventory.png';
import inventoryTwoIcon from '../img/icons/main/inventory-two.png';
import kardexIcon from '../img/icons/main/kardex.png';
import ordersIcon from '../img/icons/main/orders.png';
import pendingAccountsIcon from '../img/icons/main/pending-accounts.png';
import pendingPurchasesIcon from '../img/icons/main/pending-purchases.png';
import pendingSalesIcon from '../img/icons/main/pending-sales.png';
import policyIcon from '../img/icons/main/policy.png';
import printerIcon from '../img/icons/main/printer.png';
import productionIcon from '../img/icons/main/production.png';
import purchasesIcon from '../img/icons/main/purchases.png';
import reportsIcon from '../img/icons/main/reports.png';
import requisitionsIcon from '../img/icons/main/requisition.png';
import shippingIcon from '../img/icons/main/shipping.png';
import truckIcon from '../img/icons/main/truck.png';

// GENERAL
import addIcon from '../img/icons/general/add.png';
import add1Icon from '../img/icons/general/add1.png';
import editIcon from '../img/icons/general/edit.png';
import editUserIcon from '../img/icons/general/edituser.png';
import goBackIcon from '../img/icons/general/goback.png';
import logoutIcon from '../img/icons/general/logout.png';
import refreshIcon from '../img/icons/general/refresh.png';
import addUserIcon from '../img/icons/general/adduser.png';
import searchForIcon from '../img/icons/general/searchfor.png';

// ICONS
import addProductIcon from '../img/icons/add-product.png';
import supplier2Icon from '../img/icons/supplier.png';
import cashPaymentIcon from '../img/icons/cashpayment.png';
import creditPaymentIcon from '../img/icons/creditpayment.png';
import ticketIcon from '../img/icons/ticket.png';
import invoice2Icon from '../img/icons/invoice2.png';
import invoiceTax2Icon from '../img/icons/invoicetax2.png';
import creditNoteIcon from '../img/icons/creditnote.png';
import debitNoteIcon from '../img/icons/debitnote.png';
import productsIcon from '../img/icons/products.png';
import clearIcon from '../img/icons/clear.png';

// MENU

import menuExpensesIcon from '../img/icons/menu/expenses.png';
import menuPurchasesIcon from '../img/icons/menu/purchases.png';

const ImageProvider = ({
  fileRoute,
  width = '100px',
  addBackground = false,
  colorBackground = 'transparent',
  backgroundMargin = 20,
  backgroundPadding = 20
}) => (
  <img
    alt="example"
    src={fileRoute}
    style={{
      width,
      margin: addBackground ? backgroundMargin : 0, 
      padding: addBackground ? backgroundPadding : 0,
      backgroundColor: colorBackground,
      borderRadius: addBackground ? 10 : 0,
    }}
  />
)

// ADMIN
export const GBrandIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={brandIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GCustomersIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={customersIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GGeneralDataIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={generalDataIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GGeneralInformationIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={generalInformationIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GPinIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={pinIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GPlacesIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={placesIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GProductBrandIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={productBrandIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GProductLineIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={productLineIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GProviderIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={providerIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GRolesIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={rolesIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GRoutesIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={routesIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GSalesAgentIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={salesAgentIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GSupplierIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={supplierIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GTrackIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={trackIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GUsersIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={usersIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);

//ATTACHMENTS
export const GPdfFileIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={pdfFileIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);

//DOCS
export const GAddFileIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={addFileIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GAddFolderIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={addFolderIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GBooksIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={booksIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GSaleReportIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={saleReportIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);

//INVENTORY
export const GBottlesIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={bottlesIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GMaterialsIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={materialsIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);

// MAIN
export const GAdministrationIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={administrationIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GAdministratorIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={administratorIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GCashierThreeIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={cashierThreeIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GCashierTwoIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={cashierTwoIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GCashierIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={cashierIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GContractIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={contractIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GDispatchIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={dispatchIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GExpensesIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={expensesIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GGeneralReportsIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={generalReportsIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GInventoryIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={inventoryIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GInventoryTwoIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={inventoryTwoIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GKardexIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={kardexIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GOrdersIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={ordersIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GPendingAccountsIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={pendingAccountsIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GPendingPurchasesIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={pendingPurchasesIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GPendingSalesIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={pendingSalesIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GPolicyIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={policyIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GPrinterIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={printerIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GProductionIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={productionIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GPurchasesIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={purchasesIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GReportsIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={reportsIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GRequisitionIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={requisitionsIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GShippingIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={shippingIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GTruckIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={truckIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);

// GENERAL
export const GAddIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={addIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GAdd1Icon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={add1Icon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GEditIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={editIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GEditUserIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={editUserIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GGoBackIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={goBackIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GLogoutIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={logoutIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GRefreshIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={refreshIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GAddUserIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={addUserIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GSearchForIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={searchForIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);

// ICONS
export const GAddProductIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={addProductIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GSupplier2Icon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={supplier2Icon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GCashPaymentIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={cashPaymentIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GCreditPaymentIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={creditPaymentIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GTicketIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={ticketIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GInvoice2Icon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={invoice2Icon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GInvoiceTax2Icon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={invoiceTax2Icon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GCreditNoteIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={creditNoteIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GDebitNoteIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={debitNoteIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GProductsIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={productsIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
export const GClearIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={clearIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);

// MENU

export const GMenuExpensesIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent', backgroundMargin = null, backgroundPadding = null }) =>
  (<ImageProvider fileRoute={menuExpensesIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} backgroundMargin={backgroundMargin} backgroundPadding={backgroundPadding} />);
export const GMenuPurchasesIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent', backgroundMargin = null, backgroundPadding = null }) =>
  (<ImageProvider fileRoute={menuPurchasesIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} backgroundMargin={backgroundMargin} backgroundPadding={backgroundPadding} />);
