import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { ITag } from '../types';

interface Props {
  categoryName: string;
  tags: ITag[];
}

const CategoryAndTagsChips: React.FC<Props> = ({ categoryName, tags }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '36px' }}>
      <Box sx={{ display: 'flex', gap: '10px', }}>
        <Typography sx={{ fontWeight: 700 }}>Category:</Typography>
        <Chip
          color="primary"
          label={categoryName}
          onClick={() => {}}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: '10px', }}>
        <Typography sx={{ fontWeight: 700 }}>Tags:</Typography>
        {tags.length > 0 ? (tags.map((tag) => (
          <Chip
            key={tag.id}
            variant="outlined"
            color="primary"
            label={tag.name}
            onClick={() => {}}
          />
        ))) : (
          <Typography>No Tags</Typography>
        )}
      </Box>
    </Box>
  );
};

export { CategoryAndTagsChips };
