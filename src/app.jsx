
const { useState, useEffect, useRef } = React;

/* ---------------------------------------------------------------------------
   Storage — standalone: browser localStorage (persists on this device/browser)
--------------------------------------------------------------------------- */
const STORAGE_KEY = 'burnup-competition-v1';
const storage = {
  get(key) {
    try { const v = localStorage.getItem(key); return v == null ? null : { value: v }; }
    catch (e) { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { console.error(e); }
  }
};

/* ---------------------------------------------------------------------------
   Inline SVG icons (replaces lucide-react so the page needs no icon library)
--------------------------------------------------------------------------- */
function Icon({ size = 24, children, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" {...props}>{children}</svg>
  );
}
const Trophy = (p) => <Icon {...p}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></Icon>;
const Plus = (p) => <Icon {...p}><path d="M5 12h14"/><path d="M12 5v14"/></Icon>;
const Trash2 = (p) => <Icon {...p}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></Icon>;
const X = (p) => <Icon {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></Icon>;
const Download = (p) => <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></Icon>;
const Upload = (p) => <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></Icon>;
const ChevronLeft = (p) => <Icon {...p}><path d="m15 18-6-6 6-6"/></Icon>;
const Users = (p) => <Icon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>;
const Flame = (p) => <Icon {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></Icon>;
const BarChart3 = (p) => <Icon {...p}><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></Icon>;

/* ---------------------------------------------------------------------------
   Domain constants + helpers
--------------------------------------------------------------------------- */
const METRICS = [
  { key: 'weight', label: '体重', unit: 'kg', step: '0.1' },
  { key: 'bodyFat', label: '体脂率', unit: '%', step: '0.1' },
  { key: 'visceralFat', label: '内脏脂肪', unit: '', step: '0.1' },
  { key: 'muscleMass', label: '肌肉量', unit: 'kg', step: '0.1' },
  { key: 'metabolism', label: '基础代谢', unit: 'kcal', step: '1' },
  { key: 'metabolicAge', label: '代谢年龄', unit: '岁', step: '1' },
  { key: 'bodyWater', label: '身体水分', unit: '%', step: '0.1' }
];

const today = () => new Date().toISOString().split('T')[0];
const formatDate = (iso) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${parseInt(m)}/${parseInt(d)}`;
};
const formatDateLong = (iso) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${y}/${parseInt(m)}/${parseInt(d)}`;
};

/* ---------------------------------------------------------------------------
   Root app
--------------------------------------------------------------------------- */
function App() {
  const [participants, setParticipants] = useState([]);
  const [view, setView] = useState('leaderboard');
  const [selectedId, setSelectedId] = useState(null);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const result = storage.get(STORAGE_KEY);
      if (result?.value) setParticipants(JSON.parse(result.value));
    } catch (e) {}
    setLoading(false);
  }, []);

  const save = (data) => {
    setParticipants(data);
    storage.set(STORAGE_KEY, JSON.stringify(data));
  };

  const parseFormData = (data) => {
    const parsed = { date: data.date };
    METRICS.forEach(m => { parsed[m.key] = parseFloat(data[m.key]) || 0; });
    return parsed;
  };

  const addParticipant = (data) => {
    save([...participants, {
      id: Date.now().toString(),
      name: data.name.trim(),
      baseline: parseFormData(data),
      measurements: []
    }]);
    setModal(null);
  };

  const addMeasurement = (pid, data) => {
    save(participants.map(p =>
      p.id === pid ? { ...p, measurements: [...p.measurements, parseFormData(data)] } : p
    ));
    setModal(null);
  };

  const deleteMeasurement = (pid, idx) => {
    save(participants.map(p =>
      p.id === pid ? { ...p, measurements: p.measurements.filter((_, i) => i !== idx) } : p
    ));
  };

  const deleteParticipant = (id) => {
    save(participants.filter(p => p.id !== id));
    setSelectedId(null);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(participants, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `burnup-competition-${today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) throw new Error('格式错误');
        if (participants.length > 0 &&
            !window.confirm(`导入将覆盖当前 ${participants.length} 位学员的数据，确定继续？`)) return;
        save(data);
        window.alert(`已导入 ${data.length} 位学员的数据`);
      } catch (err) {
        window.alert('导入失败：文件不是有效的备份 JSON');
      }
    };
    reader.readAsText(file);
  };

  const rankings = participants
    .map(p => {
      const latest = p.measurements[p.measurements.length - 1];
      let dropPct = null, weightChange = null, weightDropPct = null;
      if (latest && p.baseline?.bodyFat) {
        dropPct = ((p.baseline.bodyFat - latest.bodyFat) / p.baseline.bodyFat) * 100;
        weightChange = latest.weight - p.baseline.weight;
        if (p.baseline.weight) weightDropPct = ((p.baseline.weight - latest.weight) / p.baseline.weight) * 100;
      }
      return { ...p, dropPct, weightChange, weightDropPct, latest };
    })
    .sort((a, b) => {
      if (a.dropPct === null && b.dropPct === null) return 0;
      if (a.dropPct === null) return 1;
      if (b.dropPct === null) return -1;
      return b.dropPct - a.dropPct;
    });

  const selected = participants.find(p => p.id === selectedId);

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24 max-w-md mx-auto">
      {selected ? (
        <DetailView
          participant={selected}
          onBack={() => setSelectedId(null)}
          onAdd={() => setModal('measurement')}
          onDeleteMeasurement={(idx) => deleteMeasurement(selected.id, idx)}
          onDelete={() => {
            if (window.confirm(`确定删除 ${selected.name} 的所有数据？无法恢复。`)) deleteParticipant(selected.id);
          }}
        />
      ) : view === 'leaderboard' ? (
        <Leaderboard
          rankings={rankings}
          onSelect={setSelectedId}
          onExport={exportJson}
          onImport={() => fileInputRef.current?.click()}
        />
      ) : (
        <ParticipantList
          participants={rankings}
          onSelect={setSelectedId}
          onAdd={() => setModal('participant')}
        />
      )}

      {/* hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) importJson(f);
          e.target.value = '';
        }}
      />

      {/* Bottom nav */}
      {!selected && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-zinc-900 border-t border-zinc-800 flex">
          <button
            onClick={() => setView('leaderboard')}
            className={`flex-1 py-3 flex flex-col items-center gap-1 ${view === 'leaderboard' ? 'text-orange-400' : 'text-zinc-500'}`}
          >
            <Trophy size={20} />
            <span className="text-xs font-medium">排行榜</span>
          </button>
          <button
            onClick={() => setView('participants')}
            className={`flex-1 py-3 flex flex-col items-center gap-1 ${view === 'participants' ? 'text-orange-400' : 'text-zinc-500'}`}
          >
            <Users size={20} />
            <span className="text-xs font-medium">学员</span>
          </button>
        </nav>
      )}

      {/* Modals */}
      {modal === 'participant' && (
        <FormModal
          title="新增学员（含基线数据）"
          onClose={() => setModal(null)}
          onSubmit={addParticipant}
          includeName={true}
        />
      )}
      {modal === 'measurement' && selected && (
        <FormModal
          title={`${selected.name} — 新增测量数据`}
          onClose={() => setModal(null)}
          onSubmit={(data) => addMeasurement(selected.id, data)}
          includeName={false}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Leaderboard
--------------------------------------------------------------------------- */
function Leaderboard({ rankings, onSelect, onExport, onImport }) {
  const top3 = rankings.slice(0, 3).filter(p => p.dropPct !== null);
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const withProgress = rankings.filter(p => p.dropPct !== null).length;

  return (
    <div>
      <header className="px-5 pt-6 pb-4 border-b border-zinc-800">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-orange-400 mb-1">
              <Flame size={16} />
              <span className="text-xs font-semibold tracking-wider uppercase">BurnUp Challenge</span>
            </div>
            <h1 className="text-2xl font-bold">减重比赛排行</h1>
            <p className="text-xs text-zinc-500 mt-1">按体脂下降比例排名 · {rankings.length} 位学员</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={onImport} title="导入备份" className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200">
              <Upload size={18} />
            </button>
            {rankings.length > 0 && (
              <button onClick={onExport} title="导出备份" className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200">
                <Download size={18} />
              </button>
            )}
          </div>
        </div>
      </header>

      {rankings.length === 0 ? (
        <EmptyState icon={<Trophy size={40} />} title="还没有学员" desc="到「学员」页面新增第一位参赛者" />
      ) : withProgress === 0 ? (
        <EmptyState icon={<BarChart3 size={40} />} title="等待第一次更新" desc="学员至少需要一次新的测量才能上榜" />
      ) : (
        <>
          {/* Podium */}
          {top3.length > 0 && (
            <div className="px-5 pt-8 pb-6">
              <div className="flex items-end justify-center gap-3">
                {podiumOrder.map((p) => {
                  const rank = rankings.findIndex(r => r.id === p.id) + 1;
                  const heights = { 1: 'h-32', 2: 'h-24', 3: 'h-20' };
                  const colors = {
                    1: 'from-amber-400 to-amber-600 text-amber-950',
                    2: 'from-zinc-300 to-zinc-400 text-zinc-900',
                    3: 'from-orange-600 to-orange-800 text-orange-50'
                  };
                  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
                  return (
                    <button key={p.id} onClick={() => onSelect(p.id)} className="flex-1 flex flex-col items-center max-w-[110px]">
                      <div className="text-3xl mb-2">{medals[rank]}</div>
                      <div className="text-center mb-2 w-full">
                        <div className="text-sm font-semibold truncate px-1">{p.name}</div>
                        <div className="text-lg font-bold text-emerald-400 tabular-nums">-{p.dropPct.toFixed(1)}%</div>
                      </div>
                      <div className={`w-full ${heights[rank]} rounded-t-lg bg-gradient-to-b ${colors[rank]} flex items-start justify-center pt-2 font-black text-2xl`}>
                        {rank}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rest of rankings */}
          <div className="px-5">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">完整排行</h2>
            <div className="space-y-2">
              {rankings.map((p, idx) => (
                <RankRow key={p.id} rank={idx + 1} participant={p} onClick={() => onSelect(p.id)} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function RankRow({ rank, participant: p, onClick }) {
  const hasData = p.dropPct !== null;
  const rankColor = rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-zinc-300' : rank === 3 ? 'text-orange-500' : 'text-zinc-600';

  return (
    <button onClick={onClick} className="w-full bg-zinc-900 hover:bg-zinc-800 rounded-xl p-4 flex items-center gap-4 transition-colors text-left">
      <div className={`text-2xl font-black w-8 tabular-nums ${rankColor}`}>{rank}</div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold truncate">{p.name}</div>
        <div className="text-xs text-zinc-500 mt-0.5">
          {hasData ? (<>体脂 {p.baseline.bodyFat.toFixed(1)}% → {p.latest.bodyFat.toFixed(1)}%</>) : (<>尚未更新数据</>)}
        </div>
      </div>
      <div className="text-right">
        {hasData ? (
          <>
            <div className={`text-lg font-bold tabular-nums ${p.dropPct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {p.dropPct >= 0 ? '-' : '+'}{Math.abs(p.dropPct).toFixed(1)}%
            </div>
            <div className="text-xs text-zinc-500 tabular-nums">
              {p.weightChange >= 0 ? '+' : ''}{p.weightChange.toFixed(1)}kg
            </div>
          </>
        ) : (<div className="text-xs text-zinc-600">—</div>)}
      </div>
    </button>
  );
}

