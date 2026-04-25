export type Niche =
  | "Fashion"
  | "F&B"
  | "Beauty"
  | "Tech"
  | "Lifestyle"
  | "Gaming"
  | "Edukasi"
  | "Travel";

export type City = "Jakarta" | "Bandung" | "Surabaya" | "Yogyakarta" | "Lainnya";

export type PayoutMethod = "BCA" | "Mandiri" | "GoPay" | "DANA" | "OVO" | "QRIS";

export type ApplicationStatus =
  | "Menunggu review"
  | "Shortlisted"
  | "Dipilih!"
  | "Tidak dipilih";

export type ContentStatus =
  | "Belum upload"
  | "Dikirim"
  | "Review brand"
  | "Revisi diminta"
  | "Disetujui";

export type EscrowStatus =
  | "Dana masuk escrow"
  | "Konten disetujui"
  | "Dicairkan";

// ─── Brands ────────────────────────────────────────────────────────────────

export interface Brand {
  id: string;
  name: string;
  logo: string; // emoji placeholder
  category: string;
  city: City;
  verified: boolean;
  brief_count: number;
}

export const brands: Brand[] = [
  {
    id: "brand-1",
    name: "Kopi Nusantara",
    logo: "☕",
    category: "F&B",
    city: "Jakarta",
    verified: true,
    brief_count: 4,
  },
  {
    id: "brand-2",
    name: "Glow.id",
    logo: "✨",
    category: "Beauty",
    city: "Jakarta",
    verified: true,
    brief_count: 6,
  },
  {
    id: "brand-3",
    name: "Tanah Tekstil",
    logo: "🧵",
    category: "Fashion",
    city: "Bandung",
    verified: false,
    brief_count: 3,
  },
  {
    id: "brand-4",
    name: "Cerdas.io",
    logo: "🤖",
    category: "Tech",
    city: "Jakarta",
    verified: true,
    brief_count: 2,
  },
  {
    id: "brand-5",
    name: "Keripik Mamah",
    logo: "🥨",
    category: "F&B",
    city: "Bandung",
    verified: false,
    brief_count: 2,
  },
];

// ─── Briefs ─────────────────────────────────────────────────────────────────

export interface Brief {
  id: string;
  brand_id: string;
  title: string;
  category: Niche;
  description: string;
  hook_style: string;
  tone: string;
  must_mention: string[];
  must_avoid: string[];
  deliverables: string;
  usage_rights: string;
  payment_terms: string;
  budget_min: number;
  budget_max: number;
  slots_total: number;
  slots_remaining: number;
  deadline: string; // ISO date
  has_reference_video: boolean;
  created_at: string;
}

