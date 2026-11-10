
"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Eye,
  Package,
  CheckCircle,
  XCircle,
  Tags,
} from "lucide-react";
import { toast } from "sonner";

interface Option {
  id: number;
  name: string;
}

interface Product {
  id: number;
  product_name: string;
  category_id: number;
  sub_category_id: number;
  brand_id: number;
  category_name: string;
  sub_category_name: string;
  brand_name: string;
  description: string;
  status: "Active" | "Inactive";
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [subCategories, setSubCategories] = useState<Option[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [editId, setEditId] = useState<number | null>(null);

  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] =
    useState<"Active" | "Inactive">("Active");

  // NORMALIZE DROPDOWN DATA
  const normalizeOptions = (data: any[]): Option[] =>
    data.map((item) => ({
      id: Number(item.id),
      name:
        item.name ||
        item.category_name ||
        item.sub_category_name ||
        item.brand_name ||
        "",
    }));

  // NORMALIZE PRODUCT DATA
  const normalizeProduct = (item: any): Product => ({
    id: Number(item.id),
    product_name: item.product_name || item.name || "",
    category_id: Number(item.category_id || 0),
    sub_category_id: Number(item.sub_category_id || 0),
    brand_id: Number(item.brand_id || 0),
    category_name:
      item.category?.category_name ||
      item.category?.name ||
      item.category_name ||
      "",
    sub_category_name:
      item.sub_category?.sub_category_name ||
      item.sub_category?.name ||
      item.sub_category_name ||
      "",
    brand_name:
      item.brand?.brand_name ||
      item.brand?.name ||
      item.brand_name ||
      "",
    description: item.description || "",
    status: item.status === "Inactive" ? "Inactive" : "Active",
  });

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(
        ProjectApiList.productList,
        { params: { per_page: 1000 } }
      );

      const result = response.data?.data;
      const rows = Array.isArray(result)
        ? result
        : result?.data || [];

