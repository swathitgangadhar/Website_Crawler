import React from 'react';

type Props = {
  search: string;
  setSearch: (val: string) => void;
};

const SearchBar = ({ search, setSearch }: Props) => (
  <input
    type="text"
    placeholder="Search by title"
    className="border p-2 mb-4 w-full"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
);

export default SearchBar;