from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database.session import get_db
from app.models.inventory import Inventory
from app.models.product import Product
from app.models.user import User
from app.schemas.product import ProductCreate, ProductRead, ProductUpdate, ProductWithStock
from app.services.auth_service import get_current_user


router = APIRouter(prefix="/products", tags=["Products"])


def serialize_product(product: Product) -> ProductWithStock:
    data = ProductRead.model_validate(product).model_dump()
    if product.inventory:
        data.update(
            current_stock=product.inventory.current_stock,
            reorder_level=product.inventory.reorder_level,
            safety_stock=product.inventory.safety_stock,
        )
    return ProductWithStock(**data)


@router.post("", response_model=ProductWithStock, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product = Product(
        owner_id=current_user.id,
        name=payload.name,
        category=payload.category,
        sku=payload.sku,
        selling_price=payload.selling_price,
        cost_price=payload.cost_price,
    )
    db.add(product)
    db.flush()
    db.add(
        Inventory(
            product_id=product.id,
            current_stock=payload.current_stock,
            reorder_level=payload.reorder_level,
            safety_stock=payload.safety_stock,
        )
    )
    db.commit()
    db.refresh(product)
    product = db.scalar(
        select(Product).options(selectinload(Product.inventory)).where(Product.id == product.id)
    )
    return serialize_product(product)


@router.get("", response_model=list[ProductWithStock])
def list_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    products = db.scalars(
        select(Product)
        .options(selectinload(Product.inventory))
        .where(Product.owner_id == current_user.id)
        .order_by(Product.created_at.desc())
    ).all()
    return [serialize_product(product) for product in products]


@router.get("/{product_id}", response_model=ProductWithStock)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product = db.scalar(
        select(Product)
        .options(selectinload(Product.inventory))
        .where(Product.id == product_id, Product.owner_id == current_user.id)
    )
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return serialize_product(product)


@router.patch("/{product_id}", response_model=ProductRead)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product = db.scalar(select(Product).where(Product.id == product_id, Product.owner_id == current_user.id))
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product = db.scalar(select(Product).where(Product.id == product_id, Product.owner_id == current_user.id))
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    db.delete(product)
    db.commit()
