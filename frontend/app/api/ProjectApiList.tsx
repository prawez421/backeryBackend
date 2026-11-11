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

  // unit 
  unitList: "/units",
  unitCreate: "/units",
  unitDetails: (id: number | string) => `/units/${id}`,
  unitUpdate: (id: number | string) => `/units/${id}`,
  unitDelete: (id: number | string) => `/units/${id}`,

  // categories
  categoryList: "/categories",
  categoryCreate: "/categories",
  categoryUpdate: (id: number) => `/categories/${id}`,
  categoryDelete: (id: number) => `/categories/${id}`,

  // sub categories
  subCategoryList: "/sub-categories",
  subCategoryCreate: "/sub-categories",
  subCategoryUpdate: (id: number) => `/sub-categories/${id}`,
  subCategoryDelete: (id: number) => `/sub-categories/${id}`,

  // brands
  brandList:"/brands",
  brandCreate:"/brands",
  brandUpdate:(id: number) => `/brands/${id}`,
  brandDelete:(id: number) => `/brands/${id}`,

  // ATTRIBUTE MASTER
  attributeList: "/attributes",
  attributeCreate: "/attributes",
  attributeDetails: (id: number | string) => `/attributes/${id}`,
  attributeUpdate: (id: number | string) =>  `/attributes/${id}`,
  attributeDelete: (id: number | string) => `/attributes/${id}`,
};

export default ProjectApiList;