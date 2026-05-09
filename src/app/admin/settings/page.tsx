"use client";
import { useEffect, useState } from "react";
export default function AdminSettings() {
  const [api, setApi] = useState<any>({ baseUrl:"", apiKey:"" });
  const [settings, setSettings] = useState<any>({});
  const [msg, setMsg] = useState("");
  useEffect(() => {
    fetch("/api/admin/settings").then(r => r.json()).then(d => { setApi(d.api); setSettings(d.settings); });
  }, []);
  const save = async () => {
    await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ api, settings }) });
    setMsg("✅ تم الحفظ"); setTimeout(()=>setMsg(""),2000);
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">الإعدادات</h1>
      <div className="card p-6 space-y-3">
        <h2 className="font-bold text-lg">إعدادات API المزود</h2>
        <div><label className="label">Base URL</label><input className="input" value={api.baseUrl||""} onChange={e=>setApi({...api, baseUrl:e.target.value})} /></div>
        <div><label className="label">API Key</label><input className="input" value={api.apiKey||""} onChange={e=>setApi({...api, apiKey:e.target.value})} /></div>
      </div>
      <div className="card p-6 space-y-3">
        <h2 className="font-bold text-lg">إعدادات الموقع</h2>
        <div><label className="label">اسم الموقع</label><input className="input" value={settings.site_name||""} onChange={e=>setSettings({...settings, site_name:e.target.value})} /></div>
        <div><label className="label">نسبة الربح العامة %</label><input className="input" value={settings.global_markup||""} onChange={e=>setSettings({...settings, global_markup:e.target.value})} /></div>
        <div><label className="label">إعلان الصفحة الرئيسية</label><textarea className="input" rows={3} value={settings.banner||""} onChange={e=>setSettings({...settings, banner:e.target.value})} /></div>
      </div>
      <div className="flex items-center gap-3"><button className="btn btn-primary" onClick={save}>حفظ</button>{msg && <span>{msg}</span>}</div>
    </div>
  );
}
