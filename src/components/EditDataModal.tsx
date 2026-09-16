import React, { useState } from 'react';
import { X, RotateCcw, Check, Sparkles } from 'lucide-react';
import { InfographicData } from '../types';
import { initialInfographicData } from '../data/defaultData';

interface EditDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InfographicData;
  onSave: (newData: InfographicData) => void;
}

export function EditDataModal({ isOpen, onClose, data, onSave }: EditDataModalProps) {
  const [formData, setFormData] = useState<InfographicData>(data);

  if (!isOpen) return null;

  const handleReset = () => {
    setFormData(initialInfographicData);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#091b34] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-[#1a3a66] text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#142e54] bg-[#061326]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-lg text-white">
              Tùy chỉnh số liệu & Tiêu đề
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-sky-300/70 hover:text-white hover:bg-blue-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Section 1: Titles */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sky-300 text-xs tracking-wider uppercase">
              1. Tiêu đề đồ họa
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-sky-200/80 mb-1">
                  Tiêu đề chính
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#061326] border border-blue-900/60 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-sky-200/80 mb-1">
                  Phụ đề so sánh
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#061326] border border-blue-900/60 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Central Stat */}
          <div className="space-y-3 pt-3 border-t border-[#142e54]">
            <h4 className="font-semibold text-sky-300 text-xs tracking-wider uppercase">
              2. Số liệu trọng tâm (Tâm biểu đồ tròn)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-sky-200/80 mb-1">
                  Khách quốc tế (triệu)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.centralStat.value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      centralStat: {
                        ...formData.centralStat,
                        value: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#061326] border border-blue-900/60 rounded-lg font-semibold text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-sky-200/80 mb-1">
                  Tăng trưởng (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.centralStat.changePercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      centralStat: {
                        ...formData.centralStat,
                        changePercent: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#061326] border border-blue-900/60 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-sky-200/80 mb-1">
                  Hậu tố dòng chữ
                </label>
                <input
                  type="text"
                  value={formData.centralStat.suffix}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      centralStat: {
                        ...formData.centralStat,
                        suffix: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#061326] border border-blue-900/60 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Segments */}
          <div className="space-y-3 pt-3 border-t border-[#142e54]">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sky-300 text-xs tracking-wider uppercase">
                3. Cơ cấu thị trường (Tổng = 100%)
              </h4>
              <span className="text-xs font-semibold text-sky-300 bg-blue-950 px-2 py-0.5 rounded-full border border-blue-900">
                Tổng:{' '}
                {formData.segments
                  .reduce((acc, s) => acc + s.percentage, 0)
                  .toFixed(1)}
                %
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {formData.segments.map((seg, idx) => (
                <div key={seg.id} className="p-3 bg-[#061326] rounded-xl border border-blue-900/60">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="font-bold text-xs text-white truncate">
                      {seg.label}
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={seg.percentage}
                    onChange={(e) => {
                      const newSegments = [...formData.segments];
                      newSegments[idx] = {
                        ...newSegments[idx],
                        percentage: parseFloat(e.target.value) || 0,
                      };
                      setFormData({ ...formData, segments: newSegments });
                    }}
                    className="w-full px-2 py-1 bg-[#091b34] border border-blue-900/80 rounded text-sm font-semibold text-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Retail Section */}
          <div className="space-y-3 pt-3 border-t border-[#142e54]">
            <h4 className="font-semibold text-sky-300 text-xs tracking-wider uppercase">
              4. Tổng mức bán lẻ & doanh thu dịch vụ
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-sky-200/80 mb-1">
                  Tổng giá trị (ngàn tỷ đồng)
                </label>
                <input
                  type="number"
                  value={formData.retailSection.totalValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      retailSection: {
                        ...formData.retailSection,
                        totalValue: parseInt(e.target.value, 10) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#061326] border border-blue-900/60 rounded-lg font-semibold text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-sky-200/80 mb-1">
                  Tăng trưởng tổng (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.retailSection.totalChangePercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      retailSection: {
                        ...formData.retailSection,
                        totalChangePercent: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#061326] border border-blue-900/60 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#142e54]">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-lg text-sky-300/80 hover:text-white hover:bg-blue-900/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Khôi phục gốc
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sky-300/80 hover:text-white hover:bg-blue-900/30 font-medium text-xs transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Cập nhật & Chạy hoạt họa
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
