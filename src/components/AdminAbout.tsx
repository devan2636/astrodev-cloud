import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type AboutContent = {
  heading: string;
  pill: string;
  paragraphs: string[];
  highlights: { number: string; label: string; description?: string }[];
  profile: {
    name: string;
    title: string;
    location: string;
    education: string;
    focus: string;
    emoji: string;
  };
};

interface AdminAboutProps {
  aboutContent: AboutContent;
  onContentChange: (content: AboutContent) => void;
  aboutLoading: boolean;
  aboutSaving: boolean;
  aboutStatus: string;
  onSave: () => void;
}

export function AdminAbout({
  aboutContent,
  onContentChange,
  aboutLoading,
  aboutSaving,
  aboutStatus,
  onSave,
}: AdminAboutProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-4 sm:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-accent-blue font-semibold">Public content</p>
          <h3 className="text-xl font-semibold">About section</h3>
          <p className="text-sm text-muted-foreground">Edit teks yang tampil di halaman About pada web publik.</p>
        </div>
        <div className="text-xs text-muted-foreground">
          {aboutLoading ? "Loading..." : aboutStatus}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Heading</label>
          <Input
            value={aboutContent.heading}
            onChange={(e) => onContentChange({ ...aboutContent, heading: e.target.value })}
          />
          <label className="text-sm font-medium text-foreground">Pill</label>
          <Input
            value={aboutContent.pill}
            onChange={(e) => onContentChange({ ...aboutContent, pill: e.target.value })}
          />
          <label className="text-sm font-medium text-foreground">Paragraphs</label>
          {aboutContent.paragraphs.map((p, idx) => (
            <Textarea
              key={idx}
              rows={3}
              value={p}
              onChange={(e) => {
                const next = [...aboutContent.paragraphs];
                next[idx] = e.target.value;
                onContentChange({ ...aboutContent, paragraphs: next });
              }}
            />
          ))}
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Profile</label>
          <Input
            placeholder="Name"
            value={aboutContent.profile.name}
            onChange={(e) => onContentChange({ ...aboutContent, profile: { ...aboutContent.profile, name: e.target.value } })}
            className="mb-2"
          />
          <Input
            placeholder="Title"
            value={aboutContent.profile.title}
            onChange={(e) => onContentChange({ ...aboutContent, profile: { ...aboutContent.profile, title: e.target.value } })}
            className="mb-2"
          />
          <Input
            placeholder="Location"
            value={aboutContent.profile.location}
            onChange={(e) => onContentChange({ ...aboutContent, profile: { ...aboutContent.profile, location: e.target.value } })}
            className="mb-2"
          />
          <Input
            placeholder="Education"
            value={aboutContent.profile.education}
            onChange={(e) => onContentChange({ ...aboutContent, profile: { ...aboutContent.profile, education: e.target.value } })}
            className="mb-2"
          />
          <Input
            placeholder="Focus"
            value={aboutContent.profile.focus}
            onChange={(e) => onContentChange({ ...aboutContent, profile: { ...aboutContent.profile, focus: e.target.value } })}
            className="mb-2"
          />
          <Input
            placeholder="Emoji"
            value={aboutContent.profile.emoji}
            onChange={(e) => onContentChange({ ...aboutContent, profile: { ...aboutContent.profile, emoji: e.target.value } })}
            className="mb-2"
          />
          <div className="text-xs text-muted-foreground">Sorotan tetap mengikuti format angka/label yang ada.</div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={onSave} disabled={aboutSaving} className="bg-accent-blue hover:bg-accent-blue/90">
          {aboutSaving ? "Saving..." : "Save About content"}
        </Button>
      </div>
    </div>
  );
}
