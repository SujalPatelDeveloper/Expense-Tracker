import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Trash2, 
  Save, 
  CreditCard,
  Moon,
  Sun,
  AlertTriangle,
  ChevronRight,
  Key
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { useToast } from '../context/ToastContext';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import './Settings.css';

const Settings = () => {
  const { user, updateUserProfile, updateUserPassword, clearAllData, deleteAccount, isDark, toggleTheme, uploadAvatar } = useTransactions();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({ ...user });
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const hasPassword = user?.providers?.includes('email');
  
  const [passwordForm, setPasswordForm] = useState({
    old: '',
    new: '',
    confirm: ''
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateUserProfile(formData);
    addToast('Profile updated successfully!', 'success');
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      addToast('New passwords do not match', 'error');
      return;
    }
    
    // Pass old password only if they already have a password set
    const { error, success } = await updateUserPassword(
      hasPassword ? passwordForm.old : null, 
      passwordForm.new
    );

    if (error) {
      addToast(error, 'error');
    } else if (success) {
      addToast(hasPassword ? 'Password updated successfully' : 'Password assigned successfully', 'success');
      setPasswordForm({ old: '', new: '', confirm: '' });
    }
  };

  const handleResetData = () => {
    clearAllData();
    setShowConfirmReset(false);
    addToast('All data has been cleared.', 'info');
  };


  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      addToast('Uploading avatar...', 'info');
      const avatarUrl = await uploadAvatar(file);
      if (avatarUrl) {
        setFormData({ ...formData, avatar: avatarUrl });
        await updateUserProfile({ ...formData, avatar: avatarUrl });
        addToast('Avatar updated successfully', 'success');
      } else {
        addToast('Failed to upload avatar. Is the avatars bucket created?', 'error');
      }
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <Globe size={18} /> },
    { id: 'security', label: 'Security', icon: <Key size={18} /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard size={18} /> },
    { id: 'data', label: 'Data Management', icon: <Trash2 size={18} /> },
  ];

  return (
    <div className="settings-container">
      <div className="fade-in">
        <header className="page-header">
          <div>
            <h1>Settings</h1>
            <p>Manage your account and application preferences</p>
          </div>
        </header>

        <div className="settings-layout">
          {/* Tabs Sidebar */}
          <aside className="settings-tabs glass-panel">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <ChevronRight size={16} className="chevron" />
              </button>
            ))}
          </aside>

          {/* Tab Content */}
          <main className="settings-content glass-panel">
            {activeTab === 'profile' && (
              <div className="tab-pane">
                <h3>Profile Settings</h3>
                <form onSubmit={handleSaveProfile} className="settings-form">
                  <div className="profile-upload">
                    <div className="avatar-large">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="Avatar" className="avatar-img" />
                      ) : (
                        formData.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="avatar-actions">
                      <label className="secondary-btn cursor-pointer">
                        Change Avatar
                        <input type="file" hidden onChange={handleAvatarChange} accept="image/*" />
                      </label>
                      {formData.avatar && (
                        <button 
                          type="button" 
                          className="text-btn danger"
                          onClick={() => setFormData({...formData, avatar: null})}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Display Name</label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Member Plan</label>
                      <input type="text" value={formData.plan} disabled />
                    </div>
                    <div className="form-group">
                      <label>Default Currency</label>
                      <select 
                        value={formData.currency}
                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="primary-btn">
                    <Save size={18} /> Save Profile
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="tab-pane">
                <h3>Application Preferences</h3>
                <div className="pref-list">
                  <div className="pref-item">
                    <div className="pref-info">
                      <h4>Notifications</h4>
                      <p>Receive alerts for monthly budget limits</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="pref-item">
                    <div className="pref-info">
                      <h4>Display Mode</h4>
                      <p>Switch between light and dark theme</p>
                    </div>
                    <div className="theme-toggle-minimal">
                      <button 
                        className={!isDark ? 'active' : ''} 
                        onClick={() => !isDark || toggleTheme()}
                      >
                        <Sun size={14} />
                        <span>Light</span>
                      </button>
                      <button 
                        className={isDark ? 'active' : ''} 
                        onClick={() => isDark || toggleTheme()}
                      >
                        <Moon size={14} />
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="tab-pane">
                <h3>{hasPassword ? 'Change Password' : 'Set Password'}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  {hasPassword 
                    ? "Update your password to keep your account secure." 
                    : "You currently sign in with a social account. Set a password to allow email sign-in."}
                </p>
                <form onSubmit={handleUpdatePassword} className="settings-form">
                  {hasPassword && (
                    <div className="form-group">
                      <label>Old Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={passwordForm.old}
                        onChange={(e) => setPasswordForm({...passwordForm, old: e.target.value})}
                        required
                      />
                    </div>
                  )}
                  <div className="form-row">
                    <div className="form-group">
                      <label>New Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={passwordForm.new}
                        onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <button type="submit" className="primary-btn">
                    <Save size={18} /> {hasPassword ? 'Update Password' : 'Set Password'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="tab-pane">
                <h3>Data Management</h3>
                <div className="danger-zone">
                  <div className="danger-info">
                    <AlertTriangle size={24} className="warning-icon" />
                    <div>
                      <h4>Reset Application</h4>
                      <p>This will permanently delete all your transactions and reset your profile. This action cannot be undone.</p>
                    </div>
                  </div>
                  <button 
                    className="primary-btn delete-btn" 
                    onClick={() => setShowConfirmReset(true)}
                  >
                    Clear All Data
                  </button>
                </div>

                <div className="danger-zone" style={{ marginTop: '1.5rem', border: '1px solid rgba(244, 63, 94, 0.4)' }}>
                  <div className="danger-info">
                    <Trash2 size={24} className="warning-icon" />
                    <div>
                      <h4>Delete Account</h4>
                      <p>Permanently remove your account and all associated data. This action is irreversible.</p>
                    </div>
                  </div>
                  <button 
                    className="primary-btn delete-btn" 
                    onClick={() => setShowConfirmDelete(true)}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {(activeTab === 'billing') && (
              <div className="tab-pane empty">
                <Shield size={48} />
                <h3>Secure Module</h3>
                <p>Billing modules are available in the Enterprise plan.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <DeleteConfirmModal 
        isOpen={showConfirmReset}
        onClose={() => setShowConfirmReset(false)}
        onConfirm={handleResetData}
        title="Absolute Reset?"
        message="You are about to wipe your entire financial history. Are you absolutely sure? This cannot be undone."
      />

      <DeleteConfirmModal 
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={deleteAccount}
        title="Delete Account?"
        message="This will wipe your profile and all your financial history. You will be logged out and cannot recover this data."
      />
    </div>
  );
};

export default Settings;
