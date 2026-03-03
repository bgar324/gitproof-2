import { Section } from "./section";
import { Switch } from "./switch";

interface NotificationsSectionProps {
  emailNotifs: boolean;
  onEmailNotifsChange: (emailNotifs: boolean) => void;
  disabled?: boolean;
}

export function NotificationsSection({
  emailNotifs,
  onEmailNotifsChange,
  disabled = false,
}: NotificationsSectionProps) {
  return (
    <Section
      title="Notifications"
      description="Store whether you want optional product update emails."
    >
      <Switch
        label="Product Updates"
        checked={emailNotifs}
        onCheckedChange={onEmailNotifsChange}
        disabled={disabled}
      />
    </Section>
  );
}
