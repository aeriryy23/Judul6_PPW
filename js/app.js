
/**
 * Praktikum 6: Komunikasi Data Asinkron Menggunakan AJAX & Fetch API
 * Sistem Informasi Data Mahasiswa (SIMA)
 */

// Deklarasikan endpoint API
const API_URL = '/api/mahasiswa.php';

// 1. Seleksi Elemen DOM Utama
const tabelBody = document.getElementById('tabel-body-mahasiswa');
const inputSearch = document.getElementById('input-search');
const totalBadge = document.getElementById('total-mahasiswa-badge');
const totalInfo = document.getElementById('total-mahasiswa-info');
const formTambah = document.getElementById('form-tambah-mahasiswa');
const alertBox = document.getElementById('alert-box');

// 2. Helper: Menampilkan Notifikasi
function showAlert(message, type = 'success') {
    if (!alertBox) return;

    alertBox.textContent = message;
    alertBox.className = `alert-box alert-${type}`;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 4000);
}

// Helper: Membaca respons JSON
async function getJSON(response) {
    const text = await response.text();

    try {
        return JSON.parse(text);
    } catch {
        throw new Error(
            `Respons server bukan JSON. Periksa file PHP. HTTP ${response.status}`
        );
    }
}

// 3. Fetch API GET: Mengambil Data Mahasiswa
async function loadMahasiswa(keyword = '') {

    if (!tabelBody) {
        console.error('Elemen tabel-body-mahasiswa tidak ditemukan.');
        return;
    }

    tabelBody.innerHTML = `
        <tr>
            <td colspan="8" style="text-align:center; padding:20px;">
                Memuat data dari server...
            </td>
        </tr>
    `;

    try {
        const url = keyword
            ? `${API_URL}?search=${encodeURIComponent(keyword)}`
            : API_URL;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        const result = await getJSON(response);

        if (!response.ok) {
            throw new Error(result.message || `HTTP Error: ${response.status}`);
        }

        console.log('Data dari REST API:', result);

        if (result.status === 'success') {

            // Pastikan data berbentuk array
            const mahasiswaList = Array.isArray(result.data)
                ? result.data
                : [];

            renderTable(mahasiswaList, keyword);

        } else {
            throw new Error(result.message || 'Gagal mengambil data mahasiswa.');
        }

    } catch (error) {
        console.error('Gagal memuat data:', error);

        tabelBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center; padding:20px; color:#ef4444;">
                    Gagal memuat data dari REST API: ${error.message}
                </td>
            </tr>
        `;

        if (totalBadge) totalBadge.textContent = '0';
        if (totalInfo) totalInfo.textContent = 'Gagal mengambil data mahasiswa';
    }
}

// 4. Render Data Mahasiswa ke Tabel
function renderTable(mahasiswaList = [], keyword = '') {

    tabelBody.innerHTML = '';

    if (totalBadge) {
        totalBadge.textContent = mahasiswaList.length;
    }

    if (totalInfo) {
        totalInfo.textContent = keyword
            ? `Ditemukan ${mahasiswaList.length} mahasiswa untuk "${keyword}"`
            : `Menampilkan ${mahasiswaList.length} mahasiswa`;
    }

    if (mahasiswaList.length === 0) {
        tabelBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center; padding:20px;">
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
                <img
                    src="img/avatar-default.svg"
                    alt="Foto mahasiswa"
                    class="avatar-img"
                    width="36"
                    height="36"
                >
            </td>

            <td><strong>${mhs.npm ?? ''}</strong></td>

            <td>${mhs.nama ?? ''}</td>

            <td>
                <span class="badge">${mhs.program_studi ?? ''}</span>
            </td>

            <td>${mhs.angkatan ?? ''}</td>

            <td>
                <a href="mailto:${mhs.email ?? ''}" class="link-email">
                    ${mhs.email ?? ''}
                </a>
            </td>

            <td>
                <button
                    type="button"
                    class="btn btn-warning btn-sm"
                    onclick="openEditModal(${Number(mhs.id)})">
                    Edit
                </button>

                <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    onclick="deleteMahasiswa(${Number(mhs.id)}, ${JSON.stringify(String(mhs.nama ?? ''))})">
                    Hapus
                </button>
            </td>
        `;

        tabelBody.appendChild(tr);
    });
}

// 5. Seleksi Elemen Modal Edit
const modalEdit = document.getElementById('modal-edit');
const formEdit = document.getElementById('form-edit-mahasiswa');

