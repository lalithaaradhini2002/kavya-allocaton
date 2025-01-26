import React from 'react';

export const Card = ({ children, className, ...props }) => (
  <div className={`p-4 bg-white rounded-lg shadow-md ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={`p-2 ${className}`} {...props}>
    {children}
  </div>
);
