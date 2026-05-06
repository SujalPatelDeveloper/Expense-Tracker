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
  ChevronRight
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import './Settings.css';

const Settings = () => {
  const { user, setUser, clearAllData } = useTransactions();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({ ...user });
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser(formData);
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleResetData = () => {
    clearAllData();
    setShowConfirmReset(false);
    setSaveStatus('reset');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <Globe size={18} /> },
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
          {saveStatus === 'success' && (
            <div className="save-toast success">Profile updated successfully!</div>
          )}
          {saveStatus === 'reset' && (
            <div className="save-toast warning">All data has been cleared.</div>
          )}
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
                    <div className="avatar-large">{formData.name.charAt(0).toUpperCase()}</div>
                    <button type="button" className="secondary-btn">Change Avatar</button>
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
                      <h4>Dark Mode</h4>
                      <p>Switch between light and dark theme</p>
                    </div>
                    <div className="theme-toggle-minimal">
                      <button className="active"><Moon size={14} /></button>
                      <button><Sun size={14} /></button>
                    </div>
                  </div>
                </div>
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
              </div>
            )}

            {(activeTab === 'billing' || !['profile', 'preferences', 'data'].includes(activeTab)) && (
              <div className="tab-pane empty">
                <Shield size={48} />
                <h3>Secure Module</h3>
                <p>Billing and Security modules are available in the Enterprise plan.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirmReset && (
        <div className="modal-overlay">
          <div className="modal-container glass-panel fade-in delete-confirm">
            <div className="confirm-icon">
              <AlertTriangle size={40} />
            </div>
            <h2>Absolute Reset?</h2>
            <p>You are about to wipe your entire financial history. Are you absolutely sure?</p>
            <div className="confirm-actions">
              <button className="secondary-btn" onClick={() => setShowConfirmReset(false)}>No, Keep Data</button>
              <button className="primary-btn delete-btn" onClick={handleResetData}>Yes, Wipe Everything</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
