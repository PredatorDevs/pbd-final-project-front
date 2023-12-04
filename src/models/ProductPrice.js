class ProductPriceModel {
  constructor(obj) {
    obj = obj !== null && obj !== undefined ? obj : {}
    this.id = obj.id != null ? obj.id : 0
    this.productId = obj.productId != null ? obj.productId : 0;
    this.price = obj.price != null ? obj.price : 0;
    this.profitRate = obj.profitRate != null ? obj.profitRate : 0;
    this.profitRateFixed = obj.profitRateFixed != null ? obj.profitRateFixed : 0;
    this.isDefault = obj.isDefault != null ? obj.isDefault : 0;
  }
}

export default ProductPriceModel;
