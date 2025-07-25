import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  DialogActions, DialogContent, Button,
  TextField, Autocomplete, Box, FormControl,
  Checkbox, Typography, ListItem,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';

import '@mdxeditor/editor/style.css';
import './styles/MdxEditorAdditionalStyles.scss';
import {
  MDXEditor, headingsPlugin, listsPlugin, quotePlugin, linkPlugin,
  linkDialogPlugin, thematicBreakPlugin, codeBlockPlugin, codeMirrorPlugin,
  diffSourcePlugin, toolbarPlugin, DiffSourceToggleWrapper, UndoRedo,
  BoldItalicUnderlineToggles, ListsToggle, BlockTypeSelect, CodeToggle,
  CreateLink, CodeMirrorEditor,
} from '@mdxeditor/editor';
import { githubDark } from '@ddietr/codemirror-themes/github-dark';

import { categoryService } from '../../services/categoryService';
import { tagService } from '../../services/tagService';
import { addNestingLevelToCategories } from '../../utils/addNestedLevelToCategories';
import { ICategory, ITag, IQuestionFormData } from '../../types';
import { CONTENT_CHARS_LIMIT, TITLE_CHARS_LIMIT } from '../../consts';

interface Props {
  onClose: () => void;
  onSubmit: (data: IQuestionFormData) => void;
  defaultValues: IQuestionFormData;
  submitBntText?: string;
  cancelBntText?: string;
}

const QuestionEditorForm: React.FC<Props> = ({
  onClose,
  onSubmit,
  defaultValues,
  submitBntText = 'Ok',
  cancelBntText = 'Cancel',
}) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [tags, setTags] = useState<ITag[]>([]);

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

  const fetchTags = async () => {
    try {
      const tagsResponse = await tagService.getTags();

      setTags(tagsResponse);
    } catch (error) {
      console.error('There was an error fetching the tags:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const categoriesWithNestingLevel = addNestingLevelToCategories(categories);

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
              rules={{
                required: 'Title is required',
                maxLength: {
                  value: TITLE_CHARS_LIMIT,
                  message: `Title cannot exceed ${TITLE_CHARS_LIMIT} characters`
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title ? errors.title.message : ''}
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
              rules={{
                required: 'Category is required',
              }}
              defaultValue={null}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  value={field.value}
                  onChange={(event, newValue) => field.onChange(newValue)}
                  disablePortal
                  options={categoriesWithNestingLevel}
                  sx={{ width: '50%' }}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Category"
                      error={!!errors.category}
                      helperText={errors.category ? errors.category.message : ''}
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

          <FormControl variant="outlined">
            <Controller
              name="tags"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  multiple
                  value={field.value}
                  onChange={(event, newValue) => field.onChange(newValue)}
                  options={tags}
                  disableCloseOnSelect
                  disablePortal
                  ChipProps={{ variant: 'outlined', color: 'primary' }}
                  sx={{ width: '50%' }}
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option, { selected }) => {
                    return (
                      <ListItem {...props} key={option.id}>
                        <Checkbox
                          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                          checkedIcon={<CheckBoxIcon fontSize="small" />}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.name}
                      </ListItem>
                    );
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => <TextField {...params} label="Select Tags" placeholder="Choose Tags" />}
                />
              )}
            />
          </FormControl>

          <Controller
            name="content"
            control={control}
            rules={{
              maxLength: {
                value: CONTENT_CHARS_LIMIT,
                message: `Content cannot exceed ${CONTENT_CHARS_LIMIT} characters`
              }
            }}
            render={({ field }) => (
              <MDXEditor
                className="dark-editor"
                markdown={field.value}
                onChange={(markdown) => field.onChange(markdown)}
                onError={(error) => console.error('MDXEditor error:', error)}
                plugins={[
                  headingsPlugin(),
                  listsPlugin(),
                  quotePlugin(),
                  linkPlugin(),
                  linkDialogPlugin(),
                  thematicBreakPlugin(),
                  codeBlockPlugin({
                    defaultCodeBlockLanguage: 'js',
                    codeBlockEditorDescriptors: [
                      {
                        priority: -10,
                        match: () => true, // catch the unknown languages to prevent editor crash
                        Editor: CodeMirrorEditor
                      }
                    ]
                  }),
                  codeMirrorPlugin({
                    codeBlockLanguages: {},
                    autoLoadLanguageSupport: true,
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

      {errors.content && (
        <Typography sx={{ color: 'error.main', fontSize: '0.85rem', p: '10px 36px' }}>
          {errors.content.message}
        </Typography>
      )}

      <DialogActions>
        <Button onClick={onClose} color="primary">
          {cancelBntText}
        </Button>
        <Button type="submit" form="update-question-form" color="primary">
          {submitBntText}
        </Button>
      </DialogActions>
    </>
  );
};

export { QuestionEditorForm };
