type ViewMode = 'list' | 'grid' | 'hero'

interface ViewSwitcherProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export default function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-1 border border-gray-200">
      <button
        onClick={() => onViewChange('list')}
        className={`px-3 py-2 rounded-md transition-all flex items-center gap-2 ${
          currentView === 'list'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title="List View"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="text-sm font-medium">Lista</span>
      </button>

      <button
        onClick={() => onViewChange('grid')}
        className={`px-3 py-2 rounded-md transition-all flex items-center gap-2 ${
          currentView === 'grid'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title="Grid View"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
        <span className="text-sm font-medium">Grade</span>
      </button>

      <button
        onClick={() => onViewChange('hero')}
        className={`px-3 py-2 rounded-md transition-all flex items-center gap-2 ${
          currentView === 'hero'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title="Hero View"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-sm font-medium">Hero</span>
      </button>
    </div>
  )
}
