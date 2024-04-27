import React, { useEffect, useState } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Question } from '../types';

export default function QuestionDetail() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { questionId } = useParams();

  if (!questionId) return <div>Question not found</div>;

  const [question, setQuestion] = useState<Question | null>(null);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/questions/${questionId}`);
      setQuestion(response.data);
    } catch (error) {
      console.error('There was an error fetching the question with id:', questionId);
      // Handle fetch error (e.g., show error message)
    }
  };

  const deleteQuestion = async () => {
    try {
      await axios.delete(`http://localhost:3001/questions/${questionId}`);

      navigate('/questions');
    } catch (error) {
      console.error('There was an error deleting the question with id:', questionId);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  if (!question) return <div>Question not found</div>;

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIosNewIcon />}
        color="primary"
        onClick={() => navigate(-1)}
        sx={{ pl: 0, fontWeight: theme.typography.fontWeightBold }}
      >
        Back
      </Button>

      <h1>{question.title}</h1>

      <p>{question.content}</p>

      <Button
        // color="primary"
        // variant="contained"
        onClick={deleteQuestion}
        sx={{ pl: 0, color: 'red', fontWeight: theme.typography.fontWeightBold }}
      >
        Delete
      </Button>
    </Box>
  );
}
