// src/utils/scanner.js
import { categorizeFile } from './categorizer';

export const scanLocalDirectory = async (directoryHandle, onLog) => {
  const results = [];

  async function recursiveScan(handle, path = '') {
    try {
      for await (const entry of handle.values()) {
        const currentPath = path ? `${path}/${entry.name}` : entry.name;

        if (entry.kind === 'file') {
          const file = await entry.getFile();
          results.push({
            name: entry.name,
            fullPath: currentPath,
            sizeBytes: file.size,
            lastModified: new Date(file.lastModified),
            extension: entry.name.split('.').pop(),
            category: categorizeFile(entry.name),
            isHidden: entry.name.startsWith('.'),
          });
        } else if (entry.kind === 'directory') {
          // Replicates the 'recursive: true' logic from Scanner.cs
          await recursiveScan(entry, currentPath);
        }
      }
    } catch (err) {
      // Replicates ScanLogger.Log
      onLog({
        type: 'UnauthorizedAccessException',
        path: path || 'Root',
        message: err.message,
        timestamp: new Date(),
      });
    }
  }

  await recursiveScan(directoryHandle);
  return results;
};
