import { useEffect, useMemo, useState } from 'react';
import AddTaskButton from './AddTaskButton';
import AddTaskModal from './AddTaskModal';
import ColumnContainer from './ColumnContainer';
import {
  DndContext,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import useTasks from '../../hooks/useTasks';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

export default function TaskBoard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);
  const { user } = useAuth();
  const [categories, setCategories] = useState([
    {
      id: '1',
      name: 'To Do',
    },
    {
      id: '2',
      name: 'In Progress',
    },
    {
      id: '3',
      name: 'Done',
    },
  ]);
  const { tasks: ts, refetchTasks } = useTasks();
  const [tasks, setTasks] = useState([

  ]);

  useEffect(() => {
    if (Array.isArray(ts) && ts.length) {
      setTasks(ts); 
    } else {
      setTasks([]); 
    }
  }, [ts]); 

  const coloumsId = useMemo(
    () => categories.map((category) => category.id),
    [categories]
  );
  const handleDragStart = (event) => {
    console.log(event);
    if (event.active.data.current?.type === 'column') {
      console.log('Column drag');
      setActiveColumn(event.active.data.current.category);
      return;
    }
  };

  console.log(ts, 'ts');
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) {
      return;
    }
    setCategories((categories) => {
      const activeColumnIndex = categories.findIndex(
        (category) => category.id === activeColumnId
      );
      const overColumnIndex = categories.findIndex(
        (category) => category.id === overColumnId
      );
      return arrayMove(categories, activeColumnIndex, overColumnIndex);
    });
  };
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 10,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 10,
      },
    })
  );

  const handleDragOver = async (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) {
      return;
    }
    console.log(active, over);
    const isActiveTask = active.data.current?.type === 'task';
    const isOverTask = over.data.current?.type === 'task';
    if (!isActiveTask) return;
    if (isActiveTask && isOverTask) {
      let reorderTasks = [];
      setTasks((tasks) => {
        const activeTaskIndex = tasks?.findIndex(
          (task) => task.id === active.id
        );
        const overTaskIndex = tasks?.findIndex((task) => task.id === over.id);
        tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;
        const reorderedTasks = arrayMove(tasks, activeTaskIndex, overTaskIndex);

        reorderTasks = reorderedTasks.map((task, index) => ({
          ...task,
          orderid: index + 1, 
        }));
        console.log(reorderTasks, 'reorderTasks');

        return reorderedTasks;
      });
      try {
        const res = await axios.put(
          'https://task-management-server-1441.onrender.com/tasks',
          reorderTasks
        );

        if (res?.data?.success) {
          refetchTasks(); 
        }
      } catch (error) {
        console.error('Error updating tasks:', error);
      }
    }
    const isOverColumn = over.data.current?.type === 'column';
    if (isActiveTask && isOverColumn) {
      let finalOrder = [];
      setTasks((tasks) => {
        const activeTaskIndex = tasks?.findIndex(
          (task) => task.id === active.id
        );
        tasks[activeTaskIndex].columnId = over.id;
        const reorderTask = arrayMove(tasks, activeTaskIndex, activeTaskIndex);
        finalOrder = reorderTask.map((task, index) => ({
          ...task,
          orderid: index + 1,
        }));
        console.log(finalOrder, 'finalOrder');
        return reorderTask;
      });
      try {
        const res = await axios.put(
          'https://task-management-server-1441.onrender.com/tasks',
          finalOrder
        );

        if (res?.data?.success) {
          refetchTasks();
        }
      } catch (error) {
        console.error('Error updating tasks:', error);
      }
    }
  };
  return (
    <div className='space-y-8'>
      <AddTaskButton onClick={() => setIsModalOpen(true)} />
      <DndContext
        onDragOver={handleDragOver}
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <div className='grid md:grid-cols-3 gap-6 '>
          <SortableContext items={coloumsId}>

            {categories.map((category) => (
              <ColumnContainer
                tasks={tasks?.filter(
                  (task) =>
                    task.columnId === category.id &&
                    task.userEmail === user?.email
                )}
                key={category.id}
                category={category}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}