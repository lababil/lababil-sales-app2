import jsPDF from 'jspdf';
import { COMPANY_INFO } from './constants.js';
import { LababilWatermark } from '../components/LababilLogo';

// Get settings from localStorage
const getSettings = () => {
  try {
    const savedSettings = localStorage.getItem('lababil_settings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
  }
  return null;
};

// Get company info from settings or fallback to constants
const getCompanyInfo = () => {
  const settings = getSettings();
  if (settings) {
    return {
      companyName: settings.companyName || COMPANY_INFO.companyName,
      address: settings.companyAddress || COMPANY_INFO.address,
      phone: settings.companyPhone || COMPANY_INFO.phone,
      email: settings.companyEmail || COMPANY_INFO.email,
      website: settings.companyWebsite || COMPANY_INFO.website,
      bankAccount: settings.companyBankAccount || COMPANY_INFO.bankAccount,
      logo: settings.logoPreview || COMPANY_INFO.logo
    };
  }
  return COMPANY_INFO;
};

// Get printer settings
const getPrinterSettings = () => {
  const settings = getSettings();
  if (settings) {
    return {
      paperSize: settings.paperSize || 'A4',
      paperOrientation: settings.paperOrientation || 'portrait',
      marginTop: settings.marginTop || 10,
      marginBottom: settings.marginBottom || 10,
      marginLeft: settings.marginLeft || 10,
      marginRight: settings.marginRight || 10,
      showLogo: settings.showLogo !== false,
      showCompanyInfo: settings.showCompanyInfo !== false,
      showCustomerInfo: settings.showCustomerInfo !== false,
      showTax: settings.showTax !== false,
      taxRate: settings.taxRate || 11,
      currency: settings.currency || 'IDR',
      language: settings.language || 'id'
    };
  }
  return {
    paperSize: 'A4',
    paperOrientation: 'portrait',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    showLogo: true,
    showCompanyInfo: true,
    showCustomerInfo: true,
    showTax: true,
    taxRate: 11,
    currency: 'IDR',
    language: 'id'
  };
};

// Format currency helper
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount);
};

// Format date helper
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = () => {
  return new Date().toLocaleTimeString('id-ID');
};

// Add logo to PDF - Improved version
const addLogoToPDF = (doc, x, y, width, height) => {
  // Draw L shape with better proportions
  doc.setFillColor(30, 64, 175); // Blue

  // L - vertical part
  doc.rect(x, y, width * 0.25, height * 0.85, 'F');

  // L - horizontal part
  doc.rect(x, y + height * 0.7, width * 0.7, height * 0.25, 'F');

  // Draw B inside L
  doc.setFillColor(107, 114, 128); // Gray
  const bX = x + width * 0.15;
  const bY = y + height * 0.1;
  const bWidth = width * 0.45;
  const bHeight = height * 0.55;

  // B - vertical bar (thicker)
  doc.rect(bX, bY, bWidth * 0.3, bHeight, 'F');

  // B - top bump
  doc.rect(bX + bWidth * 0.3, bY, bWidth * 0.4, bHeight * 0.35, 'F');
  doc.rect(bX + bWidth * 0.65, bY + bHeight * 0.05, bWidth * 0.2, bHeight * 0.25, 'F');

  // B - middle separator
  doc.rect(bX + bWidth * 0.3, bY + bHeight * 0.4, bWidth * 0.35, bHeight * 0.15, 'F');

  // B - bottom bump (bigger)
  doc.rect(bX + bWidth * 0.3, bY + bHeight * 0.6, bWidth * 0.5, bHeight * 0.4, 'F');
  doc.rect(bX + bWidth * 0.75, bY + bHeight * 0.65, bWidth * 0.25, bHeight * 0.3, 'F');

  // Camera lens
  doc.setFillColor(59, 130, 246); // Light blue
  doc.circle(bX + bWidth * 0.75, bY + bHeight * 0.8, width * 0.04, 'F');

  // Network dots (small)
  doc.setFillColor(59, 130, 246);
  doc.circle(bX + bWidth * 0.4, bY + bHeight * 0.15, width * 0.015, 'F');
  doc.circle(bX + bWidth * 0.5, bY + bHeight * 0.1, width * 0.01, 'F');
  doc.circle(bX + bWidth * 0.6, bY + bHeight * 0.2, width * 0.01, 'F');

  // Add text "LB" as backup
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(height * 0.6);
  doc.setTextColor(255, 255, 255); // White text
  doc.text('LB', x + width * 0.1, y + height * 0.7);
};

