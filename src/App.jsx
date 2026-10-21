import { useState, useEffect, useRef } from 'react';
import profilePhoto from './assets/ihsan-rahadi.jpeg';

const stockAssets = [
  { code: '12345', name: 'Laptop Lenovo IdeaPad Slim 3', status: 'Aktif' },
  { code: '67890', name: 'Printer Brother HL-L2360DN', status: 'Perlu pengecekan' },
  { code: '54321', name: 'Monitor Dell 24"', status: 'Aktif' },
];

const helpdeskTickets = [
  {
    title: 'Laptop tidak dapat terhubung ke Wi-Fi',
    description: 'Seorang pengguna melaporkan laptopnya tidak bisa mengakses jaringan kantor.',
    choices: [
      'Langsung instal ulang sistem operasi',
      'Periksa Wi-Fi dan mode pesawat, lalu uji koneksi ke jaringan',
      'Ganti laptop tanpa pemeriksaan',
    ],
    answer: 1,
    explanation: 'Mulai dari pemeriksaan dasar konektivitas dan konfigurasi sebelum melakukan tindakan yang lebih berisiko.',
  },
  {
    title: 'Printer tidak mencetak dokumen',
    description: 'Dokumen pengguna tertahan di antrean printer.',
    choices: [
      'Periksa koneksi printer dan antrean cetak, lalu lakukan tes cetak',
      'Hapus semua data pada komputer',
      'Langsung ganti printer',
    ],
    answer: 0,
    explanation: 'Memeriksa koneksi, antrean, dan hasil tes cetak membantu menemukan penyebab dengan langkah yang terukur.',
  },
  {
    title: 'Komputer terasa lambat',
    description: 'Pengguna mengeluhkan komputer melambat saat menjalankan aplikasi kerja.',
    choices: [
      'Matikan komputer secara paksa berulang kali',
      'Langsung format seluruh perangkat',
      'Periksa penggunaan resource dan ruang penyimpanan terlebih dahulu',
    ],
    answer: 2,
    explanation: 'Pemeriksaan penggunaan resource dan penyimpanan adalah langkah awal yang aman sebelum menentukan tindakan berikutnya.',
  },
];

const quizQuestions = [
  {
    question: 'Apa langkah awal yang tepat saat satu pengguna melaporkan internet terputus?',
    choices: ['Periksa koneksi perangkat dan status jaringan', 'Reset semua router kantor', 'Hapus akun pengguna'],
    answer: 0,
    explanation: 'Mulai dengan memastikan masalah ada di perangkat atau koneksinya sebelum mengubah jaringan bersama.',
  },
  {
    question: 'Apa yang sebaiknya diperiksa jika printer tidak merespons?',
    choices: ['Warna wallpaper', 'Koneksi dan antrean cetak', 'Akun media sosial pengguna'],
    answer: 1,
    explanation: 'Koneksi printer dan antrean cetak adalah pemeriksaan awal yang relevan.',
  },
  {
    question: 'Apa tujuan stock opname aset IT?',
    choices: ['Mencocokkan data inventaris dengan kondisi aset sebenarnya', 'Menghapus semua data inventaris', 'Mengganti nama seluruh perangkat'],
    answer: 0,
    explanation: 'Stock opname membantu memastikan catatan aset sesuai dengan keberadaan dan kondisi perangkat.',
  },
];

