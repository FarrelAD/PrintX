import type { ProjectType } from '../../types/project';

export default function Step1Category({ onSelect }: {
  onSelect: (type: ProjectType) => void
}) {
  const categories = [
    { id: 'id_card', title: 'Kartu ID', icon: 'badge', desc: 'Kartu nama, ID karyawan, kartu anggota.' },
    { id: 'certificate', title: 'Sertifikat', icon: 'workspace_premium', desc: 'Sertifikat pelatihan, piagam, ijazah.' },
    { id: 'label', title: 'Label', icon: 'label', desc: 'Label pengiriman, barcode, stiker produk.' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading mb-4 text-center px-4">Apa yang ingin Anda cetak?</h2>
      <p className="text-xs md:text-sm text-secondary text-center mb-8 md:mb-12 px-6">Pilih kategori proyek untuk menyesuaikan alat pemrosesan kami.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id as ProjectType)}
            className="bg-white border border-primary p-6 md:p-8 text-left hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-primary)] transition-all group"
          >
            <span className="material-symbols-outlined text-3xl md:text-4xl mb-4 md:mb-6 group-hover:scale-110 transition-transform">{item.icon}</span>
            <h3 className="text-lg md:text-xl mb-2 md:mb-3 font-heading">{item.title}</h3>
            <p className="text-xs md:text-sm text-secondary leading-relaxed">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
