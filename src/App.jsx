import { createBrowserRouter, RouterProvider } from 'react-router';
import './App.css';
import AuthProvider from './provider/AuthProvider';
import { Toaster } from 'react-hot-toast';
import ErrorPage from './components/ErrorPage';
import Login from './components/Login';
import HomePage from './components/home/HomePage';
import PrivateRoute from './private/PrivateRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <PrivateRoute>
          <HomePage />
        </PrivateRoute>
      ),
    },

    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '*',
      element: <ErrorPage />,
    },
  ]);
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;