import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as prismStyles from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Box, Button, useTheme } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { questionService } from '../services/questionService';
import { IQuestion } from '../types';

export default function QuestionDetail() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { questionId } = useParams();

  if (!questionId) return <div>Question not found</div>;

  const [question, setQuestion] = useState<IQuestion | null>(null);

  const fetchQuestion = async () => {
    try {
      const questionResponse = await questionService.getQuestionById(questionId);
      setQuestion(questionResponse);
    } catch (error) {
      console.error('There was an error fetching the question with id:', questionId);
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
  }, []);

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

      <Button
        // color="primary"
        // variant="contained"
        onClick={deleteQuestion}
        sx={{ pl: 0, color: 'red', fontWeight: theme.typography.fontWeightBold }}
      >
        Delete
      </Button>
    </Box>
  );
}
