# 🖨️ Panduan Fitur Print - Lababil Solution

## 📋 Fitur Print yang Tersedia

### 1. **Print Receipt Individual** 
- Print kwitansi untuk setiap transaksi penjualan
- Format profesional dengan header company
- Include customer info, product details, dan total pembayaran
- Auto calculate PPN (11%)

### 2. **Print Sales Report**
- Laporan lengkap semua penjualan
- Summary statistics (total revenue, jumlah transaksi, rata-rata)
- Detail setiap transaksi dalam format tabel
- Ringkasan produk terlaris
- Format landscape untuk data lengkap

### 3. **Download Options**
- Download receipt sebagai HTML file
- Download sales report sebagai HTML file
- Bisa dibuka offline atau diedit sesuai kebutuhan

## 🎯 Cara Menggunakan

### Print Receipt:
1. **Dari Dashboard:**
   - Lihat "Penjualan Terbaru"
   - Klik tombol **Printer icon** di sebelah setiap transaksi
   - Preview modal akan muncul
   - Klik **"Print Receipt"**

2. **Dari Tab Sales:**
   - Buka tab "Penjualan"
   - Klik **Printer icon** di kolom "Aksi"
   - Modal preview akan terbuka
   - Pilih **Print** atau **Download**

### Print Sales Report:
1. **Di Tab Sales:**
   - Klik tombol **"Print Laporan"** (ungu)
   - Report akan otomatis terbuka di window baru
   - Browser akan otomatis trigger print dialog

2. **Download Report:**
   - Klik tombol **"Download Laporan"** (orange)
   - File HTML akan terdownload otomatis

## 📄 Format Receipt

### Header Information:
```
[COMPANY LOGO/NAME]
Lababil Solution
Jakarta, Indonesia
Telp: +62 21-1234-5678 | Email: info@lababilsolution.com
Website: www.lababilsolution.com

RECEIPT / KWITANSI
No. Receipt: #[TRANSACTION_ID]
```

### Customer & Transaction Info:
- Nama Customer
- Email & Phone (jika ada)  
- Tanggal transaksi
- Status pembayaran
- Metode pembayaran

### Product Details:
| No | Deskripsi | Qty | Harga Satuan | Total |
|----|-----------|-----|--------------|-------|
| 1  | Website Development | 1 | Rp 5.000.000 | Rp 5.000.000 |

### Total Section:
- Subtotal
- PPN (11%)
- **TOTAL PEMBAYARAN**

### Footer:
- Thank you message
- Contact info untuk follow-up
- Garansi information

## 📊 Format Sales Report

### Summary Cards:
- Total Revenue
- Total Transaksi  
- Rata-rata Transaksi
- Tanggal Cetak

### Detailed Table:
| No | Tanggal | Customer | Produk/Layanan | Qty | Harga Satuan | Total | Status |
|----|---------|----------|----------------|-----|--------------|-------|--------|

### Product Summary:
Ringkasan penjualan per produk/layanan:
- Jumlah terjual
- Total revenue per produk

## 🛠️ Technical Features

### Print Styling:
- **Responsive design** untuk berbagai ukuran kertas
- **Print-optimized CSS** dengan `@media print`
- **A4 portrait** untuk receipt
- **A4 landscape** untuk sales report
- **Professional formatting** dengan proper margins

### Browser Compatibility:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox  
- ✅ Safari
- ⚠️ Internet Explorer (limited support)

### Print Options:
- **Auto-open print dialog**
- **Auto-close window** setelah print
- **Fallback handling** jika popup diblokir
- **Error handling** untuk berbagai scenarios

## 🎨 Customization

### Company Info (dapat diubah di code):
```javascript
const companyInfo = {
  companyName: 'Lababil Solution',
  address: 'Jakarta, Indonesia', 
  phone: '+62 21-1234-5678',
  email: 'info@lababilsolution.com',
  website: 'www.lababilsolution.com'
};
```

### Tax Rate (PPN):
Default 11%, dapat diubah di `printUtils.js`:
```javascript
const tax = sale.total * 0.11; // Change 0.11 to desired rate
```

## 🔧 Troubleshooting

### Print Dialog Tidak Muncul:
- **Enable pop-ups** di browser settings
- Check **popup blocker** settings
- Coba gunakan browser lain (Chrome recommended)

### Format Print Berantakan:
- Pastikan ukuran kertas **A4**
- Set margins ke **default/minimum**
- Check print preview sebelum print
- Gunakan **"More settings"** untuk custom options

### Download Gagal:
- Check **download permissions** di browser
- Pastikan ada space tersedia di storage
- Coba clear browser cache
- Restart browser jika perlu

## 📱 Mobile Considerations

### Mobile Print:
- Print function akan buka **share dialog** di mobile
- Bisa save as PDF atau share ke printer apps
- Responsive design tetap optimal di mobile browser

### Best Practices:
- Test print di desktop dulu
- Use **"Save as PDF"** option di mobile
- Share PDF ke email untuk print nanti

## 🚀 Future Enhancements

### Planned Features:
- [ ] PDF generation (instead of HTML)
- [ ] Email receipt functionality  
- [ ] Print templates customization
- [ ] Batch print multiple receipts
- [ ] QR code integration
- [ ] Digital signature support

### Advanced Options:
- [ ] Print server integration
- [ ] Thermal printer support
- [ ] Barcode/SKU integration
- [ ] Multi-language receipts

## 📞 Support

### Jika ada masalah print:
1. **Check browser console** untuk error messages
2. **Test di browser lain** (Chrome recommended)
3. **Check printer connection** dan settings
4. **Contact developer** jika issue persist

### Contact Info:
- Email: dev@lababilsolution.com
- Phone: +62 21-1234-5678
- Website: www.lababilsolution.com/support

---

**Aplikasi Lababil Solution - Professional Sales Management System** 🚀
