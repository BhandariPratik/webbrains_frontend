"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const router = useRouter();
  
    useEffect(() => {
      const current = localStorage?.getItem('token') ;
      const isAuthenticated = current !== null;
      if (!isAuthenticated) {
        router.push('/');
      }
    }, [])
      
    return <Component {...props} />;
  };
}
