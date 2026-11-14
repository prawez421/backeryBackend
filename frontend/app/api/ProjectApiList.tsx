const ProjectApiList = {
  // Authentication APIs
  login: "/login",
  register: "/register",
  logout: "/logout",

  // Vendor Master APIs
  vendorList: "/vendors",
  vendorCreate: "/vendors",
  vendorDetails: (id: number | string) => `/vendors/${id}`,
  vendorUpdate: (id: number | string) => `/vendors/${id}`,
  vendorDelete: (id: number | string) => `/vendors/${id}`,

  // Unit APIs
  unitList: "/units",
  unitCreate: "/units",
  unitDetails: (id: number | string) => `/units/${id}`,
  unitUpdate: (id: number | string) => `/units/${id}`,
  unitDelete: (id: number | string) => `/units/${id}`,

  // Categories APIs
  categoryList: "/categories",
  categoryCreate: "/categories",
  categoryDetails: (id: number | string) => `/categories/${id}`,
  categoryUpdate: (id: number | string) => `/categories/${id}`,
  categoryDelete: (id: number | string) => `/categories/${id}`,

  // Sub Categories APIs
  subCategoryList: "/sub-categories",
  subCategoryCreate: "/sub-categories",
  subCategoryDetails: (id: number | string) => `/sub-categories/${id}`,
  subCategoryUpdate: (id: number | string) => `/sub-categories/${id}`,
  subCategoryDelete: (id: number | string) => `/sub-categories/${id}`,

  // Brands APIs
  brandList: "/brands",
  brandCreate: "/brands",
  brandDetails: (id: number | string) => `/brands/${id}`,
  brandUpdate: (id: number | string) => `/brands/${id}`,
  brandDelete: (id: number | string) => `/brands/${id}`,

  // Attribute Master APIs
  attributeList: "/attributes",
  attributeCreate: "/attributes",
  attributeDetails: (id: number | string) => `/attributes/${id}`,
  attributeUpdate: (id: number | string) => `/attributes/${id}`,
  attributeDelete: (id: number | string) => `/attributes/${id}`,

  // products 
  // Product Master APIs
  productList: "/products",
  productCreate: "/products",
  productDetails: (id: number | string) => `/products/${id}`,
  productUpdate: (id: number | string) => `/products/${id}`,
  productDelete: (id: number | string) => `/products/${id}`,

  // ===============================
  // PURCHASE MANAGEMENT APIs
  // ===============================
  purchaseList: "/purchases",
  purchaseCreate: "/purchases",
  // Active vendors for purchase
  purchaseVendors: "/purchases/vendors",
  purchaseProducts: "/purchases/products",
  purchaseDetails: (id: number | string) => `/purchases/${id}`,
  purchaseUpdate: (id: number | string) => `/purchases/${id}`,
  purchaseDelete: (id: number | string) => `/purchases/${id}`,



  // public main frontend website 
  menuCategories: "/menu/categories",
  menuSubCategories: "/menu/sub-categories",
  menuProducts: "/menu/products",
  


};

export default ProjectApiList;