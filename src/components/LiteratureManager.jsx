import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const LiteratureManager = () => {
  const [literature, setLiterature] = useState([]);
  const [newLiterature, setNewLiterature] = useState({ title: '', authors: '', year: '' });

  const addLiterature = () => {
    setLiterature([...literature, { ...newLiterature, id: Date.now() }]);
    setNewLiterature({ title: '', authors: '', year: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>文献管理</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            value={newLiterature.title}
            onChange={(e) => setNewLiterature({ ...newLiterature, title: e.target.value })}
            placeholder="タイトル"
          />
          <Input
            value={newLiterature.authors}
            onChange={(e) => setNewLiterature({ ...newLiterature, authors: e.target.value })}
            placeholder="著者"
          />
          <Input
            value={newLiterature.year}
            onChange={(e) => setNewLiterature({ ...newLiterature, year: e.target.value })}
            placeholder="年"
          />
          <Button onClick={addLiterature}>追加</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>タイトル</TableHead>
              <TableHead>著者</TableHead>
              <TableHead>年</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {literature.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.authors}</TableCell>
                <TableCell>{item.year}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LiteratureManager;