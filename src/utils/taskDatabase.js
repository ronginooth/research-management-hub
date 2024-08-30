let tasks = [
  { id: 1, name: 'PCR実験', status: '未完了', dueDate: '2024-03-15', project: 1, timeframe: '今週' },
  { id: 2, name: '論文レビュー', status: '未完了', dueDate: '2024-03-10', project: 2, timeframe: '今日' },
  { id: 3, name: 'データ解析', status: '完了', dueDate: '2024-03-05', project: 1, timeframe: '今週' },
];

export const getTasks = () => tasks;

export const addTask = (task) => {
  const newTask = { ...task, id: tasks.length + 1 };
  tasks.push(newTask);
  return newTask;
};

export const updateTask = (updatedTask) => {
  const index = tasks.findIndex(task => task.id === updatedTask.id);
  if (index !== -1) {
    tasks[index] = updatedTask;
    return true;
  }
  return false;
};

export const deleteTask = (id) => {
  const initialLength = tasks.length;
  tasks = tasks.filter(task => task.id !== id);
  return tasks.length !== initialLength;
};