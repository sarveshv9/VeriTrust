import { useState } from 'react';

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (term) => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      console.log('Searching for:', term);
    }, 1000);
  };

  return { searchTerm, setSearchTerm, isSearching, handleSearch };
};