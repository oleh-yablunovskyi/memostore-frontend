import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme, Box, Button, Pagination, } from '@mui/material';

import { QuestionItemsList } from '../components/QuestionItemsList';
import { QuestionsFilterPanel } from '../components/QuestionsFilterPanel';
import { QuestionEditorForm } from '../components/QuestionEditorForm';
import { MuiDialog } from '../../../shared/components/MuiDialog';
import { questionService } from '../services/questionService';
import { IQuestion, IQuestionFilters, IQuestionFormData } from '../types';
import { trimAndNormalizeSpaces } from '../../../shared/utils/trimAndNormalizeSpaces';
import { debounce } from '../../../shared/utils/debounce';
import { QUESTIONS_PER_PAGE, DEFAULT_QUESTION_FILTERS_VALUES } from '../consts';
import { APP_KEYS } from '../../../shared/consts';

function QuestionList() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize pagination from searchParams
  const [pagination, setPagination] = useState(() => ({
    page: Number(searchParams.get('page')) || 1,
    perPage: Number(searchParams.get('perPage')) || QUESTIONS_PER_PAGE,
  }));

  // Initialize search query from searchParams
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get('search') || '');

  // Initialize filters from searchParams
  const [filters, setFilters] = useState<IQuestionFilters>(() => ({
    categoryId: searchParams.get('categoryId') || '',
  }));

  const [questions, setQuestions] = useState<IQuestion[]>([]);
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
        search: debouncedSearch,
        categoryId: filters.categoryId,
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

  const applySearch = (newSearch: string) => {
    setSearch(newSearch);
  };

  const applyFilters = (updatedFilters: Partial<typeof filters>) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...updatedFilters }));
    setPagination((prevState) => ({ ...prevState, page: 1 }));
  };

  const clearSearch = () => {
    setSearch('');
    setDebouncedSearch('');
  };

  const clearAllFilters = () => {
    if (search !== '') clearSearch();
    if (filters.categoryId !== '') applyFilters(DEFAULT_QUESTION_FILTERS_VALUES);
    if (pagination.page !== 1) setPagination((prevState) => ({ ...prevState, page: 1 }));
  };

  const isClearAllFiltersBtnDisabled =
    search === '' &&
    filters.categoryId === '' &&
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

    if (filters.categoryId) {
      newSearchParams.set('categoryId', filters.categoryId);
    } else {
      newSearchParams.delete('categoryId');
    }

    // Update searchParams only if they have changed
    if (newSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(newSearchParams);
    }
  }, [pagination.page, pagination.perPage, search, filters.categoryId]);

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

    if (filters.categoryId !== newCategoryId) {
      setFilters((prevFilters) => ({ ...prevFilters, categoryId: newCategoryId }));
    }
  }, [searchParams.toString()]);

  // Set the debouncedSearch on search input change
  useEffect(() => {
    if (!search) {
      setDebouncedSearch('');
      return () => {};
    }

    if (search === debouncedSearch) {
      return () => {};
    }

    const debouncedSetSearch = debounce((value) => {
      setDebouncedSearch(value);
      setPagination((prevState) => ({ ...prevState, page: 1 }));
    }, 300);

    debouncedSetSearch(search);

    // Clean up function to cancel debounced calls on unmount or before next call
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [search]);

  useEffect(() => {
    fetchQuestions();
  }, [pagination, debouncedSearch, filters.categoryId]);

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

      <QuestionsFilterPanel
        search={search}
        filters={filters}
        onSearchChange={applySearch}
        onFiltersChange={applyFilters}
        onAllFiltersClear={clearAllFilters}
        isClearAllFiltersBtnDisabled={isClearAllFiltersBtnDisabled}
      />

      <QuestionItemsList
        questions={questions}
        search={search}
        isLoading={isLoading}
        highlightedQuestionId={highlightedQuestionId}
        onQuestionItemClick={handleQuestionItemClick}
      />

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
