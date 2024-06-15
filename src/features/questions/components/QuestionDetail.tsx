import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as prismStyles from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Box, Button, TextField, useTheme, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { questionService } from '../services/questionService';
import { IQuestion } from '../types';

export default function QuestionDetail() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { questionId } = useParams();

  if (!questionId) return <div>Question not found</div>;

  const [question, setQuestion] = useState<IQuestion | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const fetchQuestion = async () => {
    try {
      const questionResponse = await questionService.getQuestionById(questionId);
      setQuestion(questionResponse);
      reset({
        title: questionResponse.title,
        content: questionResponse.content,
      });
    } catch (error) {
      console.error('There was an error fetching the question with id:', questionId);
    }
  };

  const updateQuestion = async (data: { title: string; content: string; }) => {
    try {
      await questionService.updateQuestion(questionId, data);
      setIsUpdateDialogOpen(false);
      fetchQuestion();
    } catch (error) {
      console.error('There was an error updating the question with id:', questionId);
    }
  };

  const deleteQuestion = async () => {
    try {
      await questionService.deleteQuestion(questionId);
      navigate('/questions');
    } catch (error) {
      console.error('There was an error deleting the question with id:', questionId);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);

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

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // eslint-disable-next-line react/no-unstable-nested-components
          code(props) {
            // eslint-disable-next-line react/prop-types
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                {...props}
                PreTag="div"
                language={match[1]}
                style={prismStyles.coldarkDark}
                customStyle={{ borderRadius: '10px' }}
              // Such ref provided as a last resort to avoid SyntaxHighlighter ref error
                ref={undefined}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          }
        }}
      >
        {question.content}
      </ReactMarkdown>

      <Box display="flex" gap={2} mt={3}>
        <Button
          color="primary"
          variant="contained"
          onClick={() => setIsUpdateDialogOpen(true)}
          sx={{ minWidth: '200px', fontWeight: theme.typography.fontWeightBold }}
        >
          Update
        </Button>

        <Button
          color="error"
          variant="outlined"
          onClick={() => setIsDeleteConfirmOpen(true)}
          sx={{ minWidth: '200px', fontWeight: theme.typography.fontWeightBold }}
        >
          Delete
        </Button>
      </Box>

      <Dialog
        open={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        scroll="paper"
        sx={{
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: '54rem',
          },
        }}
      >
        <DialogTitle>Update Question</DialogTitle>
        <DialogContent dividers>
          <form id="update-question-form" onSubmit={handleSubmit(updateQuestion)}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Title"
                  fullWidth
                />
              )}
            />
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Content"
                  fullWidth
                  multiline
                />
              )}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUpdateDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button type="submit" form="update-question-form" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this question?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteQuestion} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
