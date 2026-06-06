import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, User, Briefcase } from "lucide-react";
import { AuthLayout } from "../../layouts/AuthLayout";
import { FormCard } from "../../Components/ui/FormCard";
import { Input } from "../../Components/ui/Input";
import { Button } from "../../Components/ui/Button";

export function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    termsAccepted: false,
  });
  
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const getPasswordStrength = (password: string) => {
    if (!password) return { text: "", color: "bg-muted/20" };
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    if (strength <= 1) return { text: "Weak", color: "bg-red-500", w: "w-1/4" };
    if (strength === 2) return { text: "Fair", color: "bg-yellow-500", w: "w-2/4" };
    if (strength === 3) return { text: "Good", color: "bg-blue-500", w: "w-3/4" };
    return { text: "Strong", color: "bg-green-500", w: "w-full" };
  };

  const strength = getPasswordStrength(formData.password);

  const validate = () => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.role) newErrors.role = "Role selection is required";
    if (!formData.termsAccepted) newErrors.termsAccepted = "false" as unknown as boolean; // use a truthy string or proper type for errors

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Signup form submitted:", formData);
      navigate("/dashboard");
    }
  };


  return (
    <AuthLayout>
      <div className="mb-4">
        <h2 className="text-xl lg:text-2xl font-bold text-foreground">Create an Account</h2>
        <p className="text-xs text-muted mt-1">Join VyaparSetu to streamline your procurement.</p>
      </div>

      <FormCard>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            error={errors.fullName}
            rightIcon={<User className="w-4 h-4" />}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            rightIcon={<Mail className="w-4 h-4" />}
          />

          <div className="space-y-1.5 w-full">
            <label className="text-sm font-medium leading-none text-foreground">Role</label>
            <div className="relative">
              <select
                className={`flex h-11 w-full appearance-none rounded-xl border border-muted/30 bg-transparent px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  errors.role ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="" disabled className="text-muted">Select a role</option>
                <option value="Admin" className="text-foreground bg-card">Admin</option>
                <option value="Procurement Officer" className="text-foreground bg-card">Procurement Officer</option>
                <option value="Manager" className="text-foreground bg-card">Manager / Approver</option>
                <option value="Vendor" className="text-foreground bg-card">Vendor</option>
              </select>
              <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>
            {errors.role && <p className="text-sm font-medium text-red-500">{errors.role}</p>}
          </div>

          <div className="space-y-2">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-foreground focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            {formData.password && (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted/20 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strength.w} ${strength.color}`} />
                </div>
                <span className="text-xs font-medium text-muted w-10 text-right">{strength.text}</span>
              </div>
            )}
          </div>

          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="hover:text-foreground focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          <div className="pt-2">
            <label className="flex items-start space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded border-muted/30 text-primary focus:ring-primary bg-transparent"
              />
              <span className={`text-sm ${errors.termsAccepted ? "text-red-500" : "text-muted"} group-hover:text-foreground transition-colors`}>
                I agree to the <a href="#" className="text-primary hover:underline">Terms & Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </span>
            </label>
          </div>

          <Button type="submit" fullWidth className="mt-4">
            Create Account
          </Button>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </FormCard>
    </AuthLayout>
  );
}
