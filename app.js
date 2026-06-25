/* 
  =========================================
  PUSKESPHARMA MAIN APPLICATION JAVASCRIPT (PRICELESS & DUAL-NAV)
  =========================================
*/

// --- STATE MANAGEMENT ---
let state = {
  medicines: [],
  customers: [],
  sales: [],
  mutations: [],
  subUnitStocks: {}, // Structure: { 'Unit Name': { 'OB-001': 10, ... } }
  settings: {
    name: "Puskesmas Kecamatan Sehat",
    address: "Jl. Kesehatan Raya No. 12, DKI Jakarta",
    phone: "021-4321098",
    kepala: "dr. Hendra Wijaya, M.Kes",
    kepalaNip: "197805122006041003",
    apoteker: "Apt. Sarah Annisa, S.Farm",
    apotekerSipa: "19941020/SIPA-31.71/2022/1054",
    footer: "Simpan obat di tempat kering dan sejuk.\nJauhkan dari jangkauan anak-anak.\nSemoga lekas sembuh!",
    logo: null
  },
  credentials: {
    admin: { username: "admin", password: "admin123" }
  },
  theme: {
    mode: "light",
    accent: "teal"
  },
  stockMovements: [],
  opnames: []
};

let cart = [];
let mutationCart = [];
let currentCategoryFilter = "all";
let salesChartInstance = null;

// --- DUMMY DATA FOR INITIALIZATION ---
const defaultMedicines = [
  { code: "OB-001", name: "Oralit", category: "Obat Bebas Terbatas", stock: 66, unit: "tablet", expiry: "2028-07-31", batch: "012BE" },
  { code: "OB-002", name: "Zinc", category: "Obat Bebas Terbatas", stock: 100, unit: "tablet", expiry: "2027-12-31", batch: "05-350" },
  { code: "OB-003", name: "paracetamol", category: "Obat Bebas", stock: -30, unit: "tablet", expiry: "2026-05-13", batch: "464" },
  { code: "OB-004", name: "Calcium lactate", category: "Obat Bebas", stock: 300, unit: "tablet", expiry: "2028-03-31", batch: "AS0483" },
  { code: "OB-005", name: "FE", category: "Obat Bebas", stock: 390, unit: "tablet", expiry: "2027-04-16", batch: "Q5D27" },
  { code: "OB-006", name: "Diazepam 2mg Tablet", category: "Psikotropika/Narkotika", stock: 45, unit: "tablet", expiry: "2026-05-10", batch: "B-DZP02" },
  { code: "OB-007", name: "Salbutamol Inhaler 100mcg", category: "Obat Keras", stock: 0, unit: "botol", expiry: "2026-10-30", batch: "B-SBT01" },
  { code: "OB-008", name: "Vitamin B Kompleks", category: "Obat Bebas", stock: 600, unit: "tablet", expiry: "2027-06-30", batch: "B-VBK14" },
  { code: "OB-009", name: "Kasa Steril 16cm x 16cm", category: "Alat Kesehatan", stock: 80, unit: "pcs", expiry: "2031-12-31", batch: "B-KSS09" },
  { code: "OB-010", name: "Cetirizine 10mg Tablet", category: "Obat Bebas Terbatas", stock: 8, unit: "tablet", expiry: "2026-10-01", batch: "B-CTZ21" }
];

const defaultStockMovements = [
  // Oralit
  {
    date: "2026-06-20",
    medicineName: "Oralit",
    batch: "012BE",
    origin: "Resep UMUM",
    type: "resep",
    direction: "keluar",
    qty: 5,
    expiry: "2028-07-31"
  },
  // Zinc
  {
    date: "2026-06-20",
    medicineName: "Zinc",
    batch: "05-350",
    origin: "Resep UMUM",
    type: "resep",
    direction: "keluar",
    qty: 20,
    expiry: "2027-12-31"
  },
  {
    date: "2026-06-20",
    medicineName: "Zinc",
    batch: "05-350",
    origin: "Resep BPJS",
    type: "resep",
    direction: "keluar",
    qty: 20,
    expiry: "2027-12-31"
  },
  {
    date: "2026-06-20",
    medicineName: "Zinc",
    batch: "05-350",
    origin: "Pembatalan Resep UMUM",
    type: "resep",
    direction: "keluar",
    qty: 0,
    expiry: "2027-12-31"
  },
  {
    date: "2026-06-20",
    medicineName: "Zinc",
    batch: "05-350",
    origin: "Resep UMUM",
    type: "resep",
    direction: "keluar",
    qty: 0,
    expiry: "2027-12-31"
  },
  {
    date: "2026-06-20",
    medicineName: "Zinc",
    batch: "05-350",
    origin: "Resep UMUM",
    type: "gudang",
    direction: "masuk",
    qty: 10,
    expiry: "2027-12-31"
  },
  // paracetamol
  {
    date: "2026-06-20",
    medicineName: "paracetamol",
    batch: "464",
    origin: "Koreksi Amprahan Posyandu",
    type: "amprahan",
    direction: "masuk",
    qty: 270,
    expiry: "2026-05-13"
  },
  {
    date: "2026-06-20",
    medicineName: "paracetamol",
    batch: "464",
    origin: "Amprahan Posyandu",
    type: "amprahan",
    direction: "keluar",
    qty: 300,
    expiry: "2026-05-13"
  },
  // Calcium lactate
  {
    date: "2026-06-20",
    medicineName: "Calcium lactate",
    batch: "AS0483",
    origin: "Amprahan Posyandu",
    type: "amprahan",
    direction: "keluar",
    qty: 50,
    expiry: "2028-03-31"
  },
  // FE
  {
    date: "2026-06-20",
    medicineName: "FE",
    batch: "Q5D27",
    origin: "Amprahan Posyandu",
    type: "amprahan",
    direction: "keluar",
    qty: 100,
    expiry: "2027-04-16"
  },
  {
    date: "2026-06-20",
    medicineName: "FE",
    batch: "Q5D27",
    origin: "Resep BPJS",
    type: "resep",
    direction: "keluar",
    qty: 30,
    expiry: "2027-04-16"
  },
  {
    date: "2026-06-20",
    medicineName: "FE",
    batch: "Q5D27",
    origin: "Resep BPJS",
    type: "resep",
    direction: "keluar",
    qty: 0,
    expiry: "2027-04-16"
  }
];

const defaultOpnames = [
  {
    date: "2026-06-20",
    code: "OB-002",
    medicineName: "Zinc",
    batch: "05-350",
    systemStock: 90,
    physicalStock: 100,
    difference: 10,
    reason: "Koreksi Selisih",
    notes: "Ditemukan selisih hitung 10 pcs saat audit rutin mingguan.",
    cashier: "Sarah Annisa (Apoteker)"
  }
];

const defaultCustomers = [
  { rm: "RM-10201", name: "Budi Santoso", insurance: "BPJS", phone: "081234567890", transactions: 3 },
  { rm: "RM-10202", name: "Siti Rahmawati", insurance: "BPJS", phone: "085698765432", transactions: 2 },
  { rm: "RM-10203", name: "Andi Wijaya", insurance: "Umum", phone: "087811223344", transactions: 1 },
  { rm: "RM-10204", name: "Sri Lestari", insurance: "BPJS", phone: "089988776655", transactions: 4 }
];

const generateDummySales = () => {
  return [
    // 2026-06-20 (4 sheets, 10 items, 10 generic, non-generic: -)
    { invoice: "B10", date: "2026-06-20T10:30:15", customer: "Budi Santoso", rm: "RM-10201", insurance: "Umum", itemsCount: 5, cashier: "Sarah (Apoteker)", items: [{ name: "Acetylsistein 200mg Tablet", qty: 5, dosage: "3 x 1 tablet sehari" }], doctor: "dr. Herman Sp.PD", poli: "Poli Umum", sheetCount: 2, genericCount: 5, nonGenericNames: "" },
    { invoice: "B12", date: "2026-06-20T11:45:22", customer: "Sri Lestari", rm: "RM-10204", insurance: "Umum", itemsCount: 5, cashier: "Sarah (Apoteker)", items: [{ name: "Akita", qty: 5, dosage: "2 x 1 tablet sehari" }], doctor: "dr. Rian (KIA)", poli: "Poli KIA/KB", sheetCount: 2, genericCount: 5, nonGenericNames: "" },

    // 2026-06-19 (2 sheets, 9 items, 9 generic, non-generic: -)
    { invoice: "RSP-260619-001", date: "2026-06-19T10:05:12", customer: "Andi Wijaya", rm: "RM-10203", insurance: "Umum", itemsCount: 9, cashier: "Sarah (Apoteker)", items: [{ name: "Vitamin B Kompleks", qty: 9, dosage: "1 x 1 tablet sehari" }], doctor: "dr. Herman Sp.PD", poli: "Poli Umum", sheetCount: 2, genericCount: 9, nonGenericNames: "" },

    // 2026-06-18 (2 sheets, 7 items, 7 generic, non-generic: -)
    { invoice: "RSP-260618-001", date: "2026-06-18T16:22:50", customer: "Sri Lestari", rm: "RM-10204", insurance: "Umum", itemsCount: 7, cashier: "Sarah (Apoteker)", items: [{ name: "Paracetamol 500mg Tablet", qty: 7, dosage: "3 x 1 tablet sehari" }], doctor: "dr. Rian (KIA)", poli: "Poli KIA/KB", sheetCount: 2, genericCount: 7, nonGenericNames: "" },

    // 2026-06-17 (3 sheets, 7 items, 7 generic, non-generic: Biolysin Syr)
    { invoice: "RSP-260617-001", date: "2026-06-17T11:42:05", customer: "Budi Santoso", rm: "RM-10201", insurance: "Umum", itemsCount: 7, cashier: "Sarah (Apoteker)", items: [{ name: "Amoxicillin 500mg Kaplet", qty: 7, dosage: "3 x 1 tablet sehari" }], doctor: "dr. Herman Sp.PD", poli: "Poli Umum", sheetCount: 3, genericCount: 7, nonGenericNames: "Biolysin Syr" },

    // 2026-06-12 (1 sheet, 1 item, 1 generic, non-generic: -)
    { invoice: "RSP-260612-001", date: "2026-06-12T14:30:10", customer: "Umum Non-RM", rm: "UMUM-001", insurance: "Umum", itemsCount: 1, cashier: "Sarah (Apoteker)", items: [{ name: "Kasa Steril 16cm x 16cm", qty: 1, dosage: "Gunakan untuk membalut luka" }], doctor: "drg. Shinta", poli: "Poli Gigi & Mulut", sheetCount: 1, genericCount: 1, nonGenericNames: "" },

    // 2026-06-02 (5 sheets, 17 items, 17 generic, non-generic: -)
    { invoice: "RSP-260602-001", date: "2026-06-02T09:15:22", customer: "Siti Rahmawati", rm: "RM-10202", insurance: "Umum", itemsCount: 17, cashier: "Sarah (Apoteker)", items: [{ name: "Vitamin B Kompleks", qty: 17, dosage: "1 x 1 tablet sehari" }], doctor: "dr. Herman Sp.PD", poli: "Poli Umum", sheetCount: 5, genericCount: 17, nonGenericNames: "" },

    // 2026-05-31 (1 sheet, 4 items, 4 generic, non-generic: -)
    { invoice: "RSP-260531-001", date: "2026-05-31T15:20:00", customer: "Andi Wijaya", rm: "RM-10203", insurance: "Umum", itemsCount: 4, cashier: "Sarah (Apoteker)", items: [{ name: "Paracetamol 500mg Tablet", qty: 4, dosage: "3 x 1 tablet sehari" }], doctor: "dr. Herman Sp.PD", poli: "Poli Umum", sheetCount: 1, genericCount: 4, nonGenericNames: "" },

    // Add some BPJS sales
    { invoice: "RSP-260621-001", date: "2026-06-21T10:30:15", customer: "Budi Santoso", rm: "RM-10201", insurance: "BPJS", itemsCount: 2, cashier: "Sarah (Apoteker)", items: [{ name: "Amoxicillin 500mg Kaplet", qty: 1, dosage: "3 x 1 tablet sehari" }, { name: "Vitamin B Kompleks", qty: 1, dosage: "1 x 1 tablet sehari" }], doctor: "drg. Shinta", poli: "Poli Gigi & Mulut", sheetCount: 1, genericCount: 2, nonGenericNames: "" },
    { invoice: "RSP-260618-002", date: "2026-06-18T14:10:00", customer: "Sri Lestari", rm: "RM-10204", insurance: "BPJS", itemsCount: 1, cashier: "Sarah (Apoteker)", items: [{ name: "Vitamin B Kompleks", qty: 1, dosage: "1 x 1 tablet sehari" }], doctor: "dr. Rian (KIA)", poli: "Poli KIA/KB", sheetCount: 1, genericCount: 1, nonGenericNames: "" }
  ];
};

const defaultMutations = [
  { date: "2026-06-15T09:40:00", code: "OB-001", name: "Paracetamol 500mg Tablet", batch: "B-PCT25", destination: "Unit Gawat Darurat (UGD)", qty: 100, cashier: "Sarah (Apoteker)", notes: "Stok UGD menipis" },
  { date: "2026-06-16T11:20:00", code: "OB-008", name: "Vitamin B Kompleks", batch: "B-VBK14", destination: "Poli KIA/KB", qty: 150, cashier: "Sarah (Apoteker)", notes: "Droping rutin poli KIA" },
  { date: "2026-06-18T14:10:00", code: "OB-002", name: "Amoxicillin 500mg Kaplet", batch: "B-AMX04", destination: "Pustu (Puskesmas Pembantu)", qty: 50, cashier: "Sarah (Apoteker)", notes: "Distribusi ke Puskesmas Pembantu" }
];

const defaultSubUnits = {
  "Unit Gawat Darurat (UGD)": { "OB-001": 100 },
  "Poli KIA/KB": { "OB-008": 150 },
  "Pustu (Puskesmas Pembantu)": { "OB-002": 50 }
};

const initPosForm = () => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const dateEl = document.getElementById("prescription-date");
  if (dateEl) dateEl.value = dateStr;

  const prescriptionNumEl = document.getElementById("prescription-number");
  if (prescriptionNumEl) {
    const nextNum = state.sales.length + 1;
    const year = today.getFullYear();
    prescriptionNumEl.value = `R-${year}-${String(nextNum).padStart(4, '0')}`;
  }
  
  const sheetCountEl = document.getElementById("prescription-sheet-count");
  if (sheetCountEl) sheetCountEl.value = 1;

  const totalQtyEl = document.getElementById("prescription-total-qty");
  if (totalQtyEl) totalQtyEl.value = 0;

  const genericCountEl = document.getElementById("prescription-generic-count");
  if (genericCountEl) genericCountEl.value = 0;

  const nonGenericNamesEl = document.getElementById("prescription-nongeneric-names");
  if (nonGenericNamesEl) nonGenericNamesEl.value = "";
};

