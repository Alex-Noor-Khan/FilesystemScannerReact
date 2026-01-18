import React, { useState, useEffect, useRef } from 'react';
import { Folder, File, FileText, Image, Music, Video, Archive, Code, ChevronRight, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '../utils/categorizer';

const FileTree = ({ files, onRename }) => {
  const [contextMenu, setContextMenu] = useState(null);

  // Close context menu when clicking anywhere else
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const getIcon = (category) => {
    switch (category) {
      case CATEGORIES.IMAGE: return <Image size={16} color="#4db6ac" />;
      case CATEGORIES.AUDIO: return <Music size={16} color="#ba68c8" />;
      case CATEGORIES.VIDEO: return <Video size={16} color="#ff8a65" />;
      case CATEGORIES.DOCUMENT: return <FileText size={16} color="#64b5f6" />;
      case CATEGORIES.ARCHIVE: return <Archive size={16} color="#ffd54f" />;
      case CATEGORIES.CODE: return <Code size={16} color="#81c784" />;
      default: return <File size={16} color="#90a4ae" />;
    }
  };

  const buildTree = (fileList) => {
    const root = {};
    fileList.forEach((file, index) => {
      const parts = file.fullPath.split('/');
      let current = root;
      parts.forEach((part, i) => {
        if (!current[part]) {
          current[part] = i === parts.length - 1 ? { _file: file, _index: index } : { _isFolder: true };
        }
        current = current[part];
      });
    });
    return root;
  };

  const TreeNode = ({ name, node, depth = 0 }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(name);
    const isFile = node._file;

    const handleRenameSubmit = () => {
      if (newName === name) {
        setIsEditing(false);
        return;
      }
      const oldExt = name.split('.').pop();
      const newExt = newName.split('.').pop();

      if (oldExt !== newExt) {
        const confirmChange = window.confirm(`Warning: Changing extension to .${newExt} may break the file. Continue?`);
        if (!confirmChange) {
          setNewName(name);
          setIsEditing(false);
          return;
        }
      }
      onRename(node._index, newName);
      setIsEditing(false);
    };

    const handleContextMenu = (e) => {
      if (!isFile) return; // Only allow rename on files for now
      e.preventDefault();
      e.stopPropagation();
      setContextMenu({
        x: e.pageX,
        y: e.pageY,
        onRename: () => setIsEditing(true)
      });
    };

    return (
      <div style={{ marginLeft: `${depth * 15}px`, fontFamily: 'Segoe UI, sans-serif' }}>
        <div 
          onClick={() => !isFile && setIsOpen(!isOpen)}
          onDoubleClick={(e) => {
            if(isFile) {
              e.stopPropagation();
              setIsEditing(true);
            }
          }}
          onContextMenu={handleContextMenu}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '4px 8px',
            cursor: isFile ? 'default' : 'pointer',
            borderRadius: '4px',
            color: '#ffffff',
            userSelect: 'none'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2a2d2e')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {!isFile && (isOpen ? <ChevronDown size={14} color="#aaa" /> : <ChevronRight size={14} color="#aaa" />)}
          {isFile ? getIcon(node._file.category) : <Folder size={16} color="#e8a87c" fill="#e8a87c33" />}

          {isEditing ? (
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
              onClick={(e) => e.stopPropagation()}
              style={{ background: '#3c3c3c', color: '#fff', border: '1px solid #007acc', padding: '2px 4px', borderRadius: '3px', width: '100%' }}
            />
          ) : (
            <span style={{ fontWeight: isFile ? '400' : '600' }}>{name}</span>
          )}
        </div>

        {!isFile && isOpen && Object.entries(node).map(([childName, childNode]) => (
          childName !== '_isFolder' && <TreeNode key={childName} name={childName} node={childNode} depth={depth + 1} />
        ))}
      </div>
    );
  };

  const treeData = buildTree(files);

  return (
    <div style={{ padding: '10px', position: 'relative' }}>
      {Object.entries(treeData).map(([name, node]) => (
        <TreeNode key={name} name={name} node={node} />
      ))}

      {/* Custom Context Menu */}
      {contextMenu && (
        <div style={{
          position: 'fixed',
          top: contextMenu.y,
          left: contextMenu.x,
          backgroundColor: '#252526',
          border: '1px solid #454545',
          boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
          padding: '5px 0',
          zIndex: 1000,
          borderRadius: '4px',
          minWidth: '120px'
        }}>
          <div 
            style={{ padding: '6px 15px', color: 'white', cursor: 'pointer', fontSize: '13px' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#007acc'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              contextMenu.onRename();
              setContextMenu(null);
            }}
          >
            Rename
          </div>
        </div>
      )}
    </div>
  );
};

export default FileTree;