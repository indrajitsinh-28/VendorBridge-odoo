# app/routers/__init__.py

from app.routers.analytics import router as analytics_router
from app.routers.approval import router as approval_router
from app.routers.activity_log import router as activity_log_router
from app.routers.dashboard import router as dashboard_router
from app.routers.po_invoice import invoice_router, purchase_order_router
from app.routers.quotation import comparison_router, router as quotation_router
from app.routers.rfq import router as rfq_router
from app.routers.auth import router as auth_router

__all__ = [
    "activity_log_router",
    "analytics_router",
    "approval_router",
    "comparison_router",
    "dashboard_router",
    "invoice_router",
    "purchase_order_router",
    "quotation_router",
    "rfq_router",
    "auth_router",
]
