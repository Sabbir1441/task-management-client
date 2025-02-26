import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useTasks from '../../hooks/useTasks';
import useAuth from '../../hooks/useAuth';

export default function AddTaskModal({ isOpen, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('To Do');
  const { refetchTasks } = useTasks();
  const { user } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'https://task-management-server-1441.onrender.com/tasks',
        {
          title,
          description,
          category,
          userEmail: user?.email,
          timestamp: new Date().toISOString(),
          columnId:
            category === 'Done' ? '3' : category === 'In Progress' ? '2' : '1',
        }
      );
      if (res?.data?.success) {
        refetchTasks();
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    console.log({
      title,
      description,
      category,
      timestamp: new Date().toISOString(),
    });
    onClose();
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('To Do');
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-gray-950 bg-opacity-50 flex justify-center items-center p-4'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-4 text-gray-800'>Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Title (required)
            </label>
            <input
              type='text'
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Description (optional)
            </label>
            <textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              rows={3}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='category'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Category
            </label>
            <select
              id='category'
              value={category}
              required
              onChange={(e) => setCategory(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
            >
              <option value='To Do'>To Do</option>
              <option value='In Progress'>In Progress</option>
              <option value='Done'>Done</option>
            </select>
          </div>
          <div className='flex justify-end space-x-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 cursor-pointer py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 cursor-pointer py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500'
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}