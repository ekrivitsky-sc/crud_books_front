import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import {Button, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const ShowBookModal = ({handleCloseShowModel, currentBook}: any) => {
    return (
        <>
            <BootstrapDialog
                onClose={handleCloseShowModel}
                aria-labelledby="customized-dialog-title"
                open={true}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    {currentBook.name}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseShowModel}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <div className="book_image">
                        <img src={currentBook.img_path} alt={"tst"} />
                    </div>
                    <div>
                        <label>
                            <strong>Год:</strong>
                        </label>{" "}
                        {currentBook.year}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleCloseShowModel}>
                        Close
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    )
}

export default ShowBookModal;