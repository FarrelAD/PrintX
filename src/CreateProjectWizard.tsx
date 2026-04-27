import { useState, useEffect } from 'react';
import type { ProjectType, ProjectData } from './types/project';
import Step1Category from './components/wizard/Step1Category';
import Step2Assets from './components/wizard/Step2Assets';
import Step3Mapping from './components/wizard/Step3Mapping';
import Step4Result from './components/wizard/Step4Result';
import Step5Print from './components/wizard/Step5Print';
import { saveProject } from './lib/db';

export default function CreateProjectWizard({ 
  initialData,
  onClose 
}: {
  initialData?: ProjectData | null;
  onClose: () => void;
}) {
  const [step, setStep] = useState(initialData ? 2 : 1);
  const [projectData, setProjectData] = useState<ProjectData>(initialData || {
    type: null,
  });

  // Auto-save on data change
  useEffect(() => {
    if (projectData.type) {
      saveProject(projectData).then(updated => {
        if (!projectData.id) {
          setProjectData(prev => ({ ...prev, id: updated.id }));
        }
      });
    }
  }, [projectData]);

  const steps = [
    { number: 1, title: 'Kategori' },
    { number: 2, title: 'Aset' },
    { number: 3, title: 'Pemetaan' },
    { number: 4, title: 'Hasil' },
    { number: 5, title: 'Cetak' },
  ];

  const handleTypeSelect = (type: ProjectType) => {
    setProjectData(prev => ({ ...prev, type }));
    setStep(2);
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="flex flex-col min-h-full min-w-0">
      {/* Header Wizard */}
      <div className="flex justify-between items-center mb-8 md:mb-12">
        <div>
          <button 
            onClick={onClose}
            className="text-xs md:text-sm font-semibold uppercase tracking-widest flex items-center gap-1 md:gap-2 hover:text-secondary transition-colors whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Batal
          </button>
        </div>
        <div className="flex gap-2 md:gap-4 items-center">
          {steps.map((s) => (
            <div key={s.number} className="flex items-center gap-1 md:gap-2">
              <button 
                onClick={() => setStep(s.number)}
                disabled={s.number > 1 && !projectData.type && step < s.number}
                className={`flex items-center gap-1 md:gap-2 group transition-all ${
                  (s.number > 1 && !projectData.type && step < s.number) 
                    ? 'opacity-40 cursor-not-allowed' 
                    : 'cursor-pointer'
                }`}
                title={s.number > 1 && !projectData.type && step < s.number ? 'Pilih kategori terlebih dahulu' : `Ke langkah ${s.number}`}
              >
                <div className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border font-bold text-[10px] md:text-xs transition-all ${
                  step === s.number 
                    ? 'bg-primary text-white border-primary' 
                    : 'border-outline-variant text-secondary group-hover:border-primary group-hover:text-primary'
                }`}>
                  {s.number}
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-widest hidden lg:inline transition-all ${
                  step === s.number 
                    ? 'text-primary' 
                    : 'text-secondary group-hover:text-primary'
                }`}>
                  {s.title}
                </span>
              </button>
              {s.number < 4 && <div className="w-2 md:w-4 h-px bg-outline-variant"></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-full mx-auto w-full">
        {step === 1 && <Step1Category onSelect={handleTypeSelect} />}
        {step === 2 && <Step2Assets data={projectData} onUpdate={setProjectData} onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <Step3Mapping data={projectData} onUpdate={setProjectData} onNext={handleNext} onBack={handleBack} />}
        {step === 4 && (
          <Step4Result 
            data={projectData} 
            onBack={handleBack} 
            onComplete={handleNext} 
          />
        )}
        {step === 5 && (
          <Step5Print 
            data={projectData} 
            onBack={handleBack} 
            onUpdate={setProjectData}
            onComplete={onClose} 
          />
        )}
      </div>
    </div>
  );
}