// --- INITIALIZE APPLICATION ---
const initApp = () => {
  if (localStorage.getItem("puskespharma_stockmovements")) {
    state.medicines = JSON.parse(localStorage.getItem("puskespharma_medicines")) || [];
    state.customers = JSON.parse(localStorage.getItem("puskespharma_customers")) || [];
    state.sales = JSON.parse(localStorage.getItem("puskespharma_sales")) || [];
    state.mutations = JSON.parse(localStorage.getItem("puskespharma_mutations")) || [];
    state.subUnitStocks = JSON.parse(localStorage.getItem("puskespharma_subunits")) || {};
    state.settings = JSON.parse(localStorage.getItem("puskespharma_settings")) || state.settings;
    state.theme = JSON.parse(localStorage.getItem("puskespharma_theme")) || state.theme;
    state.credentials = JSON.parse(localStorage.getItem("puskespharma_credentials")) || state.credentials;
    state.stockMovements = JSON.parse(localStorage.getItem("puskespharma_stockmovements")) || [];
    state.opnames = JSON.parse(localStorage.getItem("puskespharma_opnames")) || [];
  } else {
    // Populate defaults
    state.medicines = defaultMedicines;
    state.customers = defaultCustomers;
    state.sales = generateDummySales();
    state.mutations = defaultMutations;
    state.subUnitStocks = defaultSubUnits;
    state.stockMovements = defaultStockMovements;
    state.opnames = defaultOpnames;
    saveToLocalStorage();
  }

  // Apply visual theme settings
  document.body.setAttribute("data-theme", state.theme.mode);
  document.body.setAttribute("data-accent", state.theme.accent);
  document.getElementById("settings-darkmode-toggle").checked = (state.theme.mode === "dark");
  
  // Set accent bubble active in UI settings
  document.querySelectorAll(".accent-bubble").forEach(b => b.classList.remove("active"));
  const activeBubble = document.getElementById(`accent-${state.theme.accent}`);
  if (activeBubble) activeBubble.classList.add("active");
  
  // Load settings inputs
  document.getElementById("settings-pharmacy-name").value = state.settings.name;
  document.getElementById("settings-pharmacy-address").value = state.settings.address;
  document.getElementById("settings-pharmacy-phone").value = state.settings.phone;
  document.getElementById("settings-pusk-kepala").value = state.settings.kepala;
  document.getElementById("settings-pusk-kepala-nip").value = state.settings.kepalaNip;
  document.getElementById("settings-pusk-apoteker").value = state.settings.apoteker;
  document.getElementById("settings-pusk-apoteker-sipa").value = state.settings.apotekerSipa;
  document.getElementById("settings-pharmacy-footer").value = state.settings.footer;
  document.getElementById("settings-admin-username").value = state.credentials.admin.username;

  updatePharmacyNameDOM();
  applyLogo(state.settings.logo);
  checkSession();
  initPosForm();
  initPrescriptionListFilters();
  initInventoryFilters(); // Helper to initialize filters for Kartu Stok

  // Setup medicine name autocomplete prefill
  const medNameInput = document.getElementById("medicine-name");
  if (medNameInput) {
    medNameInput.addEventListener("input", (e) => {
      const enteredName = e.target.value.trim().toLowerCase();
      if (enteredName === "") return;
      
      const match = state.medicines.find(m => m.name.trim().toLowerCase() === enteredName);
      if (match) {
        document.getElementById("medicine-category").value = match.category;
        document.getElementById("medicine-unit").value = match.unit;
        document.getElementById("medicine-batch").value = match.batch || "";
        document.getElementById("medicine-expiry").value = match.expiry || "";
      }
    });
  }

  // Run automatic database pruning if data spans older than 2 years
  autoPruneData();
};

const saveToLocalStorage = () => {
  localStorage.setItem("puskespharma_medicines", JSON.stringify(state.medicines));
  localStorage.setItem("puskespharma_customers", JSON.stringify(state.customers));
  localStorage.setItem("puskespharma_sales", JSON.stringify(state.sales));
  localStorage.setItem("puskespharma_mutations", JSON.stringify(state.mutations));
  localStorage.setItem("puskespharma_subunits", JSON.stringify(state.subUnitStocks));
  localStorage.setItem("puskespharma_settings", JSON.stringify(state.settings));
  localStorage.setItem("puskespharma_theme", JSON.stringify(state.theme));
  localStorage.setItem("puskespharma_credentials", JSON.stringify(state.credentials));
  localStorage.setItem("puskespharma_stockmovements", JSON.stringify(state.stockMovements));
  localStorage.setItem("puskespharma_opnames", JSON.stringify(state.opnames));
};

const autoPruneData = () => {
  const now = new Date();
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(now.getFullYear() - 2);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  const isOlderThan = (dateStr, threshold) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return !isNaN(d.getTime()) && d < threshold;
  };

  const hasDataOlderThanTwoYears = 
    state.sales.some(s => isOlderThan(s.date, twoYearsAgo)) ||
    state.stockMovements.some(m => isOlderThan(m.date, twoYearsAgo)) ||
    state.opnames.some(o => isOlderThan(o.date, twoYearsAgo)) ||
    state.mutations.some(mu => isOlderThan(mu.date, twoYearsAgo));

  if (hasDataOlderThanTwoYears) {
    const isNewerThanOrEqual = (dateStr, threshold) => {
      if (!dateStr) return true;
      const d = new Date(dateStr);
      return isNaN(d.getTime()) || d >= threshold;
    };

    state.sales = state.sales.filter(s => isNewerThanOrEqual(s.date, oneYearAgo));
    state.stockMovements = state.stockMovements.filter(m => isNewerThanOrEqual(m.date, oneYearAgo));
    state.opnames = state.opnames.filter(o => isNewerThanOrEqual(o.date, oneYearAgo));
    state.mutations = state.mutations.filter(mu => isNewerThanOrEqual(mu.date, oneYearAgo));
    
    saveToLocalStorage();
    setTimeout(() => {
      showToast("Data historis berusia lebih dari 1 tahun otomatis terhapus untuk optimalisasi database.", "info");
    }, 1500);
  }
};

const updatePharmacyNameDOM = () => {
  document.getElementById("login-pharmacy-name").innerText = state.settings.name;
  document.getElementById("sidebar-pharmacy-name").innerText = state.settings.name.split(" ").slice(0,2).join(" ");
  document.getElementById("header-pharmacy-name").innerText = state.settings.name;
  document.getElementById("login-copyright-name").innerText = state.settings.name;
};

// --- AUTHENTICATION & LOGIN SESSIONS (SINGLE ADMIN LOGIN ONLY) ---
const handleLogin = (e) => {
  e.preventDefault();
  const userIn = document.getElementById("login-username").value.trim();
  const passIn = document.getElementById("login-password").value.trim();
  
  if (userIn === state.credentials.admin.username && passIn === state.credentials.admin.password) {
    const session = {
      name: "Sarah Annisa (Apoteker)",
      username: userIn,
      role: "admin",
      roleLabel: "Apoteker / Kepala",
      avatar: "S"
    };
    sessionStorage.setItem("puskespharma_user", JSON.stringify(session));
    showToast("Login Berhasil! Selamat bekerja Apoteker.", "success");
    enterAppShell(session);
  } else {
    showToast("Kredensial login admin salah!", "error");
  }
};

const checkSession = () => {
  const session = sessionStorage.getItem("puskespharma_user");
  if (session) {
    enterAppShell(JSON.parse(session));
  } else {
    exitAppShell();
  }
};

const enterAppShell = (user) => {
  document.getElementById("login-portal").classList.add("hidden");
  document.getElementById("app-shell").classList.remove("hidden");
  
  document.getElementById("sidebar-user-avatar").innerText = user.avatar;
  document.getElementById("sidebar-user-name").innerText = user.name;
  document.getElementById("sidebar-user-role").innerText = user.roleLabel;
  
  document.getElementById("nav-dashboard").style.display = "flex";
  document.getElementById("nav-inventory").style.display = "flex";
  document.getElementById("nav-opname").style.display = "flex";
  document.getElementById("nav-mutation").style.display = "flex";
  document.getElementById("nav-lplpo").style.display = "flex";
  
  switchTab("dashboard");
};

const exitAppShell = () => {
  document.getElementById("login-portal").classList.remove("hidden");
  document.getElementById("app-shell").classList.add("hidden");
  sessionStorage.removeItem("puskespharma_user");
  document.getElementById("login-username").value = "";
  document.getElementById("login-password").value = "";
};

const openLogoutModal = () => openModal("modal-logout");
const executeLogout = () => {
  closeModal("modal-logout");
  exitAppShell();
  showToast("Anda telah keluar dari aplikasi.", "info");
};

// --- SPA SCREEN TABS ROUTING (DUAL NAVIGATION INTEGRATION) ---
const switchTab = (tabId) => {
  // Sidebar Navigation update
  document.querySelectorAll(".sidebar-link").forEach(link => link.classList.remove("active"));
  const navLink = document.getElementById(`nav-${tabId}`);
  if (navLink) navLink.classList.add("active");

  // Mobile Bottom Navigation update
  document.querySelectorAll(".mobile-nav-link").forEach(link => link.classList.remove("active"));
  const mNavLink = document.getElementById(`m-nav-${tabId}`);
  if (mNavLink) mNavLink.classList.add("active");
  
  // Screen views update
  document.querySelectorAll(".app-screen").forEach(screen => screen.classList.remove("active"));
  const targetScreen = document.getElementById(`screen-${tabId}`);
  if (targetScreen) targetScreen.classList.add("active");
  
  // Tab loading actions
  if (tabId === "dashboard") renderDashboard();
  else if (tabId === "pos") {
    initPrescriptionListFilters();
    renderPrescriptionTable();
    hideAddPrescriptionForm();
  }
  else if (tabId === "dispense") {
    initDispenseFilters();
    renderDispenseTable();
  }
  else if (tabId === "inventory") renderInventory();
  else if (tabId === "opname") loadOpnameFormData();
  else if (tabId === "mutation") loadMutationFormData();
  else if (tabId === "lplpo") renderLPLPO();
};

// --- DASHBOARD ANALYTICS ---
const renderDashboard = () => {
  const totalSales = state.sales.length;
  const bpjsCount = state.sales.filter(s => s.insurance === "BPJS").length;
  
  let lowStockCount = 0;
  let expiredCount = 0;
  const alerts = [];
  const today = new Date();
  
  state.medicines.forEach(m => {
    // Low stock
    if (m.stock > 0 && m.stock <= 15) {
      lowStockCount++;
      alerts.push({ type: "warning", text: `Stok obat <strong>${m.name}</strong> sisa ${m.stock} ${m.unit} (Batch ${m.batch}). Segera isi kembali.` });
    } else if (m.stock <= 0) {
      lowStockCount++;
      alerts.push({ type: "danger", text: `Stok obat <strong>${m.name}</strong> telah HABIS! (Stok: ${m.stock} ${m.unit}, Batch ${m.batch}). Penyerahan resep terkunci.` });
    }
    
    // Expiry
    const expDate = new Date(m.expiry);
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      expiredCount++;
      alerts.push({ type: "danger", text: `Obat <strong>${m.name}</strong> (Batch ${m.batch}) telah KEDALUWARSA (${m.expiry}). Segera amankan!` });
    } else if (diffDays <= 90) {
      expiredCount++;
      alerts.push({ type: "warning", text: `Obat <strong>${m.name}</strong> akan kedaluwarsa dalam ${diffDays} hari (${m.expiry}).` });
    }
  });

  document.getElementById("metric-recipes").innerText = totalSales;
  document.getElementById("metric-bpjs").innerText = bpjsCount;
  document.getElementById("metric-low-stock").innerText = lowStockCount;
  document.getElementById("metric-expired").innerText = expiredCount;

  // Render warnings lists
  const alertContainer = document.getElementById("dashboard-alerts");
  alertContainer.innerHTML = "";
  if (alerts.length === 0) {
    alertContainer.innerHTML = `<div class="text-muted" style="text-align: center; margin-top: 40px;">Sistem dalam kondisi aman, tidak ada peringatan aktif.</div>`;
  } else {
    alerts.sort((a,b) => a.type === "danger" ? -1 : 1).forEach(a => {
      const item = document.createElement("div");
      item.className = `alert-item alert-item-${a.type}`;
      const icon = a.type === "danger" 
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-danger" style="margin-top: 2px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-warning" style="margin-top: 2px;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
      item.innerHTML = `${icon}<div class="alert-desc"><div class="alert-title text-${a.type}">${a.type === "danger" ? "KRITIS" : "PERINGATAN"}</div><div>${a.text}</div></div>`;
      alertContainer.appendChild(item);
    });
  }



  renderChart();
};

const renderChart = () => {
  const ctx = document.getElementById("salesChart").getContext('2d');
  
  // Calculate stats for the last 7 dates
  const dates = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  
  const bpjsMap = {};
  const umumMap = {};
  dates.forEach(d => {
    bpjsMap[d] = 0;
    umumMap[d] = 0;
  });
  
  state.sales.forEach(s => {
    const sDate = s.date.split('T')[0];
    if (bpjsMap[sDate] !== undefined) {
      if (s.insurance === "BPJS") bpjsMap[sDate]++;
      else umumMap[sDate]++;
    }
  });

  const chartLabels = dates.map(d => {
    const parts = d.split('-');
    return `${parts[2]}/${parts[1]}`;
  });

  const bpjsData = dates.map(d => bpjsMap[d]);
  const umumData = dates.map(d => umumMap[d]);

  const tealHex = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#0d9488';

  if (salesChartInstance) salesChartInstance.destroy();

  salesChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Pasien BPJS',
          data: bpjsData,
          backgroundColor: `${tealHex}`,
          borderRadius: 4
        },
        {
          label: 'Pasien Umum',
          data: umumData,
          backgroundColor: '#3b82f6',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { family: 'Plus Jakarta Sans', size: 11 } } }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, font: { family: 'Plus Jakarta Sans', size: 10 } },
          grid: { color: 'rgba(148, 163, 184, 0.1)' }
        },
        x: {
          ticks: { font: { family: 'Plus Jakarta Sans', size: 10 } },
          grid: { display: false }
        }
      }
    }
  });
};

// --- POINT OF DISPENSING (POS) PELAYANAN RESEP ---
const filterPosCategory = (cat) => {
  currentCategoryFilter = cat;
  document.querySelectorAll("#pos-category-filters .filter-btn").forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");
  renderPosProducts();
};