export const briefs: Brief[] = [
  {
    id: "brief-1",
    brand_id: "brand-1",
    title: "Tunjukin ritual kopi pagi kamu bareng Kopi Nusantara",
    category: "F&B",
    description:
      "Kami cari kreator yang bikin konten autentik tentang bagaimana kopi jadi bagian dari pagi kamu. Nggak perlu studio—kamar, dapur, atau balkon kamu udah cukup. Yang penting vibes-nya real.",
    hook_style: "POV atau transisi 'before coffee vs after coffee'",
    tone: "Santai, personal, relatable. Kayak cerita ke temen.",
    must_mention: [
      "Kopi Nusantara single origin Flores",
      "Harga mulai Rp 35.000 per cup",
      "Bisa dipesan via GoFood & GrabFood",
    ],
    must_avoid: ["Jangan sebut kompetitor", "Hindari klaim kesehatan berlebihan"],
    deliverables: "2 video TikTok vertikal, durasi 15–30 detik, format 9:16",
    usage_rights: "Brand boleh repost di IG & TikTok brand selama 30 hari",
    payment_terms: "Dibayar dalam 48 jam setelah konten di-approve",
    budget_min: 500000,
    budget_max: 1500000,
    slots_total: 8,
    slots_remaining: 5,
    deadline: "2026-05-10",
    has_reference_video: true,
    created_at: "2026-04-20",
  },
  {
    id: "brief-2",
    brand_id: "brand-2",
    title: "Review jujur skincare routine 7 hari pakai Glow Serum",
    category: "Beauty",
    description:
      "Kami nggak minta kamu pura-pura kulitnya berubah dalam semalam. Kami mau review yang jujur—bahkan kalau hasilnya belum kelihatan di hari ke-7, itu oke. Authentic > perfect.",
    hook_style: "Day 1 vs Day 7 time-lapse atau voice-over diary",
    tone: "Jujur, informatif, tapi tetap fun. Gen Z beauty vlog energy.",
    must_mention: [
      "Glow Brightening Serum 30ml",
      "Kandungan: Niacinamide 5% + Vitamin C",
      "Link di bio untuk order",
    ],
    must_avoid: [
      "Jangan bilang 'kulit langsung cerah' tanpa disclaimer",
      "Jangan bandingkan dengan brand lain secara eksplisit",
    ],
    deliverables: "1 video TikTok (30–60 detik) + 1 IG Reels versi pendek (15 detik)",
    usage_rights: "Brand boleh gunakan untuk iklan berbayar selama 60 hari",
    payment_terms: "50% setelah konten di-submit, 50% setelah performa 7 hari",
    budget_min: 800000,
    budget_max: 2000000,
    slots_total: 5,
    slots_remaining: 2,
    deadline: "2026-05-15",
    has_reference_video: true,
    created_at: "2026-04-18",
  },
  {
    id: "brief-3",
    brand_id: "brand-3",
    title: "GRWM (Get Ready With Me) outfit batik modern Tanah Tekstil",
    category: "Fashion",
    description:
      "Mau nunjukin ke Gen Z kalau batik itu bisa keren dan wearable sehari-hari, bukan cuma buat kondangan. Kamu yang pilih gaya, kami yang supply bahannya.",
    hook_style: "GRWM format, transisi outfit reveal di akhir",
    tone: "Stylish, confident, Indonesia proud tapi nggak kaku.",
    must_mention: [
      "Tanah Tekstil batik kontemporer",
      "Tersedia di toko Bandung & online",
      "Motif eksklusif per musim",
    ],
    must_avoid: ["Jangan mix dengan brand fashion lain di video yang sama"],
    deliverables: "1 video TikTok 30–60 detik + 3 foto statis untuk feed IG",
    usage_rights: "Brand boleh repost konten di semua platform selama 90 hari",
    payment_terms: "Full payment dalam 24 jam setelah konten di-approve",
    budget_min: 600000,
    budget_max: 1800000,
    slots_total: 6,
    slots_remaining: 6,
    deadline: "2026-05-20",
    has_reference_video: false,
    created_at: "2026-04-21",
  },
  {
    id: "brief-4",
    brand_id: "brand-4",
    title: "Tutorial pakai Cerdas.io buat mahasiswa yang kerja sambil kuliah",
    category: "Tech",
    description:
      "Cerdas.io adalah AI productivity tool lokal. Kami mau kreator yang genuinely ngerasain manfaatnya lalu ceritain dengan cara mereka sendiri—bukan script robotik.",
    hook_style: "Screen recording + talking head, atau day-in-the-life format",
    tone: "Helpful, smart tapi accessible. Kayak temen yang rekomendasiin sesuatu yang emang berguna.",
    must_mention: [
      "3 fitur utama: AI notulen, ringkasan jurnal, jadwal otomatis",
      "Gratis 30 hari trial",
      "Promo khusus mahasiswa 50% off",
    ],
    must_avoid: [
      "Jangan sebut ChatGPT atau Notion sebagai perbandingan",
      "Hindari claim 'terbaik' tanpa konteks",
    ],
    deliverables: "1 video TikTok 45–90 detik + caption tertulis untuk IG post",
    usage_rights: "Brand boleh gunakan sebagai testimonial di website",
    payment_terms: "Dibayar penuh dalam 3 hari kerja setelah approval",
    budget_min: 1000000,
    budget_max: 3000000,
    slots_total: 4,
    slots_remaining: 3,
    deadline: "2026-05-05",
    has_reference_video: false,
    created_at: "2026-04-19",
  },
  {
    id: "brief-5",
    brand_id: "brand-5",
    title: "Unboxing + taste test keripik pedas level 10 Mamah",
    category: "F&B",
    description:
      "Konten makan pedas selalu viral. Kami mau kreator yang genuinely suka tantangan pedas, bukan yang acting. Kalau nggak kuat, bisa banget ceritain itu—itu juga konten yang bagus.",
    hook_style: "Reaction / taste test spontan, nggak perlu diedit terlalu rapi",
    tone: "Entertaining, unfiltered, boleh dramatis asal genuine.",
    must_mention: [
      "Keripik Mamah Pedas Level 10",
      "UMKM Bandung, produksi rumahan",
      "Tersedia di Shopee & Tokopedia",
    ],
    must_avoid: ["Jangan buang produk di depan kamera"],
    deliverables: "1 video TikTok 15–30 detik, boleh ada part 2 jika mau",
    usage_rights: "Brand boleh repost tanpa batas waktu",
    payment_terms: "Transfer via GoPay/DANA dalam 24 jam setelah tayang",
    budget_min: 300000,
    budget_max: 750000,
    slots_total: 10,
    slots_remaining: 7,
    deadline: "2026-05-08",
    has_reference_video: true,
    created_at: "2026-04-22",
  },
  {
    id: "brief-6",
    brand_id: "brand-1",
    title: "Cold brew challenge: buat sendiri vs beli di Kopi Nusantara",
    category: "F&B",
    description:
      "Format versus yang fun. Kamu coba bikin cold brew sendiri di rumah, terus compare hasilnya sama yang dari kami. Spoiler: punya kami mungkin menang, tapi perjalanannya yang bikin konten bagus.",
    hook_style: "Split screen atau cut-cut perbandingan",
    tone: "Ringan, playful, nggak terlalu serius.",
    must_mention: ["Cold brew Kopi Nusantara Rp 28.000", "Tersedia pick-up di 12 titik Jakarta"],
    must_avoid: ["Jangan jelek-jelekin versi homemade terlalu keras"],
    deliverables: "1 video TikTok 30–45 detik",
    usage_rights: "Brand boleh repost selama 30 hari",
    payment_terms: "Dibayar dalam 48 jam setelah approve",
    budget_min: 400000,
    budget_max: 1000000,
    slots_total: 6,
    slots_remaining: 4,
    deadline: "2026-05-12",
    has_reference_video: true,
    created_at: "2026-04-21",
  },
  {
    id: "brief-7",
    brand_id: "brand-2",
    title: "Morning skincare routine 5 menit buat yang super sibuk",
    category: "Beauty",
    description:
      "Target audience kami kerja atau kuliah dari pagi. Skincare routine yang cepet dan efektif adalah mimpi mereka. Kamu yang tunjukin itu bisa terwujud.",
    hook_style: "Time-lapse dengan voice over atau text overlay",
    tone: "Informatif tapi fast-paced. Energi pagi.",
    must_mention: [
      "Glow Daily Moisturizer SPF 30",
      "5 langkah, 5 menit",
      "Cocok untuk semua jenis kulit",
    ],
    must_avoid: ["Jangan menyarankan skip sunscreen"],
    deliverables: "1 TikTok 30 detik + 1 IG Story sequence (3 slides)",
    usage_rights: "Brand boleh gunakan untuk iklan berbayar 30 hari",
    payment_terms: "Full payment 48 jam setelah approve",
    budget_min: 750000,
    budget_max: 1500000,
    slots_total: 5,
    slots_remaining: 3,
    deadline: "2026-05-18",
    has_reference_video: false,
    created_at: "2026-04-20",
  },
  {
    id: "brief-8",
    brand_id: "brand-3",
    title: "Thrift flip: ubah kain batik sisa jadi outfit kekinian",
    category: "Fashion",
    description:
      "Sustainability meets local craft. Kamu bikin outfit dari kain batik sisa (kami kirim materialnya), dokumentasikan prosesnya. Perfect buat kreator yang suka DIY dan fashion.",
    hook_style: "Before/after reveal dengan proses di tengah",
    tone: "Creative, inspiring, dengan sentuhan craft aesthetic.",
    must_mention: [
      "Kain batik dari Tanah Tekstil",
      "Zero waste production",
      "Beli kain di website kami",
    ],
    must_avoid: ["Jangan pakai bahan brand lain"],
    deliverables: "1 TikTok 45–60 detik + 5 foto proses untuk IG carousel",
    usage_rights: "Brand boleh repost semua konten tanpa batas",
    payment_terms: "Dibayar setelah approve, 3 hari kerja",
    budget_min: 500000,
    budget_max: 1200000,
    slots_total: 4,
    slots_remaining: 2,
    deadline: "2026-05-25",
    has_reference_video: false,
    created_at: "2026-04-22",
  },
  {
    id: "brief-9",
    brand_id: "brand-4",
    title: "Day in the life: mahasiswa yang manage 3 deadline sekaligus",
    category: "Edukasi",
    description:
      "Konten relatable banget buat mahasiswa tingkat akhir atau yang kerja sambil kuliah. Tunjukin bagaimana kamu survive—dan Cerdas.io jadi salah satu tool-nya.",
    hook_style: "Vlog gaya hari-hari, narasi natural",
    tone: "Relatable, jujur, sedikit dramatis (tapi beneran).",
    must_mention: ["Cerdas.io AI scheduler", "Fitur prioritas otomatis"],
    must_avoid: ["Jangan terkesan produktivitas itu mudah dan sempurna"],
    deliverables: "1 TikTok 60–90 detik",
    usage_rights: "Brand boleh gunakan sebagai testimonial",
    payment_terms: "Dibayar dalam 3 hari kerja",
    budget_min: 800000,
    budget_max: 2000000,
    slots_total: 5,
    slots_remaining: 4,
    deadline: "2026-05-07",
    has_reference_video: false,
    created_at: "2026-04-17",
  },
  {
    id: "brief-10",
    brand_id: "brand-5",
    title: "Mukbang keripik Mamah sambil nonton rekomendasi series",
    category: "Lifestyle",
    description:
      "Format mukbang + rekomendasi konten. Kamu makan keripik kami sambil kasih rekomendasi series/film/anime yang lagi kamu tonton. Dua konten dalam satu.",
    hook_style: "Casual talking head, one take energy",
    tone: "Santai, seperti ngobrol sama temen",
    must_mention: [
      "Keripik Mamah original & pedas level 5",
      "UMKM asli Bandung",
      "Harga mulai Rp 15.000",
    ],
    must_avoid: ["Jangan terlalu rapi/edited—biarkan natural"],
    deliverables: "1 TikTok 30–60 detik",
    usage_rights: "Brand boleh repost tanpa batas",
    payment_terms: "GoPay/DANA 24 jam setelah tayang",
    budget_min: 250000,
    budget_max: 600000,
    slots_total: 12,
    slots_remaining: 9,
    deadline: "2026-05-01",
    has_reference_video: false,
    created_at: "2026-04-23",
  },
  {
    id: "brief-11",
    brand_id: "brand-2",
    title: "Duet skincare: kamu dan sahabat kamu, dua jenis kulit beda hasilnya sama",
    category: "Beauty",
    description:
      "Konten berdua selalu perform lebih baik. Cari temen dengan jenis kulit berbeda (misal: berminyak vs kombinasi) dan tes produk kami bareng.",
    hook_style: "Duet format atau split screen, humor diperbolehkan",
    tone: "Fun, friendly, chemistry yang genuine.",
    must_mention: [
      "Glow Cleanser Gentle Formula",
      "Cocok untuk kulit sensitif dan berminyak",
      "Dermatologically tested",
    ],
    must_avoid: ["Jangan buat klaim medis"],
    deliverables: "1 TikTok 30–45 detik",
    usage_rights: "Brand boleh repost 30 hari",
    payment_terms: "Dibayar full 48 jam setelah approve",
    budget_min: 600000,
    budget_max: 1500000,
    slots_total: 4,
    slots_remaining: 4,
    deadline: "2026-05-22",
    has_reference_video: true,
    created_at: "2026-04-19",
  },
  {
    id: "brief-12",
    brand_id: "brand-3",
    title: "Styling challenge: 1 kemeja batik, 5 cara pakai berbeda",
    category: "Fashion",
    description:
      "Versatility content yang bagus banget untuk algoritma. Kamu dapat 1 kemeja batik dari kami, styling 5 cara berbeda dalam satu video.",
    hook_style: "Fast-cut styling, setiap look 3–4 detik",
    tone: "Energik, stylish, inspiring",
    must_mention: [
      "Tanah Tekstil kemeja batik unisex",
      "Ukuran XS–4XL",
      "Harga Rp 175.000",
    ],
    must_avoid: ["Jangan pakai aksesori brand fashion lain secara mencolok"],
    deliverables: "1 TikTok 30 detik + foto flat lay untuk IG",
    usage_rights: "Brand boleh gunakan tanpa batas",
    payment_terms: "Full payment 24 jam setelah approve",
    budget_min: 400000,
    budget_max: 900000,
    slots_total: 8,
    slots_remaining: 5,
    deadline: "2026-05-30",
    has_reference_video: true,
    created_at: "2026-04-20",
  },
  {
    id: "brief-13",
    brand_id: "brand-4",
    title: "Review app lokal vs app luar: siapa yang menang buat produktivitas?",
    category: "Tech",
    description:
      "Head-to-head yang jujur. Kami nggak minta kamu bilang kami menang di semua kategori—cukup fair dan highlight di mana Cerdas.io unggul buat pengguna Indonesia.",
    hook_style: "Perbandingan langsung, demo screen recording",
    tone: "Analitis, objektif, tapi tetap engaging",
    must_mention: [
      "Bahasa Indonesia interface",
      "Server lokal = data aman di Indonesia",
      "Harga dalam IDR, bayar via GoPay",
    ],
    must_avoid: ["Jangan menyebut nama app lain secara negatif"],
    deliverables: "1 TikTok 45–60 detik",
    usage_rights: "Brand boleh gunakan sebagai ad creative 60 hari",
    payment_terms: "Dibayar dalam 3 hari kerja setelah approve",
    budget_min: 1200000,
    budget_max: 3000000,
    slots_total: 3,
    slots_remaining: 2,
    deadline: "2026-05-09",
    has_reference_video: false,
    created_at: "2026-04-18",
  },
  {
    id: "brief-14",
    brand_id: "brand-1",
    title: "Ceritain tempat kerja atau study spot favorit kamu sambil nyeruput kopi",
    category: "Lifestyle",
    description:
      "City guide meets coffee content. Kamu tunjukin study spot atau work spot favorit kamu di Jakarta/Bandung sambil bawa kopi Nusantara. Konten lokal yang relatable.",
    hook_style: "Walking tour ringan atau montage tempat + narasi",
    tone: "Chill, aspirasional tapi bukan flexing",
    must_mention: ["Kopi Nusantara to-go cup", "Available di GoFood"],
    must_avoid: ["Jangan tunjukin tempat yang terlalu eksklusif/mahal"],
    deliverables: "1 TikTok 30–45 detik + 1 IG Story behind the scenes",
    usage_rights: "Brand boleh repost 30 hari",
    payment_terms: "Dibayar 48 jam setelah approve",
    budget_min: 450000,
    budget_max: 1100000,
    slots_total: 6,
    slots_remaining: 3,
    deadline: "2026-05-13",
    has_reference_video: false,
    created_at: "2026-04-21",
  },
  {
    id: "brief-15",
    brand_id: "brand-5",
    title: "Hadiah keripik Mamah ke temen yang lagi stress deadline",
    category: "Lifestyle",
    description:
      "Konten gifting yang heartfelt. Kamu kasih keripik ke temen yang lagi struggling dengan deadline/ujian dan dokumentasikan reaksinya. Harus genuine—nggak usah script.",
    hook_style: "Candid reaction, suprise element",
    tone: "Warm, caring, tetap fun",
    must_mention: [
      "Keripik Mamah sebagai 'stress snack'",
      "Bisa kirim sebagai hadiah via Shopee",
    ],
    must_avoid: ["Jangan buat terlalu staged/acting"],
    deliverables: "1 TikTok 20–40 detik",
    usage_rights: "Brand boleh repost tanpa batas",
    payment_terms: "GoPay/DANA 24 jam setelah tayang",
    budget_min: 200000,
    budget_max: 500000,
    slots_total: 15,
    slots_remaining: 11,
    deadline: "2026-04-30",
    has_reference_video: false,
    created_at: "2026-04-23",
  },
];

