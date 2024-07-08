import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  DialogActions, DialogContent, Button,
  TextField, Autocomplete, Box, FormControl
} from '@mui/material';

import '@mdxeditor/editor/style.css';
import '../styles/MdxEditorAdditionalStyles.scss';
import {
  MDXEditor, headingsPlugin, listsPlugin, quotePlugin, linkPlugin,
  linkDialogPlugin, thematicBreakPlugin, codeBlockPlugin, codeMirrorPlugin,
  diffSourcePlugin, toolbarPlugin, DiffSourceToggleWrapper, UndoRedo,
  BoldItalicUnderlineToggles, ListsToggle, BlockTypeSelect, CodeToggle,
  CreateLink,
} from '@mdxeditor/editor';
import { githubDark } from '@ddietr/codemirror-themes/github-dark';

import { categoryService } from '../services/categoryService';
import { ICategory, IQuestionFormData } from '../types';

interface Props {
  onClose: () => void;
  onSubmit: (data: IQuestionFormData) => void;
  defaultValues: IQuestionFormData;
}

const QuestionEditorForm: React.FC<Props> = ({ onClose, onSubmit, defaultValues }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);

  const { control, handleSubmit, reset } = useForm({
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

  return (
    <>
      <DialogContent dividers>
        <Box
          component="form"
          id="update-question-form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: '20px', mb: '40px' }}
        >
          <FormControl variant="outlined">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Title"
                  fullWidth
                  required
                  sx={{
                    marginTop: '30px',
                  }}
                />
              )}
            />
          </FormControl>

          <FormControl variant="outlined">
            <Controller
              name="category"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  value={field.value}
                  onChange={(event, newValue) => field.onChange(newValue)}
                  disablePortal
                  options={categories}
                  sx={{ width: '50%' }}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => <TextField {...params} label="Select Category" required />}
                />
              )}
            />
          </FormControl>

          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <MDXEditor
                className="dark-editor"
                markdown={field.value}
                onChange={field.onChange}
                onError={(error) => console.error('MDXEditor error:', error)}
                plugins={[
                  headingsPlugin(),
                  listsPlugin(),
                  quotePlugin(),
                  linkPlugin(),
                  linkDialogPlugin(),
                  thematicBreakPlugin(),
                  codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
                  codeMirrorPlugin({
                    codeBlockLanguages: {
                      js: 'JavaScript',
                      javascript: 'JavaScript',
                      typescript: 'TypeScript',
                      css: 'CSS',
                      html: 'HTML',
                      sh: 'SH',
                      json: 'JSON',
                      text: 'TEXT',
                      '': 'TEXT',
                    },
                    codeMirrorExtensions: [githubDark],
                  }),
                  diffSourcePlugin({ diffMarkdown: defaultValues.content, viewMode: 'rich-text' }),
                  toolbarPlugin({
                    toolbarContents: () => (
                      <DiffSourceToggleWrapper>
                        {' '}
                        <UndoRedo />
                        <BoldItalicUnderlineToggles />
                        <ListsToggle />
                        <BlockTypeSelect />
                        <CodeToggle />
                        <CreateLink />
                      </DiffSourceToggleWrapper>
                    )
                  })
                ]}
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button type="submit" form="update-question-form" color="primary">
          Update
        </Button>
      </DialogActions>
    </>
  );
};

export { QuestionEditorForm };
