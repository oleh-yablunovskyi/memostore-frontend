import React from 'react';
import { Typography } from '@mui/material';
import { QuestionSettings } from '../features/questions/components-main/QuestionSettings';

function QuestionSettingsPage() {
  return (
    <div>
      <Typography variant="h1" sx={{ my: '40px' }}>
        Question Settings
      </Typography>

      <QuestionSettings />
    </div>
  );
}

export default QuestionSettingsPage;
