import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  DialogActions, DialogContent, Button,
  TextField, Autocomplete, Box, FormControl,
  ListItem, DialogTitle,
} from '@mui/material';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';

import { categoryService } from '../../../services/categoryService';
import { addNestingLevelToCategories } from '../../../utils/addNestedLevelToCategories';
import { ICategory, ICategoryFormData } from '../../../types';
import { CATEGORY_NAME_CHARS_LIMIT } from '../../../consts';

interface Props {
  onClose: () => void;
  onSubmit: (data: ICategoryFormData) => void;
  defaultValues: ICategoryFormData;
}

const CategoryEditorForm: React.FC<Props> = ({ onClose, onSubmit, defaultValues }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);

  const categoriesWithNestingLevel = addNestingLevelToCategories(categories);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    mode: 'onChange', // Validate on change
    defaultValues,
  });

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

  const onCancelButtonClick = () => {
    reset();
    onClose();
  };

  return (
    <>
      <DialogTitle>Add Category</DialogTitle>

      <DialogContent>
        <Box
          component="form"
          id="add-new-category-form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FormControl variant="outlined">
              <Controller
                name="name"
                control={control}
                rules={{
                  required: 'Title is required',
                  maxLength: {
                    value: CATEGORY_NAME_CHARS_LIMIT,
                    message: `Title cannot exceed ${CATEGORY_NAME_CHARS_LIMIT} characters`
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    label="Title"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                    sx={{ m: 0 }}
                  />
                )}
              />
            </FormControl>

            <FormControl variant="outlined" sx={{ width: '50%' }}>
              <Controller
                name="parentCategory"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    value={field.value}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={categoriesWithNestingLevel}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Parent Category"
                        error={!!errors.parentCategory}
                        helperText={errors.parentCategory ? errors.parentCategory.message : ''}
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
                )}
              />
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancelButtonClick} color="primary">
          Cancel
        </Button>
        <Button
          type="submit"
          form="add-new-category-form"
          color="primary"
        >
          {`${defaultValues.name ? 'Update' : 'Add'} Category`}
        </Button>
      </DialogActions>
    </>
  );
};

export { CategoryEditorForm };
