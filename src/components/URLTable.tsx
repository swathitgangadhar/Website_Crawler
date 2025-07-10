import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';

interface Props {
  urls: any[];
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
}

const URLTable = ({ urls, selected, setSelected }: Props) => {
  const navigate = useNavigate();

  const toggleSelect = (id: number) => {
    setSelected((prev: number[]) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Select</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">HTML Version</th>
            <th className="p-2 border">H1</th>
            <th className="p-2 border">Internal</th>
            <th className="p-2 border">External</th>
            <th className="p-2 border">Broken</th>
            <th className="p-2 border">Login</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((u) => (
            <tr key={u.id} className="text-center border-t">
              <td className="p-2 border">
                <input
                  type="checkbox"
                  checked={selected.includes(u.id)}
                  onChange={() => toggleSelect(u.id)}
                />
              </td>
              <td className="p-2 border">{u.title}</td>
              <td className="p-2 border">{u.html_version}</td>
              <td className="p-2 border">{u.h1_count}</td>
              <td className="p-2 border">{u.internal_links}</td>
              <td className="p-2 border">{u.external_links}</td>
              <td className="p-2 border">{u.broken_links}</td>
              <td className="p-2 border">{u.has_login_form ? 'Yes' : 'No'}</td>
              <td className="p-2 border">
                <StatusBadge status={u.status} />
              </td>
              <td className="p-2 border">
                <button
                  className="text-blue-600 underline"
                  onClick={() => navigate(`/detail/${u.id}`)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default URLTable;