function App() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('profil');
  const [terminalHistory, setTerminalHistory] = useState([
    'IHSAN.OS v4.0 - Terminal Portofolio',
    'Pilih perintah di bawah atau ketik manual.'
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalInputRef = useRef(null);
  const modalRef = useRef(null);
  const modalOpenerRef = useRef(null);
  const [terminalMissionStep, setTerminalMissionStep] = useState(0);
  const [activeGame, setActiveGame] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannedAssets, setScannedAssets] = useState([]);
  const [scanMessage, setScanMessage] = useState('');
  const [ticketIndex, setTicketIndex] = useState(0);
  const [ticketScore, setTicketScore] = useState(0);
  const [ticketChoice, setTicketChoice] = useState(-1);
  const [ticketAnswered, setTicketAnswered] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizChoice, setQuizChoice] = useState(-1);
  const [quizAnswered, setQuizAnswered] = useState(false);

  useEffect(() => {
    if (isTerminalOpen && terminalInputRef.current) {
      terminalInputRef.current.focus();
    }
  }, [isTerminalOpen]);

  useEffect(() => {
    const sectionIds = ['profil', 'pengalaman', 'keahlian', 'proyek', 'mini-lab'];
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean);

    const updateActiveSection = () => {
      const activationPoint = window.scrollY + window.innerHeight * 0.3;
      let currentSectionId = 'profil';

      sections.forEach(section => {
        if (section.getBoundingClientRect().top + window.scrollY <= activationPoint) {
          currentSectionId = section.id;
        }
      });

      setActiveSection(currentSectionId);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, []);

  const isModalOpen = isTerminalOpen || Boolean(activeGame);

  useEffect(() => {
    if (!isModalOpen) {
      modalOpenerRef.current?.focus();
      return undefined;
    }

    const modal = modalRef.current;
    const focusableElements = modal?.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements?.[0];
    const lastFocusable = focusableElements?.[focusableElements.length - 1];

    if (isTerminalOpen && terminalInputRef.current) {
      terminalInputRef.current.focus();
    } else {
      firstFocusable?.focus();
    }

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleModalKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (isTerminalOpen) {
          setIsTerminalOpen(false);
        } else {
          setActiveGame('');
        }
        return;
      }

      if (event.key !== 'Tab' || !firstFocusable || !lastFocusable) return;

      if (!modal.contains(document.activeElement)) {
        event.preventDefault();
        firstFocusable.focus();
      } else if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    document.addEventListener('keydown', handleModalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleModalKeyDown);
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isModalOpen, isTerminalOpen]);

  const openTerminal = () => {
    modalOpenerRef.current = document.activeElement;
    setIsTerminalOpen(true);
  };

  const executeCommand = (cmdText) => {
    const cmd = cmdText.trim().toLowerCase();
    let response = '';

    if (cmd === 'mission') {
      setTerminalMissionStep(1);
      response = '> Misi dimulai: jalankan "skills", lalu "projects" untuk menyelesaikan misi.';
    } else if (terminalMissionStep === 1 && cmd === 'skills') {
      setTerminalMissionStep(2);
      response = '> Langkah 1/2 selesai. Sekarang jalankan "projects".';
    } else if (terminalMissionStep === 2 && cmd === 'projects') {
      setTerminalMissionStep(3);
      response = '> Misi selesai! Kamu menemukan kemampuan dan proyek di portofolio ini.';
    } else switch (cmd) {
      case 'whoami':
        response = '> Ihsan Rahadi Wicaksono - IT Support & Helpdesk Corporate.';
        break;
      case 'skills':
        response = '> Tech: IT Support, Hardware Troubleshooting, Instalasi & Konfigurasi, Remote Support, Monitoring Jaringan, React, Vite, Tailwind CSS.';
        break;
      case 'exp':
        response = '> Pengalaman: 6 bulan sebagai Frontend Developer, 1 tahun sebagai IT Support Helpdesk Corporate.';
        break;
      case 'edu':
        response = '> Pendidikan: SMK Prestasi Prima (RPL), Universitas Indraprasta PGRI (UNINDRA) - Teknik Informatika.';
        break;
      case 'projects':
        response = '> Proyek: System User Management dan IT Stock Opname System.';
        break;
      case 'help':
        response = '> Perintah: whoami, skills, exp, edu, projects, mission, clear, exit.';
        break;
      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;
      case 'exit':
        setIsTerminalOpen(false);
        setTerminalInput('');
        return;
      default:
        response = `> Perintah tidak dikenali: ${cmd}`;
    }
    setTerminalHistory(prev => [...prev, `$ ${cmd}`, response]);
    setTerminalInput('');
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (terminalInput) executeCommand(terminalInput);
  };

  const startGame = (game) => {
    setBarcodeInput('');
    setScannedAssets([]);
    setScanMessage('');
    setTicketIndex(0);
    setTicketScore(0);
    setTicketChoice(-1);
    setTicketAnswered(false);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizChoice(-1);
    setQuizAnswered(false);

    if (game === 'terminal') {
      modalOpenerRef.current = document.activeElement;
      setIsTerminalOpen(true);
      setTerminalMissionStep(1);
      setTerminalHistory(prev => [
        ...prev,
        '$ mission',
        '> Misi dimulai: jalankan "skills", lalu "projects" untuk menyelesaikan misi.',
      ]);
      return;
    }

    modalOpenerRef.current = document.activeElement;
    setActiveGame(game);
  };

  const handleStockScan = (e) => {
    e.preventDefault();
    const asset = stockAssets.find(({ code }) => code === barcodeInput.trim());
    if (!asset) {
      setScanMessage('Kode tidak ditemukan. Coba salah satu kode aset yang tersedia.');
    } else if (scannedAssets.includes(asset.code)) {
      setScanMessage('Aset ini sudah tercatat. Coba kode aset lainnya.');
    } else {
      setScannedAssets(prev => [...prev, asset.code]);
      setScanMessage(`Aset ditemukan: ${asset.name} — status ${asset.status}.`);
    }
    setBarcodeInput('');
  };

  const answerTicket = (choiceIndex) => {
    setTicketChoice(choiceIndex);
    setTicketAnswered(true);
    if (choiceIndex === helpdeskTickets[ticketIndex].answer) {
      setTicketScore(prev => prev + 1);
    }
  };

  const nextTicket = () => {
    setTicketIndex(prev => prev + 1);
    setTicketChoice(-1);
    setTicketAnswered(false);
  };

  const answerQuiz = (choiceIndex) => {
    setQuizChoice(choiceIndex);
    setQuizAnswered(true);
    if (choiceIndex === quizQuestions[quizIndex].answer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuizQuestion = () => {
    setQuizIndex(prev => prev + 1);
    setQuizChoice(-1);
    setQuizAnswered(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-[#a3e635] selection:text-black relative scroll-smooth">

      {/* MODAL TERMINAL */}
      {isTerminalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 text-[#a3e635] font-mono p-6 flex flex-col justify-center items-center">
          <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="terminal-title" className="max-w-3xl w-full bg-[#1a1a1a] border-4 border-[#a3e635] shadow-[8px_8px_0px_0px_#a3e635] p-6">
            <div className="flex justify-between items-center mb-4 border-b-2 border-gray-600 pb-2">
              <span id="terminal-title" className="font-bold">Terminal Mode</span>
              <button onClick={() => setIsTerminalOpen(false)} className="bg-red-500 text-white px-3 font-bold hover:bg-red-600">TUTUP [X]</button>
            </div>
            <div className="mb-6 flex flex-wrap gap-2 border-b-2 border-gray-800 pb-4">
              {['whoami', 'skills', 'exp', 'edu', 'projects', 'mission', 'help', 'clear'].map((cmd) => (
                <button key={cmd} onClick={() => executeCommand(cmd)} className="bg-[#2a2a2a] border border-[#a3e635] px-2 py-1 text-sm hover:bg-[#a3e635] hover:text-black transition-colors">
                  {cmd}
                </button>
              ))}
            </div>
            {terminalMissionStep > 0 && (
              <p className="mb-3 text-sm text-white">
                Misi Terminal: {terminalMissionStep === 1 ? 'jalankan skills' : terminalMissionStep === 2 ? 'jalankan projects' : 'selesai!'}
              </p>
            )}
            <div className="space-y-2 mb-4 h-48 overflow-y-auto whitespace-pre-wrap">
              {terminalHistory.map((line, idx) => (
                <div key={idx} className={line.startsWith('$') ? 'text-white' : 'text-[#a3e635]'}>{line}</div>
              ))}
            </div>
            <form onSubmit={handleTerminalSubmit} className="flex gap-2 border-t-2 border-gray-800 pt-4">
              <span className="text-white">$</span>
              <input ref={terminalInputRef} type="text" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} className="bg-transparent border-none outline-none flex-1 text-white" autoComplete="off" />
            </form>
          </div>
        </div>
      )}

      {/* MINI GAME MODAL */}
      {activeGame && (
        <div className="fixed inset-0 z-[90] bg-black/80 flex items-center justify-center p-6">
          <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="game-title" className="bg-white border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 id="game-title" className="text-2xl font-black uppercase">
                {activeGame === 'stock' ? 'Tantangan Stock Opname' : activeGame === 'helpdesk' ? 'IT Helpdesk Challenge' : 'Kuis Diagnosis IT'}
              </h3>
              <button onClick={() => setActiveGame('')} aria-label="Tutup permainan" className="text-2xl font-black hover:text-red-500">X</button>
            </div>

            {activeGame === 'stock' && (
              <div>
                <p className="font-medium text-gray-700 mb-4">Scan atau masukkan kode aset demo untuk mencocokkan perangkat. Kode yang tersedia: 12345, 67890, 54321.</p>
                <form onSubmit={handleStockScan} className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input type="text" value={barcodeInput} onChange={(e) => setBarcodeInput(e.target.value)} placeholder="Masukkan kode aset..." aria-label="Kode aset" className="flex-1 min-w-0 border-4 border-black p-3 font-mono text-xl" />
                    <button type="button" disabled={scannedAssets.length === stockAssets.length} onClick={() => setBarcodeInput(stockAssets.find(({ code }) => !scannedAssets.includes(code))?.code || '')} className="bg-[#fbbf24] text-black border-4 border-black px-4 font-bold hover:bg-white text-sm disabled:opacity-50">ISI KODE</button>
                  </div>
                  <button type="submit" className="bg-[#3b82f6] text-white border-4 border-black py-3 font-black text-xl hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">SCAN ASET</button>
                </form>
                {scanMessage && <p role="status" className="mt-4 border-2 border-black bg-[#f4f4f0] p-3 font-bold">{scanMessage}</p>}
                <div className="mt-5">
                  <div className="flex justify-between font-black mb-2"><span>PROGRES STOCK OPNAME</span><span>{scannedAssets.length}/{stockAssets.length}</span></div>
                  <div className="space-y-2">
                    {stockAssets.map(asset => (
                      <div key={asset.code} className={`flex justify-between gap-2 border-2 border-black p-3 ${scannedAssets.includes(asset.code) ? 'bg-[#a3e635]' : 'bg-gray-100'}`}>
                        <span className="font-bold">{asset.name}</span>
                        <span className="font-mono">{scannedAssets.includes(asset.code) ? 'TERCATAT' : 'BELUM SCAN'}</span>
                      </div>
                    ))}
                  </div>
                  {scannedAssets.length === stockAssets.length && <p className="mt-4 bg-[#a3e635] border-2 border-black p-3 font-black text-center">Selesai! Semua aset berhasil dicocokkan.</p>}
                </div>
              </div>
            )}

            {activeGame === 'helpdesk' && (
              <div>
                {ticketIndex < helpdeskTickets.length ? (
                  <>
                    <p className="text-sm font-black uppercase text-[#ec4899]">Tiket {ticketIndex + 1} dari {helpdeskTickets.length}</p>
                    <h4 className="text-xl font-black mt-2">{helpdeskTickets[ticketIndex].title}</h4>
                    <p className="text-gray-700 mt-2 mb-5">{helpdeskTickets[ticketIndex].description}</p>
                    <div className="space-y-3">
                      {helpdeskTickets[ticketIndex].choices.map((choice, index) => (
                        <button key={choice} disabled={ticketAnswered} onClick={() => answerTicket(index)} className={`w-full text-left border-4 border-black p-3 font-bold transition-colors disabled:cursor-default ${ticketAnswered && index === helpdeskTickets[ticketIndex].answer ? 'bg-[#a3e635]' : ticketAnswered && index === ticketChoice ? 'bg-red-200' : 'bg-[#f4f4f0] hover:bg-[#fbbf24]'}`}>
                          {choice}
                        </button>
                      ))}
                    </div>
                    {ticketAnswered && (
                      <div role="status" className="mt-4">
                        <p className="font-bold">{ticketChoice === helpdeskTickets[ticketIndex].answer ? 'Tepat! ' : 'Belum tepat. '}{helpdeskTickets[ticketIndex].explanation}</p>
                        <button onClick={nextTicket} className="mt-4 w-full bg-black text-white border-2 border-black py-3 font-black hover:bg-[#a3e635] hover:text-black">
                          {ticketIndex === helpdeskTickets.length - 1 ? 'LIHAT HASIL' : 'TIKET BERIKUTNYA'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-2xl font-black">Tantangan selesai!</p>
                    <p className="mt-2 font-medium">Skor kamu: {ticketScore} dari {helpdeskTickets.length} tiket.</p>
                    <button onClick={() => startGame('helpdesk')} className="mt-5 bg-[#a3e635] border-4 border-black px-6 py-3 font-black">ULANGI TANTANGAN</button>
                  </div>
                )}
              </div>
            )}

            {activeGame === 'quiz' && (
              <div>
                {quizIndex < quizQuestions.length ? (
                  <>
                    <p className="text-sm font-black uppercase text-[#ec4899]">Pertanyaan {quizIndex + 1} dari {quizQuestions.length}</p>
                    <h4 className="text-xl font-black mt-2 mb-5">{quizQuestions[quizIndex].question}</h4>
                    <div className="space-y-3">
                      {quizQuestions[quizIndex].choices.map((choice, index) => (
                        <button key={choice} disabled={quizAnswered} onClick={() => answerQuiz(index)} className={`w-full text-left border-4 border-black p-3 font-bold transition-colors disabled:cursor-default ${quizAnswered && index === quizQuestions[quizIndex].answer ? 'bg-[#a3e635]' : quizAnswered && index === quizChoice ? 'bg-red-200' : 'bg-[#f4f4f0] hover:bg-[#fbbf24]'}`}>
                          {choice}
                        </button>
                      ))}
                    </div>
                    {quizAnswered && (
                      <div role="status" className="mt-4">
                        <p className="font-bold">{quizChoice === quizQuestions[quizIndex].answer ? 'Benar! ' : 'Belum tepat. '}{quizQuestions[quizIndex].explanation}</p>
                        <button onClick={nextQuizQuestion} className="mt-4 w-full bg-black text-white border-2 border-black py-3 font-black hover:bg-[#a3e635] hover:text-black">
                          {quizIndex === quizQuestions.length - 1 ? 'LIHAT HASIL' : 'PERTANYAAN BERIKUTNYA'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-2xl font-black">Kuis selesai!</p>
                    <p className="mt-2 font-medium">Skor kamu: {quizScore} dari {quizQuestions.length} pertanyaan.</p>
                    <button onClick={() => startGame('quiz')} className="mt-5 bg-[#a3e635] border-4 border-black px-6 py-3 font-black">ULANGI KUIS</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-[#f4f4f0] border-b-4 border-black z-50 px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap justify-between items-center">
        <h1 className="text-base sm:text-xl md:text-2xl font-black bg-white px-2 sm:px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          IHSAN.RAHADI
        </h1>
        <button
          type="button"
          onClick={() => setIsMenuOpen(prev => !prev)}
          aria-label={isMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          className="md:hidden flex h-10 w-10 items-center justify-center border-2 border-black bg-white"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
            {isMenuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        <div id="primary-navigation" className={`${isMenuOpen ? 'flex' : 'hidden'} absolute left-0 top-full w-full flex-col gap-4 border-b-4 border-black bg-[#f4f4f0] p-5 font-bold md:static md:flex md:w-auto md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0`}>
          {[
            ['profil', 'Profil'],
            ['pengalaman', 'Pengalaman'],
            ['keahlian', 'Keahlian'],
            ['proyek', 'Proyek'],
            ['mini-lab', 'Lab Interaktif'],
          ].map(([sectionId, label]) => (
            <a
              key={sectionId}
              href={`#${sectionId}`}
              onClick={() => setIsMenuOpen(false)}
              aria-current={activeSection === sectionId ? 'location' : undefined}
              className={`min-h-11 inline-flex items-center transition-colors hover:text-[#ec4899] ${activeSection === sectionId ? 'text-[#ec4899] underline decoration-2 underline-offset-4' : ''}`}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO SECTION (DENGAN TOMBOL LINKEDIN) */}
      <section id="hero" className="min-h-screen box-border flex flex-col justify-center pt-24 pb-4 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="bg-white border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-4 md:p-6 lg:p-10 text-center flex flex-col items-center">

          <div className="inline-flex items-center gap-2 bg-[#a3e635] border-3 border-black font-extrabold px-4 py-1.5 mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm uppercase tracking-wider">
            <span className="w-2.5 h-2.5 bg-black rounded-full animate-ping"></span>
            <span>EAST JAKARTA, INDONESIA</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black mb-3 uppercase leading-tight tracking-tight">
            Halo, Saya <span className="bg-[#fbbf24] px-3 py-0.5 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">Ihsan</span>
          </h2>

          <div className="text-base lg:text-2xl font-black text-gray-900 mb-4 font-mono bg-[#f4f4f0] border-2 border-black px-4 py-2 inline-block">
            IT Support & Helpdesk Corporate
          </div>

          <p className="text-sm lg:text-lg font-medium text-gray-700 mb-5 max-w-2xl leading-relaxed">
            Berpengalaman mendukung sistem IT, membantu pengguna, dan mengembangkan aplikasi web. Saya siap memberikan solusi teknis yang efektif untuk kebutuhan perusahaan.
          </p>

          <div className="flex flex-wrap justify-center gap-4 w-full">
            <a href="#profil" className="bg-[#ec4899] text-white border-3 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] font-black px-6 py-3 text-base hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
              Jelajahi Profil ↓
            </a>
            <button onClick={openTerminal} className="bg-[#f4f4f0] text-black border-3 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] font-black px-6 py-3 text-base hover:bg-[#a3e635] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all flex items-center gap-2">
              <span>Buka Terminal</span> <span className="text-xl">💻</span>
            </button>

          </div>

        </div>
      </section>

      {/* TENTANG SAYA */}
      <section id="profil" className="scroll-mt-24 py-20 bg-white border-y-4 border-black px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="bg-[#fbbf24] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 text-center rotate-2">
                <img src={profilePhoto} alt="Foto Ihsan Rahadi di pantai saat matahari terbenam" className="h-72 w-56 border-4 border-black object-cover object-center" />
                <h3 className="font-black text-xl border-t-4 border-black pt-2 mt-4">Ihsan Rahadi</h3>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h3 className="text-3xl font-black mb-4 border-b-4 border-[#ec4899] inline-block pb-1">Detail Profil</h3>
              <p className="text-lg font-medium mb-4 text-gray-800 leading-relaxed">
                Halo, saya Ihsan (20). Saat ini saya bekerja sebagai <strong className="bg-[#a3e635] px-1">IT Support Helpdesk Corporate</strong>, di mana saya menangani berbagai kebutuhan teknis dan dukungan sistem di lingkungan perusahaan.
              </p>
              <p className="text-lg font-medium mb-6 text-gray-700 leading-relaxed">
                Sebelumnya, saya memiliki pengalaman selama 6 bulan sebagai <strong className="bg-[#a3e635] px-1">Frontend Developer</strong> di sebuah instansi negara. Dari pengalaman tersebut, saya memahami dasar-dasar bahasa pemrograman dan terus mengembangkan kemampuan saya di bidang teknologi informasi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PENGALAMAN & RIWAYAT */}
      <section id="pengalaman" className="scroll-mt-24 py-20 bg-[#f4f4f0] px-6 md:px-12 border-b-4 border-black">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block bg-[#ec4899] text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">Resume</span>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Riwayat Hidup & Pengalaman</h3>
            <div className="w-24 h-1.5 bg-black mx-auto mt-4"></div>
          </div>

          {/* === PENGALAMAN KERJA === */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-[#a3e635] border-3 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="font-black text-lg uppercase tracking-wide">💼 Pengalaman Kerja</span>
              </div>
              <div className="flex-1 h-1 bg-black"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group overflow-hidden">
                <div className="h-2 bg-[#a3e635]"></div>
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-[#a3e635] border-3 border-black w-12 h-12 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black text-lg">01</div>
                    <div>
                      <h4 className="font-black text-lg leading-tight">IT Support & Helpdesk Corporate</h4>
                      <span className="inline-block bg-black text-white text-xs font-bold px-2 py-0.5 mt-1">Desember 2025 - Sekarang</span>
                    </div>
                  </div>
                  <ul className="space-y-3 text-gray-800 font-medium text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-[#a3e635] mt-0.5 text-lg leading-none">▸</span>
                      <span>Melakukan perbaikan dan pemeliharaan perangkat seperti PC, laptop, dan printer.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#a3e635] mt-0.5 text-lg leading-none">▸</span>
                      <span>Melakukan instalasi dan konfigurasi perangkat sesuai kebutuhan pengguna.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#a3e635] mt-0.5 text-lg leading-none">▸</span>
                      <span>Memberikan dukungan jarak jauh untuk perangkat yang bermasalah di luar kota.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#a3e635] mt-0.5 text-lg leading-none">▸</span>
                      <span>Memantau jaringan kantor.</span>
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t-2 border-gray-200">
                    <span className="bg-[#f4f4f0] border-2 border-black text-xs font-bold px-2 py-0.5">Hardware</span>
                    <span className="bg-[#f4f4f0] border-2 border-black text-xs font-bold px-2 py-0.5">Networking</span>
                    <span className="bg-[#f4f4f0] border-2 border-black text-xs font-bold px-2 py-0.5">Troubleshooting</span>
                    <span className="bg-[#f4f4f0] border-2 border-black text-xs font-bold px-2 py-0.5">Remote Access</span>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group overflow-hidden">
                <div className="h-2 bg-[#3b82f6]"></div>
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-[#3b82f6] text-white border-3 border-black w-12 h-12 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black text-lg">02</div>
                    <div>
                      <h4 className="font-black text-lg leading-tight">Frontend Developer</h4>
                      <span className="inline-block bg-black text-white text-xs font-bold px-2 py-0.5 mt-1">Pengalaman Magang / Praktik</span>
                    </div>
                  </div>
                  <ul className="space-y-3 text-gray-800 font-medium text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-[#3b82f6] mt-0.5 text-lg leading-none">▸</span>
                      <span>Membuat dan mengembangkan website absensi untuk anak magang di Divisi Bapokting.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#3b82f6] mt-0.5 text-lg leading-none">▸</span>
                      <span>Membuat peta pasar tradisional dan modern di seluruh Indonesia.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#3b82f6] mt-0.5 text-lg leading-none">▸</span>
                      <span>Membuat visualisasi data pemantauan bahan pokok di setiap daerah.</span>
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t-2 border-gray-200">
                    <span className="bg-[#f4f4f0] border-2 border-black text-xs font-bold px-2 py-0.5">React</span>
                    <span className="bg-[#f4f4f0] border-2 border-black text-xs font-bold px-2 py-0.5">Node.js</span>
                    <span className="bg-[#f4f4f0] border-2 border-black text-xs font-bold px-2 py-0.5">PostgreSQL</span>
                    <span className="bg-[#f4f4f0] border-2 border-black text-xs font-bold px-2 py-0.5">Laravel</span>
                    <span className="bg-[#f4f4f0] border-2 border-black text-xs font-bold px-2 py-0.5">Google Looker</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* === PENDIDIKAN === */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-[#fbbf24] border-3 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="font-black text-lg uppercase tracking-wide">🎓 Pendidikan</span>
              </div>
              <div className="flex-1 h-1 bg-black"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 overflow-hidden">
              <div className="h-2 bg-[#fbbf24]"></div>
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-[#fbbf24] border-3 border-black w-12 h-12 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <h4 className="font-black text-lg leading-tight">Universitas Indraprasta PGRI (UNINDRA)</h4>
                    <span className="inline-block bg-black text-white text-xs font-bold px-2 py-0.5 mt-1">2026 - Saat Ini</span>
                  </div>
                </div>
                <div className="bg-[#f4f4f0] border-2 border-black p-4">
                  <p className="text-gray-800 font-medium text-sm leading-relaxed">
                    Mahasiswa aktif pada program studi <strong>Teknik Informatika</strong>. Memperdalam teori ilmu komputer, algoritma perangkat lunak, dan arsitektur sistem jaringan, serta menerapkannya dalam pekerjaan profesional.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  <span className="bg-[#fbbf24]/20 border-2 border-[#fbbf24] text-xs font-bold px-2 py-0.5">Ilmu Komputer</span>
                  <span className="bg-[#fbbf24]/20 border-2 border-[#fbbf24] text-xs font-bold px-2 py-0.5">Algoritma</span>
                  <span className="bg-[#fbbf24]/20 border-2 border-[#fbbf24] text-xs font-bold px-2 py-0.5">Arsitektur Jaringan</span>
                </div>
              </div>
            </div>
              <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 overflow-hidden">
                <div className="h-2 bg-[#fbbf24]"></div>
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-[#fbbf24] border-3 border-black w-12 h-12 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <div>
                      <h4 className="font-black text-lg leading-tight">SMK Prestasi Prima (RPL)</h4>
                      <span className="inline-block bg-black text-white text-xs font-bold px-2 py-0.5 mt-1">2022 - 2025</span>
                    </div>
                  </div>
                  <div className="bg-[#f4f4f0] border-2 border-black p-4">
                    <p className="text-gray-800 font-medium text-sm leading-relaxed">
                      Menempuh jurusan Pengembangan Perangkat Lunak dan Gim atau Rekayasa Perangkat Lunak (RPL), dengan fokus pada pengembangan aplikasi, gim, dan web serta pemrograman berorientasi objek.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    <span className="bg-[#fbbf24]/20 border-2 border-[#fbbf24] text-xs font-bold px-2 py-0.5">WEB</span>
                    <span className="bg-[#fbbf24]/20 border-2 border-[#fbbf24] text-xs font-bold px-2 py-0.5">Game</span>
                    <span className="bg-[#fbbf24]/20 border-2 border-[#fbbf24] text-xs font-bold px-2 py-0.5">Mobile</span>
                    <span className="bg-[#fbbf24]/20 border-2 border-[#fbbf24] text-xs font-bold px-2 py-0.5">App</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* KEAHLIAN */}
      <section id="keahlian" className="scroll-mt-24 py-20 px-6 md:px-12 bg-[#2dd4bf] border-b-4 border-black">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-black mb-10 text-center uppercase">Kemampuan Teknis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
              <h4 className="font-black text-xl mb-3">🖥️ IT Support & Hardware</h4>
              <p className="font-medium text-gray-700">Menangani troubleshooting, perbaikan, dan pemeliharaan perangkat <b>PC</b>, <b>laptop</b>, serta <b>printer</b>.</p>
            </div>
            <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
              <h4 className="font-black text-xl mb-3">⚙️ Instalasi & Support</h4>
              <p className="font-medium text-gray-700">Melakukan instalasi dan konfigurasi perangkat, membantu kebutuhan teknis pengguna, serta menangani kendala melalui <b>remote access</b>.</p>
            </div>
            <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
              <h4 className="font-black text-xl mb-3">🌐 Jaringan</h4>
              <p className="font-medium text-gray-700">Melakukan <b>monitoring jaringan kantor</b> dan memahami konfigurasi jaringan.</p>
            </div>
            <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
              <h4 className="font-black text-xl mb-3">💻 Frontend Web</h4>
              <p className="font-medium text-gray-700">Memiliki pengalaman mengembangkan antarmuka web menggunakan <b>React</b>, <b>Vite</b>, dan <b>Tailwind CSS</b>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROYEK */}
      <section id="proyek" className="scroll-mt-24 py-20 bg-white border-b-4 border-black px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-black mb-10 text-center uppercase">Proyek Pilihan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#f4f4f0] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div aria-label="Ilustrasi antarmuka pengelolaan pengguna" className="mb-6 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between border-b-2 border-black bg-[#a3e635] px-4 py-2">
                  <span className="font-black">USER MANAGEMENT</span>
                  <span className="font-mono text-xs">DEMO UI</span>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-3 p-4">
                  <div className="space-y-2">
                    <div className="h-3 w-2/3 bg-gray-200"></div>
                    <div className="h-3 w-1/2 bg-gray-200"></div>
                    <div className="h-3 w-3/4 bg-gray-200"></div>
                  </div>
                  <div className="flex flex-col gap-2 text-xs font-bold">
                    <span className="border-2 border-black bg-[#a3e635] px-2 py-1">AKTIF</span>
                    <span className="border-2 border-black bg-[#fbbf24] px-2 py-1">ADMIN</span>
                    <span className="border-2 border-black bg-gray-100 px-2 py-1">USER</span>
                  </div>
                </div>
                <p className="border-t-2 border-black px-4 py-2 text-xs font-bold text-gray-600">Ilustrasi antarmuka — bukan tangkapan layar aplikasi.</p>
              </div>
              <h4 className="font-black text-2xl mb-2">System User Management</h4>
              <p className="font-medium text-gray-700 mb-4">Sistem untuk membantu pengelolaan data pengguna secara terstruktur dalam satu aplikasi.</p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-black text-white text-xs font-bold px-2 py-1">User Management</span>
                <span className="bg-black text-white text-xs font-bold px-2 py-1">Web System</span>
              </div>
            </div>

            <div className="bg-[#f4f4f0] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div aria-label="Ilustrasi antarmuka stock opname aset IT" className="mb-6 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between border-b-2 border-black bg-[#fbbf24] px-4 py-2">
                  <span className="font-black">IT ASSET INVENTORY</span>
                  <span className="font-mono text-xs">DEMO UI</span>
                </div>
                <div className="space-y-2 p-4">
                  <div className="grid grid-cols-3 gap-2 text-xs font-black">
                    <span className="border-2 border-black bg-gray-100 p-2">KODE ASET</span>
                    <span className="border-2 border-black bg-gray-100 p-2">PERANGKAT</span>
                    <span className="border-2 border-black bg-gray-100 p-2">STATUS</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <span className="border border-gray-300 p-2 font-mono">IT-001</span>
                    <span className="border border-gray-300 p-2">Laptop</span>
                    <span className="border border-gray-300 bg-[#a3e635] p-2 font-bold">Aktif</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <span className="border border-gray-300 p-2 font-mono">IT-002</span>
                    <span className="border border-gray-300 p-2">Printer</span>
                    <span className="border border-gray-300 bg-[#fbbf24] p-2 font-bold">Dicek</span>
                  </div>
                </div>
                <p className="border-t-2 border-black px-4 py-2 text-xs font-bold text-gray-600">Ilustrasi antarmuka — bukan tangkapan layar aplikasi.</p>
              </div>
              <h4 className="font-black text-2xl mb-2">IT Stock Opname System</h4>
              <p className="font-medium text-gray-700 mb-4">Aplikasi untuk pencatatan dan pengecekan aset IT saat stock opname. Simulasi scan barcode tersedia di Lab Interaktif.</p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-black text-white text-xs font-bold px-2 py-1">Data Barang</span>
                <span className="bg-black text-white text-xs font-bold px-2 py-1">Monitoring Barang</span>
              </div>
              <a href="#mini-lab" className="inline-flex border-2 border-black bg-[#a3e635] px-4 py-2 font-bold hover:bg-white transition-colors">Lihat simulasi stock opname ↓</a>
            </div>
          </div>
        </div>
      </section>

      {/* MINI GAMES */}
      <section id="mini-lab" className="scroll-mt-24 py-16 px-6 md:px-12 bg-[#f4f4f0] border-b-4 border-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block bg-black text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 mb-4">Interactive Lab</span>
            <h3 className="text-3xl md:text-4xl font-black uppercase">Lab Interaktif</h3>
            <p className="mt-3 font-medium text-gray-800">Coba simulasi singkat seputar helpdesk, aset IT, dan troubleshooting.</p>
          </div>
          <div className="bg-white border-2 border-black border-l-8 border-l-[#ec4899] p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <span className="inline-block bg-[#ec4899] text-white border-2 border-black px-3 py-1 text-xs font-black uppercase mb-3">Tantangan utama</span>
                <h4 className="font-black text-2xl mb-2">🎫 IT Helpdesk Challenge</h4>
                <p className="font-medium text-gray-700 max-w-2xl">Pilih langkah penanganan yang tepat untuk tiga tiket kendala pengguna. Setiap jawaban disertai penjelasan singkat.</p>
              </div>
              <button onClick={() => startGame('helpdesk')} className="min-h-12 shrink-0 bg-[#a3e635] border-2 border-black px-6 py-3 font-black hover:bg-white active:translate-y-0.5">MULAI TANTANGAN</button>
            </div>
          </div>
          <details className="mt-5 border-2 border-black bg-white">
            <summary className="min-h-12 cursor-pointer p-4 font-black hover:bg-[#f4f4f0]">Permainan lainnya (3)</summary>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t-4 border-black p-4">
              <div className="border-2 border-black bg-[#f4f4f0] p-4">
                <h4 className="font-black mb-2">📦 Stock Opname</h4>
                <p className="text-sm text-gray-700 mb-4">Cocokkan kode demo dengan daftar aset IT.</p>
                <button onClick={() => startGame('stock')} className="w-full border-2 border-black bg-[#a3e635] py-2 text-sm font-black hover:bg-white">MULAI</button>
              </div>
              <div className="border-2 border-black bg-[#f4f4f0] p-4">
                <h4 className="font-black mb-2">⌨️ Terminal Quest</h4>
                <p className="text-sm text-gray-700 mb-4">Temukan kemampuan dan proyek lewat perintah terminal.</p>
                <button onClick={() => startGame('terminal')} className="w-full border-2 border-black bg-[#a3e635] py-2 text-sm font-black hover:bg-white">MULAI</button>
              </div>
              <div className="border-2 border-black bg-[#f4f4f0] p-4">
                <h4 className="font-black mb-2">🧠 Kuis Diagnosis IT</h4>
                <p className="text-sm text-gray-700 mb-4">Uji pengetahuan dasar troubleshooting dan aset IT.</p>
                <button onClick={() => startGame('quiz')} className="w-full border-2 border-black bg-[#a3e635] py-2 text-sm font-black hover:bg-white">MULAI</button>
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white text-center py-10 px-6">
        <h3 className="text-2xl font-black mb-4">Hubungi Saya</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">Jika ingin mengenal saya lebih jauh, jangan ragu untuk menghubungi saya!</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=rahadiihsan@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Kirim email ke rahadiihsan@gmail.com melalui Gmail" title="Email: rahadiihsan@gmail.com" className="flex min-h-20 min-w-20 flex-col items-center justify-center gap-1 border-4 border-white bg-white px-3 py-2 text-black hover:bg-[#ec4899] transition-colors shadow-[6px_6px_0px_0px_#a3e635] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#fbbf24]">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none">
              <path fill="#4285F4" d="M3 6.5A2.5 2.5 0 0 1 5.5 4H7v16H5.5A2.5 2.5 0 0 1 3 17.5z" />
              <path fill="#34A853" d="M17 4h1.5A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5H17z" />
              <path fill="#EA4335" d="M3.7 5.1 12 11.4l8.3-6.3A2.5 2.5 0 0 0 18.5 4h-13a2.5 2.5 0 0 0-1.8 1.1" />
              <path fill="#C5221F" d="M3 6.5v1.1l9 6.8 9-6.8V6.5c0-.5-.1-1-.4-1.4L12 11.4 3.4 5.1c-.3.4-.4.9-.4 1.4" />
            </svg>
            <span className="text-xs font-black">Email</span>
          </a>
          <a href="https://www.linkedin.com/in/ihsan-rahadi-wicaksono-b7635a277" target="_blank" rel="noopener noreferrer" aria-label="Kunjungi profil LinkedIn Ihsan Rahadi Wicaksono" title="LinkedIn" className="flex min-h-20 min-w-20 flex-col items-center justify-center gap-1 border-4 border-[#0A66C2] bg-[#0A66C2] px-3 py-2 text-white hover:bg-white hover:text-[#0A66C2] transition-colors shadow-[6px_6px_0px_0px_#a3e635] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#fbbf24]">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
              <path d="M5.2 3.5a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4ZM3.3 9.5h3.8v11H3.3zm6.2 0h3.6V11h.1c.5-.9 1.7-1.9 3.6-1.9 3.9 0 4.6 2.5 4.6 5.7v5.7h-3.8v-5.1c0-1.2 0-2.8-1.8-2.8s-2.1 1.3-2.1 2.7v5.2H9.5z" />
            </svg>
            <span className="text-xs font-black">LinkedIn</span>
          </a>
          <a href="https://www.instagram.com/ihsan.wootpaker_/" target="_blank" rel="noopener noreferrer" aria-label="Kunjungi profil Instagram Ihsan" title="Instagram" className="flex min-h-20 min-w-20 flex-col items-center justify-center gap-1 border-4 border-[#E4405F] bg-[#E4405F] px-3 py-2 text-white hover:bg-white hover:text-[#E4405F] transition-colors shadow-[6px_6px_0px_0px_#a3e635] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#fbbf24]">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
            </svg>
            <span className="text-xs font-black">Instagram</span>
          </a>
          <a href="https://www.facebook.com/ihsanrahadi.wicaksono" target="_blank" rel="noopener noreferrer" aria-label="Kunjungi profil Facebook Ihsan" title="Facebook" className="flex min-h-20 min-w-20 flex-col items-center justify-center gap-1 border-4 border-[#1877F2] bg-[#1877F2] px-3 py-2 text-white hover:bg-white hover:text-[#1877F2] transition-colors shadow-[6px_6px_0px_0px_#a3e635] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#fbbf24]">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
              <path d="M13.4 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.5 1.6-1.5h1.7V3.2c-.3 0-1.3-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.3H7.2v3.2H10V21h3.4Z" />
            </svg>
            <span className="text-xs font-black">Facebook</span>
          </a>
          <a href="https://github.com/IhsanRahadi" target="_blank" rel="noopener noreferrer" aria-label="Kunjungi profil GitHub Ihsan Rahadi" title="GitHub" className="flex min-h-20 min-w-20 flex-col items-center justify-center gap-1 border-4 border-[#24292F] bg-[#24292F] px-3 py-2 text-white hover:bg-white hover:text-[#24292F] transition-colors shadow-[6px_6px_0px_0px_#a3e635] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#fbbf24]">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
              <path d="M12 .9a11.1 11.1 0 0 0-3.5 21.6c.6.1.8-.3.8-.6v-2.1c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.3-1.6-1.3-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.8 2.7 4.5 1.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.3-5.1-5.5 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.5.1-3 0 0 1-.3 3.1 1.2a10.7 10.7 0 0 1 5.6 0c2.1-1.5 3.1-1.2 3.1-1.2.6 1.5.2 2.7.1 3 .8.8 1.2 1.8 1.2 3 0 4.2-2.6 5.2-5.1 5.5.4.3.8 1 .8 2v3.1c0 .3.2.7.8.6A11.1 11.1 0 0 0 12 .9Z" />
            </svg>
            <span className="text-xs font-black">GitHub</span>
          </a>
        </div>
        <div className="mt-12 text-sm text-gray-500 font-mono">
          © 2026 Ihsan Rahadi Wicaksono. Built with React & Tailwind.
        </div>
      </footer>

    </div>
  );
}

export default App;