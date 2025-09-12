import React from 'react';

interface TableData {
  headers: string[];
  rows: string[][];
}

interface StructuredContentProps {
  content: string;
}

export function StructuredContent({ content }: StructuredContentProps) {
  // Decode HTML entities
  const decodeHtmlEntities = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const parseContent = (text: string) => {
    // First decode HTML entities
    const decodedText = decodeHtmlEntities(text);
    // Split by double newlines but also treat numbered sections as separate sections
    const sections = decodedText.split(/\n\s*\n/);
    const elements: JSX.Element[] = [];

    sections.forEach((section, index) => {
      const trimmedSection = section.trim();
      if (!trimmedSection) return;

      // Check if section starts with a numbered header
      const lines = trimmedSection.split('\n');
      const firstLine = lines[0].trim();
      
      if (/^\d+\)/.test(firstLine)) {
        // Add the numbered header
        elements.push(
          <h2 key={`header-${index}`} className="text-xl font-bold text-brand-navy mt-8 mb-4 border-b-2 border-brand-green pb-2">
            {firstLine}
          </h2>
        );
        
        // Process the rest of the content if any
        if (lines.length > 1) {
          const remainingContent = lines.slice(1).join('\n').trim();
          if (remainingContent) {
            const element = parseRegularContent(remainingContent, `content-${index}`);
            if (element) elements.push(element);
          }
        }
        return;
      }

      // Check if section contains a table
      if (isTableSection(trimmedSection)) {
        const table = parseTable(trimmedSection);
        if (table) {
          elements.push(
            <div key={index} className="my-6 overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-brand-navy">
                    {table.headers.map((header, i) => (
                      <th key={i} className="border border-gray-300 px-4 py-3 text-left font-semibold text-white">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white hover:bg-blue-50 transition-colors"}>
                      {row.map((cell, j) => (
                        <td key={j} className="border border-gray-300 px-4 py-3 text-sm">
                          <div className="whitespace-pre-wrap">{cell}</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      } else {
        // Regular content parsing
        const element = parseRegularContent(trimmedSection, index);
        if (element) elements.push(element);
      }
    });

    return elements;
  };

  const isTableSection = (section: string): boolean => {
    const lines = section.split('\n').filter(line => line.trim());
    if (lines.length < 2) return false;
    
    // Check for tab-separated content
    if (lines.some(line => line.includes('\t'))) return true;
    
    // Check for multiple spaces (3 or more) indicating columns
    const spaceSeparatedLines = lines.filter(line => /\s{3,}/.test(line));
    if (spaceSeparatedLines.length >= 2) return true;
    
    // Check for college name + location pattern (common in your content)
    const collegePattern = lines.filter(line => 
      /^[A-Z][^\t]*\s+[A-Z]{2,}/.test(line.trim())
    );
    if (collegePattern.length >= 2) return true;
    
    return false;
  };

  const parseTable = (section: string): TableData | null => {
    const lines = section.split('\n').filter(line => line.trim());
    if (lines.length < 2) return null;

    let headers: string[] = [];
    let rows: string[][] = [];

    // Method 1: Tab-separated
    if (lines[0].includes('\t')) {
      headers = lines[0].split('\t').map(h => h.trim()).filter(h => h);
      
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split('\t').map(cell => cell.trim()).filter(cell => cell);
        if (row.length > 0) rows.push(row);
      }
    }
    // Method 2: Multiple spaces (3 or more) as separator
    else if (lines.some(line => /\s{3,}/.test(line))) {
      // Find the most common number of columns
      const columnCounts = lines.map(line => line.split(/\s{3,}/).length);
      const mostCommonColumns = Math.max(...columnCounts);
      
      headers = lines[0].split(/\s{3,}/).map(h => h.trim()).filter(h => h);
      
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(/\s{3,}/).map(cell => cell.trim()).filter(cell => cell);
        if (row.length > 0) {
          // Pad row to match header length if needed
          while (row.length < headers.length) {
            row.push('');
          }
          rows.push(row);
        }
      }
    }
    // Method 3: Try to detect college name + location pattern
    else if (lines.some(line => /^[A-Z][^\t]*\s+[A-Z]{2,}/.test(line))) {
      headers = ['College/Institution', 'Location'];
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed) {
          // Split on the last uppercase word (likely state/location)
          const match = trimmed.match(/^(.+?)\s+([A-Z]{2,}[A-Z\s]*)$/);
          if (match) {
            rows.push([match[1].trim(), match[2].trim()]);
          } else {
            // Fallback: split on multiple spaces
            const parts = trimmed.split(/\s{2,}/);
            if (parts.length >= 2) {
              rows.push([parts[0], parts.slice(1).join(' ')]);
            }
          }
        }
      }
    }

    return headers.length > 0 && rows.length > 0 ? { headers, rows } : null;
  };

  const parseRegularContent = (section: string, index: number): JSX.Element | null => {
    const lines = section.split('\n');
    
    // Check for headers (lines ending with specific patterns or starting with numbers)
    if (lines.length === 1) {
      const line = lines[0].trim();
      
      // Main title (quoted text)
      if (line.startsWith('"') && line.endsWith('"')) {
        return (
          <h1 key={index} className="text-3xl font-bold text-brand-navy mb-6 text-center">
            {line.slice(1, -1)}
          </h1>
        );
      }
      
      // Numbered sections with proper spacing and green underline
      if (/^\d+\)/.test(line)) {
        return (
          <h2 key={index} className="text-xl font-bold text-brand-navy mt-8 mb-4 border-b-2 border-brand-green pb-2">
            {line}
          </h2>
        );
      }
    }

    // Also check for numbered sections in multi-line content
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      if (/^\d+\)/.test(firstLine) && lines.length === 1) {
        return (
          <h2 key={index} className="text-xl font-bold text-brand-navy mt-8 mb-4 border-b-2 border-brand-green pb-2">
            {firstLine}
          </h2>
        );
      }
    }

    // Multi-line content with better formatting
    const content = lines.map((line, i) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) return null;
      
      // Bullet points
      if (trimmedLine.startsWith('•')) {
        return (
          <li key={i} className="mb-2 text-gray-700">
            {trimmedLine.substring(1).trim()}
          </li>
        );
      }
      
      // Sub-bullet points (with 'o' marker)
      if (trimmedLine.startsWith('o\t') || trimmedLine.startsWith('o ')) {
        return (
          <li key={i} className="ml-6 mb-1 text-gray-600 list-disc">
            {trimmedLine.substring(2).trim()}
          </li>
        );
      }
      
      // Regular paragraphs
      return (
        <p key={i} className="mb-3 leading-relaxed text-gray-700">
          {trimmedLine}
        </p>
      );
    }).filter(Boolean);

    if (content.length === 0) return null;

    // Check if content contains bullet points
    const hasBullets = lines.some(line => 
      line.trim().startsWith('•') || line.trim().startsWith('o ')
    );

    if (hasBullets) {
      return (
        <div key={index} className="mb-6">
          <ul className="space-y-1 list-disc pl-5">
            {content}
          </ul>
        </div>
      );
    }

    return (
      <div key={index} className="mb-6">
        {content}
      </div>
    );
  };

  return (
    <div className="structured-content">
      {parseContent(content)}
    </div>
  );
}