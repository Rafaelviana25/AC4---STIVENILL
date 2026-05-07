import React, { useRef, useState } from 'react';
import { WorkRecord } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { Device } from '@capacitor/device';

interface ProfileTabProps {
  userPrefix: string;
  onRestore: (data: any) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
  monthlyRecords: WorkRecord[];
}

const ProfileTab: React.FC<ProfileTabProps> = ({ userPrefix, onRestore, onShowToast, monthlyRecords }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showBackupMenu, setShowBackupMenu] = useState(false);
  const [userName] = useState(localStorage.getItem('ac4_user_name') || '');
  const [showReportsMenu, setShowReportsMenu] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showYearDrawer, setShowYearDrawer] = useState(false);

  const availableYears = Array.from(
    new Set(monthlyRecords.map(r => new Date(r.date).getFullYear()))
  ).sort((a: number, b: number) => b - a);

  const handleExportBackup = () => {
    const backupData = {
      monthly_records: localStorage.getItem(userPrefix + 'monthly_records'),
      draft_records: localStorage.getItem(userPrefix + 'draft_records'),
      fav_bg_colors: localStorage.getItem(userPrefix + 'fav_bg_colors'),
      fav_text_colors: localStorage.getItem(userPrefix + 'fav_text_colors'),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_ac4_stivenill_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('Backup exportado com sucesso!', 'success');
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (!data.monthly_records && !data.draft_records) {
          throw new Error('Arquivo de backup inválido');
        }

        onRestore(data);
        onShowToast('Backup restaurado com sucesso!', 'success');
        setShowBackupMenu(false);
      } catch (err) {
        onShowToast('Erro ao importar backup: Arquivo inválido', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const generateAnnualReport = async () => {
    const yearRecords = monthlyRecords.filter(r => new Date(r.date).getFullYear() === selectedYear)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (yearRecords.length === 0) {
      onShowToast(`Nenhum registro encontrado para o ano ${selectedYear}`, 'info');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    // Branding Header (Top Bar)
    doc.setFillColor(15, 23, 42); // Dark Slate
    doc.rect(0, 0, pageWidth, 15, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    
    // "AC4" in Fluorescent Green
    doc.setTextColor(163, 230, 53);
    doc.text('AC4', 20, 10);
    
    // "STIVENILL" in White
    doc.setTextColor(255, 255, 255);
    doc.text('STIVENILL', 32, 10);

    // Main Title
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.setFont('helvetica', 'bold');
    doc.text('RELATÓRIO ANUAL DE EXTRAS', pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Ano de Referência: ${selectedYear}`, pageWidth / 2, 37, { align: 'center' });

    // Annual Summary Stats
    const totalHours = yearRecords.reduce((sum, r) => sum + r.duration, 0);
    const totalValue = yearRecords.reduce((sum, r) => sum + r.value, 0);
    
    const getStats = (records: WorkRecord[]) => {
      let redScaleDiurnoHours = 0;
      let redScaleDiurnoValue = 0;
      let redScaleNoturnoHours = 0;
      let redScaleNoturnoValue = 0;
      let blueScaleDiurnoHours = 0;
      let blueScaleDiurnoValue = 0;
      let blueScaleNoturnoHours = 0;
      let blueScaleNoturnoValue = 0;

      records.forEach(r => {
        let currentDateTime = new Date(r.date + 'T' + r.startHour);
        
        for (let i = 0; i < r.duration; i++) {
          const hour = currentDateTime.getHours();
          const dayOfWeek = currentDateTime.getDay();
          const isNight = (hour >= 22 || hour <= 4);
          
          let operationalDay;
          if (isNight && hour <= 4) {
            const tempDate = new Date(currentDateTime);
            tempDate.setDate(tempDate.getDate() - 1);
            operationalDay = tempDate.getDay();
          } else {
            operationalDay = dayOfWeek;
          }

          const isRedScale = (operationalDay === 5 || operationalDay === 6 || operationalDay === 0);
          const rate = isRedScale ? (isNight ? 41.38 : 36.41) : (isNight ? 29.80 : 26.47);
          
          if (isRedScale) {
            if (isNight) {
              redScaleNoturnoHours += 1;
              redScaleNoturnoValue += rate;
            } else {
              redScaleDiurnoHours += 1;
              redScaleDiurnoValue += rate;
            }
          } else {
            if (isNight) {
              blueScaleNoturnoHours += 1;
              blueScaleNoturnoValue += rate;
            } else {
              blueScaleDiurnoHours += 1;
              blueScaleDiurnoValue += rate;
            }
          }
          
          currentDateTime.setHours(currentDateTime.getHours() + 1);
        }
      });

      return {
        red: {
          dayHours: redScaleDiurnoHours,
          dayValue: redScaleDiurnoValue,
          nightHours: redScaleNoturnoHours,
          nightValue: redScaleNoturnoValue,
          totalHours: redScaleDiurnoHours + redScaleNoturnoHours,
          totalValue: redScaleDiurnoValue + redScaleNoturnoValue
        },
        blue: {
          dayHours: blueScaleDiurnoHours,
          dayValue: blueScaleDiurnoValue,
          nightHours: blueScaleNoturnoHours,
          nightValue: blueScaleNoturnoValue,
          totalHours: blueScaleDiurnoHours + blueScaleNoturnoHours,
          totalValue: blueScaleDiurnoValue + blueScaleNoturnoValue
        }
      };
    };

    const annualStats = getStats(yearRecords);

    // Helper to draw stats box
    const drawStatsBox = (x: number, y: number, width: number, height: number, title: string, stats: any, color: [number, number, number]) => {
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, y, width, height, 3, 3, 'D');
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(title, x + 5, y + 7);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40);
      doc.text(`Diurno: ${stats.dayHours}H (R$ ${stats.dayValue.toFixed(2)})`, x + 5, y + 14);
      doc.text(`Noturno: ${stats.nightHours}H (R$ ${stats.nightValue.toFixed(2)})`, x + 5, y + 20);
    };

    // Left Side Header Info
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(`Usuário: ${userName.toUpperCase()}`, 20, 50);
    doc.text(`Total de Horas Anuais: ${totalHours.toFixed(1)}H`, 20, 57);
    doc.text(`Valor Total Anual: R$ ${totalValue.toFixed(2)}`, 20, 64);

    // Right Side Header Info - Boxes
    const boxWidth = (pageWidth - 110) / 2;
    const boxHeight = 25;
    drawStatsBox(pageWidth - (boxWidth * 2) - 25, 45, boxWidth, boxHeight, 'ESCALA VERMELHA', annualStats.red, [239, 68, 68]);
    drawStatsBox(pageWidth - boxWidth - 20, 45, boxWidth, boxHeight, 'ESCALA AZUL', annualStats.blue, [59, 130, 246]);

    let currentY = 85;

    // Group by month
    for (let m = 0; m < 12; m++) {
      const monthRecords = yearRecords.filter(r => new Date(r.date).getMonth() === m);
      
      if (monthRecords.length === 0) continue;

      // Check if we need a new page
      if (currentY > 220) {
        doc.addPage();
        currentY = 20;
      }

      // Month Header
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(monthNames[m].toUpperCase(), 20, currentY);
      currentY += 5;

      const tableRows = monthRecords.map(r => {
        const date = new Date(r.date);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        const startH = parseInt(r.startHour.split(':')[0]);
        const isNight = startH >= 18 || startH < 6;

        return [
          formattedDate,
          r.weekday,
          `${r.startHour} - ${r.endHour}`,
          `${r.duration}h`,
          isNight ? 'Noturno' : 'Diurno',
          r.raiNumber || '-',
          `R$ ${r.value.toFixed(2)}`
        ];
      });

      autoTable(doc, {
        startY: currentY,
        head: [['Data', 'Dia', 'Horário', 'Duração', 'Período', 'RAI', 'Valor']],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 2 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 20, right: 20 },
      });

      currentY = (doc as any).lastAutoTable.finalY + 10;

      // Monthly Summary Below Table - Boxes
      const mStats = getStats(monthRecords);
      const mTotalValue = monthRecords.reduce((sum, r) => sum + r.value, 0);
      const mTotalHours = monthRecords.reduce((sum, r) => sum + r.duration, 0);

      doc.setFontSize(9);
      doc.setTextColor(40);
      doc.setFont('helvetica', 'bold');
      doc.text(`VALOR TOTAL EM (R$): R$ ${mTotalValue.toFixed(2)}`, 20, currentY);
      
      currentY += 5;
      
      const mBoxWidth = (pageWidth - 50) / 2;
      drawStatsBox(20, currentY, mBoxWidth, boxHeight, 'ESCALA VERMELHA', mStats.red, [239, 68, 68]);
      drawStatsBox(25 + mBoxWidth, currentY, mBoxWidth, boxHeight, 'ESCALA AZUL', mStats.blue, [59, 130, 246]);
      
      currentY += boxHeight + 10;

      // Final Monthly Sum
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`SOMA FINAL DO MÊS: R$ ${mTotalValue.toFixed(2)} | TOTAL DE HORAS: ${mTotalHours.toFixed(1)}H`, 20, currentY);
      
      currentY += 20;
    }

    // Footer on the last page
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, 20, 285);
    doc.text('AC4 - STIVENILL - Gestão de Escalas', pageWidth - 20, 285, { align: 'right' });

    const fileName = `Relatorio_Anual_${selectedYear}_${userName.replace(/\s+/g, '_')}.pdf`;

    try {
      const info = await Device.getInfo();
      if (info.platform === 'web') {
        doc.save(fileName);
        onShowToast('Relatório gerado com sucesso!', 'success');
      } else {
        // Capacitor Native approach
        const base64 = doc.output('datauristring').split(',')[1];
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: base64,
          directory: Directory.Documents,
        });

        await FileOpener.open({
          filePath: savedFile.uri,
          contentType: 'application/pdf',
        });
        onShowToast('Relatório aberto com sucesso!', 'success');
      }
    } catch (error) {
      console.error('Erro ao gerar/abrir PDF:', error);
      // Fallback to standard save if Capacitor fails
      try {
        doc.save(fileName);
        onShowToast('Relatório gerado!', 'success');
      } catch (e) {
        onShowToast('Erro ao gerar relatório.', 'error');
      }
    }
  };

  if (showBackupMenu) {
    return (
      <div className="flex flex-col h-[calc(100vh-180px)] animate-fade-in px-2">
        <div className="mt-2 mb-8 flex items-center gap-4">
          <button 
            onClick={() => setShowBackupMenu(false)} 
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-90 border border-white/5"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h2 className="text-xl font-black text-slate-200 uppercase tracking-tighter drop-shadow-lg">
            Backup de <span className="text-lime-400">Dados</span>
          </h2>
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-lime-500/20 flex items-center justify-center text-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.2)]">
              <i className="fas fa-database text-xl"></i>
            </div>
            <div>
              <h3 className="text-base font-black text-slate-200 uppercase tracking-tight">Sincronização</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">Gerencie seus arquivos</p>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleExportBackup}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black py-4 rounded-2xl uppercase text-xs border border-white/10 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 group"
            >
              <i className="fas fa-file-export text-lime-400 group-hover:scale-110 transition-transform"></i>
              Gerar Arquivo de Backup
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black py-4 rounded-2xl uppercase text-xs border border-white/10 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 group"
            >
              <i className="fas fa-file-import text-blue-400 group-hover:scale-110 transition-transform"></i>
              Fazer Upload de Backup
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportBackup} 
              accept=".json" 
              className="hidden" 
            />
          </div>
          
          <p className="mt-8 text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] text-center leading-relaxed px-4">
            O backup inclui histórico, configurações de cores e todas as suas personalizações.
          </p>
        </div>
      </div>
    );
  }

  if (showReportsMenu) {
    return (
      <div className="flex flex-col h-[calc(100vh-180px)] animate-fade-in px-2">
        <div className="mt-2 mb-8 flex items-center gap-4">
          <button 
            onClick={() => setShowReportsMenu(false)} 
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-90 border border-white/5"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h2 className="text-xl font-black text-slate-200 uppercase tracking-tighter drop-shadow-lg">
            Relatórios <span className="text-lime-400">Anuais</span>
          </h2>
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <i className="fas fa-file-pdf text-xl"></i>
            </div>
            <div>
              <h3 className="text-base font-black text-slate-200 uppercase tracking-tight">Exportação PDF</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">Selecione o ano desejado</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 relative">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Ano do Relatório</label>
              <button 
                onClick={() => setShowYearDrawer(!showYearDrawer)}
                className="w-full bg-slate-800 text-slate-200 font-black py-4 px-5 rounded-2xl flex items-center justify-between border border-white/10 transition-all active:scale-95 shadow-lg"
              >
                <span className="text-sm tracking-tight">{selectedYear}</span>
                <i className={`fas fa-chevron-${showYearDrawer ? 'up' : 'down'} text-lime-400 text-[10px] transition-transform duration-300`}></i>
              </button>
              
              {showYearDrawer && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                  <div className="max-h-48 overflow-y-auto py-2">
                    {[...availableYears, new Date().getFullYear()].filter((v, i, a) => a.indexOf(v) === i).sort((a: number, b: number) => b - a).map(year => (
                      <button
                        key={year}
                        onClick={() => {
                          setSelectedYear(year);
                          setShowYearDrawer(false);
                        }}
                        className={`w-full text-left px-6 py-4 font-black text-xs transition-colors flex items-center justify-between ${
                          selectedYear === year 
                            ? 'bg-lime-500 text-slate-900' 
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span>{year}</span>
                        {selectedYear === year && <i className="fas fa-check text-[10px]"></i>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={generateAnnualReport}
              className="w-full bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-400 hover:to-green-500 text-slate-900 font-black py-4 rounded-2xl uppercase text-xs transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 group"
            >
              <i className="fas fa-download group-hover:bounce transition-transform"></i>
              Gerar Relatório Completo
            </button>
          </div>
          
          <p className="mt-8 text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] text-center leading-relaxed px-4">
            O relatório detalha horas, valores, escalas (Vermelha/Azul), períodos e números de RAI.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] animate-fade-in px-2 overflow-y-auto scrollbar-hide pb-4">
      <div className="mt-2 mb-6 flex-shrink-0">
        <div className="flex items-center space-x-3 mb-3">
          <div className="h-6 w-1 bg-gradient-to-b from-lime-400 to-green-600 rounded-full shadow-[0_0_15px_rgba(163,230,53,0.5)]"></div>
          <h2 className="text-xl font-black text-slate-200 uppercase tracking-tighter drop-shadow-lg">
            Perfil do <span className="text-lime-400">Usuário</span>
          </h2>
        </div>
        {userName && (
          <div className="pl-4">
            <h3 className="text-xl font-black text-slate-100 uppercase tracking-tight">
              {userName}
            </h3>
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-3">
        <button 
          onClick={() => setShowReportsMenu(true)}
          className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-slate-800/50 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <i className="fas fa-file-invoice"></i>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-black text-slate-200 uppercase tracking-tight">Relatórios Anuais</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Gere PDFs detalhados por ano</p>
            </div>
          </div>
          <i className="fas fa-chevron-right text-slate-600 group-hover:text-blue-400 transition-colors"></i>
        </button>

        <button 
          onClick={() => setShowBackupMenu(true)}
          className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-slate-800/50 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center text-lime-400 group-hover:bg-lime-500/20 transition-colors">
              <i className="fas fa-database"></i>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-black text-slate-200 uppercase tracking-tight">Backup de Dados</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Sincronize suas configurações</p>
            </div>
          </div>
          <i className="fas fa-chevron-right text-slate-600 group-hover:text-lime-400 transition-colors"></i>
        </button>

        <div className="mt-4 flex flex-col items-center space-y-4 pt-4 border-t border-white/5">
          <div className="flex flex-col items-center gap-2 mb-2 w-full">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center px-4">
              AJUDE-NOS A MELHORAR O APP, CONTRIBUA!
            </span>
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-lime-500/30 to-transparent"></div>
          </div>
          
          <div className="bg-white p-3 rounded-3xl shadow-2xl w-32 h-32 flex items-center justify-center ring-4 ring-lime-500/10">
            <img 
              src="/qrcode-pix.png" 
              alt="QR Code Pix" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <button 
            onClick={() => {
              navigator.clipboard.writeText('00020126740014br.gov.bcb.pix013613d60d20-3d4f-4d74-a7b6-b2cfcf8c939f0212AC4STIVENILL5204000053039865802BR5914GERADOR DE PIX6009SAO PAULO62070503***6304104A');
              onShowToast('Chave Pix copiada!', 'success');
            }}
            className="flex flex-col items-center group active:scale-95 transition-all w-full max-w-[280px]"
          >
            <div className="bg-slate-900 border border-white/5 px-4 py-3 rounded-2xl flex flex-col items-center gap-4 w-full group-hover:border-lime-500/50 transition-all shadow-xl">
              <div className="flex flex-col items-center w-full text-center">
                <span className="text-[8px] font-black text-lime-500 uppercase tracking-widest mb-2">Pix Copia e Cola</span>
                <span className="text-[9px] font-mono text-slate-400 break-all leading-relaxed">
                  00020126740014br.gov.bcb.pix013613d60d20-3d4f-4d74-a7b6-b2cfcf8c939f0212AC4STIVENILL5204000053039865802BR5914GERADOR DE PIX6009SAO PAULO62070503***6304104A
                </span>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center text-lime-400 group-hover:bg-lime-500 group-hover:text-slate-900 transition-all shadow-inner">
                <i className="fas fa-copy text-sm"></i>
              </div>
            </div>
            <span className="mt-2 text-[8px] font-bold text-slate-600 uppercase tracking-widest group-hover:text-lime-500/70 transition-colors">Clique para copiar o código</span>
          </button>
        </div>
      </div>

      <div className="mt-10 pb-6 text-center">
        <a 
          href="https://ac4stivenill.vercel.app" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-lime-400 transition-colors"
        >
          ACESSO WEB: https://ac4stivenill.vercel.app
        </a>
      </div>
    </div>
  );
};

export default ProfileTab;
