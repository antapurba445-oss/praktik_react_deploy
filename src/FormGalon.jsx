import { useState } from "react";

// Setiap isian yang valid mengisi galon 25%. Tombol kirim aktif saat galon penuh.
const rules = {
  nama: { ok: (v) => v.trim().length >= 3, hint: "Nama minimal 3 huruf." },
  hp: {
    ok: (v) => /^08\d{8,11}$/.test(v.replace(/[\s-]/g, "")),
    hint: "Nomor HP diawali 08, 10-13 digit.",
  },
  alamat: { ok: (v) => v.trim().length >= 10, hint: "Tulis alamat lebih lengkap, minimal 10 karakter." },
};

function Field({ fieldKey, label, placeholder, area, value, touched, onChange, onBlur }) {
  const salah = touched && !rules[fieldKey].ok(value);
  const Tag = area ? "textarea" : "input";

  return (
    <label className="fg-field">
      <span>{label}</span>
      <Tag
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={area ? 2 : undefined}
        inputMode={fieldKey === "hp" ? "tel" : undefined}
        aria-invalid={salah}
      />
      <small className={salah ? "salah" : ""}>
        {salah ? rules[fieldKey].hint : rules[fieldKey].ok(value) ? "Air masuk." : "\u00A0"}
      </small>
    </label>
  );
}

