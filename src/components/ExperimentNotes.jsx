import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ExperimentNotes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (newNote.trim() !== '') {
      setNotes([...notes, { id: Date.now(), content: newNote, date: new Date().toLocaleString() }]);
      setNewNote('');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">実験ノート</h2>
      <div className="mb-4">
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="新しい実験ノートを入力"
          className="mb-2"
        />
        <Button onClick={addNote}>ノートを追加</Button>
      </div>
      <div className="space-y-4">
        {notes.map(note => (
          <Card key={note.id}>
            <CardHeader>
              <CardTitle>{note.date}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{note.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExperimentNotes;