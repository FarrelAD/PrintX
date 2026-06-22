import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';

export default function OGGenerator() {
  const ogRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Rendering...');

  useEffect(() => {
    const generateAndSend = async () => {
      if (!ogRef.current) return;

      try {
        await document.fonts.ready;
        // Wait 2 full seconds to ensure any network fonts or background renders are absolutely done
        await new Promise((r) => setTimeout(r, 2000));

        setStatus('Capturing...');

        const canvas = await html2canvas(ogRef.current, {
          scale: 1,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#f3f4f6', // Tailwind gray-100
        });

        setStatus('Sending...');
        const base64 = canvas.toDataURL('image/png');

        const response = await fetch('http://localhost:9999', {
          method: 'POST',
          body: base64,
        });

        if (response.ok) {
          setStatus('Done! Image saved to public/og-image.png');
        } else {
          setStatus('Failed to send image to server.');
        }
      } catch (err) {
        console.error(err);
        setStatus('Error: ' + err);
      }
    };

    generateAndSend();
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="mb-4 font-mono font-bold text-xl">{status}</div>

      {/* 1200x630 container */}
      <div
        ref={ogRef}
        className="bg-gray-100 flex flex-col items-center justify-center relative"
        style={{ width: '1200px', height: '630px' }}
      >
        <div
          className="flex flex-col items-center justify-center w-full max-w-[900px] text-center bg-white"
          style={{
            border: '4px solid black',
            padding: '64px',
            boxShadow: '24px 24px 0px 0px rgba(0,0,0,1)',
          }}
        >
          <div className="flex items-center gap-6 mb-8">
            <svg
              width="80"
              height="80"
              viewBox="0 -960 960 960"
              fill="currentColor"
            >
              <path d="M640-640v-160H320v160h-80v-240h480v240h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85 34.5t35 85.5v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-480H200q-17 0-28.5 11.5T160-440v160h80v-80h480v80h80Z" />
            </svg>
            <h1
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: '120px',
                lineHeight: '1',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              PRINTX
            </h1>
          </div>

          <p
            style={{
              color: '#4b5563',
              fontSize: '30px',
              marginBottom: '48px',
              maxWidth: '700px',
              lineHeight: '1.3',
              fontWeight: 500,
            }}
          >
            Ubah Spreadsheet Anda Menjadi Dokumen Siap Cetak
          </p>

          <div className="flex gap-6">
            <div
              style={{
                backgroundColor: 'black',
                color: 'white',
                padding: '16px 32px',
                fontSize: '20px',
                fontWeight: 'bold',
                border: '2px solid black',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Cetak Massal
            </div>
            <div
              className="flex items-center gap-3"
              style={{
                backgroundColor: 'white',
                color: 'black',
                padding: '16px 32px',
                fontSize: '20px',
                fontWeight: 'bold',
                border: '2px solid black',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 -960 960 960"
                fill="currentColor"
              >
                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" />
              </svg>
              100% Berjalan Lokal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
