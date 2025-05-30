import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TOOLS_URL = 'https://raw.githubusercontent.com/bellingcat/toolkit/main/data/tools.json';

export default function BellingcatToolkit() {
  const [tools, setTools] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(TOOLS_URL)
      .then(res => res.json())
      .then(data => setTools(data));
  }, []);

  const filtered = tools.filter(tool =>
    tool.name.toLowerCase().includes(search.toLowerCase()) ||
    (tool.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filtered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tools');
    XLSX.writeFile(workbook, 'bellingcat_tools.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Bellingcat Tools List', 14, 16);
    const rows = filtered.map(tool => [tool.name, tool.description || '', tool.url || '']);
    doc.autoTable({ head: [['Name', 'Description', 'URL']], body: rows });
    doc.save('bellingcat_tools.pdf');
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bellingcat Toolkit</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tools..."
        className="border p-2 w-full mb-4"
      />
      <div className="flex gap-2 mb-4">
        <button onClick={exportToExcel} className="bg-blue-500 text-white px-4 py-2 rounded">Export Excel</button>
        <button onClick={exportToPDF} className="bg-green-500 text-white px-4 py-2 rounded">Export PDF</button>
      </div>
      <ul className="space-y-2">
        {filtered.map((tool, idx) => (
          <li key={idx} className="border p-4 rounded">
            <h2 className="font-semibold text-lg">{tool.name}</h2>
            <p className="text-sm text-gray-700">{tool.description}</p>
            {tool.url && (
              <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                Visit Tool
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
