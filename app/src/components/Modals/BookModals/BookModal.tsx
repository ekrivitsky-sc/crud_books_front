import React, {useState, ChangeEvent, useEffect} from "react";
import {
    Box,
    Button, Checkbox,
    Chip,
    FormControl,
    IconButton,
    InputLabel, ListItemText,
    MenuItem,
    OutlinedInput,
    TextField
} from '@mui/material';
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {LoadingButton} from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import Select from "@mui/material/Select";
import IBookData from "../../../types/Book";
import AuthorService from "../../../services/AuthorService";
import IAuthorData from "../../../types/Author";
import TagService from "../../../services/TagService";
import ImageUploadService from "../../../services/ImageUploadService";
import BookDataService from "../../../services/BookService";
import ITagData from "../../../types/Tag";
import Config from "../../Config"

const BookModal = ({handleCloseAddBook, handleUpdateBooks, isUpdate, editBookId}: any) => {
    const initialBookState = {
        id: null,
        name: "",
        year: "",
        img_path: "",
        tags: [],
        authors: [],
    };
    const [book, setBook] = useState<any>(initialBookState);
    const [errors, setErrors] = useState<any>([]);
    const [authors, setAuthors] = useState<Array<any>>([]);
    const [tags, setTags] = useState<Array<any>>([]);
    const [image, setImage] = useState<any>(undefined);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [loadImage, setLoadImage] = useState<boolean>(false);
    const [loading, setLoading] = React.useState(false);

    const textButton = isUpdate ? "Update" : "Add";


    const handleInputChange = (event: ChangeEvent) => {
        const {name, value} = (event.currentTarget as HTMLInputElement);
        setBook({ ...book, [name]: value });
    };

    const handleImageChange = (event: any) => {
        let image = event.target.files[0];
        if (image) {
            setImage(image);
            setPreviewImage(URL.createObjectURL(image));
            setBook({...book, [event.target.name]: ""});
        } else {
            setImage(undefined);
            setPreviewImage("");
        }
    };

    const handleSelectChange = (event: any) => {
        setBook({ ...book, [event.target.name]: [].slice.call(event.target.value).map(item => item) });
    };

    const retrieve = () => {
        AuthorService.getAll()
            .then((response: any) => {
                let authorsArray: { id: number; name: string; }[] = [];
                response.data.data.map((author: IAuthorData) => {
                    authorsArray.push({
                        'id': author.id,
                        'name': author.fname +' '+author.lname,
                    })
                })
                setAuthors(authorsArray);
            })
            .catch((e: Error) => {
                console.log(e);
            });

        TagService.getAll()
            .then((response: any) => {
                setTags(response.data.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    useEffect(retrieve, []);

    useEffect(() => {
        if (editBookId)
            getBook(editBookId);
    }, [editBookId]);

    useEffect(() => {
        if (loadImage) {
            {isUpdate ? updateBook() : saveBook()}
        }
    }, [loadImage]);

    const bookOperations = () => {
        setLoading(true);
        saveImage();
    }

    const saveImage = () => {
        setLoading(true);
        if (image) {
            ImageUploadService.upload(image, "/books/image")
                .then((response) => {
                    if (response.status === 201) {
                        setBook({...book, img_path: response.data.data.url});
                        setLoadImage(true);
                    }
                })
                .catch((e) => {
                    setErrors(e.response.data.errors);
                    console.log(e.response.data.errors);
                })
                .then(() => {
                    setLoading(false);
                });
        } else {
            setLoadImage(true);
            setBook((current: any) => {
                const {img_path, ...book} = current;

                return book;
            });
        }
    }

    const saveBook = () => {
        var data = {
            name: book.name,
            year: book.year,
            img_path: book.img_path,
            tags: book.tags,
            authors: book.authors,
        };

        BookDataService.create(data)
            .then((response: any) => {
                handleUpdateBooks(response.data.data);
                handleCloseAddBook();
            })
            .catch((e) => {
                setErrors(e.response.data.errors);
                console.log(e.response.data.errors);
            })
            .then(() => {
                setLoading(false);
            });
    };

    const updateBook = () => {
        if (loadImage) {
            BookDataService.update(book.id, book)
                .then((response: any) => {
                    handleUpdateBooks(response.data.data);
                    handleCloseAddBook();
                })
                .catch((e) => {
                    console.log(e);
                    setErrors(e.response.data.errors);
                })
                .then(() => {
                    setLoading(false);
                });
        }
    };

    const getBook = (id: string) => {
        BookDataService.get(id)
            .then((response: any) => {
                let authorsIds: any = [];
                let tagsIds: any = [];

                {response.data?.data?.authors && response.data.data.authors.map((author: IAuthorData) => {
                    authorsIds.push(author.id);
                })}
                {response.data?.data?.tags && response.data.data.tags.map((tag: ITagData) => {
                    tagsIds.push(tag.id);
                })}

                response.data.data.authors = authorsIds;
                response.data.data.tags = tagsIds;

                setBook(response.data.data);

                if (response.data?.data?.img_path) {
                    setPreviewImage(response.data.data.img_path)
                }
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    return (
        <div>
            <Config.BootstrapDialog
                onClose={handleCloseAddBook}
                aria-labelledby="customized-dialog-title"
                open={true}
            >
                <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
                    {textButton} book
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseAddBook}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
                <DialogContent dividers>
                        <div className="form-group">
                            <TextField
                                type="text"
                                label="Title"
                                variant="standard"
                                value={book.name}
                                name="name"
                                onChange={handleInputChange}
                                required
                            />
                            {errors.name && (
                                <span className="text-red-600">
                                {errors.name[0]}
                            </span>
                            )}
                        </div>

                        <div className="form-group">
                            <TextField
                                type="text"
                                label="Year"
                                variant="standard"
                                value={book.year}
                                onChange={handleInputChange}
                                name="year"
                                required
                            />

                            {errors.year && (
                                <span className="text-red-600">
                                {errors.year[0]}
                            </span>
                            )}
                        </div>
                        <div className="form-group">
                            <TextField
                                type="file"
                                label="Image"
                                variant="standard"
                                name="image"
                                onChange={handleImageChange}
                            />
                            {previewImage && (
                                <div>
                                    <img className="preview" src={previewImage} alt="" />
                                </div>
                            )}
                            {errors.image && (
                                <span className="text-red-600">
                                {errors.image[0]}
                            </span>
                            )}
                        </div>
                        <div className="form-group">
                            <FormControl >
                                <InputLabel id="demo-multiple-chip-label">Authors</InputLabel>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    name="authors"
                                    value={book.authors}
                                    onChange={handleSelectChange}
                                    input={<OutlinedInput id="select-multiple-chip" label="Authors" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {authors && selected.map((authorId: any) => (
                                                <Chip key={authorId} label={authors?.find(e => e.id === authorId)?.name} />
                                            ))}
                                        </Box>
                                    )}
                                    MenuProps={Config.MenuProps}
                                >
                                    {authors?.map((author) => (
                                        <MenuItem key={author.id} value={author.id}>
                                            <Checkbox checked={book.authors?.includes(author.id)} />
                                            <ListItemText primary={author.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {errors.authors && (
                                <span className="text-red-600">
                                {errors.authors[0]}
                            </span>
                            )}
                        </div>
                        <div className="form-group">
                            <FormControl>
                                <InputLabel id="multiple-tags-label">Tags</InputLabel>
                                <Select
                                    labelId="multiple-tags-label"
                                    id="multiple-tags"
                                    multiple
                                    name="tags"
                                    value={book.tags}
                                    onChange={handleSelectChange}
                                    input={<OutlinedInput id="select-multiple-tag" label="Tags" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((tagId: any) => (
                                                <Chip key={tagId} label={tags?.find(e => e.id === tagId)?.name} />
                                            ))}
                                        </Box>
                                    )}
                                    MenuProps={Config.MenuProps}
                                >
                                    {tags?.map((tag) => (
                                        <MenuItem key={tag.id} value={tag.id}>
                                            <Checkbox checked={book.tags?.includes(tag.id)} />
                                            <ListItemText primary={tag.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {errors.tags && (
                                <span className="text-red-600">
                                {errors.tags[0]}
                            </span>
                            )}
                        </div>
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        autoFocus
                        variant={"contained"}
                        color="primary"
                        onClick={bookOperations}
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<SaveIcon/>}
                    >
                        {textButton}
                    </LoadingButton>
                    <Button autoFocus variant={"outlined"} color="primary" onClick={handleCloseAddBook}>
                        Close
                    </Button>
                </DialogActions>
            </Config.BootstrapDialog>
        </div>
    );
};

export default BookModal;
