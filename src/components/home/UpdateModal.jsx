import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useTasks from '../../hooks/useTasks';

export default function UpdateModal({ isOpen, onClose, task }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const { refetchTasks } = useTasks();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `task-management-server-rho-eight.vercel.app/tasks/${task._id}`,
        {
          title,
          description,
          category: task.category,
          userEmail: task.userEmail,
          timestamp: task.timestamp,
          columnId: task.columnId,
          _id: task._id,
          orderid: task.orderid,
          id: task.id,
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
      ts: task.category,
      timestamp: new Date().toISOString(),
    });
    onClose();

  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-gray-950 bg-opacity-50 flex justify-center items-center p-4'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-4 text-gray-800'>Update Task</h2>
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
            <input
              readOnly
              className='text-xs'
              type='text'
              name=''
              value={task.category}
              id=''
            />
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
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}