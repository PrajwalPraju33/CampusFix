import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Wrench,
  FileCheck,
  XCircle,
  PauseCircle,
  RotateCcw
} from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const getStatusConfig = (st) => {
    switch (st) {
      case 'SUBMITTED':
        return { label: 'Submitted', class: 'badge-submitted', icon: <Clock size={12} /> };
      case 'VERIFIED':
        return { label: 'Verified', class: 'badge-verified', icon: <FileCheck size={12} /> };
      case 'ASSIGNED':
        return { label: 'Assigned', class: 'badge-assigned', icon: <Wrench size={12} /> };
      case 'IN_PROGRESS':
        return { label: 'In Progress', class: 'badge-in_progress', icon: <Wrench size={12} /> };
      case 'RESOLUTION_SUBMITTED':
        return { label: 'Resolved (Pending Approval)', class: 'badge-resolution_submitted', icon: <CheckCircle2 size={12} /> };
      case 'CLOSED':
        return { label: 'Closed & Resolved', class: 'badge-closed', icon: <CheckCircle2 size={12} /> };
      case 'REJECTED':
        return { label: 'Rejected', class: 'badge-rejected', icon: <XCircle size={12} /> };
      case 'ON_HOLD':
        return { label: 'On Hold', class: 'badge-on_hold', icon: <PauseCircle size={12} /> };
      case 'REOPENED':
        return { label: 'Reopened', class: 'badge-reopened', icon: <RotateCcw size={12} /> };
      default:
        return { label: st || 'Unknown', class: 'badge-submitted', icon: <Clock size={12} /> };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`badge ${config.class}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const p = priority || 'MEDIUM';
  const getPriorityClass = () => {
    switch (p) {
      case 'LOW': return 'priority-low';
      case 'MEDIUM': return 'priority-medium';
      case 'HIGH': return 'priority-high';
      case 'CRITICAL': return 'priority-critical';
      default: return 'priority-medium';
    }
  };

  return (
    <span className={`badge ${getPriorityClass()}`}>
      {p}
    </span>
  );
};
