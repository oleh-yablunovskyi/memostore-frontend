import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import questions from '../../mocks/questions.json';

function QuestionList() {
  return (
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
  );
}

export default QuestionList;