/* ---------------------------------------------------------------------------
   Participant list
--------------------------------------------------------------------------- */
function ParticipantList({ participants, onSelect, onAdd }) {
  return (
    <div>
      <header className="px-5 pt-6 pb-4 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">学员</h1>
          <p className="text-xs text-zinc-500 mt-1">{participants.length} 位参赛者</p>
        </div>
        <button onClick={onAdd} className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 flex items-center gap-1.5 font-semibold text-sm">
          <Plus size={16} />
          新增
        </button>
      </header>

      {participants.length === 0 ? (
        <EmptyState icon={<Users size={40} />} title="还没有学员" desc="点击右上方「新增」加入第一位参赛者" />
      ) : (
        <div className="px-5 pt-4 space-y-2">
          {participants.map((p) => (
            <button key={p.id} onClick={() => onSelect(p.id)} className="w-full bg-zinc-900 hover:bg-zinc-800 rounded-xl p-4 flex items-center justify-between transition-colors text-left">
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  {p.measurements.length === 0 ? '仅基线' : `${p.measurements.length} 次更新`}
                  {' · '}
                  基线: {formatDateLong(p.baseline.date)}
                </div>
              </div>
              <div className="text-xs text-zinc-600">›</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Detail view
--------------------------------------------------------------------------- */
function DetailView({ participant: p, onBack, onAdd, onDeleteMeasurement, onDelete }) {
  const latest = p.measurements[p.measurements.length - 1];
  const hasProgress = !!latest;

  const changes = hasProgress ? METRICS.map(m => ({
    ...m,
    baseline: p.baseline[m.key],
    latest: latest[m.key],
    diff: latest[m.key] - p.baseline[m.key]
  })) : [];

  const dropPct = hasProgress && p.baseline.bodyFat
    ? ((p.baseline.bodyFat - latest.bodyFat) / p.baseline.bodyFat) * 100
    : null;

  const chartData = [
    { date: formatDate(p.baseline.date), bodyFat: p.baseline.bodyFat, weight: p.baseline.weight },
    ...p.measurements.map(m => ({ date: formatDate(m.date), bodyFat: m.bodyFat, weight: m.weight }))
  ];

  return (
    <div>
      <header className="px-5 pt-6 pb-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100">
            <ChevronLeft size={20} />
            <span>返回</span>
          </button>
          <button onClick={onDelete} className="p-2 text-zinc-500 hover:text-red-400">
            <Trash2 size={18} />
          </button>
        </div>
        <h1 className="text-2xl font-bold">{p.name}</h1>
        <p className="text-xs text-zinc-500 mt-1">
          基线：{formatDateLong(p.baseline.date)} · {p.measurements.length} 次更新
        </p>
      </header>

      {/* Summary card */}
      {hasProgress && (
        <div className="px-5 pt-5">
          <div className="bg-gradient-to-br from-orange-950 to-zinc-900 border border-orange-900/50 rounded-2xl p-5">
            <div className="text-xs text-orange-300/80 font-semibold uppercase tracking-wider mb-1">体脂下降比例</div>
            <div className={`text-4xl font-black tabular-nums ${dropPct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {dropPct >= 0 ? '-' : '+'}{Math.abs(dropPct).toFixed(2)}%
            </div>
            <div className="text-sm text-zinc-400 mt-2">
              {p.baseline.bodyFat.toFixed(1)}% → {latest.bodyFat.toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      {p.measurements.length >= 1 && (
        <div className="px-5 pt-5">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">趋势</h2>
          <div className="bg-zinc-900 rounded-xl p-4">
            <TrendChart data={chartData} />
          </div>
        </div>
      )}

      {/* Metric comparison */}
      {hasProgress && (
        <div className="px-5 pt-5">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">全指标变化 (基线 → 最新)</h2>
          <div className="bg-zinc-900 rounded-xl overflow-hidden">
            {changes.map((c, i) => {
              const isPositive = ['muscleMass', 'metabolism', 'bodyWater'].includes(c.key) ? c.diff > 0 : c.diff < 0;
              const color = c.diff === 0 ? 'text-zinc-400' : isPositive ? 'text-emerald-400' : 'text-red-400';
              return (
                <div key={c.key} className={`flex items-center justify-between px-4 py-3 ${i !== changes.length - 1 ? 'border-b border-zinc-800' : ''}`}>
                  <div className="text-sm text-zinc-300">{c.label}</div>
                  <div className="flex items-center gap-3 text-sm tabular-nums">
                    <span className="text-zinc-500">{c.baseline}{c.unit}</span>
                    <span className="text-zinc-600">→</span>
                    <span className="text-zinc-200 font-medium">{c.latest}{c.unit}</span>
                    <span className={`${color} font-semibold w-16 text-right`}>
                      {c.diff > 0 ? '+' : ''}{c.diff.toFixed(1)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All measurements */}
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">测量记录</h2>
          <button onClick={onAdd} className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-3 py-1.5 flex items-center gap-1 font-semibold text-xs">
            <Plus size={14} />
            新增测量
          </button>
        </div>

        <div className="space-y-2">
          {/* Baseline card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-orange-400 bg-orange-950 px-2 py-0.5 rounded">基线</span>
                <span className="text-xs text-zinc-500">{formatDateLong(p.baseline.date)}</span>
              </div>
            </div>
            <MeasurementGrid data={p.baseline} />
          </div>

          {/* Measurements (newest first) */}
          {[...p.measurements].reverse().map((m, revIdx) => {
            const actualIdx = p.measurements.length - 1 - revIdx;
            return (
              <div key={actualIdx} className="bg-zinc-900 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                      第 {actualIdx + 1} 次更新
                    </span>
                    <span className="text-xs text-zinc-500">{formatDateLong(m.date)}</span>
                  </div>
                  <button
                    onClick={() => { if (window.confirm('删除这次测量记录？')) onDeleteMeasurement(actualIdx); }}
                    className="text-zinc-600 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <MeasurementGrid data={m} />
              </div>
            );
          })}

          {p.measurements.length === 0 && (
            <div className="text-center py-8 text-sm text-zinc-500">
              还没有测量更新<br />
              <span className="text-xs">点击「新增测量」录入第一笔数据</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MeasurementGrid({ data }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
      {METRICS.map(m => (
        <div key={m.key} className="flex justify-between">
          <span className="text-zinc-500">{m.label}</span>
          <span className="text-zinc-200 tabular-nums font-medium">{data[m.key]}{m.unit}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   TrendChart — lightweight SVG line chart (replaces recharts).
   Body-fat% and weight use independent scales so both trends are visible.
--------------------------------------------------------------------------- */
function TrendChart({ data }) {
  const [hover, setHover] = useState(null);
  const wrapRef = useRef(null);
  const [w, setW] = useState(320);
  const H = 200;
  const pad = { top: 16, right: 12, bottom: 26, left: 12 };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setW(el.clientWidth || 320);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const innerW = Math.max(1, w - pad.left - pad.right);
  const innerH = H - pad.top - pad.bottom;
  const n = data.length;

  const xFor = (i) => pad.left + (n <= 1 ? innerW / 2 : (innerW * i) / (n - 1));

  const series = [
    { key: 'bodyFat', name: '体脂率 %', color: '#fb923c' },
    { key: 'weight', name: '体重 kg', color: '#34d399' }
  ].map(s => {
    const vals = data.map(d => d[s.key]);
    let min = Math.min(...vals), max = Math.max(...vals);
    if (min === max) { min -= 1; max += 1; }
    const yFor = (v) => pad.top + innerH - ((v - min) / (max - min)) * innerH;
    const points = data.map((d, i) => ({ x: xFor(i), y: yFor(d[s.key]), v: d[s.key] }));
    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    return { ...s, points, path };
  });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    let best = 0, bestDist = Infinity;
    for (let i = 0; i < n; i++) {
      const dist = Math.abs(xFor(i) - x);
      if (dist < bestDist) { bestDist = dist; best = i; }
    }
    setHover(best);
  };

  return (
    <div ref={wrapRef} className="w-full">
      {/* legend */}
      <div className="flex items-center gap-4 mb-2">
        {series.map(s => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 rounded" style={{ background: s.color }}></span>
            <span className="text-xs text-zinc-400">{s.name}</span>
          </div>
        ))}
      </div>

      <svg
        width={w} height={H} className="touch-none select-none"
        onMouseMove={handleMove} onMouseLeave={() => setHover(null)}
        onTouchStart={handleMove} onTouchMove={handleMove}
      >
        {/* horizontal grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const y = pad.top + innerH * t;
          return <line key={i} x1={pad.left} y1={y} x2={w - pad.right} y2={y} stroke="#27272a" strokeDasharray="3 3" />;
        })}

        {/* hover guide */}
        {hover != null && (
          <line x1={xFor(hover)} y1={pad.top} x2={xFor(hover)} y2={pad.top + innerH} stroke="#52525b" strokeWidth="1" />
        )}

        {/* series */}
        {series.map(s => (
          <g key={s.key}>
            <path d={s.path} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {s.points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={hover === i ? 5 : 3.5} fill={s.color} stroke="#18181b" strokeWidth="1.5" />
            ))}
          </g>
        ))}

        {/* x labels */}
        {data.map((d, i) => {
          const show = n <= 6 || i === 0 || i === n - 1 || i === hover;
          if (!show) return null;
          return (
            <text key={i} x={xFor(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#71717a">{d.date}</text>
          );
        })}
      </svg>

      {/* tooltip */}
      {hover != null && (
        <div className="mt-2 flex items-center justify-between rounded-lg bg-zinc-800 px-3 py-2 text-xs">
          <span className="text-zinc-300 font-medium tabular-nums">{data[hover].date}</span>
          <div className="flex items-center gap-4 tabular-nums">
            <span style={{ color: '#fb923c' }}>体脂 {data[hover].bodyFat}%</span>
            <span style={{ color: '#34d399' }}>体重 {data[hover].weight}kg</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Form modal
--------------------------------------------------------------------------- */
function FormModal({ title, onClose, onSubmit, includeName }) {
  const [form, setForm] = useState({
    name: '', date: today(), weight: '', bodyFat: '', visceralFat: '',
    muscleMass: '', metabolism: '', metabolicAge: '', bodyWater: ''
  });

  const handleSubmit = () => {
    if (includeName && !form.name.trim()) { alert('请输入学员姓名'); return; }
    if (!form.date) { alert('请选择日期'); return; }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-zinc-900 w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-hidden flex flex-col">
        <header className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="font-bold">{title}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200"><X size={20} /></button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {includeName && (
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">姓名</label>
              <input
                type="text" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 focus:outline-none focus:border-orange-500"
                placeholder="学员姓名"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">测量日期</label>
            <input
              type="date" value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="pt-2">
            <div className="text-xs font-semibold text-zinc-400 mb-2">身体数据</div>
            <div className="grid grid-cols-2 gap-3">
              {METRICS.map(m => (
                <div key={m.key}>
                  <label className="block text-xs text-zinc-500 mb-1">
                    {m.label}{m.unit && ` (${m.unit})`}
                  </label>
                  <input
                    type="number" step={m.step} inputMode="decimal" value={form[m.key]}
                    onChange={(e) => setForm({ ...form, [m.key]: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-orange-500 tabular-nums"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="px-5 py-4 border-t border-zinc-800 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-lg bg-zinc-800 text-zinc-300 font-semibold hover:bg-zinc-700">取消</button>
          <button onClick={handleSubmit} className="flex-1 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold">保存</button>
        </footer>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="text-zinc-700 mb-4">{icon}</div>
      <h3 className="font-semibold text-zinc-300 mb-1">{title}</h3>
      <p className="text-sm text-zinc-500">{desc}</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  