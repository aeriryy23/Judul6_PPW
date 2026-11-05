/**
 * Praktikum 6: Komunikasi Data Asinkron Menggunakan AJAX & Fetch API
 * Sistem Informasi Data Mahasiswa (SIMA) - Waktu Praktikum: 90 Menit
 */

//Deklarasikan endpoint API 

// 1. Seleksi Elemen DOM Utama
const tabelBody = document.getElementById('tabel-body-mahasiswa');
const inputSearch = document.getElementById('input-search');
const totalBadge = document.getElementById('total-mahasiswa-badge');


// Helper: Menampilkan Pesan Notifikasi Dinamis
function showAlert(message, type = 'success') {
   
}

// 2. Fetch API GET: Mengambil Data Mahasiswa dari Server
async function loadMahasiswa(keyword = '') {

    // tampilkan indikator loading
    tabelBody.innerHTML = ``;

    try {

        //Percobaan 6-1 Langkah 4 susun url request
        
        //Percobaan 6-1 Langkah 4 kirim request
        
        //Percobaan 6-1 Langkah 4 kirim ekstrak json 

      
    } catch (error) {
        tabelBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px; color: #ef4444;">
                    Gagal memuat data dari REST API: ${error.message}
                </td>
            </tr>
        `;
    }
}

// 3. Render Baris Tabel Dinamis ke DOM
function renderTable(mahasiswaList = [], keyword = '') {
    tabelBody.innerHTML = '';

    if (totalBadge) totalBadge.textContent = mahasiswaList.length;
    if (totalInfo) {
        totalInfo.textContent = keyword 
            ? `Ditemukan ${mahasiswaList.length} mahasiswa untuk "${keyword}"`
            : `Menampilkan ${mahasiswaList.length} mahasiswa`;
    }

    if (mahasiswaList.length === 0) {
        tabelBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px; color: var(--text-muted);">
                    Tidak ada data mahasiswa yang cocok.
                </td>
            </tr>
        `;
        return;
    }

    mahasiswaList.forEach((mhs, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <img src="img/avatar-default.svg" alt="Foto ${mhs.nama}" class="avatar-img" width="36" height="36">
            </td>
            <td><strong>${mhs.npm}</strong></td>
            <td>${mhs.nama}</td>
            <td><span class="badge">${mhs.program_studi}</span></td>
            <td>${mhs.angkatan}</td>
            <td><a href="mailto:${mhs.email}" class="link-email">${mhs.email}</a></td>
            <td>
                <button type="button" class="btn btn-warning btn-sm" onclick="openEditModal(${mhs.id})">Edit</button>
                <button type="button" class="btn btn-danger btn-sm" onclick="deleteMahasiswa(${mhs.id}, '${mhs.nama}')">Hapus</button>
            </td>
        `;
        tabelBody.appendChild(tr);
    });
}

// Elemen DOM Modal Edit
const modalEdit = document.getElementById('modal-edit');
const formEdit = document.getElementById('form-edit-mahasiswa');
const editId = document.getElementById('edit-id');
const editnpm = document.getElementById('edit-npm');
const editNama = document.getElementById('edit-nama');
const editProdi = document.getElementById('edit-prodi');
const editAngkatan = document.getElementById('edit-angkatan');
const editEmail = document.getElementById('edit-email');

async function openEditModal(id) {
    try {
        // Percobaan 6-3 Langkah 2

        if (response.ok && result.data) {
                       
            // Percobaan 6-3 Langkah 3
            
        } else {
            showAlert(result.message || 'Gagal memuat detail mahasiswa', 'danger');
        }
    } catch (err) {
        showAlert(`Kesalahan jaringan: ${err.message}`, 'danger');
    }
}

function closeEditModal() {
     // Percobaan 6-3 Langkah 4
     
}

if (modalEdit) {
    modalEdit.addEventListener('click', function (e) {
        if (e.target === modalEdit) closeEditModal();
    });
}

if (formEdit) {
    formEdit.addEventListener('submit', async function (e) {
        e.preventDefault();
        const id = editId.value;
        const payload = {
            npm: editnpm.value.trim(),
            nama: editNama.value.trim(),
            program_studi: editProdi.value,
            angkatan: parseInt(editAngkatan.value, 10),
            email: editEmail.value.trim()
        };

        try {
             // Percobaan 6-3 Langkah 5

            if (res.ok && data.status === 'success') {
             // Percobaan 6-3 Langkah 6   
            } else {
                showAlert(data.message || 'Gagal memperbarui data', 'danger');
            }
        } catch (err) {
            showAlert(`Kesalahan jaringan: ${err.message}`, 'danger');
        }
    });
}

// 4. Fetch API POST: Menambahkan Data Baru Tanpa Reload
if (formTambah) {
    formTambah.addEventListener('submit', async function (event) {
        // Percobaan 6-2 Langkah 3 

        const dataMahasiswa = {
            // Percobaan 6-2 Langkah 4

        };

        try {
            // Percobaan 6-2 Langkah 5
            
            if (response.ok && result.status === 'success') {
                showAlert(result.message, 'success');
                formTambah.reset();
                loadMahasiswa(); // Refresh data otomatis
            } else {
                showAlert(result.message || 'Gagal menyimpan data', 'danger');
            }
        } catch (error) {
            showAlert(`Terjadi kesalahan koneksi: ${error.message}`, 'danger');
        }
    });
}

// 5. Fetch API DELETE: Menghapus Data Secara Asinkron
async function deleteMahasiswa(id, nama) {
    // Percobaan 6-4 Langkah 2
    
    try {
        // Percobaan 6-4 Langkah 3
        
        // Percobaan 6-4 Langkah 4

        
    } catch (error) {
        showAlert(`Gagal menghapus: ${error.message}`, 'danger');
    }
}

// 6. Pencarian Real-Time (Live Search via Fetch API)
if (inputSearch) {
    let timer = null;
    inputSearch.addEventListener('input', function () {
    // Percobaan 6-4 Langkah 5

    });
}

// Inisialisasi: Panggil Data Pertama Kali
