import React from 'react';

const FileTree = ({ files }) => {
  // Same logic to build the nested object from FullPaths
  const buildTree = (fileList) => {
    const root = {};
    fileList.forEach(file => {
      const parts = file.fullPath.split('/');
      let current = root;
      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = index === parts.length - 1 ? { _file: file } : {};
        }
        current = current[part];
      });
    });
    return root;
  };

  // Simple recursive function to print lines with dashes
  const renderSimpleNode = (node, name, depth = 0) => {
    const isFile = node._file;
    const indent = depth === 0 ? "" : "|-- ";
    const spacing = "  ".repeat(depth);

    return (
      <div key={name} style={{ fontFamily: 'monospace', whiteSpace: 'pre', fontSize: '13px', lineHeight: '1.4' }}>
        <span style={{ color: isFile ? '#bbb' : '#e8a87c' }}>
          {spacing}{indent}{name}
        </span>
        {isFile && (
          <span style={{ color: '#666', fontSize: '11px' }}> ({node._file.category})</span>
        )}
        
        {/* Render children immediately without needing to click */}
        {!isFile && Object.entries(node).map(([childName, childNode]) => 
          renderSimpleNode(childNode, childName, depth + 1)
        )}
      </div>
    );
  };

  const treeData = buildTree(files);

  return (
    <div style={{ padding: '10px' }}>
      {Object.entries(treeData).map(([name, node]) => renderSimpleNode(node, name))}
    </div>
  );
};

export default FileTree;