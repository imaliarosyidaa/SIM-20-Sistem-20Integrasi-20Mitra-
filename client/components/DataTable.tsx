import React, { useState, useMemo } from "react";
import { Search, Filter, Download } from "lucide-react";
import Hottable from "@components/ui/Hottable";

interface Column {
  key: string;
  title: string;
  sortable?: boolean;
  type?: "text" | "numeric" | "dropdown" | "checkbox";
  numericFormat?: { pattern: string };
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  searchable?: boolean;
  filterable?: boolean;
  actions?: boolean;
  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  className?: string;
  height?: number;
}

export default function DataTable({
  data,
  columns,
  searchable = true,
  filterable = true,
  actions = false,
  onView,
  onEdit,
  onDelete,
  className = "",
  height = 400,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((row) =>
      columns.some((column) =>
        String(row[column.key] || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ),
    );
  }, [data, searchQuery, columns]);

  // Transform data for Handsontable
  const tableData = useMemo(() => {
    return filteredData.map((row) => columns.map((column) => row[column.key]));
  }, [filteredData, columns]);

  // Create column definitions for Handsontable
  const tableColumns = useMemo(() => {
    return columns.map((column, index) => ({
      data: index,
      readOnly: true,
    }));
  }, [columns]);

  const exportToCSV = () => {
    const headers = columns.map((col) => col.title).join(",");
    const rows = filteredData
      .map((row) => columns.map((col) => `"${row[col.key] || ""}"`).join(","))
      .join("\n");

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data-export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header with search and filters */}
      {(searchable || filterable) && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {searchable && (
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari data..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              )}
              {filterable && (
                <button className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportToCSV}
                className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Handsontable */}
      <div className="p-4">
        <Hottable
          data={tableData}
          colHeaders={columns.map((col) => col.title)}
          columns={tableColumns}
          width="100%"
          height={height}
          manualRowResize={true}
          manualColumnResize={true}
          contextMenu={true}
          filters={true}
          dropdownMenu={true}
          className={`data-table ${className}`}
        />
      </div>

      {/* Footer with row count */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Menampilkan {filteredData.length} dari {data.length} data
        </div>
      </div>
    </div>
  );
}
