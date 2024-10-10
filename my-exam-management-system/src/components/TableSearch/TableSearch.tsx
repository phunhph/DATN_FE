import React from 'react';

interface TableSearchProps {
  onSearch: (query: string) => void;
}

export const TableSearch: React.FC<TableSearchProps> = ({ onSearch }) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className="table-search">
      <input
        type="text"
        placeholder="Search..."
        onChange={handleSearchChange}
        className="search-input"
      />
    </div>
  );
};
