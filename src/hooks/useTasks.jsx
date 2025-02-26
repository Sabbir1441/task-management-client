import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchTasks = async () => {
  const { data } = await axios.get(
    'https://task-management-server-1441.onrender.com/tasks'
  );
  console.log(data?.data);
  return data?.data || [];
};

const useTasks = () => {
  const {
    data: tasks = [],
    isLoading,
    error,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  return { tasks, isLoading, error, refetchTasks };
};

export default useTasks;