import React from 'react';
import './CVO.scss';

interface CVOProps {
  percentage: number; //phần trăm hoàn thành
}

const CVO: React.FC<CVOProps> = ({ percentage }) => {
  const progressStyle = {
    width: `${percentage}%`,
    backgroundColor: `hsl(${percentage}, 100%, 50%)`, 
  };

  return (
    <div className="cvo-progress">
      <div className="cvo-block-title-underline" style={progressStyle}></div>
    </div>
  );
};

export default CVO;
