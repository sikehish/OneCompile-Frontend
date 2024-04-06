import React, { useState } from 'react';
import { FaPlay } from 'react-icons/fa';

const Editor: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('python');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const executeCode = async () => {
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const res = await fetch('http://localhost:8080/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language, code }),
      });
      const data = await res.json();
      console.log(data);
      if (data.output) {
        setOutput(data.output);
      }
      if (data.error) {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error executing code:', error);
      setError('Error executing code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-3">
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
          <div className="flex items-center">
            <select
              className="px-4 py-2 border rounded-md bg-gray-700 text-white focus:outline-none"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="golang">Go</option>
            </select>
          </div>
          <div>
            <button
              className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={executeCode}
              disabled={loading}
            >
              {loading ? 'Loading...' : <FaPlay className="mr-2" />}
            </button>
          </div>
        </div>
        <textarea
          className="flex-1 p-4 mt-4 border rounded-md resize-none focus:outline-none bg-gray-900 text-white w-full h-[60vh]"
          placeholder="Enter your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        ></textarea>
      </div>
      <div className="flex flex-col overflow-auto flex-1 border bg-gray-800">
        <div className="p-4 text-white">Output:</div>
        <div className="flex-1 p-4 overflow-auto">{error || output}</div>
      </div>
    </div>
  );
};

export default Editor;
