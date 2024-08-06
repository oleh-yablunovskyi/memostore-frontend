import React, { useState } from 'react';
import { Box, Typography, Chip, Popover, useTheme, } from '@mui/material';
import { ITag } from '../types';
import { MAX_VISIBLE_TAGS } from '../consts';

interface Props {
  createdDate: string;
  categoryName: string;
  tags: ITag[];
}

const QuestionMeta: React.FC<Props> = ({ createdDate, categoryName, tags }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTags = tags.slice(MAX_VISIBLE_TAGS);

  const openPopover = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);

  const transformedCreatedDate = new Date(createdDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px', }}>
      <Typography sx={{ minWidth: '82px', fontSize: '1rem', lineHeight: 1.5, color: theme.palette.text.secondary }}>
        {transformedCreatedDate}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Chip
          color="primary"
          size="small"
          clickable
          label={categoryName}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onMouseDown={(event) => event.stopPropagation()}
        />

        {visibleTags.map((tag) => (
          <Chip
            key={tag.id}
            variant="outlined"
            color="primary"
            size="small"
            clickable
            label={tag.name}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onMouseDown={(event) => event.stopPropagation()}
          />
        ))}

        {hiddenTags.length > 0 && (
          <>
            <Chip
              clickable
              label={`+${hiddenTags.length} more`}
              onClick={openPopover}
              onMouseDown={(event) => event.stopPropagation()}
            />

            <Popover
              open={isPopoverOpen}
              anchorEl={anchorEl}
              onClick={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
              onClose={closePopover}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              disableRestoreFocus
            >
              <Box sx={{ p: 1 }}>
                {hiddenTags.map((tag) => (
                  <Chip
                    key={tag.id}
                    variant="outlined"
                    color="primary"
                    size="small"
                    clickable
                    label={tag.name}
                    sx={{ m: '2px' }}
                  />
                ))}
              </Box>
            </Popover>
          </>
        )}
      </Box>
    </Box>
  );
};

export { QuestionMeta };
