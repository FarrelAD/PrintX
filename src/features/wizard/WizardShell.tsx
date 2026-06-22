import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ProjectType, ProjectData } from '@/types/project';
import Step1Category from '@/components/wizard/Step1Category';
import Step2Assets from '@/components/wizard/Step2Assets';
import Step3Mapping from '@/components/wizard/Step3Mapping';
import Step4Result from '@/components/wizard/Step4Result';
import Step5Print from '@/components/wizard/Step5Print';
import { saveProject } from '@/lib/db';

import StatusDropdown from '@/components/ui/StatusDropdown';

export default function WizardShell({ 
  initialData,
  onClose 
}: {
  initialData?: ProjectData | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [step, setStep] = useState(initialData ? 2 : 1);
  const [projectData, setProjectData] = useState<ProjectData>(initialData || {
    type: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedData = useRef<string>(JSON.stringify(initialData || {}));

  // Auto-save on data change
  useEffect(() => {
    // Only save if we have a type (started the project) or if it's already an existing project
    if (!projectData.type && !projectData.id) return;

    const currentDataStr = JSON.stringify(projectData);
    if (currentDataStr === lastSavedData.current) return;

    const timer = setTimeout(() => {
      setIsSaving(true);
      saveProject(projectData).then(updated => {
        lastSavedData.current = JSON.stringify(updated);
        
        // If this was a "new" project and we just got an ID, update the URL
        if (!projectData.id && updated.id) {
          setProjectData(prev => ({ ...prev, id: updated.id }));
          const searchParams = new URLSearchParams(location.search);
          navigate(`/dashboard/project/${updated.id}?${searchParams.toString()}`, { replace: true });
        }
        
        setIsSaving(false);
      }).catch(err => {
        console.error('Failed to auto-save:', err);
        setIsSaving(false);
      });
    }, 1000); // Debounce saves by 1s

    return () => clearTimeout(timer);
  }, [projectData, location.search, navigate]);

  // Prevent accidental close during save
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isSaving) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSaving]);

  const steps = [
    { number: 1, title: t('wizard.steps.category') },
    { number: 2, title: t('wizard.steps.assets') },
    { number: 3, title: t('wizard.steps.mapping') },
    { number: 4, title: t('wizard.steps.result') },
    { number: 5, title: t('wizard.steps.print') },
  ];

  const handleTypeSelect = (type: ProjectType) => {
    setProjectData(prev => ({ ...prev, type }));
    setStep(2);
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleUpdate = useCallback((newData: ProjectData) => {
    setProjectData(newData);
  }, []);

  return (
    <div className="flex flex-col min-h-full min-w-0">
      {/* Header Wizard */}
      <div className="flex justify-between items-center mb-8 md:mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="text-xs md:text-sm font-semibold uppercase tracking-widest flex items-center gap-1 md:gap-2 hover:text-secondary transition-colors whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            {t('common.cancel')}
          </button>
          
          {projectData.name && (
            <>
              <div className="h-4 w-px bg-outline-variant hidden sm:block" />
              <div className="hidden sm:flex flex-col">
                <div className="flex items-center gap-2 max-w-[100px] md:max-w-[200px]">
                  <span className="material-symbols-outlined text-base text-secondary">folder</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary truncate">
                    {projectData.name}
                  </span>
                </div>
                {/* Save Indicator */}
                <div className="flex items-center gap-1.5 opacity-60">
                  <span className={`material-symbols-outlined text-[10px] ${isSaving ? 'animate-spin text-primary' : 'text-green-500'}`}>
                    {isSaving ? 'sync' : 'cloud_done'}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-tighter">
                    {isSaving ? t('common.loading') : (t('common.saved') || 'Tersimpan')}
                  </span>
                </div>
              </div>
              <StatusDropdown 
                currentStatus={projectData.status || 'draft'}
                onStatusChange={(status) => setProjectData(prev => ({ ...prev, status, updatedAt: Date.now() }))}
                className="hidden md:block"
                direction="down"
              />
            </>
          )}
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
                title={s.number > 1 && !projectData.type && step < s.number ? t('wizard.tooltip_select_type') || 'Pilih kategori terlebih dahulu' : t('wizard.tooltip_go_to_step', { step: s.number })}
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
        {step === 2 && <Step2Assets data={projectData} onUpdate={handleUpdate} onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <Step3Mapping data={projectData} onUpdate={handleUpdate} onNext={handleNext} onBack={handleBack} />}
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
            onUpdate={handleUpdate}
            onComplete={onClose} 
          />
        )}
      </div>
    </div>
  );
}
