import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportPdfOptions {
  elementId: string;
  filename: string;
  title?: string;
  scale?: number;
}

/**
 * Exports an HTML element directly to a downloadable PDF file.
 * Supports both object options or positional arguments: (elementId, filename)
 */
export async function exportElementToPdf(
  target: string | ExportPdfOptions,
  optionalFilename?: string
): Promise<boolean> {
  const options: ExportPdfOptions = typeof target === 'string'
    ? { elementId: target, filename: optionalFilename || 'document.pdf', scale: 2 }
    : { scale: 2, ...target };

  const { elementId, filename, scale = 2 } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF export.`);
    // Fallback to print
    window.print();
    return false;
  }

  try {
    // Generate canvas
    const canvas = await html2canvas(element, {
      scale: Math.max(1.5, Math.min(3, scale)),
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Remaining pages if content overflows A4 height
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
    return true;
  } catch (err) {
    console.error('Failed to generate PDF:', err);
    // Fallback to native print
    window.print();
    return false;
  }
}
