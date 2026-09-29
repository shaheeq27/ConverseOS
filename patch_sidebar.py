import re

with open("components/layout/ProjectSidebar.tsx", "r") as f:
    content = f.read()

# Replace mobile header
mobile_old = """<div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L2 6v8l8 4 8-4V6l-8-4z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M2 6l8 4 8-4M10 10v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-sm font-semibold text-[var(--color-text-primary)]" >
            {projectName}
          </div>
        </div>"""

mobile_new = """<div className="flex items-center gap-3">
          <ConverseLogo variant="icon" className="w-8 h-8" />
          <div className="flex flex-col">
            <ConverseLogo variant="wordmark" className="h-3 w-auto mb-0.5" hideTagline />
            <div className="text-sm font-semibold text-[var(--color-text-primary)]" >
              {projectName}
            </div>
          </div>
        </div>"""

content = content.replace(mobile_old, mobile_new)

# Replace desktop header
desktop_old = """<div className="p-4 border-b border-[var(--color-border)] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L2 6v8l8 4 8-4V6l-8-4z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M2 6l8 4 8-4M10 10v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[var(--color-text-muted)] font-medium">ConverseOS</div>
              <div
                className="text-sm font-semibold text-[var(--color-text-primary)] truncate"
                title={projectName}
              >
                {projectName}
              </div>
            </div>
          )}"""

desktop_new = """<div className="p-4 border-b border-[var(--color-border)] flex items-center gap-3">
          <ConverseLogo variant="icon" className="w-8 h-8 flex-shrink-0" />
          {!collapsed && (
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <ConverseLogo variant="wordmark" className="h-3 w-auto mb-0.5" hideTagline />
              <div
                className="text-sm font-semibold text-[var(--color-text-primary)] truncate"
                title={projectName}
              >
                {projectName}
              </div>
            </div>
          )}"""

content = content.replace(desktop_old, desktop_new)

with open("components/layout/ProjectSidebar.tsx", "w") as f:
    f.write(content)
