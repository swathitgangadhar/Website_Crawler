import React from 'react';

type Props = {
  status: string;
};

const StatusBadge = ({ status }: Props) => {
  const color =
    status === 'done' ? 'bg-green-200 text-green-800' :
    status === 'error' ? 'bg-red-200 text-red-800' :
    'bg-yellow-100 text-yellow-800';

  return <span className={`px-2 py-1 text-xs rounded ${color}`}>{status}</span>;
};

export default StatusBadge;