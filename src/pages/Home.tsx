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
  className=" bg-primary text-white rounded shadow-lg mt-4 p-4"
  style={{ backgroundColor: '#339fff'}}
>
  <div  className="mx-2 rounded-3 shadow my-5 py-2  brand-tertiary-color d-flex" style={{textAlign:'center'}}>
        <h1 className="text-2xl font-bold">Website Management</h1>
        <Form >
        <Form.Control
          className='mb-3'
          style={{ width: '300px', height: '30px' }}
          type="text"
          id="enterUrl"
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter URL"
          value={urlInput}
        />
          <Button
            className='mb-3'   
            onClick={handleSubmit}
            style={{ width: '100px', height: '30px', marginLeft: '10px', backgroundColor: "white"}}
            variant='light'
            size='lg'
          >
          Submit
          </Button>
        </Form>

      </div>
      {loading ? (
        <p>Loading...</p>
      ) : ( filteredUrls.length !== 0 ? (
        <div className="overflow-x-auto" style={{textAlign:'center'}}>
          <Form.Control
          style={{ width: '300px', height: '30px', marginBottom: '10px' ,marginTop: '10px' }}
          type="text"
          placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      /> 
      {selected.length !== 0 && (
        <Button
          onClick={handleDelete}
          variant='primary'
          style={{ width: '100px', height: '30px', marginLeft: '10px', backgroundColor: "white"                              
          }}
          >          
           Delete 
        </Button>
      )}
          <Table striped bordered hover  className="container mt-4" >            
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
        <div  className="mx-2 rounded-3 shadow my-5 py-2 current-weather-assets brand-tertiary-color d-flex " style={{textAlign:'center'}}>
          No URLs found.
        </div>)
      )}
    </div>
  );
}

export default Home;