const renderPosProducts = () => {
  const grid = document.getElementById("pos-products-grid");
  const searchVal = document.getElementById("pos-search").value.toLowerCase();
  grid.innerHTML = "";

  const filtered = state.medicines.filter(m => {
    const matchCat = currentCategoryFilter === "all" || m.category === currentCategoryFilter;
    const matchSearch = m.name.toLowerCase().includes(searchVal) || m.code.toLowerCase().includes(searchVal) || m.batch.toLowerCase().includes(searchVal);
    return matchCat && matchSearch && m.stock > 0;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="text-muted" style="grid-column: span 5; text-align: center; margin-top: 60px;">Obat tidak ditemukan.</div>`;
    return;
  }

  filtered.forEach(m => {
    const card = document.createElement("div");
    card.className = "product-pos-card glass-card";
    
    const isExpired = new Date(m.expiry) <= new Date();
    let badgeClass = "badge-neutral";
    let badgeText = "Stok OK";
    
    if (isExpired) {
      badgeClass = "badge-danger";
      badgeText = "Expired";
    } else if (m.stock === 0) {
      badgeClass = "badge-danger";
      badgeText = "Habis";
    } else if (m.stock <= 15) {
      badgeClass = "badge-warning";
      badgeText = "Stok Tipis";
    }
    
    card.innerHTML = `
      <div style="position: absolute; top: 8px; left: 14px; font-size: 0.68rem; color: ${isExpired ? 'var(--danger)' : 'var(--text-muted)'}; font-weight: 600;">Exp: ${m.expiry}</div>
      <span class="badge ${badgeClass} product-pos-badge">${badgeText}</span>
      <div class="product-pos-name">${m.name}</div>
      <div class="product-pos-category">${m.category} | Batch: ${m.batch}</div>
      <div class="product-pos-footer" style="justify-content: flex-end;">
        <div class="product-pos-stock">Stok: <strong>${m.stock}</strong></div>
      </div>
    `;

    if (isExpired) {
      card.style.opacity = "0.5";
      card.onclick = () => showToast("Obat KEDALUWARSA tidak boleh diserahkan!", "error");
    } else if (m.stock === 0) {
      card.style.opacity = "0.6";
      card.onclick = () => showToast("Stok obat habis!", "error");
    } else {
      card.onclick = () => addToCart(m);
    }
    grid.appendChild(card);
  });
};

const addEmptyCartRow = () => {
  cart.push({
    code: "",
    name: "",
    batch: "",
    unit: "",
    qty: "",
    dosage: "3 x 1 tablet sehari, setelah makan"
  });
  calculateCart();
  renderCart();
};

const addToCart = (med) => {
  // If there's an empty slot in the cart (where code === ""), populate it first
  const emptyIdx = cart.findIndex(item => item.code === "");
  if (emptyIdx !== -1) {
    cart[emptyIdx] = {
      code: med.code,
      name: med.name,
      batch: med.batch,
      unit: med.unit,
      qty: 1,
      dosage: "3 x 1 tablet sehari, setelah makan"
    };
  } else {
    // Check if it already exists in the cart
    const exist = cart.find(item => item.code === med.code);
    if (exist) {
      if ((parseInt(exist.qty) || 0) + 1 > med.stock) {
        showToast(`Stok tidak mencukupi! Batas stok ${med.stock}.`, "warning");
        return;
      }
      exist.qty = (parseInt(exist.qty) || 0) + 1;
    } else {
      cart.push({
        code: med.code,
        name: med.name,
        batch: med.batch,
        unit: med.unit,
        qty: 1,
        dosage: "3 x 1 tablet sehari, setelah makan"
      });
    }
  }
  calculateCart();
  renderCart();
};

const removeFromCartByIdx = (index) => {
  cart.splice(index, 1);
  calculateCart();
  renderCart();
};

const changeCartItemMedicine = (index, code) => {
  if (code === "") {
    cart[index].code = "";
    cart[index].name = "";
    cart[index].batch = "";
    cart[index].unit = "";
    cart[index].qty = "";
  } else {
    const isDup = cart.some((item, idx) => idx !== index && item.code === code);
    if (isDup) {
      showToast("Obat ini sudah terpilih di baris lain!", "warning");
      renderCart();
      return;
    }
    
    const med = state.medicines.find(m => m.code === code);
    if (med) {
      const isExpired = new Date(med.expiry) <= new Date();
      if (isExpired) {
        showToast("Obat KEDALUWARSA tidak boleh diserahkan!", "error");
        renderCart();
        return;
      }
      if (med.stock === 0) {
        showToast("Stok obat habis!", "error");
        renderCart();
        return;
      }
      cart[index].code = med.code;
      cart[index].name = med.name;
      cart[index].batch = med.batch;
      cart[index].unit = med.unit;
      cart[index].qty = 1;
    }
  }
  calculateCart();
  renderCart();
};

const updateCartQtyByIdx = (index, val) => {
  const item = cart[index];
  if (!item) return;
  
  if (val === "") {
    item.qty = "";
    calculateCart();
    return;
  }
  
  const qty = parseInt(val) || 0;
  if (item.code) {
    const med = state.medicines.find(m => m.code === item.code);
    if (med) {
      if (qty > med.stock) {
        showToast(`Stok tidak mencukupi! Batas stok ${med.stock}.`, "warning");
        item.qty = med.stock;
        renderCart();
        calculateCart();
        return;
      }
    }
  }
  item.qty = qty;
  calculateCart();
};

const updateCartDosageByIdx = (index, val) => {
  if (cart[index]) {
    cart[index].dosage = val;
  }
};

const renderCart = () => {
  const container = document.getElementById("cart-items-container");
  if (!container) return;
  container.innerHTML = "";

  const countEl = document.getElementById("cart-item-count");
  if (countEl) {
    countEl.innerText = `${cart.length} Obat`;
  }

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-muted" style="text-align: center; padding: 20px 0;">Belum ada obat ditambahkan.</div>
    `;
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    
    let optionsHTML = `<option value="">Pilih / ketik nama obat</option>`;
    state.medicines.forEach(m => {
      const isSelected = m.code === item.code ? "selected" : "";
      if (m.stock > 0 || isSelected) {
        optionsHTML += `<option value="${m.code}" ${isSelected}>${m.name} (Batch: ${m.batch} - Stok: ${m.stock})</option>`;
      }
    });

    div.innerHTML = `
      <div class="cart-item-col">
        <label>Nama Obat</label>
        <select class="cart-item-select" onchange="changeCartItemMedicine(${index}, this.value)">
          ${optionsHTML}
        </select>
      </div>
      <div class="cart-item-col">
        <label>Pengeluaran</label>
        <input type="number" class="cart-item-qty-input" value="${item.qty}" min="1" placeholder="" oninput="updateCartQtyByIdx(${index}, this.value)">
      </div>
      <button type="button" class="cart-item-delete-btn" onclick="removeFromCartByIdx(${index})" title="Hapus Obat">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
      </button>
    `;
    container.appendChild(div);
  });
};

const calculateCart = () => {
  const activeItemsCount = cart.filter(item => item.code !== "").length;
  const totalQtyEl = document.getElementById("prescription-total-qty");
  if (totalQtyEl) totalQtyEl.value = activeItemsCount;
};

const handleInsuranceChange = () => {
  calculateCart();
};

const autocompletePatientByRM = (rmVal) => {
  const found = state.customers.find(c => c.rm.toLowerCase() === rmVal.trim().toLowerCase());
  if (found) {
    document.getElementById("cart-patient-name").value = found.name;
    document.getElementById("cart-patient-insurance").value = found.insurance;
    document.getElementById("cart-patient-phone").value = found.phone || "";
    handleInsuranceChange();
  }
};

const processCheckout = () => {
  const validItems = cart.filter(i => i.code !== "");
  if (validItems.length === 0) {
    showToast("Pilih setidaknya 1 obat yang valid untuk resep!", "warning");
    return;
  }

  const oldInvoiceId = document.getElementById("pos-editing-invoice").value;
  
  // Patient details defaults or restored values
  let rm = "";
  let name = "";
  let insurance = "";
  let poli = "";
  let doctor = "";
  let phone = "";

  if (oldInvoiceId) {
    const oldSale = state.sales.find(s => s.invoice === oldInvoiceId);
    if (oldSale) {
      rm = oldSale.rm;
      name = oldSale.customer;
      insurance = oldSale.insurance;
      poli = oldSale.poli;
      doctor = oldSale.doctor;
      phone = oldSale.phone || "-";
    }
  }

  // Derive defaults if missing (e.g., when creating a new prescription)
  if (!insurance) {
    insurance = state.currentPrescriptionTab || "Umum";
  }
  if (!name) {
    name = insurance === "BPJS" ? "Pasien BPJS" : "Pasien Umum";
  }
  if (!rm) {
    rm = insurance === "BPJS" ? "BPJS-001" : "UMUM-001";
  }
  if (!doctor) {
    doctor = "Dokter Puskesmas";
  }
  if (!poli) {
    poli = "Poli Umum";
  }
  if (!phone) {
    phone = "-";
  }

  const prescriptionDate = document.getElementById("prescription-date").value;
  const prescriptionNumber = document.getElementById("prescription-number").value.trim();
  const sheetCount = parseInt(document.getElementById("prescription-sheet-count").value) || 1;
  const genericCount = parseInt(document.getElementById("prescription-generic-count").value) || 0;
  const nonGenericNames = document.getElementById("prescription-nongeneric-names").value.trim();

  // If editing, restore old stock first
  if (oldInvoiceId) {
    const oldSale = state.sales.find(s => s.invoice === oldInvoiceId);
    if (oldSale) {
      oldSale.items.forEach(item => {
        const med = state.medicines.find(m => m.name === item.name);
        if (med) med.stock += item.qty;
      });
    }
  }

  // Check if any medicine is Narkotika/Psikotropika
  const hasPsychotropic = validItems.some(i => {
    const med = state.medicines.find(m => m.code === i.code);
    return med && med.category === "Psikotropika/Narkotika";
  });
  if (hasPsychotropic && !doctor) {
    showToast("Pemberian obat psikotropika/narkotika WAJIB menyertakan nama dokter!", "danger");
    // Restore old stock if check fails
    if (oldInvoiceId) {
      const oldSale = state.sales.find(s => s.invoice === oldInvoiceId);
      if (oldSale) {
        oldSale.items.forEach(oldItem => {
          const oldMed = state.medicines.find(m => m.name === oldItem.name);
          if (oldMed) oldMed.stock -= oldItem.qty;
        });
      }
    }
    return;
  }

  // Check stocks
  for (const item of validItems) {
    const med = state.medicines.find(m => m.code === item.code);
    const qty = parseInt(item.qty) || 0;
    if (qty <= 0) {
      showToast(`Jumlah pengeluaran untuk ${item.name} harus lebih dari 0!`, "warning");
      if (oldInvoiceId) {
        const oldSale = state.sales.find(s => s.invoice === oldInvoiceId);
        if (oldSale) {
          oldSale.items.forEach(oldItem => {
            const oldMed = state.medicines.find(m => m.name === oldItem.name);
            if (oldMed) oldMed.stock -= oldItem.qty;
          });
        }
      }
      return;
    }
    if (!med || med.stock < qty) {
      showToast(`Stok ${item.name} tidak cukup atau telah berubah!`, "error");
      if (oldInvoiceId) {
        const oldSale = state.sales.find(s => s.invoice === oldInvoiceId);
        if (oldSale) {
          oldSale.items.forEach(oldItem => {
            const oldMed = state.medicines.find(m => m.name === oldItem.name);
            if (oldMed) oldMed.stock -= oldItem.qty;
          });
        }
      }
      return;
    }
  }

  // Deduct Stocks
  validItems.forEach(item => {
    const med = state.medicines.find(m => m.code === item.code);
    const qty = parseInt(item.qty) || 0;
    if (med) med.stock -= qty;
  });

  // Upsert Patient Database
  const existPatient = state.customers.find(c => c.rm.toLowerCase() === rm.toLowerCase());
  if (existPatient) {
    existPatient.name = name;
    existPatient.insurance = insurance;
    existPatient.phone = phone;
    if (!oldInvoiceId) existPatient.transactions++;
  } else {
    state.customers.push({
      rm: rm,
      name: name,
      insurance: insurance,
      phone: phone,
      transactions: 1
    });
  }

  // Create Invoice record
  const autoInvoiceNo = `RSP-${new Date().toISOString().substring(2,10).replace(/-/g,'')}-${String(state.sales.length + 1).padStart(3, '0')}`;
  const invoiceNo = prescriptionNumber || oldInvoiceId || autoInvoiceNo;
  
  // Combine input date with current time
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  const dateStr = prescriptionDate ? `${prescriptionDate}T${timeStr}` : now.toISOString();

  const currentUser = JSON.parse(sessionStorage.getItem("puskespharma_user")) || { name: "Apoteker" };
  
  const newSale = {
    invoice: invoiceNo,
    date: dateStr,
    customer: name,
    rm: rm,
    insurance: insurance,
    itemsCount: validItems.length,
    cashier: currentUser.name,
    items: validItems.map(i => ({
      code: i.code,
      name: i.name,
      qty: parseInt(i.qty) || 0,
      dosage: i.dosage || "3 x 1 tablet sehari, setelah makan"
    })),
    doctor: doctor,
    poli: poli,
    sheetCount: sheetCount,
    genericCount: genericCount,
    nonGenericNames: nonGenericNames
  };

  if (oldInvoiceId) {
    const saleIdx = state.sales.findIndex(s => s.invoice === oldInvoiceId);
    if (saleIdx !== -1) {
      state.sales[saleIdx] = newSale;
    } else {
      state.sales.push(newSale);
    }
  } else {
    state.sales.push(newSale);
  }
  // Update Stock Movements
  state.stockMovements = state.stockMovements.filter(m => m.refId !== invoiceNo);
  validItems.forEach(item => {
    const med = state.medicines.find(m => m.code === item.code);
    const qty = parseInt(item.qty) || 0;
    if (med) {
      state.stockMovements.push({
        date: prescriptionDate || dateStr.split("T")[0],
        medicineName: med.name,
        batch: med.batch,
        origin: insurance === "BPJS" ? "Resep BPJS" : "Resep UMUM",
        type: "resep",
        direction: "keluar",
        qty: qty,
        expiry: med.expiry,
        refId: invoiceNo
      });
    }
  });

  saveToLocalStorage();
  showToast(oldInvoiceId ? `Resep ${invoiceNo} sukses diperbarui!` : `Resep ${invoiceNo} sukses diserahkan!`, "success");

  // Clear cart & forms
  cart = [];
  const elRm = document.getElementById("cart-patient-rm");
  if (elRm) elRm.value = "";
  const elName = document.getElementById("cart-patient-name");
  if (elName) elName.value = "";
  const elDoc = document.getElementById("cart-prescription-doctor");
  if (elDoc) elDoc.value = "";
  const elPhone = document.getElementById("cart-patient-phone");
  if (elPhone) elPhone.value = "";
  
  initPosForm();
  renderCart();
  hideAddPrescriptionForm();
};

