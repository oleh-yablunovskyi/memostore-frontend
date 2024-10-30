import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Button, List, ListItem, ListItemButton, Stack, Typography, Pagination,
  useTheme, TextField, InputAdornment, IconButton, Autocomplete,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';

import { QuestionEditorForm } from '../components/QuestionEditorForm';
import { QuestionMeta } from '../components/QuestionMeta';
import { MuiDialog } from '../../../shared/components/MuiDialog';
import { LoaderSkeleton } from '../../../shared/components/LoaderSkeleton';
import { questionService } from '../services/questionService';
import { categoryService } from '../services/categoryService';
import { ICategory, ICategoryWithLevel, IQuestion, IQuestionFormData } from '../types';
import { trimAndNormalizeSpaces } from '../../../shared/utils/trimAndNormalizeSpaces';
import { highlightText } from '../../../shared/utils/highlightText';
import { addNestingLevelToCategories } from '../utils/addNestedLevelToCategories';
import { QUESTIONS_PER_PAGE } from '../consts';
import { APP_KEYS } from '../../../shared/consts';
import { blinkAnimation } from '../../../shared/styles/animations';

function QuestionList() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize pagination from searchParams
  const [pagination, setPagination] = useState(() => ({
    page: Number(searchParams.get('page')) || 1,
    perPage: Number(searchParams.get('perPage')) || QUESTIONS_PER_PAGE,
  }));

  // Initialize search and categoryId from searchParams
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [categoryId, setCategoryId] = useState(() => searchParams.get('categoryId') || '');

  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
  const [highlightedQuestionId, setHighlightedQuestionId] = useState<string | null>(null);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);

  const isFirstRender = useRef(true);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await questionService.getQuestions({
        page: pagination.page,
        limit: pagination.perPage,
        search,
        categoryId,
      });

      const { data, pageCount } = response;
      setQuestions(data);
      setTotalPages(pageCount);
    } catch (error) {
      console.error('There was an error fetching the questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesResponse = await categoryService.getCategories();

      setCategories(categoriesResponse);
    } catch (error) {
      console.error('There was an error fetching the categories:', error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    setSearch(newSearch);
    setPagination((prevState) => ({ ...prevState, page: 1 }));
  };

  const handleCategoryChange = (
    _event: React.SyntheticEvent<Element, Event>,
    category: ICategoryWithLevel | null,
  ) => {
    setCategoryId(category?.id.toString() || '');
    setPagination((prevState) => ({ ...prevState, page: 1 }));
  };

  const handleSearchClear = () => {
    setSearch('');
  };

  const clearAllFilters = () => {
    if (search !== '') handleSearchClear();
    if (categoryId !== '') setCategoryId('');
    if (pagination.page !== 1) setPagination((prevState) => ({ ...prevState, page: 1 }));
  };

  const isClearAllFiltersBntDisabled =
    search === '' &&
    categoryId === '' &&
    pagination.page === 1;

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPagination((prevState) => ({ ...prevState, page: value }));
  };

  const closeAddQuestionModal = () => {
    setIsAddQuestionModalOpen(false);
  };

  const handleQuestionItemClick = (questionId: number) => {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    sessionStorage.setItem('highlightedQuestionId', questionId.toString());
  };

  const addNewQuestion = async ({ title, content, category, tags }: IQuestionFormData) => {
    if (category === null) {
      console.error('You need to select category before submitting the question');
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
      clearAllFilters();
      fetchQuestions();
    } catch (error) {
      console.error('There was an error adding new question:', error);
    }
  };

  // Synchronize state to URL searchParams
  useEffect(() => {
    if (isFirstRender.current) {
      // Skip effect on first render to prevent unnecessary URL updates
      isFirstRender.current = false;
      return;
    }

    const newSearchParams = new URLSearchParams(searchParams.toString());

    newSearchParams.set('page', pagination.page.toString());
    newSearchParams.set('perPage', pagination.perPage.toString());

    if (search) {
      newSearchParams.set('search', search);
    } else {
      newSearchParams.delete('search');
    }

    if (categoryId) {
      newSearchParams.set('categoryId', categoryId);
    } else {
      newSearchParams.delete('categoryId');
    }

    // Update searchParams only if they have changed
    if (newSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(newSearchParams);
    }
  }, [pagination.page, pagination.perPage, search, categoryId]);

  // Synchronize URL searchParams to state when searchParams change
  useEffect(() => {
    const newPage = Number(searchParams.get('page')) || 1;
    const newPerPage = Number(searchParams.get('perPage')) || QUESTIONS_PER_PAGE;
    const newSearch = searchParams.get('search') || '';
    const newCategoryId = searchParams.get('categoryId') || '';

    setPagination((prevState) => {
      if (
        prevState.page !== newPage ||
        prevState.perPage !== newPerPage
      ) {
        return {
          page: newPage,
          perPage: newPerPage,
        };
      }
      return prevState;
    });

    if (search !== newSearch) {
      setSearch(newSearch);
    }

    if (categoryId !== newCategoryId) {
      setCategoryId(newCategoryId);
    }
  }, [searchParams.toString()]);

  useEffect(() => {
    fetchQuestions();
  }, [pagination, search, categoryId]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Restore scroll position and highlight previously selected question
  useEffect(() => {
    if (isLoading) {
      return () => {};
    }

    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    const savedQuestionId = sessionStorage.getItem('highlightedQuestionId');

    if (savedScrollPosition) {
      window.scrollTo({
        top: Number(savedScrollPosition),
        left: 0,
        behavior: 'smooth',
      });
      sessionStorage.removeItem('scrollPosition');
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    if (savedQuestionId) {
      setHighlightedQuestionId(savedQuestionId);
      sessionStorage.removeItem('highlightedQuestionId');

      // Remove the highlight after a delay
      timeoutId = setTimeout(() => {
        setHighlightedQuestionId(null);
      }, 2000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading]);

  const categoriesWithNestingLevel = addNestingLevelToCategories(categories);

  const selectedCategory = categoriesWithNestingLevel.find(
    (category) => category.id.toString() === categoryId
  ) || null;

  return (
    <>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px', mb: '40px' }}
      >
        <Button
          color="primary"
          variant="contained"
          onClick={() => setIsAddQuestionModalOpen(true)}
          sx={{ width: '300px', fontWeight: theme.typography.fontWeightBold }}
        >
          Add New Question
        </Button>

        <Button
          color="primary"
          variant="outlined"
          onClick={() => navigate(APP_KEYS.ROUTER_KEYS.QUESTION_SETTINGS_PAGE)}
          sx={{ width: '300px', fontWeight: theme.typography.fontWeightBold }}
        >
          Categories/Tags Settings
        </Button>
      </Box>

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
            defaultValues={{ title: '', content: '', category: null, tags: [], }}
          />
        </MuiDialog>
      )}

      <Stack sx={{ width: '100%', mb: '20px', gap: '20px' }}>
        <TextField
          inputRef={searchInputRef}
          fullWidth
          label="Search"
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (searchParams.get('search')) && (
              <InputAdornment position="end">
                <IconButton onClick={handleSearchClear}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Autocomplete
          value={selectedCategory}
          onChange={handleCategoryChange}
          disablePortal
          options={categoriesWithNestingLevel}
          sx={{ width: '50%' }}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Category"
            />
          )}
          renderOption={(props, option) => (
            <ListItem
              {...props}
              key={option.id}
              sx={{
                '&.MuiListItem-root': {
                  paddingLeft: option.level && option.level > 0 ? `${16 + (option.level * 22)}px` : '16px',
                },
              }}
            >
              {option.parent && <SubdirectoryArrowRightIcon fontSize="inherit" sx={{ mr: '4px' }} />}
              {option.name}
            </ListItem>
          )}
        />

        <Button
          color="primary"
          variant="outlined"
          onClick={clearAllFilters}
          disabled={isClearAllFiltersBntDisabled}
          sx={{ width: '200px', fontWeight: theme.typography.fontWeightBold }}
        >
          Clear all filters
        </Button>
      </Stack>

      {isLoading ? (
        Array.from({ length: QUESTIONS_PER_PAGE }).map((_, index) => (
          <LoaderSkeleton key={index} />
        ))
      ) : (
        <Box sx={{ border: '1px lightgray solid', borderRadius: '15px' }}>
          <List>
            {questions.map((question, index) => (
              <ListItem
                key={question.id}
                disablePadding
                sx={{ pl: 0, backgroundColor: index % 2 === 0 ? 'white' : 'grey.100', }}
              >
                <ListItemButton
                  component={RouterLink}
                  to={`/questions/${question.id}`}
                  onClick={() => handleQuestionItemClick(question.id)}
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
                  <Stack sx={{ width: '100%', }}>
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
      )}

      {/* Pagination Component */}
      {!!totalPages && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}>
          <Pagination
            disabled={isLoading}
            count={totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </>
  );
}

export default QuestionList;
