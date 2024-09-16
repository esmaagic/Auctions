'use client'
import * as React from 'react';
import axios from "axios";
import { Button } from '@mui/material';
import { fetchUser } from '@/services/fetchUser';
axios.defaults.withCredentials = true;

const Home = () => {
  const [user, setUser] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
      fetchUser(setUser, setError);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`);
      setUser(null); // Clear user data after logout
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Failed to logout:", error);
      setError('Failed to logout');
    }
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {/* Conditional rendering based on the state */}
      {error ? (
        <p>{error}</p>
      ) : user ? (
        <div>
          <h2>User Information</h2>
          <p><strong>Name:</strong> {user.firstname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {/* Add more fields based on your user object structure */}
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Home;
