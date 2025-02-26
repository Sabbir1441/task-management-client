import { PlusIcon } from '@heroicons/react/24/solid';

export default function AddTaskButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className='w-full cursor-pointer py-3 px-4 bg-white text-purple-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50'
    >
      <div className='flex items-center justify-center'>
        <PlusIcon className='h-6 w-6 mr-2' />
        <span className='text-lg font-semibold'>Add New Task</span>
      </div>
    </button>
  );
}