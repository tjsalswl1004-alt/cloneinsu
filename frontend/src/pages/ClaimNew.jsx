import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { claimService } from '../services/claimService';


function SectionCard({ iconBg, iconColor, icon: Icon, title, badge, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: iconBg }}>
          <Icon size={18} color={iconColor} />
        </div>
        <span className="font-bold text-sm text-gray-900 dark:text-white">{title}</span>
        {badge && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ ...props }) {
  return (
    <input
      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 dark:bg-gray-800 outline-none focus:border-primary"
      {...props}
    />
  );
}

function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="flex rounded-xl border border-gray-200 overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            value === opt ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-500'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// SVG icon components
const PersonIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const PersonOutlineIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const HospitalIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="9" width="18" height="13" rx="1"/><path d="M3 10l9-7 9 7"/>
    <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);
const CardIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const PenIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);
const PaperclipIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
  </svg>
);
const UploadIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);

export default function ClaimNew() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const companyId = searchParams.get('companyId') ?? '';
  const companyName = searchParams.get('companyName') ?? '';

  const [form, setForm] = useState({
    patientName: '',
    idFront: '',
    idBack: '',
    phone: '',
    sameAsInsured: '예 (동일인)',
    accidentType: '질병',
    accidentYear: '',
    accidentMonth: '',
    accidentDay: '',
    accidentDetail: '',
    accountType: '기지급계좌',
    signMethod: '대면 서명',
    insuranceCompanyId: companyId ? Number(companyId) : null,
    insuranceCompanyName: companyName,
    amount: '',
    autoInsuranceClaimed: '아니오',
    autoInsuranceCompany: '',
    ownVehicleInsurance: '',
    vehiclePlateNumber: '',
    bankName: '',
    accountNumber: '',
    accountHolder: '',
  });
  const [files, setFiles] = useState([]);
  const [isSigned, setIsSigned] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const lastPos = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!editId) return;
    claimService.getById(editId).then((data) => {
      const parts = data.accidentDate ? data.accidentDate.split('-') : ['', '', ''];
      setForm((prev) => ({
        ...prev,
        patientName: data.customer?.name ?? '',
        idFront: data.customer?.idFront ?? '',
        idBack: data.customer?.idBack ?? '',
        phone: data.customer?.phone ?? '',
        sameAsInsured: data.sameAsInsured === false ? '아니오' : '예 (동일인)',
        accidentType: data.accidentType ?? '질병',
        accidentDetail: data.accidentDetail ?? '',
        accountType: data.account?.accountType ?? '기지급계좌',
        bankName: data.account?.bankName ?? '',
        accountNumber: data.account?.accountNumber ?? '',
        accountHolder: data.account?.accountHolder ?? '',
        signMethod: data.signature?.signMethod ?? '대면 서명',
        _signatureData: data.signature?.signatureData ?? null,
        hospitalName: data.hospitalName ?? '',
        insuranceCompanyId: data.insuranceCompany?.id ?? null,
        insuranceCompanyName: data.insuranceCompany?.name ?? '',
        amount: data.amount != null ? String(data.amount) : '',
        accidentYear: parts[0] ?? '',
        accidentMonth: parts[1] ? String(parseInt(parts[1])) : '',
        accidentDay: parts[2] ? String(parseInt(parts[2])) : '',
        autoInsuranceClaimed: data.autoInsuranceClaimed === true ? '예' : '아니오',
        autoInsuranceCompany: data.autoInsuranceCompany ?? '',
        ownVehicleInsurance: data.ownVehicleInsurance ?? '',
        vehiclePlateNumber: data.vehiclePlateNumber ?? '',
      }));
    }).catch(console.error);
  }, [editId]);

  // 서명 이미지 복원
  useEffect(() => {
    if (!form._signatureData || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      canvasRef.current.getContext('2d').drawImage(img, 0, 0);
      setIsSigned(true);
    };
    img.src = form._signatureData;
  }, [form._signatureData]);

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0,3)}-${digits.slice(3)}`;
    return `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7)}`;
  };

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setVal = (field) => (val) => setForm((prev) => ({ ...prev, [field]: val }));

  // Canvas drawing
  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const startDraw = useCallback((e) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    lastPos.current = getPos(e, canvas);
  }, []);

  const draw = useCallback((e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
    lastPos.current = pos;
    setIsSigned(true);
  }, [isDrawing]);

  const endDraw = useCallback(() => setIsDrawing(false), []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setIsSigned(false);
  };

  // File upload
  const addFiles = (newFiles) => {
    setFiles((prev) => [...prev, ...Array.from(newFiles)]);
  };
  const removeFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));
  const onDrop = (e) => { e.preventDefault(); addFiles(e.dataTransfer.files); };

  const buildPayload = (status) => ({
    patientName: form.patientName,
    idFront: form.idFront || null,
    idBack: form.idBack || null,
    phone: form.phone || null,
    sameAsInsured: form.sameAsInsured === '예 (동일인)',
    insuranceCompanyId: form.insuranceCompanyId || null,
    accidentType: form.accidentType || null,
    accidentDate: form.accidentYear && form.accidentMonth && form.accidentDay
      ? `${form.accidentYear}-${String(form.accidentMonth).padStart(2,'0')}-${String(form.accidentDay).padStart(2,'0')}`
      : null,
    accidentDetail: form.accidentDetail || null,
    autoInsuranceClaimed: form.accidentType === '교통사고' ? form.autoInsuranceClaimed === '예' : null,
    autoInsuranceCompany: form.autoInsuranceCompany || null,
    ownVehicleInsurance: form.ownVehicleInsurance || null,
    vehiclePlateNumber: form.vehiclePlateNumber || null,
    hospitalName: form.hospitalName || null,
    accountType: form.accountType || null,
    bankName: form.bankName || null,
    accountNumber: form.accountNumber || null,
    accountHolder: form.accountHolder || null,
    signMethod: form.signMethod || null,
    signatureData: form.signMethod === '대면 서명' && isSigned && canvasRef.current
      ? canvasRef.current.toDataURL() : null,
    amount: form.amount ? Number(form.amount) : null,
    status,
  });

  const handleDraft = () => {
    const action = editId
      ? claimService.update(editId, buildPayload('DRAFT'))
      : claimService.create(buildPayload('DRAFT'));
    action.then(() => { alert('임시저장되었습니다.'); navigate('/claims'); }).catch(console.error);
  };

  const handleSubmit = () => {
    const action = editId
      ? claimService.update(editId, buildPayload('SENT'))
      : claimService.create(buildPayload('SENT'));
    action.then(() => { alert('청구서가 제출되었습니다.'); navigate('/claims'); }).catch(console.error);
  };

  const headerCompanyName = form.insuranceCompanyName || (editId ? '청구하기' : '청구하기');

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#F7F8FC' }}>
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 px-4 py-3 relative flex items-center justify-center">
        <button onClick={() => navigate(-1)} className="absolute left-4 text-gray-500 text-2xl font-light leading-none">‹</button>
        <h1 className="text-base font-bold text-gray-900 dark:text-white">{headerCompanyName}</h1>
      </div>

      <div className="p-4 space-y-3">
        {/* 피보험자 정보 */}
        <SectionCard iconBg="#EEF2FF" iconColor="#4F6EF7" icon={PersonIcon} title="피보험자 정보">
          <Field label="이름" required>
            <Input placeholder="이름 입력" value={form.patientName} onChange={set('patientName')} />
          </Field>
          <Field label="주민등록번호" required>
            <div className="flex items-center gap-2">
              <Input placeholder="앞 6자리" maxLength={6} value={form.idFront} onChange={set('idFront')} />
              <span className="text-gray-400">-</span>
              <Input type="password" placeholder="뒤 7자리" maxLength={7} value={form.idBack} onChange={set('idBack')} />
            </div>
          </Field>
          <Field label="연락처" required>
            <Input
              placeholder="010-0000-0000"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))}
              inputMode="numeric"
            />
          </Field>
        </SectionCard>

        {/* 계약자 */}
        <SectionCard iconBg="#ECFDF5" iconColor="#10B981" icon={PersonOutlineIcon} title="계약자">
          <Field label="계약자와 피보험자 동일여부" required>
            <ToggleGroup options={['예 (동일인)', '아니오']} value={form.sameAsInsured} onChange={setVal('sameAsInsured')} />
          </Field>
        </SectionCard>

        {/* 진료정보 */}
        <SectionCard iconBg="#FFF1F0" iconColor="#EF4444" icon={HospitalIcon} title="진료정보">
          <Field label="사고 유형" required>
            <ToggleGroup options={['질병', '상해', '교통사고']} value={form.accidentType} onChange={setVal('accidentType')} />
          </Field>
          <Field label="진료(사고)일자" required>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input placeholder="2026" maxLength={4} value={form.accidentYear} onChange={set('accidentYear')} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">년</span>
              </div>
              <div className="relative flex-1">
                <Input placeholder="10" maxLength={2} value={form.accidentMonth} onChange={set('accidentMonth')} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">월</span>
              </div>
              <div className="relative flex-1">
                <Input placeholder="10" maxLength={2} value={form.accidentDay} onChange={set('accidentDay')} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">일</span>
              </div>
            </div>
          </Field>
          <Field label="질병/사고내용" required>
            <Input placeholder="내용 입력" value={form.accidentDetail} onChange={set('accidentDetail')} />
          </Field>
          {form.accidentType === '교통사고' && (
            <>
              <Field label="자동차보험 처리여부" required>
                <ToggleGroup options={['예', '아니오']} value={form.autoInsuranceClaimed} onChange={setVal('autoInsuranceClaimed')} />
              </Field>
              {form.autoInsuranceClaimed === '예' && (
                <>
                  <Field label="담당 보험사" required>
                    <Input placeholder="담당 보험사 입력" value={form.autoInsuranceCompany} onChange={set('autoInsuranceCompany')} />
                  </Field>
                  <Field label="본인 차량보험" required>
                    <Input placeholder="본인 차량보험 입력" value={form.ownVehicleInsurance} onChange={set('ownVehicleInsurance')} />
                  </Field>
                </>
              )}
              {form.autoInsuranceClaimed === '아니오' && (
                <Field label="본인 차량번호" required>
                  <Input placeholder="ex) 12가9876" value={form.vehiclePlateNumber} onChange={set('vehiclePlateNumber')} />
                </Field>
              )}
            </>
          )}
        </SectionCard>

        {/* 계좌정보 */}
        <SectionCard iconBg="#FFF7ED" iconColor="#F97316" icon={CardIcon} title="계좌정보">
          <Field label="계좌 유형" required>
            <ToggleGroup options={['기지급계좌', '일반']} value={form.accountType} onChange={setVal('accountType')} />
          </Field>
          {form.accountType === '일반' && (
            <>
              <Field label="은행" required>
                <div className="relative">
                  <select
                    value={form.bankName}
                    onChange={set('bankName')}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 dark:bg-gray-800 outline-none focus:border-primary appearance-none bg-white"
                  >
                    <option value="">은행 선택</option>
                    {['KB국민은행','신한은행','우리은행','하나은행','농협은행','IBK기업은행','SC제일은행','씨티은행','카카오뱅크','케이뱅크','토스뱅크','대구은행','부산은행','광주은행','전북은행','경남은행','제주은행','우체국'].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </Field>
              <Field label="계좌번호" required>
                <Input placeholder="숫자만 입력 (- 없이)" value={form.accountNumber} onChange={(e) => setForm((p) => ({ ...p, accountNumber: e.target.value.replace(/\D/g, '') }))} inputMode="numeric" />
              </Field>
              <Field label="예금주" required>
                <Input placeholder="홍길동" value={form.accountHolder} onChange={set('accountHolder')} />
              </Field>
            </>
          )}
        </SectionCard>

        {/* 서명 */}
        <SectionCard iconBg="#F5F3FF" iconColor="#8B5CF6" icon={PenIcon} title="서명" badge={isSigned ? '서명 완료' : null}>
          <Field label="서명 방식" required>
            <ToggleGroup options={['대면 서명', '비대면 서명']} value={form.signMethod} onChange={setVal('signMethod')} />
          </Field>
          {form.signMethod === '대면 서명' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-gray-700 dark:text-gray-300">서명란</span>
                <button type="button" onClick={clearCanvas} className="text-xs text-gray-400 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
                  다시 서명
                </button>
              </div>
              <canvas
                ref={canvasRef}
                width={340}
                height={160}
                className="w-full border border-gray-200 rounded-xl bg-white touch-none"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
              />
            </div>
          )}
        </SectionCard>

        {/* 첨부서류 */}
        <SectionCard iconBg="#F0FDFA" iconColor="#14B8A6" icon={PaperclipIcon} title="첨부서류" badge={files.length > 0 ? `${files.length}개` : null}>
          {/* 드래그 업로드 영역 */}
          <div
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            <UploadIcon size={32} color="#9CA3AF" />
            <p className="font-semibold text-sm text-gray-700">파일을 드래그</p>
            <p className="text-xs text-gray-400">JPG, PNG, PDF (최대 50MB)</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg"
            >
              파일 선택
            </button>
            <input ref={fileInputRef} type="file" multiple accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => addFiles(e.target.files)} />
          </div>

          {/* 업로드된 파일 목록 */}
          {files.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">업로드된 파일</p>
              <div className="space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F6EF7" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{f.name}</p>
                      <p className="text-xs text-gray-400">{(f.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button onClick={() => removeFile(i)} className="text-gray-400 text-base leading-none">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 필수 제출 서류 */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 space-y-1">
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">필수 제출 서류</p>
            {['진단서 또는 소견서', '진료비 영수증 및 세부내역서', '통장 사본 (신규 계좌 시)'].map((item) => (
              <div key={item} className="flex items-start gap-2 text-xs text-gray-500">
                <span className="text-primary mt-0.5">●</span>
                {item}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2">
          <button className="px-4 py-3 border border-gray-200 bg-white rounded-xl text-sm font-semibold text-gray-600 whitespace-nowrap">
            미리보기
          </button>
          <button onClick={handleDraft} className="px-4 py-3 border border-gray-200 bg-white rounded-xl text-sm font-semibold text-gray-600 whitespace-nowrap">
            임시저장
          </button>
          <button onClick={handleSubmit} className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold">
            청구서 제출
          </button>
        </div>
    </div>
  );
}
