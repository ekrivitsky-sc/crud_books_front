import React, {useState, useEffect, ChangeEvent, Fragment} from "react";
import Grid from "@mui/material/Grid";
import {
    FormControl,
    IconButton,
    InputAdornment,
    Paper,
    Table, TableBody,
    TableContainer,
    TableHead, TablePagination, TableRow,
    TextField
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import TableCell from "@mui/material/TableCell";
import {Link} from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ITagData from "../../types/Tag";
import TagDataService from "../../services/TagService";
import TagModal from "../Modals/TagModals/TagModal";

interface Column {
    id: 'id' | 'name' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    {id: 'id', label: 'ID', minWidth: 70},
    {id: 'name', label: 'Name', minWidth: 100},
    {id: 'actions', label: 'Actions', minWidth: 100},
];

const TagsList: React.FC = () => {
    const [tags, setTags] = useState<Array<ITagData>>([]);
    const [searchName, setSearchName] = useState<string>("");
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);
    const pageSizes = [10, 15, 25, 50, 100];
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [showClearIcon, setShowClearIcon] = useState("none");
    const [tagModal, setTagModal] = useState<boolean>(false);
    const [editTagId, setEditTagId] = useState<number | undefined>(undefined);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);

    const onChangeSearchName = (e: ChangeEvent<HTMLInputElement>) => {
        const searchName = e.target.value;
        setSearchName(searchName);
        setShowClearIcon(searchName === "" ? "none" : "flex");
    };

    const getRequestParams = (searchName: string, page: number, pageSize: number) => {
        let params: any = {};

        if (searchName) {
            params.name = searchName;
        }

        if (page) {
            params.page = page;
        }

        if (pageSize) {
            params.per_page = pageSize;
        }

        return params;
    };

    const retrieve = () => {
        const params = getRequestParams(searchName, page+1, rowsPerPage);

        TagDataService.getAll(params)
            .then((response: any) => {
                setTags(response.data.data);
                setCount(response.data.meta.total);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    useEffect(retrieve, [page, rowsPerPage]);

    const handlePageChange = (event: any, value: React.SetStateAction<number>) => {
        setPage(value);
    };

    const findByName = () => {
        TagDataService.findByName(searchName)
            .then((response: any) => {
                setTags(response.data.data);
                setCount(response.data.meta.total);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    const handleClearSearch = () => {
        setSearchName("");
        setShowClearIcon("none");

        findByName();
    }

    const deleteTag = (event: any, id: number) => {
        event.stopPropagation()

        TagDataService.remove(id)
            .then((response: any) => {
                setTags(tags.filter((tag) => {
                    return tag.id !== id
                }));
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseModal = () => {
        setTagModal(false);
        setEditTagId(undefined);
        setIsUpdate(false);
    };

    const handleUpdateTags = (currentTag: ITagData) => {
        if (isUpdate) {
            setTags(tags.map(tag => {
                if (tag.id === currentTag.id) {
                    return {...tags, ...currentTag};
                } else {
                    return tag;
                }
            }));
            setEditTagId(undefined);
        } else {
            setTags([currentTag, ...tags]);
        }

        setIsUpdate(false);
        handleCloseModal();
    }

    const handleEditTag = (id: number) => {
        setEditTagId(id);
        setTagModal(true);
        setIsUpdate(true);
    }

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Grid container spacing={1} sx={{pb: 2}}>
                        <Grid item xs={7}>
                            <div className="title-block">
                                <h4>Tags List</h4>
                                <IconButton aria-label="add" onClick={() => setTagModal(true)}>
                                    <AddIcon/>
                                </IconButton>
                            </div>
                        </Grid>
                        <Grid item xs={5}>
                            <FormControl style={{width: "100%"}}>
                                <TextField
                                    onKeyDown={(ev) => {
                                        if (ev.key === 'Enter') {
                                            findByName();
                                            ev.preventDefault();
                                        }
                                    }}
                                    size="small"
                                    variant="outlined"
                                    label="Search by name"
                                    fullWidth
                                    value={searchName}
                                    onChange={onChangeSearchName}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" onClick={findByName}>
                                                <SearchIcon/>
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                style={{display: showClearIcon}}
                                                onClick={handleClearSearch}
                                            >
                                                <ClearIcon/>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Paper sx={{width: '100%', overflow: 'hidden'}}>
                        <TableContainer>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{minWidth: column.minWidth}}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tags
                                        .map((tag, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={tag.id}>
                                                    <Fragment key={tag.id}>
                                                        <TableCell align="left">
                                                            {tag.id}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {tag.name}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Link to={""} onClick={() => {handleEditTag(tag.id)}}>
                                                                <IconButton aria-label="edit">
                                                                    <EditIcon/>
                                                                </IconButton>
                                                            </Link>

                                                            <Link to={""} onClick={(e) => {
                                                                deleteTag(e, tag.id)
                                                            }}>
                                                                <IconButton aria-label="delete">
                                                                    <DeleteIcon/>
                                                                </IconButton>
                                                            </Link>
                                                        </TableCell>
                                                    </Fragment>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={pageSizes}
                            component="div"
                            count={count}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Grid>
            </Grid>

            {tagModal && (
                <TagModal handleCloseModal={handleCloseModal} handleUpdateTags={handleUpdateTags} isUpdate={isUpdate} tagId={editTagId} />
            )}
        </>
    );
};

export default TagsList;
