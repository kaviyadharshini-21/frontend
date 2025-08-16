"use client"

import { useState, useCallback, useMemo } from "react"
import { InboxView } from "./inbox-view"
import { ThreadView } from "./thread-view"
import { ComposeView } from "./compose-view"
import { RemindersView } from "./reminders-view"
import { SettingsView } from "./settings-view"
import { Sidebar } from "./sidebar"
import { CalendarView } from "./calendar-view"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"

export type ViewType = "inbox" | "thread" | "compose" | "reminders" | "settings" | "calendar"

export function EmailDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>("inbox")
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const { isMobile } = useMobile()

  const handleViewChange = useCallback(
    (view: ViewType, threadId?: string) => {
      setIsTransitioning(true)
      if (isMobile) {
        setIsMobileSidebarOpen(false)
      }

      // Use requestAnimationFrame for smoother transitions
      requestAnimationFrame(() => {
        setTimeout(() => {
          setCurrentView(view)
          if (threadId) {
            setSelectedThreadId(threadId)
          }
          setIsTransitioning(false)
        }, 150)
      })
    },
    [isMobile],
  )

  useKeyboardNavigation({
    shortcuts: {
      "1": () => handleViewChange("inbox"),
      "2": () => handleViewChange("compose"),
      "3": () => handleViewChange("reminders"),
      "4": () => handleViewChange("calendar"),
      "5": () => handleViewChange("settings"),
    },
    onEscape: () => {
      if (isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false)
      } else if (currentView === "thread") {
        handleViewChange("inbox")
      }
    },
    enabled: true,
  })

  const viewTitle = useMemo(() => {
    const titles = {
      inbox: "Inbox - Email Management",
      thread: "Email Thread View",
      compose: "Compose New Email",
      reminders: "Email Reminders",
      settings: "Application Settings",
      calendar: "Calendar Management",
    }
    return titles[currentView]
  }, [currentView])

  const handleCloseMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false)
  }, [])

  const handleOpenMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(true)
  }, [])

  return (
    <div className="flex h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>

      {isMobile && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={handleCloseMobileSidebar}
          onKeyDown={(e) => e.key === "Escape" && handleCloseMobileSidebar()}
          aria-hidden="true"
        />
      )}

      <nav
        aria-label="Main navigation"
        className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"}
          transform transition-transform duration-300 ease-out
          ${isMobile && !isMobileSidebarOpen ? "-translate-x-full" : "translate-x-0"}
          md:translate-x-0
        `}
      >
        <Sidebar
          currentView={currentView}
          onViewChange={handleViewChange}
          isMobile={isMobile}
          onCloseMobile={handleCloseMobileSidebar}
        />
      </nav>

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="border-b border-border bg-card px-4 md:px-6 py-4 transition-all duration-300 ease-out flex-shrink-0"
          role="banner"
        >
          <div className="flex items-center justify-between">
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden focus-ring"
                onClick={handleOpenMobileSidebar}
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}

            <h1 className="sr-only">{viewTitle}</h1>

            <div className="flex items-center gap-2 md:gap-4">
              {currentView === "thread" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden focus-ring"
                  onClick={() => handleViewChange("inbox")}
                  aria-label="Back to inbox"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </header>

        <main
          id="main-content"
          className="flex-1 relative"
          role="main"
          aria-label={viewTitle}
          aria-live="polite"
          aria-busy={isTransitioning}
        >
          <div
            className={`absolute inset-0 transition-all duration-300 ease-out transform gpu-accelerated ${
              isTransitioning ? "opacity-0 translate-x-2" : "opacity-100 translate-x-0"
            }`}
          >
            {currentView === "inbox" && <InboxView onThreadSelect={(id) => handleViewChange("thread", id)} />}
            {currentView === "thread" && (
              <ThreadView threadId={selectedThreadId} onBack={() => handleViewChange("inbox")} />
            )}
            {currentView === "compose" && <ComposeView onBack={() => handleViewChange("inbox")} />}
            {currentView === "reminders" && <RemindersView />}
            {currentView === "settings" && <SettingsView />}
            {currentView === "calendar" && <CalendarView />}
          </div>

          {isTransitioning && (
            <div
              className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center"
              role="status"
              aria-label="Loading new view"
            >
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
