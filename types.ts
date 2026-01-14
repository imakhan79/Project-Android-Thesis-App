
export enum ComponentCategory {
  GESTURE = 'Gesture-sensitive',
  RUNTIME = 'Runtime-loaded',
  MODAL = 'Modal/Interruptive',
  CONTEXT = 'Context-aware'
}

export enum RunType {
  DYNAMIC = 'dynamic',
  RL = 'rl',
  GA = 'ga'
}

export enum RunStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed'
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
  screenshotPath?: string;
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