// Add watermark to PDF page
const addWatermarkToPDF = (doc, pageWidth, pageHeight) => {
  // Save current state
  const currentFont = doc.getFont();
  const currentFontSize = doc.getFontSize();
  const currentTextColor = doc.getTextColor();

  // Calculate center position
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;

  // Add watermark using the LababilWatermark component
  doc.saveGraphicsState();
  doc.setGState(doc.GState({ opacity: 0.15 }));

  // Create watermark SVG using the LababilWatermark component design
  const watermarkSVG = `
    <svg width="200" height="150" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="watermarkBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.15" />
          <stop offset="100%" style="stop-color:#1e40af;stop-opacity:0.10" />
        </linearGradient>
        <linearGradient id="watermarkSilver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#9ca3af;stop-opacity:0.12" />
          <stop offset="100%" style="stop-color:#6b7280;stop-opacity:0.08" />
        </linearGradient>
      </defs>

      <!-- Letter L - Outer structure -->
      <path d="M50 50 L50 150 L150 150 L150 130 L70 130 L70 50 Z" fill="url(#watermarkBlue)"/>

      <!-- Letter B - Inside the L -->
      <path d="M78 55 L78 115 L98 115 L98 55 Z" fill="url(#watermarkSilver)"/>
      <path d="M78 55 L118 55 Q125 55 125 65 Q125 72 120 75 Q115 77 110 77 L78 77 Z" fill="url(#watermarkSilver)"/>
      <path d="M78 77 L108 77 L108 83 L78 83 Z" fill="url(#watermarkSilver)"/>
      <path d="M78 83 L130 83 Q145 83 145 100 Q145 110 140 115 Q135 115 125 115 L78 115 Z" fill="url(#watermarkSilver)"/>

      <!-- Camera lens -->
      <circle cx="115" cy="100" r="10" fill="none" stroke="url(#watermarkSilver)" stroke-width="2"/>
      <circle cx="115" cy="100" r="6" fill="url(#watermarkBlue)"/>
      <circle cx="115" cy="100" r="3" fill="url(#watermarkBlue)"/>

      <!-- Network elements -->
      <circle cx="95" cy="63" r="2" fill="url(#watermarkBlue)"/>
      <circle cx="102" cy="61" r="1.5" fill="url(#watermarkBlue)"/>
      <circle cx="107" cy="64" r="1.5" fill="url(#watermarkBlue)"/>
      <circle cx="104" cy="69" r="1.5" fill="url(#watermarkBlue)"/>
      <line x1="95" y1="63" x2="102" y2="61" stroke="url(#watermarkBlue)" stroke-width="1"/>
      <line x1="102" y1="61" x2="107" y2="64" stroke="url(#watermarkBlue)" stroke-width="1"/>
      <line x1="107" y1="64" x2="104" y2="69" stroke="url(#watermarkBlue)" stroke-width="1"/>
      <line x1="104" y1="69" x2="95" y2="63" stroke="url(#watermarkBlue)" stroke-width="1"/>

      <!-- Text -->
      <text x="50" y="200" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="url(#watermarkBlue)">LABABIL</text>
      <text x="50" y="225" font-family="Arial, sans-serif" font-size="18" font-weight="normal" fill="url(#watermarkSilver)">solution</text>
    </svg>
  `;

  // Convert SVG to base64
  const svgBase64 = btoa(watermarkSVG);

  // Add watermark as image
  try {
    doc.addImage(`data:image/svg+xml;base64,${svgBase64}`, 'SVG', centerX - 100, centerY - 75, 200, 150);
  } catch (error) {
    // Fallback to text watermark if SVG fails
    doc.text('LABABIL SOLUTION', centerX, centerY, {
      align: 'center',
      angle: 45
    });
  }

  // Restore graphics state
  doc.restoreGraphicsState();

  // Restore previous state
  doc.setFont(currentFont.fontName, currentFont.fontStyle);
  doc.setFontSize(currentFontSize);
  doc.setTextColor(currentTextColor);
};

