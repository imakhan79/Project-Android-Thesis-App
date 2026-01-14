
import React, { useState } from 'react';
import { db } from '../services/mockDb';
import { Project } from '../types';
import { Plus, Folder } from 'lucide-react';

interface Props {
  onSelect: (p: Project) => void;
}

export const ProjectSelector: React.FC<Props> = ({ onSelect }) => {
  const [projects, setProjects] = useState(db.getProjects());
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', desc: '', ver: '13.0', profile: 'Pixel 6' });

  const handleCreate = () => {
    const p: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProject.name,
      description: newProject.desc,
      androidVersion: newProject.ver,
      deviceProfile: newProject.profile,
      createdAt: Date.now()
    };
    db.addProject(p);
    setProjects(db.getProjects());
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Select Project</h2>
          <p className="text-slate-500">Choose an existing workspace or create a new one to start testing.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <div 
            key={p.id} 
            onClick={() => onSelect(p)}
            className="bg-white border border-slate-200 p-6 rounded-xl cursor-pointer hover:border-indigo-400 hover:shadow-md transition group"
          >
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
              <Folder size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{p.name}</h3>
            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{p.description}</p>
            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
              <span>SDK: {p.androidVersion}</span>
              <span>Created: {new Date(p.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-6">Create New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                <input 
                  type="text" 
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Finance App QA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  value={newProject.desc}
                  onChange={e => setNewProject({...newProject, desc: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  rows={3}
                  placeholder="Goals and scope..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Version</label>
                  <select 
                    value={newProject.ver}
                    onChange={e => setNewProject({...newProject, ver: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>14.0</option>
                    <option>13.0</option>
                    <option>12.0</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Device Profile</label>
                  <select 
                    value={newProject.profile}
                    onChange={e => setNewProject({...newProject, profile: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>Pixel 7</option>
                    <option>Pixel 6 Pro</option>
                    <option>Nexus 10</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-500 font-medium">Cancel</button>
              <button onClick={handleCreate} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
