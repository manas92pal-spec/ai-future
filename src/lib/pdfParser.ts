import * as pdfjsLib from "pdfjs-dist";

// Use CDN worker for compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(" ");
    fullText += pageText + "\n";
  }

  return fullText.trim();
}

export async function extractTextFromTXT(file: File): Promise<string> {
  return await file.text();
}

export async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) {
    return extractTextFromPDF(file);
  } else if (name.endsWith(".txt")) {
    return extractTextFromTXT(file);
  } else if (name.endsWith(".docx")) {
    // Basic DOCX extraction — reads the raw XML text
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    // Try to extract readable text from docx XML
    const text = new TextDecoder("utf-8", { fatal: false }).decode(uint8);
    // Strip XML tags
    const stripped = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return stripped;
  }
  throw new Error("Unsupported file format");
}