const editId = document.getElementById('edit-id');
const editnpm = document.getElementById('edit-npm');
const editNama = document.getElementById('edit-nama');
const editProdi = document.getElementById('edit-prodi');
const editAngkatan = document.getElementById('edit-angkatan');
const editEmail = document.getElementById('edit-email');

// 6. Fetch API GET: Mengambil Detail Mahasiswa
async function openEditModal(id) {

    try {
        const response = await fetch(`${API_URL}?id=${id}`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        const result = await getJSON(response);

        if (!response.ok || result.status !== 'success' || !result.data) {
            throw new Error(result.message || 'Gagal memuat detail mahasiswa.');
        }

        const mahasiswa = result.data;

        editId.value = mahasiswa.id;
        editnpm.value = mahasiswa.npm;
        editNama.value = mahasiswa.nama;
        editProdi.value = mahasiswa.program_studi;
        editAngkatan.value = mahasiswa.angkatan;
        editEmail.value = mahasiswa.email;

        modalEdit.classList.add('active');

    } catch (error) {
        showAlert(error.message, 'danger');
        console.error(error);
    }
}

// 7. Menutup Modal Edit
function closeEditModal() {

    if (modalEdit) {
        modalEdit.classList.remove('active');
    }
}

if (modalEdit) {
    modalEdit.addEventListener('click', function (event) {

        if (event.target === modalEdit) {
            closeEditModal();
        }

    });
}

// 8. Fetch API PUT: Memperbarui Data Mahasiswa
if (formEdit) {

    formEdit.addEventListener('submit', async function (event) {

        event.preventDefault();

        const id = editId.value;

        const payload = {
            npm: editnpm.value.trim(),
            nama: editNama.value.trim(),
            program_studi: editProdi.value,
            angkatan: parseInt(editAngkatan.value, 10),
            email: editEmail.value.trim()
        };

        try {

            const response = await fetch(`${API_URL}?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await getJSON(response);

            if (!response.ok || result.status !== 'success') {
                throw new Error(result.message || 'Gagal memperbarui data.');
            }

            showAlert(result.message || 'Data berhasil diperbarui.', 'success');

            closeEditModal();
            loadMahasiswa();

        } catch (error) {
            showAlert(error.message, 'danger');
            console.error(error);
        }

    });
}

// 9. Fetch API POST: Menambahkan Data Mahasiswa
if (formTambah) {

    formTambah.addEventListener('submit', async function (event) {

        event.preventDefault();

        const dataMahasiswa = {
            npm: document.getElementById('npm').value.trim(),
            nama: document.getElementById('nama').value.trim(),
            program_studi: document.getElementById('program_studi').value,
            angkatan: parseInt(
                document.getElementById('angkatan').value,
                10
            ),
            email: document.getElementById('email').value.trim()
        };

        try {

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dataMahasiswa)
            });

            const result = await getJSON(response);

            if (!response.ok || result.status !== 'success') {
                throw new Error(result.message || 'Gagal menyimpan data.');
            }

            showAlert(result.message || 'Mahasiswa berhasil ditambahkan.', 'success');

            formTambah.reset();

            loadMahasiswa();

        } catch (error) {
            showAlert(error.message, 'danger');
            console.error(error);
        }

    });
}

// 10. Fetch API DELETE: Menghapus Data Mahasiswa
async function deleteMahasiswa(id, nama) {

    const konfirmasi = confirm(
        `Apakah Anda yakin ingin menghapus mahasiswa "${nama}"?`
    );

    if (!konfirmasi) return;

    try {

        const response = await fetch(`${API_URL}?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        });

        const result = await getJSON(response);

        if (!response.ok || result.status !== 'success') {
            throw new Error(result.message || 'Gagal menghapus data.');
        }

        showAlert(result.message || 'Data berhasil dihapus.', 'success');

        loadMahasiswa();

    } catch (error) {
        showAlert(error.message, 'danger');
        console.error(error);
    }
}

// 11. Live Search: Pencarian Real-Time
if (inputSearch) {

    let timer = null;

    inputSearch.addEventListener('input', function () {

        clearTimeout(timer);

        timer = setTimeout(() => {
            loadMahasiswa(inputSearch.value.trim());
        }, 300);

    });
}

// 12. Inisialisasi: Memuat Data Pertama Kali
document.addEventListener('DOMContentLoaded', function () {
    loadMahasiswa();
});
