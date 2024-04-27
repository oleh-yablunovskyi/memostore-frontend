import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, List, ListItem, ListItemButton, ListItemText, TextField } from '@mui/material';
import { Question } from '../types';

function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');
  const [content, setCotent] = useState('');

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:3001/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('There was an error fetching the questions:', error);
      // Handle fetch error (e.g., show error message)
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:3001/questions', { title, content });

      // Refetch questions to update the list
      await fetchQuestions();

      setTitle('');
      setCotent('');
    } catch (error) {
      console.error('There was an error submitting the form:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
        <TextField
          label="Title"
          variant="outlined"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Text"
          variant="outlined"
          value={content}
          required
          onChange={(e) => setCotent(e.target.value)}
          multiline // Optional: makes it a textarea for longer text
          rows={4} // Optional: sets the number of lines in the textarea
        />
        <Button type="submit" variant="contained" sx={{ mb: '20px' }}>Add Question</Button>
      </form>

      <Box component="nav" sx={{ border: '1px lightgray solid', borderRadius: '15px' }}>
        <List>
          {questions.map((question) => (
            <ListItem key={question.id} disablePadding>
              <ListItemButton component={RouterLink} to={`/questions/${question.id}`}>
                <ListItemText primary={question.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}

export default QuestionList;
