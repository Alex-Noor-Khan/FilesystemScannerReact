import { useState } from 'react'
import './styles/layout.css'
import { scanLocalDirectory } from './utils/scanner'
import { categorizeFile } from './utils/categorizer' // Added this import
import Analytics from './components/Analytics'
import FileTree from './components/FileTree'

function App() {
  const [files, setFiles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [path, setPath] = useState('');

  const handleStartScan = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      setPath(directoryHandle.name);
      
      const results = await scanLocalDirectory(directoryHandle, (newLog) => {
        setLogs(prev => [...prev, newLog]);
      });
      
      setFiles(results);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setLogs(prev => [...prev, { type: 'System', message: err.message, timestamp: new Date() }]);
      }
    }
  };

  // Fixed: Moved outside of handleStartScan and removed require/glob
  const handleRenameFile = (index, newName) => {
    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles];
      const file = { ...updatedFiles[index] };
      
      file.name = newName;
      
      const pathParts = file.fullPath.split('/');
      pathParts[pathParts.length - 1] = newName;
      file.fullPath = pathParts.join('/');
      
      // Correct way to re-categorize in React
      file.category = categorizeFile(newName);

      updatedFiles[index] = file;
      return updatedFiles;
    });

    setLogs(prev => [{
      type: 'Info',
      message: `Renamed file to ${newName}`,
      path: newName,
      timestamp: new Date()
    }, ...prev]);
  };

  const downloadJsonReport = () => {
    const reportData = {
      summary: {
        totalFiles: files.length,
        totalSize: files.reduce((acc, f) => acc + f.sizeBytes, 0),
        timestamp: new Date().toISOString(),
      },
      files,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scan_report_${new Date().getTime()}.json`;
    link.click();
  };

  return (
    <div className="main-app">
      <div className="top-bar">
        <input className="input-field" value={path} placeholder="Select a folder..." readOnly />
        <button className="scan-btn" onClick={handleStartScan}>Select Folder</button>
        {files.length > 0 && (
          <button className="scan-btn" style={{ backgroundColor: '#28a745' }} onClick={downloadJsonReport}>
            Download JSON
          </button>
        )}
      </div>

      <div className="window-container">
        <div className="window">
          <div className="window-header">File Tree</div>
          <div className="window-content">
            {files.length === 0 ? <div style={{ color: '#666' }}>No scan active</div> : (
              <FileTree files={files} onRename={handleRenameFile} />
            )}
          </div>
        </div>

        <div className="window">
          <div className="window-header">Analytics Summary</div>
          <div className="window-content">
            {files.length > 0 ? <Analytics files={files} /> : (
              <div style={{ padding: '20px', color: '#666' }}>No scan active.</div>
            )}
          </div>
        </div>

        <div className="window" style={{ borderRight: 'none' }}>
          <div className="window-header">System Logs</div>
          <div className="window-content">
            {logs.map((log, i) => (
              <div key={i} style={{ color: log.type.includes('Error') ? '#f44336' : '#4caf50', fontSize: '11px', marginBottom: '8px', borderBottom: '1px solid #333' }}>
                <strong>[{log.type}]</strong> {new Date(log.timestamp).toLocaleTimeString()}<br/>
                {log.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;