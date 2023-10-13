import React, {useState, ChangeEvent, useEffect} from "react";
import {Button, IconButton, TextField} from '@mui/material';
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {LoadingButton} from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import TagDataService from "../../../services/TagService";
import ITagData from "../../../types/Tag";
import Config from "../../../components/Config"

const TagModal = ({handleCloseModal, handleUpdateTags, isUpdate, tagId}: any) => {
    const initialTagState = {
        id: null,
        name: "",
    };
    const [tag, setTag] = useState<ITagData>(initialTagState);
    const [errors, setErrors] = useState<any>([]);
    const [loading, setLoading] = React.useState(false);

    const textButton = isUpdate ? "Update" : "Add";

    const handleInputChange = (event: ChangeEvent) => {
        const {name, value} = (event.currentTarget as HTMLInputElement);

        setTag({...tag, [name]: value});
    };

    const getTag = (id: string) => {
        TagDataService.get(id)
            .then((response: any) => {
                setTag(response.data.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    useEffect(() => {
        if (tagId)
            getTag(tagId);
    }, [tagId]);

    const tagOperations = () => {
        setLoading(true);

        {isUpdate ? updateTag() : saveTag()}
    }

    const updateTag = () => {
        TagDataService.update(tag.id, tag)
            .then((response: any) => {
                handleUpdateTags(response.data.data);
                handleCloseModal();
            })
            .catch((e) => {
                setErrors(e.response.data.errors);
            })
            .then(() => {
                setLoading(false);
            });
    };

    const saveTag = () => {
        var data = {
            name: tag.name
        };

        TagDataService.create(data)
            .then((response: any) => {
                handleUpdateTags(response.data.data);
                handleCloseModal();
            })
            .catch((e) => {
                setErrors(e.response.data.errors);
            })
            .then(() => {
                setLoading(false);
            });
    };

    return (
        <div>
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
                                label="Name"
                                value={tag.name}
                                variant="standard"
                                onChange={handleInputChange}
                                name="name"
                                required
                            />
                            {errors.name && (
                                <span className="text-red-600">
                                        {errors.name[0]}
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
                        onClick={tagOperations}
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
        </div>
    );
};

export default TagModal;
