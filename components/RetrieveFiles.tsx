"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useSession } from "next-auth/react"
import { ArrowUpDown, RefreshCcw, Trash2 } from "lucide-react"
import { Icons } from "@/components/icons"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/shadui/table"
import PlusComponent from "@/components/dashboard/PlusComponent"
import { supabase } from "@/lib/initSupabase"
import { truncateLongUrl, truncateLongFileName } from "@/lib/utils"


export type UserFile = {
    doc_name: string
    origin: string
}


export function RetrieveFile() {
    const { data: session } = useSession();
    const user = session?.user;
    const userId = user?.id;

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [data, setData] = useState([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [loading, setLoading] = useState(false);
    const handleCheckboxChange = (checked: boolean, doc_name: string) => {
        if (checked) {
            setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, doc_name]);
        } else {
            setSelectedFiles((prevSelectedFiles) =>
                prevSelectedFiles.filter((file) => file !== doc_name)
            );
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);  // Set loading state to true
            const response = await fetch('/api/supabaseListFiles');
            const data = await response.json();
            setLoading(false);  // Set loading state to false

            if (response.status !== 200) {
                console.error(data.error);
            } else {
                setData(data);
            }
        };

        // Initial data fetch
        fetchData();

        const userChannel = `user_channel_${userId}`;

        const subscription = supabase
            .channel('schema-db-changes')
            .on('postgres_changes',
                {
                    event: "*",
                    schema: "public",
                    table: "documents"
                }, async (payload) => {
                    // Add type assertion here
                    const newRecord = payload.new as { [key: string]: any };
                    if (newRecord.user_id === userId) {
                        // Fetch refreshed data every time there's a database change
                        await fetchData();
                    }
                })
            .subscribe()

        // Cleanup function
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const columns: ColumnDef<UserFile>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    key={row.original.doc_name} // add this line
                    checked={row.getIsSelected()}
                    onCheckedChange={(checked) => {
                        const checkedBoolean = !!checked;
                        row.toggleSelected(checkedBoolean);
                        handleCheckboxChange(checkedBoolean, row.original.doc_name);
                    }}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "doc_name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Document Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const fullFileName = row.getValue("doc_name") as string;  // Assure TypeScript that getValue will return a sting.
                const truncatedFileName = truncateLongFileName(fullFileName, 60);  // use your preferred max length here
                return <div>{truncatedFileName}</div>;
            },
        },
        {
            accessorKey: "origin",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Origin
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div>{row.getValue("origin")}</div>,
        },
        {
            accessorKey: "URL",
            header: "URL",
            cell: ({ row }) => {
                const fullURL = row.getValue("URL") as string;  // Assure TypeScript that getValue will return a string.
                const truncatedURL = truncateLongUrl(fullURL, 30);  // use your preferred max length here
                return (
                    <div>
                        <a href={fullURL} target="_blank" rel="noopener noreferrer">
                            {truncatedURL}
                        </a>
                    </div>
                );
            },
        }
    ];


    const handleDelete = async () => {
        try {
            const response = await fetch("/api/supabaseDeleteFiles", {
                method: "DELETE",
                body: JSON.stringify({ doc_names: selectedFiles }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                console.log("Files deleted successfully");

                setData((prevData) =>
                    prevData.filter((file) => !selectedFiles.includes(file.doc_name))
                );

                setSelectedFiles([]);
                setRowSelection({});
            } else {
                console.error("Error deleting files");
            }
        } catch (error) {
            console.error("Error deleting files", error);
        }
    };

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4 px-4">
                <Input
                    placeholder="Filter by document names"
                    value={(table.getColumn("doc_name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("doc_name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div className="pl-4">
                    <PlusComponent userId={userId} />
                </div>


                {selectedFiles.length > 0 &&
                    <Button
                        variant="destructive"
                        className="ml-auto p-2"
                        onClick={handleDelete}
                    >
                        Delete {selectedFiles.length} file(s) <Trash2 className="ml-2 h-4 w-4" />
                    </Button>
                }

            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}