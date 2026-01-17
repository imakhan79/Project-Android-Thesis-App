
export type SourceType = 'camera' | 'screen' | 'image' | 'color';

export interface Source {
  id: string;
  type: SourceType;
  name: string;
  visible: boolean;
  muted: boolean;
  volume: number;
  zIndex: number;
  stream?: MediaStream;
}

export interface Scene {
  id: string;
  name: string;
  sources: Source[];
}

export interface AcademyLesson {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  quiz: {
    question: string;
    options: string[];
    answer: number;
  }[];
}

export interface StreamSettings {
  url: string;
  key: string;
  bitrate: number;
  fps: number;
  resolution: string;
}

// Fixed: Defined and exported missing core types and enums used across the application

export enum ComponentCategory {
  GESTURE = 'GESTURE',
  RUNTIME = 'RUNTIME',
  MODAL = 'MODAL',
  CONTEXT = 'CONTEXT'
}

export enum RunType {
  DYNAMIC = 'DYNAMIC',
  RL = 'RL',
  GA = 'GA'
}

export enum RunStatus {
  COMPLETED = 'COMPLETED',
  RUNNING = 'RUNNING',
  FAILED = 'FAILED'
}

export interface Project {
  id: string;
  name: string;
  description: string;
  androidVersion: string;
  deviceProfile: string;
  createdAt: number;
}

export interface ApkMetadata {
  id: string;
  projectId: string;
  filename: string;
  versionInfo: string;
  permissions: string[];
  uploadedAt: number;
}

export interface GUIComponent {
  id: string;
  projectId: string;
  typeCategory: ComponentCategory;
  selector: string;
  riskScore: number;
  source: 'static' | 'dynamic';
}

export interface Run {
  id: string;
  projectId: string;
  runType: RunType;
  configJson: string;
  startedAt: number;
  endedAt?: number;
  status: RunStatus;
}

export interface GUIState {
  id: string;
  runId: string;
  hash: string;
  activityName: string;
  viewSummary: string;
}

export interface Transition {
  id: string;
  runId: string;
  fromStateHash: string;
  toStateHash: string;
  actionType: string;
  actionMeta: string;
}

export interface EpisodeTest {
  id: string;
  runId: string;
  sequenceJson: string;
  totalReward: number;
  depth: number;
  novelty: number;
  faultLikelihood: number;
  timeCost: number;
  crashFlag: boolean;
}

export interface PrioritizedSuite {
  id: string;
  runId: string;
  weightsJson: string;
  rankedTestIdsJson: string;
}
