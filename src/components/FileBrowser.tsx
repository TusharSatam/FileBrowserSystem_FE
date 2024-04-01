import React, { useEffect, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import styles from "./FileBrowser.module.css"
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
        { field: 'name', headerName: 'Name', width: 250 },
        { field: 'type', headerName: 'Type', width: 100 },
        { field: 'size', headerName: 'Size', width: 100 },
    ];
    //  JSON data
    const jsonData: Node = {
        type: 'folder',
        name: 'root',
        children: {
            app: {
                type: 'folder',
                name: 'app',
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
                        name: 'app_main',
                        children: {
                            src: {
                                type: 'folder',
                                name: 'src',
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
                                        name: 'src_main',
                                        children: {
                                            src_main_public: {
                                                type: 'folder',
                                                name: 'public',
                                                children: {},
                                            },
                                        },
                                    },
                                    components: {
                                        type: 'folder',
                                        name: 'components',
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
    const [rows, setRows] = useState<RowData[]>([])
    useEffect(() => {
        if (!jsonData) return;

        let tempObjLocation = currentPath.reduce((a, c, i) => {
            return i == 0 && currentPath.length === 1 ? a + "." + c + ".children" : i === 0 ? a + "." + c : i !== (currentPath.length - 1) ? a + '.children.' + c : a + '.children.' + c + '.children';
        }, 'children');

        let current: any = jsonData;
        const keys = tempObjLocation.split('.');

        keys.forEach(key => {
            if (current[key]) {
                current = current[key];
            }
        });

        const tempRows: RowData[] = Object.keys(current).map((key, index) => {
            const child = current[key];
            let id = `${key}${index}`;
            if (child.children) {
                if ((Object.values(child.children)?.length === 0)) {
                    setemptyFolders((prev) => [...prev, `${key}${index}`])
                }
            }
            if (child.type === "file") {

                return {
                    id: id,
                    name: key,
                    type: child.type,
                    size: child?.size || '',
                };
            }
            else {
                return {
                    id: id,
                    name: (Object.values(child.children)?.length === 0) ? child.name + " (Empty) " : child.name,
                    type: child.type,
                    size: '-',
                };
            }
        });

        setRows(tempRows);

    }, [currentPath])
    const handleBreadCrumb = (index: number) => {
        setCurrentPath((prev) => prev?.slice(0, index + 1))
    }
    return (
        <div className={styles.fileBrowserWrap}>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
                <button onClick={() => setCurrentPath([])} className={styles.breadcrumbButton}>root</button>
                {currentPath && currentPath?.map((item, i) => (
                    <button onClick={() => handleBreadCrumb(i)} className={styles.breadcrumbButton}>{item}</button>
                ))}
            </Breadcrumbs>

            <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection={false}
                className={styles.dataGridContainer}
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