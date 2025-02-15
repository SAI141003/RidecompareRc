
import { Input } from "@/components/ui/input";

interface PersonalDetailsFormProps {
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  mobileNumber: string;
  onChange: (field: string, value: string) => void;
}

export const PersonalDetailsForm = ({
  username,
  firstName,
  middleName,
  lastName,
  mobileNumber,
  onChange,
}: PersonalDetailsFormProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            required
            className="bg-white/50 backdrop-blur-sm border-white/20 focus:border-purple-500 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            required
            className="bg-white/50 backdrop-blur-sm border-white/20 focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Middle Name (Optional)"
          value={middleName}
          onChange={(e) => onChange("middleName", e.target.value)}
          className="bg-white/50 backdrop-blur-sm border-white/20 focus:border-purple-500 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => onChange("username", e.target.value)}
          required
          className="bg-white/50 backdrop-blur-sm border-white/20 focus:border-purple-500 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <Input
          type="tel"
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={(e) => onChange("mobileNumber", e.target.value)}
          required
          className="bg-white/50 backdrop-blur-sm border-white/20 focus:border-purple-500 transition-colors"
        />
      </div>
    </>
  );
};
