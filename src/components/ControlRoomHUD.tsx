'use client';
import { C } from '@/lib/data';

interface HudProps {
  he: boolean;
  t: (h: string, e: string) => string;
  power: number;        // 0-3500 MW
  coreTemp: number;     // °C
  pressure: number;     // atm (normal = 65)
  orm: number;          // operational reactivity margin (rods equivalent, normal = 30)
  steamPct: number;     // % steam in coolant
  time: string;         // "01:23:00"
  alert?: 'none' | 'warning' | 'critical';
}

/**
 * Gauge — circular meter
 */
function Gauge({
  label, value, max, unit, color, criticalAt, warningAt, size = 75,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  criticalAt?: number;
  warningAt?: number;
  size?: number;
}) {
  const angle = (Math.min(value, max) / max) * 270 - 135; // -135 to +135 degrees
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 10;

  // Determine alert level
  let actualColor = color;
  if (criticalAt && value >= criticalAt) actualColor = C.danger;
  else if (warningAt && value >= warningAt) actualColor = C.amber;

  const isCritical = criticalAt && value >= criticalAt;

  // Build arc — 270° arc from -135° to +135°
  const startAngle = -135 * Math.PI / 180;
  const endAngle = 135 * Math.PI / 180;
  const largeArc = 1;
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const arcPath = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;

  // Filled arc up to current angle
  const valueAngleRad = angle * Math.PI / 180;
  const vx = cx + r * Math.cos(valueAngleRad);
  const vy = cy + r * Math.sin(valueAngleRad);
  const valLargeArc = (angle > -135 + 180) ? 1 : 0;
  const fillArcPath = `M ${x1} ${y1} A ${r} ${r} 0 ${valLargeArc} 1 ${vx} ${vy}`;

  // Tick marks
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const tAngle = (-135 + i * 27) * Math.PI / 180;
    const tx1 = cx + (r - 3) * Math.cos(tAngle);
    const ty1 = cy + (r - 3) * Math.sin(tAngle);
    const tx2 = cx + (r + 1) * Math.cos(tAngle);
    const ty2 = cy + (r + 1) * Math.sin(tAngle);
    return { x1: tx1, y1: ty1, x2: tx2, y2: ty2, isMajor: i % 2 === 0 };
  });

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      padding: '8px 6px',
      background: 'rgba(0,0,0,0.45)',
      border: `1px solid ${actualColor}55`,
      borderRadius: 8,
      minWidth: size + 16,
      animation: isCritical ? 'pulseAlert 1s infinite' : 'none',
      boxShadow: isCritical ? `0 0 16px ${C.danger}66` : 'none',
    }}>
      <div style={{ fontSize: 9, color: actualColor, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}
      </div>
      <svg width={size} height={size}>
        {/* Background arc */}
        <path d={arcPath} stroke="rgba(255,255,255,0.15)" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Fill arc */}
        <path d={fillArcPath} stroke={actualColor} strokeWidth="3" fill="none" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${actualColor})` }} />
        {/* Tick marks */}
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                stroke="rgba(255,255,255,0.3)" strokeWidth={t.isMajor ? 1.5 : 0.5} />
        ))}
        {/* Needle */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${angle + 90}deg)`, transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          <line x1={cx} y1={cy} x2={cx} y2={cy - r + 4}
                stroke={actualColor} strokeWidth="2" strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 3px ${actualColor})` }} />
        </g>
        {/* Center hub */}
        <circle cx={cx} cy={cy} r="4" fill={actualColor} />
        <circle cx={cx} cy={cy} r="2" fill="#000" />
      </svg>
      <div style={{ fontSize: 14, color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, lineHeight: 1, marginTop: -8 }}>
        {value < 1 && value > 0 ? value.toFixed(2) : Math.round(value).toLocaleString()}
      </div>
      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.55)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>
        {unit}
      </div>
    </div>
  );
}

/**
 * Linear bar gauge — for parameters like steam fraction
 */
function BarGauge({ label, value, max, unit, color, warningAt, criticalAt }: {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  warningAt?: number;
  criticalAt?: number;
}) {
  const pct = Math.min((value / max) * 100, 100);
  let actualColor = color;
  if (criticalAt && value >= criticalAt) actualColor = C.danger;
  else if (warningAt && value >= warningAt) actualColor = C.amber;

  return (
    <div style={{
      flex: 1, minWidth: 130,
      padding: '8px 12px',
      background: 'rgba(0,0,0,0.45)',
      border: `1px solid ${actualColor}55`,
      borderRadius: 8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <span style={{ fontSize: 9, color: actualColor, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: '0.1em' }}>
          {label}
        </span>
        <span style={{ fontSize: 12, color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
          {value.toFixed(value < 10 ? 1 : 0)}<span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginInlineStart: 3 }}>{unit}</span>
        </span>
      </div>
      <div style={{ height: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${actualColor}, ${actualColor}cc)`,
          boxShadow: `0 0 8px ${actualColor}`,
          transition: 'width 0.5s ease-out',
        }} />
      </div>
    </div>
  );
}

