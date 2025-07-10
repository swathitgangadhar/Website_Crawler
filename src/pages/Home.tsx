import  { useState } from 'react';
import { deleteURLs, getURLs, submitURL } from '../api';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Form } from 'react-bootstrap';

function Home() {
  const [urlInput, setUrlInput] = useState('');
  const [urls, setUrls] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState('');
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
  

  const handleDelete = async () => {
    if (selected.length > 0) {
      await deleteURLs(selected);
      setSelected([]);
      await loadUrls();
    }
  };

  const filteredUrls = urls.filter((url) =>
    url.title.toLowerCase().includes(search.toLowerCase())
  );

 
  return (  
<div
  className="bg-primary text-white rounded shadow-lg mt-4 p-4"
  style={{ backgroundColor: '#335eff', height: '100%', width: '100%' }}
>
  <div  className="d-flex justify-content-center align-items-center vh-100 ">
      <div className="mb-4 flex gap-8 items-center justify-between">
        <h1 className="text-2xl font-bold">Website Management</h1>
        <Form.Control
          className='mb-3'
          style={{ width: '300px' }}
          type="text"
          id="enterUrl"
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter URL"
          value={urlInput}
        />
          <Button
            className='mb-3'
            onClick={handleSubmit}
            variant='light'
            size='lg'
          >
          Submit
          </Button>
        </div>

      </div>
      {loading ? (
        <p>Loading...</p>
      ) : ( filteredUrls.length !== 0 ? (
        <div className="overflow-x-auto">
          <Form.Control
          type="text"
          placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      /> 
      <Button
            onClick={handleDelete}
            variant='primary'
           disabled={selected.length === 0}
          >
            Delete Selected
          </Button>
          <Table striped bordered hover>            
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Select</th>
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
              {filteredUrls.map((url) => (
                <tr key={url.id} className="text-center border-t">
                  <td className="p-2 border">
                    <input
                      type="checkbox"
                      checked={selected.includes(url.id)}
                      onChange={() =>
                        setSelected((prev) =>
                          prev.includes(url.id)
                            ? prev.filter((id) => id !== url.id)
                            : [...prev, url.id]
                        )
                      }
                    />
                  </td>
                  <td className="p-2 border">{url.title}</td>
                  <td className="p-2 border">{url.html_version}</td>
                  <td className="p-2 border">{url.h1_count}</td>
                  <td className="p-2 border">{url.internal_links}</td>
                  <td className="p-2 border">{url.external_links}</td>
                  <td className="p-2 border">{url.broken_links}</td>
                  <td className="p-2 border">{url.has_login_form ? 'Yes' : 'No'}</td>
                  <td className="p-2 border">{url.status}</td>
                  <td className="p-2 border">
                    <button
                      className="text-blue-600 underline"
                      onClick={() => navigate(`/detail/${url.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          No URLs found.
        </div>)
      )}
    </div>
  );
}

export default Home;