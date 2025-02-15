
import { SettingsForm } from "@/components/profile/SettingsForm";

const Settings = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-6 max-w-md">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <SettingsForm />
      </div>
    </div>
  );
};

export default Settings;