export default function ControlRoomHUD({ he, t, power, coreTemp, pressure, orm, steamPct, time, alert = 'none' }: HudProps) {
  const alertColor = alert === 'critical' ? C.danger : alert === 'warning' ? C.amber : C.green;
  const alertText = alert === 'critical' ? (he ? '⚠ אזהרת חירום' : '⚠ EMERGENCY')
                  : alert === 'warning' ? (he ? '◬ אזהרה' : '◬ WARNING')
                  : (he ? '● תקין' : '● NORMAL');

  return (
    <div className="hud-container" style={{
      background: alert === 'critical'
        ? 'linear-gradient(180deg, rgba(40,5,5,0.95), rgba(20,5,5,0.98))'
        : 'linear-gradient(180deg, #0a0e18, #060810)',
      border: `1.5px solid ${alert === 'critical' ? C.danger : alert === 'warning' ? C.amber : C.gold + '44'}`,
      borderRadius: 10,
      padding: '14px 16px',
      boxShadow: alert === 'critical'
        ? `0 0 40px ${C.danger}66, inset 0 0 30px ${C.danger}22, 0 4px 16px rgba(0,0,0,0.7)`
        : `0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
      position: 'relative',
      overflow: 'hidden',
      animation: alert === 'critical' ? 'pulseAlert 1.4s infinite' : 'none',
    }}>
      {/* Critical state — scan lines overlay (CRT distortion effect) */}
      {alert === 'critical' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(0deg, rgba(220,38,38,0.04) 0px, transparent 2px, transparent 4px)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
        paddingBottom: 10,
        borderBottom: `1px solid ${alert === 'critical' ? C.danger : C.gold + '22'}`,
        flexWrap: 'wrap', gap: 10,
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Multiple alert lights for critical state */}
          {alert === 'critical' ? (
            <div style={{ display: 'flex', gap: 4 }}>
              <span style={{
                width: 12, height: 12, borderRadius: '50%',
                background: C.danger,
                boxShadow: `0 0 12px ${C.danger}, 0 0 20px ${C.danger}`,
                animation: 'pulseAlert 0.4s infinite',
              }} />
              <span style={{
                width: 12, height: 12, borderRadius: '50%',
                background: C.danger,
                boxShadow: `0 0 12px ${C.danger}`,
                animation: 'pulseAlert 0.4s infinite 0.2s',
              }} />
              <span style={{
                width: 12, height: 12, borderRadius: '50%',
                background: C.amber,
                boxShadow: `0 0 12px ${C.amber}`,
                animation: 'alarmBlink 0.6s infinite',
              }} />
            </div>
          ) : (
            <span style={{
              width: 10, height: 10, borderRadius: '50%',
              background: alertColor,
              boxShadow: `0 0 10px ${alertColor}`,
              animation: alert === 'warning' ? 'pulseAlert 1.2s infinite' : 'none',
            }} />
          )}
          <span style={{
            fontSize: alert === 'critical' ? 13 : 11,
            color: alertColor,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 900,
            letterSpacing: '0.15em',
            animation: alert === 'critical' ? 'glitchText 1.5s infinite' : 'none',
            textShadow: alert === 'critical' ? `0 0 8px ${C.danger}` : 'none',
          }}>
            {alertText}
          </span>
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em' }}>
          {he ? 'חדר בקרה · יחידה 4' : 'CONTROL ROOM · UNIT 4'}
        </div>
        <div style={{
          padding: '4px 14px',
          background: alert === 'critical' ? `${C.danger}33` : 'rgba(0,0,0,0.5)',
          border: `1.5px solid ${alert === 'critical' ? C.danger : C.gold + '55'}`,
          borderRadius: 6,
          fontSize: 18,
          color: alert === 'critical' ? '#fff' : C.gold,
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 900,
          letterSpacing: '0.1em',
          fontVariantNumeric: 'tabular-nums',
          textShadow: alert === 'critical' ? `0 0 10px ${C.danger}` : 'none',
          animation: alert === 'critical' ? 'pulseAlert 1s infinite' : 'none',
        }}>
          {time}
        </div>
      </div>

      {/* Gauges */}
      <div className="gauge-grid" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
        <Gauge
          label={he ? 'הספק' : 'POWER'}
          value={power}
          max={3500}
          unit="MW"
          color={C.amber}
          warningAt={3200}
          criticalAt={3300}
        />
        <Gauge
          label={he ? 'טמפ׳ ליבה' : 'CORE TEMP'}
          value={coreTemp}
          max={3000}
          unit="°C"
          color={C.danger}
          warningAt={1500}
          criticalAt={2000}
        />
        <div className="hud-secondary" style={{ display: 'contents' }}>
          <Gauge
            label={he ? 'לחץ' : 'PRESSURE'}
            value={pressure}
            max={150}
            unit="atm"
            color={C.blue}
            warningAt={90}
            criticalAt={120}
          />
        </div>
        <Gauge
          label="ORM"
          value={orm}
          max={50}
          unit={he ? 'מוטות' : 'rods'}
          color={C.green}
          warningAt={15}
          criticalAt={8}
        />
      </div>

      {/* Linear gauges */}
      <div className="hud-bar-gauges" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <BarGauge
          label={he ? 'אחוז קיטור' : 'STEAM FRACTION'}
          value={steamPct}
          max={100}
          unit="%"
          color={C.amber}
          warningAt={20}
          criticalAt={40}
        />
        <BarGauge
          label={he ? 'נוזל קירור' : 'COOLANT FLOW'}
          value={power > 100 ? 100 - steamPct * 0.5 : 50}
          max={100}
          unit="%"
          color={C.blue}
        />
      </div>

      {/* ORM critical hint */}
      {orm < 15 && (
        <div style={{
          marginTop: 12,
          padding: '8px 12px',
          background: `${C.danger}15`,
          border: `1px solid ${C.danger}66`,
          borderRadius: 6,
          fontSize: 11,
          color: C.danger,
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          textAlign: 'center',
          animation: 'pulseAlert 1s infinite',
        }}>
          {he
            ? `⚠ ORM = ${orm} · מתחת ל-15 — מצב לא בטוח! ⚠`
            : `⚠ ORM = ${orm} · BELOW 15 — UNSAFE STATE! ⚠`}
        </div>
      )}
    </div>
  );
}
