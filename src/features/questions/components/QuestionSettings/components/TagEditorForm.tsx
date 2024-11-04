import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  DialogActions, DialogContent, Button,
  TextField, Box, FormControl, DialogTitle,
} from '@mui/material';

import { ITagFormData } from '../../../types';
import { TAG_NAME_CHARS_LIMIT } from '../../../consts';

interface Props {
  onClose: () => void;
  onSubmit: (data: ITagFormData) => void;
  defaultValues: ITagFormData;
}

const TagEditorForm: React.FC<Props> = ({ onClose, onSubmit, defaultValues }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    mode: 'onChange', // Validate on change
    defaultValues,
  });

  const onCancelButtonClick = () => {
    reset();
    onClose();
  };

  return (
    <>
      <DialogTitle>Add Tag</DialogTitle>

      <DialogContent>
        <Box
          component="form"
          id="add-new-tag-form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FormControl variant="outlined">
              <Controller
                name="name"
                control={control}
                rules={{
                  required: 'Name is required',
                  maxLength: {
                    value: TAG_NAME_CHARS_LIMIT,
                    message: `Name cannot exceed ${TAG_NAME_CHARS_LIMIT} characters`
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
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancelButtonClick} color="primary">
          Cancel
        </Button>
        <Button
          type="submit"
          form="add-new-tag-form"
          color="primary"
        >
          {`${defaultValues.name ? 'Update' : 'Add'} Tag`}
        </Button>
      </DialogActions>
    </>
  );
};

export { TagEditorForm };
