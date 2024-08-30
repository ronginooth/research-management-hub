import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const TaskManager = ({ tasks, addTask, updateTask }) => {
  const [newTask, setNewTask] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      addTask({
        name: newTask,
        status: '未完了',
        dueDate: format(selectedDate, 'yyyy-MM-dd')
      });
      setNewTask('');
    }
  };

  const toggleTaskStatus = (task) => {
    const updatedTask = {
      ...task,
      status: task.status === '完了' ? '未完了' : '完了'
    };
    updateTask(updatedTask);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>タスク管理</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="新しいタスクを入力"
            className="mr-2"
          />
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="mr-2"
          />
          <Button onClick={handleAddTask}>追加</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>タスク名</TableHead>
              <TableHead>期日</TableHead>
              <TableHead>状態</TableHead>
              <TableHead>アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map(task => (
              <TableRow key={task.id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>
                  <Button onClick={() => toggleTaskStatus(task)}>
                    {task.status === '完了' ? '未完了にする' : '完了にする'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TaskManager;
