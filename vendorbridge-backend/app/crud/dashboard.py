from datetime import datetime, timedelta

from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.approval import Approval, ApprovalStatus
from app.models.invoice import Invoice, InvoiceStatus
from app.models.purchase_order import PurchaseOrder
from app.models.rfq import RFQ, RFQStatus
from app.models.vendor import Vendor, VendorStatus


def _month_start() -> datetime:
    now = datetime.utcnow()
    return datetime(now.year, now.month, 1)


def _week_start() -> datetime:
    now = datetime.utcnow()
    return now - timedelta(days=now.weekday())


def _purchase_order_data(po: PurchaseOrder) -> dict:
    return {
        "id": po.id,
        "rfq_id": po.rfq_id,
        "quotation_id": po.quotation_id,
        "po_number": po.po_number,
        "status": po.status,
        "created_at": po.created_at,
    }


def _invoice_data(invoice: Invoice) -> dict:
    return {
        "id": invoice.id,
        "po_id": invoice.po_id,
        "invoice_number": invoice.invoice_number,
        "status": invoice.status,
        "subtotal": invoice.subtotal,
        "tax_amount": invoice.tax_amount,
        "total_amount": invoice.total_amount,
        "created_at": invoice.created_at,
    }


async def get_summary(db: AsyncSession) -> dict:
    pending_approvals_result = await db.execute(select(func.count(Approval.id)).where(Approval.status == ApprovalStatus.pending))
    active_rfqs_result = await db.execute(select(func.count(RFQ.id)).where(RFQ.status == RFQStatus.open))
    recent_purchase_orders_result = await db.execute(select(PurchaseOrder).order_by(PurchaseOrder.created_at.desc()).limit(5))
    recent_invoices_result = await db.execute(select(Invoice).order_by(Invoice.created_at.desc()).limit(5))
    total_vendors_result = await db.execute(select(func.count(Vendor.id)))
    total_spend_result = await db.execute(select(func.coalesce(func.sum(Invoice.total_amount), 0.0)).where(Invoice.created_at >= _month_start()))

    return {
        "pending_approvals": pending_approvals_result.scalar_one(),
        "active_rfqs": active_rfqs_result.scalar_one(),
        "recent_purchase_orders": [_purchase_order_data(po) for po in recent_purchase_orders_result.scalars().all()],
        "recent_invoices": [_invoice_data(invoice) for invoice in recent_invoices_result.scalars().all()],
        "total_vendors": total_vendors_result.scalar_one(),
        "total_spend_this_month": total_spend_result.scalar_one(),
    }


async def get_quick_stats(db: AsyncSession) -> dict:
    week_start = _week_start()
    month_start = _month_start()

    rfqs_this_week_result = await db.execute(select(func.count(RFQ.id)).where(RFQ.created_at >= week_start))
    pos_this_week_result = await db.execute(select(func.count(PurchaseOrder.id)).where(PurchaseOrder.created_at >= week_start))
    invoices_paid_result = await db.execute(
        select(func.count(Invoice.id))
        .where(Invoice.status == InvoiceStatus.paid)
        .where(Invoice.created_at >= month_start)
    )
    vendors_active_result = await db.execute(select(func.count(Vendor.id)).where(Vendor.status == VendorStatus.active))

    return {
        "rfqs_this_week": rfqs_this_week_result.scalar_one(),
        "pos_this_week": pos_this_week_result.scalar_one(),
        "invoices_paid_this_month": invoices_paid_result.scalar_one(),
        "vendors_active": vendors_active_result.scalar_one(),
    }
