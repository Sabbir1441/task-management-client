import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import useTasks from '../../hooks/useTasks';
import { useState } from 'react';
import UpdateModal from './UpdateModal';

export default function TaskCard({ task }) {
  const { refetchTasks } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setNodeRef, attributes, listeners, transition, transform } =
    useSortable({
      id: task.id,
      data: {
        type: 'task',
        task,
      },
      disabled: isModalOpen,
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `https://task-management-server-1441.onrender.com/tasks/${task._id}`
      );
      if (res?.data?.success) {
        refetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className='bg-white children rounded-lg shadow-md p-2 sm:p-4 hover:shadow-lg transition-shadow duration-200 cursor-grab sm:mb-5 mb-2'
    >
      <div>
        <h3 className='font-semibold mb-1 sm:mb-2 text-xl uppercase text-purple-700'>
          {task.title}
        </h3>
        <p className='text-sm text-gray-600 sm:mb-2 m-1'>{task.description}</p>
        <div className='flex justify-between items-center text-xs text-gray-500'>
          <span className='text-xs italic bg-purple-200 p-1 rounded-md'>
            {task.category}
          </span>
          <span>{new Date(task.timestamp).toLocaleString()}</span>
        </div>
        <div className='flex mt-5 justify-center gap-5 items-center'>
          <button
            onClick={() => setIsModalOpen(true)}
            className='sm:mt-2 mt-1 border p-2 rounded-md text-purple-500 cursor-pointer hover:text-purple-700 text-xs'
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className='sm:mt-2 mt-1 border p-2 rounded-md text-red-500 cursor-pointer hover:text-red-700 text-xs'
          >
            Delete
          </button>
        </div>
        <UpdateModal
          task={task}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}