// Generate PDF receipt
export const generateReceiptPDF = (sale, companyInfo = null, allSales = []) => {
  // Get company info from settings if not provided
  const finalCompanyInfo = companyInfo || getCompanyInfo();
  const printerSettings = getPrinterSettings();

  // Set paper size based on settings
  let doc;
  if (printerSettings.paperSize === 'Thermal-58') {
    // 58mm thermal printer (approximately 2.28 inches)
    doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [58, 200] // width, height
    });
  } else if (printerSettings.paperSize === 'Thermal-80') {
    // 80mm thermal printer (approximately 3.15 inches)
    doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 200] // width, height
    });
  } else {
    // Standard A4 or other sizes
    doc = new jsPDF();
  }

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = printerSettings.paperSize.startsWith('Thermal') ? 2 : 15;
  let yPosition = margin;

  // Set font
  doc.setFont('helvetica');

  // Add Logo (only if enabled in settings)
  if (printerSettings.showLogo) {
    const logoSize = printerSettings.paperSize.startsWith('Thermal') ? 12 : 30;
    addLogoToPDF(doc, pageWidth / 2 - logoSize/2, yPosition - 3, logoSize, logoSize * 0.75);
    yPosition += logoSize + 3;
  }

  // Header - Company Info (only if enabled in settings)
  if (printerSettings.showCompanyInfo) {
    const fontSize = printerSettings.paperSize.startsWith('Thermal') ? 8 : 16;
    doc.setFontSize(fontSize);
    doc.setTextColor(30, 64, 175); // Blue color
    doc.text(finalCompanyInfo.companyName, pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 4;
    const smallFontSize = printerSettings.paperSize.startsWith('Thermal') ? 6 : 12;
    doc.setFontSize(smallFontSize);
    doc.setTextColor(100, 100, 100);

    if (printerSettings.paperSize.startsWith('Thermal')) {
      // For thermal printers, show minimal info
      doc.text(finalCompanyInfo.phone, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 3;
      doc.text(finalCompanyInfo.address.split(',')[0], pageWidth / 2, yPosition, { align: 'center' });
    } else {
      // For regular printers, show full info
      doc.text(finalCompanyInfo.address, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 6;
      doc.text(`Telp: ${finalCompanyInfo.phone} | Email: ${finalCompanyInfo.email}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 6;
      doc.text(`Website: ${finalCompanyInfo.website}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 6;
      doc.text(`Rekening: ${finalCompanyInfo.bankAccount}`, pageWidth / 2, yPosition, { align: 'center' });
    }
  }

  // Receipt title
  const titleFontSize = printerSettings.paperSize.startsWith('Thermal') ? 8 : 16;
  yPosition += printerSettings.paperSize.startsWith('Thermal') ? 5 : 15;
  doc.setFontSize(titleFontSize);
  doc.setTextColor(0, 0, 0);
  doc.text('INVOICE / KWITANSI', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 3;
  const receiptFontSize = printerSettings.paperSize.startsWith('Thermal') ? 6 : 12;
  doc.setFontSize(receiptFontSize);
  const receiptNumber = sale.receiptNumber || sale.id.split('-')[0];
  doc.text(`No. Receipt: #${receiptNumber}`, pageWidth / 2, yPosition, { align: 'center' });

  // Line separator
  yPosition += 8;
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(1);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);

  // Info sections - side by side for regular printers
  const infoStartY = yPosition + (printerSettings.paperSize.startsWith('Thermal') ? 5 : 10);
  const sectionWidth = (pageWidth - 2 * margin - 5) / 2;
  const leftX = margin;
  const rightX = margin + sectionWidth + 5;

  let maxInfoHeight = infoStartY;

  // Customer Info (only if enabled in settings) - left side
  if (printerSettings.showCustomerInfo) {
    const customerFontSize = printerSettings.paperSize.startsWith('Thermal') ? 8 : 14;
    let customerY = infoStartY;
    doc.setFontSize(customerFontSize);
    doc.setTextColor(0, 0, 0);
    doc.text('Customer Information:', leftX, customerY);

    customerY += 4;
    const customerDetailFontSize = printerSettings.paperSize.startsWith('Thermal') ? 7 : 12;
    doc.setFontSize(customerDetailFontSize);

    doc.text(`Name: ${sale.customer}`, leftX, customerY);
    customerY += (printerSettings.paperSize.startsWith('Thermal') ? 3 : 6);
    doc.text(`Email: ${sale.customerEmail || '-'}`, leftX, customerY);
    customerY += (printerSettings.paperSize.startsWith('Thermal') ? 3 : 6);
    doc.text(`Phone: ${sale.customerPhone || '-'}`, leftX, customerY);

    maxInfoHeight = Math.max(maxInfoHeight, customerY);
  }

  // Transaction Info - right side for non-thermal, stacked for thermal
  const transactionFontSize = printerSettings.paperSize.startsWith('Thermal') ? 8 : 14;
  let transactionY = infoStartY;
  const transX = printerSettings.paperSize.startsWith('Thermal') ? leftX : rightX;
  doc.setFontSize(transactionFontSize);
  doc.text('Transaction Information:', transX, transactionY);

  transactionY += 4;
  const transactionDetailFontSize = printerSettings.paperSize.startsWith('Thermal') ? 7 : 12;
  doc.setFontSize(transactionDetailFontSize);

  if (printerSettings.paperSize.startsWith('Thermal')) {
    // For thermal: stack below customer
    transactionY = maxInfoHeight + 5;
    maxInfoHeight = transactionY;
  }

  doc.text(`Date: ${formatDate(sale.date)}`, transX, transactionY);
  transactionY += (printerSettings.paperSize.startsWith('Thermal') ? 3 : 6);
  doc.text(`Status: ${sale.status || 'Completed'}`, transX, transactionY);
  transactionY += (printerSettings.paperSize.startsWith('Thermal') ? 3 : 6);
  doc.text(`Payment Method: ${sale.paymentMethod || 'Bank Transfer'}`, transX, transactionY);
  transactionY += (printerSettings.paperSize.startsWith('Thermal') ? 3 : 6);
  if (!printerSettings.paperSize.startsWith('Thermal')) {
    doc.text(`Print Time: ${new Date().toLocaleString('id-ID')}`, transX, transactionY);
  }

  maxInfoHeight = Math.max(maxInfoHeight, transactionY);

  // Update yPosition for next content
  yPosition = maxInfoHeight + (printerSettings.paperSize.startsWith('Thermal') ? 5 : 10);

  // Line separator before table
  yPosition += 6;
  doc.line(margin, yPosition, pageWidth - margin, yPosition);

  // Get all sales with the same receipt number (for multi-product sales)
  const relatedSales = allSales.filter(s => (s.receiptNumber || s.id.split('-')[0]) === receiptNumber);
  const subtotal = relatedSales.reduce((sum, s) => sum + s.total, 0);
  const tax = subtotal * 0.11; // 11% tax
  const total = subtotal + tax;

  // Items table header
  const tableFontSize = printerSettings.paperSize.startsWith('Thermal') ? 6 : 10;
  yPosition += printerSettings.paperSize.startsWith('Thermal') ? 4 : 10;
  doc.setFontSize(tableFontSize);
  doc.setFillColor(59, 130, 246);
  doc.setTextColor(255, 255, 255);
  doc.rect(margin, yPosition - 3, pageWidth - 2 * margin, printerSettings.paperSize.startsWith('Thermal') ? 7 : 12, 'F');

  // Table headers - responsive layout
  if (printerSettings.paperSize.startsWith('Thermal')) {
    // For thermal printers, use compact layout
    doc.text('No', margin + 2, yPosition);
    doc.text('Item', margin + 8, yPosition);
    doc.text('Qty', pageWidth - 28, yPosition);
    doc.text('Total', pageWidth - 4, yPosition, { align: 'right' });
  } else {
    // For regular printers, use full layout with adjusted positions to prevent overlap
    doc.text('No', margin + 10, yPosition);
    doc.text('Description', margin + 25, yPosition);
    doc.text('Qty', pageWidth - 110, yPosition);
    doc.text('Unit Price', pageWidth - 85, yPosition);
    doc.text('Total', pageWidth - 25, yPosition, { align: 'right' });
  }

  // Items
  const itemRowHeight = printerSettings.paperSize.startsWith('Thermal') ? 5 : 10;
  yPosition += itemRowHeight;
  doc.setTextColor(0, 0, 0);

  const itemFontSize = printerSettings.paperSize.startsWith('Thermal') ? 6 : 9;
  doc.setFontSize(itemFontSize);

  relatedSales.forEach((saleItem, index) => {
    doc.setFillColor(index % 2 === 0 ? 255 : 249, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 251);
    doc.rect(margin, yPosition - 3, pageWidth - 2 * margin, itemRowHeight, 'F');

    if (printerSettings.paperSize.startsWith('Thermal')) {
      // For thermal printers, use compact layout
      doc.text((index + 1).toString(), margin + 2, yPosition);

      // Handle long product names - truncate for thermal printers
      const productName = saleItem.productName.length > 10 ?
        saleItem.productName.substring(0, 10) + '...' : saleItem.productName;
      doc.text(productName, margin + 6, yPosition);

      doc.text(saleItem.quantity.toString(), pageWidth - 28, yPosition);
      doc.text(formatCurrency(saleItem.total), pageWidth - 3, yPosition, { align: 'right' });
    } else {
      // For regular printers, use full layout with adjusted positions
      doc.text((index + 1).toString(), margin + 10, yPosition);

      // Handle long product names
      const productName = saleItem.productName;
      if (productName.length > 30) {
        const lines = doc.splitTextToSize(productName, 70);
        for (let i = 0; i < lines.length; i++) {
          doc.text(lines[i], margin + 25, yPosition + (i * 3));
        }
        yPosition += (lines.length - 1) * 3;
      } else {
        doc.text(productName, margin + 25, yPosition);
      }

      doc.text(saleItem.quantity.toString(), pageWidth - 110, yPosition);
      doc.text(formatCurrency(saleItem.total / saleItem.quantity), pageWidth - 85, yPosition);
      doc.text(formatCurrency(saleItem.total), pageWidth - 25, yPosition, { align: 'right' });
    }

    yPosition += itemRowHeight;
  });

  // Line separator before totals
  yPosition += 6;
  doc.line(margin, yPosition, pageWidth - margin, yPosition);

  // Totals section
  const totalsSectionHeight = printerSettings.paperSize.startsWith('Thermal') ? 15 : 30;
  yPosition += printerSettings.paperSize.startsWith('Thermal') ? 4 : 10;
  doc.setFillColor(240, 249, 255);
  doc.rect(margin, yPosition - 4, pageWidth - 2 * margin, totalsSectionHeight, 'F');

  // Totals - responsive layout
  if (printerSettings.paperSize.startsWith('Thermal')) {
    // For thermal printers, show only essential totals
    yPosition += 2;
    const totalFontSize = 7;
    doc.setFontSize(totalFontSize);

    doc.text('Subtotal:', pageWidth - 28, yPosition);
    doc.text(formatCurrency(subtotal), pageWidth - 3, yPosition, { align: 'right' });

    yPosition += 3;
    if (printerSettings.showTax) {
      doc.text('Tax (11%):', pageWidth - 28, yPosition);
      doc.text(formatCurrency(tax), pageWidth - 3, yPosition, { align: 'right' });
      yPosition += 3;
    }

    doc.setFontSize(7);
    doc.setTextColor(30, 64, 175);
    doc.text('TOTAL:', pageWidth - 28, yPosition);
    doc.text(formatCurrency(total), pageWidth - 3, yPosition, { align: 'right' });
  } else {
    // For regular printers, show full totals with adjusted positions
    yPosition += 3;
    const totalFontSize = 14;
    doc.setFontSize(totalFontSize);

    doc.text('Subtotal:', pageWidth - 95, yPosition);
    doc.text(formatCurrency(subtotal), pageWidth - 25, yPosition, { align: 'right' });

    yPosition += 6;
    if (printerSettings.showTax) {
      doc.text('Tax (11%):', pageWidth - 95, yPosition);
      doc.text(formatCurrency(tax), pageWidth - 25, yPosition, { align: 'right' });
      yPosition += 6;
    }

    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175);
    doc.text('TOTAL:', pageWidth - 95, yPosition);
    doc.text(formatCurrency(total), pageWidth - 25, yPosition, { align: 'right' });
  }

  // Check if footer fits on current page, add new page if necessary
  const pageHeight = doc.internal.pageSize.getHeight();
  if (yPosition > pageHeight - 30) {
    doc.addPage();
    yPosition = margin;
  }

  // Footer
  const footerSpacing = printerSettings.paperSize.startsWith('Thermal') ? 3 : 15;
  yPosition += footerSpacing;

  const footerFontSize = printerSettings.paperSize.startsWith('Thermal') ? 6 : 12;
  doc.setFontSize(footerFontSize);
  doc.setTextColor(59, 130, 246);

  if (printerSettings.paperSize.startsWith('Thermal')) {
    // For thermal printers, show minimal footer
    doc.text('Terima Kasih!', pageWidth / 2, yPosition, { align: 'center' });
  } else {
    // For regular printers, show full footer
    doc.text('Terima Kasih atas Kepercayaan Anda!', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 5;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Untuk pertanyaan lebih lanjut mengenai layanan ini, silakan hubungi kami.', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 4;
    doc.text('Semua layanan dilindungi garansi sesuai dengan ketentuan yang berlaku.', pageWidth / 2, yPosition, { align: 'center' });
  }

  // Add watermark to the current page
  addWatermarkToPDF(doc, pageWidth, pageHeight);

  return doc;
};

// Download PDF receipt
export const downloadReceiptPDF = (sale, companyInfo = COMPANY_INFO, allSales = []) => {
  try {
    const doc = generateReceiptPDF(sale, companyInfo, allSales);
    const receiptNumber = sale.receiptNumber || sale.id.split('-')[0];
    const filename = `receipt-${receiptNumber}-${sale.date}.pdf`;
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
    return false;
  }
};

// Print PDF receipt
export const printReceiptPDF = (sale, companyInfo = COMPANY_INFO, allSales = []) => {
  try {
    const doc = generateReceiptPDF(sale, companyInfo, allSales);

    // Open PDF in new window for printing
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const printWindow = window.open(pdfUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.onafterprint = () => {
            printWindow.close();
            URL.revokeObjectURL(pdfUrl);
          };
        }, 500);
      };
    } else {
      alert('Pop-up blocked! Please enable pop-ups for print functionality.');
    }
    return true;
  } catch (error) {
    console.error('Error printing PDF:', error);
    alert('Error printing PDF. Please try again.');
    return false;
  }
};