// --- RECEIPT & ETIKET PRINT PREVIEW ---
const renderReceiptPreview = (sale) => {
  const container = document.getElementById("receipt-preview-content");
  const formattedDate = sale.date.replace('T', ' ').substring(0, 16);
  
  // Compile items text
  let itemsHTML = "";
  let labelsHTML = ""; // Individual etiket labels
  
  sale.items.forEach((item, index) => {
    itemsHTML += `
      <div class="item-row">
        <div class="item-name">${item.name}</div>
        <div class="item-calc">
          <span>Jumlah: ${item.qty} pcs</span>
          <span>Aturan Pakai: ${item.dosage}</span>
        </div>
      </div>
    `;
    
    // Label Etiket (Apotik Standard)
    labelsHTML += `
      <div style="page-break-before: always; border: 2px solid black; padding: 12px; margin-top: 20px; font-family: 'Courier New'; max-width: 320px; color: black; background: white;">
        <div style="text-align: center; font-weight: bold; border-bottom: 1px solid black; padding-bottom: 4px; font-size: 0.85rem;">
          ${state.settings.name.toUpperCase()}
          <div style="font-size: 0.65rem; font-weight: normal; margin-top: 2px;">SIP: ${state.settings.apotekerSipa}</div>
        </div>
        <div style="margin: 8px 0; font-size: 0.72rem;">
          <div>No. RM : <strong>${sale.rm}</strong></div>
          <div>Nama   : <strong>${sale.customer}</strong></div>
          <div>Tanggal: ${formattedDate.split(' ')[0]}</div>
        </div>
        <div style="border: 1px dashed black; padding: 6px; text-align: center; margin: 8px 0;">
          <div style="font-weight: bold; font-size: 0.8rem;">${item.name}</div>
          <div style="font-size: 0.7rem; color: #555;">Jumlah: ${item.qty}</div>
        </div>
        <div style="text-align: center; font-weight: bold; font-size: 0.85rem; margin-top: 10px; background: #eee; padding: 4px;">
          ATURAN PAKAI: ${item.dosage.toUpperCase()}
        </div>
        <div style="text-align: center; font-size: 0.62rem; margin-top: 12px; border-top: 1px solid #ccc; padding-top: 4px;">
          Semoga Lekas Sembuh
        </div>
      </div>
    `;
  });

  if (sale.nonGenericNames) {
    itemsHTML += `
      <div class="item-row" style="border-top: 1px dashed var(--border-color); padding-top: 8px; margin-top: 4px;">
        <div class="item-name" style="font-weight: 700; color: var(--primary);">${sale.nonGenericNames}</div>
        <div class="item-calc">
          <span>Non-Generik</span>
        </div>
      </div>
    `;
  }

  const html = `
    <!-- KOP STRUK APOTEK -->
    <div class="title">${state.settings.name}</div>
    <div class="subtitle">${state.settings.address}<br>Telp: ${state.settings.phone}</div>
    <div class="divider"></div>
    
    <div class="meta-row">
      <span>No. Resep:</span>
      <strong>${sale.invoice}</strong>
    </div>
    <div class="meta-row">
      <span>Waktu:</span>
      <span>${formattedDate}</span>
    </div>
    <div class="meta-row">
      <span>Poli / Dokter:</span>
      <span>${sale.poli} / ${sale.doctor}</span>
    </div>
    <div class="meta-row">
      <span>No. RM / Pasien:</span>
      <span>${sale.rm} / <strong>${sale.customer}</strong></span>
    </div>
    <div class="meta-row">
      <span>Kategori Jaminan:</span>
      <strong>${sale.insurance}</strong>
    </div>
    <div class="meta-row">
      <span>Jumlah Lembar Resep:</span>
      <span>${sale.sheetCount || 1} Lembar</span>
    </div>
    <div class="meta-row">
      <span>Item Generik:</span>
      <span>${sale.genericCount || 0} Item</span>
    </div>
    <div class="meta-row">
      <span>Petugas PJ:</span>
      <span>${sale.cashier}</span>
    </div>
    <div class="divider"></div>
    
    <!-- Items list -->
    ${itemsHTML}
    <div class="divider"></div>
    
    <div class="total-row">
      <span>TOTAL ITEM OBAT:</span>
      <span>${sale.items.reduce((sum, i) => sum + i.qty, 0)} Pcs</span>
    </div>
    <div class="divider"></div>
    
    <div class="footer-text">${state.settings.footer}</div>
    
    <!-- INDIVIDUAL DRUG LABELS ETIKET (Akan tercetak di halaman baru) -->
    <div style="border-top: 2px dashed #999; margin: 30px 0 10px 0; text-align: center; color: #777; font-size: 0.65rem;">
      --- PRATINJAU LABEL ETIKET OBAT ---
    </div>
    ${labelsHTML}
  `;

  container.innerHTML = html;
  document.getElementById("print-receipt-wrapper").innerHTML = html;
};

const viewHistoricalReceipt = (invoiceId) => {
  const sale = state.sales.find(s => s.invoice === invoiceId);
  if (sale) {
    renderReceiptPreview(sale);
    openModal("modal-receipt");
  } else {
    showToast("Resep tidak ditemukan!", "error");
  }
};

const executePrintReceipt = () => {
  document.body.classList.remove("printing-lplpo");
  window.print();
};

// --- NEW PRESCRIPTION LIST VIEW LOGIC ---
const initPrescriptionListFilters = () => {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  const startEl = document.getElementById("pos-filter-start-date");
  if (startEl && !startEl.value) {
    startEl.value = oneMonthAgo.toISOString().split('T')[0];
  }
  
  const endEl = document.getElementById("pos-filter-end-date");
  if (endEl && !endEl.value) {
    endEl.value = today.toISOString().split('T')[0];
  }
  
  if (!state.currentPrescriptionTab) {
    state.currentPrescriptionTab = "Umum";
  }
};

const setPrescriptionTab = (tab) => {
  state.currentPrescriptionTab = tab;
  
  const tabUmum = document.getElementById("pos-tab-umum");
  const tabBpjs = document.getElementById("pos-tab-bpjs");
  
  if (tab === "Umum") {
    if (tabUmum) tabUmum.classList.add("active");
    if (tabBpjs) tabBpjs.classList.remove("active");
  } else {
    if (tabUmum) tabUmum.classList.remove("active");
    if (tabBpjs) tabBpjs.classList.add("active");
  }
  
  renderPrescriptionTable();
};

const getFilteredSales = () => {
  const startDateVal = document.getElementById("pos-filter-start-date").value;
  const endDateVal = document.getElementById("pos-filter-end-date").value;
  const searchVal = document.getElementById("pos-filter-search").value.toLowerCase();
  
  const start = startDateVal ? new Date(startDateVal + "T00:00:00") : null;
  const end = endDateVal ? new Date(endDateVal + "T23:59:59") : null;
  
  return state.sales.filter(sale => {
    // Filter by tab (Umum / BPJS)
    if (sale.insurance !== state.currentPrescriptionTab) return false;
    
    // Filter by date
    const saleDate = new Date(sale.date);
    if (start && saleDate < start) return false;
    if (end && saleDate > end) return false;
    
    // Filter by search
    if (searchVal) {
      const matchItem = sale.items.some(item => {
        const med = state.medicines.find(m => m.name === item.name);
        const batch = med ? med.batch.toLowerCase() : "";
        return item.name.toLowerCase().includes(searchVal) || batch.includes(searchVal);
      });
      const matchNonGeneric = sale.nonGenericNames && sale.nonGenericNames.toLowerCase().includes(searchVal);
      const matchInvoice = sale.invoice.toLowerCase().includes(searchVal);
      return matchItem || matchNonGeneric || matchInvoice;
    }
    
    return true;
  });
};

