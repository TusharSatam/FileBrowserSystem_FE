import React, { Children, useEffect, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Breadcrumbs from '@mui/material/Breadcrumbs';
interface File {
    type: 'file';
    size: string;
}

interface Folder {
    type: 'folder';
    name: string;
    children: Record<string, File | Folder>;
}

interface RowData {
    id: string;
    name: string;
    type: string;
    size: string;
}
type Node = File | Folder;
const FileBrowser: React.FC = () => {
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'type', headerName: 'Type', width: 150 },
        { field: 'size', headerName: 'Size', width: 150 },
    ];
    // Your JSON data
    const jsonData: Node = {
        type: 'folder',
        name: 'root',
        children: {
            app: {
                type: 'folder',
                name: 'app', // Adding name property for the top-level folder
                children: {
                    app_file1: {
                        type: 'file',
                        size: '106.56MB',
                    },
                    app_file2: {
                        type: 'file',
                        size: '106.56MB',
                    },
                    app_main: {
                        type: 'folder',
                        name: 'app_main', // Adding name property for nested folder
                        children: {
                            src: {
                                type: 'folder',
                                name: 'src', // Adding name property for nested folder
                                children: {
                                    src_file1: {
                                        type: 'file',
                                        size: '106.56MB',
                                    },
                                    src_file2: {
                                        type: 'file',
                                        size: '106.56MB',
                                    },
                                    src_main: {
                                        type: 'folder',
                                        name: 'src_main', // Adding name property for nested folder
                                        children: {
                                            src_main_public: {
                                                type: 'folder',
                                                name: 'public', // Adding name property for nested folder
                                                children: {},
                                            },
                                        },
                                    },
                                    components: {
                                        type: 'folder',
                                        name: 'components', // Adding name property for nested folder
                                        children: {
                                            components_file1: {
                                                type: 'file',
                                                size: '106.56MB',
                                            },
                                            components_file2: {
                                                type: 'file',
                                                size: '106.56MB',
                                            },
                                            components_file3: {
                                                type: 'file',
                                                size: '106.56MB',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },

        },
    };
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [emptyFolders, setemptyFolders] = useState<string[]>([])
    const [currentObj, setcurrentObj] = useState(null)
    const [rows, setRows] = useState<RowData[]>([])
    let counter = 0;
    useEffect(() => {
        if (!jsonData) return;

        let tempObjLocation = currentPath.reduce((a, c, i) => {
            console.log(c);

            return i == 0 && currentPath.length === 1 ? a + "." + c + ".children" : i === 0 ? a + "." + c : i !== (currentPath.length - 1) ? a + '.children.' + c : a + '.children.' + c + '.children';
        }, 'children');

        let current: any = jsonData;
        const keys = tempObjLocation.split('.');

        keys.forEach(key => {
            if (current[key]) {
                current = current[key];
            }
        });

        // if (!current || !current.children) return;
        const tempRows: RowData[] = Object.keys(current).map(key => {
            const child = current[key];
            counter++;
            if (child.children) {
                if ((Object.values(child.children)?.length === 0)) {
                    console.log("empty", `${key}${counter}`);

                    setemptyFolders((prev) => [...prev, `${key}${counter}`])
                }
            }
            if (child.type === "file") {

                return {
                    id: `${key}${counter}`,
                    name: key,
                    type: child.type,
                    size: child?.size || '',
                };
            }
            else {
                return {
                    id: `${key}${counter}`,
                    name: (Object.values(child.children)?.length === 0) ? child.name + " (Empty) " : child.name,
                    type: child.type,
                    size: '-',
                };
            }
        });

        setRows(tempRows);
        setcurrentObj(current)

    }, [currentPath])
    const handleBreadCrumb = (index: number) => {
        setCurrentPath((prev) => prev?.slice(0, index + 1))
    }
    return (
        <div style={{ display: "flex", flexDirection: "column", height: '100vh', width: '100%', gap: "2rem", padding: "1rem 2rem" }}>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
                <button onClick={() => setCurrentPath([])} style={{ backgroundColor: "transparent", border: "none", color: "blue", fontSize: "2rem" }}>root</button>
                {currentPath && currentPath?.map((item, i) => (
                    <button onClick={() => handleBreadCrumb(i)} style={{ backgroundColor: "transparent", border: "none", color: "blue", fontSize: "2rem" }}>{item}</button>
                ))}
            </Breadcrumbs>

            <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection={false}
                onRowClick={(row) => {

                    if (row.row.type === 'folder' && !emptyFolders.includes(row.row.id)) {
                        console.log(row);
                        setCurrentPath((prev) => [...prev, row.row.name])
                    }
                }}
            />
        </div>
    )
}

export default FileBrowser