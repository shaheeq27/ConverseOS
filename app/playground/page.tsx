"use client";

import React, { useState } from "react";
import {
  Heading,
  Text,
  Label,
  Caption,
  Code,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Select,
  Checkbox,
  Switch,
  Badge,
  Separator,
  ScrollArea,
  Skeleton,
  Avatar,
  Dialog,
  ConfirmDialog,
  DropdownMenu,
  DropdownItem,
  Tooltip,
  Tabs,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Loading,
  EmptyState,
  ErrorState,
  toast,
} from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";

export default function ComponentPlaygroundPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [switchState, setSwitchState] = useState(true);
  const [checkboxState, setCheckboxState] = useState(true);

  return (
    <div className="min-h-screen text-[var(--color-text-primary)] p-8 max-w-7xl mx-auto selection:bg-cyan-500/30">
      {/* Header */}
      <header className="mb-12 border-b border-[var(--color-border)] pb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Internal Design System Showcase
          </div>
          <Heading level={1}>ConverseOS Component Playground</Heading>
          <Text variant="secondary" className="mt-2">
            Interactive UI component primitives gallery, typography, themes, and UI states.
          </Text>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            Theme: {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => toast.success("Sonner Toast Notification System Working!")}
          >
            Trigger Toast
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="mb-8">
        <Tabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: "overview", label: "Buttons & Inputs" },
            { id: "typography", label: "Typography & Badges" },
            { id: "cards", label: "Cards & Tables" },
            { id: "avatars", label: "Avatars & Modals" },
            { id: "states", label: "UI States & Loaders" },
          ]}
        />
      </div>

      <Separator className="mb-8" />

      {/* Section 1: Buttons & Inputs */}
      {activeTab === "overview" && (
        <div className="space-y-10">
          <section>
            <Heading level={3} className="mb-4">
              Buttons & Variants
            </Heading>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="primary" isLoading>
                Loading
              </Button>
            </div>
          </section>

          <section>
            <Heading level={3} className="mb-4">
              Form Controls
            </Heading>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Standard Input</Label>
                <Input placeholder="Enter workspace name..." />
              </div>
              <div>
                <Label>Input with Error</Label>
                <Input placeholder="Enter email..." error="Invalid email address" />
              </div>
              <div>
                <Label>Select Dropdown</Label>
                <Select
                  options={[
                    { value: "gemini", label: "Google Gemini 1.5 Flash" },
                    { value: "gpt4", label: "OpenAI GPT-4o" },
                    { value: "claude", label: "Anthropic Claude 3.5" },
                  ]}
                />
              </div>
              <div>
                <Label>Switch & Checkbox</Label>
                <div className="flex items-center gap-6 mt-2">
                  <Switch checked={switchState} onChange={setSwitchState} label="Enable RAG" />
                  <Checkbox
                    checked={checkboxState}
                    onChange={(e) => setCheckboxState(e.target.checked)}
                    label="Accept terms"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Label>Textarea</Label>
              <Textarea placeholder="Enter custom AI system instructions..." />
            </div>
          </section>
        </div>
      )}

      {/* Section 2: Typography & Badges */}
      {activeTab === "typography" && (
        <div className="space-y-8">
          <section>
            <Heading level={3} className="mb-4">
              Typography Hierarchy
            </Heading>
            <div className="space-y-3 bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--color-border)]">
              <Heading level={1}>Heading 1 — Enterprise AI OS</Heading>
              <Heading level={2}>Heading 2 — Workspace Overview</Heading>
              <Heading level={3}>Heading 3 — AI Assistant Model</Heading>
              <Heading level={4}>Heading 4 — System Prompt Configuration</Heading>
              <Text variant="primary">Primary Text: Standard readable paragraph text.</Text>
              <Text variant="secondary">Secondary Text: Muted subtitle and description text.</Text>
              <Caption>Caption Text: Timestamp 2 hours ago</Caption>
              <div>
                Code snippet: <Code>npm run seed</Code>
              </div>
            </div>
          </section>

          <section>
            <Heading level={3} className="mb-4">
              Badges
            </Heading>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary Admin</Badge>
              <Badge variant="secondary">Gemini 1.5</Badge>
              <Badge variant="success">Active (200 OK)</Badge>
              <Badge variant="warning">Low Stock</Badge>
              <Badge variant="danger">Error (500)</Badge>
            </div>
          </section>
        </div>
      )}

      {/* Section 3: Cards & Tables */}
      {activeTab === "cards" && (
        <div className="space-y-8">
          <section>
            <Heading level={3} className="mb-4">
              Cards
            </Heading>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Assistant</CardTitle>
                  <CardDescription>Configured for Shopify & CRM</CardDescription>
                </CardHeader>
                <CardContent>
                  <Text variant="secondary">
                    Provides automated product recommendations and customer pipeline analytics.
                  </Text>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="primary">
                    Configure
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Base (RAG)</CardTitle>
                  <CardDescription>Vector Embeddings Engine</CardDescription>
                </CardHeader>
                <CardContent>
                  <Text variant="secondary">
                    Upload documents to train custom workspace AI assistants.
                  </Text>
                </CardContent>
                <CardFooter>
                  <Badge variant="success">14 Documents Indexed</Badge>
                </CardFooter>
              </Card>
            </div>
          </section>

          <section>
            <Heading level={3} className="mb-4">
              Data Table
            </Heading>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold text-white">Alice Kumar</TableCell>
                  <TableCell>
                    <Badge variant="primary">Admin</Badge>
                  </TableCell>
                  <TableCell>alice@converseos.ai</TableCell>
                  <TableCell>
                    <Badge variant="success">Online</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold text-white">Bob Chen</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Member</Badge>
                  </TableCell>
                  <TableCell>bob@converseos.ai</TableCell>
                  <TableCell>
                    <Badge variant="default">Offline</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>
        </div>
      )}

      {/* Section 4: Avatars & Modals */}
      {activeTab === "avatars" && (
        <div className="space-y-8">
          <section>
            <Heading level={3} className="mb-4">
              Avatars & Indicators
            </Heading>
            <div className="flex items-center gap-6">
              <Avatar name="Alice Kumar" status="online" size="lg" />
              <Avatar name="Bob Chen" status="busy" size="lg" />
              <Avatar isAI status="online" size="lg" />
              <Tooltip content="Custom Tooltip Indicator">
                <Avatar name="Carol Singh" status="away" size="lg" />
              </Tooltip>
            </div>
          </section>

          <section>
            <Heading level={3} className="mb-4">
              Dialogs & Dropdowns
            </Heading>
            <div className="flex items-center gap-4">
              <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
                Open Standard Dialog
              </Button>
              <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>
                Open Confirm Dialog
              </Button>

              <DropdownMenu trigger={<Button variant="outline">Dropdown Menu ▾</Button>}>
                <DropdownItem onClick={() => toast("Profile clicked")}>Profile</DropdownItem>
                <DropdownItem onClick={() => toast("Settings clicked")}>Settings</DropdownItem>
                <DropdownItem danger onClick={() => toast("Logout clicked")}>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </div>

            <Dialog
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              title="Workspace Settings"
              description="Manage configuration for this workspace"
            >
              <div className="space-y-4 pt-2">
                <Label>Workspace Name</Label>
                <Input defaultValue="Acme Corp" />
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                    Close
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => setIsDialogOpen(false)}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </Dialog>

            <ConfirmDialog
              isOpen={isConfirmOpen}
              onClose={() => setIsConfirmOpen(false)}
              onConfirm={() => {
                toast.error("Item deleted");
                setIsConfirmOpen(false);
              }}
              title="Delete Assistant"
              description="Are you sure you want to delete this AI Assistant? This action cannot be undone."
              variant="danger"
              confirmText="Delete"
            />
          </section>
        </div>
      )}

      {/* Section 5: UI States & Loaders */}
      {activeTab === "states" && (
        <div className="space-y-8">
          <section>
            <Heading level={3} className="mb-4">
              Loading Skeletons & Spinners
            </Heading>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </Card>
              <Card>
                <Loading label="Fetching dynamic analytics..." />
              </Card>
            </div>
          </section>

          <section>
            <Heading level={3} className="mb-4">
              Empty & Error States
            </Heading>
            <EmptyState
              title="No Conversations Found"
              description="You haven't started any chat sessions in this workspace yet."
              actionLabel="Start New Chat"
              onAction={() => toast("New chat initiated")}
            />
            <ErrorState
              title="Failed to Load Dashboard Config"
              message="Could not connect to MongoDB configuration database."
              onRetry={() => toast("Retrying connection...")}
            />
          </section>
        </div>
      )}
    </div>
  );
}
