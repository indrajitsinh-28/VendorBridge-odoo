import React, { useState, useMemo } from "react";
import {
  Search,
  Bell,
  Plus,
  Menu,
  X,
  FileDown,
  Upload,
  Activity,
  CheckCircle2,
  Clock,
  Settings,
  DollarSign,
  ShoppingBag,
  Users,
  FileText,
  LayoutDashboard,
  Calendar,
  AlertOctagon,
  Paperclip,
  Trash,
  Check,
  Eye,
  FileSpreadsheet,
  BarChart3,
  LogOut
} from "lucide-react";
import { Button } from "../Components/ui/Button";
import { ThemeToggle } from "../Components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// Sub-component 1: StatusBadge
interface StatusBadgeProps {
  status: "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    Draft: "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400",
    Submitted: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
    "Under Review": "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
    Approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
    Rejected: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400"
  };

  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${styles[status]}`}>
      {status}
    </span>
  );
}

// Sub-component 2: RFQDetailsCard
interface RFQInfo {
  id: string;
  title: string;
  category: string;
  department: string;
  deadline: string;
  description: string;
  qty: string;
  expectedDelivery: string;
}

interface RFQDetailsCardProps {
  rfq: RFQInfo;
}

export function RFQDetailsCard({ rfq }: RFQDetailsCardProps) {
  return (
    <div className="bg-card border border-muted/10 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-muted/15">
        <div>
          <span className="text-xxs font-bold uppercase tracking-wider text-primary dark:text-accent font-mono">
            {rfq.id}
          </span>
          <h3 className="text-xl font-bold text-foreground mt-0.5">{rfq.title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-primary/5 text-primary dark:bg-white/5 dark:text-foreground px-3 py-1.5 rounded-lg font-bold border border-muted/5">
            {rfq.category}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-muted block">Requesting Dept</span>
          <span className="font-semibold text-foreground mt-0.5 block">{rfq.department}</span>
        </div>
        <div>
          <span className="text-muted block">Requested Vol</span>
          <span className="font-semibold text-foreground mt-0.5 block">{rfq.qty}</span>
        </div>
        <div>
          <span className="text-muted block">Expected Delivery</span>
          <span className="font-semibold text-foreground mt-0.5 block flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted" />
            {rfq.expectedDelivery}
          </span>
        </div>
        <div>
          <span className="text-muted block">Submission Deadline</span>
          <span className="font-bold text-rose-500 mt-0.5 block flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {rfq.deadline}
          </span>
        </div>
      </div>

      <div className="pt-2">
        <span className="text-xs text-muted block mb-1">RFQ Project Scope Description</span>
        <p className="text-xs text-foreground leading-relaxed bg-primary/2 dark:bg-white/2 p-3.5 rounded-xl border border-muted/5 font-medium">
          {rfq.description}
        </p>
      </div>
    </div>
  );
}

// Sub-component 3: QuotationTable
interface QuoteItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  unitPrice: number;
  taxPercent: number;
}

interface QuotationTableProps {
  items: QuoteItem[];
  onUpdateItem: (id: string, field: keyof QuoteItem, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
}

export function QuotationTable({ items, onUpdateItem, onAddItem, onRemoveItem }: QuotationTableProps) {
  return (
    <div className="bg-card border border-muted/10 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div className="p-5 border-b border-muted/15 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-base text-primary dark:text-white">Section 2: Pricing Details</h4>
          <p className="text-xs text-muted mt-0.5">Edit unit rates and taxation percentages for requested items.</p>
        </div>
        <Button onClick={onAddItem} size="sm" className="flex items-center gap-1.5 font-bold">
          <Plus className="w-3.5 h-3.5" />
          Add Row
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-primary/5 dark:bg-white/5 text-muted text-xxs font-extrabold uppercase tracking-wider border-b border-muted/10">
            <tr>
              <th className="py-3 px-5">Item Name</th>
              <th className="py-3 px-4 w-28 text-center">Req Qty</th>
              <th className="py-3 px-4 w-24">Unit</th>
              <th className="py-3 px-4 w-32">Unit Price (₹)</th>
              <th className="py-3 px-4 w-24">Tax %</th>
              <th className="py-3 px-4 w-36">Total Amount (₹)</th>
              <th className="py-3 px-5 w-16 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted/10 text-xs font-semibold">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-muted font-medium">
                  No pricing rows added. Click "Add Row" to respond with items.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const totalItem = item.qty * item.unitPrice * (1 + item.taxPercent / 100);
                return (
                  <tr key={item.id} className="hover:bg-primary/2 dark:hover:bg-white/2 transition-colors">
                    <td className="py-3 px-5">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => onUpdateItem(item.id, "name", e.target.value)}
                        placeholder="Item name description"
                        className="w-full bg-transparent border border-muted/20 hover:border-muted focus:border-primary px-2.5 py-1.5 rounded-lg focus:outline-none text-foreground font-semibold text-xs"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => onUpdateItem(item.id, "qty", parseInt(e.target.value) || 0)}
                        className="w-20 text-center bg-transparent border border-muted/20 hover:border-muted focus:border-primary px-2 py-1.5 rounded-lg focus:outline-none text-foreground font-semibold text-xs"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => onUpdateItem(item.id, "unit", e.target.value)}
                        placeholder="e.g. Unit"
                        className="w-full bg-transparent border border-muted/20 hover:border-muted focus:border-primary px-2.5 py-1.5 rounded-lg focus:outline-none text-foreground font-semibold text-xs"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-2.5 flex items-center text-muted font-bold">₹</span>
                        <input
                          type="number"
                          min="0"
                          value={item.unitPrice || ""}
                          onChange={(e) => onUpdateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="w-full pl-6 pr-2 py-1.5 bg-transparent border border-muted/20 hover:border-muted focus:border-primary rounded-lg focus:outline-none text-foreground font-semibold text-xs"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.taxPercent}
                        onChange={(e) => onUpdateItem(item.id, "taxPercent", parseFloat(e.target.value) || 0)}
                        className="w-16 bg-transparent border border-muted/20 hover:border-muted focus:border-primary px-2 py-1.5 rounded-lg focus:outline-none text-foreground font-semibold text-xs"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      ₹{totalItem.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-5 text-right">
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/5 transition-all"
                        title="Delete Row"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Sub-component 4: DeliveryTimelineForm
interface DeliveryInfo {
  days: number;
  date: string;
  method: string;
}

interface DeliveryTimelineFormProps {
  delivery: DeliveryInfo;
  onChange: (field: keyof DeliveryInfo, value: string | number) => void;
}

export function DeliveryTimelineForm({ delivery, onChange }: DeliveryTimelineFormProps) {
  return (
    <div className="bg-card border border-muted/10 rounded-2xl p-5 shadow-sm space-y-4">
      <div>
        <h4 className="font-bold text-base text-primary dark:text-white">Section 3: Delivery Timeline</h4>
        <p className="text-xs text-muted mt-0.5">Specify operational execution timelines and courier metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Estimated Delivery Days</label>
          <input
            type="number"
            min="1"
            value={delivery.days || ""}
            onChange={(e) => onChange("days", parseInt(e.target.value) || 0)}
            placeholder="e.g. 15 days"
            className="w-full h-11 px-3 bg-transparent rounded-xl border border-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground text-sm font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Target Delivery Date</label>
          <input
            type="date"
            value={delivery.date}
            onChange={(e) => onChange("date", e.target.value)}
            className="w-full h-11 px-3 bg-transparent rounded-xl border border-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground text-sm font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Shipping Logistics Method</label>
          <select
            value={delivery.method}
            onChange={(e) => onChange("method", e.target.value)}
            className="w-full h-11 px-3 bg-transparent rounded-xl border border-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground text-sm font-semibold"
          >
            <option value="Standard Delivery">Standard Delivery (Surface)</option>
            <option value="Express Delivery">Express Delivery (Air Cargo)</option>
            <option value="Custom Delivery">Custom Delivery (FOB Destination)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Sub-component 5: NotesSection
interface NotesSectionProps {
  notes: string;
  onChange: (val: string) => void;
}

export function NotesSection({ notes, onChange }: NotesSectionProps) {
  const maxLength = 500;
  const currentLength = notes.length;

  return (
    <div className="bg-card border border-muted/10 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-bold text-base text-primary dark:text-white">Section 4: Notes & Comments</h4>
          <p className="text-xs text-muted mt-0.5">Include special conditions, warranties, pricing deviations, or notes.</p>
        </div>
        <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${currentLength > maxLength ? "text-red-500 bg-red-50" : "text-muted"}`}>
          {currentLength} / {maxLength}
        </span>
      </div>

      <div>
        <textarea
          value={notes}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          rows={4}
          placeholder="Add special terms, warranty information, delivery notes, or additional comments."
          className="w-full p-3.5 bg-transparent rounded-xl border border-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground text-xs leading-relaxed"
        ></textarea>
      </div>
    </div>
  );
}

