import React, { useState } from 'react';
import { getURLs, submitURL } from '../api';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [urlInput, setUrlInput] = useState('');
  const [urls, setUrls] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadUrls = async () => {
    setLoading(true);
    const res = await getURLs();
    console.log("url",res);

    setUrls(res || []);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!urlInput) return;
    console.log("res");
    
    await submitURL(urlInput);
    await loadUrls();
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter URL"
          className="border p-2 flex-1"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Title</th>
                <th className="p-2 border">HTML Version</th>
                <th className="p-2 border">H1</th>
                <th className="p-2 border">Internal</th>
                <th className="p-2 border">External</th>
                <th className="p-2 border">Broken</th>
                <th className="p-2 border">Login Form</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((u) => (
                <tr key={u.id} className="text-center border-t">
                  <td className="p-2 border">{u.title}</td>
                  <td className="p-2 border">{u.html_version}</td>
                  <td className="p-2 border">{u.h1_count}</td>
                  <td className="p-2 border">{u.internal_links}</td>
                  <td className="p-2 border">{u.external_links}</td>
                  <td className="p-2 border">{u.broken_links}</td>
                  <td className="p-2 border">{u.has_login_form ? 'Yes' : 'No'}</td>
                  <td className="p-2 border">{u.status}</td>
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
      )}
    </div>
  );
}

export default Home;