"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff, Trash2, LogOut, Smartphone, Loader2, RefreshCw } from "lucide-react";
import { SettingSection, SettingRow } from "./SettingsUI";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SessionInfo {
  id: string;
  isCurrent: boolean;
  lastActiveAt: number;
  browserName: string | null;
  deviceType: string | null;
  isMobile: boolean;
  city: string | null;
  country: string | null;
}

// ── Change Password ──────────────────────────────────────────────────────────
function PasswordSection() {
  const { user } = useUser();
  const [showOld,     setShowOld]     = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [oldPw,       setOldPw]       = useState("");
  const [newPw,       setNewPw]       = useState("");
  const [confirmPw,   setConfirmPw]   = useState("");
  const [loading,     setLoading]     = useState(false);

  const handleUpdate = async () => {
    if (newPw !== confirmPw)  { toast.error("New passwords do not match."); return; }
    if (newPw.length < 8)     { toast.error("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      await user?.updatePassword({ currentPassword: oldPw, newPassword: newPw });
      toast.success("Password updated successfully.");
      setOldPw(""); setNewPw(""); setConfirmPw("");
    } catch (err: unknown) {
      const msg = (err as { errors?: { message: string }[] })?.errors?.[0]?.message;
      toast.error(msg ?? "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  if (!user?.passwordEnabled) {
    return (
      <SettingSection title="Change Password">
        <p className="px-5 py-4 text-sm text-zinc-500">
          You signed in with OAuth — password-based login is not enabled for your account.
        </p>
      </SettingSection>
    );
  }

  const fields = [
    { label: "Current Password", value: oldPw,     set: setOldPw,     show: showOld,     setShow: setShowOld     },
    { label: "New Password",     value: newPw,     set: setNewPw,     show: showNew,     setShow: setShowNew     },
    { label: "Confirm Password", value: confirmPw, set: setConfirmPw, show: showConfirm, setShow: setShowConfirm },
  ];

  return (
    <SettingSection title="Change Password">
      <div className="p-5 space-y-4">
        {fields.map(({ label, value, set, show, setShow }) => (
          <div key={label}>
            <label className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest block mb-2">{label}</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={value}
                onChange={(e) => set(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-100 dark:bg-[#0d0d16] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:border-amber-400/40 transition-colors pr-11 placeholder:text-zinc-400 dark:placeholder:text-zinc-700"
              />
              <button
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={handleUpdate}
          disabled={loading || !oldPw || !newPw || !confirmPw}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400/15 border border-amber-400/25 text-amber-400 text-sm font-semibold hover:bg-amber-400/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Update Password
        </button>
      </div>
    </SettingSection>
  );
}

// ── Connected Accounts ───────────────────────────────────────────────────────
function ConnectedAccountsSection() {
  const { user } = useUser();
  const [loading, setLoading] = useState<string | null>(null);

  const connectedProviders = new Set(user?.externalAccounts.map((a) => a.provider as string) ?? []);

  const handleConnect = async (strategy: "oauth_google" | "oauth_github") => {
    setLoading(strategy);
    try {
      const res = await user?.createExternalAccount({ strategy, redirectUrl: window.location.href });
      const url = res?.verification?.externalVerificationRedirectURL;
      if (url) window.location.href = url.toString();
    } catch (err: unknown) {
      const msg = (err as { errors?: { message: string }[] })?.errors?.[0]?.message;
      toast.error(msg ?? "Failed to connect account.");
      setLoading(null);
    }
  };

  const handleDisconnect = async (provider: string) => {
    const acct = user?.externalAccounts.find((a) => a.provider === provider);
    if (!acct) return;
    setLoading(provider);
    try {
      await acct.destroy();
      await user?.reload();
      toast.success(`${provider} account disconnected.`);
    } catch (err: unknown) {
      const msg = (err as { errors?: { message: string }[] })?.errors?.[0]?.message;
      toast.error(msg ?? "Failed to disconnect.");
    } finally {
      setLoading(null);
    }
  };

  const accounts = [
    { name: "Google",   provider: "google",   strategy: "oauth_google" as const,  icon: "🔵", soon: false },
    { name: "GitHub",   provider: "github",   strategy: "oauth_github" as const,  icon: "⚫", soon: false },
    { name: "LinkedIn", provider: "linkedin", strategy: null,                      icon: "🔷", soon: true  },
  ];

  return (
    <SettingSection title="Connected Accounts" description="Manage your OAuth connections">
      {accounts.map((acc) => {
        const connected = connectedProviders.has(acc.provider);
        const isLoading = loading === (connected ? acc.provider : acc.strategy);

        return (
          <SettingRow
            key={acc.name}
            label={`${acc.icon} ${acc.name}`}
            description={connected ? "Connected" : acc.soon ? "Coming soon" : "Not connected"}
          >
            {acc.soon ? (
              <span className="text-[8px] bg-zinc-200 dark:bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded font-bold tracking-wide">SOON</span>
            ) : (
              <button
                disabled={!!loading || !user}
                onClick={() =>
                  connected
                    ? handleDisconnect(acc.provider)
                    : handleConnect(acc.strategy!)
                }
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all border disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                  connected
                    ? "border-red-500/20 text-red-400 hover:bg-red-500/10"
                    : "border-amber-400/20 text-amber-400 hover:bg-amber-400/10"
                }`}
              >
                {isLoading && <Loader2 size={11} className="animate-spin" />}
                {connected ? "Disconnect" : "Connect"}
              </button>
            )}
          </SettingRow>
        );
      })}
    </SettingSection>
  );
}

// ── Active Sessions ──────────────────────────────────────────────────────────
function SessionsSection() {
  const [sessions,       setSessions]       = useState<SessionInfo[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [revoking,       setRevoking]       = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const res = await fetch("/api/account/sessions");
      if (res.ok) setSessions(await res.json());
    } catch {
      // silently fail — not critical
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const revoke = async (sessionId: string) => {
    setRevoking(sessionId);
    try {
      const res = await fetch(`/api/account/sessions/${sessionId}`, { method: "DELETE" });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        toast.success("Session revoked.");
      } else {
        toast.error("Failed to revoke session.");
      }
    } finally {
      setRevoking(null);
    }
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60_000)        return "Just now";
    if (diff < 3_600_000)     return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000)    return `${Math.floor(diff / 3_600_000)}h ago`;
    return `${Math.floor(diff / 86_400_000)}d ago`;
  };

  const deviceLabel = (s: SessionInfo) => {
    const browser = s.browserName ?? "Unknown browser";
    const type    = s.isMobile ? "Mobile" : s.deviceType === "tablet" ? "Tablet" : "Desktop";
    return `${browser} on ${type}`;
  };

  return (
    <SettingSection title="Active Sessions" description="Devices currently signed in to your account">
      {loadingSessions ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={18} className="animate-spin text-amber-400" />
        </div>
      ) : sessions.length === 0 ? (
        <p className="px-5 py-4 text-sm text-zinc-600">No active sessions found.</p>
      ) : (
        sessions.map((s) => (
          <div key={s.id} className="flex items-center justify-between px-5 py-4 gap-4">
            <div className="flex items-center gap-3">
              <Smartphone size={16} className="text-zinc-600 shrink-0" />
              <div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium flex items-center gap-2">
                  {deviceLabel(s)}
                  {s.isCurrent && (
                    <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Current
                    </span>
                  )}
                </p>
                <p className="text-xs text-zinc-600">
                  {[s.city, s.country].filter(Boolean).join(", ") || "Unknown location"} · {formatTime(s.lastActiveAt)}
                </p>
              </div>
            </div>
            {!s.isCurrent && (
              <button
                onClick={() => revoke(s.id)}
                disabled={revoking === s.id}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-40 cursor-pointer"
              >
                {revoking === s.id && <Loader2 size={11} className="animate-spin" />}
                Revoke
              </button>
            )}
          </div>
        ))
      )}
      <button
        onClick={fetchSessions}
        className="flex items-center gap-1.5 mx-5 mb-4 text-xs text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
      >
        <RefreshCw size={12} /> Refresh
      </button>
    </SettingSection>
  );
}

// ── Danger Zone ──────────────────────────────────────────────────────────────
function DangerZoneSection() {
  const { user }    = useUser();
  const { signOut } = useClerk();
  const router      = useRouter();

  const [deleteInput,     setDeleteInput]     = useState("");
  const [showDelete,      setShowDelete]      = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [signingOutAll,   setSigningOutAll]   = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE") return;
    setDeletingAccount(true);
    try {
      await user?.delete();
      router.push("/");
    } catch (err: unknown) {
      const msg = (err as { errors?: { message: string }[] })?.errors?.[0]?.message;
      toast.error(msg ?? "Failed to delete account.");
      setDeletingAccount(false);
    }
  };

  const handleSignOutAll = async () => {
    setSigningOutAll(true);
    try {
      const res = await fetch("/api/account/sessions", { method: "DELETE" });
      if (!res.ok) throw new Error();
      await signOut({ redirectUrl: "/" });
    } catch {
      toast.error("Failed to sign out of all devices.");
      setSigningOutAll(false);
    }
  };

  return (
    <SettingSection title="Danger Zone">
      <div className="p-5 space-y-4">
        <div className="border border-red-500/15 rounded-xl p-4 bg-red-500/5">
          <p className="text-sm font-semibold text-red-400 mb-1">Delete Account</p>
          <p className="text-xs text-zinc-600 mb-4">
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
          {!showDelete ? (
            <button
              onClick={() => setShowDelete(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/25 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition-all cursor-pointer"
            >
              <Trash2 size={13} /> Delete my account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-zinc-500">
                Type <span className="text-red-400 font-mono">DELETE</span> to confirm:
              </p>
              <input
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="Type DELETE"
                className="w-full bg-zinc-100 dark:bg-[#0d0d16] border border-red-500/20 rounded-xl px-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 outline-none font-mono"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteInput !== "DELETE" || deletingAccount}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold disabled:opacity-30 hover:bg-red-500/20 transition-all cursor-pointer"
                >
                  {deletingAccount && <Loader2 size={11} className="animate-spin" />}
                  Confirm Delete
                </button>
                <button
                  onClick={() => { setShowDelete(false); setDeleteInput(""); }}
                  className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleSignOutAll}
          disabled={signingOutAll}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors mt-2 disabled:opacity-40 cursor-pointer"
        >
          {signingOutAll ? <Loader2 size={15} className="animate-spin" /> : <LogOut size={15} />}
          Sign out of all devices
        </button>
      </div>
    </SettingSection>
  );
}

// ── Main Export ──────────────────────────────────────────────────────────────
export function AccountTab() {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={20} className="animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div>
      <PasswordSection />
      <ConnectedAccountsSection />
      <SessionsSection />
      <DangerZoneSection />
    </div>
  );
}
