import { createBrowserRouter, RouterProvider } from 'react-router';
import './App.css';
import AuthProvider from './provider/AuthProvider';
import { Toaster } from 'react-hot-toast';
import ErrorPage from './components/ErrorPage';
import Login from './components/Login';
import HomePage from './components/home/HomePage';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />,
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
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </>
  );
}

export default App;