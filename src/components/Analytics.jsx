import React from 'react';

const Analytics = ({ files }) => {
  if (files.length === 0) return <div>No data to analyze.</div>;

  // Replaces ReportGenerator.cs logic
  const totalSize = files.reduce((acc, f) => acc + f.sizeBytes, 0);
  const hiddenFiles = files.filter((f) => f.isHidden).length;

  // Group by category
  const categoryCounts = files.reduce((acc, f) => {
    acc[f.category] = (acc[f.category] || 0) + 1;
    return acc;
  }, {});

  // Get Top 10 Largest
  const topLargest = [...files]
    .sort((a, b) => b.sizeBytes - a.sizeBytes)
    .slice(0, 10);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="analytics-view">
      <h3>Scan Summary</h3>
      <p>Total Files: {files.length}</p>
      <p>Total Volume: {formatSize(totalSize)}</p>
      <p>Hidden Files: {hiddenFiles}</p>

      <h4>Categories</h4>
      {Object.entries(categoryCounts).map(([cat, count]) => (
        <div key={cat} style={{ fontSize: '13px' }}>
          {cat}: {count}
        </div>
      ))}

      <h4>Top 10 Largest</h4>
      {topLargest.map((f, i) => (
        <div
          key={i}
          style={{ fontSize: '11px', color: '#aaa', marginBottom: '4px' }}
        >
          {formatSize(f.sizeBytes)} — {f.name}
        </div>
      ))}
    </div>
  );
};

export default Analytics;
