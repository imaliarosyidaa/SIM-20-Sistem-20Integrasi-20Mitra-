import { useTable, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { Button, PageButton } from '../shared';
import React, { useState, useEffect } from 'react';
import { useAsyncDebounce } from 'react-table';
import Skeleton from 'react-loading-skeleton';

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
            initialState: { pageIndex: 0 },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={state.globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
            </div>

            <div className="mt-2 flex flex-col">
                <div className="-my-2 overflow-x-auto">
                    <div className="py-2 align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    {headerGroups.map(headerGroup => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map(column => (
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                                >
                                                    {column.render('Header')}
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
                                                                className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${finalClassName}`}
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