import {createTheme, styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const white = "#ffffff";

const theme = createTheme({
    palette: {
        common: {
            white: `${white}`
        }
    },
});

const Config = {
    BootstrapDialog,
    MenuProps,
    theme
};

export default Config;