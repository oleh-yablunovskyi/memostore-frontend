import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, Stack, Typography } from '@mui/material';

import { QuestionMeta } from './QuestionMeta';
import { LoaderSkeleton } from '../../../shared/components/LoaderSkeleton';
import { blinkAnimation } from '../../../shared/styles/animations';
import { highlightText } from '../../../shared/utils/highlightText';
import { IQuestion } from '../types';
import { QUESTIONS_PER_PAGE } from '../consts';

interface Props {
  questions: IQuestion[];
  search: string;
  isLoading: boolean;
  highlightedQuestionId: string | null;
  onQuestionItemClick: (questionId: number) => void;
}

export const QuestionItemsList: React.FC<Props> = ({
  questions,
  search,
  isLoading,
  highlightedQuestionId,
  onQuestionItemClick,
}) => {
  const handleItemClick = (questionId: number) => () => {
    onQuestionItemClick(questionId);
  };

  if (isLoading === true) {
    return (
      <>
        {Array.from({ length: QUESTIONS_PER_PAGE }).map((_, index) => (
          <LoaderSkeleton key={index} />
        ))}
      </>
    );
  }

  return (
    <Box sx={{ border: '1px lightgray solid', borderRadius: '15px' }}>
      <List>
        {questions.map((question, index) => (
          <ListItem
            key={question.id}
            disablePadding
            sx={{
              pl: 0,
              backgroundColor: index % 2 === 0 ? 'white' : 'grey.100',
            }}
          >
            <ListItemButton
              component={RouterLink}
              to={`/questions/${question.id}`}
              onClick={handleItemClick(question.id)}
              sx={{
                py: '12px',
                ...(question.id.toString() === highlightedQuestionId && {
                  animation: `${blinkAnimation} 1.5s ease-in`,
                  animationIterationCount: 1,
                }),
                '&:hover': {
                  backgroundColor: 'grey.300',
                },
                '&:active': {
                  color: 'inherit',
                },
              }}
            >
              <Stack sx={{ width: '100%' }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ mb: '4px', lineHeight: 1.3, fontWeight: 600 }}
                >
                  {highlightText(question.title, search)}
                </Typography>

                <QuestionMeta
                  createdDate={question.createdDate}
                  categoryName={question.category.name}
                  tags={question.tags}
                />
              </Stack>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