      setProducts(rows.map(normalizeProduct));
    } catch (error: any) {
      console.error("Product List Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Products load nahi hue"
      );
    }
  };

  // FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(
        ProjectApiList.categoryList
      );

      const result = response.data?.data;
      const rows = Array.isArray(result)
        ? result
        : result?.data || [];

      setCategories(normalizeOptions(rows));
    } catch (error) {
      console.error("Category List Error:", error);
      toast.error("Categories load nahi hui");
    }
  };

  // FETCH SUB CATEGORIES
  const fetchSubCategories = async () => {
    try {
      const response = await axiosInstance.get(
        ProjectApiList.subCategoryList
      );

      const result = response.data?.data;
      const rows = Array.isArray(result)
        ? result
        : result?.data || [];

      setSubCategories(normalizeOptions(rows));
    } catch (error) {
      console.error("Sub Category List Error:", error);
      toast.error("Sub categories load nahi hui");
    }
  };

  // FETCH BRANDS
  const fetchBrands = async () => {
    try {
      const response = await axiosInstance.get(
        ProjectApiList.brandList
      );

      const result = response.data?.data;
      const rows = Array.isArray(result)
        ? result
        : result?.data || [];

      setBrands(normalizeOptions(rows));
    } catch (error) {
      console.error("Brand List Error:", error);
      toast.error("Brands load nahi hue");
    }
  };

  // INITIAL DATA
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchSubCategories(),
        fetchBrands(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  // FILTER SUB CATEGORIES
  const filteredSubCategories = subCategories.filter((item: any) => {
    if (!categoryId) return true;

    const original = item as any;
    const parentId = original.category_id;

    // If API provides category_id, show only matching subcategories.
    // Otherwise show all subcategories.
    return parentId
      ? Number(parentId) === Number(categoryId)
      : true;
  });

  // RESET FORM
  const resetForm = () => {
    setProductName("");
    setCategoryId("");
    setSubCategoryId("");
    setBrandId("");
    setDescription("");
    setStatus("Active");
    setEditId(null);
    setShowModal(false);
  };

  // OPEN ADD MODAL
  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = (item: Product) => {
    setEditId(item.id);
    setProductName(item.product_name);
    setCategoryId(String(item.category_id || ""));
    setSubCategoryId(String(item.sub_category_id || ""));
    setBrandId(String(item.brand_id || ""));
    setDescription(item.description);
    setStatus(item.status);
    setShowModal(true);
  };

  // OPEN VIEW MODAL
  const openViewModal = (item: Product) => {
    setSelectedProduct(item);
    setShowViewModal(true);
  };

  // SAVE PRODUCT
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!productName.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!categoryId) {
      toast.error("Please select category");
      return;
    }

    if (!subCategoryId) {
      toast.error("Please select sub category");
      return;
    }

    if (!brandId) {
      toast.error("Please select brand");
      return;
    }

    const payload = {
      product_name: productName.trim(),
      category_id: Number(categoryId),
      sub_category_id: Number(subCategoryId),
      brand_id: Number(brandId),
      description: description.trim(),
      status,
    };

    try {
      setSaving(true);

      if (editId !== null) {
        await axiosInstance.put(
          ProjectApiList.productUpdate(editId),
          payload
        );

        toast.success("Product successfully updated");
      } else {
        await axiosInstance.post(
          ProjectApiList.productCreate,
          payload
        );

        toast.success("Product successfully added");
      }

      resetForm();
      await fetchProducts();
    } catch (error: any) {
      console.error("Product Save Error:", error);

      const validationMessage = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()[0]
        : null;

      toast.error(
        String(
          validationMessage ||
            error.response?.data?.message ||
            "Product save nahi hua"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  // DELETE PRODUCT
  const deleteProduct = async (id: number) => {
    const item = products.find((product) => product.id === id);

    if (!item) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${item.product_name}?`
      )
    ) {
      return;
    }

    try {
      await axiosInstance.delete(
        ProjectApiList.productDelete(id)
      );

      toast.success("Product successfully deleted");
      await fetchProducts();
    } catch (error: any) {
      console.error("Delete Product Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Product delete nahi hua"
      );
    }
  };

  // SEARCH
  const filteredProducts = products.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.product_name.toLowerCase().includes(keyword) ||
      item.category_name.toLowerCase().includes(keyword) ||
      item.sub_category_name.toLowerCase().includes(keyword) ||
      item.brand_name.toLowerCase().includes(keyword)
    );
  });

  // STATISTICS
  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Active Products",
      value: products.filter(
        (item) => item.status === "Active"
      ).length,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Inactive Products",
      value: products.filter(
        (item) => item.status === "Inactive"
      ).length,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
    {
      title: "Total Brands",
      value: brands.length,
      icon: Tags,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Package size={23} className="text-amber-700" />
            </div>

            <h1 className="text-2xl font-bold text-gray-800">
              Product Master
            </h1>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Manage your products, categories and brands.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition"
        >
          <Plus size={19} />
          Add Product
        </button>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="text-2xl font-bold text-gray-800 mt-2">
                    {stat.value}
                  </h2>
                </div>

                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PRODUCT TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">

        {/* TABLE HEADER */}
        <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Product List
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View and manage all products.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-4 font-semibold">#</th>
                <th className="px-5 py-4 font-semibold">
                  Product Name
                </th>
                <th className="px-5 py-4 font-semibold">
                  Category
                </th>
                <th className="px-5 py-4 font-semibold">
                  Sub Category
                </th>
                <th className="px-5 py-4 font-semibold">
                  Brand
                </th>
                <th className="px-5 py-4 font-semibold">
                  Status
                </th>
                <th className="px-5 py-4 font-semibold text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-500"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-amber-50/30 transition"
                  >
                    <td className="px-5 py-4 text-gray-500">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {item.product_name}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {item.category_name || "-"}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {item.sub_category_name || "-"}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {item.brand_name || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">

                        <button
                          type="button"
                          onClick={() => openViewModal(item)}
                          title="View"
                          className="p-2 rounded-lg border border-green-200 text-green-600 hover:bg-green-50 transition"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          title="Edit"
                          className="p-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteProduct(item.id)}
                          title="Delete"
                          className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-500"
                  >
                    <Package
                      size={30}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER */}
        <div className="px-5 py-4 border-t text-sm text-gray-500">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}
            <div className="flex justify-between items-center p-5 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {editId !== null
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Enter product details below.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5 space-y-5"
            >

              {/* PRODUCT NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>

                <input
                  type="text"
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>

                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setSubCategoryId("");
                  }}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">Select Category</option>

                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUB CATEGORY */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Category *
                </label>

                <select
                  value={subCategoryId}
                  onChange={(e) =>
                    setSubCategoryId(e.target.value)
                  }
                  required
                  disabled={!categoryId}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100"
                >
                  <option value="">Select Sub Category</option>

                  {filteredSubCategories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* BRAND */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>

                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">Select Brand</option>

                  {brands.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  rows={4}
                  placeholder="Enter product description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>

              {/* STATUS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as "Active" | "Inactive"
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-medium"
                >
                  {saving
                    ? "Saving..."
                    : editId !== null
                      ? "Update Product"
                      : "Save Product"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* VIEW PRODUCT MODAL */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden">

            {/* VIEW HEADER */}
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Product Details
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Complete product information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedProduct(null);
                  setShowViewModal(false);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* VIEW CONTENT */}
            <div className="p-5 space-y-4">

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Product Name
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedProduct.product_name}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Category
                  </p>

                  <p className="font-semibold text-gray-800">
                    {selectedProduct.category_name || "-"}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Sub Category
                  </p>

                  <p className="font-semibold text-gray-800">
                    {selectedProduct.sub_category_name || "-"}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Brand
                  </p>

                  <p className="font-semibold text-gray-800">
                    {selectedProduct.brand_name || "-"}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Status
                  </p>

                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      selectedProduct.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedProduct.status}
                  </span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Description
                </p>

                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedProduct.description || "No description available."}
                </p>
              </div>

            </div>

            {/* VIEW FOOTER */}
            <div className="flex justify-end p-5 border-t">
              <button
                type="button"
                onClick={() => {
                  setSelectedProduct(null);
                  setShowViewModal(false);
                }}
                className="px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
