import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const InventoryManager = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '' });

  const addItem = () => {
    setInventory([...inventory, { ...newItem, id: Date.now() }]);
    setNewItem({ name: '', quantity: '', unit: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>物品管理</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            placeholder="物品名"
          />
          <Input
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            placeholder="数量"
            type="number"
          />
          <Input
            value={newItem.unit}
            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            placeholder="単位"
          />
          <Button onClick={addItem}>追加</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>物品名</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>単位</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InventoryManager;