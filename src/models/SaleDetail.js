import { forEach } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

class SaleDetailModel {
  constructor(detailId, detailName, detailIsTaxable, detailQuantity, detailUnitPrice, detailTaxesData, detailIsService) {
    this.uuid = uuidv4();

    this.detailId = detailId != null ? detailId : 0;

    this.detailName = detailName != null ? detailName : '';

    this.detailIsTaxable = detailIsTaxable != null ? detailIsTaxable : '';

    this.detailQuantity = detailQuantity != null ? detailQuantity : 0;

    // this.detailBlocks = detailBlocks != null ? detailBlocks : 0;

    this.detailUnitPrice = detailUnitPrice != null ? detailUnitPrice : 0;

    this.detailUnitPriceWithoutTax = detailUnitPrice != null ? detailUnitPrice - this.getDetailUnitPriceTaxValue(detailTaxesData, detailUnitPrice) : 0;

    this.detailSubTotal = this.detailQuantity * this.detailUnitPrice;

    this.detailTaxableTotal = this.detailIsTaxable === 1 ? this.detailQuantity * this.detailUnitPrice : 0;

    this.detailNoTaxableTotal = this.detailIsTaxable === 0 ? this.detailQuantity * this.detailUnitPrice : 0;

    this.detailTotalTaxes = this.getDetailTotalTaxes(detailTaxesData, detailQuantity, detailUnitPrice) || 0;

    this.detailTaxableWithoutTaxesTotal = this.detailTaxableTotal - this.detailTotalTaxes;

    this.detailTaxesData = detailTaxesData != null ? detailTaxesData : [];

    this.detailIsService = detailIsService != null ? detailIsService : 0;
  }

  getDetailTotalTaxes(taxesData, quantity, unitPrice) {
    let totalTaxes = 0; 
    
    if (this.detailIsTaxable === 1) {
      forEach(taxesData, (tax) => {
        if (tax.isPercentage === 1) {
          totalTaxes += (((quantity * unitPrice) / (1 + +tax.taxRate)) * +tax.taxRate);
        } else {
          totalTaxes += (quantity * ++tax.taxRate);
        }
      })
    }
    return totalTaxes || 0;
  }

  getDetailUnitPriceTaxValue(taxesData, unitPrice) {
    let totalTaxes = 0; 
    
    if (this.detailIsTaxable === 1) {
      forEach(taxesData, (tax) => {
        if (tax.isPercentage === 1) {
          totalTaxes += (((unitPrice) / (1 + +tax.taxRate)) * +tax.taxRate);
        } else {
          totalTaxes += (unitPrice + ++tax.taxRate);
        }
      })
    }
    return totalTaxes || 0;
  }
}

// { 
//   index: docDetails.length,
//   detailId: detailSelected, 
//   detailName: find(productsData, ['productId', detailSelected]).productName,
//   detailQuantity: detailQuantity || 1,
//   detailUnitPrice: detailUnitPrice,
//   detailSubTotal: detailQuantity * detailUnitPrice
// }

export default SaleDetailModel;
