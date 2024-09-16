'use client'
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import {Badge, Box, InputBase, Paper, TextField} from '@mui/material';
import Grid from '@mui/material/Grid'
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';
import MessageIcon from '@mui/icons-material/Message';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { fetchUser } from '@/services/fetchUser';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
axios.defaults.withCredentials = true;
import { useSearchParams } from 'next/navigation';


function NavBar() {
    const [categories, setCategories] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const { register, handleSubmit } = useForm();
    const router = useRouter();
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [user, setUser] = React.useState(null);
    const [userError, setUserError] = React.useState('');
    const [notifications, setNotifications] = React.useState(false);

    const searchParams = useSearchParams();
    const queryLogin = searchParams.get('login');

    const toggleDrawer = (open) => () => {
        if(!user && queryLogin) {
            fetchUser(setUser, setUserError)
        }
        setDrawerOpen(open);

    };
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const checkNotifications = async (userId) => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/messages/notifications/${userId}`);
          setNotifications(response.data);
        } catch (error) {
          console.log("Error checking notifications", error);
        }
      };
 
    
    React.useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
                setCategories(response.data);
            } catch (error) {
                console.log(error);
                setError('Failed to fetch categories');
            }
        };
        
        fetchUser(setUser,setUserError)
        getCategories();
    }, []);

    React.useEffect(() => {
        if (user) {
          checkNotifications(user._id); // Call API when the user is fetched
        }
      }, [user]);


    const menuItems = React.useMemo(() => {
        const items = [
            { text: 'Home', icon: <HomeIcon />, onClick: () => { router.push("/") } },
            { text: 'Profile', icon: <PersonIcon />, onClick: () => { router.push("/profile") } },
            { text: 'Account', icon: <AccountCircleIcon />, onClick: () => { router.push("/account") } },
            { text: 'Messages', 
                icon:  <Badge
                            color="error"  // Red color
                            variant="dot"  // Use a dot to indicate notifications
                            invisible={!notifications}  // Hide if notifications state is false
                            >
                            <MessageIcon/>
                        </Badge>,
                onClick: () => { router.push("/messages") } },
            
            
        ];

        if (user && user.username === "admin") {
            items.push({ text: 'Admin Panel', icon: <AdminPanelSettingsIcon/>, onClick: () => { router.push("/admin") } });
        }
        if (user) {
            items.push({ text: 'Sign Out', icon: <LogoutIcon />, onClick: () => { logout(); } });
        }else{
            items.push({ text: 'Sign In', icon: <LoginIcon/>, onClick: () => { router.push("/login") } },);
        }
        

        return items;
    }, [user]);

    const logout = async() => {
        try{
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`)
            setUser(null)
            router.push("/")
        }
        catch (error) {
            //console.log(error);
            
        }
    }

  
   

    const onSubmit = async (data) => {
        router.push(`/?keyword=${data.keyword}`)
      };

    return (
        <>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: 'flex',
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Auctions
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />

                        <Button
                            sx={{ my: 2, color: 'white', display: 'block', backgroundColor:(theme) => theme.palette.secondary.main }}
                            onClick={handleClickOpen}
                        >
                            Categories
                        </Button>

                        <Dialog
                            fullWidth
                            maxWidth='xl'
                            open={open}
                            onClose={handleClose}
                            
                        >
                            <DialogTitle>Categories</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Here are all available categories.
                                </DialogContentText>
                                <Box
                                  sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      overflowY: 'auto',
                                      maxHeight: '600px',
                                  }}
                              >
                                  <Grid
                                      container
                                      spacing={2}
                                      sx={{
                                          display: 'flex',
                                          flexWrap: 'wrap',
                                          justifyContent: 'start',
                                          width: '100%',
                                      }}
                                  >
                                      {categories.map((category) => (
                                          <Grid
                                              item
                                              xs={12}
                                              sm={6}
                                              md={4}
                                              lg={3}
                                              key={category._id}
                                          >
                                              
                                              <Box
                                                
                                                onClick={()=>{router.push(`/?category=${category._id}`); handleClose()}}
                                                
                                                sx={{border:"1px solid gray", padding:4, cursor:'pointer', color:(theme) => theme.palette.secondary.main }}
                                                
                                              >
                                              {category.name}
                                              </Box>
                                          </Grid>
                                      ))}
                                  </Grid>
                              </Box>

                                
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Close</Button>
                            </DialogActions>
                        </Dialog>

                      

                    <Box>
                        {/* Hamburger Menu Icon */}
                        <IconButton onClick={toggleDrawer(true)}>
                        <Badge
                            color="error"  // Red color
                            variant="dot"  // Use a dot to indicate notifications
                            invisible={!notifications}  // Hide if notifications state is false
                            >
                            <MenuIcon sx={{ color: "white" }} />
                            </Badge>
                        </IconButton>

                        {/* Drawer Component */}
                        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                            <div
                            role="presentation"
                            onClick={toggleDrawer(false)}
                            onKeyDown={toggleDrawer(false)}
                            style={{ width: 250 }}
                            >
                            <List sx={{cursor:"pointer"}}>
                                {menuItems.map((item, index) => (
                                <ListItem button key={index} onClick={item.onClick}>
                                    <ListItemIcon >{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItem>
                                ))}
                            </List>
                            <Divider />
                            </div>
                        </Drawer>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    backgroundColor:"white",
                    paddingRight: 1
                }}
            >
                <Paper
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, m:2 }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search"
                        inputProps={{ 'aria-label': 'search' }}
                        {...register('keyword', { required: true })}
                    />
                    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon  />
                    </IconButton>
                </Paper>
                <Button sx={{backgroundColor:(theme) => theme.palette.secondary.main, color: "white", marginRigth: 1}} onClick={()=>{router.push("/create-post")}}>Post</Button>
            </Box>
        </>
    );
}

export default NavBar;
