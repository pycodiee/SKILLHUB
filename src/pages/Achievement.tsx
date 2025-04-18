import React from 'react';
import { X, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface AchievementProps {
  onClose: () => void;
}

const Achievement: React.FC<AchievementProps> = ({ onClose }) => {
  const certificateRef = React.useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (certificateRef.current) {
      const canvas = await html2canvas(certificateRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('duck-savior-certificate.pdf');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] p-8 rounded-lg max-w-2xl w-full relative">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Download size={20} />
            Download Certificate
          </button>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <div ref={certificateRef} className="certificate-container animate-fadeIn">
          <div className="relative border-8 border-[#C5A572] p-8 bg-[#FFF9E6] rounded-lg">
            <img 
              src="/achieve.gif" 
              alt="Achievement Animation" 
              className="absolute top-0 left-0 w-full h-full object-cover opacity-25"
            />
            
            <div className="text-center relative z-10">
              <h1 className="text-4xl font-serif text-[#C5A572] mb-6">Certificate of Achievement</h1>
              <p className="text-xl mb-4 text-[#4A4A4A]">This certifies that</p>
              <p className="text-3xl font-bold mb-4 text-[#C5A572]">Code Master</p>
              <p className="text-xl mb-8 text-[#4A4A4A]">has successfully completed all challenges and earned the title of</p>
              <p className="text-3xl font-bold text-[#C5A572] mb-8">Duck Savior Supreme</p>
              
              <div className="flex justify-between items-center mt-12">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-2 bg-[#C5A572] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">SEAL</span>
                  </div>
                  <p className="text-sm text-[#4A4A4A]">Official Seal</p>
                </div>
                <div className="text-center">
                  <p className="italic mb-2 text-[#4A4A4A]">{new Date().toLocaleDateString()}</p>
                  <div className="w-32 h-12 mx-auto mb-2 border-b border-[#4A4A4A]"></div>
                  <p className="text-sm text-[#4A4A4A]">Program Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievement;