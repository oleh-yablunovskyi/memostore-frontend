import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { QuestionEditorForm } from './QuestionEditorForm';
import { MuiDialog } from '../../../shared/components/MuiDialog';
import { questionService } from '../services/questionService';
import { trimAndNormalizeSpaces } from '../../../shared/utils/trimAndNormalizeSpaces';
import { IQuestionFormData } from '../types';

interface Props {
  onQuestionAdded: () => void;
}

export const AddNewQuestionBtn: React.FC<Props> = ({ onQuestionAdded }) => {
  const theme = useTheme();

  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);

  const addNewQuestion = async ({ title, content, category, tags }: IQuestionFormData) => {
    if (category === null) {
      console.error('You need to select a category before submitting the question');
      return;
    }

    const payload = {
      title: trimAndNormalizeSpaces(title),
      content,
      categoryId: category.id,
      tagIds: tags.map((tag) => tag.id),
    };

    try {
      await questionService.createQuestion(payload);

      setIsAddQuestionModalOpen(false);
      onQuestionAdded();
    } catch (error) {
      console.error('There was an error adding a new question:', error);
    }
  };

  const openAddQuestionModal = () => {
    setIsAddQuestionModalOpen(true);
  };

  const closeAddQuestionModal = () => {
    setIsAddQuestionModalOpen(false);
  };

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        onClick={openAddQuestionModal}
        sx={{ width: '300px', fontWeight: theme.typography.fontWeightBold }}
      >
        Add New Question
      </Button>

      {isAddQuestionModalOpen && (
        <MuiDialog
          open={isAddQuestionModalOpen}
          onClose={closeAddQuestionModal}
          maxWidth="md"
          customStyles={{
            '& .MuiDialogContent-root': {
              paddingTop: 0,
            },
          }}
        >
          <QuestionEditorForm
            onClose={closeAddQuestionModal}
            onSubmit={addNewQuestion}
            defaultValues={{ title: '', content: '', category: null, tags: [] }}
          />
        </MuiDialog>
      )}
    </>
  );
};
