import React, {useState, ChangeEvent, useEffect} from "react";
import {Button, IconButton, TextField} from '@mui/material';
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {LoadingButton} from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import AuthorDataService from "../../../services/AuthorService";
import IAuthorData from "../../../types/Author";
import Config from "../../Config"

const AuthorModal = ({handleCloseModal, handleUpdateAuthors, isUpdate, authorId}: any) => {
    const initialAuthorState = {
        id: null,
        fname: "",
        lname: "",
    };
    const [author, setAuthor] = useState<IAuthorData>(initialAuthorState);
    const [errors, setErrors] = useState<any>([]);
    const [loading, setLoading] = React.useState(false);

    const textButton = isUpdate ? "Update" : "Add";

    const handleInputChange = (event: ChangeEvent) => {
        const {name, value} = (event.currentTarget as HTMLInputElement);

        setAuthor({...author, [name]: value});
    };

    const getAuthor = (id: string) => {
        AuthorDataService.get(id)
            .then((response: any) => {
                setAuthor(response.data.data);

                console.log(response.data.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    useEffect(() => {
        if (authorId)
            getAuthor(authorId);
    }, [authorId]);

    const authorOperations = () => {
        setLoading(true);

        {isUpdate ? updateAuthor() : saveAuthor()}
    }

    const updateAuthor = () => {
        AuthorDataService.update(author.id, author)
            .then((response: any) => {
                handleUpdateAuthors(response.data.data);
                handleCloseModal();
            })
            .catch((e) => {
                setErrors(e.response.data.errors);
            })
            .then(() => {
                setLoading(false);
            });
    };

    const saveAuthor = () => {

        var data = {
            lname: author.lname,
            fname: author.fname
        };

        AuthorDataService.create(data)
            .then((response: any) => {
                setAuthor(response.data.data);
                handleUpdateAuthors(response.data.data);
            })
            .catch((e) => {
                setErrors(e.response.data.errors);
            })
            .then(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <Config.BootstrapDialog
                onClose={handleCloseModal}
                aria-labelledby="customized-dialog-title"
                open={true}
            >
                <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
                    {textButton} Tag
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseModal}
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
                    <div className="list row">
                        <div className="form-group">
                            <TextField
                                type="text"
                                label="First name"
                                value={author.fname}
                                variant="standard"
                                onChange={handleInputChange}
                                name="fname"
                                required
                            />
                            {errors.fname && (
                                <span className="text-red-600">
                                    {errors.fname[0]}
                                </span>
                            )}
                        </div>
                        <div className="form-group">
                            <TextField
                                type="text"
                                label="Last name"
                                value={author.lname}
                                variant="standard"
                                onChange={handleInputChange}
                                name="lname"
                                required
                            />
                            {errors.lname && (
                                <span className="text-red-600">
                                    {errors.lname[0]}
                                </span>
                            )}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        autoFocus
                        variant={"contained"}
                        color="primary"
                        onClick={authorOperations}
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<SaveIcon/>}
                    >
                        {textButton}
                    </LoadingButton>
                    <Button autoFocus variant={"outlined"} color="primary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </DialogActions>
            </Config.BootstrapDialog>
        </>
    );
};

export default AuthorModal;
