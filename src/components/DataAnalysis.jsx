import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const DataAnalysis = () => {
  const [data, setData] = useState([]);
  const [xValue, setXValue] = useState('');
  const [yValue, setYValue] = useState('');

  const addDataPoint = () => {
    if (xValue && yValue) {
      setData([...data, { x: xValue, y: parseFloat(yValue) }]);
      setXValue('');
      setYValue('');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">データ分析</h2>
      <div className="flex mb-4">
        <Input
          type="text"
          value={xValue}
          onChange={(e) => setXValue(e.target.value)}
          placeholder="X値"
          className="mr-2"
        />
        <Input
          type="number"
          value={yValue}
          onChange={(e) => setYValue(e.target.value)}
          placeholder="Y値"
          className="mr-2"
        />
        <Button onClick={addDataPoint}>データ追加</Button>
      </div>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="y" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default DataAnalysis;