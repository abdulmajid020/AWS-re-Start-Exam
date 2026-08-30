import React from 'react';
import {
  Cloud,
  Terminal,
  Network,
  Database,
  KeyRound,
  ShieldCheck,
  FileCheck,
  ShieldAlert,
  Lock,
  Cpu,
  HardDrive,
  Workflow,
  Layers,
  Code2,
  Receipt,
  Coins,
  Server,
  GraduationCap,
  HelpCircle,
} from 'lucide-react';

interface CategoryIconProps {
  category: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = 'w-5 h-5', size }) => {
  const iconProps = { className, size };

  switch (category) {
    case 'Cloud Foundations':
      return <Cloud {...iconProps} />;
    case 'Linux & Scripting':
      return <Terminal {...iconProps} />;
    case 'Networking':
      return <Network {...iconProps} />;
    case 'Databases':
      return <Database {...iconProps} />;
    case 'Security & IAM':
      return <KeyRound {...iconProps} />;
    case 'Security & Monitoring':
      return <ShieldCheck {...iconProps} />;
    case 'Security & Compliance':
      return <FileCheck {...iconProps} />;
    case 'Security & Networking':
      return <ShieldAlert {...iconProps} />;
    case 'Security & Linux':
      return <Lock {...iconProps} />;
    case 'Compute':
      return <Cpu {...iconProps} />;
    case 'Storage':
      return <HardDrive {...iconProps} />;
    case 'DevOps & Automation':
      return <Workflow {...iconProps} />;
    case 'Cloud Architecture':
      return <Layers {...iconProps} />;
    case 'Programming & Python':
      return <Code2 {...iconProps} />;
    case 'Billing & Support':
      return <Receipt {...iconProps} />;
    case 'Cost & Optimization':
      return <Coins {...iconProps} />;
    case 'Computing Fundamentals':
      return <Server {...iconProps} />;
    case 'Certification Prep':
      return <GraduationCap {...iconProps} />;
    default:
      return <HelpCircle {...iconProps} />;
  }
};
