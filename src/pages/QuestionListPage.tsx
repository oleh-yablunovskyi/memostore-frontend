import React from 'react';
import { Container } from '@mui/material';
import QuestionList from '../components/questionList/QuestionList';

function QuestionListPage() {
  return (
    <Container>
      <h1>Interview Questions</h1>

      <QuestionList />
    </Container>
  );
}

export default QuestionListPage;
