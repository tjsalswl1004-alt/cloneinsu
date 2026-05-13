import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const GENERATIONS = [
  { id: 'gen1',    label: '1세대',                       sub: '~2009.09' },
  { id: 'gen2a',   label: '2세대 (급여90%)',              sub: '2009.10~2013.03' },
  { id: 'gen2b',   label: '2세대 (급여90% / 비급여80%)',   sub: '2013.04~2017.03' },
  { id: 'gen3',    label: '3세대',                       sub: '2017.04~2021.06' },
  { id: 'gen4',    label: '4세대',                       sub: '2021.07~' },
  { id: 'genSick', label: '유병자실손',                   sub: '' },
];

const GEN_CONFIG = {
  gen1: {
    limits: [
      { label: '10만원', out: 100000, rx: 0 },
      { label: '30만원', out: 300000, rx: 0 },
      { label: '50만원', out: 500000, rx: 0 },
    ],
    outDed: { '병·의원': 5000, '종합병원': 5000, '상급종합병원': 5000 },
    rxDed: 0, covRate: 0.9, uncovRate: 0.9,
    showRx: false, showGrade: false, showNc3: false, nc3Ded: 0, nc3Rate: 0, isGenSick: false,
  },
  gen2a: {
    limits: [{ label: '외래 20만원 / 약제 10만원', out: 200000, rx: 100000 }, { label: '외래 30만원 / 약제 10만원', out: 300000, rx: 100000 }],
    outDed: { '병·의원': 10000, '종합병원': 15000, '상급종합병원': 20000 },
    rxDed: 8000, covRate: 0.9, uncovRate: 0.9,
    showRx: true, showGrade: true, showNc3: false, nc3Ded: 0, nc3Rate: 0, isGenSick: false,
  },
  gen2b: {
    limits: [{ label: '외래 20만원 / 약제 10만원', out: 200000, rx: 100000 }, { label: '외래 30만원 / 약제 10만원', out: 300000, rx: 100000 }],
    outDed: { '병·의원': 10000, '종합병원': 15000, '상급종합병원': 20000 },
    rxDed: 8000, covRate: 0.9, uncovRate: 0.8,
    showRx: true, showGrade: true, showNc3: false, nc3Ded: 0, nc3Rate: 0, isGenSick: false,
  },
  gen3: {
    limits: [{ label: '외래 20만원 / 약제 10만원', out: 200000, rx: 100000 }, { label: '외래 30만원 / 약제 10만원', out: 300000, rx: 100000 }],
    outDed: { '병·의원': 10000, '종합병원': 15000, '상급종합병원': 20000 },
    rxDed: 8000, covRate: 0.8, uncovRate: 0.3,
    showRx: true, showGrade: true, showNc3: true, nc3Ded: 20000, nc3Rate: 0.3, isGenSick: false,
  },
  gen4: {
    limits: [{ label: '20만원(외래+약제)', out: 200000, rx: 0 }, { label: '30만원(외래+약제)', out: 300000, rx: 0 }],
    outDed: { '병·의원': 10000, '종합병원': 15000, '상급종합병원': 20000 },
    rxDed: 0, covRate: 0.8, uncovRate: 0.3,
    showRx: false, showGrade: true, showNc3: true, nc3Ded: 30000, nc3Rate: 0.3, isGenSick: false,
  },
  genSick: {
    limits: [{ label: '20만원', out: 200000, rx: 0 }],
    outDed: { '병·의원': 20000, '종합병원': 30000, '상급종합병원': 40000 },
    rxDed: 0, covRate: 0.8, uncovRate: 0.3,
    showRx: false, showGrade: true, showNc3: false, nc3Ded: 0, nc3Rate: 0, isGenSick: true,
  },
};

const HOSPITAL_GRADES = ['병·의원', '종합병원', '상급종합병원'];
const ROOM_TYPES = ['기준병실', '2인실', '1인실', '특실'];

function fmt(n) {
  return n.toLocaleString('ko-KR') + '원';
}

