import React, { useState, useEffect } from 'react';
import {
  useTheme, Box, Button, IconButton, Typography, Chip,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import { TagEditorForm } from './TagEditorForm';
import { Loader } from '../../../../../shared/components/Loader';
import { tagService } from '../../../services/tagService';
import { MuiDialog } from '../../../../../shared/components/MuiDialog';
import { MuiConfirmDialog } from '../../../../../shared/components/MuiConfirmationDialog';
import { trimAndNormalizeSpaces } from '../../../../../shared/utils/trimAndNormalizeSpaces';
import { ITag, ITagFormData } from '../../../types';

function TagList() {
  const theme = useTheme();

  const [tags, setTags] = useState<ITag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);
  const [isEditTagModalOpen, setIsEditTagModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<ITag | null>(null);
  const [isDeleteTagConfirmOpen, setIsDeleteTagConfirmOpen] = useState(false);

  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const tagsResponse = await tagService.getTags();

      setTags(tagsResponse);
    } catch (error) {
      console.error('There was an error fetching the tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const openAddTagModal = () => {
    setIsAddTagModalOpen(true);
  };

  const closeAddTagModal = () => {
    setIsAddTagModalOpen(false);
  };

  const openEditTagModal = (tag: ITag) => {
    setSelectedTag(tag);
    setIsEditTagModalOpen(true);
  };

  const closeEditTagModal = () => {
    setIsEditTagModalOpen(false);
    setSelectedTag(null);
  };

  const openDeleteTagConfirm = (tag: ITag) => {
    setSelectedTag(tag);
    setIsDeleteTagConfirmOpen(true);
  };

  const closeDeleteTagConfirm = () => {
    setSelectedTag(null);
    setIsDeleteTagConfirmOpen(false);
  };

  const addTag = async ({ name }: ITagFormData) => {
    const payload = {
      name: trimAndNormalizeSpaces(name),
    };

    try {
      await tagService.createTag(payload);
      closeAddTagModal();
      fetchTags();
    } catch (error) {
      console.error('There was an error adding new tag:', error);
    }
  };

  const editTag = async ({ name }: ITagFormData) => {
    if (!selectedTag) {
      return;
    }

    const payload = {
      name: trimAndNormalizeSpaces(name),
    };

    try {
      await tagService.updateTag(selectedTag.id.toString(), payload);
      closeEditTagModal();
      fetchTags();
    } catch (error) {
      console.error(`There was an error updating tag with id ${selectedTag.id}:`, error);
    }
  };

  const deleteTag = async () => {
    if (!selectedTag) {
      return;
    }

    try {
      await tagService.deleteTag(selectedTag.id.toString());
      closeDeleteTagConfirm();
      fetchTags();
    } catch (error) {
      console.error(`There was an error deleting tag with id ${selectedTag.id}:`, error);
    }
  };

  return (
    <Box>
      <Typography variant="h2">
        List of Tags
      </Typography>

      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: '20px', mb: '20px' }}
      >
        <Button
          color="primary"
          variant="contained"
          onClick={openAddTagModal}
          sx={{ width: '300px', fontWeight: theme.typography.fontWeightBold }}
        >
          Add New Tag
        </Button>
      </Box>

      {isLoading ? (
        <Loader />
      ) : (
        <Box sx={{ p: '16px', border: '1px lightgray solid', borderRadius: '15px', maxHeight: '600px', overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            {tags.map((tag, index) => (
              <Chip
                key={tag.id}
                variant="outlined"
                color="primary"
                label={(
                  <Box display="flex" alignItems="center">
                    {tag.name}
                    <Box sx={{ display: 'flex', ml: '16px' }}>
                      <IconButton
                        aria-label="edit-tag"
                        color="primary"
                        onClick={() => openEditTagModal(tag)}
                        sx={{
                          p: 0,
                          '&:hover': {
                            color: 'grey.700',
                          },
                        }}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete-tag"
                        color="primary"
                        onClick={() => openDeleteTagConfirm(tag)}
                        sx={{
                          p: 0,
                          '&:hover': {
                            color: 'grey.700',
                          },
                        }}
                      >
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    </Box>
                  </Box>
              )}
              />
            ))}
          </Box>
        </Box>
      )}

      {isAddTagModalOpen && (
        <MuiDialog
          open={isAddTagModalOpen}
          onClose={closeAddTagModal}
          maxWidth="sm"
          customStyles={{
            '& .MuiPaper-root .MuiDialogContent-root': {
              paddingTop: '6px',
            },
          }}
        >
          <TagEditorForm
            onSubmit={addTag}
            onClose={closeAddTagModal}
            defaultValues={{ name: '' }}
          />
        </MuiDialog>
      )}

      {isEditTagModalOpen && (
        <MuiDialog
          open={isEditTagModalOpen}
          onClose={closeEditTagModal}
          maxWidth="sm"
          customStyles={{
            '& .MuiPaper-root .MuiDialogContent-root': {
              paddingTop: '6px',
            },
          }}
        >
          <TagEditorForm
            onSubmit={editTag}
            onClose={closeEditTagModal}
            defaultValues={{ name: selectedTag?.name || '' }}
          />
        </MuiDialog>
      )}

      {isDeleteTagConfirmOpen && (
        <MuiConfirmDialog
          open={isDeleteTagConfirmOpen}
          onClose={closeDeleteTagConfirm}
          onConfirm={deleteTag}
          title="Confirm Delete"
          content="Are you sure you want to delete this tag?"
          cancelButtonText="Cancel"
          confirmButtonText="Delete"
        />
      )}
    </Box>
  );
}

export { TagList };