export default function FormGalon() {
  const [data, setData] = useState({ nama: "", hp: "", alamat: "" });
  const [setuju, setSetuju] = useState(false);
  const [touched, setTouched] = useState({});
  const [terkirim, setTerkirim] = useState(false);

  const terisi =
    Object.keys(rules).filter((k) => rules[k].ok(data[k])).length + (setuju ? 1 : 0);
  const persen = terisi * 25;
  const penuh = persen === 100;

  const ubah = (k) => (e) => setData((current) => ({ ...current, [k]: e.target.value }));
  const sentuh = (k) => () => setTouched((current) => ({ ...current, [k]: true }));

  const ulang = () => {
    setData({ nama: "", hp: "", alamat: "" });
    setSetuju(false);
    setTouched({});
    setTerkirim(false);
  };

  return (
    <div className="fg-page">
      <style>{css}</style>
      <div className="fg-corner fg-corner-tl" aria-hidden="true">
        <svg viewBox="0 0 48 48"><path d="M24 4C19 13 10 22 10 31a14 14 0 0 0 28 0C38 22 29 13 24 4Z" /><path d="M17 31a7 7 0 0 0 7 7" /></svg>
      </div>
      <div className="fg-corner fg-corner-br" aria-hidden="true">
        <svg viewBox="0 0 48 48"><path d="M24 4C19 13 10 22 10 31a14 14 0 0 0 28 0C38 22 29 13 24 4Z" /><path d="M17 31a7 7 0 0 0 7 7" /></svg>
      </div>
      <div className="fg-card">
        <div className="fg-galon" role="img" aria-label={`Galon terisi ${persen} persen`}>
          <div className="fg-cap" />
          <div className="fg-neck" />
          <div className="fg-body">
            <div className="fg-water" style={{ height: `${persen}%` }}>
              <div className="fg-wave" />
            </div>
            <div className="fg-sticker">Air Minum</div>
            <div className="fg-persen">{persen}%</div>
          </div>
        </div>

        <div className="fg-isi">
          {terkirim ? (
            <div className="fg-sukses">
              <h1>Galon penuh!</h1>
              <p>
                Pesanan atas nama <b>{data.nama}</b> sudah dicatat. Kurir mengantar ke
                alamatmu hari ini.
              </p>
              <button className="fg-btn" onClick={ulang}>
                Pesan lagi
              </button>
            </div>
          ) : (
            <div>
              <h1>Isi galonmu</h1>
              <p className="fg-sub">Lengkapi data, galon terisi sendiri.</p>

              <Field fieldKey="nama" label="Nama" placeholder="Nama pemesan" value={data.nama}
                touched={touched.nama} onChange={ubah("nama")} onBlur={sentuh("nama")} />
              <Field fieldKey="hp" label="Nomor HP" placeholder="08xxxxxxxxxx" value={data.hp}
                touched={touched.hp} onChange={ubah("hp")} onBlur={sentuh("hp")} />
              <Field fieldKey="alamat" label="Alamat antar" placeholder="Jalan, nomor rumah, RT/RW" area value={data.alamat}
                touched={touched.alamat} onChange={ubah("alamat")} onBlur={sentuh("alamat")} />

              <label className="fg-cek">
                <input type="checkbox" checked={setuju} onChange={(e) => setSetuju(e.target.checked)} />
                <span>Galon kosong lama saya tukar saat kurir datang.</span>
              </label>

              <button className="fg-btn" disabled={!penuh} onClick={() => setTerkirim(true)}>
                {penuh ? "Kirim pesanan" : `Isi ${100 - persen}% lagi`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const css = `
.fg-page{--laut:#1E6FA8;--tua:#12466B;--aqua:#7FD1E8;--plastik:#EAF6FA;--stiker:#F2C14E;--tinta:#0E2A3B;
  position:relative;isolation:isolate;min-height:100vh;display:grid;place-items:center;padding:20px;box-sizing:border-box;overflow:hidden;
  background:#CFE9F2;font-family:"Nunito","Segoe UI",system-ui,sans-serif;color:var(--tinta)}
.fg-page *{box-sizing:border-box}
.fg-corner{position:absolute;z-index:-1;width:clamp(84px,14vw,148px);aspect-ratio:1;display:grid;place-items:center;
  border:1px solid rgba(30,111,168,.15);border-radius:50%;background:rgba(255,255,255,.24);}
.fg-corner::before,.fg-corner::after{content:"";position:absolute;border:1px solid rgba(30,111,168,.13);border-radius:50%}
.fg-corner::before{inset:10px}.fg-corner::after{inset:-9px}
.fg-corner svg{width:38%;overflow:visible;fill:rgba(255,255,255,.74);stroke:rgba(30,111,168,.62);stroke-width:1.8;stroke-linecap:round}
.fg-corner-tl{top:clamp(16px,4vw,42px);left:clamp(16px,4vw,42px)}
.fg-corner-br{right:clamp(16px,4vw,42px);bottom:clamp(16px,4vw,42px);transform:rotate(18deg)}
.fg-card{display:flex;gap:28px;align-items:center;background:#fff;border-radius:28px;padding:32px;
  max-width:720px;width:100%;box-shadow:0 18px 40px rgba(18,70,107,.18)}
.fg-galon{display:flex;flex-direction:column;align-items:center;flex:none}
.fg-cap{width:54px;height:16px;background:var(--tua);border-radius:6px 6px 2px 2px}
.fg-neck{width:68px;height:26px;background:var(--plastik);border:3px solid var(--aqua);border-bottom:0;border-radius:10px 10px 0 0}
.fg-body{position:relative;width:160px;height:230px;overflow:hidden;background:var(--plastik);
  border:3px solid var(--aqua);border-radius:22px 22px 30px 30px}
.fg-water{position:absolute;left:0;right:0;bottom:0;isolation:isolate;overflow:hidden;
  background:linear-gradient(105deg,rgba(111,211,235,.76),rgba(213,249,255,.9) 42%,rgba(72,174,211,.78));
  transition:height .9s cubic-bezier(.3,.8,.3,1)}
.fg-wave{position:absolute;left:50%;top:-14px;width:320px;height:320px;margin-left:-160px;
  border-radius:43% 57% 48% 52%;border-top:4px solid rgba(255,255,255,.82);
  background:linear-gradient(180deg,rgba(225,251,255,.72),rgba(55,163,202,.44) 38%,rgba(38,132,177,.62));
  animation:fg-putar 7s linear infinite}
.fg-water::before,.fg-water::after{content:"";position:absolute;inset:0;pointer-events:none}
.fg-water::before{z-index:1;background:linear-gradient(108deg,rgba(255,255,255,.48),transparent 24%,
  rgba(255,255,255,.2) 49%,transparent 72%,rgba(255,255,255,.2));mix-blend-mode:screen}
.fg-water::after{z-index:2;background:
  radial-gradient(circle at 18% 75%,rgba(255,255,255,.86) 0 2px,transparent 3px),
  radial-gradient(circle at 73% 64%,rgba(255,255,255,.72) 0 3px,transparent 4px),
  radial-gradient(circle at 42% 88%,rgba(255,255,255,.64) 0 2px,transparent 3px),
  radial-gradient(circle at 86% 91%,rgba(255,255,255,.7) 0 2px,transparent 3px);
  animation:fg-gelembung 3.5s ease-in-out infinite alternate}
.fg-sticker{position:absolute;top:52%;left:50%;transform:translate(-50%,-50%) rotate(-4deg);
  background:var(--stiker);padding:6px 14px;border-radius:6px;font-weight:800;font-size:14px;color:var(--tinta)}
.fg-persen{position:absolute;top:14px;left:0;right:0;text-align:center;font-size:30px;font-weight:800;color:var(--tua)}
.fg-isi{flex:1;min-width:0}
.fg-isi h1{margin:0;font-size:30px;line-height:1.1;color:var(--tua)}
.fg-sub{margin:6px 0 18px;color:#4C6B7D}
.fg-field{display:block;margin-bottom:6px}
.fg-field>span{display:block;font-weight:700;font-size:14px;margin-bottom:4px}
.fg-field input,.fg-field textarea{width:100%;padding:11px 13px;font:inherit;border:2px solid #C5DDE8;
  border-radius:12px;background:#F7FCFE;resize:none;transition:border-color .2s}
.fg-field input:focus,.fg-field textarea:focus{outline:3px solid rgba(30,111,168,.25);border-color:var(--laut)}
.fg-field input[aria-invalid="true"],.fg-field textarea[aria-invalid="true"]{border-color:#C8452F}
.fg-field small{display:block;min-height:18px;font-size:13px;color:var(--laut)}
.fg-field small.salah{color:#C8452F}
.fg-cek{display:flex;gap:10px;align-items:flex-start;margin:6px 0 16px;font-size:14px;cursor:pointer}
.fg-cek input{width:20px;height:20px;margin-top:1px;accent-color:var(--laut)}
.fg-btn{width:100%;padding:14px;font:inherit;font-weight:800;font-size:16px;color:#fff;background:var(--laut);
  border:0;border-radius:14px;cursor:pointer;transition:transform .15s,background .2s}
.fg-btn:hover:not(:disabled){background:var(--tua)}
.fg-btn:active:not(:disabled){transform:scale(.98)}
.fg-btn:focus-visible{outline:3px solid var(--stiker);outline-offset:2px}
.fg-btn:disabled{background:#B7CBD6;cursor:not-allowed}
.fg-sukses p{margin:12px 0 20px;line-height:1.5}
@keyframes fg-putar{to{transform:rotate(360deg)}}
@keyframes fg-gelembung{to{transform:translateY(-5px);opacity:.55}}
@media (max-width:620px){.fg-card{flex-direction:column;padding:24px}.fg-isi{width:100%}.fg-corner{width:76px}.fg-corner-br{right:8px;bottom:8px}.fg-corner-tl{top:8px;left:8px}}
@media (prefers-reduced-motion:reduce){.fg-wave,.fg-water::after{animation:none}.fg-water{transition:none}}
`;
