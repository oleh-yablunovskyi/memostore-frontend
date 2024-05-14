import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { Autocomplete, Box, Button, List, ListItem, ListItemButton, ListItemText, TextField } from '@mui/material';
import { ICategory, IQuestion } from '../types';

function QuestionList() {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:3001/questions?page=1&limit=100');

      setQuestions(response.data.data);
    } catch (error) {
      // TODO: Handle fetch error properly (e.g., show error message to the user)
      console.error('There was an error fetching the questions:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/categories?page=1&limit=100');

      setCategories(response.data.data);
    } catch (error) {
      // TODO: Handle fetch error properly (e.g., show error message to the user)
      console.error('There was an error fetching the categories:', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchCategories();
  }, []);

  const clearForm = () => {
    setTitle('');
    setContent('');
    setSelectedCategory(null);
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:3001/questions', { title, content, categoryId: selectedCategory?.id });

      // Refetch questions to update the list
      await fetchQuestions();

      clearForm();
    } catch (error) {
      console.error('There was an error submitting the form:', error);
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: '20px', mb: '40px' }}
      >
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
          onChange={(e) => setContent(e.target.value)}
          multiline // Optional: makes it a textarea for longer text
          rows={4} // Optional: sets the number of lines in the textarea
        />

        <Autocomplete
          value={selectedCategory}
          onChange={(event: any, newValue: ICategory | null) => {
            setSelectedCategory(newValue);
          }}
          disablePortal
          id="combo-box-demo"
          options={categories}
          sx={{ width: '50%' }}
          getOptionLabel={(option) => option.name}
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params) => <TextField {...params} label="Select Category *" />}
        />

        <Button type="submit" variant="contained" sx={{ p: '12px' }}>
          Add Question
        </Button>
      </Box>

      <Box sx={{ border: '1px lightgray solid', borderRadius: '15px' }}>
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
