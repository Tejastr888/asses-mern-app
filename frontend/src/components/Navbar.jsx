import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
} from '@mui/material';
import { AccountCircle, Work } from '@mui/icons-material';
import { logout } from '../features/auth/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        handleClose();
        navigate('/');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Work sx={{ mr: 2 }} />
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        textDecoration: 'none',
                        color: 'inherit',
                    }}
                >
                    Job Portal
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/jobs"
                    >
                        Jobs
                    </Button>

                    {user ? (
                        <>
                            {user.role === 'employer' && (
                                <Button
                                    color="inherit"
                                    component={RouterLink}
                                    to="/post-job"
                                >
                                    Post Job
                                </Button>
                            )}
                            <IconButton
                                size="large"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <Avatar sx={{ width: 32, height: 32 }}>
                                    {user.firstName[0]}
                                </Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem
                                    component={RouterLink}
                                    to="/profile"
                                    onClick={handleClose}
                                >
                                    Profile
                                </MenuItem>
                                <MenuItem
                                    component={RouterLink}
                                    to="/applications"
                                    onClick={handleClose}
                                >
                                    Applications
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/login"
                            >
                                Login
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/register"
                                variant="outlined"
                                sx={{ borderColor: 'white' }}
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
