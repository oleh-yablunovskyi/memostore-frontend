import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Typography, useTheme } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as prismStyles from 'react-syntax-highlighter/dist/esm/styles/prism';

import { QuestionMeta } from '../components/QuestionMeta';
import { QuestionEditorForm } from '../components/QuestionEditorForm';
import { UpdateDeleteButtons } from '../components/UpdateDeleteButtons';
import { MuiDialog } from '../../../shared/components/MuiDialog';
import { MuiConfirmDialog } from '../../../shared/components/MuiConfirmationDialog';
import { questionService } from '../services/questionService';
import { IQuestion, IQuestionFormData } from '../types';

export default function QuestionDetail() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { questionId } = useParams();

  if (!questionId) return <div>Question not found</div>;

  const [question, setQuestion] = useState<IQuestion | null>(null);
  const [isUpdateQuestionModalOpen, setIsUpdateQuestionModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const fetchQuestion = async () => {
    try {
      const questionResponse = await questionService.getQuestionById(questionId);
      setQuestion(questionResponse);
    } catch (error) {
      console.error('There was an error fetching the question with id:', questionId);
    }
  };

  const updateQuestion = async ({ title, content, category, tags }: IQuestionFormData) => {
    if (category === null) {
      console.error('You need to select category before submitting the question');
      return;
    }

    const payload = {
      title,
      content,
      categoryId: category?.id,
      tagIds: tags.map((tag) => tag.id),
    };

    try {
      await questionService.updateQuestion(questionId, payload);
      setIsUpdateQuestionModalOpen(false);
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

  const closeUpdateQuestionModal = () => {
    setIsUpdateQuestionModalOpen(false);
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
        sx={{ pl: 0, mb: '16px', fontWeight: theme.typography.fontWeightBold }}
      >
        Back
      </Button>

      <Box sx={{ mb: '38px' }}>
        <Typography variant="h1">
          {question.title}
        </Typography>

        <QuestionMeta
          createdDate={question.createdDate}
          categoryName={question.category.name}
          tags={question.tags}
        />
      </Box>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
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

      <UpdateDeleteButtons
        onUpdateClick={() => setIsUpdateQuestionModalOpen(true)}
        onDeleteClick={() => setIsDeleteConfirmOpen(true)}
      />

      {isUpdateQuestionModalOpen && (
        <MuiDialog
          open={isUpdateQuestionModalOpen}
          onClose={closeUpdateQuestionModal}
          maxWidth="md"
          customStyles={{
            '& .MuiDialogContent-root': {
              paddingTop: 0,
            },
          }}
        >
          <QuestionEditorForm
            onClose={closeUpdateQuestionModal}
            onSubmit={updateQuestion}
            defaultValues={{
              title: question.title,
              content: question.content,
              category: question.category,
              tags: question.tags,
            }}
          />
        </MuiDialog>
      )}

      {isDeleteConfirmOpen && (
        <MuiConfirmDialog
          open={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={deleteQuestion}
          title="Confirm Delete"
          content="Are you sure you want to delete this question?"
          cancelButtonText="Cancel"
          confirmButtonText="Delete"
        />
      )}
    </Box>
  );
}
