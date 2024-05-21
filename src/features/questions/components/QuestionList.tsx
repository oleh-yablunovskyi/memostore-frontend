import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Autocomplete, Box, Button, FormControl, List, ListItem, ListItemButton, ListItemText, TextField } from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { questionService } from '../services/questionService';
import { categoryService } from '../services/categoryService';
import { ICategory, IQuestion } from '../types';

interface IFormInput {
  title: string;
  content: string;
  category: ICategory | null;
}

function QuestionList() {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const { control, handleSubmit, reset } = useForm<IFormInput>();

  const fetchQuestions = async () => {
    try {
      const questionsResponse = await questionService.getQuestions();

      setQuestions(questionsResponse);
    } catch (error) {
      console.error('There was an error fetching the questions:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesResponse = await categoryService.getCategories();

      setCategories(categoriesResponse);
    } catch (error) {
      console.error('There was an error fetching the categories:', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchCategories();
  }, []);

  const onSubmit: SubmitHandler<IFormInput> = async ({ title, content, category }) => {
    if (category === null) {
      console.error('You need to select category before submitting the question');
      return;
    }

    try {
      await questionService.createQuestion({ title, content, categoryId: category?.id });
      await fetchQuestions();
      reset();
    } catch (error) {
      console.error('There was an error submitting the form:', error);
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', flexDirection: 'column', gap: '20px', mb: '40px' }}
      >
        <FormControl variant="outlined">
          <Controller
            name="title"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Title"
                variant="outlined"
                required
              />
            )}
          />
        </FormControl>

        <FormControl variant="outlined">
          <Controller
            name="content"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Text"
                variant="outlined"
                required
                multiline
                rows={4}
              />
            )}
          />
        </FormControl>

        <Controller
          name="category"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <Autocomplete
              {...field}
              value={field.value}
              onChange={(event, newValue) => field.onChange(newValue)}
              disablePortal
              options={categories}
              sx={{ width: '50%' }}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} label="Select Category" required />}
            />
          )}
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
