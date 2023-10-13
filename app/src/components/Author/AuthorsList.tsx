import React, {useState, useEffect, ChangeEvent, Fragment} from "react";
import AuthorDataService from "../../services/AuthorService";
import IAuthorData from '../../types/Author';
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
import AuthorModal from "../Modals/AuthorModals/AuthorModal";

interface Column {
    id: 'id' | 'fname' | 'lname' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    {id: 'id', label: 'ID', minWidth: 70},
    {id: 'fname', label: 'First Name', minWidth: 100},
    {id: 'lname', label: 'Last Name', minWidth: 100},
    {id: 'actions', label: 'Actions', minWidth: 100},
];

const AuthorsList: React.FC = () => {
    const [authors, setAuthors] = useState<Array<IAuthorData>>([]);
    const [searchName, setSearchName] = useState<string>("");
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);
    const pageSizes = [10, 15, 25, 50, 100];
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [showClearIcon, setShowClearIcon] = useState("none");
    const [authorModal, setAuthorModal] = useState<boolean>(false);
    const [editAuthorId, setEditAuthorId] = useState<number | undefined>(undefined);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);

    const onChangeSearchName = (e: ChangeEvent<HTMLInputElement>) => {
        const searchName = e.currentTarget.value;

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

    const retrieveAuthors = () => {
        const params = getRequestParams(searchName, page+1, rowsPerPage);

        AuthorDataService.getAll(params)
            .then((response: any) => {
                setAuthors(response.data.data);
                setCount(response.data.meta.total);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    useEffect(retrieveAuthors, [page, rowsPerPage]);

    const handlePageChange = (event: any, value: React.SetStateAction<number>) => {
        setPage(value);
    };

    const findByName = () => {
        AuthorDataService.findByName(searchName)
            .then((response: any) => {
                setAuthors(response.data.data);
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

    const deleteAuthor = (event: any, id: number) => {
        event.stopPropagation()

        AuthorDataService.remove(id)
            .then((response: any) => {
                setAuthors(authors.filter((author) => {
                    return author.id !== id
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
        setAuthorModal(false);
        setEditAuthorId(undefined);
        setIsUpdate(false);
    };

    const handleUpdateAuthors = (currentAuthor: IAuthorData) => {
        if (isUpdate) {
            setAuthors(authors.map(author => {
                if (author.id === currentAuthor.id) {
                    return {...authors, ...currentAuthor};
                } else {
                    return author;
                }
            }));

            setIsUpdate(true);
        } else {
            setAuthors([currentAuthor, ...authors]);
        }

        setIsUpdate(false);
        handleCloseModal();
    }

    const handleEditAuthor = (event: any, id: number) => {
        event.stopPropagation();

        setEditAuthorId(id);
        setAuthorModal(true);
        setIsUpdate(true);
    }

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Grid container spacing={1} sx={{pb: 2}}>
                        <Grid item xs={7}>
                            <div className="title-block">
                                <h4>Authors List</h4>
                                <IconButton aria-label="add" onClick={() => setAuthorModal(true)}>
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
                                    {authors
                                        .map((author, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={author.id}>
                                                    <Fragment key={author.id}>
                                                        <TableCell align="left">
                                                            {author.id}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {author.fname}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {author.lname}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Link to={""} onClick={(e) => {handleEditAuthor(e, author.id)}}>
                                                                <IconButton aria-label="edit">
                                                                    <EditIcon/>
                                                                </IconButton>
                                                            </Link>

                                                            <Link to={""} onClick={(e) => {
                                                                deleteAuthor(e, author.id)
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

            {authorModal && (
                <AuthorModal handleCloseModal={handleCloseModal} handleUpdateAuthors={handleUpdateAuthors} isUpdate={isUpdate} authorId={editAuthorId} />
            )}
        </>
    );
};

export default AuthorsList;