// ─── Creators ───────────────────────────────────────────────────────────────

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  city: City;
  niches: Niche[];
  ig_handle: string;
  tiktok_handle: string;
  payout_method: PayoutMethod;
  payout_account: string;
  payout_account_last4: string;
  bio: string;
  gigs_completed: number;
  avg_rating: number;
  total_earned: number;
  tier: "Pemula" | "Rising" | "Pro";
  phone: string;
}

export const creators: Creator[] = [
  {
    id: "creator-1",
    name: "Nadia Kusuma",
    avatar: "🌸",
    city: "Jakarta",
    niches: ["Beauty", "Lifestyle"],
    ig_handle: "@nadiakusuma",
    tiktok_handle: "@nadiakus",
    payout_method: "BCA",
    payout_account: "BCA ****4521",
    payout_account_last4: "4521",
    bio: "Beauty enthusiast dari Jakarta Selatan. Suka skincare jujur, nggak suka drama. TikTok 45k followers.",
    gigs_completed: 12,
    avg_rating: 4.8,
    total_earned: 14500000,
    tier: "Rising",
    phone: "+62 812-3421-7890",
  },
  {
    id: "creator-2",
    name: "Rizky Pratama",
    avatar: "🎮",
    city: "Bandung",
    niches: ["Gaming", "Tech"],
    ig_handle: "@rizkypratama",
    tiktok_handle: "@rizkygamer",
    payout_method: "GoPay",
    payout_account: "GoPay ****2234",
    payout_account_last4: "2234",
    bio: "Full-time content creator, part-time gamer. Bandung represent 🏔️",
    gigs_completed: 8,
    avg_rating: 4.6,
    total_earned: 9200000,
    tier: "Rising",
    phone: "+62 857-2234-5566",
  },
  {
    id: "creator-3",
    name: "Sari Dewi",
    avatar: "🌿",
    city: "Surabaya",
    niches: ["F&B", "Lifestyle"],
    ig_handle: "@saridewi",
    tiktok_handle: "@sarifoodie",
    payout_method: "DANA",
    payout_account: "DANA ****8899",
    payout_account_last4: "8899",
    bio: "Food lover & home cook dari Surabaya. Konten autentik, selalu honest.",
    gigs_completed: 24,
    avg_rating: 4.9,
    total_earned: 31000000,
    tier: "Pro",
    phone: "+62 821-8899-0011",
  },
  {
    id: "creator-4",
    name: "Aldo Wijaya",
    avatar: "📸",
    city: "Jakarta",
    niches: ["Fashion", "Lifestyle"],
    ig_handle: "@aldowijaya",
    tiktok_handle: "@aldo.style",
    payout_method: "OVO",
    payout_account: "OVO ****3344",
    payout_account_last4: "3344",
    bio: "Street style & sustainable fashion. Jakarta-based, Bandung at heart.",
    gigs_completed: 5,
    avg_rating: 4.5,
    total_earned: 4800000,
    tier: "Pemula",
    phone: "+62 878-3344-5566",
  },
  {
    id: "creator-5",
    name: "Tasha Amelia",
    avatar: "🎵",
    city: "Yogyakarta",
    niches: ["Lifestyle", "Travel"],
    ig_handle: "@tashaamelia",
    tiktok_handle: "@tashajogja",
    payout_method: "BCA",
    payout_account: "BCA ****7788",
    payout_account_last4: "7788",
    bio: "Travel vlogger yang juga suka konten daily life. Jogja is home 🏯",
    gigs_completed: 31,
    avg_rating: 4.9,
    total_earned: 42000000,
    tier: "Pro",
    phone: "+62 812-7788-9900",
  },
  {
    id: "creator-6",
    name: "Bimo Saputra",
    avatar: "☕",
    city: "Bandung",
    niches: ["F&B", "Lifestyle"],
    ig_handle: "@bimosaputra",
    tiktok_handle: "@bimocafe",
    payout_method: "GoPay",
    payout_account: "GoPay ****1122",
    payout_account_last4: "1122",
    bio: "Coffee nerd + food reviewer. Kalau ada kopi enak di Bandung, pasti aku udah coba.",
    gigs_completed: 3,
    avg_rating: 4.3,
    total_earned: 2100000,
    tier: "Pemula",
    phone: "+62 857-1122-3344",
  },
  {
    id: "creator-7",
    name: "Mega Rahayu",
    avatar: "💄",
    city: "Jakarta",
    niches: ["Beauty", "Fashion"],
    ig_handle: "@megarahayu",
    tiktok_handle: "@megabeauty",
    payout_method: "QRIS",
    payout_account: "QRIS ****5566",
    payout_account_last4: "5566",
    bio: "Makeup artist + content creator. Before/after is my love language.",
    gigs_completed: 18,
    avg_rating: 4.7,
    total_earned: 21500000,
    tier: "Pro",
    phone: "+62 812-5566-7788",
  },
  {
    id: "creator-8",
    name: "Dika Santoso",
    avatar: "🏋️",
    city: "Surabaya",
    niches: ["Lifestyle", "Edukasi"],
    ig_handle: "@dikasantoso",
    tiktok_handle: "@dikafit",
    payout_method: "BCA",
    payout_account: "BCA ****9900",
    payout_account_last4: "9900",
    bio: "Personal trainer yang juga content creator. Edukasi fitness yang fun.",
    gigs_completed: 7,
    avg_rating: 4.4,
    total_earned: 6700000,
    tier: "Rising",
    phone: "+62 821-9900-1122",
  },
  {
    id: "creator-9",
    name: "Indah Pertiwi",
    avatar: "🌺",
    city: "Bandung",
    niches: ["Fashion", "Travel"],
    ig_handle: "@indahpertiwi",
    tiktok_handle: "@indah.ootd",
    payout_method: "DANA",
    payout_account: "DANA ****2345",
    payout_account_last4: "2345",
    bio: "OOTD everyday. Bandung girl yang suka eksplorasi tempat baru.",
    gigs_completed: 14,
    avg_rating: 4.6,
    total_earned: 16800000,
    tier: "Rising",
    phone: "+62 822-2345-6789",
  },
  {
    id: "creator-10",
    name: "Yusuf Hakim",
    avatar: "🎬",
    city: "Jakarta",
    niches: ["Tech", "Edukasi"],
    ig_handle: "@yusufhakim",
    tiktok_handle: "@yusuftech",
    payout_method: "BCA",
    payout_account: "BCA ****6677",
    payout_account_last4: "6677",
    bio: "Tech explainer & productivity geek. Bikin konten tech yang nggak bikin ngantuk.",
    gigs_completed: 9,
    avg_rating: 4.5,
    total_earned: 11200000,
    tier: "Rising",
    phone: "+62 812-6677-8899",
  },
];

