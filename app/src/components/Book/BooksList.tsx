import React, {useState, useEffect, ChangeEvent, Fragment} from "react";
import BookDataService from "../../services/BookService";
import IBookData from '../../types/Book';
import { Link } from "react-router-dom";
import {
    Button,
    FormControl,
    IconButton, InputAdornment,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow, TextField
} from '@mui/material'

import Grid from '@mui/material/Grid';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Filter from "../Filter";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import BookModal from "../Modals/BookModals/BookModal";
import ShowBookModal from "../Modals/BookModals/ShowBookModal";

interface Column {
    id: 'id' | 'name' | 'year' | 'authors' | 'tags' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: 'id', label: 'ID', minWidth: 70 },
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'year', label: 'Year', minWidth: 100 },
    { id: 'authors', label: 'Authors', minWidth: 170 },
    { id: 'tags', label: 'Tags', minWidth: 170 },
    { id: 'actions', label: 'Actions', minWidth: 30 },
];

const BooksList: React.FC = () => {

    const [books, setBooks] = useState<Array<any>>([]);
    const [currentBook, setCurrentBook] = useState<IBookData | null>(null);
    const [searchName, setSearchName] = useState<string>("");
    const [showFilter, setFilter] = useState(false);
    const [count, setCount] = useState(0);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [showClearIcon, setShowClearIcon] = useState("none");
    const [bookModal, setBookModal] = useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [editBookId, setEditBookId] = useState<number | undefined>(undefined);

    const classNameContent = showFilter ? 9 : 12;

    const handleCloseShowModel = () => {
        setCurrentBook(null);
    };

    const handleCloseModal = () => {
        setBookModal(false);
        setEditBookId(undefined);
        setIsUpdate(false);
    };

    const pageSizes = [10, 15, 25, 50, 100];

    const onChangeSearchName = (e: ChangeEvent<HTMLInputElement>) => {
        const searchName = e.target.value;
        setSearchName(searchName);
        setShowClearIcon(searchName === "" ? "none" : "flex");
    };

    const getRequestParams = () => {
        let params: any = {};

        if (searchName) {
            params.name = searchName;
        }

        if (page) {
            params.page = page+1;
        }

        if (rowsPerPage) {
            params.per_page = rowsPerPage;
        }

        return params;
    };

    const retrieveBooks = () => {
        const params = getRequestParams();

        BookDataService.getAll(params)
            .then((response: any) => {
                setBooks(response.data.data);
                setCount(response.data.meta.total);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    useEffect(retrieveBooks, [page, rowsPerPage]);

    const handlePageChange = (event: any, value: React.SetStateAction<number>) => {
        setPage(value);
        setCurrentBook(null);
    };

    const setActiveBook = (book: IBookData) => {
        setCurrentBook(book);
    };

    const findByName = () => {
        BookDataService.findByName(searchName)
            .then((response: any) => {
                setBooks(response.data.data);
                setCurrentBook(null);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    const deleteBook = (event: any, id: number) => {
        event.stopPropagation()

        BookDataService.remove(id)
            .then((response: any) => {
                setBooks(books.filter((book) => {
                    return book.id !== id
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

    const handleClearSearch = () => {
        setSearchName("");
        setShowClearIcon("none");
        retrieveBooks();
    }

    const handleUpdateBooks = (currentBook: IBookData) => {
        if (isUpdate) {
            setBooks(books.map(book => {
                if (book.id === currentBook.id) {
                    return {...books, ...currentBook};
                } else {
                    return book;
                }
            }));
        } else {
            setBooks([currentBook, ...books]);
        }

        setIsUpdate(false);
        handleCloseModal();
    }

    const handleEditBook = (event: any, id: number) => {
        event.stopPropagation();
        setEditBookId(id);
        setBookModal(true);
        setIsUpdate(true);
    }

    return (
        <>
            <Grid container spacing={1}>
                {showFilter && (
                    <Grid item xs={3}>
                            <Filter setBooks={setBooks} setCount={setCount} />
                    </Grid>
                )}
                <Grid item xs={classNameContent}>
                    <Grid container spacing={1} sx={{pb: 2}}>
                        <Grid item xs={7}>
                            <div className="title-block">
                                <h4>Books List</h4>
                                <IconButton aria-label="add" onClick={() => setBookModal(true)}>
                                    <AddIcon />
                                </IconButton>
                                <Button variant="contained" onClick={() => setFilter(!showFilter)} endIcon={<FilterAltIcon />}>
                                    Filter
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={5}>
                            <FormControl style = {{width: "100%"}}>
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
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                style={{ display: showClearIcon }}
                                                onClick={handleClearSearch}
                                            >
                                                <ClearIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Paper sx={{width: '100%', overflow: 'hidden' }}>
                        <TableContainer>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow key={"table-row-column"}>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {books
                                        .map((book) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={book.id} onClick={() => setActiveBook(book)}>
                                                    <Fragment key={book.id}>
                                                        <TableCell align="left">
                                                            {book.id}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {book.name}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {book.year}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {book.authors && book.authors.map((author: any) => (
                                                                <Fragment key={author.id}>
                                                                <p>{`${author.fname} ${author.lname}`}</p>
                                                                </Fragment>
                                                            ))}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {book.tags && book.tags.map((tag: any) => (
                                                                <Fragment key={tag.id}>
                                                                <p>{tag.name}</p>
                                                                </Fragment>
                                                            ))}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Link to={""} onClick={(e) => {handleEditBook(e, book.id)}}>
                                                                <IconButton aria-label="edit">
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </Link>

                                                            <Link to={""} onClick={(e) => {deleteBook(e, book.id)}}>
                                                                <IconButton aria-label="delete">
                                                                    <DeleteIcon />
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

        <div className="list row">
            <div>
                {currentBook && (
                    <ShowBookModal handleCloseShowModel={handleCloseShowModel} currentBook={currentBook} />
                )}

                {bookModal && (
                    <BookModal handleCloseAddBook={handleCloseModal} handleUpdateBooks={handleUpdateBooks} isUpdate={isUpdate} editBookId={editBookId} />
                )}
            </div>
        </div>
        </>
    );
};

export default BooksList;
