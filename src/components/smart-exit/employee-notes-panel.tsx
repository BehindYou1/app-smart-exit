"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  AlertCircle, 
  User, 
  Clock,
  CheckCircle2,
  Send
} from "lucide-react";
import type { EmployeeNote } from "@/lib/smart-exit/types";
import { useState } from "react";

export default function EmployeeNotesPanel() {
  const [notes, setNotes] = useState<EmployeeNote[]>([
    {
      id: "note-1",
      employeeId: "EMP-001",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: "suspicious_behavior",
      description: "Customer seemed nervous during self-checkout, multiple item scans cancelled",
      priority: "high",
      resolved: false
    },
    {
      id: "note-2",
      employeeId: "EMP-002",
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      type: "system_issue",
      description: "QR scanner had delay of ~3 seconds, might need calibration",
      priority: "medium",
      resolved: false
    },
    {
      id: "note-3",
      employeeId: "EMP-001",
      timestamp: new Date(Date.now() - 120 * 60 * 1000),
      type: "general",
      description: "Peak hour (12-2pm) - recommend additional staff at exit",
      priority: "low",
      resolved: true
    }
  ]);

  const [newNote, setNewNote] = useState({
    type: "general" as EmployeeNote["type"],
    description: "",
    priority: "medium" as EmployeeNote["priority"]
  });

  const handleSubmitNote = () => {
    if (!newNote.description.trim()) return;

    const note: EmployeeNote = {
      id: `note-${Date.now()}`,
      employeeId: "EMP-CURRENT",
      timestamp: new Date(),
      type: newNote.type,
      description: newNote.description,
      priority: newNote.priority,
      resolved: false
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({ type: "general", description: "", priority: "medium" });
  };

  const handleResolve = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, resolved: true } : note
    ));
  };

  const getPriorityColor = (priority: EmployeeNote["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300";
      case "low":
        return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300";
    }
  };

  const getTypeIcon = (type: EmployeeNote["type"]) => {
    switch (type) {
      case "suspicious_behavior":
        return <AlertCircle className="h-4 w-4" />;
      case "customer_complaint":
        return <User className="h-4 w-4" />;
      case "system_issue":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes === 1) return "1 minute ago";
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return "1 hour ago";
    return `${hours} hours ago`;
  };

  const unresolvedNotes = notes.filter(n => !n.resolved);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Employee Notes & Reports
            </CardTitle>
            <CardDescription>
              Report suspicious behavior or system issues
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950">
            {unresolvedNotes.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form para nova nota */}
        <div className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 space-y-4">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
            Submit New Report
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="note-type" className="text-xs">Type</Label>
              <Select 
                value={newNote.type} 
                onValueChange={(value: EmployeeNote["type"]) => 
                  setNewNote(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger id="note-type" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="suspicious_behavior">Suspicious Behavior</SelectItem>
                  <SelectItem value="customer_complaint">Customer Complaint</SelectItem>
                  <SelectItem value="system_issue">System Issue</SelectItem>
                  <SelectItem value="general">General Note</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note-priority" className="text-xs">Priority</Label>
              <Select 
                value={newNote.priority} 
                onValueChange={(value: EmployeeNote["priority"]) => 
                  setNewNote(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger id="note-priority" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note-description" className="text-xs">Description</Label>
            <Textarea
              id="note-description"
              placeholder="Describe what you observed or the issue you encountered..."
              value={newNote.description}
              onChange={(e) => setNewNote(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[80px] resize-none"
            />
          </div>

          <Button 
            onClick={handleSubmitNote}
            disabled={!newNote.description.trim()}
            className="w-full gap-2"
            size="sm"
          >
            <Send className="h-4 w-4" />
            Submit Report
          </Button>
        </div>

        {/* Lista de notas */}
        <div>
          <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">
            Recent Reports
          </h3>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {notes.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No reports yet
                  </p>
                </div>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-3 rounded-lg border transition-all ${
                      note.resolved 
                        ? "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-60" 
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${note.resolved ? "text-gray-400" : "text-gray-600 dark:text-gray-400"}`}>
                        {getTypeIcon(note.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge 
                              variant="outline" 
                              className={note.resolved ? "bg-gray-100 dark:bg-gray-800" : getPriorityColor(note.priority)}
                            >
                              {note.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {note.type.replace(/_/g, " ")}
                            </Badge>
                            {note.resolved && (
                              <Badge variant="outline" className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Resolved
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                          {note.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {note.employeeId}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {getTimeAgo(note.timestamp)}
                            </span>
                          </div>
                          {!note.resolved && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-6 text-xs"
                              onClick={() => handleResolve(note.id)}
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
