# Petunjuk Praktikum 6 — Percobaan 4: Penghapusan Data Asinkron Menggunakan Fetch DELETE & Live Search Debounce

## 1. Tujuan Pembelajaran
Mahasiswa mampu:
1. Mengimplementasikan konfirmasi penghapusan data interaktif menggunakan `confirm()`.
2. Mengirimkan permintaan HTTP `DELETE` ke REST API via `fetch(`${API_URL}?id=${id}`, { method: 'DELETE' })`.
3. Memperbarui tabel data secara instan tanpa reload browser setelah record terhapus dari MySQL.
4. Menerapkan teknik optimasi performa **Debouncing 300ms** pada input pencarian langsung (*live search*).

---

## 2. File Kerja
- Berkas target edit: `js/app.js`
- Elemen target: Tombol aksi Hapus pada tabel dan input `#input-search` pada toolbar.

---

## 3. Instruksi Pengerjaan
Buka berkas `js/app.js` dan lengkapi dua fitur terakhir:

### 1. Fungsi Hapus Record Asinkron: `deleteMahasiswa(id, nama)`
```javascript
// 5. Fetch API DELETE: Menghapus Data Secara Asinkron
async function deleteMahasiswa(id, nama) {
    if (!confirm(`Apakah Anda yakin ingin menghapus mahasiswa "${nama}"?`)) return;

    try {
        const response = await fetch(`${API_URL}?id=${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        if (response.ok && result.status === 'success') {
            showAlert(result.message, 'success');
            loadMahasiswa(); // Refresh data otomatis
        } else {
            showAlert(result.message || 'Gagal menghapus data', 'danger');
        }
    } catch (error) {
        showAlert(`Gagal menghapus: ${error.message}`, 'danger');
    }
}
```

### 2. Live Search dengan Debouncing 300ms
```javascript
// 6. Pencarian Real-Time (Live Search via Fetch API)
if (inputSearch) {
    let timer = null;
    inputSearch.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            loadMahasiswa(inputSearch.value.trim());
        }, 300);
    });
}
```

---

## 4. Cara Pengujian
1. **Uji Fitur Hapus**:
   - Klik tombol **Hapus** merah pada salah satu mahasiswa.
   - Dialog konfirmasi peramban akan muncul meminta persetujuan.
   - Klik **OK**, amati bahwa record langsung hilang dari tabel dan total badge counter berkurang.
2. **Uji Live Search Debouncing**:
   - Buka tab Network pada Inspect Element (F12) peramban Anda.
   - Ketikkan nama mahasiswa pada kolom pencarian secara cepat.
   - Perhatikan bahwa request HTTP ke `api/mahasiswa.php?search=...` hanya terkirim 1 kali setelah Anda berhenti mengetik selama minimal 300 milidetik.
