import { keyframes } from '@mui/material/styles';

export const blinkAnimation = keyframes`
  0% {
    background-color: rgba(255, 255, 0, 0.5);
  }
  100% { 
    background-color: inherit;
  }
`;
