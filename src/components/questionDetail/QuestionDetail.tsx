import * as React from 'react';
import { Box, Button, useTheme } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate, useParams } from 'react-router-dom';

import questions from '../../mocks/questions.json';

export default function QuestionDetail() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { questionId } = useParams();

  if (!questionId) return <div>Question not found</div>;

  const question = questions.find((q) => q.id === +questionId);

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

      <p>{question.description}</p>
    </Box>
  );
}