// ─── Current Demo User (Nadia) ───────────────────────────────────────────────

export const DEMO_USERS = creators;
export const DEFAULT_DEMO_USER_ID = "creator-1";

// ─── Applications ────────────────────────────────────────────────────────────

export interface Application {
  id: string;
  creator_id: string;
  brief_id: string;
  pitch: string;
  portfolio_link?: string;
  status: ApplicationStatus;
  applied_at: string;
  updated_at: string;
  job_id?: string;
}

export const initialApplications: Application[] = [
  {
    id: "app-1",
    creator_id: "creator-1",
    brief_id: "brief-2",
    pitch:
      "Kulit aku kombinasi—berminyak di T-zone, kering di pipi. Perfect buat nunjukin gimana serum kamu perform di kondisi berbeda. Aku juga udah punya audience yang specifically tanya soal skincare buat kulit kombinasi.",
    portfolio_link: "https://tiktok.com/@nadiakus",
    status: "Dipilih!",
    applied_at: "2026-04-15",
    updated_at: "2026-04-18",
    job_id: "job-1",
  },
  {
    id: "app-2",
    creator_id: "creator-1",
    brief_id: "brief-1",
    pitch:
      "Ritual kopi pagi aku udah jadi part of my content DNA. Aku punya seri '#KopiPagi' yang selalu perform bagus—rata-rata 80k views per video. Audience aku 70% perempuan 20–28 tahun, Jakarta.",
    status: "Shortlisted",
    applied_at: "2026-04-20",
    updated_at: "2026-04-22",
  },
  {
    id: "app-3",
    creator_id: "creator-1",
    brief_id: "brief-5",
    pitch:
      "Challenge makanan pedas? Sign me up. Aku punya track record konten makan pedas yang selalu viral di akun aku. Last one dapet 200k views organik.",
    status: "Menunggu review",
    applied_at: "2026-04-23",
    updated_at: "2026-04-23",
  },
  // ─── Extra applicants for brand demo (brief-2: Glow.id skincare review) ───
  {
    id: "app-4",
    creator_id: "creator-7",
    brief_id: "brief-2",
    pitch:
      "Aku makeup artist dan skincare enthusiast dengan 60k followers di TikTok. Kulit aku berminyak jadi bisa tunjukin hasil yang visible. Aku juga punya template review yang udah terbukti dapetin engagement tinggi.",
    portfolio_link: "https://tiktok.com/@megabeauty",
    status: "Shortlisted",
    applied_at: "2026-04-16",
    updated_at: "2026-04-19",
  },
  {
    id: "app-5",
    creator_id: "creator-9",
    brief_id: "brief-2",
    pitch:
      "Aku punya kulit sensitif dan udah struggle cari skincare yang cocok selama bertahun-tahun. Review aku selalu jujur dan audience aku appreciate itu — rata-rata comment rate 8%.",
    portfolio_link: "https://tiktok.com/@indah.ootd",
    status: "Menunggu review",
    applied_at: "2026-04-17",
    updated_at: "2026-04-17",
  },
  {
    id: "app-6",
    creator_id: "creator-4",
    brief_id: "brief-2",
    pitch:
      "Biasanya aku bikin konten fashion, tapi aku juga rutin bikin skincare routine content yang perform bagus. Perspective cowok dalam skincare tuh unik dan banyak yang request.",
    status: "Tidak dipilih",
    applied_at: "2026-04-14",
    updated_at: "2026-04-20",
  },
  // ─── Applicants for brief-7 (Glow.id morning routine) ─────────────────────
  {
    id: "app-7",
    creator_id: "creator-1",
    brief_id: "brief-7",
    pitch:
      "Morning routine adalah konten favorit audience aku. Video morning routine aku bulan lalu dapet 120k views organik. Aku bisa highlight aspek time-efficiency yang relevan banget buat para pekerja.",
    portfolio_link: "https://tiktok.com/@nadiakus",
    status: "Menunggu review",
    applied_at: "2026-04-21",
    updated_at: "2026-04-21",
  },
  {
    id: "app-8",
    creator_id: "creator-7",
    brief_id: "brief-7",
    pitch:
      "Sebagai makeup artist, aku sering ditanya cara simpel yang tetap efektif. Konten '5-menit skincare' adalah salah satu format yang paling banyak direquest oleh followers aku.",
    portfolio_link: "https://tiktok.com/@megabeauty",
    status: "Shortlisted",
    applied_at: "2026-04-20",
    updated_at: "2026-04-22",
  },
  // ─── Applicants for brief-11 (Glow.id duet skincare) ──────────────────────
  {
    id: "app-9",
    creator_id: "creator-9",
    brief_id: "brief-11",
    pitch:
      "Aku dan sahabat aku punya jenis kulit yang sangat berbeda — aku sensitif, dia kombinasi. Kita bisa bikin format duet yang natural karena chemistry kita emang udah keliatan di konten kita.",
    status: "Menunggu review",
    applied_at: "2026-04-22",
    updated_at: "2026-04-22",
  },
];

