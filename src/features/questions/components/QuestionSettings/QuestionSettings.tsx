import React from 'react';
import { Stack } from '@mui/material';
import { CategoryList } from './components/CategoryList';
import { TagList } from './components/TagList';

function QuestionSettings() {
  return (
    <Stack sx={{ gap: '50px' }}>
      <CategoryList />

      <TagList />
    </Stack>
  );
}

export { QuestionSettings };
