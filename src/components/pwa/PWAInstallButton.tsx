import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, CheckCircle2, Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showGenericGuide, setShowGenericGuide] = useState(false);

  // If already installed in standalone mode
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200 shrink-0">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="hidden xs:inline">Instalada</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowGenericGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Instalar Xcope en tu pantalla de inicio"
        className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold bg-[#FFCC01] text-[#0A2957] rounded-xl hover:bg-[#ebd500] active:scale-95 transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
      >
        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0A2957] shrink-0" />
        <span className="hidden xs:inline">Instala Xcope</span>
        <span className="xs:hidden">Instalar</span>
      </button>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200 text-[#0B1320]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#0A2957]" />
                <h3 className="text-base font-bold text-[#0A2957]">Instalar Xcope en iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#0A2957] text-[#FFCC01] flex items-center justify-center font-bold text-xs shrink-0">1</div>
                <div>
                  <p className="font-semibold text-black">Abre Safari y pulsa el botón Compartir</p>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    Icono <Share2 className="w-3.5 h-3.5 inline text-[#0A2957]" /> en la barra inferior de navegación.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#0A2957] text-[#FFCC01] flex items-center justify-center font-bold text-xs shrink-0">2</div>
                <div>
                  <p className="font-semibold text-black">Selecciona 'Agregar a pantalla de inicio'</p>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    Desplázate hacia abajo y toca <PlusSquare className="w-3.5 h-3.5 inline text-[#0A2957]" /> <strong>Agregar a inicio</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#0A2957] text-[#FFCC01] flex items-center justify-center font-bold text-xs shrink-0">3</div>
                <div>
                  <p className="font-semibold text-black">Pulsa 'Agregar'</p>
                  <p className="text-xs text-slate-600">
                    Xcope se abrirá como app nativa rápida con acceso directo sin barras del navegador.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-[#0A2957] py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#071c3c] transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Android / Desktop Manual Guide Modal */}
      {showGenericGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200 text-[#0B1320]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-[#0A2957]" />
                <h3 className="text-base font-bold text-[#0A2957]">Instalar Xcope en tu Dispositivo</h3>
              </div>
              <button
                onClick={() => setShowGenericGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-700">
              <p className="text-xs text-slate-600">
                Puedes instalar Xcope en Android, Windows o Mac directamente desde tu navegador Chrome, Edge o Safari:
              </p>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#0A2957] text-[#FFCC01] flex items-center justify-center font-bold text-xs shrink-0">1</div>
                <div>
                  <p className="font-semibold text-black">Menú del Navegador</p>
                  <p className="text-xs text-slate-600">
                    Pulsa los 3 puntos (⋮) en la esquina superior del navegador.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#0A2957] text-[#FFCC01] flex items-center justify-center font-bold text-xs shrink-0">2</div>
                <div>
                  <p className="font-semibold text-black">Instalar Aplicación</p>
                  <p className="text-xs text-slate-600">
                    Elige <strong>"Instalar Xcope"</strong> o <strong>"Agregar a pantalla principal"</strong>.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowGenericGuide(false)}
              className="mt-5 w-full rounded-xl bg-[#0A2957] py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#071c3c] transition-colors cursor-pointer"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </>
  );
};
