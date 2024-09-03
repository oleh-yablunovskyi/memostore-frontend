import React, { useState, useEffect } from 'react';
import {
  useTheme, Box, Button, IconButton, List, ListItem,
  ListItemButton, Typography, Tooltip,
} from '@mui/material';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import { CategoryEditorForm } from './CategoryEditorForm';
import { categoryService } from '../services/categoryService';
import { MuiDialog } from '../../../shared/components/MuiDialog';
import { MuiConfirmDialog } from '../../../shared/components/MuiConfirmationDialog';
import { trimAndNormalizeSpaces } from '../../../shared/utils/trimAndNormalizeSpaces';
import { addNestingLevelToCategories } from '../utils/addNestedLevelToCategories';
import { ICategory, ICategoryFormData } from '../types';

function CategoryList() {
  const theme = useTheme();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [isDeleteCategoryConfirmOpen, setIsDeleteCategoryConfirmOpen] = useState(false);

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

  const openAddCategoryModal = () => {
    setIsAddCategoryModalOpen(true);
  };

  const closeAddCategoryModal = () => {
    setIsAddCategoryModalOpen(false);
  };

  const openEditCategoryModal = (category: ICategory) => {
    setSelectedCategory(category);
    setIsEditCategoryModalOpen(true);
  };

  const closeEditCategoryModal = () => {
    setIsEditCategoryModalOpen(false);
    setSelectedCategory(null);
  };

  const openDeleteCategoryConfirm = (category: ICategory) => {
    setSelectedCategory(category);
    setIsDeleteCategoryConfirmOpen(true);
  };

  const closeDeleteCategoryConfirm = () => {
    setSelectedCategory(null);
    setIsDeleteCategoryConfirmOpen(false);
  };

  const addNewCategory = async ({ name, parentCategory }: ICategoryFormData) => {
    const payload = {
      name: trimAndNormalizeSpaces(name),
      parentId: parentCategory?.id || null,
    };

    try {
      await categoryService.createCategory(payload);
      closeAddCategoryModal();
      fetchCategories();
    } catch (error) {
      console.error('There was an error adding new category:', error);
    }
  };

  const editCategory = async ({ name, parentCategory }: ICategoryFormData) => {
    if (!selectedCategory) {
      return;
    }

    const payload = {
      name: trimAndNormalizeSpaces(name),
      parentId: parentCategory?.id || null,
    };

    try {
      await categoryService.updateCategory(selectedCategory.id.toString(), payload);
      closeEditCategoryModal();
      fetchCategories();
    } catch (error) {
      console.error(`There was an error updating category with id ${selectedCategory.id}:`, error);
    }
  };

  const deleteCategory = async () => {
    if (!selectedCategory) {
      return;
    }

    try {
      await categoryService.deleteCategory(selectedCategory.id.toString());
      closeDeleteCategoryConfirm();
      fetchCategories();
    } catch (error) {
      console.error(`There was an error deleting category with id ${selectedCategory.id}:`, error);
    }
  };

  const categoriesWithNestingLevel = addNestingLevelToCategories(categories);

  return (
    <Box>
      <Typography variant="h2">
        List of Categories
      </Typography>

      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: '20px', mb: '20px' }}
      >
        <Button
          color="primary"
          variant="contained"
          onClick={openAddCategoryModal}
          sx={{ width: '300px', fontWeight: theme.typography.fontWeightBold }}
        >
          Add New Category
        </Button>
      </Box>

      <Box sx={{ border: '1px lightgray solid', borderRadius: '15px', maxHeight: '600px', overflowY: 'scroll' }}>
        <List>
          {categoriesWithNestingLevel.map((category, index) => (
            <ListItemButton
              key={category.id}
              sx={{
                py: '12px',
                '&:hover': {
                  backgroundColor: 'grey.300',
                },
                '&:active': {
                  color: 'inherit',
                }
              }}
            >
              <ListItem
                disablePadding
                sx={{
                  pl: 0,
                  '&.MuiListItem-root': {
                    paddingLeft: category.level && category.level > 0 ? `${(category.level * 28)}px` : 0,
                  },
                }}
              >
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div" sx={{ mb: '4px', lineHeight: 1.3, fontWeight: 600, }}>
                    {category.parent && <SubdirectoryArrowRightIcon fontSize="inherit" sx={{ mr: '4px', color: 'grey.500' }} />}
                    {category.name}
                  </Typography>
                  <Box
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onMouseDown={(event) => event.stopPropagation()}
                  >
                    <IconButton
                      aria-label="update"
                      color="primary"
                      onClick={() => openEditCategoryModal(category)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'grey.400',
                        },
                      }}
                    >
                      <EditOutlinedIcon />
                    </IconButton>

                    {(category.children && category.children.length > 0) ? (
                      <Tooltip title="You cannot delete category that has children">
                        <span>
                          <IconButton
                            aria-label="delete"
                            color="primary"
                            disabled
                          >
                            <DeleteOutlineOutlinedIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    ) : (
                      <IconButton
                        aria-label="delete"
                        color="primary"
                        onClick={() => openDeleteCategoryConfirm(category)}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'grey.400',
                          },
                        }}
                      >
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </ListItem>
            </ListItemButton>
          ))}
        </List>
      </Box>

      {isAddCategoryModalOpen && (
        <MuiDialog
          open={isAddCategoryModalOpen}
          onClose={closeAddCategoryModal}
          maxWidth="sm"
          customStyles={{
            '& .MuiPaper-root .MuiDialogContent-root': {
              paddingTop: '6px',
            },
          }}
        >
          <CategoryEditorForm
            onSubmit={addNewCategory}
            onClose={closeAddCategoryModal}
            defaultValues={{ name: '', parentCategory: null, }}
          />
        </MuiDialog>
      )}

      {isEditCategoryModalOpen && (
        <MuiDialog
          open={isEditCategoryModalOpen}
          onClose={closeEditCategoryModal}
          maxWidth="sm"
          customStyles={{
            '& .MuiPaper-root .MuiDialogContent-root': {
              paddingTop: '6px',
            },
          }}
        >
          <CategoryEditorForm
            onSubmit={editCategory}
            onClose={closeEditCategoryModal}
            defaultValues={{ name: selectedCategory?.name || '', parentCategory: selectedCategory?.parent || null }}
          />
        </MuiDialog>
      )}

      {isDeleteCategoryConfirmOpen && (
        <MuiConfirmDialog
          open={isDeleteCategoryConfirmOpen}
          onClose={closeDeleteCategoryConfirm}
          onConfirm={deleteCategory}
          title="Confirm Delete"
          content="Are you sure you want to delete this category?"
          cancelButtonText="Cancel"
          confirmButtonText="Delete"
        />
      )}
    </Box>
  );
}

export { CategoryList };
