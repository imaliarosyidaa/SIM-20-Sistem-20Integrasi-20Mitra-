import { useTable, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { PageButton } from '../shared';
import React, { useState, useEffect } from 'react';
import { useAsyncDebounce } from 'react-table';
import Skeleton from 'react-loading-skeleton';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { CSVLink, CSVDownload } from "react-csv";
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

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
        <div className="flex items-center gap-x-2">
            <label className="text-sm font-medium text-gray-700">Cari:</label>
            <input
                type="text"
                value={value || ""}
                onChange={e => {
                    setValue(e.target.value);
                }}
                placeholder={`${count} data...`}
                className="w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            />
        </div>
    );
}

export default function Table({ columns, data, isLoading, getCellProps = (cell) => ({ className: cell }) }) {
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
            initialState: { pageIndex: 0, pageSize: 20 }
        },
        useGlobalFilter,
        useSortBy,
        usePagination,
    );

    function downloadExcel(data) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Rekap Honor Mitra.xlsx");
    }

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={state.globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />

                <div className="dropdown">
                    <button className="btn btn-success dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Download </button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <a className="dropdown-item flex items-center gap-1" href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-csv" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM3.517 14.841a1.13 1.13 0 0 0 .401.823q.195.162.478.252.284.091.665.091.507 0 .859-.158.354-.158.539-.44.187-.284.187-.656 0-.336-.134-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.566-.21l-.621-.144a1 1 0 0 1-.404-.176.37.37 0 0 1-.144-.299q0-.234.185-.384.188-.152.512-.152.214 0 .37.068a.6.6 0 0 1 .246.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.2-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.439 0-.776.15-.337.149-.527.421-.19.273-.19.639 0 .302.122.524.124.223.352.367.228.143.539.213l.618.144q.31.073.463.193a.39.39 0 0 1 .152.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.167.07-.413.07-.175 0-.32-.04a.8.8 0 0 1-.248-.115.58.58 0 0 1-.255-.384zM.806 13.693q0-.373.102-.633a.87.87 0 0 1 .302-.399.8.8 0 0 1 .475-.137q.225 0 .398.097a.7.7 0 0 1 .272.26.85.85 0 0 1 .12.381h.765v-.072a1.33 1.33 0 0 0-.466-.964 1.4 1.4 0 0 0-.489-.272 1.8 1.8 0 0 0-.606-.097q-.534 0-.911.223-.375.222-.572.632-.195.41-.196.979v.498q0 .568.193.976.197.407.572.626.375.217.914.217.439 0 .785-.164t.55-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.764a.8.8 0 0 1-.118.363.7.7 0 0 1-.272.25.9.9 0 0 1-.401.087.85.85 0 0 1-.478-.132.83.83 0 0 1-.299-.392 1.7 1.7 0 0 1-.102-.627zm8.239 2.238h-.953l-1.338-3.999h.917l.896 3.138h.038l.888-3.138h.879z" />
                            </svg>
                            <CSVLink
                                enclosingCharacter={""}
                                filename={"Rekap Honor Mitra.csv"}
                                data={data}
                            >
                                CSV File
                            </CSVLink>
                        </a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item cursor-pointer flex items-center gap-1" onClick={() => downloadExcel(data)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-spreadsheet" viewBox="0 0 16 16">
                                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v4h10V2a1 1 0 0 0-1-1zm9 6h-3v2h3zm0 3h-3v2h3zm0 3h-3v2h2a1 1 0 0 0 1-1zm-4 2v-2H6v2zm-4 0v-2H3v1a1 1 0 0 0 1 1zm-2-3h2v-2H3zm0-3h2V7H3zm3-2v2h3V7zm3 3H6v2h3z" />
                            </svg>
                            Excel File</a>
                    </div>
                </div>
            </div>

            <div className="mt-2 flex flex-col">
                <div className="-my-2">
                    <div className="py-2 align-middle inline-block w-full">
                        <div className="overflow-x-auto shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table {...getTableProps()} className="min-w-full text-normal truncate divide-y divide-gray-200 table-sm">
                                <thead className="bg-[#FFB422] text-black">
                                    {headerGroups.map(headerGroup => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map(column => (
                                                <th
                                                    scope="col"
                                                    className="px-2 py-3 text-left text-sm lg:text-normal font-bold uppercase tracking-wider cursor-pointer select-none"
                                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                                >
                                                    <div className="flex items-center">
                                                        {column.render('Header')}
                                                        {/* Icon Sort */}
                                                        {column.isSorted ? (
                                                            column.isSortedDesc ? (
                                                                <ChevronDownIcon className="w-2 h-2 ml-1" />
                                                            ) : (
                                                                <ChevronUpIcon className="w-2 h-2 ml-1" />
                                                            )
                                                        ) : (
                                                            <ChevronDownIcon className="w-2 h-2 ml-1 opacity-50" />
                                                        )}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>


                                <tbody
                                    {...getTableBodyProps()}
                                    className="bg-white divide-y divide-gray-200"
                                >
                                    {isLoading ? (
                                        [...Array(10)].map((_, i) => (
                                            <tr key={i}>
                                                {Array.from({ length: columns?.length }).map((_, j) => (
                                                    <td key={j} className="px-6 py-4 whitespace-nowrap">
                                                        <Skeleton height={20} width="80%" />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : page?.length > 0 ? (
                                        page.map((row) => {
                                            prepareRow(row);
                                            return (
                                                <tr key={row.id} {...row.getRowProps()}>
                                                    {row.cells.map((cell) => {
                                                        const cellProps = cell.getCellProps();
                                                        const customProps = getCellProps(cell);
                                                        const finalClassName = `${cellProps.className || ""} ${customProps.className || ""
                                                            }`.trim();

                                                        return (
                                                            <td
                                                                key={cell.id}
                                                                {...cellProps}
                                                                {...customProps}
                                                                className={`px-3 py-2 truncate text-sm font-semibold lg:text-normal text-black ${finalClassName}`}
                                                            >
                                                                {cell.render("Cell")}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={columns?.length}
                                                className="text-center py-6 text-gray-500"
                                            >
                                                Tidak ada data
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            <div className="py-3 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                    <Button onClick={() => previousPage()} disabled={!canPreviousPage}>Sebelumnya</Button>
                    <Button onClick={() => nextPage()} disabled={!canNextPage}>Selanjutnya</Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-2">
                        <span>
                            Halaman{' '}
                            <strong>
                                {state.pageIndex + 1} dari {pageOptions?.length}
                            </strong>{' '}
                        </span>
                        <span>|</span>
                        <span>
                            Lihat
                            <select
                                value={state.pageSize}
                                onChange={e => {
                                    setPageSize(Number(e.target.value));
                                }}
                                className="ml-2 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                            >
                                {[10, 20, 30, 40, 50].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </option>
                                ))}
                            </select>
                            {' '}data
                        </span>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <PageButton
                                onClick={() => gotoPage(0)}
                                disabled={!canPreviousPage}
                            >
                                <span className="sr-only">Halaman Pertama</span>
                                <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
                            </PageButton>
                            <PageButton
                                onClick={() => previousPage()}
                                disabled={!canPreviousPage}
                            >
                                <span className="sr-only">Sebelumnya</span>
                                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                            </PageButton>
                            <PageButton
                                onClick={() => nextPage()}
                                disabled={!canNextPage}
                            >
                                <span className="sr-only">Selanjutnya</span>
                                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                            </PageButton>
                            <PageButton
                                onClick={() => gotoPage(pageCount - 1)}
                                disabled={!canNextPage}
                            >
                                <span className="sr-only">Halaman Terakhir</span>
                                <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
                            </PageButton>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
}