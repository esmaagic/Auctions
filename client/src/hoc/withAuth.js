import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import CustomSkeleton from '@/components/CustomSkeleton';


axios.defaults.withCredentials = true;

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`);
          if (response.data) {
            setIsAuthenticated(true);
          } else {
            router.push('/login?alert=notAuthenticated');
          }
        } catch (error) {
          router.push('/login?alert=notAuthenticated');
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return <CustomSkeleton/>
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
