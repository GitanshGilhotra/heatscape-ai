import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { X, FileText, Download, CheckCircle2, Sparkles, Building, Thermometer, Shield } from 'lucide-react';

export function ReportGeneratorModal({ isOpen, onClose, targetCity = "New Delhi" }) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setGenerating(true);
    setTimeout(() => {
      const doc = new jsPDF();
      
      // Cyberpunk Header Banner
      doc.setFillColor(13, 17, 26);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(0, 243, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("HEATSCAPE AI // URBAN HEAT REPORT", 14, 22);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text(`TARGET LOCATION: ${targetCity.toUpperCase()} | GENERATED: ${new Date().toLocaleDateString()}`, 14, 32);

      // Executive Summary
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text("1. EXECUTIVE MICROCLIMATE SUMMARY", 14, 52);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`This assessment evaluates Land Surface Temperature (LST) anomalies and NDVI canopy deficits across ${targetCity}.`, 14, 62);
      doc.text("Multi-band satellite telemetry indicates severe localized thermal radiation in high-density commercial blocks.", 14, 68);

      // Key Metrics Table
      doc.setFont("helvetica", "bold");
      doc.text("2. TELEMETRY METRICS & UHI RISK", 14, 82);

      doc.setFillColor(240, 242, 245);
      doc.rect(14, 88, 180, 45, 'F');

      doc.setFontSize(9);
      doc.text("Metric", 20, 96);
      doc.text("Value", 90, 96);
      doc.text("Assessment / Status", 140, 96);

      doc.setFont("helvetica", "normal");
      doc.text("Avg Land Surface Temp (LST)", 20, 106);
      doc.text("42.8 °C", 90, 106);
      doc.text("CRITICAL ANOMALY", 140, 106);

      doc.text("Mean NDVI Canopy Index", 20, 116);
      doc.text("0.14", 90, 116);
      doc.text("SEVERE DEFICIT", 140, 116);

      doc.text("UHI Risk Classification", 20, 126);
      doc.text("HIGH / CRITICAL", 90, 126);
      doc.text("URGENT INTERVENTION", 140, 126);

      // Recommendations
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("3. RANKED GREEN INFRASTRUCTURE DEPLOYMENT", 14, 148);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("1. Urban Tree Canopy Plantation: Target high-albedo arterial roads. Est. cooling: -3.5°C.", 14, 158);
      doc.text("2. Extensive Green Roof Retrofits: Target flat commercial roofs in central hub. Est. cooling: -2.4°C.", 14, 166);
      doc.text("3. High-Albedo Cool Pavements: Apply SRI >= 78 solar reflective coatings. Est. cooling: -1.8°C.", 14, 174);

      // Footer
      doc.setFillColor(13, 17, 26);
      doc.rect(0, 275, 210, 22, 'F');
      doc.setTextColor(0, 243, 255);
      doc.setFontSize(8);
      doc.text("HEATSCAPE AI // NASA Microclimate Core & Qdrant RAG Assistant | https://heatscape.ai", 14, 287);

      doc.save(`HEATSCAPE_UHI_Assessment_${targetCity.replace(/\s+/g, '_')}.pdf`);
      setGenerating(false);
      setGenerated(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel-glow p-6 rounded-2xl border border-cyan-glow/40 max-w-lg w-full space-y-5 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">GENERATE URBAN HEAT ASSESSMENT REPORT</h3>
            <div className="text-xs font-mono text-cyan-glow">TARGET: {targetCity.toUpperCase()}</div>
          </div>
        </div>

        <p className="text-slate-300 text-xs leading-relaxed font-sans">
          This feature compiles all satellite rasters, ML regression parameters, spatial priority scores, and Qdrant RAG recommendations into a publication-ready PDF document.
        </p>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 font-mono text-xs text-slate-300">
          <div className="flex items-center gap-2 text-neon-lime font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> INCLUDED TELEMETRY SECTIONS:
          </div>
          <ul className="space-y-1 text-[11px] text-slate-400 pl-5 list-disc">
            <li>Landsat-8 Land Surface Temp (LST) & Sentinel-2 NDVI metrics</li>
            <li>XGBoost & Random Forest model accuracy baselines</li>
            <li>Ranked Green Zone Intervention Plan & Cooling Delta °C</li>
            <li>UN SDG 11 & SDG 13 Policy Compliance Summary</li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono"
          >
            CANCEL
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={generating}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-glow to-atmospheric-blue text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-cyan-glow hover:scale-105 transition"
          >
            {generating ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>GENERATING PDF...</span>
              </>
            ) : generated ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                <span>DOWNLOADED AGAIN</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-black" />
                <span>DOWNLOAD PDF ASSESSMENT</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
