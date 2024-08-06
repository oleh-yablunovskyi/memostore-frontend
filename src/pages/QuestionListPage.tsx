import React from 'react';
import { Container, Typography } from '@mui/material';
import QuestionList from '../features/questions/components/QuestionList';

function QuestionListPage() {
  return (
    <Container>
      <Typography variant="h1" sx={{ my: '40px' }}>
        List of Questions
      </Typography>

      <QuestionList />
    </Container>
  );
}

export default QuestionListPage;
