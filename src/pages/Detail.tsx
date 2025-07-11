import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getURLDetail } from '../api';
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const Detail = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      getURLDetail(id).then(setData);
    }
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Details for: {data.title}</h2>

      <div className="mb-6" >
        <Bar
          data={{
            labels: ['Internal Links', 'External Links'],
            datasets: [
              {
                label: 'Links',
                data: [data.internal_links, data.external_links],
                backgroundColor: ['#4ade80', '#60a5fa']
              }
            ]
          }}
          height={100}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top'
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
        />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium">Broken Links</h3>
        <ul className="list-disc list-inside">
          {data.broken_links_list?.length > 0 ? (
            data.broken_links_list.map((link: any, idx: number) => (
              <li key={idx}>
                <span className="font-medium">{link.url}</span> — Status: {link.status}
              </li>
            ))
          ) : (
            <li>No broken links found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Detail;