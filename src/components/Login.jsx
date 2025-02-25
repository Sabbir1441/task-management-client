import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const { loginUser, googleLogin } = useAuth();
  const loc = useLocation();

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const frm = loc?.state?.from?.pathname || '/';
      const user = await googleLogin();
      if (user) {
        toast.success('Logged in with Google');
        navigate(frm, { replace: true });
      }
    } catch (err) {
      toast.error('Google login failed. Please try again.');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='bg-gray-900 text-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>

        {/* Social Login */}
        <div className='mt-6 text-center'>
          <button
            onClick={handleGoogleLogin}
            className='bg-red-600 cursor-pointer w-full hover:bg-red-700 text-white py-2 px-4 rounded'
          >
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;