import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { profile, logout, refreshProfile } = useAuth();
  const [username, setUsername] = useState(profile?.username || "");
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [showEmail, setShowEmail] = useState(false);
  const [mfa, setMfa] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaSetupData, setMfaSetupData] = useState(null);
  const [mfaToken, setMfaToken] = useState("");
  const [mfaPassword, setMfaPassword] = useState("");
  const [mfaBackupCodes, setMfaBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    const token = localStorage.getItem("token");
    const resp = await fetch("/api/profiles/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, display_name: displayName }),
    });
    setSaving(false);
    if (!resp.ok) {
      const err = await resp.text();
      toast.error(err);
    } else {
      toast.success("Profile updated!");
      await refreshProfile();
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleChangePassword = async () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);
    const token = localStorage.getItem("token");
    
    try {
      const resp = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (resp.ok) {
        toast.success("Password changed successfully!");
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const error = await resp.text();
        toast.error(error || "Failed to change password");
      }
    } catch (error) {
      toast.error("Error changing password");
    }
    
    setChangingPassword(false);
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast.error("Please type 'DELETE' to confirm");
      return;
    }

    setDeletingAccount(true);
    const token = localStorage.getItem("token");
    
    try {
      const resp = await fetch("/api/profiles/me", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (resp.ok) {
        toast.success("Account deleted successfully");
        setShowDeleteModal(false);
        setDeleteConfirmation("");
        await logout();
      } else {
        toast.error("Failed to delete account");
      }
    } catch (error) {
      toast.error("Error deleting account");
    }
    
    setDeletingAccount(false);
  };

  const handleMfaToggle = async () => {
    if (!mfa) {
      // Setup MFA
      await setupMfa();
    } else {
      // Show disable confirmation
      setShowMfaModal(true);
    }
  };

  const setupMfa = async () => {
    const token = localStorage.getItem("token");
    try {
      const resp = await fetch("/api/auth/mfa/setup", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (resp.ok) {
        const data = await resp.json();
        setMfaSetupData(data);
        setShowMfaModal(true);
      } else {
        toast.error("Failed to setup MFA");
      }
    } catch (error) {
      toast.error("Error setting up MFA");
    }
  };

  const handleMfaVerify = async () => {
    if (!mfaToken || mfaToken.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const resp = await fetch("/api/auth/mfa/verify-and-enable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ token: mfaToken }),
      });

      if (resp.ok) {
        const data = await resp.json();
        toast.success("MFA enabled successfully!");
        setMfaBackupCodes(data.backupCodes);
        setShowBackupCodes(true);
        setMfa(true);
        setMfaSetupData(null);
        setMfaToken("");
      } else {
        const error = await resp.text();
        toast.error(error || "Invalid code");
      }
    } catch (error) {
      toast.error("Error verifying MFA");
    }
  };

  const handleMfaDisable = async () => {
    if (!mfaPassword) {
      toast.error("Password required to disable MFA");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const resp = await fetch("/api/auth/mfa/disable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ password: mfaPassword }),
      });

      if (resp.ok) {
        toast.success("MFA disabled successfully");
        setMfa(false);
        setShowMfaModal(false);
        setMfaPassword("");
      } else {
        const error = await resp.text();
        toast.error(error || "Failed to disable MFA");
      }
    } catch (error) {
      toast.error("Error disabling MFA");
    }
  };

  // Load MFA status on component mount
  useEffect(() => {
    const loadMfaStatus = async () => {
      const token = localStorage.getItem("token");
      try {
        const resp = await fetch("/api/auth/mfa/status", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (resp.ok) {
          const data = await resp.json();
          setMfa(data.enabled);
        }
      } catch (error) {
        console.error("Error loading MFA status:", error);
      }
    };

    loadMfaStatus();
  }, []);

  const handleLanguageChange = (language: string) => {
    // TODO: Implement language change
    toast.info(`Language changed to ${language}`);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-foreground text-center">Account Settings</h1>

      <div className="glass rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">General Information</h2>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)}
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Display Name</label>
          <input value={displayName} onChange={e => setDisplayName(e.target.value)}
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Email</label>
          <div className="flex items-center gap-2">
            <input type={showEmail ? "text" : "password"} value={profile?.email || ""} readOnly
              className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
            <button onClick={() => setShowEmail(!showEmail)} className="text-muted-foreground hover:text-foreground">
              {showEmail ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button onClick={saveProfile} disabled={saving}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Language Settings</h2>
        <select 
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground"
        >
          <option value="en">🇺🇸 English (US)</option>
          <option value="es">🇪🇸 Español</option>
          <option value="fr">🇫🇷 Français</option>
        </select>
      </div>

      <div className="glass rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Security Settings</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Multi-factor authentication</p>
            <p className="text-xs text-muted-foreground">Adds a layer of security to your account</p>
          </div>
          <button onClick={handleMfaToggle}
            className={`w-10 h-5 rounded-full transition-colors ${mfa ? "bg-primary" : "bg-muted"}`}>
            <div className={`w-4 h-4 rounded-full bg-foreground transition-transform ${mfa ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      <div className="glass rounded-xl p-6 space-y-2">
        <h2 className="text-sm font-semibold text-foreground mb-3">Account Actions</h2>
        <button 
          onClick={handleChangePassword}
          disabled={changingPassword}
          className="w-full py-2 rounded-lg bg-muted text-foreground text-sm hover:bg-muted/80 transition-colors disabled:opacity-50"
        >
          {changingPassword ? "Processing..." : "Change Password"}
        </button>
        <button 
          onClick={handleDeleteAccount}
          disabled={deletingAccount}
          className="w-full py-2 rounded-lg bg-destructive/20 text-destructive text-sm hover:bg-destructive/30 transition-colors disabled:opacity-50"
        >
          {deletingAccount ? "Deleting..." : "Delete Account"}
        </button>
        <button onClick={handleLogout} className="w-full py-2 rounded-lg bg-destructive/20 text-destructive text-sm hover:bg-destructive/30 transition-colors mt-2">
          ↪ Logout
        </button>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="glass rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Change Password</h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Current Password</label>
                <div className="flex items-center gap-2">
                  <input 
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                    placeholder="Enter current password"
                  />
                  <button 
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">New Password</label>
                <div className="flex items-center gap-2">
                  <input 
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                    placeholder="Enter new password"
                  />
                  <button 
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">Confirm New Password</label>
                <div className="flex items-center gap-2">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                    placeholder="Confirm new password"
                  />
                  <button 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-muted text-foreground text-sm hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handlePasswordSubmit}
                disabled={changingPassword}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {changingPassword ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-xl p-6 w-full max-w-md mx-4 border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground text-destructive">Delete Account</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive font-medium mb-2">⚠️ This action cannot be undone!</p>
                <p className="text-xs text-muted-foreground">
                  Deleting your account will permanently remove:
                </p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Your profile and all customization</li>
                  <li>• All social links and data</li>
                  <li>• Account settings and preferences</li>
                  <li>• All associated data</li>
                </ul>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Type <span className="text-destructive font-mono">DELETE</span> to confirm
                </label>
                <input 
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground font-mono"
                  placeholder="Type DELETE"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation("");
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-muted text-foreground text-sm hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                disabled={deletingAccount || deleteConfirmation !== "DELETE"}
                className="flex-1 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                {deletingAccount ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MFA Setup/Disable Modal */}
      {showMfaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {mfa ? "Disable MFA" : "Setup MFA"}
              </h3>
              <button 
                onClick={() => {
                  setShowMfaModal(false);
                  setMfaSetupData(null);
                  setMfaToken("");
                  setMfaPassword("");
                  setShowBackupCodes(false);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!mfa && mfaSetupData && !showBackupCodes && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Scan this QR code with Google Authenticator or similar app
                  </p>
                  <div className="flex justify-center mb-4">
                    <img 
                      src={mfaSetupData.qrCode} 
                      alt="MFA QR Code" 
                      className="w-48 h-48 border-2 border-border rounded-lg"
                    />
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-2">Or enter manually:</p>
                    <code className="text-xs font-mono break-all">{mfaSetupData.manualEntryKey}</code>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Enter 6-digit code</label>
                  <input 
                    type="text"
                    value={mfaToken}
                    onChange={(e) => setMfaToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground font-mono text-center"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>

                <button 
                  onClick={handleMfaVerify}
                  className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
                >
                  Enable MFA
                </button>
              </div>
            )}

            {showBackupCodes && (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <p className="text-sm text-green-400 font-medium mb-2">✅ MFA Enabled!</p>
                  <p className="text-xs text-muted-foreground">
                    Save these backup codes safely. You can use them to access your account if you lose your device.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-2">Backup Codes:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {mfaBackupCodes.map((code, index) => (
                      <code key={index} className="text-xs font-mono bg-background px-2 py-1 rounded border text-center">
                        {code}
                      </code>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setShowMfaModal(false);
                    setShowBackupCodes(false);
                    setMfaBackupCodes([]);
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
                >
                  Done
                </button>
              </div>
            )}

            {mfa && (
              <div className="space-y-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-sm text-destructive font-medium mb-2">⚠️ Disable MFA</p>
                  <p className="text-xs text-muted-foreground">
                    Disabling MFA will make your account less secure. You'll need to enter your password to confirm.
                  </p>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Enter your password</label>
                  <input 
                    type="password"
                    value={mfaPassword}
                    onChange={(e) => setMfaPassword(e.target.value)}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                    placeholder="Enter password"
                  />
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setShowMfaModal(false);
                      setMfaPassword("");
                    }}
                    className="flex-1 px-4 py-2 rounded-lg bg-muted text-foreground text-sm hover:bg-muted/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleMfaDisable}
                    className="flex-1 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm hover:bg-destructive/90 transition-colors"
                  >
                    Disable MFA
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
