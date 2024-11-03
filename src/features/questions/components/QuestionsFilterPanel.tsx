import React, { useRef, useEffect, useState } from 'react';
import {
  useTheme, Stack, TextField, InputAdornment, IconButton,
  Autocomplete, ListItem, Button,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';

import { addNestingLevelToCategories } from '../utils/addNestedLevelToCategories';
import { categoryService } from '../services/categoryService';
import { ICategory, ICategoryWithLevel, IQuestionFilters } from '../types';

interface Props {
  search: string;
  filters: IQuestionFilters;
  onSearchChange: (newSearch: string) => void;
  onFiltersChange: (updatedFilters: Partial<IQuestionFilters>) => void;
  onAllFiltersClear: () => void;
  isClearAllFiltersBtnDisabled: boolean;
}

export const QuestionsFilterPanel: React.FC<Props> = ({
  search,
  filters,
  onSearchChange,
  onFiltersChange,
  onAllFiltersClear,
  isClearAllFiltersBtnDisabled,
}) => {
  const theme = useTheme();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const categoriesWithNestingLevel = addNestingLevelToCategories(categories);

  const selectedCategory =
    categoriesWithNestingLevel.find((category) => category.id.toString() === filters.categoryId) || null;

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    onSearchChange(newSearch);
  };

  const handleCategoryChange = (
    _event: React.SyntheticEvent<Element, Event>,
    category: ICategoryWithLevel | null,
  ) => {
    const newCategoryId = category?.id.toString() || '';
    onFiltersChange({ categoryId: newCategoryId });
  };

  const clearSearch = () => {
    onSearchChange('');
  };

  const clearAllFilters = () => {
    onAllFiltersClear();
  };

  const fetchCategories = async () => {
    try {
      const categoriesResponse = await categoryService.getCategories();
      setCategories(categoriesResponse);
    } catch (error) {
      console.error('There was an error fetching the categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <Stack sx={{ width: '100%', mb: '20px', gap: '20px' }}>
      <TextField
        inputRef={searchInputRef}
        fullWidth
        label="Search"
        value={search}
        onChange={handleSearchChange}
        InputProps={{
          endAdornment: search && (
            <InputAdornment position="end">
              <IconButton onClick={clearSearch}>
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
        renderInput={(params) => <TextField {...params} label="Select Category" />}
        renderOption={(props, option) => (
          <ListItem
            {...props}
            key={option.id}
            sx={{
              '&.MuiListItem-root': {
                paddingLeft:
                  option.level && option.level > 0 ? `${16 + option.level * 22}px` : '16px',
              },
            }}
          >
            {option.parent && (
              <SubdirectoryArrowRightIcon fontSize="inherit" sx={{ mr: '4px' }} />
            )}
            {option.name}
          </ListItem>
        )}
      />

      <Button
        color="primary"
        variant="outlined"
        onClick={clearAllFilters}
        disabled={isClearAllFiltersBtnDisabled}
        sx={{ width: '200px', fontWeight: theme.typography.fontWeightBold }}
      >
        Clear all filters
      </Button>
    </Stack>
  );
};
