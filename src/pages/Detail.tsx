import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { getURLDetail } from '../api';

const Detail = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      getURLDetail(id).then(setData);
    }
  }, [id]);

  if (!data) return <div>Loading...</div>;

  const chartData = {
    labels: ['Internal Links', 'External Links'],
    datasets: [
      {
        data: [data.internal_links, data.external_links],
        backgroundColor: ['#60a5fa', '#f87171'],
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Details for {data.url}</h1>
      <div className="mb-4">
        <Pie data={chartData} />
      </div>
      <ul className="mb-4 list-disc pl-6">
        <li><strong>HTML Version:</strong> {data.html_version}</li>
        <li><strong>Title:</strong> {data.title}</li>
        <li><strong>Login Form:</strong> {data.has_login_form ? 'Yes' : 'No'}</li>
        <li><strong>Broken Links:</strong> {data.broken_links}</li>
      </ul>
      <div>
        <h2 className="text-lg font-semibold mb-2">Broken Links</h2>
        <ul className="list-disc pl-6">
          {data.broken_link_details?.map((link: any, idx: number) => (
            <li key={idx}>{link.url} - {link.status}</li>
          )) || <li>None</li>}
        </ul>
      </div>
    </div>
  );
};

export default Detail;
