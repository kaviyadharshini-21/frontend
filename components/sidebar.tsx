"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Inbox, PenTool, Bell, Settings, Zap, Calendar, X, User } from "lucide-react"
import type { ViewType } from "./email-dashboard"

interface SidebarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  isMobile?: boolean
  onCloseMobile?: () => void
}

export function Sidebar({ currentView, onViewChange, isMobile = false, onCloseMobile }: SidebarProps) {
  const menuItems = [
    {
      id: "inbox" as ViewType,
      label: "Inbox",
      icon: Inbox,
      count: 12,
      shortcut: "Ctrl+1",
      description: "View your email inbox",
    },
    {
      id: "compose" as ViewType,
      label: "Compose",
      icon: PenTool,
      shortcut: "Ctrl+2",
      description: "Compose a new email",
    },
    {
      id: "reminders" as ViewType,
      label: "Reminders",
      icon: Bell,
      count: 3,
      shortcut: "Ctrl+3",
      description: "View email reminders and follow-ups",
    },
    {
      id: "calendar" as ViewType,
      label: "Calendar",
      icon: Calendar,
      count: 2,
      shortcut: "Ctrl+4",
      description: "Manage calendar and meetings",
    },
    {
      id: "settings" as ViewType,
      label: "Settings",
      icon: Settings,
      shortcut: "Ctrl+5",
      description: "Application settings and preferences",
    },
    {
      id: "profile" as ViewType,
      label: "Profile",
      icon: User,
      shortcut: "Ctrl+6",
      description: "Manage your profile and account settings",
    },
  ]

  const handleItemClick = (viewType: ViewType) => {
    onViewChange(viewType)
    if (isMobile && onCloseMobile) {
      onCloseMobile()
    }
  }

  return (
    <aside
      className={`
        ${isMobile ? "w-80" : "w-64"} 
        bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-out
        h-full
      `}
      role="complementary"
      aria-label="Application navigation"
    >
      <div className="p-4 md:p-6 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div
              className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg"
              role="img"
              aria-label="IntelliMail logo"
            >
              <Zap className="w-4 h-4 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />
            </div>
            <h2 className="font-bold text-sidebar-foreground transition-colors duration-200 group-hover:text-primary">
              Zentar
            </h2>
          </div>

          {isMobile && onCloseMobile && (
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden focus-ring"
              onClick={onCloseMobile}
              aria-label="Close navigation menu"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <nav role="navigation" aria-label="Main menu">
          <ul className="space-y-2" role="list">
            {menuItems.map((item, index) => (
              <li key={item.id} role="listitem">
                <Button
                  variant={currentView === item.id ? "default" : "ghost"}
                  className={`
                    w-full justify-start gap-3 group relative overflow-hidden
                    transition-all duration-300 ease-out focus-ring
                    ${isMobile ? "h-12 text-base" : "h-11"}
                    hover:scale-[1.02] hover:shadow-sm
                    ${
                      currentView === item.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }
                  `}
                  onClick={() => handleItemClick(item.id)}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                  aria-current={currentView === item.id ? "page" : undefined}
                  aria-describedby={`${item.id}-description`}
                  title={isMobile ? undefined : `${item.description} (${item.shortcut})`}
                >
                  {currentView === item.id && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground rounded-r-full transition-all duration-300 ease-out"
                      aria-hidden="true"
                    />
                  )}

                  <item.icon
                    className={`${isMobile ? "w-5 h-5" : "w-4 h-4"} transition-all duration-200 group-hover:scale-110`}
                    aria-hidden="true"
                  />

                  <span className="flex-1 text-left transition-all duration-200">{item.label}</span>

                  {item.count && (
                    <Badge
                      variant="secondary"
                      className={`
                        ml-auto transition-all duration-300 ease-out
                        ${item.count > 0 ? "animate-pulse" : ""}
                        group-hover:scale-110
                        ${isMobile ? "text-sm px-2 py-1" : ""}
                      `}
                      aria-label={`${item.count} ${item.label.toLowerCase()}`}
                    >
                      {item.count}
                    </Badge>
                  )}

                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"
                    aria-hidden="true"
                  />
                </Button>

                <span id={`${item.id}-description`} className="sr-only">
                  {item.description}. {!isMobile && `Keyboard shortcut: ${item.shortcut}`}
                </span>
              </li>
            ))}
          </ul>
        </nav>

        {!isMobile && (
          <div className="mt-8 p-3 bg-sidebar-accent rounded-lg">
            <h3 className="text-sm font-medium text-sidebar-accent-foreground mb-2">Keyboard Shortcuts</h3>
            <div className="text-xs text-sidebar-accent-foreground/70 space-y-1">
              <div>Ctrl+1-6: Navigate sections</div>
              <div>Escape: Go back</div>
              <div>Tab: Navigate elements</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
