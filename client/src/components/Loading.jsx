import React from 'react';

/**
 * Loading component with different animation styles
 * @param {Object} props
 * @param {string} props.type - The type of loading animation ('spinner', 'pulse', or 'dots')
 * @param {string} props.message - Optional message to display
 * @param {string} props.size - Size of the loader ('small', 'medium', 'large')
 */
const Loading = ({ type = 'spinner', message, size = 'medium' }) => {
  // Map size to pixel values
  const sizeMap = {
    small: {
      container: '16px',
      spinner: '16px',
      pulse: '16px'
    },
    medium: {
      container: '30px',
      spinner: '30px',
      pulse: '30px'
    },
    large: {
      container: '60px',
      spinner: '60px',
      pulse: '50px'
    }
  };

  const dimensions = sizeMap[size] || sizeMap.medium;

  const renderLoader = () => {
    switch (type) {
      case 'pulse':
        return <div className="loading-pulse" style={{ 
          width: dimensions.pulse, 
          height: dimensions.pulse 
        }}></div>;
      
      case 'dots':
        return <div className="spinner-dots" style={{ 
          width: dimensions.container,
          height: dimensions.container 
        }}></div>;
      
      case 'spinner':
      default:
        return <div className="loading-spinner" style={{ 
          width: dimensions.spinner, 
          height: dimensions.spinner 
        }}></div>;
    }
  };

  return (
    <div className="loading-container" style={{ textAlign: 'center' }}>
      {renderLoader()}
      {message && <p className="loading-message" style={{ 
        marginTop: '10px',
        fontSize: size === 'small' ? '0.8rem' : size === 'large' ? '1.1rem' : '0.95rem'
      }}>{message}</p>}
    </div>
  );
};

export default Loading; 