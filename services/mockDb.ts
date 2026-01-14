
import { 
  Project, ApkMetadata, GUIComponent, Run, 
  GUIState, Transition, EpisodeTest, PrioritizedSuite, 
  ComponentCategory, RunType, RunStatus 
} from '../types';

class MockDB {
  private projects: Project[] = [];
  private apks: ApkMetadata[] = [];
  private components: GUIComponent[] = [];
  private runs: Run[] = [];
  private states: GUIState[] = [];
  private transitions: Transition[] = [];
  private episodes: EpisodeTest[] = [];
  private suites: PrioritizedSuite[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    const p1: Project = {
      id: 'p1',
      name: 'E-Commerce App v2',
      description: 'Production testing for global shopping app',
      androidVersion: '13.0',
      deviceProfile: 'Pixel 6 Pro',
      createdAt: Date.now() - 86400000 * 5
    };
    this.projects.push(p1);

    this.apks.push({
      id: 'apk1',
      projectId: 'p1',
      filename: 'shopping-release-v2.1.apk',
      versionInfo: '2.1.0',
      permissions: ['INTERNET', 'CAMERA', 'LOCATION'],
      uploadedAt: Date.now() - 86400000 * 4
    });

    this.components.push(
      { id: 'c1', projectId: 'p1', typeCategory: ComponentCategory.GESTURE, selector: '//Carousel[@id="hero"]', riskScore: 8.5, source: 'static' },
      { id: 'c2', projectId: 'p1', typeCategory: ComponentCategory.RUNTIME, selector: '//RecyclerView[@id="product_list"]', riskScore: 7.2, source: 'dynamic' },
      { id: 'c3', projectId: 'p1', typeCategory: ComponentCategory.MODAL, selector: '//Dialog[@id="promo_popup"]', riskScore: 9.1, source: 'static' }
    );

    // Seed mock runs and states for dynamic graph
    const r1: Run = {
      id: 'run1',
      projectId: 'p1',
      runType: RunType.DYNAMIC,
      configJson: '{}',
      startedAt: Date.now() - 3600000,
      status: RunStatus.COMPLETED
    };
    this.runs.push(r1);

    this.states.push(
      { id: 's1', runId: 'run1', hash: 'x9f2', activityName: 'MainActivity', viewSummary: 'Home Screen' },
      { id: 's2', runId: 'run1', hash: 'a1b3', activityName: 'ProfileActivity', viewSummary: 'User Settings' },
      { id: 's3', runId: 'run1', hash: 'c5d6', activityName: 'ProductDetail', viewSummary: 'Item View' }
    );

    this.transitions.push(
      { id: 't1', runId: 'run1', fromStateHash: 'x9f2', toStateHash: 'a1b3', actionType: 'CLICK', actionMeta: 'btn_profile' },
      { id: 't2', runId: 'run1', fromStateHash: 'x9f2', toStateHash: 'c5d6', actionType: 'TAP', actionMeta: 'item_card' },
      { id: 't3', runId: 'run1', fromStateHash: 'c5d6', toStateHash: 'x9f2', actionType: 'BACK', actionMeta: 'system' }
    );
  }

  getProjects() { return this.projects; }
  addProject(p: Project) { this.projects.push(p); }
  
  getApks(pid: string) { return this.apks.filter(a => a.projectId === pid); }
  addApk(apk: ApkMetadata) { this.apks.push(apk); }

  getComponents(pid: string) { return this.components.filter(c => c.projectId === pid); }
  addComponent(c: GUIComponent) { this.components.push(c); }

  getRuns(pid: string) { return this.runs.filter(r => r.projectId === pid); }
  addRun(r: Run) { this.runs.push(r); }
  updateRunStatus(id: string, status: RunStatus) {
    const run = this.runs.find(r => r.id === id);
    if (run) {
      run.status = status;
      if (status === RunStatus.COMPLETED) run.endedAt = Date.now();
    }
  }

  getStates(runId: string) { return this.states.filter(s => s.runId === runId); }
  getTransitions(runId: string) { return this.transitions.filter(t => t.runId === runId); }

  getEpisodes(runId: string) { return this.episodes.filter(e => e.runId === runId); }
  addEpisode(e: EpisodeTest) { this.episodes.push(e); }

  getSuites(runId: string) { return this.suites.filter(s => s.runId === runId); }
  addSuite(s: PrioritizedSuite) { this.suites.push(s); }
}

export const db = new MockDB();
