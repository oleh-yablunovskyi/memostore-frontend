import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, List, ListItem, ListItemButton, ListItemText, useTheme } from '@mui/material';

import { QuestionEditorForm } from './QuestionEditorForm';
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