function ResultRow({ label, value, primary }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className={`text-sm ${primary ? 'font-bold text-primary' : 'text-gray-500'}`}>{label}</span>
      <span className={`text-sm ${primary ? 'font-bold text-primary' : 'text-gray-700 dark:text-gray-300'}`}>{fmt(value)}</span>
    </div>
  );
}

function NumInput({ label, value, onChange }) {
  return (
    <div>
      {label && <p className="text-xs text-gray-500 mb-1.5">{label}</p>}
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="0"
        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary"
      />
    </div>
  );
}

function HospitalGradeToggle({ grade, setGrade }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1.5">병원등급</p>
      <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {HOSPITAL_GRADES.map((g) => (
          <button
            key={g}
            onClick={() => setGrade(g)}
            className={`flex-1 py-2 text-xs font-semibold transition-colors ${grade === g ? 'bg-primary text-white' : 'text-gray-500 bg-white dark:bg-gray-800'}`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}

function NonCovered3Section({ nc3Inj, setNc3Inj, nc3Manual, setNc3Manual, nc3Mri, setNc3Mri, nc3Ded, nc3Result }) {
  const items = [
    { label: '비급여 주사제', val: nc3Inj, setter: setNc3Inj },
    { label: '도수치료 / 체외충격파', val: nc3Manual, setter: setNc3Manual },
    { label: 'MRI / MRA', val: nc3Mri, setter: setNc3Mri },
  ];
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 space-y-3">
      <h2 className="font-bold text-gray-900 dark:text-white text-sm">비급여 3종</h2>
      {items.map(({ label, val, setter }) => (
        <div key={label} className="grid grid-cols-2 gap-3">
          <NumInput label={label} value={val} onChange={setter} />
          <div>
            <p className="text-xs text-gray-500 mb-1.5">공제액</p>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
              {nc3Ded.toLocaleString('ko-KR')}원
            </div>
          </div>
        </div>
      ))}
      <div className="space-y-0 border-t border-gray-100 pt-2">
        <ResultRow label="주사제" value={nc3Result.inj} />
        <ResultRow label="도수/체외충격파" value={nc3Result.manual} />
        <ResultRow label="MRI/MRA" value={nc3Result.mri} />
        <ResultRow label="비급여3종 합계" value={nc3Result.total} primary />
      </div>
    </div>
  );
}

export default function Calculator() {
  const navigate = useNavigate();
  const [type, setType] = useState('통원');
  const [genId, setGenId] = useState('gen2a');
  const [limitIdx, setLimitIdx] = useState(0);
  const [grade, setGrade] = useState('병·의원');

  const [outCov, setOutCov] = useState('');
  const [outUncov, setOutUncov] = useState('');
  const [rxCov, setRxCov] = useState('');
  const [rxUncov, setRxUncov] = useState('');
  const [nc3Inj, setNc3Inj] = useState('');
  const [nc3Manual, setNc3Manual] = useState('');
  const [nc3Mri, setNc3Mri] = useState('');
  const [inCov, setInCov] = useState('');
  const [inUncov, setInUncov] = useState('');
  const [inDays, setInDays] = useState('1');
  const [roomType, setRoomType] = useState('기준병실');

  const cfg = GEN_CONFIG[genId];
  const limitObj = cfg.limits[Math.min(limitIdx, cfg.limits.length - 1)];

  const outResult = useMemo(() => {
    const cov = parseInt(outCov) || 0;
    const uncov = parseInt(outUncov) || 0;
    const ded = cfg.outDed[grade];
    const raw = cov * cfg.covRate + uncov * cfg.uncovRate;
    return { total: cov + uncov, ded, benefit: Math.max(0, Math.min(raw - ded, limitObj.out)) };
  }, [outCov, outUncov, grade, cfg, limitObj]);

  const rxResult = useMemo(() => {
    const cov = parseInt(rxCov) || 0;
    const uncov = parseInt(rxUncov) || 0;
    const raw = cov * cfg.covRate + uncov * cfg.uncovRate;
    return { total: cov + uncov, ded: cfg.rxDed, benefit: Math.max(0, Math.min(raw - cfg.rxDed, limitObj.rx)) };
  }, [rxCov, rxUncov, cfg, limitObj]);

  const nc3Result = useMemo(() => {
    const calc = (v) => Math.max(0, Math.floor(((parseInt(v) || 0) - cfg.nc3Ded) * cfg.nc3Rate));
    const inj = calc(nc3Inj);
    const manual = calc(nc3Manual);
    const mri = calc(nc3Mri);
    return { inj, manual, mri, total: inj + manual + mri };
  }, [nc3Inj, nc3Manual, nc3Mri, cfg]);

  const inResult = useMemo(() => {
    const cov = parseInt(inCov) || 0;
    const uncov = parseInt(inUncov) || 0;
    const covBenefit = Math.floor(cov * cfg.covRate);
    const uncovBenefit = Math.floor(uncov * cfg.uncovRate);
    return { cov: covBenefit, uncov: uncovBenefit, total: covBenefit + uncovBenefit };
  }, [inCov, inUncov, cfg]);

  const totalBenefit = useMemo(() => {
    if (type === '통원') {
      return outResult.benefit
        + (cfg.showRx ? rxResult.benefit : 0)
        + (cfg.showNc3 ? nc3Result.total : 0);
    }
    return inResult.total + (cfg.showNc3 ? nc3Result.total : 0);
  }, [type, outResult, rxResult, nc3Result, inResult, cfg]);

  return (
    <div className="min-h-screen pb-36" style={{ backgroundColor: '#F7F8FC' }}>
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 px-4 py-3 relative flex items-center justify-center">
        <button onClick={() => navigate(-1)} className="absolute left-4 text-gray-500 text-2xl font-light leading-none">‹</button>
        <h1 className="text-base font-bold text-gray-900 dark:text-white">실비 계산기</h1>
      </div>

      <div className="p-4 space-y-3">
        {/* 구분 */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-3">
          <div className="flex gap-2">
            {['통원', '입원'].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-colors ${
                  type === t ? 'border-primary text-primary bg-blue-50 dark:bg-blue-950' : 'border-gray-200 dark:border-gray-700 text-gray-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 세대 선택 */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-white text-sm">세대 선택</h2>
            <button className="text-xs font-semibold flex items-center gap-1" style={{ color: '#E8312A' }}>
              보상 제외 질환
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {GENERATIONS.map((gen) => (
              <button
                key={gen.id}
                onClick={() => { setGenId(gen.id); setLimitIdx(0); }}
                className={`border-2 rounded-xl p-3 text-left transition-colors ${
                  genId === gen.id
                    ? 'border-primary bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                <p className={`text-xs font-bold leading-tight ${genId === gen.id ? 'text-primary' : 'text-gray-800 dark:text-gray-200'}`}>{gen.label}</p>
                {gen.sub && <p className="text-xs text-gray-400 mt-0.5">{gen.sub}</p>}
              </button>
            ))}
          </div>
          {cfg.isGenSick && (
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: '#FEE2E2', color: '#E8312A' }}>약제비 제외</span>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: '#FEE2E2', color: '#E8312A' }}>비급여3종 제외</span>
            </div>
          )}
        </div>

        {/* ── 통원 ── */}
        {type === '통원' && (
          <>
            {/* 통원 (외래) */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-gray-900 dark:text-white text-sm">통원 (외래)</h2>
              <div>
                <p className="text-xs text-gray-500 mb-1.5">통원비 한도</p>
                <div className="relative">
                  <select
                    value={limitIdx}
                    onChange={e => setLimitIdx(Number(e.target.value))}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm appearance-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 pr-8 focus:outline-none focus:border-primary"
                  >
                    {cfg.limits.map((l, i) => <option key={i} value={i}>{l.label}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
              {cfg.showGrade && <HospitalGradeToggle grade={grade} setGrade={setGrade} />}
              <div className="grid grid-cols-2 gap-3">
                <NumInput label="급여" value={outCov} onChange={setOutCov} />
                <NumInput label="비급여" value={outUncov} onChange={setOutUncov} />
              </div>
              <div className="space-y-0 border-t border-gray-100 pt-2">
                <ResultRow label="병원비" value={outResult.total} />
                <ResultRow label="공제액" value={outResult.ded} />
                <ResultRow label="추산보험금" value={outResult.benefit} primary />
              </div>
            </div>

            {/* 통원 (약제) — gen1/gen2a/gen2b/gen3 */}
            {cfg.showRx && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 space-y-3">
                <h2 className="font-bold text-gray-900 dark:text-white text-sm">통원 (약제)</h2>
                <div className="grid grid-cols-2 gap-3">
                  <NumInput label="급여" value={rxCov} onChange={setRxCov} />
                  <NumInput label="비급여" value={rxUncov} onChange={setRxUncov} />
                </div>
                <div className="space-y-0 border-t border-gray-100 pt-2">
                  <ResultRow label="약제비" value={rxResult.total} />
                  <ResultRow label="공제액" value={rxResult.ded} />
                  <ResultRow label="추산보험금" value={rxResult.benefit} primary />
                </div>
              </div>
            )}

            {/* 비급여 3종 — gen3/gen4 */}
            {cfg.showNc3 && (
              <NonCovered3Section
                nc3Inj={nc3Inj} setNc3Inj={setNc3Inj}
                nc3Manual={nc3Manual} setNc3Manual={setNc3Manual}
                nc3Mri={nc3Mri} setNc3Mri={setNc3Mri}
                nc3Ded={cfg.nc3Ded}
                nc3Result={nc3Result}
              />
            )}
          </>
        )}

        {/* ── 입원 ── */}
        {type === '입원' && (
          <>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-gray-900 dark:text-white text-sm">입원</h2>
              <div className="grid grid-cols-2 gap-3">
                <NumInput label="급여" value={inCov} onChange={setInCov} />
                <NumInput label="비급여" value={inUncov} onChange={setInUncov} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">입원일수</p>
                  <input
                    type="number"
                    value={inDays}
                    onChange={e => setInDays(e.target.value)}
                    min="1"
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">병실</p>
                  <div className="relative">
                    <select
                      value={roomType}
                      onChange={e => setRoomType(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm appearance-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 pr-8 focus:outline-none focus:border-primary"
                    >
                      {ROOM_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
              </div>
              <div className="space-y-0 border-t border-gray-100 pt-2">
                <ResultRow label="급여 지급" value={inResult.cov} />
                <ResultRow label="비급여 지급" value={inResult.uncov} />
                <ResultRow label="예상보험금" value={inResult.total} primary />
              </div>
            </div>

            {/* 비급여 3종 — gen3/gen4 */}
            {cfg.showNc3 && (
              <NonCovered3Section
                nc3Inj={nc3Inj} setNc3Inj={setNc3Inj}
                nc3Manual={nc3Manual} setNc3Manual={setNc3Manual}
                nc3Mri={nc3Mri} setNc3Mri={setNc3Mri}
                nc3Ded={cfg.nc3Ded}
                nc3Result={nc3Result}
              />
            )}
          </>
        )}
      </div>

      {/* 하단 고정: 예상 보험금 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto z-40 px-4 pb-4">
        <div className="rounded-2xl p-5 text-white text-center" style={{ background: 'linear-gradient(135deg, #4A8FE8 0%, #4F6EF7 100%)' }}>
          <p className="text-xs font-semibold mb-2" style={{ opacity: 0.8 }}>{type} 예상 보험금</p>
          <p className="text-3xl font-bold mb-1">{fmt(totalBenefit)}</p>
          <p className="text-xs" style={{ opacity: 0.65 }}>보상 제외 질환 및 실손 약관에 따라 실제 보험금은 상이할 수 있습니다.</p>
        </div>
      </div>
    </div>
  );
}
