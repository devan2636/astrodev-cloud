import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit2, Trash2, Eye } from "lucide-react";

interface Document {
  id: string;
  name: string;
  google_drive_url: string;
  password: string;
  description: string | null;
  file_size: string | null;
  display_order: number;
}

export function AdminDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editDoc, setEditDoc] = useState<Document | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    google_drive_url: "",
    password: "",
    description: "",
    file_size: "",
  });
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error("Error fetching documents", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (editDoc) {
        const { error } = await supabase
          .from("documents")
          .update({
            name: formData.name,
            google_drive_url: formData.google_drive_url,
            password: formData.password,
            description: formData.description || null,
            file_size: formData.file_size || null,
          })
          .eq("id", editDoc.id);

        if (error) throw error;
        setMessage({ type: "success", text: "Document updated." });
      } else {
        const { error } = await supabase.from("documents").insert({
          name: formData.name,
          google_drive_url: formData.google_drive_url,
          password: formData.password,
          description: formData.description || null,
          file_size: formData.file_size || null,
        });

        if (error) throw error;
        setMessage({ type: "success", text: "Document added." });
      }

      resetForm();
      await fetchDocuments();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save document" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (doc: Document) => {
    setEditDoc(doc);
    setFormData({
      name: doc.name,
      google_drive_url: doc.google_drive_url,
      password: doc.password,
      description: doc.description || "",
      file_size: doc.file_size || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document?")) return;

    try {
      const { error } = await supabase.from("documents").delete().eq("id", id);
      if (error) throw error;
      await fetchDocuments();
      setMessage({ type: "success", text: "Document deleted." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to delete" });
    }
  };

  const resetForm = () => {
    setEditDoc(null);
    setShowForm(false);
    setFormData({
      name: "",
      google_drive_url: "",
      password: "",
      description: "",
      file_size: "",
    });
  };

  const extractDriveId = (url: string) => {
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : null;
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-white p-4 sm:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-accent-blue font-semibold">Documents</p>
          <h3 className="text-xl font-semibold">Manage shared documents</h3>
          <p className="text-sm text-muted-foreground">Add documents to share via /share page</p>
        </div>
      </div>

      {message && (
        <div
          className={`mb-4 rounded-lg border px-3 py-2 text-sm ${
            message.type === "error"
              ? "border-destructive/40 bg-destructive/10 text-destructive"
              : "border-emerald-400/40 bg-emerald-50 text-emerald-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {!showForm && !editDoc && (
        <div className="flex justify-end mb-4">
          <Button onClick={() => setShowForm(true)} className="bg-accent-blue hover:bg-accent-blue/90">
            <PlusCircle className="w-4 h-4 mr-2" /> Add Document
          </Button>
        </div>
      )}

      {(showForm || editDoc) && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 p-4 border border-border/60 rounded-lg bg-slate-50">
          <Input
            placeholder="Document Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            placeholder="Google Drive URL"
            value={formData.google_drive_url}
            onChange={(e) => setFormData({ ...formData, google_drive_url: e.target.value })}
            required
          />
          {formData.google_drive_url && extractDriveId(formData.google_drive_url) && (
            <div className="border border-border/60 rounded-lg overflow-hidden bg-white">
              <div className="bg-slate-100 px-3 py-2 text-sm font-medium text-muted-foreground">
                Preview Dokumen
              </div>
              <iframe
                src={`https://drive.google.com/file/d/${extractDriveId(formData.google_drive_url)}/preview`}
                className="w-full h-96"
                allow="autoplay"
                title="Document Preview"
              />
            </div>
          )}
          <Input
            placeholder="Password (untuk akses)"
            type="text"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Input
            placeholder="File Size (optional, e.g. 2.5 MB)"
            value={formData.file_size}
            onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
          />
          <Textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : editDoc ? "Update Document" : "Add Document"}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading documents...</div>
      ) : documents.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No documents yet. Add one to get started.</div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => {
            const driveId = extractDriveId(doc.google_drive_url);
            return (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-border/60 rounded-lg hover:bg-slate-50 transition"
              >
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{doc.name}</div>
                  {doc.description && <div className="text-sm text-muted-foreground mt-1">{doc.description}</div>}
                  <div className="text-xs text-muted-foreground mt-1">
                    Password: <span className="font-mono bg-slate-200 px-2 py-0.5 rounded">{doc.password}</span>
                    {doc.file_size && <span className="ml-2">• {doc.file_size}</span>}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {driveId && (
                    <a
                      href={`https://drive.google.com/file/d/${driveId}/preview`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-slate-200 rounded"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleEdit(doc)}
                    className="p-2 hover:bg-slate-200 rounded"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 hover:bg-red-100 text-red-600 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
