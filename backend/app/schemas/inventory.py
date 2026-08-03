from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.product import ProductRead
# ==========================================================
# Base Schema
# ==========================================================

class InventoryBase(BaseModel):
    current_stock: int = Field(
        ...,
        ge=0,
        description="Current stock quantity"
    )

    minimum_stock: int = Field(
        default=10,
        ge=0,
        description="Minimum stock level"
    )

    maximum_stock: int = Field(
        default=1000,
        ge=1,
        description="Maximum stock capacity"
    )

    reorder_level: int = Field(
        default=20,
        ge=0,
        description="Stock level to trigger reorder"
    )

    safety_stock: int = Field(
        default=30,
        ge=0,
        description="Buffer stock for unexpected demand"
    )

    warehouse: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    supplier: str = Field(
        ...,
        min_length=2,
        max_length=150
    )


# ==========================================================
# Create Inventory
# ==========================================================

class InventoryCreate(InventoryBase):
    product_id: int


# ==========================================================
# Update Inventory
# ==========================================================

class InventoryUpdate(BaseModel):
    current_stock: Optional[int] = Field(default=None, ge=0)
    minimum_stock: Optional[int] = Field(default=None, ge=0)
    maximum_stock: Optional[int] = Field(default=None, ge=1)
    reorder_level: Optional[int] = Field(default=None, ge=0)
    safety_stock: Optional[int] = Field(default=None, ge=0)
    warehouse: Optional[str] = Field(default=None, min_length=2, max_length=100)
    supplier: Optional[str] = Field(default=None, min_length=2, max_length=150)


# ==========================================================
# Response Schema
# ==========================================================

class InventoryResponse(InventoryBase):
    id: int
    product_id: int

    # Add this line
    product: ProductRead | None = None

    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================================
# Inventory List Response
# ==========================================================

class InventoryList(BaseModel):
    total: int
    items: list[InventoryResponse]


# ==========================================================
# Inventory Filters
# ==========================================================

class InventoryFilters(BaseModel):
    product_name: Optional[str] = None
    category: Optional[str] = None
    warehouse: Optional[str] = None
    supplier: Optional[str] = None
    status: Optional[str] = None


# ==========================================================
# Inventory Alert
# ==========================================================

class InventoryAlert(BaseModel):
    product_id: int
    product_name: str
    current_stock: int
    minimum_stock: int
    reorder_level: int
    status: str
    recommended_action: str


# ==========================================================
# Restock Recommendation
# ==========================================================

class RestockRecommendation(BaseModel):
    product_id: int
    product_name: str
    current_stock: int
    reorder_level: int
    recommended_quantity: int
    supplier: str
    warehouse: str


# ==========================================================
# Inventory Statistics
# ==========================================================

class InventoryStatistics(BaseModel):
    total_products: int
    total_stock: int
    low_stock_items: int
    out_of_stock_items: int
    overstock_items: int