import { formatCurrency, formatDate } from './printUtils';

export const generateSalesReportHTML = (sales, dateRange, companyInfo) => {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = sales.length;
  const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // Updated Lababil Solution watermark logo - L containing B design
  const watermarkLogo = `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="blueGradWatermark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e40af;stop-opacity:0.06" />
          <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:0.04" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.02" />
        </linearGradient>
        <linearGradient id="silverGradWatermark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6b7280;stop-opacity:0.05" />
          <stop offset="50%" style="stop-color:#9ca3af;stop-opacity:0.03" />
          <stop offset="100%" style="stop-color:#9ca3af;stop-opacity:0.01" />
        </linearGradient>
      </defs>
      
      <!-- Letter L (3D Blue) - Outer structure -->
      <path d="M50 50 L50 150 L150 150 L150 130 L70 130 L70 50 Z" fill="url(#blueGradWatermark)" stroke="#3b82f6" stroke-width="0.5" stroke-opacity="0.1"/>
      
      <!-- Letter B (3D Silver) - Inside the L -->
      <!-- Main vertical bar of B -->
      <path d="M78 55 L78 115 L98 115 L98 55 Z" fill="url(#silverGradWatermark)"/>
      
      <!-- Top horizontal section of B -->
      <path d="M78 55 L118 55 Q125 55 125 65 Q125 72 120 75 Q115 77 110 77 L78 77 Z" fill="url(#silverGradWatermark)"/>
      
      <!-- Middle divider -->
      <path d="M78 77 L108 77 L108 83 L78 83 Z" fill="url(#silverGradWatermark)"/>
      
      <!-- Bottom horizontal section of B -->
      <path d="M78 83 L130 83 Q145 83 145 100 Q145 110 140 115 Q135 115 125 115 L78 115 Z" fill="url(#silverGradWatermark)"/>
      
      <!-- Add subtle highlight on B for 3D effect -->
      <path d="M80 57 L80 113 L85 113 L85 57 Z" fill="#6b7280" opacity="0.03"/>
      <path d="M80 57 L115 57 Q120 57 120 62 Q120 65 118 67 L80 67 Z" fill="#6b7280" opacity="0.02"/>
      <path d="M80 85 L127 85 Q135 85 135 93 Q135 100 130 103 L80 103 Z" fill="#6b7280" opacity="0.02"/>
      
      <!-- Camera lens outer circle -->
      <circle cx="115" cy="100" r="10" fill="none" stroke="url(#silverGradWatermark)" stroke-width="1.5"/>
      
      <!-- Camera lens inner circle -->
      <circle cx="115" cy="100" r="6" fill="url(#blueGradWatermark)"/>
      
      <!-- Camera lens center -->
      <circle cx="115" cy="100" r="3" fill="#3b82f6" opacity="0.05"/>
      
      <!-- Network elements -->
      <circle cx="95" cy="63" r="2" fill="#3b82f6" opacity="0.04"/>
      <circle cx="102" cy="61" r="1.5" fill="#3b82f6" opacity="0.03"/>
      <circle cx="107" cy="64" r="1.5" fill="#3b82f6" opacity="0.03"/>
      <circle cx="104" cy="69" r="1.5" fill="#3b82f6" opacity="0.03"/>
      
      <!-- Connection lines for network -->
      <line x1="95" y1="63" x2="102" y2="61" stroke="#3b82f6" stroke-width="0.8" opacity="0.03"/>
      <line x1="102" y1="61" x2="107" y2="64" stroke="#3b82f6" stroke-width="0.8" opacity="0.03"/>
      <line x1="107" y1="64" x2="104" y2="69" stroke="#3b82f6" stroke-width="0.8" opacity="0.03"/>
      <line x1="104" y1="69" x2="95" y2="63" stroke="#3b82f6" stroke-width="0.8" opacity="0.03"/>
      
      <!-- Text -->
      <text x="50" y="200" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#1e40af" opacity="0.06">LABABIL</text>
      <text x="50" y="225" font-family="Arial, sans-serif" font-size="18" font-weight="normal" fill="#6b7280" opacity="0.04">solution</text>
    </svg>
  `)}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Laporan Penjualan - ${companyInfo.companyName}</title>
        <style>
            @page {
                size: A4 landscape;
                margin: 15mm;
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                font-size: 12px;
                line-height: 1.4;
                color: #333;
                background: white;
                position: relative;
            }
            
            /* Watermark for landscape report */
            .watermark-bg {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                pointer-events: none;
                background-image: 
                    url('${watermarkLogo}'),
                    url('${watermarkLogo}'),
                    url('${watermarkLogo}'),
                    url('${watermarkLogo}'),
                    url('${watermarkLogo}'),
                    url('${watermarkLogo}');
                background-repeat: no-repeat;
                background-size: 200px 150px;
                background-position: 
                    10% 10%,
                    50% 10%,
                    90% 10%,
                    10% 90%,
                    50% 90%,
                    90% 90%;
                opacity: 0.8;
                transform: rotate(-15deg);
            }
            
            .report-container {
                max-width: 100%;
                margin: 0 auto;
                padding: 20px;
                position: relative;
                background: white;
                z-index: 1;
            }
            
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #3b82f6;
                position: relative;
            }
            
            .company-logo {
                width: 80px;
                height: 60px;
                margin: 0 auto 15px auto;
                background-image: url('${watermarkLogo}');
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;
                opacity: 0.9;
            }
            
            .company-name {
                font-size: 24px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 8px;
            }
            
            .company-info {
                font-size: 11px;
                color: #6b7280;
                margin-bottom: 3px;
            }
            
            .report-title {
                font-size: 20px;
                font-weight: bold;
                margin: 15px 0 8px 0;
                color: #1f2937;
            }
            
            .report-period {
                font-size: 12px;
                color: #6b7280;
                margin-bottom: 20px;
            }
            
            .summary-section {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
                gap: 20px;
            }
            
            .summary-card {
                flex: 1;
                padding: 15px;
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                text-align: center;
            }
            
            .summary-title {
                font-size: 11px;
                color: #64748b;
                margin-bottom: 8px;
                text-transform: uppercase;
                font-weight: 600;
            }
            
            .summary-value {
                font-size: 18px;
                font-weight: bold;
                color: #1e40af;
            }
            
            .sales-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                overflow: hidden;
            }
            
            .sales-table th {
                background-color: #3b82f6;
                color: white;
                padding: 12px 8px;
                text-align: left;
                font-weight: 600;
                font-size: 11px;
            }
            
            .sales-table td {
                padding: 10px 8px;
                border-bottom: 1px solid #e5e7eb;
                font-size: 11px;
            }
            
            .sales-table tr:last-child td {
                border-bottom: none;
            }
            
            .sales-table tr:nth-child(even) {
                background-color: #f8fafc;
            }
            
            .text-right {
                text-align: right;
            }
            
            .text-center {
                text-align: center;
            }
            
            .total-row {
                background-color: #eff6ff !important;
                font-weight: bold;
                border-top: 2px solid #3b82f6;
            }
            
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                font-size: 10px;
                color: #6b7280;
                position: relative;
            }
            
            .footer-logo {
                width: 60px;
                height: 45px;
                margin: 10px auto;
                background-image: url('${watermarkLogo}');
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;
                opacity: 0.7;
            }
            
            .print-info {
                margin-top: 20px;
                font-size: 9px;
                color: #9ca3af;
            }
            
            @media print {
                .report-container {
                    padding: 10px;
                }
                
                .print-info {
                    display: none;
                }
                
                .watermark-bg {
                    display: block !important;
                }
            }
        </style>
    </head>
    <body>
        <!-- Background Watermarks -->
        <div class="watermark-bg"></div>
        
        <div class="report-container">
            <!-- Header -->
            <div class="header">
                <div class="company-logo"></div>
                <div class="company-name">${companyInfo.companyName}</div>
                <div class="company-info">${companyInfo.address}</div>
                <div class="company-info">Telp: ${companyInfo.phone} | Email: ${companyInfo.email}</div>
                <div class="company-info">Website: ${companyInfo.website}</div>
                
                <div class="report-title">LAPORAN PENJUALAN</div>
                <div class="report-period">${dateRange || 'Semua Periode'}</div>
            </div>
            
            <!-- Summary Section -->
            <div class="summary-section">
                <div class="summary-card">
                    <div class="summary-title">Total Revenue</div>
                    <div class="summary-value">${formatCurrency(totalRevenue)}</div>
                </div>
                <div class="summary-card">
                    <div class="summary-title">Total Transaksi</div>
                    <div class="summary-value">${totalTransactions}</div>
                </div>
                <div class="summary-card">
                    <div class="summary-title">Rata-rata Transaksi</div>
                    <div class="summary-value">${formatCurrency(averageTransaction)}</div>
                </div>
                <div class="summary-card">
                    <div class="summary-title">Tanggal Cetak</div>
                    <div class="summary-value" style="font-size: 14px;">${formatDate(new Date().toISOString().split('T')[0])}</div>
                </div>
            </div>
            
            <!-- Sales Table -->
            <table class="sales-table">
                <thead>
                    <tr>
                        <th style="width: 5%;">No</th>
                        <th style="width: 15%;">Tanggal</th>
                        <th style="width: 25%;">Customer</th>
                        <th style="width: 25%;">Produk/Layanan</th>
                        <th style="width: 8%;">Qty</th>
                        <th style="width: 12%;">Harga Satuan</th>
                        <th style="width: 12%;">Total</th>
                        <th style="width: 8%;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${sales.map((sale, index) => `
                        <tr>
                            <td class="text-center">${index + 1}</td>
                            <td>${formatDate(sale.date)}</td>
                            <td>
                                <strong>${sale.customer}</strong>
                                ${sale.customerEmail ? `<br><small>${sale.customerEmail}</small>` : ''}
                            </td>
                            <td>
                                <strong>${sale.productName}</strong>
                                ${sale.notes ? `<br><small style="color: #6b7280;">${sale.notes}</small>` : ''}
                            </td>
                            <td class="text-center">${sale.quantity}</td>
                            <td class="text-right">${formatCurrency(sale.total / sale.quantity)}</td>
                            <td class="text-right"><strong>${formatCurrency(sale.total)}</strong></td>
                            <td class="text-center">
                                <span style="background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 10px; font-size: 9px;">
                                    ${sale.status || 'Completed'}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                    
                    <!-- Total Row -->
                    <tr class="total-row">
                        <td colspan="6" class="text-right"><strong>TOTAL KESELURUHAN:</strong></td>
                        <td class="text-right"><strong>${formatCurrency(totalRevenue)}</strong></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            
            <!-- Product Summary -->
            <div style="margin-bottom: 30px;">
                <h3 style="font-size: 14px; margin-bottom: 15px; color: #1f2937;">Ringkasan Produk/Layanan:</h3>
                <table class="sales-table">
                    <thead>
                        <tr>
                            <th>Produk/Layanan</th>
                            <th class="text-center">Jumlah Terjual</th>
                            <th class="text-right">Total Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(
                            sales.reduce((acc, sale) => {
                                if (!acc[sale.productName]) {
                                    acc[sale.productName] = { quantity: 0, total: 0 };
                                }
                                acc[sale.productName].quantity += sale.quantity;
                                acc[sale.productName].total += sale.total;
                                return acc;
                            }, {})
                        ).map(([product, data]) => `
                            <tr>
                                <td><strong>${product}</strong></td>
                                <td class="text-center">${data.quantity}</td>
                                <td class="text-right"><strong>${formatCurrency(data.total)}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <div class="footer-logo"></div>
                <p><strong>${companyInfo.companyName}</strong></p>
                <p>Laporan ini dibuat secara otomatis oleh sistem penjualan digital</p>
                
                <div class="print-info">
                    Dicetak pada: ${new Date().toLocaleString('id-ID')}<br>
                    Powered by Lababil Solution Sales System
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

export const printSalesReport = (sales, dateRange, companyInfo) => {
  const reportHTML = generateSalesReportHTML(sales, dateRange, companyInfo);
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(reportHTML);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Close window after printing
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 1000);
    };
  } else {
    // Fallback if popup blocked
    alert('Pop-up diblokir! Silakan aktifkan pop-up untuk fitur print laporan.');
  }
};

export const downloadSalesReport = (sales, dateRange, companyInfo) => {
  const reportHTML = generateSalesReportHTML(sales, dateRange, companyInfo);
  
  try {
    // Create blob from HTML
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    const fileName = `laporan-penjualan-${new Date().toISOString().split('T')[0]}.html`;
    link.download = fileName;
    link.click();
    
    // Cleanup
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading sales report:', error);
    alert('Gagal download laporan. Silakan coba lagi.');
  }
};