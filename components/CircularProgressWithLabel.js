import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function CircularProgressWithLabel(props) {
  return (
    <Box sx={{transform: 'scale(800%)', position: 'relative', display: 'inline-flex', top: window.innerHeight/2}}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left:0,
          bottom: 0,
          right:0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',                     
        }}
      >
        <Typography variant="caption" component="div" color="#e0e0e0" fontSize={35}>
          {`${Math.round(props.value/33)}`}
        </Typography>
      </Box>
    </Box>
    
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number,
};
