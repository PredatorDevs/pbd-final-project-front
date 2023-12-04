import { forEach } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

class PurchaseDetailModel {
  constructor(detailId, detailName, detailIsTaxable, detailQuantity, detailUnitCost, detailTaxesData) {
    this.uuid = uuidv4();

    this.detailId = detailId != null ? detailId : 0;

    this.detailName = detailName != null ? detailName : '';

    this.detailIsTaxable = detailIsTaxable != null ? detailIsTaxable : '';

    this.detailQuantity = detailQuantity != null ? detailQuantity : 0;

    // this.detailBlocks = detailBlocks != null ? detailBlocks : 0;

    this.detailUnitCost = detailUnitCost != null ? detailUnitCost : 0;

    this.detailSubTotal = this.detailQuantity * this.detailUnitCost;

    this.detailTaxableTotal = this.detailIsTaxable === 1 ? this.detailQuantity * this.detailUnitCost : 0;

    this.detailNoTaxableTotal = this.detailIsTaxable === 0 ? this.detailQuantity * this.detailUnitCost : 0;
    
    this.detailTotalTaxes = this.getDetailTotalTaxes(detailTaxesData, detailQuantity, detailUnitCost) || 0;

    this.detailTaxableWithoutTaxesTotal = this.detailTaxableTotal - this.detailTotalTaxes;

    this.detailTaxesData = detailTaxesData != null ? detailTaxesData : [];
  }

  getDetailTotalTaxes(taxesData, quantity, unitCost) {
    let totalTaxes = 0; 
    
    if (this.detailIsTaxable === 1) {
      forEach(taxesData, (tax) => {
        if (tax.isPercentage === 1) {
          let subTotal = (quantity * unitCost);
          let taxRate = (+tax.taxRate);

          totalTaxes += (subTotal * taxRate);
        } else {
          totalTaxes += (quantity * ++tax.taxRate);
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
//   detailUnitCost: detailUnitCost,
//   detailSubTotal: detailQuantity * detailUnitCost
// }

export default PurchaseDetailModel;
