import { useTable, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { PageButton } from '../shared';
import React, { useState, useEffect } from 'react';
import { useAsyncDebounce } from 'react-table';
import Skeleton from 'react-loading-skeleton';
import { ChevronDownIcon, ChevronUpIcon, Upload } from 'lucide-react';
import { CSVLink } from "react-csv";
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip } from '@mui/material';
import { Pencil, Trash2 } from "lucide-react";

function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}) {
    const count = preGlobalFilteredRows?.length;
    const [value, setValue] = useState(globalFilter);

    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined);
    }, 200);

    useEffect(() => {
        onChange(value);
    }, [value, onChange]);

    return (
        <div className="flex items-center gap-x-3">
            <label className="text-sm font-medium text-gray-600">Cari:</label>
            <input
                type="text"
                value={value || ""}
                onChange={e => {
                    setValue(e.target.value);
                }}
                placeholder={`${count} data...`}
                className="w-56 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-400"
            />
        </div>
    );
}

interface TableProps {
    columns: any[];
    data: any[];
    isLoading: boolean;
    filename?: string;
    getCellProps?: (cell: any) => any;
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
    // Tambahkan props baru untuk filter tahun
    tahunList?: number[];
    filterTahun?: string;
    onFilterTahunChange?: (value: string) => void;
    onUploadClick?: () => void;
}

