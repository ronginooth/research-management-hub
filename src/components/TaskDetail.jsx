import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

const TaskDetail = ({ tasks, updateTask, projects }) => {
  const { id } = useParams();
  const task = tasks.find(t => t.id === parseInt(id));
  
  const [editedTask, setEditedTask] = useState(task);

  const handleChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setEditedTask({ ...editedTask, dueDate: format(date, 'yyyy-MM-dd') });
  };

  const handleProjectChange = (projectId) => {
    setEditedTask({ ...editedTask, project: projectId });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTask(editedTask);
  };

  if (!task) return <div>タスクが見つかりません</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>タスク詳細</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">タスク名</label>
            <Input id="name" name="name" value={editedTask.name} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">期日</label>
            <Calendar
              mode="single"
              selected={editedTask.dueDate ? new Date(editedTask.dueDate) : null}
              onSelect={handleDateChange}
            />
          </div>
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700">プロジェクト</label>
            <Select value={editedTask.project} onValueChange={handleProjectChange}>
              <SelectTrigger>
                <SelectValue placeholder="プロジェクトを選択" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="memo" className="block text-sm font-medium text-gray-700">メモ</label>
            <Textarea id="memo" name="memo" value={editedTask.memo || ''} onChange={handleChange} />
          </div>
          <div className="flex justify-between">
            <Button type="submit">更新</Button>
            <Link to="/tasks">
              <Button variant="outline">戻る</Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskDetail;