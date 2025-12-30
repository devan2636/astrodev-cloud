import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, FileText, Download, ExternalLink, X } from "lucide-react";

interface Document {
  id: string;
  name: string;
  google_drive_url: string;
  password: string;
  description: string | null;
  file_size: string | null;
}

export default function Share() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [passwordModal, setPasswordModal] = useState<Document | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (doc: Document) => {
    setPasswordModal(doc);
    setPasswordInput("");
    setError("");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModal) return;

    if (passwordInput === passwordModal.password) {
      setPreviewDoc(passwordModal);
      setPasswordModal(null);
      setPasswordInput("");
      setError("");
    } else {
      setError("Password salah. Silakan coba lagi.");
    }
  };

  const closePasswordModal = () => {
    setPasswordModal(null);
    setPasswordInput("");
    setError("");
  };

  const extractDriveId = (url: string) => {
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : null;
  };

  const closePreview = () => {
    setPreviewDoc(null);
  };

  return (
    <div className="min-h-screen bg-secondary/30 py-12 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-20 left-0 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-80 h-80 bg-accent-emerald/10 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue/10 border border-accent-blue/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-accent-blue" />
            <span className="text-sm font-medium text-accent-blue">Shared Documents</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Document Library</h1>
          <p className="text-lg text-muted-foreground">Access and view password-protected documents</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent-blue/10 mb-6 mx-auto">
              <FileText className="w-10 h-10 text-accent-blue" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No documents yet</h3>
            <p className="text-muted-foreground">Check back later for shared documents</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="group glass-card-strong rounded-2xl overflow-hidden hover-lift"
              >
                <div className="h-32 bg-gradient-to-br from-accent-blue/10 via-accent-purple/5 to-accent-cyan/10 flex items-center justify-center relative">
                  <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-md">
                    <FileText className="w-8 h-8 text-accent-blue" />
                  </div>
                  {doc.file_size && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-white/90 backdrop-blur-sm text-xs font-medium text-muted-foreground shadow-sm">
                      {doc.file_size}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{doc.name}</h3>

                  {doc.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{doc.description}</p>
                  )}

                  <Button
                    onClick={() => handleViewClick(doc)}
                    className="w-full bg-accent-blue hover:bg-accent-blue/90 shadow-md hover:shadow-lg transition-all"
                  >
                    <Lock className="w-4 h-4 mr-2" /> View Document
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <a href="/" className="inline-flex items-center gap-2 text-accent-blue hover:underline font-medium">
            ← Back to Home
          </a>
        </div>
      </div>

      {/* Password Modal */}
      {passwordModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closePasswordModal}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-accent-blue/10">
                  <Lock className="w-5 h-5 text-accent-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Password Required</h3>
                  <p className="text-sm text-muted-foreground">{passwordModal.name}</p>
                </div>
              </div>
              <button
                onClick={closePasswordModal}
                className="text-muted-foreground hover:text-foreground transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter document password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  autoFocus
                  className="w-full"
                />
                {error && (
                  <p className="mt-2 text-sm text-destructive">{error}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-accent-blue hover:bg-accent-blue/90">
                  Unlock Document
                </Button>
                <Button type="button" variant="outline" onClick={closePasswordModal}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closePreview}
        >
          <div
            className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{previewDoc.name}</h3>
              <button
                onClick={closePreview}
                className="text-muted-foreground hover:text-foreground transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={`https://drive.google.com/file/d/${extractDriveId(previewDoc.google_drive_url)}/preview`}
                className="w-full h-full"
                allow="autoplay"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
