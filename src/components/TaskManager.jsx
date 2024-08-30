import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isToday, isThisWeek } from "date-fns";
import { Link } from 'react-router-dom';

const TaskManager = ({ tasks, addTask, updateTask, projects }) => {
  const [newTask, setNewTask] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedProject, setSelectedProject] = useState('');

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      addTask({
        name: newTask,
        status: '未完了',
        dueDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null,
        project: selectedProject,
        timeframe: getTimeframe(selectedDate),
      });
      setNewTask('');
      setSelectedDate(null);
      setSelectedProject('');
    }
  };

  const getTimeframe = (date) => {
    if (!date) return 'いつか';
    if (isToday(date)) return '今日';
    if (isThisWeek(date, { weekStartsOn: 1 })) return '今週';
    return '明日以降';
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
        <div className="flex mb-4 space-x-2">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="新しいタスクを入力"
          />
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger>
              <SelectValue placeholder="プロジェクトを選択" />
            </SelectTrigger>
            <SelectContent>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddTask}>追加</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>タスク名</TableHead>
              <TableHead>期日</TableHead>
              <TableHead>プロジェクト</TableHead>
              <TableHead>状態</TableHead>
              <TableHead>アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map(task => (
              <TableRow key={task.id}>
                <TableCell>
                  <Link to={`/task/${task.id}`}>{task.name}</Link>
                </TableCell>
                <TableCell>{task.dueDate || '未設定'}</TableCell>
                <TableCell>{projects.find(p => p.id === task.project)?.name || '未設定'}</TableCell>
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
