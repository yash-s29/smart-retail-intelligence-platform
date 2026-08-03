from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ==========================================================
# Base Schema
# ==========================================================

class SaleBase(BaseModel):
    product_id: int = Field(..., gt=0)

    quantity_sold: int = Field(
        ...,
        gt=0,
        description="Quantity sold"
    )

    unit_price: float = Field(
        ...,
        gt=0,
        description="Selling price per unit"
    )

    sale_date: date = Field(
        default_factory=date.today
    )

    customer_name: Optional[str] = None

    customer_phone: Optional[str] = None

    customer_email: Optional[EmailStr] = None

    payment_method: str = Field(
        default="Cash"
    )

    status: str = Field(
        default="Completed"
    )

    discount: float = Field(
        default=0,
        ge=0
    )

    tax: float = Field(
        default=0,
        ge=0
    )

    notes: Optional[str] = None


# ==========================================================
# Create Sale
# ==========================================================

class SaleCreate(SaleBase):
    pass


# ==========================================================
# Update Sale
# ==========================================================

class SaleUpdate(BaseModel):

    quantity_sold: Optional[int] = Field(
        None,
        gt=0
    )

    unit_price: Optional[float] = Field(
        None,
        gt=0
    )

    sale_date: Optional[date] = None

    customer_name: Optional[str] = None

    customer_phone: Optional[str] = None

    customer_email: Optional[EmailStr] = None

    payment_method: Optional[str] = None

    status: Optional[str] = None

    discount: Optional[float] = Field(
        None,
        ge=0
    )

    tax: Optional[float] = Field(
        None,
        ge=0
    )

    notes: Optional[str] = None


# ==========================================================
# Read Sale
# ==========================================================

class SaleRead(BaseModel):

    id: int

    invoice_number: str

    owner_id: int

    product_id: int

    product_name: str | None = None # Add this line

    sale_date: date

    quantity_sold: int

    unit_price: float

    discount: float

    tax: float

    total_amount: float

    profit: float

    customer_name: Optional[str] = None

    customer_phone: Optional[str] = None

    customer_email: Optional[EmailStr] = None

    payment_method: str

    status: str

    notes: Optional[str] = None

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================================
# Sale Summary Card
# ==========================================================

class SaleSummary(BaseModel):

    id: int

    invoice_number: str

    sale_date: date

    product_name: Optional[str] = None

    customer_name: Optional[str] = None

    quantity_sold: int

    total_amount: float

    status: str

    payment_method: str

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================================
# Sales Dashboard Analytics
# ==========================================================

class SaleAnalytics(BaseModel):

    total_revenue: float

    total_profit: float

    total_orders: int

    total_products_sold: int

    average_order_value: float

    today_sales: float

    today_orders: int

    low_stock_products: int


# ==========================================================
# Monthly Sales
# ==========================================================

class MonthlySales(BaseModel):

    month: str

    revenue: float

    profit: float

    orders: int


# ==========================================================
# Top Selling Products
# ==========================================================

class TopSellingProduct(BaseModel):

    product_id: int

    product_name: str

    quantity_sold: int

    revenue: float


# ==========================================================
# Sales Upload Error Detail
# ==========================================================

class SalesUploadError(BaseModel):

    row: int

    error: str

    product_sku: Optional[str] = None



# ==========================================================
# Sales Upload Result
# ==========================================================

class SalesUploadResult(BaseModel):

    inserted: int

    skipped: int

    errors: List[SalesUploadError] = Field(
        default_factory=list
    )


# ==========================================================
# Dashboard Response
# ==========================================================

class SalesDashboardResponse(BaseModel):

    analytics: SaleAnalytics

    recent_sales: List[SaleSummary]

    top_products: List[TopSellingProduct]