
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

  getEpisodes(runId: string) { return this.episodes.filter(e => e.runId === runId); }
  addEpisode(e: EpisodeTest) { this.episodes.push(e); }

  getSuites(runId: string) { return this.suites.filter(s => s.runId === runId); }
  addSuite(s: PrioritizedSuite) { this.suites.push(s); }
}

export const db = new MockDB();
