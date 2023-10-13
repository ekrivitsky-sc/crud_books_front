import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import Config from "./Config";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";

const styles = {
    root: {
        width: "100%",
        marginBottom: "10px",
    },
    title: {
        mr: 2,
        display: { xs: 'none', md: 'flex' },
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
        color: 'inherit',
        textDecoration: 'none',
    },
    tabContainer: {
        marginLeft: "auto",
    },
    desktopContainer: {
        display: "none",
        [Config.theme.breakpoints.up("md")]: {
            display: "flex",
        },
    },
    mobileContainer: {
        display: "flex",
        [Config.theme.breakpoints.up("md")]: {
            display: "none",
        },
    },
};

const pages = [
    { name: "Books", url: "/books" },
    { name: "Authors", url: "/authors" },
    { name: "Tags", url: "/tags" },
];

const Navbar = () => {
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

    const [activeItem, setActiveItem] = useState("Books");

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuOpen = (event: any) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const renderMobileMenu = () => {
        return (
            <Menu
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={isMobileMenuOpen}
                onClose={handleMobileMenuClose}
            >
                {pages.map((page, index) => (
                    <MenuItem key={"mobile-item-"+page.name}>
                        <Link
                            key={"mobile-link-"+page.name}
                            to={page.url}
                            style={{
                                padding: "6px 4px",
                                color: "white",
                                textDecoration: "none",
                            }}
                        >
                            <p>{page.name}</p>
                        </Link>
                    </MenuItem>
                ))}
            </Menu>
        );
    };

    return (
        <Box sx={styles.root}>
            <AppBar position="static">
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography
                        component="a"
                        href={"/books"}
                        sx={styles.title}
                        variant="h6"
                        color="inherit"
                        noWrap>
                        Crud books
                    </Typography>

                    <Box sx={styles.desktopContainer} className="menu">
                        {pages.map((page, index) => (
                            <Link
                                key={page.name}
                                to={page.url}
                                className={page.name === activeItem ? "active" : "" }
                                onClick={() => {setActiveItem(page.name)}}
                            >
                                {page.name}
                            </Link>
                        ))}
                    </Box>
                    <Box sx={styles.mobileContainer}>
                        <IconButton
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu()}
        </Box>
    );
};

export default Navbar;