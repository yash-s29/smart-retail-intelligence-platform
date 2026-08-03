from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProductBase(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    category: str | None = Field(default=None, max_length=120)
    sku: str | None = Field(default=None, max_length=80)
    selling_price: float = Field(gt=0)
    cost_price: float = Field(default=0, ge=0)


class ProductCreate(ProductBase):
    current_stock: int = Field(default=0, ge=0)
    reorder_level: int = Field(default=10, ge=0)
    safety_stock: int = Field(default=20, ge=0)


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=160)
    category: str | None = Field(default=None, max_length=120)
    sku: str | None = Field(default=None, max_length=80)
    selling_price: float | None = Field(default=None, gt=0)
    cost_price: float | None = Field(default=None, ge=0)


class ProductRead(ProductBase):
    id: int
    owner_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductWithStock(ProductRead):
    current_stock: int = 0
    reorder_level: int = 0
    safety_stock: int = 0
