import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Brain, Search, MoreVertical, Trash2, Settings, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Model {
  id: number;
  name: string;
  type: string;
  version: string;
  status: string;
  accuracy: number;
  description: string;
  createdAt: string;
}

const initialModels: Model[] = [
  { id: 1, name: "EmpaSense Core v3", type: "NLP", version: "3.2.1", status: "Active", accuracy: 94.5, description: "Primary empathy detection model using NLP", createdAt: "2025-12-01" },
  { id: 2, name: "Sentiment Analyzer", type: "Classification", version: "2.1.0", status: "Active", accuracy: 91.2, description: "Multi-class sentiment classification model", createdAt: "2025-11-15" },
  { id: 3, name: "Voice Tone Detector", type: "Audio", version: "1.4.0", status: "Active", accuracy: 87.8, description: "Audio-based tone and emotion detection", createdAt: "2025-10-20" },
  { id: 4, name: "Empathy Score Predictor", type: "Regression", version: "2.0.3", status: "Training", accuracy: 89.1, description: "Predicts empathy score from conversation features", createdAt: "2026-01-10" },
  { id: 5, name: "Keyword Extractor v1", type: "NLP", version: "1.0.0", status: "Deprecated", accuracy: 82.3, description: "Extracts empathy-related keywords from text", createdAt: "2025-06-05" },
];

export default function Models() {
  const [models, setModels] = useState<Model[]>(initialModels);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("NLP");
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleAddModel = () => {
    if (!name.trim() || !version.trim()) {
      toast({ title: "Validation error", description: "Name and version are required.", variant: "destructive" });
      return;
    }
    const newModel: Model = {
      id: Date.now(),
      name: name.trim(),
      type,
      version: version.trim(),
      status: "Training",
      accuracy: 0,
      description: description.trim(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setModels((prev) => [...prev, newModel]);
    setName("");
    setType("NLP");
    setVersion("");
    setDescription("");
    setOpen(false);
    toast({ title: "Model added", description: `${newModel.name} has been added successfully.` });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active": return "default" as const;
      case "Training": return "secondary" as const;
      case "Deprecated": return "destructive" as const;
      default: return "secondary" as const;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI/ML Models</h1>
            <p className="text-muted-foreground mt-1">Manage empathy analysis models</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Model
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Model</DialogTitle>
                <DialogDescription>Register a new AI/ML model for empathy analysis.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="model-name">Model Name</Label>
                  <Input id="model-name" placeholder="e.g. Empathy Detector v2" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Model Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NLP">NLP</SelectItem>
                      <SelectItem value="Classification">Classification</SelectItem>
                      <SelectItem value="Regression">Regression</SelectItem>
                      <SelectItem value="Audio">Audio</SelectItem>
                      <SelectItem value="Multimodal">Multimodal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model-version">Version</Label>
                  <Input id="model-version" placeholder="e.g. 1.0.0" value={version} onChange={(e) => setVersion(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model-desc">Description</Label>
                  <Textarea id="model-desc" placeholder="Describe what this model does..." value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleAddModel}>Add Model</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Models</CardDescription>
              <CardTitle className="text-3xl">{models.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Models</CardDescription>
              <CardTitle className="text-3xl">{models.filter((m) => m.status === "Active").length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Accuracy</CardDescription>
              <CardTitle className="text-3xl">
                {(models.filter((m) => m.accuracy > 0).reduce((a, m) => a + m.accuracy, 0) / models.filter((m) => m.accuracy > 0).length || 0).toFixed(1)}%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              All Models
            </CardTitle>
            <CardDescription>View and manage all AI/ML models</CardDescription>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search models..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium">{model.name}</TableCell>
                    <TableCell><Badge variant="outline">{model.type}</Badge></TableCell>
                    <TableCell>{model.version}</TableCell>
                    <TableCell><Badge variant={getStatusVariant(model.status)}>{model.status}</Badge></TableCell>
                    <TableCell>
                      <span className={model.accuracy >= 90 ? "text-success font-semibold" : ""}>{model.accuracy > 0 ? `${model.accuracy}%` : "—"}</span>
                    </TableCell>
                    <TableCell>{model.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Details</DropdownMenuItem>
                          <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Configure</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
