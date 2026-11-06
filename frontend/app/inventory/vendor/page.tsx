
"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

import VendorHeader from "./components/VendorHeader";
import VendorTable from "./components/VendorTable";

import VendorModal, {
  type Vendor,
  type VendorFormData,
} from "./components/VendorModal";

type ModalMode = "add" | "edit" | "view" | "delete" | null;

// Laravel API Response
interface VendorApiResponse {
  success: boolean;
  message: string;
  data: Vendor[];

  statistics: {
    total_vendors: number;
    active_vendors: number;
    inactive_vendors: number;
    opening_balance_total: number;
  };

  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const defaultStatistics = {
  total_vendors: 0,
  active_vendors: 0,
  inactive_vendors: 0,
  opening_balance_total: 0,
};

export default function VendorPage() {
  // =====================================
  // VENDOR DATA
  // =====================================

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);

  // Search
  const [search, setSearch] = useState("");

  // Modal
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedVendor, setSelectedVendor] =
    useState<Vendor | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Backend Statistics
  const [statistics, setStatistics] = useState(defaultStatistics);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // =====================================
  // API ERROR HANDLING
  // =====================================

  const handleApiError = (error: unknown, defaultMessage: string) => {
    console.error("Vendor API Error:", error);

    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        const errors = Object.values(
          responseData.errors as Record<string, string[]>
        ).flat();

        toast.error(errors[0] || defaultMessage);
        return;
      }

      if (responseData?.message) {
        toast.error(responseData.message);
        return;
      }
    }

    toast.error(defaultMessage);
  };

  // =====================================
  // GET VENDOR LIST
  // =====================================

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get<VendorApiResponse>(
        ProjectApiList.vendorList,
        {
          params: {
            search,
            page: currentPage,
            per_page: itemsPerPage,
          },
        }
      );

      setVendors(response.data.data || []);

      setStatistics(
        response.data.statistics || defaultStatistics
      );

      setTotalPages(
        response.data.pagination?.last_page || 1
      );

      setTotalItems(
        response.data.pagination?.total || 0
      );
    } catch (error) {
      handleApiError(error, "Vendor list load nahi hui.");
    } finally {
      setLoading(false);
    }
  }, [search, currentPage, itemsPerPage]);

  // Load API Data
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // =====================================
  // OPEN MODAL
  // =====================================

  const openModal = (
    mode: Exclude<ModalMode, null>,
    vendor?: Vendor
  ) => {
    setSelectedVendor(vendor ?? null);
    setModalMode(mode);
  };

  // =====================================
  // CLOSE MODAL
  // =====================================

  const closeModal = () => {
    setModalMode(null);
    setSelectedVendor(null);
  };

  // =====================================
  // ADD / UPDATE VENDOR
  // =====================================

  const handleSubmit = async (data: VendorFormData) => {
    try {
      setLoading(true);

      if (modalMode === "edit" && selectedVendor) {
        // UPDATE API
        const response = await axiosInstance.put(
          ProjectApiList.vendorUpdate(selectedVendor.id),
          data
        );

        toast.success(
          response.data.message || "Vendor updated successfully!"
        );

        closeModal();
        await fetchVendors();

      } else {
        // CREATE API
        const response = await axiosInstance.post(
          ProjectApiList.vendorCreate,
          data
        );

        toast.success(
          response.data.message || "Vendor added successfully!"
        );

        closeModal();

        if (currentPage !== 1) {
          setCurrentPage(1);
        } else {
          await fetchVendors();
        }
      }
    } catch (error) {
      handleApiError(error, "Vendor save nahi hua.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // DELETE VENDOR
  // =====================================

  const handleDelete = async (vendor: Vendor) => {
    try {
      setLoading(true);

      const response = await axiosInstance.delete(
        ProjectApiList.vendorDelete(vendor.id)
      );

      toast.success(
        response.data.message || "Vendor deleted successfully!"
      );

      closeModal();

      if (vendors.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        await fetchVendors();
      }
    } catch (error) {
      handleApiError(error, "Vendor delete nahi hua.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // EXPORT CSV
  // Exports currently loaded page
  // =====================================

  const handleExport = () => {
    if (vendors.length === 0) {
      toast.error("No vendors available to export!");
      return;
    }

    const headers = [
      "Vendor Code",
      "Vendor Name",
      "Company Name",
      "Category",
      "Contact Person",
      "Mobile",
      "Email",
      "GST Number",
      "Address",
      "City",
      "State",
      "Pincode",
      "Payment Terms",
      "Opening Balance",
      "Status",
      "Remarks",
    ];

    const rows = vendors.map((vendor) => [
      vendor.vendor_code,
      vendor.vendor_name,
      vendor.company_name,
      vendor.category,
      vendor.contact_person,
      vendor.mobile,
      vendor.email,
      vendor.gst_number,
      vendor.address,
      vendor.city,
      vendor.state,
      vendor.pincode,
      vendor.payment_terms,
      vendor.opening_balance,
      vendor.status,
      vendor.remarks,
    ]);

    const escapeCSV = (value: unknown) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) =>
        row.map(escapeCSV).join(",")
      ),
    ].join("\n");

    const blob = new Blob(
      ["\uFEFF" + csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "vendor-list.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    toast.success("Vendor list exported successfully!");
  };

  // =====================================
  // MAIN UI
  // =====================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* VENDOR HEADER */}
        <VendorHeader
          search={search}
          setSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          onAdd={() => openModal("add")}
          onExport={handleExport}
        />

        {/* LOADING */}
        {loading && (
          <div className="rounded-xl bg-orange-50 p-3 text-center text-sm text-orange-700">
            Please wait, loading vendor data...
          </div>
        )}

        {/* VENDOR TABLE */}
        <VendorTable
          vendors={vendors}
          totalVendors={statistics.total_vendors}
          activeVendors={statistics.active_vendors}
          inactiveVendors={statistics.inactive_vendors}
          openingBalanceTotal={statistics.opening_balance_total}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(limit) => {
            setItemsPerPage(limit);
            setCurrentPage(1);
          }}
          onView={(vendor) => openModal("view", vendor)}
          onEdit={(vendor) => openModal("edit", vendor)}
          onDelete={(vendor) => openModal("delete", vendor)}
        />

        {/* VENDOR MODAL */}
        <VendorModal
          mode={modalMode}
          vendor={selectedVendor}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />

      </div>
    </div>
  );
}