// Sub-component 6: AttachmentUploader
interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface AttachmentUploaderProps {
  files: AttachedFile[];
  onAddFiles: (filesList: FileList) => void;
  onRemoveFile: (id: string) => void;
}

export function AttachmentUploader({ files, onAddFiles, onRemoveFile }: AttachmentUploaderProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAddFiles(e.target.files);
    }
  };

  return (
    <div className="bg-card border border-muted/10 rounded-2xl p-5 shadow-sm space-y-4">
      <div>
        <h4 className="font-bold text-base text-primary dark:text-white">Section 5: Supporting Attachments</h4>
        <p className="text-xs text-muted mt-0.5">Attach catalogs, legal declarations, or tax declarations (PDF, DOCX, XLSX, Images).</p>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all ${
          dragActive ? "border-primary bg-primary/5 dark:border-accent dark:bg-white/5" : "border-muted/20 hover:border-primary/50"
        }`}
      >
        <Upload className="w-8 h-8 text-muted mb-2.5 animate-bounce-hover" />
        <p className="text-xs text-center font-bold text-foreground">Drag & drop files here, or browse local folders</p>
        <p className="text-xxs text-muted text-center mt-1">Supports PDF, Word, Excel, and Images (up to 8MB)</p>
        
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.xlsx,.xls,.png,.jpg,.jpeg"
          onChange={handleFileInput}
          className="hidden"
          id="quote-files-input"
        />
        <label
          htmlFor="quote-files-input"
          className="mt-4 px-4 py-2 bg-primary/5 hover:bg-primary/10 text-primary dark:bg-white/5 dark:text-foreground text-xs font-bold rounded-xl cursor-pointer transition-colors"
        >
          Select Files
        </label>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-primary/2 dark:bg-white/2 rounded-xl border border-muted/5 group hover:border-muted/15 transition-all"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="p-2 rounded-lg bg-card text-primary dark:text-accent border border-muted/10 shrink-0">
                  {file.name.endsWith(".xlsx") || file.name.endsWith(".xls") ? (
                    <FileSpreadsheet className="w-4 h-4" />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate text-foreground">{file.name}</p>
                  <p className="text-xxs text-muted">{file.size}</p>
                </div>
              </div>
              
              <button
                onClick={() => onRemoveFile(file.id)}
                className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/5 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Remove File"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Sub-component 7: QuotationSummary
interface QuoteTotals {
  subtotal: number;
  tax: number;
  charges: number;
  grandTotal: number;
}

interface QuotationSummaryProps {
  totals: QuoteTotals;
  charges: number;
  onChangeCharges: (val: number) => void;
  onSaveDraft: () => void;
  onPreview: () => void;
  onSubmit: () => void;
  isDraftSaved: boolean;
}

export function QuotationSummary({
  totals,
  charges,
  onChangeCharges,
  onSaveDraft,
  onPreview,
  onSubmit,
  isDraftSaved
}: QuotationSummaryProps) {
  return (
    <div className="bg-card border border-muted/10 rounded-2xl p-6 shadow-sm space-y-5 sticky top-24">
      <h3 className="font-bold text-base text-primary dark:text-white pb-3 border-b border-muted/10">Quotation Summary</h3>
      
      <div className="space-y-3 text-xs font-semibold">
        <div className="flex justify-between">
          <span className="text-muted">Item Subtotal</span>
          <span className="text-foreground">
            ₹{totals.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted">GST & Taxes</span>
          <span className="text-foreground">
            ₹{totals.tax.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-muted">Logistics / Extra Charges</span>
          <div className="relative w-28 shrink-0">
            <span className="absolute inset-y-0 left-2.5 flex items-center text-muted font-bold text-xxs">₹</span>
            <input
              type="number"
              min="0"
              value={charges || ""}
              onChange={(e) => onChangeCharges(parseFloat(e.target.value) || 0)}
              className="w-full pl-6 pr-2 py-1 bg-transparent border border-muted/20 hover:border-muted focus:border-primary rounded-lg focus:outline-none text-right text-foreground font-semibold text-xs"
            />
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-muted/10 text-sm font-bold text-primary dark:text-white">
          <span>Grand Total</span>
          <span className="font-mono text-base">
            ₹{totals.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="space-y-2.5 pt-4">
        <Button onClick={onSubmit} fullWidth className="font-semibold shadow-md shadow-primary/10">
          Submit Quotation
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onSaveDraft}
            className="flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-muted/20 hover:bg-primary/5 text-primary dark:text-foreground dark:hover:bg-white/5 transition-all"
          >
            {isDraftSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Draft Saved</span>
              </>
            ) : (
              <span>Save Draft</span>
            )}
          </button>
          <button
            onClick={onPreview}
            className="flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary dark:text-foreground dark:hover:bg-white/5 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-component 8: SubmissionModal
interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  rfqTitle: string;
  totals: QuoteTotals;
  delivery: DeliveryInfo;
  files: AttachedFile[];
}

export function SubmissionModal({
  isOpen,
  onClose,
  onConfirm,
  rfqTitle,
  totals,
  delivery,
  files
}: SubmissionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-card rounded-2xl border border-muted/15 shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-primary dark:text-white pb-3 border-b border-muted/10 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Confirm Quote Submission
        </h3>

        <div className="space-y-4 py-4 text-xs font-medium text-muted">
          <p className="leading-relaxed">
            Please audit your quotation details before dispatching. You are responding to procurement request:
          </p>
          
          <div className="p-4 bg-primary/2 dark:bg-white/2 rounded-xl border border-muted/5 space-y-2.5">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted">RFQ RFQ Title</span>
              <p className="font-bold text-foreground text-sm mt-0.5">{rfqTitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted">Quoted Grand Total</span>
                <p className="font-bold text-foreground text-sm mt-0.5 text-primary dark:text-accent font-mono">
                  ₹{totals.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted">Timeline Promise</span>
                <p className="font-bold text-foreground text-sm mt-0.5">{delivery.days} Days ({delivery.method})</p>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted">Attached Audit Records ({files.length})</span>
              <p className="font-semibold text-foreground mt-0.5">
                {files.length > 0 ? files.map(f => f.name).join(", ") : "No supporting attachments uploaded."}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2 text-amber-600 dark:text-amber-400 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
            <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-normal">
              Once submitted, the quote is archived to the procurement committee and enters compliance review. Editing details requires procurement desk reissue.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-muted/10">
          <Button variant="outline" size="sm" onClick={onClose}>
            Review Details
          </Button>
          <Button size="sm" onClick={onConfirm}>
            Submit Quotation Document
          </Button>
        </div>

      </div>
    </div>
  );
}

// MAIN PAGE COMPONENT: VendorQuotation
export function VendorQuotation() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  // 1. Mock Data Setup
  const RFQ_MOCK: RFQInfo = {
    id: "VB-RFQ-2026-089",
    title: "Enterprise Cloud Server Hardware Procurement",
    category: "IT Hardware & Infrastructure",
    department: "Infrastructure & Cloud Ops",
    deadline: "2026-06-25",
    description: "Procurement of rack servers, high-speed networking switches, and enterprise-grade SSDs for data center expansion. Products must satisfy ISO-9001 quality certificates and possess at least 3 years vendor warranty.",
    qty: "40 Units Total",
    expectedDelivery: "2026-07-15"
  };

  const VENDOR_MOCK = {
    id: "VB-VEN-001",
    name: "Omkar Patil",
    companyName: "Apex Solutions India Ltd",
    email: "aarav@apexsolutions.in"
  };

  const INITIAL_ITEMS: QuoteItem[] = [
    { id: "item-1", name: "2U Rackmount Database Server (64-Core, 256GB RAM)", qty: 10, unit: "Units", unitPrice: 380000, taxPercent: 18 },
    { id: "item-2", name: "1U Application Node Server (32-Core, 128GB RAM)", qty: 25, unit: "Units", unitPrice: 190000, taxPercent: 18 },
    { id: "item-3", name: "100GbE High-Speed Layer-3 Spine Switch (32-Port)", qty: 5, unit: "Units", unitPrice: 450000, taxPercent: 18 }
  ];

  // 2. Primary React States
  const [items, setItems] = useState<QuoteItem[]>(INITIAL_ITEMS);
  const [delivery, setDelivery] = useState<DeliveryInfo>({
    days: 20,
    date: "2026-07-10",
    method: "Standard Delivery"
  });
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<AttachedFile[]>([
    { id: "pre-file-1", name: "ISO_9001_Apex_Certification.pdf", size: "2.4 MB", type: "pdf" }
  ]);
  const [extraCharges, setExtraCharges] = useState(2500);

  // Status & Timeline log state
  const [quotationStatus, setQuotationStatus] = useState<StatusBadgeProps["status"]>("Draft");
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [activities, setActivities] = useState<Array<{ title: string; desc: string; time: string }>>([
    { title: "RFQ Response Initiated", desc: "Quotation draft created response initialized.", time: "Today, 12:40 PM" }
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.unit.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  const filteredActivities = useMemo(() => {
    if (!searchQuery) return activities;
    return activities.filter(
      (act) =>
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activities, searchQuery]);

  // 3. Auto Calculations
  const totals = useMemo(() => {
    let subtotal = 0;
    let tax = 0;

    items.forEach((item) => {
      const lineCost = item.qty * item.unitPrice;
      subtotal += lineCost;
      tax += lineCost * (item.taxPercent / 100);
    });

    const grandTotal = subtotal + tax + extraCharges;
    return { subtotal, tax, charges: extraCharges, grandTotal };
  }, [items, extraCharges]);

  // 4. Form Handlers
  const handleUpdateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
    setIsDraftSaved(false);
    setItems(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const handleAddItem = () => {
    setIsDraftSaved(false);
    const newId = `item-custom-${Date.now()}`;
    const newItem: QuoteItem = {
      id: newId,
      name: "New Custom Line Item",
      qty: 1,
      unit: "Units",
      unitPrice: 0,
      taxPercent: 18
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setIsDraftSaved(false);
    setItems(items.filter((it) => it.id !== id));
  };

  const handleDeliveryChange = (field: keyof DeliveryInfo, value: string | number) => {
    setIsDraftSaved(false);
    setDelivery({ ...delivery, [field]: value });
  };

  const handleAddFiles = (filesList: FileList) => {
    setIsDraftSaved(false);
    const added: AttachedFile[] = [];
    for (let i = 0; i < filesList.length; i++) {
      const f = filesList[i];
      if (f) {
        added.push({
          id: `file-${Date.now()}-${i}`,
          name: f.name,
          size: (f.size / (1024 * 1024)).toFixed(1) + " MB",
          type: f.name.split(".").pop() || "doc"
        });
      }
    }
    setFiles([...files, ...added]);
  };

  const handleRemoveFile = (id: string) => {
    setIsDraftSaved(false);
    setFiles(files.filter((f) => f.id !== id));
  };

  const handleSaveDraft = () => {
    setIsDraftSaved(true);
    setQuotationStatus("Draft");
    setActivities([
      { title: "Draft Saved Offline", desc: "Quotation values successfully indexed as local draft.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ...activities
    ]);
  };

  const handleConfirmSubmit = () => {
    setIsSubmitModalOpen(false);
    setQuotationStatus("Submitted");
    setIsDraftSaved(false);
    setActivities([
      { title: "Quotation Document Transmitted", desc: "Response sent securely to Infrastructure procurement committee.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { title: "Compliance Audit Passed", desc: "GSTIN tax indexes verified.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ...activities
    ]);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* Sidebar Navigation - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary text-white shrink-0 h-screen sticky top-0 border-r border-white/5 shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <img src="/logo.png" alt="VyaparSetu Logo" className="w-8 h-8 rounded-lg object-contain bg-white p-1 flex-shrink-0" />
          <div>
            <span className="font-bold text-base tracking-wide leading-none block">VyaparSetu</span>
            <span className="text-[10px] text-white/50 font-medium">Procurement ERP</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-0.5 overflow-y-auto">
          {[
            { name: "Dashboard", icon: LayoutDashboard, active: false, path: "/dashboard" },
            { name: "Vendors", icon: Users, active: false, path: "/vendors" },
            { name: "RFQs", icon: FileText, active: false, path: "/rfqs" },
            { name: "Quotations", icon: ShoppingBag, active: true, path: "/quotations" },
            { name: "Approvals", icon: CheckCircle2, active: false, path: "/approvals" },
            { name: "Purchase Orders", icon: DollarSign, active: false, path: "/purchase-orders" },
            { name: "Invoices", icon: FileDown, active: false, path: "/invoices" },
            { name: "Reports", icon: BarChart3, active: false, path: "/reports" },
            { name: "Activity Logs", icon: Activity, active: false, path: "/activity-logs" },
            { name: "Settings", icon: Settings, active: false, path: "/settings" }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                item.active
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className={`w-4.5 h-4.5 transition-transform duration-200 ${item.active ? "text-accent" : "group-hover:scale-110"}`} />
              <span>{item.name.replace(" (Active)", "")}{item.active ? " (Active)" : ""}</span>
              {item.active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
          >
            <span className="text-base">{theme === "light" ? "🌙" : "☀️"}</span>
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-red-500/15 hover:text-red-400 transition-all text-sm font-medium mt-1"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)}></div>
          <aside className="relative flex flex-col w-64 bg-primary text-white h-full p-5 shadow-2xl border-r border-white/5 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="VyaparSetu Logo" className="w-8 h-8 rounded-lg object-contain bg-white p-1 flex-shrink-0" />
                <div>
                  <h1 className="font-bold text-base leading-none">VyaparSetu</h1>
                  <span className="text-[10px] text-white/50">Procurement ERP</span>
                </div>
              </div>
              <button
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-5 space-y-0.5 overflow-y-auto">
              {[
                { name: "Dashboard", icon: LayoutDashboard, active: false, path: "/dashboard" },
                { name: "Vendors", icon: Users, active: false, path: "/vendors" },
                { name: "RFQs", icon: FileText, active: false, path: "/rfqs" },
                { name: "Quotations", icon: ShoppingBag, active: true, path: "/quotations" },
                { name: "Approvals", icon: CheckCircle2, active: false, path: "/approvals" },
                { name: "Purchase Orders", icon: DollarSign, active: false, path: "/purchase-orders" },
                { name: "Invoices", icon: FileDown, active: false, path: "/invoices" },
                { name: "Reports", icon: BarChart3, active: false, path: "/reports" },
                { name: "Activity Logs", icon: Activity, active: false, path: "/activity-logs" },
                { name: "Settings", icon: Settings, active: false, path: "/settings" }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsMobileSidebarOpen(false);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    item.active ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10"
                  }`}
                >
                  <item.icon className="w-4.5 h-4.5" />
                  <span>{item.name.replace(" (Active)", "")}{item.active ? " (Active)" : ""}</span>
                </button>
              ))}
            </nav>

            <div className="border-t border-white/10 pt-4 space-y-1">
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMobileSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 text-sm font-medium"
              >
                <span className="text-base">{theme === "light" ? "🌙" : "☀️"}</span>
                <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/15 text-sm font-medium"
              >
                <LogOut className="w-4.5 h-4.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Right Core Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-card border-b border-muted/10 h-16 flex items-center justify-between px-6 transition-all duration-300">
          <div className="flex items-center space-x-4 flex-1 max-w-lg">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-3 flex items-center text-muted pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search RFQs, Quotations..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-background/50 border border-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-4">
            <ThemeToggle />

            {/* Notification Drawer */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className="p-2 rounded-full bg-primary/5 text-primary hover:bg-primary/10 dark:bg-white/5 dark:text-foreground dark:hover:bg-white/10 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full border border-card"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-card rounded-2xl border border-muted/15 shadow-xl py-2 z-50 animate-in fade-in duration-200">
                  <div className="px-4 py-2 border-b border-muted/10 flex items-center justify-between">
                    <span className="font-semibold text-sm">Notifications</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto p-2">
                    <div className="p-3 hover:bg-primary/5 rounded-xl cursor-pointer">
                      <p className="text-xs font-bold">RFQ VB-RFQ-2026-089 open</p>
                      <p className="text-xxs text-muted mt-0.5">Please submit cloud hardware estimates before June 25.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center space-x-2 p-1 bg-primary/5 hover:bg-primary/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
                  OP
                </div>
                <span className="text-sm font-medium hidden md:inline-block pr-1">Omkar Patil</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-card rounded-2xl border border-muted/15 shadow-xl py-2 z-50 animate-in fade-in duration-200">
                  <div className="px-4 py-2 border-b border-muted/10">
                    <p className="font-semibold text-sm">Omkar Patil</p>
                    <p className="text-xs text-muted">aarav@apexsolutions.in</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 text-sm text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5 transition-colors">
                      Profile Coordinates
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/5 transition-colors">
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
          
          {/* Header Area */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-muted/10 pb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-primary dark:text-white tracking-tight">
                Vendor Quotation Submission
              </h2>
              <p className="text-muted mt-1 text-sm md:text-base">
                Respond to procurement requests by providing pricing, delivery timelines, and quotation details.
              </p>
            </div>
            
            {/* Status indicators */}
            <div className="flex items-center space-x-3 shrink-0">
              <span className="text-xs font-semibold text-muted">Doc Status:</span>
              <StatusBadge status={quotationStatus} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column (Forms & Details) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* RFQ Details Block */}
              <RFQDetailsCard rfq={RFQ_MOCK} />

              {/* Section 1: Vendor Information (Read-only) */}
              <div className="bg-card border border-muted/10 rounded-2xl p-5 shadow-sm space-y-4">
                <div>
                  <h4 className="font-bold text-base text-primary dark:text-white">Section 1: Vendor Information</h4>
                  <p className="text-xs text-muted mt-0.5">Corporate identity parameters for response audit.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-muted block">Vendor Rep</span>
                    <span className="font-bold text-foreground mt-1 block bg-primary/2 dark:bg-white/2 p-2.5 rounded-xl border border-muted/5">
                      {VENDOR_MOCK.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block">Company Legal Entity</span>
                    <span className="font-bold text-foreground mt-1 block bg-primary/2 dark:bg-white/2 p-2.5 rounded-xl border border-muted/5">
                      {VENDOR_MOCK.companyName}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block">Vendor ERP Code</span>
                    <span className="font-bold text-foreground mt-1 block bg-primary/2 dark:bg-white/2 p-2.5 rounded-xl border border-muted/5 font-mono">
                      {VENDOR_MOCK.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block">Registered Email</span>
                    <span className="font-bold text-foreground mt-1 block bg-primary/2 dark:bg-white/2 p-2.5 rounded-xl border border-muted/5">
                      {VENDOR_MOCK.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing Details (Editable Table) */}
              <QuotationTable
                items={filteredItems}
                onUpdateItem={handleUpdateItem}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
              />

              {/* Section 3: Delivery Timeline Form */}
              <DeliveryTimelineForm delivery={delivery} onChange={handleDeliveryChange} />

              {/* Section 4: Notes Section */}
              <NotesSection notes={notes} onChange={setNotes} />

              {/* Section 5: Attachment Uploader */}
              <AttachmentUploader files={files} onAddFiles={handleAddFiles} onRemoveFile={handleRemoveFile} />

            </div>

            {/* Right Column (Summary & Actions) */}
            <div className="space-y-6">
              
              {/* Summary Card */}
              <QuotationSummary
                totals={totals}
                charges={extraCharges}
                onChangeCharges={setExtraCharges}
                onSaveDraft={handleSaveDraft}
                onPreview={() => setIsPreviewModalOpen(true)}
                onSubmit={() => setIsSubmitModalOpen(true)}
                isDraftSaved={isDraftSaved}
              />

              {/* Submission Logs & Badge tracker */}
              <div className="bg-card border border-muted/10 rounded-2xl p-5 shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5 pb-2 border-b border-muted/5">
                  <Activity className="w-4 h-4 text-muted" />
                  Submission Status & Timeline
                </h4>
                
                <div className="relative pl-5 border-l border-muted/15 space-y-4">
                  {filteredActivities.map((act, index) => (
                    <div key={index} className="relative">
                      <span className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-card border border-muted/20 flex items-center justify-center">
                        <span className={`w-1.5 h-1.5 rounded-full ${index === 0 ? "bg-primary dark:bg-accent" : "bg-muted"}`}></span>
                      </span>
                      <div className="text-xxs">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-foreground">{act.title}</p>
                          <span className="text-muted font-mono">{act.time}</span>
                        </div>
                        <p className="text-muted mt-0.5 leading-normal">{act.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

      {/* 9. SUBMISSION CONFIRMATION MODAL */}
      <SubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        rfqTitle={RFQ_MOCK.title}
        totals={totals}
        delivery={delivery}
        files={files}
      />

      {/* 10. PREVIEW QUOTATION MODAL */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setIsPreviewModalOpen(false)}></div>
          <div className="relative w-full max-w-3xl bg-card rounded-2xl border border-muted/15 shadow-2xl p-6 md:p-8 z-10 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-muted/15 pb-4 mb-5 flex justify-between items-start">
              <div>
                <span className="text-xxs font-bold uppercase tracking-wider text-primary dark:text-accent font-mono">
                  Document Preview Draft
                </span>
                <h3 className="text-xl font-bold text-foreground mt-0.5">Supplier Response Quotation</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">Date Compiled</p>
                <p className="text-xs font-bold mt-0.5">{new Date().toISOString().split("T")[0]}</p>
              </div>
            </div>

            <div className="space-y-6 text-xs text-foreground">
              {/* Block 1: Vendor & Client Coordinates */}
              <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-primary/2 dark:bg-white/2 border border-muted/5">
                <div>
                  <h4 className="font-bold text-muted uppercase text-[10px] tracking-wider mb-1">Response From</h4>
                  <p className="font-bold text-sm text-foreground">{VENDOR_MOCK.companyName}</p>
                  <p className="mt-0.5 text-muted">Rep: {VENDOR_MOCK.name}</p>
                  <p className="text-muted">{VENDOR_MOCK.email}</p>
                </div>
                <div>
                  <h4 className="font-bold text-muted uppercase text-[10px] tracking-wider mb-1">Response To</h4>
                  <p className="font-bold text-sm text-foreground">VyaparSetu Procurement Dept</p>
                  <p className="mt-0.5 text-muted">Category: {RFQ_MOCK.category}</p>
                  <p className="text-muted">RFQ Reference: {RFQ_MOCK.id}</p>
                </div>
              </div>

              {/* Block 2: Pricing Lines */}
              <div>
                <h4 className="font-bold text-muted uppercase text-[10px] tracking-wider mb-2.5">Quoted Line Items</h4>
                <div className="border border-muted/10 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-primary/5 dark:bg-white/5 text-xxs font-bold text-muted uppercase">
                      <tr>
                        <th className="py-2.5 px-4">Item Details</th>
                        <th className="py-2.5 px-4 text-center w-20">Qty</th>
                        <th className="py-2.5 px-4 w-24">Unit Rate</th>
                        <th className="py-2.5 px-4 w-16">Tax</th>
                        <th className="py-2.5 px-4 text-right w-32">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-muted/10 font-semibold text-xxs">
                      {items.map((it) => (
                        <tr key={it.id}>
                          <td className="py-2.5 px-4">{it.name}</td>
                          <td className="py-2.5 px-4 text-center">{it.qty}</td>
                          <td className="py-2.5 px-4">₹{it.unitPrice.toLocaleString("en-IN")}</td>
                          <td className="py-2.5 px-4">{it.taxPercent}%</td>
                          <td className="py-2.5 px-4 text-right">
                            ₹{(it.qty * it.unitPrice * (1 + it.taxPercent / 100)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Block 3: Delivery Terms */}
              <div className="grid grid-cols-2 gap-6 border-t border-muted/10 pt-4">
                <div>
                  <h4 className="font-bold text-muted uppercase text-[10px] tracking-wider mb-1.5">Delivery Schedule</h4>
                  <p className="font-bold text-foreground">Estimated days: {delivery.days} days</p>
                  <p className="text-muted mt-0.5">Committed Date: {delivery.date}</p>
                  <p className="text-muted">Logistics method: {delivery.method}</p>
                </div>
                <div>
                  <h4 className="font-bold text-muted uppercase text-[10px] tracking-wider mb-1.5">Pricing Summary</h4>
                  <div className="space-y-1 bg-primary/2 dark:bg-white/2 p-3 rounded-xl border border-muted/5">
                    <div className="flex justify-between text-xxs">
                      <span className="text-muted">Subtotal:</span>
                      <span>₹{totals.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xxs">
                      <span className="text-muted">Taxes:</span>
                      <span>₹{totals.tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xxs">
                      <span className="text-muted">Logistics:</span>
                      <span>₹{totals.charges.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-muted/10 pt-1 mt-1 text-xs">
                      <span>Total:</span>
                      <span className="text-primary dark:text-accent">₹{totals.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Block 4: Notes and audit */}
              {notes && (
                <div className="border-t border-muted/10 pt-4">
                  <h4 className="font-bold text-muted uppercase text-[10px] tracking-wider mb-1">Additional Terms / Notes</h4>
                  <p className="bg-primary/2 dark:bg-white/2 p-3 rounded-xl text-muted leading-relaxed font-medium italic border border-muted/5">
                    "{notes}"
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-muted/15">
              <Button onClick={() => setIsPreviewModalOpen(false)}>Close Preview</Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
