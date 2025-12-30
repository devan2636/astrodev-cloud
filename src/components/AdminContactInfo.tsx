import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type ContactInfo = {
  email: string;
  location: string;
  responseTime: string;
  github: string;
  linkedin: string;
};

interface AdminContactInfoProps {
  contactInfo: ContactInfo;
  onContactInfoChange: (info: ContactInfo) => void;
  contactInfoLoading: boolean;
  contactInfoSaving: boolean;
  contactInfoStatus: string;
  onSave: () => void;
}

export function AdminContactInfo({
  contactInfo,
  onContactInfoChange,
  contactInfoLoading,
  contactInfoSaving,
  contactInfoStatus,
  onSave,
}: AdminContactInfoProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-4 sm:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-accent-blue font-semibold">Contact Info</p>
          <h3 className="text-xl font-semibold">Edit contact details</h3>
          <p className="text-sm text-muted-foreground">Update contact information shown on the public contact page.</p>
        </div>
        <div className="text-xs text-muted-foreground">
          {contactInfoLoading ? "Loading..." : contactInfoStatus}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={contactInfo.email}
            onChange={(e) => onContactInfoChange({ ...contactInfo, email: e.target.value })}
          />
          
          <label className="text-sm font-medium text-foreground">Location</label>
          <Input
            placeholder="Indonesia"
            value={contactInfo.location}
            onChange={(e) => onContactInfoChange({ ...contactInfo, location: e.target.value })}
          />
          
          <label className="text-sm font-medium text-foreground">Response Time</label>
          <Input
            placeholder="< 24 hours"
            value={contactInfo.responseTime}
            onChange={(e) => onContactInfoChange({ ...contactInfo, responseTime: e.target.value })}
          />
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">GitHub URL</label>
          <Input
            type="url"
            placeholder="https://github.com/yourusername"
            value={contactInfo.github}
            onChange={(e) => onContactInfoChange({ ...contactInfo, github: e.target.value })}
          />
          
          <label className="text-sm font-medium text-foreground">LinkedIn URL</label>
          <Input
            type="url"
            placeholder="https://linkedin.com/in/yourusername"
            value={contactInfo.linkedin}
            onChange={(e) => onContactInfoChange({ ...contactInfo, linkedin: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={onSave} disabled={contactInfoSaving} className="bg-accent-blue hover:bg-accent-blue/90">
          {contactInfoSaving ? "Saving..." : "Save Contact Info"}
        </Button>
      </div>
    </div>
  );
}
