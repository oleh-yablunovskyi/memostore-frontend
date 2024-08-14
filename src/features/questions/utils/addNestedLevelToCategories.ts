import { ICategory, ICategoryWithLevel } from '../types';

export const addNestingLevelToCategories = (categories: ICategory[]): ICategoryWithLevel[] => {
  const categoriesWithLevel: ICategoryWithLevel[] = [];

  const addLevel = (category: ICategory, level = 0): void => {
    const categoryWithLevel: ICategoryWithLevel = { ...category, level };
    categoriesWithLevel.push(categoryWithLevel);

    const childCategories = categories.filter((cat) => cat.parent?.id === category.id);
    childCategories.forEach((child) => addLevel(child, level + 1));
  };

  categories.forEach((category) => {
    if (!category.parent) {
      addLevel(category);
    }
  });

  return categoriesWithLevel;
};
