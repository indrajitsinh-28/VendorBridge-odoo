import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, User, Briefcase, Phone, Globe, FileText } from "lucide-react";
import { AuthLayout } from "../../layouts/AuthLayout";
import { FormCard } from "../../Components/ui/FormCard";
import { Input } from "../../Components/ui/Input";
import { Button } from "../../Components/ui/Button";

// Country list — comprehensive but not exhaustive
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria",
  "Bangladesh", "Belgium", "Bolivia", "Brazil", "Cambodia", "Canada", "Chile",
  "China", "Colombia", "Croatia", "Czech Republic", "Denmark", "Ecuador",
  "Egypt", "Ethiopia", "Finland", "France", "Germany", "Ghana", "Greece",
  "Guatemala", "Hungary", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait",
  "Malaysia", "Mexico", "Morocco", "Myanmar", "Nepal", "Netherlands",
  "New Zealand", "Nigeria", "Norway", "Oman", "Pakistan", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Saudi Arabia", "Singapore", "South Africa", "South Korea", "Spain",
  "Sri Lanka", "Sweden", "Switzerland", "Taiwan", "Tanzania", "Thailand",
  "Turkey", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam",
  "Yemen", "Zambia", "Zimbabwe",
];

export function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    role: "",
    additionalInfo: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const set = (key: keyof typeof formData, value: string | boolean) =>
    setFormData((f) => ({ ...f, [key]: value }));

  // ── Password strength ────────────────────────────────────────────────────
  const getStrength = (pw: string) => {
    if (!pw) return { text: "", color: "", w: "w-0" };
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    if (s <= 1) return { text: "Weak",   color: "bg-red-500",    w: "w-1/4" };
    if (s === 2) return { text: "Fair",   color: "bg-yellow-500", w: "w-2/4" };
    if (s === 3) return { text: "Good",   color: "bg-blue-500",   w: "w-3/4" };
    return           { text: "Strong", color: "bg-green-500",  w: "w-full" };
  };
  const strength = getStrength(formData.password);

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const e: Partial<Record<keyof typeof formData, string>> = {};
    if (!formData.firstName.trim())  e.firstName = "First name is required";
    if (!formData.lastName.trim())   e.lastName  = "Last name is required";
    if (!formData.email)             e.email     = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Invalid email";
    if (!formData.phone.trim())      e.phone     = "Phone number is required";
    if (!formData.country)           e.country   = "Please select a country";
    if (!formData.role)              e.role      = "Role selection is required";
    if (!formData.password)          e.password  = "Password is required";
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!formData.termsAccepted)     e.termsAccepted = "You must accept the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Signup form submitted:", formData);
      navigate("/dashboard");
    }
  };

  // ── Shared select class ─────────────────────────────────────────────────
  const selectCls = (hasError?: string) =>
    `flex h-11 w-full appearance-none rounded-xl border bg-transparent px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
      hasError
        ? "border-red-500 focus-visible:ring-red-500"
        : "border-muted/30"
    }`;

  return (
    <AuthLayout>
      <div className="mb-4">
        <h2 className="text-xl lg:text-2xl font-bold text-foreground">Create an Account</h2>
        <p className="text-xs text-muted mt-1">Join VendorBridge to streamline your procurement.</p>
      </div>

      <FormCard className="max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── Row 1: First & Last name ── */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              error={errors.firstName}
              rightIcon={<User className="w-4 h-4" />}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              error={errors.lastName}
            />
          </div>

          {/* ── Email ── */}
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => set("email", e.target.value)}
            error={errors.email}
            rightIcon={<Mail className="w-4 h-4" />}
          />

          {/* ── Row 2: Phone & Country ── */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => set("phone", e.target.value)}
              error={errors.phone}
              rightIcon={<Phone className="w-4 h-4" />}
            />

            {/* Country select */}
            <div className="w-full space-y-1.5">
              <label className="text-sm font-medium leading-none text-foreground">
                Country
              </label>
              <div className="relative">
                <select
                  value={formData.country}
                  onChange={(e) => set("country", e.target.value)}
                  className={selectCls(errors.country)}
                >
                  <option value="" disabled>Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} className="bg-card text-foreground">{c}</option>
                  ))}
                </select>
                <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              </div>
              {errors.country && (
                <p className="text-sm font-medium text-red-500">{errors.country}</p>
              )}
            </div>
          </div>

          {/* ── Role ── */}
          <div className="w-full space-y-1.5">
            <label className="text-sm font-medium leading-none text-foreground">Role</label>
            <div className="relative">
              <select
                value={formData.role}
                onChange={(e) => set("role", e.target.value)}
                className={selectCls(errors.role)}
              >
                <option value="" disabled>Select a role</option>
                <option value="Admin"               className="bg-card text-foreground">Admin</option>
                <option value="Procurement Officer" className="bg-card text-foreground">Procurement Officer</option>
                <option value="Manager"             className="bg-card text-foreground">Manager / Approver</option>
                <option value="Vendor"              className="bg-card text-foreground">Vendor</option>
              </select>
              <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>
            {errors.role && (
              <p className="text-sm font-medium text-red-500">{errors.role}</p>
            )}
          </div>

          {/* ── Additional Info textarea ── */}
          <div className="w-full space-y-1.5">
            <label className="text-sm font-medium leading-none text-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-muted" />
              Additional Information
              <span className="text-muted font-normal text-xs">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Tell us about your organisation, procurement needs, or anything else relevant…"
              value={formData.additionalInfo}
              onChange={(e) => set("additionalInfo", e.target.value)}
              className="flex w-full rounded-xl border border-muted/30 bg-transparent px-3 py-2.5 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none leading-relaxed"
            />
          </div>

          {/* ── Password ── */}
          <div className="space-y-1.5">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => set("password", e.target.value)}
              error={errors.password}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-foreground focus:outline-none transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
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

          {/* ── Confirm Password ── */}
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => set("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="hover:text-foreground focus:outline-none transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {/* ── Terms ── */}
          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => set("termsAccepted", e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-muted/30 text-primary focus:ring-primary bg-transparent flex-shrink-0"
              />
              <span className={`text-sm ${errors.termsAccepted ? "text-red-500" : "text-muted"} group-hover:text-foreground transition-colors`}>
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">Terms & Conditions</a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </span>
            </label>
            {errors.termsAccepted && (
              <p className="text-sm font-medium text-red-500 mt-1">{errors.termsAccepted}</p>
            )}
          </div>

          <Button type="submit" fullWidth className="mt-2">
            Create Account
          </Button>

          <p className="text-center text-sm text-muted">
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
