"use client";

import { useState, useEffect, useRef } from "react";
import { Download, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { SettingSection, SettingRow, Toggle } from "./SettingsUI";

type PrivacyPrefs = {
  analytics:    boolean;
  crashReports: boolean;
};

const DEFAULTS: PrivacyPrefs = {
  analytics:    true,
  crashReports: true,
};

export function PrivacyTab() {
  const [prefs,          setPrefs]          = useState<PrivacyPrefs>(DEFAULTS);
  const [loading,        setLoading]        = useState(true);
  const [saving,         setSaving]         = useState(false);
  const [exporting,      setExporting]      = useState(false);
  const [confirmClear,   setConfirmClear]   = useState(false);
  const [clearing,       setClearing]       = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.privacy_prefs) setPrefs({ ...DEFAULTS, ...d.privacy_prefs });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const savePrefs = (next: PrivacyPrefs) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        const res = await fetch("/api/profile", {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ privacy_prefs: next }),
        });
        if (!res.ok) throw new Error();
        toast.success("Privacy preferences saved.");
      } catch {
        toast.error("Failed to save preferences.");
      } finally {
        setSaving(false);
      }
    }, 800);
  };

  const toggle = (key: keyof PrivacyPrefs) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    savePrefs(next);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/settings/export");
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `ai-trainer-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export downloaded.");
    } catch {
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleClearHistory = async () => {
    setClearing(true);
    try {
      const res  = await fetch("/api/settings/history", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Cleared ${data.deleted} interview session${data.deleted !== 1 ? "s" : ""}.`);
      setConfirmClear(false);
    } catch {
      toast.error("Failed to clear history. Please try again.");
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div>
      {saving && (
        <div className="flex items-center gap-2 text-[11px] text-zinc-500 mb-4">
          <Loader2 size={11} className="animate-spin" /> Saving…
        </div>
      )}

      <SettingSection title="Data & Analytics">
        <SettingRow label="Usage Analytics" description="Help improve the product by sharing anonymous usage data">
          <Toggle enabled={prefs.analytics} onChange={() => toggle("analytics")} />
        </SettingRow>
        <SettingRow label="Crash Reports" description="Automatically send crash reports to help fix bugs">
          <Toggle enabled={prefs.crashReports} onChange={() => toggle("crashReports")} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Your Data">
        <div className="p-5 space-y-3">
          {/* Export */}
          <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-[#0d0d16] rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Export My Data</p>
              <p className="text-xs text-zinc-600 mt-0.5">Download all your interviews, scores, and CVs as JSON</p>
            </div>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 text-xs font-semibold hover:border-amber-400/30 hover:text-amber-400 transition-all disabled:opacity-50"
            >
              {exporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
              {exporting ? "Exporting…" : "Export"}
            </button>
          </div>

          {/* Clear history */}
          <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-[#0d0d16] rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Clear Interview History</p>
              <p className="text-xs text-zinc-600 mt-0.5">Permanently remove all past session records</p>
            </div>
            {confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-red-400 flex items-center gap-1">
                  <AlertTriangle size={11} /> Sure?
                </span>
                <button
                  onClick={handleClearHistory}
                  disabled={clearing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-400 transition disabled:opacity-50"
                >
                  {clearing ? <Loader2 size={11} className="animate-spin" /> : null}
                  {clearing ? "Clearing…" : "Yes, clear"}
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 text-xs font-semibold hover:text-zinc-900 dark:hover:text-white transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition-all"
              >
                <Trash2 size={13} /> Clear
              </button>
            )}
          </div>
        </div>
      </SettingSection>
    </div>
  );
}