// Keep existing functions for compatibility
export const printReceipt = (sale, companyInfo) => {
  return printReceiptPDF(sale, companyInfo);
};

export const downloadReceiptHTML = async (sale, companyInfo, allSales = []) => {
  const receiptHTML = generateReceiptHTML(sale, companyInfo, allSales);

  try {
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    const receiptNumber = sale.receiptNumber || sale.id.split('-')[0];
    link.download = `receipt-${receiptNumber}-${sale.date}.html`;
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading receipt:', error);
    alert('Gagal download receipt. Silakan coba lagi.');
  }
};

// Generate HTML receipt with logo
const generateReceiptHTML = (sale, companyInfo = null, allSales = []) => {
  // Get company info from settings if not provided
  const finalCompanyInfo = companyInfo || getCompanyInfo();
  const printerSettings = getPrinterSettings();

  const {
    companyName = finalCompanyInfo.companyName,
    address = finalCompanyInfo.address,
    phone = finalCompanyInfo.phone,
    email = finalCompanyInfo.email,
    website = finalCompanyInfo.website,
    bankAccount = finalCompanyInfo.bankAccount
  } = finalCompanyInfo;

  // Get all sales with the same receipt number (for multi-product sales)
  const receiptNumber = sale.receiptNumber || sale.id.split('-')[0];
  const relatedSales = allSales.filter(s => (s.receiptNumber || s.id.split('-')[0]) === receiptNumber);
  const subtotal = relatedSales.reduce((sum, s) => sum + s.total, 0);
  const tax = subtotal * 0.11; // 11% tax
  const total = subtotal + tax;

  // Updated Lababil Solution logo - L containing B design
  const companyLogo = `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="blueGradPrint" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.6" />
        </linearGradient>
        
        <linearGradient id="silverGradPrint" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6b7280;stop-opacity:0.9" />
          <stop offset="50%" style="stop-color:#9ca3af;stop-opacity:0.7" />
          <stop offset="100%" style="stop-color:#9ca3af;stop-opacity:0.5" />
        </linearGradient>
      </defs>
      
      <!-- Letter L (3D Blue) - Outer structure -->
      <path d="M50 50 L50 150 L150 150 L150 130 L70 130 L70 50 Z" fill="url(#blueGradPrint)" stroke="#1e40af" stroke-width="1"/>
      
      <!-- Letter B (3D Silver) - Inside the L -->
      <path d="M78 55 L78 115 L98 115 L98 55 Z" fill="url(#silverGradPrint)"/>
      <path d="M78 55 L118 55 Q125 55 125 65 Q125 72 120 75 Q115 77 110 77 L78 77 Z" fill="url(#silverGradPrint)"/>
      <path d="M78 77 L108 77 L108 83 L78 83 Z" fill="url(#silverGradPrint)"/>
      <path d="M78 83 L130 83 Q145 83 145 100 Q145 110 140 115 Q135 115 125 115 L78 115 Z" fill="url(#silverGradPrint)"/>
      <path d="M80 57 L80 113 L85 113 L85 57 Z" fill="#e5e7eb" opacity="0.7"/>
      <path d="M80 57 L115 57 Q120 57 120 62 Q120 65 118 67 L80 67 Z" fill="#e5e7eb" opacity="0.5"/>
      <path d="M80 85 L127 85 Q135 85 135 93 Q135 100 130 103 L80 103 Z" fill="#e5e7eb" opacity="0.5"/>
      
      <!-- Camera lens -->
      <circle cx="115" cy="100" r="10" fill="none" stroke="url(#silverGradPrint)" stroke-width="2"/>
      <circle cx="115" cy="100" r="6" fill="url(#blueGradPrint)"/>
      <circle cx="115" cy="100" r="3" fill="#1e40af"/>
      
      <!-- Network elements -->
      <circle cx="95" cy="63" r="2" fill="#3b82f6" opacity="0.8"/>
      <circle cx="102" cy="61" r="1.5" fill="#3b82f6" opacity="0.6"/>
      <circle cx="107" cy="64" r="1.5" fill="#3b82f6" opacity="0.6"/>
      <circle cx="104" cy="69" r="1.5" fill="#3b82f6" opacity="0.6"/>
      <line x1="95" y1="63" x2="102" y2="61" stroke="#3b82f6" stroke-width="1" opacity="0.6"/>
      <line x1="102" y1="61" x2="107" y2="64" stroke="#3b82f6" stroke-width="1" opacity="0.6"/>
      <line x1="107" y1="64" x2="104" y2="69" stroke="#3b82f6" stroke-width="1" opacity="0.6"/>
      <line x1="104" y1="69" x2="95" y2="63" stroke="#3b82f6" stroke-width="1" opacity="0.6"/>
      
      <!-- Text -->
      <text x="50" y="200" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#1e40af">LABABIL</text>
      <text x="50" y="225" font-family="Arial, sans-serif" font-size="18" font-weight="normal" fill="#6b7280">solution</text>
    </svg>
  `)}`;

  // Create watermark SVG using the LababilWatermark component design
  const watermarkSVG = `
    <svg width="400" height="300" viewBox="0 0 400 300" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); opacity: 0.12; z-index: -1; pointer-events: none;">
      <defs>
        <linearGradient id="watermarkBlueHTML" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.15" />
          <stop offset="100%" style="stop-color:#1e40af;stop-opacity:0.10" />
        </linearGradient>
        <linearGradient id="watermarkSilverHTML" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#9ca3af;stop-opacity:0.12" />
          <stop offset="100%" style="stop-color:#6b7280;stop-opacity:0.08" />
        </linearGradient>
      </defs>

      <!-- Letter L - Outer structure -->
      <path d="M50 50 L50 150 L150 150 L150 130 L70 130 L70 50 Z" fill="url(#watermarkBlueHTML)"/>

      <!-- Letter B - Inside the L -->
      <path d="M78 55 L78 115 L98 115 L98 55 Z" fill="url(#watermarkSilverHTML)"/>
      <path d="M78 55 L118 55 Q125 55 125 65 Q125 72 120 75 Q115 77 110 77 L78 77 Z" fill="url(#watermarkSilverHTML)"/>
      <path d="M78 77 L108 77 L108 83 L78 83 Z" fill="url(#watermarkSilverHTML)"/>
      <path d="M78 83 L130 83 Q145 83 145 100 Q145 110 140 115 Q135 115 125 115 L78 115 Z" fill="url(#watermarkSilverHTML)"/>

      <!-- Camera lens -->
      <circle cx="115" cy="100" r="10" fill="none" stroke="url(#watermarkSilverHTML)" stroke-width="2"/>
      <circle cx="115" cy="100" r="6" fill="url(#watermarkBlueHTML)"/>
      <circle cx="115" cy="100" r="3" fill="url(#watermarkBlueHTML)"/>

      <!-- Network elements -->
      <circle cx="95" cy="63" r="2" fill="url(#watermarkBlueHTML)"/>
      <circle cx="102" cy="61" r="1.5" fill="url(#watermarkBlueHTML)"/>
      <circle cx="107" cy="64" r="1.5" fill="url(#watermarkBlueHTML)"/>
      <circle cx="104" cy="69" r="1.5" fill="url(#watermarkBlueHTML)"/>
      <line x1="95" y1="63" x2="102" y2="61" stroke="url(#watermarkBlueHTML)" stroke-width="1"/>
      <line x1="102" y1="61" x2="107" y2="64" stroke="url(#watermarkBlueHTML)" stroke-width="1"/>
      <line x1="107" y1="64" x2="104" y2="69" stroke="url(#watermarkBlueHTML)" stroke-width="1"/>
      <line x1="104" y1="69" x2="95" y2="63" stroke="url(#watermarkBlueHTML)" stroke-width="1"/>

      <!-- Text -->
      <text x="50" y="200" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="url(#watermarkBlueHTML)">LABABIL</text>
      <text x="50" y="225" font-family="Arial, sans-serif" font-size="18" font-weight="normal" fill="url(#watermarkSilverHTML)">solution</text>
    </svg>
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Receipt - ${sale.id}</title>
        <style>
            @page {
                size: ${printerSettings.paperSize === 'Thermal-58' ? '58mm' : printerSettings.paperSize === 'Thermal-80' ? '80mm' : 'A4'};
                margin: ${printerSettings.paperSize.startsWith('Thermal') ? '2mm' : '20mm'};
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: Arial, sans-serif;
                font-size: ${printerSettings.paperSize.startsWith('Thermal') ? '8px' : '14px'};
                line-height: ${printerSettings.paperSize.startsWith('Thermal') ? '1.1' : '1.5'};
                color: #333;
                position: relative;
                background: white;
                width: ${printerSettings.paperSize === 'Thermal-58' ? '58mm' : printerSettings.paperSize === 'Thermal-80' ? '80mm' : 'auto'};
            }
            .watermark {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                pointer-events: none;
            }
            .receipt-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                border: 2px solid #e5e7eb;
                position: relative;
                z-index: 1;
                background: white;
            }
            .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #3b82f6; }
            .company-logo { width: 80px; height: 60px; margin: 0 auto 15px auto; background-image: url('${companyLogo}'); background-repeat: no-repeat; background-size: contain; background-position: center; }
            .company-name { font-size: 22px; font-weight: bold; color: #1e40af; margin-bottom: 10px; }
            .receipt-title { font-size: 24px; font-weight: bold; margin: 20px 0 10px 0; }
            .total-section { margin-top: 30px; padding: 20px; background-color: #f0f9ff; border: 2px solid #3b82f6; }
            .total-final { font-size: 16px; font-weight: bold; color: #1e40af; padding-top: 10px; border-top: 2px solid #3b82f6; margin-top: 15px; }
            table { width: 100%; border-collapse: collapse; margin: ${printerSettings.paperSize.startsWith('Thermal') ? '10px' : '20px'} 0; }
            th, td {
                padding: ${printerSettings.paperSize.startsWith('Thermal') ? '2px 1px' : '12px'};
                text-align: left;
                border: 1px solid #ddd;
                font-size: ${printerSettings.paperSize.startsWith('Thermal') ? '6px' : 'inherit'};
            }
            th { background-color: #3b82f6; color: white; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
        </style>
    </head>
    <body>
        <div class="watermark">
            ${watermarkSVG}
        </div>
        <div class="receipt-container">
            <div class="header">
                <div class="company-logo"></div>
                <div class="company-name">${companyName}</div>
                <div>${address}</div>
                <div>Telp: ${phone} | Email: ${email}</div>
                <div>Website: ${website}</div>
                <div>Rekening: ${bankAccount}</div>
                <div class="receipt-title">INVOICE</div>
                <div>No. Receipt: #${receiptNumber}</div>
            </div>

            <div style="margin-bottom: 30px;">
                <div><strong>Customer:</strong> ${sale.customer}</div>
                <div><strong>Email:</strong> ${sale.customerEmail || '-'}</div>
                <div><strong>Phone:</strong> ${sale.customerPhone || '-'}</div>
                <div><strong>Date:</strong> ${formatDate(sale.date)}</div>
                <div><strong>Print Time:</strong> ${formatTime()}</div>
            </div>

            <table>
                <thead>
                    <tr>
                        ${printerSettings.paperSize.startsWith('Thermal') ? `
                        <th style="width: 15%">No</th>
                        <th style="width: 50%">Item</th>
                        <th style="width: 15%" class="text-center">Qty</th>
                        <th style="width: 20%" class="text-right">Total</th>
                        ` : `
                        <th>No</th>
                        <th>Description</th>
                        <th class="text-center">Qty</th>
                        <th class="text-right">Unit Price</th>
                        <th class="text-right">Total</th>
                        `}
                    </tr>
                </thead>
                <tbody>
                    ${relatedSales.map((saleItem, index) => `
                    <tr>
                        ${printerSettings.paperSize.startsWith('Thermal') ? `
                        <td class="text-center">${index + 1}</td>
                        <td><strong>${saleItem.productName.length > 12 ? saleItem.productName.substring(0, 12) + '...' : saleItem.productName}</strong></td>
                        <td class="text-center">${saleItem.quantity}</td>
                        <td class="text-right"><strong>${formatCurrency(saleItem.total)}</strong></td>
                        ` : `
                        <td class="text-center">${index + 1}</td>
                        <td><strong>${saleItem.productName}</strong></td>
                        <td class="text-center">${saleItem.quantity}</td>
                        <td class="text-right">${formatCurrency(saleItem.total / saleItem.quantity)}</td>
                        <td class="text-right"><strong>${formatCurrency(saleItem.total)}</strong></td>
                        `}
                    </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="total-section" style="margin-top: ${printerSettings.paperSize.startsWith('Thermal') ? '5px' : '30px'}; padding: ${printerSettings.paperSize.startsWith('Thermal') ? '3px' : '20px'};">
                ${printerSettings.paperSize.startsWith('Thermal') ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px; font-size: 5px;">
                    <span>Subtotal:</span>
                    <span>${formatCurrency(subtotal)}</span>
                </div>
                ${printerSettings.showTax ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px; font-size: 5px;">
                    <span>Tax (11%):</span>
                    <span>${formatCurrency(tax)}</span>
                </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between; font-size: 5px; font-weight: bold; color: #1e40af;">
                    <span>TOTAL:</span>
                    <span>${formatCurrency(total)}</span>
                </div>
                ` : `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Subtotal:</span>
                    <span>${formatCurrency(subtotal)}</span>
                </div>
                ${printerSettings.showTax ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Tax (11%):</span>
                    <span>${formatCurrency(tax)}</span>
                </div>
                ` : ''}
                <div class="total-final" style="display: flex; justify-content: space-between;">
                    <span>TOTAL:</span>
                    <span>${formatCurrency(total)}</span>
                </div>
                `}
            </div>

            <div style="text-align: center; margin-top: ${printerSettings.paperSize.startsWith('Thermal') ? '3px' : '40px'};">
                ${printerSettings.paperSize.startsWith('Thermal') ? `
                <p style="font-size: 5px;"><strong>Terima Kasih!</strong></p>
                ` : `
                <p><strong>Terima Kasih atas Kepercayaan Anda!</strong></p>
                <p style="font-size: 12px; color: #666; margin-top: 10px;">
                    Untuk pertanyaan lebih lanjut mengenai layanan ini, silakan hubungi kami.
                </p>
                `}
            </div>
        </div>
    </body>
    </html>
  `;
};