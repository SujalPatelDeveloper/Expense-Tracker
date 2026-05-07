import React from 'react';
import { X, Shield, Scale, Lock } from 'lucide-react';
import './LegalModal.css';

const LegalModal = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const content = {
    privacy: {
      title: 'Privacy Policy',
      icon: <Lock size={24} />,
      text: (
        <>
          <p>At FinVista, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
          <h4>1. Information Collection</h4>
          <p>We collect information you provide directly to us, such as when you create an account, update your profile, or sync your financial data.</p>
          <h4>2. Data Usage</h4>
          <p>Your data is used solely to provide and improve our services, including personalizing your experience and generating financial insights.</p>
          <h4>3. Data Security</h4>
          <p>We implement industry-standard security measures to protect your data from unauthorized access or disclosure. We never sell your personal data to third parties.</p>
          <h4>4. Your Rights</h4>
          <p>You have the right to access, update, or delete your personal information at any time through your account settings.</p>
        </>
      )
    },
    terms: {
      title: 'Terms of Service',
      icon: <Scale size={24} />,
      text: (
        <>
          <p>By using FinVista, you agree to these terms. Please read them carefully.</p>
          <h4>1. Acceptance of Terms</h4>
          <p>By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          <h4>2. Use License</h4>
          <p>Permission is granted to use FinVista for personal, non-commercial financial tracking and management purposes.</p>
          <h4>3. Limitations</h4>
          <p>In no event shall FinVista be liable for any damages arising out of the use or inability to use the services.</p>
          <h4>4. Account Security</h4>
          <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.</p>
        </>
      )
    },
    security: {
      title: 'Security Overview',
      icon: <Shield size={24} />,
      text: (
        <>
          <p>FinVista is built with multi-layered security to ensure your financial intelligence remains private and secure.</p>
          <h4>1. Encryption</h4>
          <p>All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption standards.</p>
          <h4>2. Authentication</h4>
          <p>We use Supabase Auth for secure identity management, supporting multi-factor authentication and social login providers.</p>
          <h4>3. Infrastructure</h4>
          <p>Our services are hosted on world-class, SOC2-compliant cloud infrastructure with 24/7 monitoring and automated threat detection.</p>
          <h4>4. Responsible Disclosure</h4>
          <p>We welcome security researchers to report potential vulnerabilities through our bug bounty program.</p>
        </>
      )
    }
  };

  const activeContent = content[type] || content.privacy;

  return (
    <div className="legal-modal-overlay" onClick={onClose}>
      <div className="legal-modal-container glass-panel fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="legal-modal-header">
          <div className="header-title">
            <div className="icon-box-small">{activeContent.icon}</div>
            <h2>{activeContent.title}</h2>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="legal-modal-body custom-scrollbar">
          {activeContent.text}
          <div className="legal-footer-note">
            <p>Last updated: May 2026. For further questions, please contact support@finvista.io</p>
          </div>
        </div>
        <div className="legal-modal-footer">
          <button className="primary-btn" onClick={onClose}>I Understand</button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
