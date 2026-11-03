import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router';
import type { ProjectType, ProjectData } from '@/types/project';
import Step1Category from '@/components/wizard/Step1Category';
import Step2Assets from '@/components/wizard/Step2Assets';
import Step3Mapping from '@/components/wizard/Step3Mapping';
import Step4Result from '@/components/wizard/Step4Result';
import Step5Print from '@/components/wizard/Step5Print';
import { saveProject, getInitialWizardStep } from '@/lib/db';

import StatusDropdown from '@/components/ui/StatusDropdown';

function serializeComparable(data: ProjectData): string {
  const { updatedAt: _updatedAt, ...rest } = data;
  void _updatedAt;
  return JSON.stringify(rest);
}

function shouldPersistProject(data: ProjectData): boolean {
  return Boolean(
    data.id ||
    data.type ||
    data.name?.trim() ||
    data.design?.preview ||
    (data.dataset && data.dataset.rows.length > 0),
  );
}

export default function WizardShell({
  initialData,
  onClose,
}: {
  initialData?: ProjectData | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(() => getInitialWizardStep(initialData));
  const [projectData, setProjectData] = useState<ProjectData>(
    initialData || {
      type: null,
      status: 'draft',
    },
  );
  const [isSaving, setIsSaving] = useState(false);

  const lastSavedComparable = useRef<string>(
    initialData?.id ? serializeComparable(initialData) : '',
  );
  const latestProjectDataRef = useRef<ProjectData>(projectData);

  useEffect(() => {
    latestProjectDataRef.current = projectData;
  }, [projectData]);

  const persistNow = useCallback(
    async (dataToSave: ProjectData) => {
      if (!shouldPersistProject(dataToSave)) return null;
      const comparable = serializeComparable(dataToSave);
      if (dataToSave.id && comparable === lastSavedComparable.current) {
        return dataToSave;
      }

      setIsSaving(true);
      try {
        const updated = await saveProject(dataToSave);
        lastSavedComparable.current = serializeComparable(updated);

        if (!dataToSave.id && updated.id) {
          latestProjectDataRef.current = {
            ...latestProjectDataRef.current,
            id: updated.id,
          };
          setProjectData((prev) => ({ ...prev, id: updated.id }));
          const searchParams = new URLSearchParams(location.search);
          searchParams.delete('name');
          const query = searchParams.toString();
          navigate(
            `/dashboard/project/${updated.id}${query ? `?${query}` : ''}`,
            { replace: true },
          );
        }
        return updated;
      } catch (err) {
        console.error('Failed to auto-save project:', err);
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [location.search, navigate],
  );

  // Auto-save on data change
  useEffect(() => {
    if (!shouldPersistProject(projectData)) return;

    const currentComparable = serializeComparable(projectData);
    if (projectData.id && currentComparable === lastSavedComparable.current) {
      return;
    }

    const timer = setTimeout(() => {
      void persistNow(latestProjectDataRef.current);
    }, 500);

    return () => clearTimeout(timer);
  }, [projectData, persistNow]);

  // Flush any pending unsaved changes on unmount
  useEffect(() => {
    return () => {
      const current = latestProjectDataRef.current;
      if (
        shouldPersistProject(current) &&
        (!current.id ||
          serializeComparable(current) !== lastSavedComparable.current)
      ) {
        void saveProject(current).catch((err) =>
          console.error('Failed to flush project save on unmount:', err),
        );
      }
    };
  }, []);

  // Prevent accidental browser tab close during active save
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
    const nextData: ProjectData = {
      ...latestProjectDataRef.current,
      type,
      status: latestProjectDataRef.current.status || 'draft',
    };
    latestProjectDataRef.current = nextData;
    setProjectData(nextData);
    setStep(2);
    void persistNow(nextData);
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleUpdate = useCallback((newData: ProjectData) => {
    setProjectData((prev) => {
      const merged: ProjectData = {
        ...prev,
        ...newData,
        id: prev.id || newData.id,
        name: newData.name ?? prev.name,
        status: newData.status ?? prev.status ?? 'draft',
      };
      latestProjectDataRef.current = merged;
      return merged;
    });
  }, []);

  const handleCloseWizard = useCallback(async () => {
    const current = latestProjectDataRef.current;
    if (
      shouldPersistProject(current) &&
      (!current.id ||
        serializeComparable(current) !== lastSavedComparable.current)
    ) {
      await persistNow(current);
    }
    onClose();
  }, [onClose, persistNow]);

  return (
    <div className="flex flex-col min-h-full min-w-0">
      {/* Header Wizard */}
      <div className="flex justify-between items-center mb-8 md:mb-12">
        <div className="flex items-center gap-4">
          <button
            onClick={() => void handleCloseWizard()}
            className="text-xs md:text-sm font-semibold uppercase tracking-widest flex items-center gap-1 md:gap-2 hover:text-secondary transition-colors whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">
              arrow_back
            </span>
            {t('common.cancel')}
          </button>

          {(projectData.name || projectData.id) && (
            <>
              <div className="h-4 w-px bg-outline-variant hidden sm:block" />
              <div className="hidden sm:flex flex-col">
                <div className="flex items-center gap-2 max-w-[100px] md:max-w-[200px]">
                  <span className="material-symbols-outlined text-base text-secondary">
                    folder
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary truncate">
                    {projectData.name || t('projects.untitled')}
                  </span>
                </div>
                {/* Save Indicator */}
                <div className="flex items-center gap-1.5 opacity-60">
                  <span
                    className={`material-symbols-outlined text-[10px] ${isSaving ? 'animate-spin text-primary' : 'text-green-500'}`}
                  >
                    {isSaving ? 'sync' : 'cloud_done'}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-tighter">
                    {isSaving
                      ? t('common.loading')
                      : t('common.saved') || 'Tersimpan'}
                  </span>
                </div>
              </div>
              <StatusDropdown
                currentStatus={projectData.status || 'draft'}
                onStatusChange={(status) =>
                  setProjectData((prev) => {
                    const updated = {
                      ...prev,
                      status,
                      updatedAt: Date.now(),
                    };
                    latestProjectDataRef.current = updated;
                    return updated;
                  })
                }
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
                  s.number > 1 && !projectData.type && step < s.number
                    ? 'opacity-40 cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
                title={
                  s.number > 1 && !projectData.type && step < s.number
                    ? t('wizard.tooltip_select_type') ||
                      'Pilih kategori terlebih dahulu'
                    : t('wizard.tooltip_go_to_step', { step: s.number })
                }
              >
                <div
                  className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border font-bold text-[10px] md:text-xs transition-all ${
                    step === s.number
                      ? 'bg-primary text-white border-primary'
                      : 'border-outline-variant text-secondary group-hover:border-primary group-hover:text-primary'
                  }`}
                >
                  {s.number}
                </div>
                <span
                  className={`text-[10px] uppercase font-bold tracking-widest hidden lg:inline transition-all ${
                    step === s.number
                      ? 'text-primary'
                      : 'text-secondary group-hover:text-primary'
                  }`}
                >
                  {s.title}
                </span>
              </button>
              {s.number < 5 && (
                <div className="w-2 md:w-4 h-px bg-outline-variant"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-full mx-auto w-full">
        {step === 1 && <Step1Category onSelect={handleTypeSelect} />}
        {step === 2 && (
          <Step2Assets
            data={projectData}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 3 && (
          <Step3Mapping
            data={projectData}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
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
            onComplete={() => void handleCloseWizard()}
          />
        )}
      </div>
    </div>
  );
}
