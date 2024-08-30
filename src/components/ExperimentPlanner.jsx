import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const ExperimentPlanner = () => {
  const [keywords, setKeywords] = useState('');
  const [plan, setPlan] = useState('');

  const generatePlan = async () => {
    // Here we would typically call an API to generate the plan
    // For now, we'll just set a dummy response
    setPlan('Based on the keywords provided, here is a proposed experiment plan...');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI実験計画立案</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="キーワードを入力"
          className="mb-4"
        />
        <Button onClick={generatePlan} className="mb-4">計画を生成</Button>
        <Textarea
          value={plan}
          readOnly
          placeholder="生成された実験計画がここに表示されます"
          className="h-64"
        />
      </CardContent>
    </Card>
  );
};

export default ExperimentPlanner;