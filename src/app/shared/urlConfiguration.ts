export class URLConfiguration {

    public static get procurementGetUrl(): string { return 'Procurement/List' }
    public static get procurementDeleteUrl(): string { return "Procurement/Delete" };
    public static get procurementAddeUrl(): string { return "Procurement/Add" };
    public static get procurementUpdateeUrl(): string { return "Procurement/Update" };

    public static get farmerGetUrl(): string { return 'Farmer/List' }
    public static get farmerDeleteUrl(): string { return "Farmer/Delete" };
    public static get farmerAddeUrl(): string { return "Farmer/Add" };
    public static get farmerUpdateeUrl(): string { return "Farmer/Update" };
    public static get farmerDeactivateUrl(): string { return "Farmer/Deactivate" };
    public static get farmerActivateUrl(): string { return "Farmer/Activate" };

    public static get vendorGetUrl(): string { return 'Vendor/List' }
    public static get vendorDeleteUrl(): string { return "Vendor/Delete" };
    public static get vendorAddeUrl(): string { return "Vendor/Add" };
    public static get vendorUpdateeUrl(): string { return "Vendor/Update" };
    public static get vendorDeactivateUrl(): string { return "Vendor/Deactivate" };
    public static get vendorActivateUrl(): string { return "Vendor/Activate" };

    public static get productGetUrl(): string { return 'Product/List' }
    public static get productDeleteUrl(): string { return "Product/Delete" };
    public static get productAddeUrl(): string { return "Product/Add" };
    public static get productUpdateeUrl(): string { return "Product/Update" };
    public static get productDeactivateUrl(): string { return "Product/Deactivate" };
    public static get productActivateUrl(): string { return "Product/Activate" };

    public static get saleGetUrl(): string { return 'SaleDetail/List' }
    public static get saleDeleteUrl(): string { return "SaleDetail/Delete" };
    public static get saleAddeUrl(): string { return "SaleDetail/Add" };
    public static get saleUpdateeUrl(): string { return "SaleDetail/Update" };

    public static get inventoryGetUrl(): string { return 'Inventory/List' }
    public static get inventoryDeleteUrl(): string { return "Inventory/Delete" };
    public static get inventoryAddeUrl(): string { return "Inventory/Add" };
    public static get inventoryUpdateeUrl(): string { return "Inventory/Update" };

    public static get ProductwiseProcurementVsSaleDetailsGetUrl(): string { return "Dashboard/GetProductwiseProcurementVsSaleDetails" };
    public static get FarmerPaymentDetailseGetUrl(): string { return "Dashboard/GetFarmerPaymentDetails" };
    public static get VendorPaymentDetailseGetUrl(): string { return "Dashboard/GetVendorPaymentDetails" };
}