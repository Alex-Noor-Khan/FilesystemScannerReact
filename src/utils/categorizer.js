// src/utils/categorizer.js

export const CATEGORIES = {
  IMAGE: 'Image',
  AUDIO: 'Audio',
  VIDEO: 'Video',
  DOCUMENT: 'Document',
  ARCHIVE: 'Archive',
  CODE: 'Code',
  OTHER: 'Other',
};

const extensionMap = {
  '.png': CATEGORIES.IMAGE,
  '.jpg': CATEGORIES.IMAGE,
  '.jpeg': CATEGORIES.IMAGE,
  '.gif': CATEGORIES.IMAGE,
  '.mp3': CATEGORIES.AUDIO,
  '.wav': CATEGORIES.AUDIO,
  '.mp4': CATEGORIES.VIDEO,
  '.avi': CATEGORIES.VIDEO,
  '.mov': CATEGORIES.VIDEO,
  '.pdf': CATEGORIES.DOCUMENT,
  '.docx': CATEGORIES.DOCUMENT,
  '.txt': CATEGORIES.DOCUMENT,
  '.zip': CATEGORIES.ARCHIVE,
  '.rar': CATEGORIES.ARCHIVE,
  '.cs': CATEGORIES.CODE,
  '.js': CATEGORIES.CODE,
  '.html': CATEGORIES.CODE,
};

export const categorizeFile = (fileName) => {
  if (!fileName) return CATEGORIES.OTHER;

  // Extract extension (e.g., "test.png" -> ".png")
  const lastDotIndex = fileName.lastIndexOf('.');
  const extension =
    lastDotIndex === -1 ? '' : fileName.slice(lastDotIndex).toLowerCase();

  return extensionMap[extension] || CATEGORIES.OTHER;
};