const renderPrescriptionTable = () => {
  const tbody = document.getElementById("prescription-table-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  const filteredSales = getFilteredSales();
  
  if (filteredSales.length === 0) {
    tbody.innerHTML = `<tr><td colspan="12" style="text-align: center; padding: 30px;" class="text-muted">Tidak ada data resep dalam periode ini.</td></tr>`;
    return;
  }
  
  // Group sales by date
  const groupedSales = {};
  filteredSales.forEach(sale => {
    const dateStr = sale.date.split("T")[0];
    if (!groupedSales[dateStr]) {
      groupedSales[dateStr] = [];
    }
    groupedSales[dateStr].push(sale);
  });
  
  // Sort dates descending
  const sortedDates = Object.keys(groupedSales).sort((a, b) => new Date(b) - new Date(a));
  
  sortedDates.forEach(dateStr => {
    // Calculate total quantity for this date
    let totalQtyForDate = 0;
    groupedSales[dateStr].forEach(sale => {
      sale.items.forEach(item => {
        totalQtyForDate += parseInt(item.qty) || 0;
      });
    });
    
    // Render group header
    const headerTr = document.createElement("tr");
    headerTr.className = "date-group-header";
    headerTr.innerHTML = `
      <td colspan="12" style="background: var(--primary-light); text-align: left; padding: 12px 16px; font-weight: 700; color: var(--primary);">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle; margin-right: 6px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        ${dateStr} — ${totalQtyForDate} item
      </td>
    `;
    tbody.appendChild(headerTr);
    
    // Render rows
    groupedSales[dateStr].forEach(sale => {
      sale.items.forEach((item, index) => {
        const med = state.medicines.find(m => m.name === item.name);
        const type = med ? (med.category === "Alat Kesehatan" ? "alkes" : "generik") : "generik";
        const batch = med ? med.batch : "-";
        
        let typeBadge = `<span class="badge" style="background:#e6fffa; color:#047481; border:1px solid #c3f7e9; text-transform:lowercase; font-weight: 500;">generik</span>`;
        if (type === "alkes") {
          typeBadge = `<span class="badge badge-info" style="text-transform:lowercase; font-weight: 500;">alkes</span>`;
        }
        
        let statusBadge = "-";
        if (med) {
          const expDate = new Date(med.expiry);
          const today = new Date();
          const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
          if (diffDays <= 0) {
            statusBadge = `<span class="badge badge-danger" style="text-transform:none; font-weight: 500;">Expired</span>`;
          } else if (diffDays <= 90) {
            statusBadge = `<span class="badge badge-warning" style="text-transform:none; font-weight: 500;">Kritis (${diffDays} hari)</span>`;
          } else {
            statusBadge = `<span class="badge" style="background:#d1fae5; color:#065f46; border:1px solid #a7f3d0; text-transform:none; padding:4px 8px; font-weight:500;">Aman (${diffDays} hari)</span>`;
          }
        }
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${sale.date.substring(0, 10)}</td>
          <td><strong>${sale.invoice}</strong></td>
          <td><strong>${item.name}</strong></td>
          <td>${typeBadge}</td>
          <td><span class="badge badge-neutral">${batch}</span></td>
          <td>${statusBadge}</td>
          <td><strong>${item.qty}</strong></td>
          <td>${sale.sheetCount || 1}</td>
          <td><strong>${sale.itemsCount}</strong></td>
          <td>${sale.genericCount || 0}</td>
          <td>${sale.nonGenericNames || "-"}</td>
          <td style="text-align: right; white-space: nowrap;">
            <button class="btn btn-secondary btn-sm btn-icon" onclick="viewHistoricalReceipt('${sale.invoice}')" title="Cetak Etiket" style="padding: 6px; margin-right: 4px; border: 1px solid var(--border-color); background: white; color: var(--text-main);">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </button>
            <button class="btn btn-secondary btn-sm btn-icon" onclick="loadPrescriptionForEdit('${sale.invoice}')" title="Edit Resep" style="padding: 6px; margin-right: 4px; border: 1px solid var(--border-color); background: white; color: var(--text-main);">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
            <button class="btn btn-danger btn-sm btn-icon" onclick="deletePrescription('${sale.invoice}')" title="Hapus Resep" style="padding: 6px; color: white;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
  });
};

const showAddPrescriptionForm = () => {
  document.getElementById("pos-list-view").classList.add("hidden");
  document.getElementById("pos-form-view").classList.remove("hidden");
  
  if (!document.getElementById("pos-editing-invoice").value) {
    document.getElementById("pos-form-title").innerText = "Tambah Resep";
    cart = [];
    const elRm = document.getElementById("cart-patient-rm");
    if (elRm) elRm.value = "";
    const elName = document.getElementById("cart-patient-name");
    if (elName) elName.value = "";
    const elDoc = document.getElementById("cart-prescription-doctor");
    if (elDoc) elDoc.value = "";
    const elPhone = document.getElementById("cart-patient-phone");
    if (elPhone) elPhone.value = "";
    initPosForm();
    renderCart();
  }
};

const hideAddPrescriptionForm = () => {
  document.getElementById("pos-list-view").classList.remove("hidden");
  document.getElementById("pos-form-view").classList.add("hidden");
  document.getElementById("pos-editing-invoice").value = "";
  renderPrescriptionTable();
};

const loadPrescriptionForEdit = (invoiceId) => {
  const sale = state.sales.find(s => s.invoice === invoiceId);
  if (!sale) return;

  document.getElementById("pos-editing-invoice").value = invoiceId;
  document.getElementById("pos-form-title").innerText = `Edit Resep: ${invoiceId}`;

  // Populate patient form fields (safely, if elements exist)
  const elRm = document.getElementById("cart-patient-rm");
  if (elRm) elRm.value = sale.rm;
  const elName = document.getElementById("cart-patient-name");
  if (elName) elName.value = sale.customer;
  const elIns = document.getElementById("cart-patient-insurance");
  if (elIns) elIns.value = sale.insurance;
  const elPoli = document.getElementById("cart-patient-poli");
  if (elPoli) elPoli.value = sale.poli;
  const elDoc = document.getElementById("cart-prescription-doctor");
  if (elDoc) elDoc.value = sale.doctor;
  const elPhone = document.getElementById("cart-patient-phone");
  if (elPhone) elPhone.value = sale.phone || "";

  // Populate prescription metadata
  document.getElementById("prescription-date").value = sale.date.split("T")[0];
  document.getElementById("prescription-number").value = sale.invoice;
  document.getElementById("prescription-sheet-count").value = sale.sheetCount || 1;
  document.getElementById("prescription-generic-count").value = sale.genericCount || 0;
  document.getElementById("prescription-nongeneric-names").value = sale.nonGenericNames || "";

  cart = sale.items.map(item => {
    const med = state.medicines.find(m => m.name === item.name);
    return {
      code: med ? med.code : "",
      name: item.name,
      batch: med ? med.batch : "",
      unit: med ? med.unit : "tablet",
      qty: item.qty,
      dosage: item.dosage
    };
  });

  calculateCart();
  renderCart();
  showAddPrescriptionForm();
};

const deletePrescription = (invoiceId) => {
  if (confirm(`Apakah Anda yakin ingin menghapus resep ${invoiceId}? Stok obat yang dikeluarkan akan dikembalikan ke gudang.`)) {
    const sale = state.sales.find(s => s.invoice === invoiceId);
    if (sale) {
      sale.items.forEach(item => {
        // Try to find the exact medicine by code first, fallback to name
        let med = item.code ? state.medicines.find(m => m.code === item.code) : null;
        if (!med) {
          med = state.medicines.find(m => m.name.toLowerCase() === item.name.toLowerCase());
        }
        
        if (med) {
          med.stock += item.qty;
          state.stockMovements.push({
            date: new Date().toISOString().split("T")[0],
            medicineName: med.name,
            batch: med.batch,
            origin: `Pembatalan Resep ${sale.insurance}`,
            type: "resep",
            direction: "masuk",
            qty: item.qty,
            expiry: med.expiry,
            refId: invoiceId + "-cancel"
          });
        }
      });
      state.sales = state.sales.filter(s => s.invoice !== invoiceId);
      saveToLocalStorage();
      showToast(`Resep ${invoiceId} berhasil dihapus dan stok dikembalikan.`, "info");
      renderPrescriptionTable();
      renderDashboard();
      renderInventory(); // Ensure Kartu Stok table is re-rendered immediately
    }
  }
};

const exportToExcel = () => {
  let csv = "Tanggal,No Resep,Nama Obat,Tipe,No Batch,Status Expired,Pengeluaran,Jml Lembar,Total Obat,Item Generik,Nama Obat Non-Generik\n";
  const filteredSales = getFilteredSales();
  filteredSales.forEach(sale => {
    sale.items.forEach(item => {
      const med = state.medicines.find(m => m.name === item.name);
      const type = med ? (med.category === "Alat Kesehatan" ? "alkes" : "generik") : "generik";
      const batch = med ? med.batch : "-";
      
      let diffDays = "-";
      if (med) {
        const expDate = new Date(med.expiry);
        diffDays = Math.ceil((expDate - new Date()) / (1000 * 60 * 60 * 24));
      }
      
      csv += `"${sale.date.substring(0, 10)}","${sale.invoice}","${item.name}","${type}","${batch}","${diffDays > 0 ? 'Aman ('+diffDays+' hari)' : 'Expired'}","${item.qty}","${sale.sheetCount || 1}","${sale.itemsCount}","${sale.genericCount || 0}","${sale.nonGenericNames || '-'}"\n`;
    });
  });
  
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `Resep_Obat_${state.currentPrescriptionTab}_${new Date().toISOString().substring(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Data resep berhasil diekspor ke Excel (CSV)", "success");
};

const exportToPDF = () => {
  window.print();
};

// --- PENGELUARAN RESEP (HISTORY AGGREGATION REPORT) ---
const initDispenseFilters = () => {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  const startEl = document.getElementById("dispense-filter-start-date");
  if (startEl && !startEl.value) {
    startEl.value = oneMonthAgo.toISOString().split('T')[0];
  }
  
  const endEl = document.getElementById("dispense-filter-end-date");
  if (endEl && !endEl.value) {
    endEl.value = today.toISOString().split('T')[0];
  }
  
  if (!state.currentDispenseTab) {
    state.currentDispenseTab = "Umum";
  }
};

const setDispenseTab = (tab) => {
  state.currentDispenseTab = tab;
  
  const tabUmum = document.getElementById("dispense-tab-umum");
  const tabBpjs = document.getElementById("dispense-tab-bpjs");
  
  if (tab === "Umum") {
    if (tabUmum) tabUmum.classList.add("active");
    if (tabBpjs) tabBpjs.classList.remove("active");
  } else {
    if (tabUmum) tabUmum.classList.remove("active");
    if (tabBpjs) tabBpjs.classList.add("active");
  }
  
  renderDispenseTable();
};

const renderDispenseTable = () => {
  const tbody = document.getElementById("dispense-table-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  const startDateVal = document.getElementById("dispense-filter-start-date").value;
  const endDateVal = document.getElementById("dispense-filter-end-date").value;
  const searchVal = document.getElementById("dispense-filter-search").value.toLowerCase();
  
  const start = startDateVal ? new Date(startDateVal + "T00:00:00") : null;
  const end = endDateVal ? new Date(endDateVal + "T23:59:59") : null;
  
  // Filter prescriptions first
  const filteredSales = state.sales.filter(sale => {
    // Filter by tab (Umum / BPJS)
    if (sale.insurance !== state.currentDispenseTab) return false;
    
    // Filter by date
    const saleDate = new Date(sale.date);
    if (start && saleDate < start) return false;
    if (end && saleDate > end) return false;
    
    // Filter by search
    if (searchVal) {
      const matchItem = sale.items.some(item => {
        const med = state.medicines.find(m => m.name === item.name);
        const batch = med ? med.batch.toLowerCase() : "";
        return item.name.toLowerCase().includes(searchVal) || batch.includes(searchVal);
      });
      const matchNonGeneric = sale.nonGenericNames && sale.nonGenericNames.toLowerCase().includes(searchVal);
      const matchInvoice = sale.invoice.toLowerCase().includes(searchVal);
      return matchItem || matchNonGeneric || matchInvoice;
    }
    
    return true;
  });

  if (filteredSales.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 30px;" class="text-muted">Tidak ada data pengeluaran resep dalam periode ini.</td></tr>`;
    return;
  }

  // Group by Date YYYY-MM-DD
  const grouped = {};
  filteredSales.forEach(sale => {
    const dStr = sale.date.split("T")[0];
    if (!grouped[dStr]) grouped[dStr] = [];
    grouped[dStr].push(sale);
  });

  // Sort dates descending
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  sortedDates.forEach(dStr => {
    const salesForDate = grouped[dStr];
    
    // Calculations
    const totalSheets = salesForDate.reduce((sum, s) => sum + (parseInt(s.sheetCount) || 1), 0);
    const totalObat = salesForDate.reduce((sum, s) => sum + (parseInt(s.itemsCount) || 0), 0);
    const totalGeneric = salesForDate.reduce((sum, s) => sum + (parseInt(s.genericCount) || 0), 0);
    const percentGeneric = totalObat > 0 ? Math.min(100, Math.round((totalGeneric / totalObat) * 100)) : 0;
    
    // Aggregate unique non-generic names
    const nonGenericList = salesForDate
      .map(s => s.nonGenericNames)
      .filter(name => name && name.trim() !== "")
      .map(name => name.trim());
    const uniqueNonGeneric = [...new Set(nonGenericList)];
    const nonGenericDisplay = uniqueNonGeneric.length > 0 ? uniqueNonGeneric.join(", ") : "-";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${dStr}</td>
      <td>${totalSheets}</td>
      <td><strong>${totalObat}</strong></td>
      <td>${totalGeneric}</td>
      <td style="color: var(--primary); font-weight: 700;">${percentGeneric}%</td>
      <td>${nonGenericDisplay}</td>
    `;
    tbody.appendChild(tr);
  });
};

const exportDispenseExcel = () => {
  let csv = "Tanggal Resep,Jumlah Lembar Resep,Total Obat Dalam Resep,Jumlah Item Obat Generik,% Obat Generik,Nama Obat Non-Generik\n";
  
  const startDateVal = document.getElementById("dispense-filter-start-date").value;
  const endDateVal = document.getElementById("dispense-filter-end-date").value;
  const searchVal = document.getElementById("dispense-filter-search").value.toLowerCase();
  const start = startDateVal ? new Date(startDateVal + "T00:00:00") : null;
  const end = endDateVal ? new Date(endDateVal + "T23:59:59") : null;
  
  const filteredSales = state.sales.filter(sale => {
    if (sale.insurance !== state.currentDispenseTab) return false;
    const saleDate = new Date(sale.date);
    if (start && saleDate < start) return false;
    if (end && saleDate > end) return false;
    if (searchVal) {
      const matchItem = sale.items.some(item => item.name.toLowerCase().includes(searchVal));
      const matchNonGeneric = sale.nonGenericNames && sale.nonGenericNames.toLowerCase().includes(searchVal);
      const matchInvoice = sale.invoice.toLowerCase().includes(searchVal);
      return matchItem || matchNonGeneric || matchInvoice;
    }
    return true;
  });

  const grouped = {};
  filteredSales.forEach(sale => {
    const dStr = sale.date.split("T")[0];
    if (!grouped[dStr]) grouped[dStr] = [];
    grouped[dStr].push(sale);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  sortedDates.forEach(dStr => {
    const salesForDate = grouped[dStr];
    const totalSheets = salesForDate.reduce((sum, s) => sum + (parseInt(s.sheetCount) || 1), 0);
    const totalObat = salesForDate.reduce((sum, s) => sum + (parseInt(s.itemsCount) || 0), 0);
    const totalGeneric = salesForDate.reduce((sum, s) => sum + (parseInt(s.genericCount) || 0), 0);
    const percentGeneric = totalObat > 0 ? Math.min(100, Math.round((totalGeneric / totalObat) * 100)) : 0;
    
    const nonGenericList = salesForDate
      .map(s => s.nonGenericNames)
      .filter(name => name && name.trim() !== "")
      .map(name => name.trim());
    const uniqueNonGeneric = [...new Set(nonGenericList)];
    const nonGenericDisplay = uniqueNonGeneric.length > 0 ? uniqueNonGeneric.join(", ") : "-";

    csv += `"${dStr}","${totalSheets}","${totalObat}","${totalGeneric}","${percentGeneric}%","${nonGenericDisplay}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `Pengeluaran_Resep_${state.currentDispenseTab}_${new Date().toISOString().substring(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Laporan Pengeluaran Resep berhasil diekspor ke Excel (CSV)", "success");
};

const exportDispensePDF = () => {
  window.print();
};

const printDispense = () => {
  window.print();
};

// --- KARTU STOK LOGIC & FILTERING ---
const initInventoryFilters = () => {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  const startEl = document.getElementById("inventory-filter-start-date");
  if (startEl && !startEl.value) {
    startEl.value = oneMonthAgo.toISOString().split('T')[0];
  }
  
  const endEl = document.getElementById("inventory-filter-end-date");
  if (endEl && !endEl.value) {
    endEl.value = today.toISOString().split('T')[0];
  }
};

const renderInventory = () => {
  const tbody = document.getElementById("inventory-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  const startDateVal = document.getElementById("inventory-filter-start-date").value;
  const endDateVal = document.getElementById("inventory-filter-end-date").value;
  const searchVal = document.getElementById("inventory-search").value.toLowerCase();
  
  const start = startDateVal ? new Date(startDateVal + "T00:00:00") : null;
  const end = endDateVal ? new Date(endDateVal + "T23:59:59") : null;

  const filteredMovements = state.stockMovements.filter(m => {
    // Filter by date
    const mDate = new Date(m.date + "T00:00:00");
    if (start && mDate < start) return false;
    if (end && mDate > end) return false;
    
    // Filter by search
    if (searchVal) {
      return m.medicineName.toLowerCase().includes(searchVal) || m.batch.toLowerCase().includes(searchVal);
    }
    return true;
  });

  if (filteredMovements.length === 0) {
    tbody.innerHTML = `<tr><td colspan="17" style="text-align: center; padding: 30px;" class="text-muted">Tidak ada riwayat pergerakan stok dalam periode ini.</td></tr>`;
    return;
  }

  const grouped = {};
  filteredMovements.forEach(m => {
    const key = `${m.date}_${m.medicineName}_${m.batch}`;
    if (!grouped[key]) {
      grouped[key] = {
        date: m.date,
        medicineName: m.medicineName,
        batch: m.batch,
        expiry: m.expiry,
        origins: [],
        occurrences: 0,
        resep_masuk: 0,
        resep_keluar: 0,
        amprahan_masuk: 0,
        amprahan_keluar: 0,
        opname_masuk: 0,
        opname_keluar: 0,
        gudang_masuk: 0,
        gudang_keluar: 0,
        total_masuk: 0,
        total_keluar: 0
      };
    }
    
    const group = grouped[key];
    group.occurrences += 1;
    
    if (m.origin && !group.origins.includes(m.origin)) {
      group.origins.push(m.origin);
    }
    
    const qty = parseInt(m.qty) || 0;
    if (m.direction === "masuk") {
      group.total_masuk += qty;
      if (m.type === "resep") group.resep_masuk += qty;
      else if (m.type === "amprahan") group.amprahan_masuk += qty;
      else if (m.type === "opname") group.opname_masuk += qty;
      else if (m.type === "gudang") group.gudang_masuk += qty;
    } else if (m.direction === "keluar") {
      group.total_keluar += qty;
      if (m.type === "resep") group.resep_keluar += qty;
      else if (m.type === "amprahan") group.amprahan_keluar += qty;
      else if (m.type === "opname") group.opname_keluar += qty;
      else if (m.type === "gudang") group.gudang_keluar += qty;
    }
  });

  const getGroupStock = (group) => {
    const med = state.medicines.find(m => m.name.toLowerCase() === group.medicineName.toLowerCase() && m.batch.toLowerCase() === group.batch.toLowerCase());
    return med ? med.stock : 0;
  };

  const sortedGroups = Object.values(grouped).sort((a, b) => {
    const stockA = getGroupStock(a);
    const stockB = getGroupStock(b);
    if (stockA !== stockB) return stockA - stockB;
    const dateCompare = new Date(b.date) - new Date(a.date);
    if (dateCompare !== 0) return dateCompare;
    return a.medicineName.localeCompare(b.medicineName);
  });

  const formatCell = (val, isMasuk) => {
    if (val === 0) return `<span style="color: #9ca3af;">-</span>`;
    if (isMasuk) return `<span style="color: #10b981; font-weight: 600;">+${val}</span>`;
    return `<span style="color: #ef4444; font-weight: 600;">-${val}</span>`;
  };

  sortedGroups.forEach(group => {
    const med = state.medicines.find(m => m.name.toLowerCase() === group.medicineName.toLowerCase() && m.batch.toLowerCase() === group.batch.toLowerCase());
    const currentStock = med ? med.stock : 0;
    const medCode = med ? med.code : "";
    const expiryDate = med ? med.expiry : group.expiry;

    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid var(--border-color)";
    
    // badge occurrences
    const occurrencesBadge = group.occurrences > 1 
      ? `<span class="badge" style="background: rgba(139, 92, 246, 0.1); color: #7c3aed; margin-left: 6px; padding: 2px 6px; font-size: 0.72rem; border-radius: 4px; font-weight: 700;">x${group.occurrences}</span>` 
      : "";

    tr.innerHTML = `
      <td style="text-align: left; white-space: nowrap;">${group.date}</td>
      <td style="text-align: left; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${group.origins.join(", ")}">${group.origins.join(", ") || "-"}</td>
      <td style="text-align: left; font-weight: 700; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${group.medicineName}">${group.medicineName}${occurrencesBadge}</td>
      <td style="text-align: center;"><span class="badge badge-neutral">${group.batch}</span></td>
      
      <td style="text-align: center; border-left: 1px solid var(--border-color);">${formatCell(group.resep_masuk, true)}</td>
      <td style="text-align: center; border-right: 1px solid var(--border-color);">${formatCell(group.resep_keluar, false)}</td>
      
      <td style="text-align: center;">${formatCell(group.amprahan_masuk, true)}</td>
      <td style="text-align: center; border-right: 1px solid var(--border-color);">${formatCell(group.amprahan_keluar, false)}</td>
      
      <td style="text-align: center;">${formatCell(group.opname_masuk, true)}</td>
      <td style="text-align: center; border-right: 1px solid var(--border-color);">${formatCell(group.opname_keluar, false)}</td>
      
      <td style="text-align: center;">${formatCell(group.gudang_masuk, true)}</td>
      <td style="text-align: center; border-right: 1px solid var(--border-color);">${formatCell(group.gudang_keluar, false)}</td>
      
      <td style="text-align: center; font-weight: 700;">${formatCell(group.total_masuk, true)}</td>
      <td style="text-align: center; font-weight: 700; border-right: 1px solid var(--border-color);">${formatCell(group.total_keluar, false)}</td>
      
      <td style="text-align: left; white-space: nowrap;">${expiryDate}</td>
      <td style="text-align: center; font-weight: bold; color: #7c3aed;">${currentStock}</td>
      <td style="text-align: right; white-space: nowrap;">
        ${medCode ? `
          <button class="btn btn-secondary btn-sm btn-icon" onclick="openEditMedicineModal('${medCode}')" title="Edit" style="border: none; background: transparent; padding: 4px; cursor: pointer; color: var(--text-main);">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteMedicine('${medCode}')" title="Hapus" style="border: none; background: transparent; padding: 4px; cursor: pointer; color: #ef4444; margin-left: 8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        ` : `<span style="color: #9ca3af; font-size: 0.8rem;">Deleted</span>`}
      </td>
    `;
    tbody.appendChild(tr);
  });
};

const exportInventoryExcel = () => {
  let csv = "Tanggal,Dari,Nama Obat,No Batch,Resep Masuk,Resep Keluar,Amprahan Masuk,Amprahan Keluar,Opname Masuk,Opname Keluar,Gudang Masuk,Gudang Keluar,Total Masuk,Total Keluar,Tgl Expired,Jumlah Stok\n";
  
  const startDateVal = document.getElementById("inventory-filter-start-date").value;
  const endDateVal = document.getElementById("inventory-filter-end-date").value;
  const searchVal = document.getElementById("inventory-search").value.toLowerCase();
  
  const start = startDateVal ? new Date(startDateVal + "T00:00:00") : null;
  const end = endDateVal ? new Date(endDateVal + "T23:59:59") : null;

  const filteredMovements = state.stockMovements.filter(m => {
    const mDate = new Date(m.date + "T00:00:00");
    if (start && mDate < start) return false;
    if (end && mDate > end) return false;
    if (searchVal) {
      return m.medicineName.toLowerCase().includes(searchVal) || m.batch.toLowerCase().includes(searchVal);
    }
    return true;
  });

  const grouped = {};
  filteredMovements.forEach(m => {
    const key = `${m.date}_${m.medicineName}_${m.batch}`;
    if (!grouped[key]) {
      grouped[key] = {
        date: m.date,
        medicineName: m.medicineName,
        batch: m.batch,
        expiry: m.expiry,
        origins: [],
        occurrences: 0,
        resep_masuk: 0,
        resep_keluar: 0,
        amprahan_masuk: 0,
        amprahan_keluar: 0,
        opname_masuk: 0,
        opname_keluar: 0,
        gudang_masuk: 0,
        gudang_keluar: 0,
        total_masuk: 0,
        total_keluar: 0
      };
    }
    const group = grouped[key];
    group.occurrences += 1;
    if (m.origin && !group.origins.includes(m.origin)) {
      group.origins.push(m.origin);
    }
    const qty = parseInt(m.qty) || 0;
    if (m.direction === "masuk") {
      group.total_masuk += qty;
      if (m.type === "resep") group.resep_masuk += qty;
      else if (m.type === "amprahan") group.amprahan_masuk += qty;
      else if (m.type === "opname") group.opname_masuk += qty;
      else if (m.type === "gudang") group.gudang_masuk += qty;
    } else if (m.direction === "keluar") {
      group.total_keluar += qty;
      if (m.type === "resep") group.resep_keluar += qty;
      else if (m.type === "amprahan") group.amprahan_keluar += qty;
      else if (m.type === "opname") group.opname_keluar += qty;
      else if (m.type === "gudang") group.gudang_keluar += qty;
    }
  });

  const getGroupStock = (group) => {
    const med = state.medicines.find(m => m.name.toLowerCase() === group.medicineName.toLowerCase() && m.batch.toLowerCase() === group.batch.toLowerCase());
    return med ? med.stock : 0;
  };

  const sortedGroups = Object.values(grouped).sort((a, b) => {
    const stockA = getGroupStock(a);
    const stockB = getGroupStock(b);
    if (stockA !== stockB) return stockA - stockB;
    const dateCompare = new Date(b.date) - new Date(a.date);
    if (dateCompare !== 0) return dateCompare;
    return a.medicineName.localeCompare(b.medicineName);
  });

  sortedGroups.forEach(group => {
    const med = state.medicines.find(m => m.name.toLowerCase() === group.medicineName.toLowerCase() && m.batch.toLowerCase() === group.batch.toLowerCase());
    const currentStock = med ? med.stock : 0;
    const expiryDate = med ? med.expiry : group.expiry;
    const originsStr = group.origins.join(" | ");

    csv += `"${group.date}","${originsStr}","${group.medicineName}","${group.batch}","${group.resep_masuk}","${group.resep_keluar}","${group.amprahan_masuk}","${group.amprahan_keluar}","${group.opname_masuk}","${group.opname_keluar}","${group.gudang_masuk}","${group.gudang_keluar}","${group.total_masuk}","${group.total_keluar}","${expiryDate}","${currentStock}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `Kartu_Stok_${new Date().toISOString().substring(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Laporan Kartu Stok berhasil diekspor ke Excel (CSV)", "success");
};

const printInventory = () => {
  const startDateVal = document.getElementById("inventory-filter-start-date").value;
  const endDateVal = document.getElementById("inventory-filter-end-date").value;
  const searchVal = document.getElementById("inventory-search").value.toLowerCase();
  
  const start = startDateVal ? new Date(startDateVal + "T00:00:00") : null;
  const end = endDateVal ? new Date(endDateVal + "T23:59:59") : null;

  const filteredMovements = state.stockMovements.filter(m => {
    const mDate = new Date(m.date + "T00:00:00");
    if (start && mDate < start) return false;
    if (end && mDate > end) return false;
    if (searchVal) {
      return m.medicineName.toLowerCase().includes(searchVal) || m.batch.toLowerCase().includes(searchVal);
    }
    return true;
  });

  const grouped = {};
  filteredMovements.forEach(m => {
    const key = `${m.date}_${m.medicineName}_${m.batch}`;
    if (!grouped[key]) {
      grouped[key] = {
        date: m.date,
        medicineName: m.medicineName,
        batch: m.batch,
        expiry: m.expiry,
        origins: [],
        occurrences: 0,
        resep_masuk: 0,
        resep_keluar: 0,
        amprahan_masuk: 0,
        amprahan_keluar: 0,
        opname_masuk: 0,
        opname_keluar: 0,
        gudang_masuk: 0,
        gudang_keluar: 0,
        total_masuk: 0,
        total_keluar: 0
      };
    }
    const group = grouped[key];
    group.occurrences += 1;
    if (m.origin && !group.origins.includes(m.origin)) {
      group.origins.push(m.origin);
    }
    const qty = parseInt(m.qty) || 0;
    if (m.direction === "masuk") {
      group.total_masuk += qty;
      if (m.type === "resep") group.resep_masuk += qty;
      else if (m.type === "amprahan") group.amprahan_masuk += qty;
      else if (m.type === "opname") group.opname_masuk += qty;
      else if (m.type === "gudang") group.gudang_masuk += qty;
    } else if (m.direction === "keluar") {
      group.total_keluar += qty;
      if (m.type === "resep") group.resep_keluar += qty;
      else if (m.type === "amprahan") group.amprahan_keluar += qty;
      else if (m.type === "opname") group.opname_keluar += qty;
      else if (m.type === "gudang") group.gudang_keluar += qty;
    }
  });

  const getGroupStock = (group) => {
    const med = state.medicines.find(m => m.name.toLowerCase() === group.medicineName.toLowerCase() && m.batch.toLowerCase() === group.batch.toLowerCase());
    return med ? med.stock : 0;
  };

  const sortedGroups = Object.values(grouped).sort((a, b) => {
    const stockA = getGroupStock(a);
    const stockB = getGroupStock(b);
    if (stockA !== stockB) return stockA - stockB;
    const dateCompare = new Date(b.date) - new Date(a.date);
    if (dateCompare !== 0) return dateCompare;
    return a.medicineName.localeCompare(b.medicineName);
  });

  let tableRows = "";
  const formatCell = (val) => {
    return val === 0 ? "-" : val;
  };

  sortedGroups.forEach((group, idx) => {
    const med = state.medicines.find(m => m.name.toLowerCase() === group.medicineName.toLowerCase() && m.batch.toLowerCase() === group.batch.toLowerCase());
    const currentStock = med ? med.stock : 0;
    const expiryDate = med ? med.expiry : group.expiry;

    tableRows += `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td style="text-align: center;">${group.date}</td>
        <td>${group.origins.join(", ") || "-"}</td>
        <td style="font-weight: bold;">${group.medicineName}</td>
        <td style="text-align: center;">${group.batch}</td>
        <td style="text-align: center;">${formatCell(group.resep_masuk)}</td>
        <td style="text-align: center;">${formatCell(group.resep_keluar)}</td>
        <td style="text-align: center;">${formatCell(group.amprahan_masuk)}</td>
        <td style="text-align: center;">${formatCell(group.amprahan_keluar)}</td>
        <td style="text-align: center;">${formatCell(group.opname_masuk)}</td>
        <td style="text-align: center;">${formatCell(group.opname_keluar)}</td>
        <td style="text-align: center;">${formatCell(group.gudang_masuk)}</td>
        <td style="text-align: center;">${formatCell(group.gudang_keluar)}</td>
        <td style="text-align: center; font-weight: bold;">${formatCell(group.total_masuk)}</td>
        <td style="text-align: center; font-weight: bold;">${formatCell(group.total_keluar)}</td>
        <td style="text-align: center;">${expiryDate}</td>
        <td style="text-align: center; font-weight: bold; color: #7c3aed;">${currentStock}</td>
      </tr>
    `;
  });

  const printContainer = document.getElementById("print-invoice-a4-wrapper");
  const todayDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const periodText = `Periode: ${startDateVal || "-"} s/d ${endDateVal || "-"}`;

  const html = `
    <div class="lplpo-print-container">
      <h2>LAPORAN KARTU STOK OBAT & GUDANG</h2>
      <h3>PUSKESMAS: ${state.settings.name.toUpperCase()} | ${periodText.toUpperCase()}</h3>
      
      <div style="font-size: 0.72rem; margin-bottom: 8px; display: flex; justify-content: space-between;">
        <span>Alamat: ${state.settings.address}</span>
        <span>Telpon: ${state.settings.phone}</span>
      </div>

      <table class="lplpo-print-table" style="font-size: 0.7rem;">
        <thead>
          <tr>
            <th rowspan="2">No</th>
            <th rowspan="2">Tanggal</th>
            <th rowspan="2">Dari</th>
            <th rowspan="2">Nama Obat</th>
            <th rowspan="2">Batch</th>
            <th colspan="2">Resep</th>
            <th colspan="2">Amprahan</th>
            <th colspan="2">Opname</th>
            <th colspan="2">Gudang</th>
            <th colspan="2">Total</th>
            <th rowspan="2">Expired</th>
            <th rowspan="2">Stok</th>
          </tr>
          <tr>
            <th>Msk</th>
            <th>Klr</th>
            <th>Msk</th>
            <th>Klr</th>
            <th>Msk</th>
            <th>Klr</th>
            <th>Msk</th>
            <th>Klr</th>
            <th>Msk</th>
            <th>Klr</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <!-- Tanda Tangan PJ -->
      <div class="lplpo-signature-area">
        <div class="lplpo-signature-box">
          <div>Mengetahui,</div>
          <div style="font-weight: bold;">Kepala Puskesmas</div>
          <div class="lplpo-signature-space"></div>
          <div style="text-decoration: underline; font-weight: bold;">${state.settings.kepala}</div>
          <div>NIP. ${state.settings.kepalaNip}</div>
        </div>
        
        <div class="lplpo-signature-box">
          <div>Jakarta, ${todayDate}</div>
          <div style="font-weight: bold;">Apoteker Penanggung Jawab</div>
          <div class="lplpo-signature-space"></div>
          <div style="text-decoration: underline; font-weight: bold;">${state.settings.apoteker}</div>
          <div>SIPA. ${state.settings.apotekerSipa}</div>
        </div>
      </div>
    </div>
  `;

  printContainer.innerHTML = html;
  document.body.classList.add("printing-lplpo");
  window.print();
};

const exportInventoryPDF = () => {
  printInventory();
};

// --- STOK OPNAME SYSTEMS & LOGIC ---
const loadOpnameFormData = () => {
  const select = document.getElementById("opname-medicine");
  if (!select) return;
  
  select.innerHTML = `<option value="">-- Pilih Obat & Batch --</option>`;
  state.medicines.forEach(m => {
    const opt = document.createElement("option");
    opt.value = `${m.code}_${m.batch}`;
    opt.innerText = `${m.name} (Batch: ${m.batch} | Exp: ${m.expiry} | Stok: ${m.stock})`;
    select.appendChild(opt);
  });

  // Clear inputs
  document.getElementById("opname-system-stock").value = "";
  document.getElementById("opname-physical-stock").value = "";
  
  const diffWrapper = document.getElementById("opname-difference-wrapper");
  if (diffWrapper) {
    diffWrapper.innerText = "-";
    diffWrapper.style.color = "var(--text-main)";
    diffWrapper.style.backgroundColor = "var(--bg-badge)";
    diffWrapper.style.borderColor = "var(--border-color)";
  }
  
  document.getElementById("opname-notes").value = "";
  document.getElementById("opname-reason").value = "Koreksi Selisih";

  renderOpnameHistory();
};

const updateOpnameCalculations = () => {
  const selectVal = document.getElementById("opname-medicine").value;
  const physicalInput = document.getElementById("opname-physical-stock");
  const systemInput = document.getElementById("opname-system-stock");
  const diffWrapper = document.getElementById("opname-difference-wrapper");

  if (!selectVal) {
    systemInput.value = "";
    diffWrapper.innerText = "-";
    diffWrapper.style.color = "var(--text-main)";
    diffWrapper.style.backgroundColor = "var(--bg-badge)";
    diffWrapper.style.borderColor = "var(--border-color)";
    return;
  }

  const [code, batch] = selectVal.split("_");
  const med = state.medicines.find(m => m.code === code && m.batch === batch);
  if (!med) return;

  systemInput.value = med.stock;

  const physicalValStr = physicalInput.value.trim();
  if (physicalValStr === "") {
    diffWrapper.innerText = "-";
    diffWrapper.style.color = "var(--text-main)";
    diffWrapper.style.backgroundColor = "var(--bg-badge)";
    diffWrapper.style.borderColor = "var(--border-color)";
    return;
  }

  const systemStock = med.stock;
  const physicalStock = parseInt(physicalValStr) || 0;
  const diff = physicalStock - systemStock;

  if (diff > 0) {
    diffWrapper.innerText = `+${diff} (Surplus / Lebih)`;
    diffWrapper.style.color = "#065f46"; // dark green
    diffWrapper.style.backgroundColor = "#d1fae5"; // light green
    diffWrapper.style.borderColor = "#a7f3d0";
  } else if (diff < 0) {
    diffWrapper.innerText = `${diff} (Defisit / Kurang)`;
    diffWrapper.style.color = "#991b1b"; // dark red
    diffWrapper.style.backgroundColor = "#fee2e2"; // light red
    diffWrapper.style.borderColor = "#fca5a5";
  } else {
    diffWrapper.innerText = "0 (Sesuai / Cocok)";
    diffWrapper.style.color = "#0369a1"; // dark blue
    diffWrapper.style.backgroundColor = "#e0f2fe"; // light blue
    diffWrapper.style.borderColor = "#bae6fd";
  }
};

const renderOpnameHistory = () => {
  const tbody = document.getElementById("opname-history-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const list = [...state.opnames].reverse().slice(0, 20);
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px;" class="text-muted">Belum ada riwayat pelaksanaan stok opname.</td></tr>`;
    return;
  }

  list.forEach(item => {
    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid var(--border-color)";

    let diffHTML = "-";
    if (item.difference > 0) {
      diffHTML = `<span style="color: #10b981; font-weight: bold;">+${item.difference}</span>`;
    } else if (item.difference < 0) {
      diffHTML = `<span style="color: #ef4444; font-weight: bold;">${item.difference}</span>`;
    } else {
      diffHTML = `<span style="color: #3b82f6;">0</span>`;
    }

    tr.innerHTML = `
      <td style="padding: 10px 8px; white-space: nowrap;">${item.date}</td>
      <td style="padding: 10px 8px; font-weight: bold;">${item.medicineName} <br><span class="badge badge-neutral" style="font-size:0.65rem;">${item.batch}</span></td>
      <td style="padding: 10px 8px; text-align: center;">${item.systemStock}</td>
      <td style="padding: 10px 8px; text-align: center; font-weight: bold;">${item.physicalStock}</td>
      <td style="padding: 10px 8px; text-align: center;">${diffHTML}</td>
      <td style="padding: 10px 8px;" title="${item.notes || ''}"><strong>${item.reason}</strong></td>
      <td style="padding: 10px 8px;">${item.cashier.split(" ")[0]}</td>
    `;
    tbody.appendChild(tr);
  });
};

const handleSaveOpname = (e) => {
  e.preventDefault();
  const selectVal = document.getElementById("opname-medicine").value;
  const physicalValStr = document.getElementById("opname-physical-stock").value;
  const reason = document.getElementById("opname-reason").value;
  const notes = document.getElementById("opname-notes").value.trim();

  if (!selectVal || physicalValStr === "") {
    showToast("Isi semua input formulir stok opname secara lengkap!", "warning");
    return;
  }

  const [code, batch] = selectVal.split("_");
  const med = state.medicines.find(m => m.code === code && m.batch === batch);
  if (!med) return;

  const systemStock = med.stock;
  const physicalStock = parseInt(physicalValStr) || 0;
  const diff = physicalStock - systemStock;

  if (diff === 0 && !confirm("Selisih stok adalah 0 (cocok). Apakah Anda ingin tetap menyimpan catatan audit opname ini?")) {
    return;
  }

  // Update physical stock in medicine database
  med.stock = physicalStock;

  const curUser = JSON.parse(sessionStorage.getItem("puskespharma_user")) || { name: "Sarah Annisa (Apoteker)" };
  const todayDateStr = new Date().toISOString().split("T")[0];

  // Insert to state.opnames
  const newOpname = {
    date: todayDateStr,
    code: med.code,
    medicineName: med.name,
    batch: med.batch,
    systemStock: systemStock,
    physicalStock: physicalStock,
    difference: diff,
    reason: reason,
    notes: notes || `Opname bulanan oleh ${curUser.name}`,
    cashier: curUser.name
  };
  state.opnames.push(newOpname);

  // Insert to state.stockMovements (if there is a difference)
  if (diff !== 0) {
    state.stockMovements.push({
      date: todayDateStr,
      medicineName: med.name,
      batch: med.batch,
      origin: `Stok Opname (${reason})`,
      type: "opname",
      direction: diff > 0 ? "masuk" : "keluar",
      qty: Math.abs(diff),
      expiry: med.expiry,
      refId: `opname-ledger-${Date.now()}`
    });
  }

  saveToLocalStorage();
  showToast(`Stok opname ${med.name} sukses disimpan! Persediaan diperbarui menjadi ${physicalStock} ${med.unit}.`, "success");

  // Rerender and Reset Form
  loadOpnameFormData();
};

const populateMedicineSuggestions = () => {
  const datalist = document.getElementById("medicine-name-suggestions");
  if (!datalist) return;
  
  const uniqueNames = [...new Set(state.medicines.map(m => m.name))].sort();
  datalist.innerHTML = uniqueNames.map(name => `<option value="${name}"></option>`).join("");
};

const openAddMedicineModal = () => {
  document.getElementById("modal-medicine-title").innerText = "Tambah Data Obat Gudang";
  document.getElementById("medicine-index").value = "";
  document.getElementById("medicine-code").value = `OB-${String(state.medicines.length + 1).padStart(3, '0')}`;
  
  document.getElementById("medicine-batch").value = "";
  document.getElementById("medicine-name").value = "";
  document.getElementById("medicine-stock").value = "";
  document.getElementById("medicine-unit").value = "tablet";
  document.getElementById("medicine-expiry").value = "";
  
  populateMedicineSuggestions();
  openModal("modal-medicine");
};

const openEditMedicineModal = (code) => {
  const med = state.medicines.find(m => m.code === code);
  if (med) {
    document.getElementById("modal-medicine-title").innerText = "Ubah Data Obat";
    document.getElementById("medicine-index").value = state.medicines.indexOf(med);
    document.getElementById("medicine-code").value = med.code;
    
    document.getElementById("medicine-batch").value = med.batch;
    document.getElementById("medicine-category").value = med.category;
    document.getElementById("medicine-name").value = med.name;
    document.getElementById("medicine-stock").value = med.stock;
    document.getElementById("medicine-unit").value = med.unit;
    document.getElementById("medicine-expiry").value = med.expiry;
    
    openModal("modal-medicine");
  }
};

const handleSaveMedicine = (e) => {
  e.preventDefault();
  const idx = document.getElementById("medicine-index").value;
  const code = document.getElementById("medicine-code").value;
  
  const savedData = {
    code: code,
    batch: document.getElementById("medicine-batch").value.trim().toUpperCase(),
    category: document.getElementById("medicine-category").value,
    name: document.getElementById("medicine-name").value.trim(),
    stock: parseInt(document.getElementById("medicine-stock").value) || 0,
    unit: document.getElementById("medicine-unit").value.trim().toLowerCase(),
    expiry: document.getElementById("medicine-expiry").value
  };

  if (idx === "") {
    // Check if medicine with same name, batch, and expiry already exists
    const existingMed = state.medicines.find(m => 
      m.name.trim().toLowerCase() === savedData.name.toLowerCase() &&
      m.batch.trim().toUpperCase() === savedData.batch &&
      m.expiry === savedData.expiry
    );

    if (existingMed) {
      existingMed.stock += savedData.stock;
      state.stockMovements.push({
        date: new Date().toISOString().split("T")[0],
        medicineName: existingMed.name,
        batch: existingMed.batch,
        origin: "Stok Masuk (Gudang)",
        type: "gudang",
        direction: "masuk",
        qty: savedData.stock,
        expiry: existingMed.expiry,
        refId: "add-stock-" + existingMed.code + "-" + Date.now()
      });
      showToast(`Stok obat ${existingMed.name} (Batch: ${existingMed.batch}) bertambah sebesar ${savedData.stock} ${existingMed.unit}!`, "success");
    } else {
      state.medicines.push(savedData);
      state.stockMovements.push({
        date: new Date().toISOString().split("T")[0],
        medicineName: savedData.name,
        batch: savedData.batch,
        origin: "Gudang Utama",
        type: "gudang",
        direction: "masuk",
        qty: savedData.stock,
        expiry: savedData.expiry,
        refId: "init-" + savedData.code
      });
      showToast(`Obat ${savedData.name} sukses ditambahkan ke gudang!`, "success");
    }
  } else {
    const oldMed = state.medicines[parseInt(idx)];
    const diff = savedData.stock - oldMed.stock;
    if (diff !== 0) {
      state.stockMovements.push({
        date: new Date().toISOString().split("T")[0],
        medicineName: savedData.name,
        batch: savedData.batch,
        origin: "Koreksi Opname",
        type: "opname",
        direction: diff > 0 ? "masuk" : "keluar",
        qty: Math.abs(diff),
        expiry: savedData.expiry,
        refId: "opname-" + savedData.code + "-" + Date.now()
      });
    }
    state.medicines[parseInt(idx)] = savedData;
    showToast(`Perubahan data obat ${savedData.name} disimpan!`, "success");
  }
  
  saveToLocalStorage();
  closeModal("modal-medicine");
  renderInventory();
  renderLPLPO();
};

const deleteMedicine = (code) => {
  if (confirm(`Apakah Anda yakin ingin menghapus data obat dengan kode ${code}?`)) {
    state.medicines = state.medicines.filter(m => m.code !== code);
    saveToLocalStorage();
    showToast("Data obat telah dihapus dari sistem.", "info");
    renderInventory();
    renderLPLPO();
  }
};

// --- MUTASI STOK INTERNAL SUB-UNIT ---
const loadMutationFormData = () => {
  mutationCart = [{
    code: "",
    qty: ""
  }];
  document.getElementById("mutation-notes").value = "";
  renderMutationCart();
  renderMutationHistory();
};

const addEmptyMutationRow = () => {
  mutationCart.push({
    code: "",
    qty: ""
  });
  renderMutationCart();
};

const removeFromMutationCartByIdx = (index) => {
  mutationCart.splice(index, 1);
  renderMutationCart();
};

const changeMutationCartItem = (index, code) => {
  if (code === "") {
    mutationCart[index].code = "";
    mutationCart[index].qty = "";
  } else {
    const isDup = mutationCart.some((item, idx) => idx !== index && item.code === code);
    if (isDup) {
      showToast("Obat ini sudah terpilih di baris lain!", "warning");
      renderMutationCart();
      return;
    }
    const med = state.medicines.find(m => m.code === code);
    if (med) {
      mutationCart[index].code = code;
      mutationCart[index].qty = 1;
    }
  }
  renderMutationCart();
};

const updateMutationCartQtyByIdx = (index, val) => {
  const item = mutationCart[index];
  if (!item) return;

  if (val === "") {
    item.qty = "";
    return;
  }

  const qty = parseInt(val) || 0;
  if (item.code) {
    const med = state.medicines.find(m => m.code === item.code);
    if (med) {
      if (qty > med.stock) {
        showToast(`Stok tidak mencukupi! Batas stok gudang utama adalah ${med.stock}.`, "warning");
        item.qty = med.stock;
        renderMutationCart();
        return;
      }
    }
  }
  item.qty = qty;
};

const renderMutationCart = () => {
  const container = document.getElementById("mutation-items-container");
  if (!container) return;
  container.innerHTML = "";

  if (mutationCart.length === 0) {
    container.innerHTML = `<div class="text-muted" style="text-align: center; padding: 12px 0; font-size: 0.8rem;">Belum ada obat ditambahkan. Klik "+ Tambah Obat".</div>`;
    return;
  }

  mutationCart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.style.gridTemplateColumns = "2.5fr 1fr auto";
    div.style.gap = "10px";
    div.style.alignItems = "center";
    div.style.marginBottom = "0";
    div.style.padding = "4px 0";

    let optionsHTML = `<option value="">-- Pilih Obat --</option>`;
    state.medicines.filter(m => m.stock > 0 || m.code === item.code).forEach(m => {
      const isSelected = m.code === item.code ? "selected" : "";
      optionsHTML += `<option value="${m.code}" ${isSelected}>${m.name} (Batch: ${m.batch} - Tersedia: ${m.stock} ${m.unit})</option>`;
    });

    div.innerHTML = `
      <div class="cart-item-col" style="margin-bottom: 0;">
        <select class="cart-item-select" style="padding: 8px; border-radius: var(--radius-sm); font-size: 0.8rem;" onchange="changeMutationCartItem(${index}, this.value)">
          ${optionsHTML}
        </select>
      </div>
      <div class="cart-item-col" style="margin-bottom: 0;">
        <input type="number" class="cart-item-qty-input" style="padding: 8px; border-radius: var(--radius-sm); font-size: 0.8rem;" value="${item.qty}" min="1" placeholder="Qty" oninput="updateMutationCartQtyByIdx(${index}, this.value)">
      </div>
      <button type="button" class="cart-item-delete-btn" style="padding: 6px; margin: 0; display: flex; align-items: center; justify-content: center; background: transparent; border: none; cursor: pointer; color: var(--text-muted);" onclick="removeFromMutationCartByIdx(${index})" title="Hapus Baris">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
      </button>
    `;
    container.appendChild(div);
  });
};

const handleProcessMutation = (e) => {
  e.preventDefault();
  const dest = document.getElementById("mutation-destination").value;
  const notes = document.getElementById("mutation-notes").value.trim();

  const validItems = mutationCart.filter(i => i.code !== "");
  if (validItems.length === 0) {
    showToast("Pilih setidaknya 1 obat yang valid untuk dipindahkan!", "warning");
    return;
  }

  if (!dest) {
    showToast("Pilih unit penerima tujuan secara valid!", "warning");
    return;
  }

  // Validate all items first
  for (const item of validItems) {
    const qty = parseInt(item.qty) || 0;
    if (qty <= 0) {
      const med = state.medicines.find(m => m.code === item.code);
      showToast(`Jumlah distribusi untuk ${med ? med.name : "obat"} harus lebih dari 0!`, "warning");
      return;
    }
    const med = state.medicines.find(m => m.code === item.code);
    if (!med || med.stock < qty) {
      showToast(`Stok ${med ? med.name : "obat"} tidak mencukupi atau telah berubah!`, "error");
      return;
    }
  }

  const curUser = JSON.parse(sessionStorage.getItem("puskespharma_user")) || { name: "Apoteker" };
  const nowStr = new Date().toISOString();
  const todayDateStr = nowStr.split("T")[0];

  // Process all items
  validItems.forEach(item => {
    const med = state.medicines.find(m => m.code === item.code);
    const qty = parseInt(item.qty) || 0;
    if (med) {
      med.stock -= qty;

      if (!state.subUnitStocks[dest]) state.subUnitStocks[dest] = {};
      if (!state.subUnitStocks[dest][item.code]) state.subUnitStocks[dest][item.code] = 0;
      state.subUnitStocks[dest][item.code] += qty;

      state.mutations.push({
        date: nowStr,
        code: item.code,
        name: med.name,
        batch: med.batch,
        destination: dest,
        qty: qty,
        cashier: curUser.name,
        notes: notes
      });

      state.stockMovements.push({
        date: todayDateStr,
        medicineName: med.name,
        batch: med.batch,
        origin: dest,
        type: "amprahan",
        direction: "keluar",
        qty: qty,
        expiry: med.expiry,
        refId: "mutation-" + Date.now() + "-" + Math.random().toString(36).substring(2, 5)
      });
    }
  });

  saveToLocalStorage();
  showToast(`Sukses mendistribusikan ${validItems.length} jenis obat ke ${dest}!`, "success");
  
  loadMutationFormData();
};

const renderSubUnitStocks = () => {
  const selector = document.getElementById("sub-unit-selector");
  const tbody = document.getElementById("sub-unit-stock-tbody");
  if (!selector || !tbody) return;

  tbody.innerHTML = "";
  const dest = selector.value;

  const items = state.subUnitStocks[dest] || {};
  const codes = Object.keys(items);

  if (codes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align: center;" class="text-muted">Belum ada alokasi stok untuk poli ini.</td></tr>`;
    return;
  }

  codes.forEach(code => {
    const qty = items[code];
    if (qty > 0) {
      const med = state.medicines.find(m => m.code === code) || { name: "Nama Obat dihapus", unit: "unit" };
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${med.name}</strong></td>
        <td><strong>${qty}</strong></td>
        <td><span class="badge badge-neutral">${med.unit}</span></td>
      `;
      tbody.appendChild(tr);
    }
  });
};

const renderMutationHistory = () => {
  const tbody = document.getElementById("mutation-history-tbody");
  tbody.innerHTML = "";

  const list = [...state.mutations].reverse().slice(0, 10);
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center;" class="text-muted">Belum ada log riwayat mutasi.</td></tr>`;
    return;
  }

  list.forEach(m => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.date.replace('T', ' ').substring(0, 16)}</td>
      <td><strong>${m.name}</strong></td>
      <td><span class="badge badge-neutral">${m.batch}</span></td>
      <td>${m.destination}</td>
      <td><strong>${m.qty}</strong></td>
      <td>${m.cashier}</td>
      <td>${m.notes}</td>
    `;
    tbody.appendChild(tr);
  });
};

// --- LAPORAN LPLPO BULANAN ---
const renderLPLPO = () => {
  const year = document.getElementById("lplpo-year").value;
  const month = document.getElementById("lplpo-month").value;
  
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  document.getElementById("lplpo-period-badge").innerText = `Periode: ${monthNames[parseInt(month) - 1]} ${year}`;

  const tbody = document.getElementById("lplpo-table-tbody");
  tbody.innerHTML = "";

  const selYear = parseInt(year);
  const selMonth = parseInt(month);

  // 1. Calculate LPLPO metrics for all medicines
  const calculated = state.medicines.map(med => {
    let bpjsUsage = 0;
    let umumUsage = 0;
    let unitUsage = 0;
    let reception = 0;
    let sisaStok = med.stock;

    state.stockMovements.forEach(m => {
      if (m.medicineName === med.name) {
        const mDate = new Date(m.date + "T00:00:00");
        const mYear = mDate.getFullYear();
        const mMonth = mDate.getMonth() + 1;
        
        if (mYear === selYear && mMonth === selMonth) {
          const qty = parseInt(m.qty) || 0;
          if (m.type === "resep") {
            if (m.direction === "keluar") {
              if (m.origin.includes("BPJS")) bpjsUsage += qty;
              else umumUsage += qty;
            } else if (m.direction === "masuk") {
              if (m.origin.includes("BPJS")) bpjsUsage -= qty;
              else umumUsage -= qty;
            }
          } else if (m.type === "amprahan") {
            if (m.direction === "keluar") {
              unitUsage += qty;
            }
          } else if (m.type === "gudang") {
            if (m.direction === "masuk") {
              reception += qty;
            }
          } else if (m.type === "opname") {
            if (m.direction === "masuk") {
              reception += qty;
            } else if (m.direction === "keluar") {
              unitUsage += qty;
            }
          }
        }
        
        // Roll back if the movement is after the selected period
        if (mYear > selYear || (mYear === selYear && mMonth > selMonth)) {
          const qty = parseInt(m.qty) || 0;
          if (m.direction === "masuk") {
            sisaStok -= qty;
          } else if (m.direction === "keluar") {
            sisaStok += qty;
          }
        }
      }
    });

    const totalUsage = bpjsUsage + umumUsage + unitUsage;
    const finalStock = sisaStok;
    const initialStock = finalStock + totalUsage - reception;
    const totalInventory = initialStock + reception;
    const requestQty = Math.max(0, Math.ceil(totalUsage * 1.5 - finalStock));

    return {
      med,
      bpjsUsage,
      umumUsage,
      totalUsage,
      finalStock,
      initialStock,
      totalInventory,
      reception,
      requestQty
    };
  });

  // 2. Sort by finalStock (sisa stok) ascending - lowest stock on top
  calculated.sort((a, b) => {
    if (a.finalStock !== b.finalStock) {
      return a.finalStock - b.finalStock;
    }
    return a.med.name.localeCompare(b.med.name);
  });

  // 3. Render sorted rows
  calculated.forEach((item, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td style="text-align: left;"><strong>${item.med.name}</strong></td>
      <td><span class="badge badge-neutral">${item.med.unit}</span></td>
      <td><strong>${item.med.batch}</strong></td>
      <td><span class="badge badge-warning-light" style="font-size: 0.72rem;">${item.med.expiry}</span></td>
      <td>${item.initialStock}</td>
      <td>${item.reception}</td>
      <td><strong>${item.totalInventory}</strong></td>
      <td>${item.bpjsUsage}</td>
      <td>${item.umumUsage}</td>
      <td class="text-primary" style="font-weight: 700;">${item.totalUsage}</td>
      <td style="font-weight: 700;">${item.finalStock}</td>
      <td>
        <input type="number" class="form-control" style="padding: 4px 8px; font-size:0.75rem; text-align:center; max-width:80px; margin: 0 auto;" value="${item.requestQty}" min="0">
      </td>
      <td>
        <button class="btn btn-danger btn-sm btn-icon" style="padding: 4px 8px; font-size: 0.75rem; margin: 0 auto; display: flex; align-items: center; justify-content: center;" onclick="deleteMedicine('${item.med.code}')" title="Hapus Obat">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

const printLPLPOReport = () => {
  const year = document.getElementById("lplpo-year").value;
  const month = document.getElementById("lplpo-month").value;
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const periodText = `${monthNames[parseInt(month) - 1].toUpperCase()} ${year}`;

  let tableRows = "";
  const selYear = parseInt(year);
  const selMonth = parseInt(month);
  
  // 1. Calculate LPLPO metrics for all medicines
  const calculated = state.medicines.map(med => {
    let bpjsUsage = 0;
    let umumUsage = 0;
    let unitUsage = 0;
    let reception = 0;
    let sisaStok = med.stock;

    state.stockMovements.forEach(m => {
      if (m.medicineName === med.name) {
        const mDate = new Date(m.date + "T00:00:00");
        const mYear = mDate.getFullYear();
        const mMonth = mDate.getMonth() + 1;
        
        if (mYear === selYear && mMonth === selMonth) {
          const qty = parseInt(m.qty) || 0;
          if (m.type === "resep") {
            if (m.direction === "keluar") {
              if (m.origin.includes("BPJS")) bpjsUsage += qty;
              else umumUsage += qty;
            } else if (m.direction === "masuk") {
              if (m.origin.includes("BPJS")) bpjsUsage -= qty;
              else umumUsage -= qty;
            }
          } else if (m.type === "amprahan") {
            if (m.direction === "keluar") {
              unitUsage += qty;
            }
          } else if (m.type === "gudang") {
            if (m.direction === "masuk") {
              reception += qty;
            }
          } else if (m.type === "opname") {
            if (m.direction === "masuk") {
              reception += qty;
            } else if (m.direction === "keluar") {
              unitUsage += qty;
            }
          }
        }
        
        // Roll back if the movement is after the selected period
        if (mYear > selYear || (mYear === selYear && mMonth > selMonth)) {
          const qty = parseInt(m.qty) || 0;
          if (m.direction === "masuk") {
            sisaStok -= qty;
          } else if (m.direction === "keluar") {
            sisaStok += qty;
          }
        }
      }
    });

    const totalUsage = bpjsUsage + umumUsage + unitUsage;
    const finalStock = sisaStok;
    const initialStock = finalStock + totalUsage - reception;
    const totalInventory = initialStock + reception;
    const requestQty = Math.max(0, Math.ceil(totalUsage * 1.5 - finalStock));

    return {
      med,
      bpjsUsage,
      umumUsage,
      totalUsage,
      finalStock,
      initialStock,
      totalInventory,
      reception,
      requestQty
    };
  });

  // 2. Sort by finalStock (sisa stok) ascending - lowest stock on top
  calculated.sort((a, b) => {
    if (a.finalStock !== b.finalStock) {
      return a.finalStock - b.finalStock;
    }
    return a.med.name.localeCompare(b.med.name);
  });

  // 3. Render rows
  calculated.forEach((item, idx) => {
    tableRows += `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td>${item.med.name}</td>
        <td style="text-align: center;">${item.med.unit}</td>
        <td style="text-align: center; font-weight: bold;">${item.med.batch}</td>
        <td style="text-align: center;">${item.med.expiry}</td>
        <td style="text-align: center;">${item.initialStock}</td>
        <td style="text-align: center;">${item.reception}</td>
        <td style="text-align: center;">${item.totalInventory}</td>
        <td style="text-align: center;">${item.bpjsUsage}</td>
        <td style="text-align: center;">${item.umumUsage}</td>
        <td style="text-align: center; font-weight: bold;">${item.totalUsage}</td>
        <td style="text-align: center; font-weight: bold;">${item.finalStock}</td>
        <td style="text-align: center; font-weight: bold;">${item.requestQty}</td>
      </tr>
    `;
  });

  const printContainer = document.getElementById("print-invoice-a4-wrapper");
  const todayDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const html = `
    <div class="lplpo-print-container">
      <h2>LAPORAN PEMAKAIAN DAN LEMBAR PERMINTAAN OBAT (LPLPO)</h2>
      <h3>PUSKESMAS: ${state.settings.name.toUpperCase()} | PERIODE: ${periodText}</h3>
      
      <div style="font-size: 0.72rem; margin-bottom: 8px; display: flex; justify-content: space-between;">
        <span>Alamat: ${state.settings.address}</span>
        <span>Telpon: ${state.settings.phone}</span>
      </div>

      <table class="lplpo-print-table">
        <thead>
          <tr>
            <th rowspan="2">No</th>
            <th rowspan="2">Nama Obat / Alkes</th>
            <th rowspan="2">Satuan</th>
            <th rowspan="2">No. Batch</th>
            <th rowspan="2">Expired</th>
            <th rowspan="2">Stok Awal</th>
            <th rowspan="2">Penerimaan</th>
            <th rowspan="2">Persediaan</th>
            <th colspan="3">Pemakaian</th>
            <th rowspan="2">Sisa Stok</th>
            <th rowspan="2">Permintaan</th>
          </tr>
          <tr>
            <th>BPJS</th>
            <th>Umum</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <!-- Tanda Tangan PJ -->
      <div class="lplpo-signature-area">
        <div class="lplpo-signature-box">
          <div>Mengetahui,</div>
          <div style="font-weight: bold;">Kepala Puskesmas</div>
          <div class="lplpo-signature-space"></div>
          <div style="text-decoration: underline; font-weight: bold;">${state.settings.kepala}</div>
          <div>NIP. ${state.settings.kepalaNip}</div>
        </div>
        
        <div class="lplpo-signature-box">
          <div>Jakarta, ${todayDate}</div>
          <div style="font-weight: bold;">Apoteker Penanggung Jawab</div>
          <div class="lplpo-signature-space"></div>
          <div style="text-decoration: underline; font-weight: bold;">${state.settings.apoteker}</div>
          <div>SIPA. ${state.settings.apotekerSipa}</div>
        </div>
      </div>
    </div>
  `;

  printContainer.innerHTML = html;
  document.body.classList.add("printing-lplpo");
  window.print();
};



// --- SETTINGS CONFIGURATION ---
const saveSettings = (e) => {
  e.preventDefault();
  state.settings.name = document.getElementById("settings-pharmacy-name").value.trim();
  state.settings.address = document.getElementById("settings-pharmacy-address").value.trim();
  state.settings.phone = document.getElementById("settings-pharmacy-phone").value.trim();
  state.settings.kepala = document.getElementById("settings-pusk-kepala").value.trim();
  state.settings.kepalaNip = document.getElementById("settings-pusk-kepala-nip").value.trim();
  state.settings.apoteker = document.getElementById("settings-pusk-apoteker").value.trim();
  state.settings.apotekerSipa = document.getElementById("settings-pusk-apoteker-sipa").value.trim();
  state.settings.footer = document.getElementById("settings-pharmacy-footer").value;

  saveToLocalStorage();
  updatePharmacyNameDOM();
  showToast("Identitas Puskesmas sukses disimpan!", "success");
};

const saveAccountSettings = (e) => {
  e.preventDefault();
  const newUsername = document.getElementById("settings-admin-username").value.trim();
  const newPassword = document.getElementById("settings-admin-password").value;
  const confirmPassword = document.getElementById("settings-admin-confirm-password").value;

  if (!newUsername) {
    showToast("Username tidak boleh kosong.", "error");
    return;
  }

  if (newPassword !== confirmPassword) {
    showToast("Password baru dan konfirmasi password tidak cocok.", "error");
    return;
  }

  if (newPassword.length < 4) {
    showToast("Password minimal harus terdiri dari 4 karakter.", "error");
    return;
  }

  state.credentials.admin.username = newUsername;
  state.credentials.admin.password = newPassword;
  
  saveToLocalStorage();
  
  document.getElementById("settings-admin-password").value = "";
  document.getElementById("settings-admin-confirm-password").value = "";
  
  showToast("Kredensial akun administrator berhasil diperbarui!", "success");
};

const handleLogoUpload = (input) => {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      state.settings.logo = e.target.result;
      saveToLocalStorage();
      applyLogo(e.target.result);
      showToast("Logo puskesmas kustom berhasil diunggah!", "success");
    };
    reader.readAsDataURL(file);
  }
};

const applyLogo = (src) => {
  const preview = document.getElementById("settings-logo-preview");
  const placeholder = document.getElementById("settings-logo-placeholder");
  const loginLogo = document.getElementById("login-logo-img");
  const loginFallback = document.getElementById("login-logo-fallback");
  const sideLogo = document.getElementById("sidebar-logo-img");
  const sideFallback = document.getElementById("sidebar-logo-fallback");

  if (src) {
    preview.src = src; preview.style.display = "block";
    placeholder.style.display = "none";
    loginLogo.src = src; loginLogo.style.display = "block";
    loginFallback.style.display = "none";
    sideLogo.src = src; sideLogo.style.display = "block";
    sideFallback.style.display = "none";
  } else {
    preview.src = ""; preview.style.display = "none";
    placeholder.style.display = "block";
    loginLogo.src = ""; loginLogo.style.display = "none";
    loginFallback.style.display = "block";
    sideLogo.src = ""; sideLogo.style.display = "none";
    sideFallback.style.display = "block";
  }
};

const removeCustomLogo = () => {
  if (state.settings.logo && confirm("Hapus logo kustom Puskesmas?")) {
    state.settings.logo = null;
    saveToLocalStorage();
    applyLogo(null);
    showToast("Logo kustom dihapus.", "info");
  }
};

const toggleTheme = () => {
  const mode = document.getElementById("settings-darkmode-toggle").checked ? "dark" : "light";
  state.theme.mode = mode;
  document.body.setAttribute("data-theme", mode);
  saveToLocalStorage();
  showToast(`Mode visual ${mode === 'dark' ? 'Gelap' : 'Terang'} aktif!`, "info");
};

const switchAccent = (color) => {
  state.theme.accent = color;
  document.body.setAttribute("data-accent", color);
  
  document.querySelectorAll(".accent-bubble").forEach(b => b.classList.remove("active"));
  const bubble = document.getElementById(`accent-${color}`);
  if (bubble) bubble.classList.add("active");
  
  saveToLocalStorage();
  showToast(`Warna aksen ${color.toUpperCase()} aktif!`, "info");
};

// --- GLOBAL SEARCH ---
const handleGlobalSearch = (query) => {
  if (query.trim() === "") return;
  const activeTab = document.querySelector(".sidebar-menu .active").id.replace("nav-", "");
  
  if (activeTab === "pos") {
    document.getElementById("pos-search").value = query;
    renderPosProducts();
  } else if (activeTab === "inventory") {
    document.getElementById("inventory-search").value = query;
    renderInventory();
  }
};

// --- HELPER UTILITIES ---
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

const showToast = (message, type = "info") => {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let icon = "";
  if (type === "success") icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-success"><polyline points="20 6 9 17 4 12"/></svg>`;
  else if (type === "warning") icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-warning"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  else if (type === "error") icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-danger"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  else icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-info"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

  toast.innerHTML = `${icon}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    toast.addEventListener("animationend", () => toast.remove());
  }, 4000);
};

const openModal = (id) => {
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
};

const closeModal = (id) => {
  const el = document.getElementById(id);
  if (el) el.classList.remove("active");
};

// Handle clicks outside modal content to close it
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-backdrop")) {
    e.target.classList.remove("active");
  }
});

// Run Init when loaded
window.addEventListener("DOMContentLoaded", initApp);
