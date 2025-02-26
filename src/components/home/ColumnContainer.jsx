import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';
import { useMemo } from 'react';

const ColumnContainer = ({ category, tasks }) => {
  const isDraggingDisabled = true;
  const { setNodeRef, attributes, listeners, transition, transform } =
    useSortable({
      id: category.id,
      data: {
        type: 'column',
        category,
      },
      disabled: isDraggingDisabled,
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const tasksId = useMemo(() => tasks.map((task) => task.id), [tasks]);
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className='bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 h-[450px] sm:h-[500px] overflow-y-auto flex flex-col'
    >
      <div className='font-semibold mb-1 sm:mb-2 text-purple-700 sm:text-lg text-xl'>
        {category.name}
      </div>
      <div className='flex-grow'>
        <SortableContext items={tasksId}>
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default ColumnContainer;