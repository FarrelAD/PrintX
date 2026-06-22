import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import type { ProjectData } from '@/types/project';

export default function Step2Assets({
  data,
  onUpdate,
  onNext,
  onBack,
}: {
  data: ProjectData;
  onUpdate: (data: ProjectData) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const designInputRef = useRef<HTMLInputElement>(null);
  const dataInputRef = useRef<HTMLInputElement>(null);

  const handleDesignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdate({
          ...data,
          design: {
            fileName: file.name,
            preview: event.target?.result as string,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDataChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const bstr = event.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as (
          | string
          | number
          | boolean
          | null
        )[][];

        if (jsonData.length > 0) {
          const headers = jsonData[0].map((h) => String(h));
          const rows = jsonData.slice(1);
          onUpdate({
            ...data,
            dataset: {
              fileName: file.name,
              headers,
              rows,
            },
          });
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const removeDesign = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ ...data, design: undefined });
    if (designInputRef.current) designInputRef.current.value = '';
  };

  const removeData = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ ...data, dataset: undefined });
    if (dataInputRef.current) dataInputRef.current.value = '';
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl md:text-4xl font-heading mb-2 text-center">
        {t('wizard.step2.title')}
      </h2>
      <p className="text-secondary text-center mb-8 px-4 text-xs md:text-sm">
        {t('wizard.step2.desc')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Design Upload */}
        <div className="border border-primary p-6 md:p-8 bg-white flex flex-col">
          <h3 className="text-lg font-heading mb-4 uppercase tracking-tight">
            {t('wizard.step2.design.title')}
          </h3>
          <input
            type="file"
            ref={designInputRef}
            onChange={handleDesignChange}
            accept="image/*"
            className="hidden"
          />

          {!data.design?.preview ? (
            <div
              onClick={() => designInputRef.current?.click()}
              className="border-2 border-dashed border-outline-variant p-8 md:p-12 text-center flex flex-col items-center group cursor-pointer hover:border-primary transition-colors flex-1"
            >
              <span className="material-symbols-outlined text-4xl mb-4 text-secondary group-hover:text-primary transition-colors">
                image
              </span>
              <p className="text-sm font-semibold uppercase tracking-widest mb-2">
                {t('wizard.step2.design.upload')}
              </p>
              <p className="text-[10px] text-secondary">
                {t('wizard.step2.design.drop')}
              </p>
            </div>
          ) : (
            <div className="relative group border border-outline-variant bg-surface-container-low aspect-video flex items-center justify-center overflow-hidden">
              <img
                src={data.design.preview}
                alt="Design preview"
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  onClick={() => designInputRef.current?.click()}
                  className="bg-white text-primary p-2 rounded-full hover:bg-primary hover:text-white transition-colors"
                  title={t('wizard.step2.design.edit') || 'Ganti Desain'}
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button
                  onClick={removeDesign}
                  className="bg-white text-error p-2 rounded-full hover:bg-error hover:text-white transition-colors"
                  title={t('wizard.step2.design.delete') || 'Hapus Desain'}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          )}
          {data.design?.fileName && (
            <p className="mt-2 text-[10px] text-secondary truncate">
              {data.design.fileName}
            </p>
          )}
        </div>

        {/* Data Upload */}
        <div className="border border-primary p-6 md:p-8 bg-white flex flex-col">
          <h3 className="text-lg font-heading mb-4 uppercase tracking-tight">
            {t('wizard.step2.data.title')}
          </h3>
          <input
            type="file"
            ref={dataInputRef}
            onChange={handleDataChange}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            className="hidden"
          />

          {!data.dataset ? (
            <div
              onClick={() => dataInputRef.current?.click()}
              className="border-2 border-dashed border-outline-variant p-8 md:p-12 text-center flex flex-col items-center group cursor-pointer hover:border-primary transition-colors flex-1"
            >
              <span className="material-symbols-outlined text-4xl mb-4 text-secondary group-hover:text-primary transition-colors">
                table_chart
              </span>
              <p className="text-sm font-semibold uppercase tracking-widest mb-2">
                {t('wizard.step2.data.upload')}
              </p>
              <p className="text-[10px] text-secondary">
                {t('wizard.step2.data.drop')}
              </p>
            </div>
          ) : (
            <div className="border border-primary bg-surface-container-low p-6 flex-1 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-4xl mb-2 text-primary">
                check_circle
              </span>
              <p className="text-sm font-bold uppercase tracking-widest truncate max-w-full mb-1">
                {data.dataset.fileName}
              </p>
              <p className="text-[10px] text-secondary uppercase tracking-widest mb-4">
                {t('wizard.step2.data.rows_found', {
                  count: data.dataset.rows.length,
                })}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => dataInputRef.current?.click()}
                  className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                >
                  {t('wizard.step2.data.replace')}
                </button>
                <button
                  onClick={removeData}
                  className="text-[10px] font-bold uppercase tracking-widest text-error hover:underline"
                >
                  {t('wizard.step2.data.remove')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full-width Data Preview */}
      {data.dataset && (
        <div className="mt-8 border border-primary bg-white p-4 md:p-8 animate-in fade-in slide-in-from-top-4 duration-500 w-full overflow-hidden">
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-base md:text-lg font-heading uppercase tracking-tight">
              {t('wizard.step2.preview.title')}
            </h3>
            <p className="text-[9px] md:text-[10px] font-bold text-secondary uppercase tracking-widest">
              {t('wizard.step2.preview.showing')}
            </p>
          </div>

          {/* Desktop Preview Table */}
          <div className="hidden md:block border border-outline-variant overflow-x-auto w-full">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="p-3 border-r border-outline-variant w-10 text-center font-bold text-secondary">
                    #
                  </th>
                  {data.dataset.headers.map((h, i) => (
                    <th
                      key={i}
                      className="p-3 font-bold uppercase tracking-tight whitespace-nowrap border-r border-outline-variant last:border-0"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.dataset.rows.slice(0, 15).map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-outline-variant/30 last:border-0 hover:bg-surface-container-lowest transition-colors"
                  >
                    <td className="p-3 border-r border-outline-variant text-center text-secondary font-mono text-[10px]">
                      {i + 1}
                    </td>
                    {data.dataset?.headers.map((_, j) => (
                      <td
                        key={j}
                        className="p-3 text-secondary whitespace-nowrap border-r border-outline-variant last:border-0"
                      >
                        {row[j] !== undefined ? String(row[j]) : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Preview Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {data.dataset.rows.slice(0, 5).map((row, i) => (
              <div
                key={i}
                className="border border-outline-variant bg-surface-container-lowest p-4"
              >
                <div className="flex justify-between items-center mb-3 border-b border-outline-variant pb-2">
                  <span className="text-[10px] font-bold text-primary font-mono bg-white border border-primary px-2 py-0.5">
                    {t('wizard.step2.preview.row', { index: i + 1 })}
                  </span>
                </div>
                <div className="space-y-3">
                  {data.dataset?.headers.map((header, j) => (
                    <div key={j} className="grid grid-cols-3 gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-secondary truncate">
                        {header}
                      </span>
                      <span className="text-[10px] text-primary col-span-2 wrap-break-word">
                        {row[j] !== undefined ? String(row[j]) : '-'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {data.dataset.rows.length > 5 && (
              <div className="text-center py-4 border border-dashed border-outline-variant">
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                  {t('wizard.step2.preview.more', {
                    count: data.dataset.rows.length - 5,
                  })}
                </p>
                <p className="text-[8px] text-secondary mt-1">
                  {t('wizard.step2.preview.wide_desc')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 md:mt-12 flex justify-between gap-4">
        <button
          onClick={onBack}
          className="flex-1 md:flex-none py-2.5 px-6 md:py-3 md:px-8 border border-primary text-[10px] md:text-sm font-bold uppercase tracking-widest hover:bg-surface-container transition-colors"
        >
          {t('common.back')}
        </button>
        <button
          onClick={onNext}
          disabled={!data.design || !data.dataset}
          className={`flex-1 md:flex-none py-2.5 px-8 md:py-3 md:px-12 bg-primary text-white text-[10px] md:text-sm font-bold uppercase tracking-widest transition-all ${
            !data.design || !data.dataset
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:opacity-90'
          }`}
        >
          {t('common.continue')}
        </button>
      </div>
    </div>
  );
}