export default function Table({ 
    columns, 
    data, 
    isLoading, 
    filename = "Data",
    getCellProps = (cell) => ({ className: cell }),
    onEdit,
    onDelete,
    // Destructure props baru
    tahunList = [],
    filterTahun = "",
    onFilterTahunChange,
    onUploadClick

}: TableProps) {
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        state,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        preGlobalFilteredRows,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 50 }
        },
        useGlobalFilter,
        useSortBy,
        usePagination,
    );

    // ================= EXPORT DATA CLEAN =================

    const exportColumns = columns.filter(col => col.accessor);

    const exportData = data.map((row) => {
        const obj: any = {};

        exportColumns.forEach((col) => {
            const key = col.accessor;
            let value = row[key];

            if (Array.isArray(value)) {
                value = value.join(", ");
            }

            obj[key] = value ?? "";
        });

        return obj;
    });

    // Fungsi untuk mendapatkan nama file dengan tanggal
    function getFileName(baseName: string, extension: string) {
        const date = new Date();
        const dateStr = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
        return `${baseName}_${dateStr}.${extension}`;
    }

    function downloadExcel() {
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, filename);
        XLSX.writeFile(workbook, getFileName(filename, 'xlsx')); 
    }

    // Dapatkan tahun terbaru dari tahunList
    const latestYear = tahunList.length > 0 ? Math.max(...tahunList) : null;
    
    return (
        <>
            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <GlobalFilter
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={state.globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                    
                    {/* FILTER TAHUN - Dipindahkan ke sini */}
                    {onFilterTahunChange && (
                        <div className="flex items-center gap-x-3">
                            <label className="text-sm font-medium text-gray-600">Tahun:</label>
                            <select
                                value={filterTahun}
                                onChange={(e) => onFilterTahunChange(e.target.value)}
                                className="w-40 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-400"
                            >
                                <option value="">
                                    Semua Tahun
                                </option>
                                {tahunList.map((tahun) => (
                                    <option key={tahun} value={tahun}>
                                        {tahun}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1">
                {/* Upload Data */}
                    {onUploadClick && (
                        <Button
                            onClick={onUploadClick}
                            className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white flex gap-2 items-center text-sm font-semibold shadow-sm transition-all rounded-md"
                        >
                            <Upload size={16} />
                            Upload Data 
                        </Button>
                    )}
                
                {/* Download Dropdown */}
                <details className="dropdown dropdown-end">
                    <summary className="btn btn-sm h-9 bg-blue-600 hover:bg-blue-700 text-white border-none flex items-center gap-2 shadow-sm transition-all duration-200 font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.9z" />
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                        </svg>
                        <span>Download {filename}</span>
                        <ChevronDownIcon className="w-3.5 h-3.5" />
                    </summary>
                    <ul className="dropdown-content z-50 menu p-2 shadow-lg bg-white rounded-lg border border-gray-200">
                        <li className="hover:bg-gray-50 rounded transition-colors duration-150">
                            <CSVLink
                                enclosingCharacter={""}
                                filename={getFileName(filename, 'csv')}
                                data={exportData}
                                className="flex items-center gap-2 text-gray-700 py-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-filetype-csv" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM3.517 14.841a1.13 1.13 0 0 0 .401.823q.195.162.478.252.284.091.665.091.507 0 .859-.158.354-.158.539-.44.187-.284.187-.656 0-.336-.134-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.566-.21l-.621-.144a1 1 0 0 1-.404-.176.37.37 0 0 1-.144-.299q0-.234.185-.384.188-.152.512-.152.214 0 .37.068a.6.6 0 0 1 .246.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.2-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.439 0-.776.15-.337.149-.527.421-.19.273-.19.639 0 .302.122.524.124.223.352.367.228.143.539.213l.618.144q.31.073.463.193a.39.39 0 0 1 .152.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.167.07-.413.07-.175 0-.32-.04a.8.8 0 0 1-.248-.115.58.58 0 0 1-.255-.384zM.806 13.693q0-.373.102-.633a.87.87 0 0 1 .302-.399.8.8 0 0 1 .475-.137q.225 0 .398.097a.7.7 0 0 1 .272.26.85.85 0 0 1 .12.381h.765v-.072a1.33 1.33 0 0 0-.466-.964 1.4 1.4 0 0 0-.489-.272 1.8 1.8 0 0 0-.606-.097q-.534 0-.911.223-.375.222-.572.632-.195.41-.196.979v.498q0 .568.193.976.197.407.572.626.375.217.914.217.439 0 .785-.164t.55-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.764a.8.8 0 0 1-.118.363.7.7 0 0 1-.272.25.9.9 0 0 1-.401.087.85.85 0 0 1-.478-.132.83.83 0 0 1-.299-.392 1.7 1.7 0 0 1-.102-.627zm8.239 2.238h-.953l-1.338-3.999h.917l.896 3.138h.038l.888-3.138h.879z" />
                                </svg>
                                CSV File
                            </CSVLink>
                        </li>
                        <li className="hover:bg-gray-50 rounded transition-colors duration-150">
                            <button className="flex items-center gap-2 text-gray-700" onClick={() => downloadExcel()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-spreadsheet" viewBox="0 0 16 16">
                                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v4h10V2a1 1 0 0 0-1-1zm9 6h-3v2h3zm0 3h-3v2h3zm0 3h-3v2h2a1 1 0 0 0 1-1zm-4 2v-2H6v2zm-4 0v-2H3v1a1 1 0 0 0 1 1zm-2-3h2v-2H3zm0-3h2V7H3zm3-2v2h3V7zm3 3H6v2h3z" />
                                </svg>
                                Excel File
                            </button>
                        </li>
                    </ul>
                </details>
                </div>
            </div>

            {/* Tabel */}
            <div className="mt-4 flex flex-col">
                <div className="align-middle inline-block w-full">
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                        <table {...getTableProps()} className="w-full divide-y divide-gray-200 text-nowrap">
                            <thead className="bg-blue-600 text-white">
                                {headerGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()} className="hover:bg-blue-700 transition-colors">
                                        {(onEdit || onDelete) && (
                                            <th className="px-2 py-2 text-xs font-semibold uppercase whitespace-nowrap">
                                                Aksi
                                            </th>
                                        )}
                                        {headerGroup.headers.map(column => (
                                            <th
                                                scope="col"
                                                className="px-2 py-2 text-left text-[9px] md:text-[10px] lg:text-xs font-semibold uppercase tracking-tighter cursor-pointer select-none hover:bg-blue-700 transition-colors duration-150 whitespace-nowrap"
                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                            >
                                                <div className="flex items-center gap-1">
                                                    {column.render('Header')}
                                                    <span className="inline-flex items-center flex-shrink-0">
                                                        {column.isSorted ? (
                                                            column.isSortedDesc ? (
                                                                <ChevronDownIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                                            ) : (
                                                                <ChevronUpIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                                            )
                                                        ) : (
                                                            <ChevronDownIcon className="w-3 h-3 md:w-3.5 md:h-3.5 opacity-30" />
                                                        )}
                                                    </span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>

                            <tbody
                                {...getTableBodyProps()}
                                className="divide-y divide-gray-200 bg-white"
                            >
                                {isLoading ? (
                                    [...Array(10)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            {Array.from({ length: columns?.length }).map((_, j) => (
                                                <td key={j} className="px-2 py-1">
                                                    <Skeleton height={12} width="70%" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : page?.length > 0 ? (
                                    page.map((row, rowIndex) => {
                                        prepareRow(row);
                                        // Hitung nomor urut global
                                        const pageIndex = state.pageIndex || 0;
                                        const pageSize = state.pageSize || 50;
                                        const globalRowNumber = (pageIndex * pageSize) + rowIndex + 1;
                                        
                                        return (
                                            <tr
                                                key={row.id}
                                                {...row.getRowProps()}
                                                className="hover:bg-blue-50 transition-colors duration-100 border-b border-gray-100"
                                            >

                                                {/* Kolom Aksi paling kiri */}
                                                {(onEdit || onDelete) && (
                                                    <td className="px-2 py-1.5 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">

                                                            {onEdit && (
                                                                <button
                                                                    onClick={() => onEdit(row.original)}
                                                                    className="p-1 rounded-md bg-yellow-100 hover:bg-yellow-200 transition"
                                                                >
                                                                    <Pencil size={16} className="text-yellow-600" />
                                                                </button>
                                                            )}

                                                            {onDelete && (
                                                                <button
                                                                    onClick={() => onDelete(row.original)}
                                                                    className="p-1 rounded-md bg-red-100 hover:bg-red-200 transition"
                                                                >
                                                                    <Trash2 size={16} className="text-red-600" />
                                                                </button>
                                                            )}

                                                        </div>
                                                    </td>
                                                )}

                                                {row.cells.map((cell, cellIndex) => {
                                                    
                                                    const cellProps = cell.getCellProps();
                                                    const customProps = getCellProps(cell);
                                                    const finalClassName = `${cellProps.className || ""} ${customProps.className || ""}`.trim();

                                                    const isNumberColumn = cell.column.id === "no";

                                                    const content = (
                                                        <td
                                                            key={cell.id}
                                                            {...cellProps}
                                                            {...customProps}
                                                            onClick={() => {
                                                                if (cell.column.onCellClick) {
                                                                    cell.column.onCellClick(cell.value, cell.row);
                                                                }
                                                            }}
                                                            className={`px-2 py-1.5 text-[10px] md:text-[11px] lg:text-sm text-gray-900 font-semibold whitespace-nowrap ${finalClassName}`}
                                                        >
                                                            {isNumberColumn ? globalRowNumber : cell.render("Cell")}
                                                        </td>
                                                    );

                                                    return cell.column.onCellClick ? (
                                                        <Tooltip title="Lihat kegiatan" arrow placement="top">
                                                            {content}
                                                        </Tooltip>
                                                    ) : (
                                                        content
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={columns?.length + ((onEdit || onDelete) ? 1 : 0)}
                                            className="text-center py-6 text-gray-500 font-medium text-sm"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-gray-400" viewBox="0 0 16 16">
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                                </svg>
                                                Tidak ada data yang ditemukan
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            <div className="py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-t border-gray-200 mt-6">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">
                        Halaman <strong className="text-gray-900">{state.pageIndex + 1}</strong> dari <strong className="text-gray-900">{pageOptions?.length}</strong>
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-gray-700">
                        Tampilkan
                        <select
                            value={state.pageSize}
                            onChange={e => {
                                setPageSize(Number(e.target.value));
                            }}
                            className="ml-2 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            {[10, 20, 30, 40, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </select>
                        data
                    </span>
                </div>
                <div className="flex justify-center md:justify-end">
                    <nav className="inline-flex items-center gap-1" aria-label="Pagination">
                        <PageButton
                            onClick={() => gotoPage(0)}
                            disabled={!canPreviousPage}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Halaman Pertama"
                        >
                            <ChevronDoubleLeftIcon className="h-4 w-4" aria-hidden="true" />
                        </PageButton>
                        <PageButton
                            onClick={() => previousPage()}
                            disabled={!canPreviousPage}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Sebelumnya"
                        >
                            <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                        </PageButton>
                        <PageButton
                            onClick={() => nextPage()}
                            disabled={!canNextPage}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Selanjutnya"
                        >
                            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                        </PageButton>
                        <PageButton
                            onClick={() => gotoPage(pageCount - 1)}
                            disabled={!canNextPage}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Halaman Terakhir"
                        >
                            <ChevronDoubleRightIcon className="h-4 w-4" aria-hidden="true" />
                        </PageButton>
                    </nav>
                </div>
            </div>
        </>
    );
}