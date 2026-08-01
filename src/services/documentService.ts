import { Attachment } from '../types/chat';

export async function parseFileToAttachment(file: File): Promise<Attachment> {
  const id = 'att-' + Math.random().toString(36).substr(2, 9);
  const name = file.name;
  const size = file.size;

  let type: 'image' | 'pdf' | 'text' | 'code' = 'text';

  if (file.type.startsWith('image/')) {
    type = 'image';
    const previewUrl = await readFileAsDataURL(file);
    return {
      id,
      name,
      type,
      size,
      content: previewUrl,
      previewUrl
    };
  }

  if (file.name.endsWith('.pdf')) {
    type = 'pdf';
    // For PDF files, extract plain text or create preview placeholder
    const textContent = await readTextFromFile(file);
    return {
      id,
      name,
      type,
      size,
      content: textContent || `[PDF Document: ${file.name} - ${Math.round(size / 1024)} KB]`
    };
  }

  if (file.name.match(/\.(js|ts|tsx|jsx|py|java|cpp|c|cs|html|css|json|md|sql)$/i)) {
    type = 'code';
    const content = await readTextFromFile(file);
    return {
      id,
      name,
      type,
      size,
      content
    };
  }

  // Default plain text file
  const content = await readTextFromFile(file);
  return {
    id,
    name,
    type: 'text',
    size,
    content: content.slice(0, 15000) // Cap text length
  };
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function readTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string || '');
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
