import  { useEffect, useState } from 'react';
import { deleteURLs, getURLs, submitURL } from '../api';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';


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

  useEffect(()=> {
    loadUrls();
  }, []);


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
    <div className="text-white rounded shadow-lg">
      <div  className="mx-2 rounded-3 shadow my-5 py-2 d-flex" style={{textAlign:'center'}}>
        <h1 className="text-2xl font-bold">Website Management</h1>
        <Form >
        <Form.Control
          className='mb-3'
          style={{ width: '300px', height: '30px',marginBottom: '10px' }}
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
          <Table striped bordered hover  className="container mt-4 table-striped table-hover">            
            <thead>
              <tr>
                <th >Select</th>
                <th >Title</th>
                <th>HTML Version</th>
                <th>H1</th>
                <th>Internal</th>
                <th>External</th>
                <th>Broken</th>
                <th>Login Form</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUrls.map((url) => (
                <tr key={url.id} className="text-center border-t">
                  <td>
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
                  <td>{url.title}</td>
                  <td>{url.html_version}</td>
                  <td>{url.h1_count}</td>
                  <td>{url.internal_links}</td>
                  <td>{url.external_links}</td>
                  <td>{url.broken_links}</td>
                  <td>{url.has_login_form ? 'Yes' : 'No'}</td>
                  <td>{url.status}</td>
                  <td>
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