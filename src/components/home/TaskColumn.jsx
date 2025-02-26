import { useEffect, useState } from 'react';
import TaskCard from './TaskCard';
import axios from 'axios';
import {
  closestCorners,
  DndContext,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export default function TaskColumn({ category }) {
  const [task, setTask] = useState([]);
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await axios.get(
        'https://task-management-server-1441.onrender.com/tasks'
      );
      if (res.data.success) {
        setTask(res.data.data);
      }
    };
    fetchTasks();
  }, []);
  console.log(task);
  const filteredTasks =
    task && task.filter((task) => task.category === category);
  const getPosition = (id) => {
    return filteredTasks.findIndex((tak) => tak._id === id);
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) {
      return;
    }

    setTask(() => {
      const originalPosition = getPosition(active.id);
      const newPosition = getPosition(over.id);
      return arrayMove(task, originalPosition, newPosition);
    });
  };
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor),
    useSensor(MouseSensor)
  );
  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <SortableContext
        strategy={verticalListSortingStrategy}
        items={filteredTasks.map((task) => task._id)}
      >
        <div className='bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-4 shadow-lg'>
          <h2 className='text-xl font-semibold mb-4 text-purple-700'>
            {category}
          </h2>
          <div className='space-y-4'>
            {filteredTasks?.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
}