import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, List, ListItem, ListItemButton, Stack, Typography, useTheme } from '@mui/material';

import { QuestionEditorForm } from './QuestionEditorForm';
import { QuestionMeta } from './QuestionMeta';
import { MuiDialog } from '../../../shared/components/MuiDialog';
import { questionService } from '../services/questionService';
import { IQuestion, IQuestionFormData } from '../types';
import { trimAndNormalizeSpaces } from '../../../shared/utils/trimAndNormalizeSpaces';

function QuestionList() {
  const theme = useTheme();

  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);

  const fetchQuestions = async () => {
    try {
      const questionsResponse = await questionService.getQuestions();

      setQuestions(questionsResponse);
    } catch (error) {
      console.error('There was an error fetching the questions:', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const closeAddQuestionModal = () => {
    setIsAddQuestionModalOpen(false);
  };

  const addNewQuestion = async ({ title, content, category, tags }: IQuestionFormData) => {
    if (category === null) {
      console.error('You need to select category before submitting the question');
      return;
    }

    const payload = {
      title: trimAndNormalizeSpaces(title),
      content,
      categoryId: category?.id,
      tagIds: tags.map((tag) => tag.id),
    };

    try {
      await questionService.createQuestion(payload);
      setIsAddQuestionModalOpen(false);
      fetchQuestions();
    } catch (error) {
      console.error('There was an error adding new question:', error);
    }
  };

  return (
    <>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: '20px', mb: '40px' }}
      >
        <Button
          color="primary"
          variant="contained"
          onClick={() => setIsAddQuestionModalOpen(true)}
          sx={{ width: '300px', fontWeight: theme.typography.fontWeightBold }}
        >
          Add New Question
        </Button>
      </Box>

      {isAddQuestionModalOpen && (
        <MuiDialog
          open={isAddQuestionModalOpen}
          onClose={closeAddQuestionModal}
          customStyles={{
            '& .MuiDialogContent-root': {
              paddingTop: 0,
            },
          }}
        >
          <QuestionEditorForm
            onClose={closeAddQuestionModal}
            onSubmit={addNewQuestion}
            defaultValues={{ title: '', content: '', category: null, tags: [], }}
          />
        </MuiDialog>
      )}

      <Box sx={{ border: '1px lightgray solid', borderRadius: '15px' }}>
        <List>
          {questions.map((question, index) => (
            <ListItem
              key={question.id}
              disablePadding
              sx={{ pl: 0 }}
            >
              <ListItemButton
                component={RouterLink}
                to={`/questions/${question.id}`}
                sx={{
                  py: '12px',
                  backgroundColor: index % 2 === 0 ? 'white' : 'grey.100',
                  '&:hover': {
                    backgroundColor: 'grey.300',
                  },
                  '&:active': {
                    color: 'inherit',
                  }
                }}
              >
                <Stack sx={{ width: '100%', }}>
                  <Typography variant="h6" component="div" sx={{ mb: '4px', lineHeight: 1.3, fontWeight: 600, }}>
                    {question.title}
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
    </>
  );
}

export default QuestionList;
