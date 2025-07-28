import { useState } from 'react';

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (term) => {
    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSearching(false);
    console.log('Searching for:', term);
  };

  return {
    searchTerm,
    setSearchTerm,
    isSearching,
    handleSearch
  };
};