// ─── Jobs ────────────────────────────────────────────────────────────────────

export interface Job {
  id: string;
  application_id: string;
  brief_id: string;
  creator_id: string;
  brand_id: string;
  content_status: ContentStatus;
  escrow_status: EscrowStatus;
  amount_gross: number;
  platform_fee: number;
  amount_net: number;
  started_at: string;
  deadline: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sender: "creator" | "brand";
  sender_name: string;
  text: string;
  sent_at: string;
}

export const initialJobs: Job[] = [
  {
    id: "job-1",
    application_id: "app-1",
    brief_id: "brief-2",
    creator_id: "creator-1",
    brand_id: "brand-2",
    content_status: "Review brand",
    escrow_status: "Dana masuk escrow",
    amount_gross: 1200000,
    platform_fee: 120000,
    amount_net: 1080000,
    started_at: "2026-04-18",
    deadline: "2026-05-15",
    messages: [
      {
        id: "msg-1",
        sender: "brand",
        sender_name: "Glow.id",
        text: "Hai Nadia! Seneng banget kamu mau join campaign kami. Kalau ada pertanyaan soal brief, langsung tanya aja ya 😊",
        sent_at: "2026-04-18T10:00:00",
      },
      {
        id: "msg-2",
        sender: "creator",
        sender_name: "Nadia Kusuma",
        text: "Hii! Makasih sudah pilih aku. Mau tanya—untuk referensi video, apakah perlu pakai backdrop putih atau bisa natural setting aja?",
        sent_at: "2026-04-18T10:45:00",
      },
      {
        id: "msg-3",
        sender: "brand",
        sender_name: "Glow.id",
        text: "Natural setting oke banget! Kami justru lebih suka yang authentic, nggak perlu setup yang terlalu formal. Yang penting lighting cukup terang ya.",
        sent_at: "2026-04-18T11:20:00",
      },
      {
        id: "msg-4",
        sender: "creator",
        sender_name: "Nadia Kusuma",
        text: "Siap! Aku udah upload video hari ke-1 dan ke-7 nya. Semoga sesuai ekspektasi 🤞",
        sent_at: "2026-04-22T09:15:00",
      },
    ],
  },
];

// ─── Wallet Transactions ─────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  creator_id: string;
  job_id: string;
  brand_name: string;
  brief_title: string;
  amount: number;
  status: "Dalam escrow" | "Dibayarkan" | "Menunggu";
  created_at: string;
}

export const initialTransactions: Transaction[] = [
  {
    id: "txn-1",
    creator_id: "creator-1",
    job_id: "job-1",
    brand_name: "Glow.id",
    brief_title: "Review jujur skincare routine 7 hari",
    amount: 1080000,
    status: "Dalam escrow",
    created_at: "2026-04-18",
  },
  {
    id: "txn-2",
    creator_id: "creator-1",
    job_id: "job-past-1",
    brand_name: "Kopi Nusantara",
    brief_title: "Ritual kopi pagi – batch Maret",
    amount: 900000,
    status: "Dibayarkan",
    created_at: "2026-03-28",
  },
  {
    id: "txn-3",
    creator_id: "creator-1",
    job_id: "job-past-2",
    brand_name: "Tanah Tekstil",
    brief_title: "GRWM batik – koleksi Maret",
    amount: 1350000,
    status: "Dibayarkan",
    created_at: "2026-03-15",
  },
];
