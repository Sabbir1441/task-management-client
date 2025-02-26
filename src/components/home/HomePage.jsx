import useAuth from '../../hooks/useAuth';
import TaskBoard from './TaskBoard';

const HomePage = () => {
  const { logoutUser } = useAuth();
  const handleLogout = () => {
    logoutUser();
  };
  return (
    <main className='min-h-screen bg-violet-950 py-8 px-4'>
      <div className='w-10/12 mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-4xl font-bold mb-8 text-center text-white'>
            Task Board
          </h1>
          <button
            onClick={handleLogout}
            className='bg-red-500 cursor-pointer text-white px-4 py-2 rounded-md mb-4'
          >
            LogOut
          </button>
        </div>
        <TaskBoard />
      </div>
    </main>
  );
};

export default HomePage;