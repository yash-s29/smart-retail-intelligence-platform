from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.user import User
from app.schemas.inventory import (
    InventoryCreate,
    InventoryUpdate,
    InventoryResponse,
    InventoryAlert,
    RestockRecommendation,
)

from app.services.auth_service import get_current_user
from app.services.inventory_service import (
    create_inventory,
    get_inventory,
    get_inventory_by_id,
    update_inventory,
    delete_inventory,
    update_stock_quantity,
    search_inventory,
    low_stock_items,
    restock_recommendations,
)

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"],
)


# ==========================================================
# Create Inventory
# ==========================================================

@router.post(
    "",
    response_model=InventoryResponse,
    status_code=201,
)
def create_inventory_route(
    payload: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_inventory(db, payload)


# ==========================================================
# Get All Inventory
# ==========================================================

@router.get(
    "",
    response_model=list[InventoryResponse],
)
def list_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_inventory(db)


# ==========================================================
# Get Inventory By ID
# ==========================================================

@router.get(
    "/{inventory_id}",
    response_model=InventoryResponse,
)
def get_inventory_route(
    inventory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_inventory_by_id(
        db,
        inventory_id,
    )


# ==========================================================
# Update Inventory
# ==========================================================

@router.put(
    "/{inventory_id}",
    response_model=InventoryResponse,
)
def update_inventory_route(
    inventory_id: int,
    payload: InventoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_inventory(
        db,
        inventory_id,
        payload,
    )


# ==========================================================
# Delete Inventory
# ==========================================================

@router.delete("/{inventory_id}")
def delete_inventory_route(
    inventory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_inventory(
        db,
        inventory_id,
    )


# ==========================================================
# Update Stock Only
# ==========================================================

@router.patch(
    "/{inventory_id}/stock",
    response_model=InventoryResponse,
)
def update_stock_route(
    inventory_id: int,
    quantity: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_stock_quantity(
        db,
        inventory_id,
        quantity,
    )


# ==========================================================
# Search Inventory
# ==========================================================

@router.get("/search")
def search_inventory_route(
    keyword: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return search_inventory(
        db,
        keyword,
    )


# ==========================================================
# Inventory Alerts
# ==========================================================

@router.get(
    "/alerts",
    response_model=list[InventoryAlert],
)
def inventory_alerts_route(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return low_stock_items(db)


# ==========================================================
# Restock Recommendations
# ==========================================================

@router.get(
    "/restock",
    response_model=list[RestockRecommendation],
)
def inventory_restock_route(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return restock_recommendations(db)