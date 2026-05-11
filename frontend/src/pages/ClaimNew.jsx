import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimService } from '../services/claimService';

const INSURANCE_COMPANIES = ['한화손해보험', '삼성생명', 'DB손해보험', '메리츠화재', '교보생명', '현대해상'];

export default function ClaimNew() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    patientName: '',
    birthDate: '',
    phone: '',
    hospitalName: '',
    treatmentDate: '',
    amount: '',
    insuranceCompany: '',
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = () => {
    claimService.create({
      patientName: form.patientName,
      insuranceCompany: form.insuranceCompany,
      claimDate: form.treatmentDate,
      amount: Number(form.amount),
      status: 'SENT',
    })
    .then(() => {
      alert('청구가 접수되었습니다.');
      navigate('/claims');
    })
    .catch(() => alert('청구 접수에 실패했습니다.'));
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="text-gray-600">
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900 flex-1">청구하기</h1>
        <span className="text-sm text-gray-400">{step} / 3</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
        <div
          className="bg-primary h-1.5 rounded-full transition-all"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-bold text-gray-800">환자 정보</h2>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">환자명</label>
            <input
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary"
              placeholder="환자명 입력"
              value={form.patientName}
              onChange={update('patientName')}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">생년월일</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary"
              value={form.birthDate}
              onChange={update('birthDate')}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">연락처</label>
            <input
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary"
              placeholder="010-0000-0000"
              value={form.phone}
              onChange={update('phone')}
            />
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!form.patientName}
            className="w-full bg-primary text-white py-4 rounded-2xl font-semibold disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-bold text-gray-800">병원 정보</h2>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">병원명</label>
            <input
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary"
              placeholder="병원명 입력"
              value={form.hospitalName}
              onChange={update('hospitalName')}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">진료일</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary"
              value={form.treatmentDate}
              onChange={update('treatmentDate')}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">청구 금액</label>
            <input
              type="number"
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary"
              placeholder="금액 입력 (원)"
              value={form.amount}
              onChange={update('amount')}
            />
          </div>
          <button
            onClick={() => setStep(3)}
            disabled={!form.hospitalName}
            className="w-full bg-primary text-white py-4 rounded-2xl font-semibold disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-bold text-gray-800">보험사 선택 및 제출</h2>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">보험사</label>
            <select
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary"
              value={form.insuranceCompany}
              onChange={update('insuranceCompany')}
            >
              <option value="">보험사 선택</option>
              {INSURANCE_COMPANIES.map((co) => (
                <option key={co} value={co}>{co}</option>
              ))}
            </select>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
            <p className="text-sm"><span className="text-gray-500">환자명:</span> {form.patientName}</p>
            <p className="text-sm"><span className="text-gray-500">병원명:</span> {form.hospitalName}</p>
            <p className="text-sm"><span className="text-gray-500">진료일:</span> {form.treatmentDate}</p>
            <p className="text-sm"><span className="text-gray-500">금액:</span> {Number(form.amount).toLocaleString()}원</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!form.insuranceCompany}
            className="w-full bg-primary text-white py-4 rounded-2xl font-semibold disabled:opacity-40"
          >
            청구 접수하기
          </button>
        </div>
      )}
    </div>
  );
}
