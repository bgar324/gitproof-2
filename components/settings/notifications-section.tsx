import { Section } from "./section";
import { Switch } from "./switch";

interface NotificationsSectionProps {
  emailNotifs: boolean;
  onEmailNotifsChange: (emailNotifs: boolean) => void;
}

export function NotificationsSection({
  emailNotifs,
  onEmailNotifsChange,
}: NotificationsSectionProps) {
  return (
    <Section title="Notifications" description="We promise not to spam.">
      <Switch
        label="Product Updates"
        checked={emailNotifs}
        onCheckedChange={onEmailNotifsChange}
      />
    </Section>
  );
}
