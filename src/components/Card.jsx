
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Card = ({ children, to, className = '', onClick, ...props }) => {
  const cardClasses = `
    bg-white rounded-xl shadow-lg p-6 
    transition-all duration-300 
    hover:shadow-2xl hover:scale-105
    ${className}
  `;

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );

  if (to) {
    return (
      <Link to={to} className="block no-underline">
        {content}
      </Link>
    );
  }

  return content;
};

export default Card;
