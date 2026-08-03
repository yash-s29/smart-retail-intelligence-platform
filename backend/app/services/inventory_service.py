from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from sqlalchemy.orm import joinedload
from app.models.inventory import Inventory
from app.models.product import Product
from app.schemas.inventory import (
    InventoryCreate,
    InventoryUpdate,
)


# ==========================================================
# Helper Function
# ==========================================================

def calculate_inventory_status(
    current_stock: int,
    reorder_level: int,
    maximum_stock: int,
) -> str:
    """
    Automatically determine inventory status.
    """

    if current_stock == 0:
        return "Out of Stock"

    if current_stock <= reorder_level:
        return "Low Stock"

    if current_stock > maximum_stock:
        return "Overstock"

    return "In Stock"


# ==========================================================
# Create Inventory
# ==========================================================

def create_inventory(
    db: Session,
    inventory: InventoryCreate,
):
    """
    Create inventory for a product.
    """

    # Check Product Exists
    product = (
        db.query(Product)
        .filter(Product.id == inventory.product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )

    # Prevent Duplicate Inventory
    existing_inventory = (
        db.query(Inventory)
        .filter(Inventory.product_id == inventory.product_id)
        .first()
    )

    if existing_inventory:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inventory already exists for this product.",
        )

    inventory_data = inventory.model_dump()

    inventory_data["status"] = calculate_inventory_status(
        current_stock=inventory.current_stock,
        reorder_level=inventory.reorder_level,
        maximum_stock=inventory.maximum_stock,
    )

    new_inventory = Inventory(**inventory_data)

    try:
        db.add(new_inventory)
        db.commit()
        db.refresh(new_inventory)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create inventory.",
        )

    return new_inventory


# ==========================================================
# Get All Inventory
# ==========================================================

def get_inventory(db: Session):
    """
    Return all inventory items.
    """

    inventory = (
        db.query(Inventory)
        .options(joinedload(Inventory.product))
        .order_by(Inventory.id.desc())
        .all()
    )

    return inventory


# ==========================================================
# Get Inventory By ID
# ==========================================================

def get_inventory_by_id(
    db: Session,
    inventory_id: int,
):
    """
    Return inventory by ID.
    """

    inventory = (
    db.query(Inventory)
    .options(joinedload(Inventory.product))
    .filter(Inventory.id == inventory_id)
    .first()
)

    if not inventory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory not found.",
        )

    return inventory
# ==========================================================
# Update Inventory
# ==========================================================

def update_inventory(
    db: Session,
    inventory_id: int,
    inventory_update: InventoryUpdate,
):
    """
    Update an existing inventory record.
    """

    inventory = (
        db.query(Inventory)
        .filter(Inventory.id == inventory_id)
        .first()
    )

    if not inventory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory not found.",
        )

    update_data = inventory_update.model_dump(exclude_unset=True)

    # Update fields
    for key, value in update_data.items():
        setattr(inventory, key, value)

    # Recalculate inventory status
    inventory.status = calculate_inventory_status(
        current_stock=inventory.current_stock,
        reorder_level=inventory.reorder_level,
        maximum_stock=inventory.maximum_stock,
    )

    try:
        db.commit()
        db.refresh(inventory)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to update inventory.",
        )

    return inventory


# ==========================================================
# Delete Inventory
# ==========================================================

def delete_inventory(
    db: Session,
    inventory_id: int,
):
    """
    Delete inventory record.
    """

    inventory = (
        db.query(Inventory)
        .filter(Inventory.id == inventory_id)
        .first()
    )

    if not inventory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory not found.",
        )

    db.delete(inventory)
    db.commit()

    return {
        "message": "Inventory deleted successfully."
    }


# ==========================================================
# Update Stock Quantity
# ==========================================================

def update_stock_quantity(
    db: Session,
    inventory_id: int,
    quantity: int,
):
    """
    Update only the stock quantity.
    Useful after sales or manual stock adjustments.
    """

    inventory = (
        db.query(Inventory)
        .filter(Inventory.id == inventory_id)
        .first()
    )

    if not inventory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory not found.",
        )

    if quantity < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stock cannot be negative.",
        )

    inventory.current_stock = quantity

    inventory.status = calculate_inventory_status(
        current_stock=inventory.current_stock,
        reorder_level=inventory.reorder_level,
        maximum_stock=inventory.maximum_stock,
    )

    try:
        db.commit()
        db.refresh(inventory)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update stock quantity.",
        )

    return inventory
# ==========================================================
# Search Inventory
# ==========================================================
def search_inventory(
    db: Session,
    keyword: str,
):
    """
    Search inventory by product name or SKU.
    """

    inventory = (
        db.query(Inventory)
        .options(joinedload(Inventory.product))
        .join(Product)
        .filter(
            (Product.name.ilike(f"%{keyword}%")) |
            (Product.sku.ilike(f"%{keyword}%"))
        )
        .all()
    )

    return inventory


# ==========================================================
# Low Stock Items
# ==========================================================

def low_stock_items(db: Session):
    """
    Return products that are at or below their reorder level.
    """

    inventory = (
        db.query(Inventory)
        .filter(
            Inventory.current_stock <= Inventory.reorder_level
        )
        .order_by(Inventory.current_stock.asc())
        .all()
    )

    return inventory


# ==========================================================
# Restock Recommendations
# ==========================================================

def restock_recommendations(db: Session):
    """
    Generate simple restock recommendations.

    Recommended Quantity =
        Maximum Stock - Current Stock
    """

    recommendations = []

    inventory_items = (
        db.query(Inventory)
        .join(Product)
        .all()
    )

    for item in inventory_items:

        if item.current_stock <= item.reorder_level:

            recommended_quantity = (
                item.maximum_stock -
                item.current_stock
            )

            recommendations.append(
                {
                    "inventory_id": item.id,
                    "product_id": item.product.id,
                    "product_name": item.product.name,
                    "current_stock": item.current_stock,
                    "reorder_level": item.reorder_level,
                    "maximum_stock": item.maximum_stock,
                    "recommended_quantity": recommended_quantity,
                    "supplier": item.supplier,
                    "warehouse": item.warehouse,
                    "status": item.status,
                }
            )

    return recommendations