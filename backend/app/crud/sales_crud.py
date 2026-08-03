from sqlalchemy.orm import Session

from app.models.inventory import Inventory
from app.models.sales import Sale


# ==========================================================
# Create Single Sale
# ==========================================================

def create_sale(
    db: Session,
    sale_data: dict,
):
    """
    Insert a single sale.
    """

    sale = Sale(**sale_data)

    db.add(sale)

    db.flush()

    return sale


# ==========================================================
# Get Sale By ID
# ==========================================================

def get_sale_by_id(
    db: Session,
    sale_id: int,
):
    return (
        db.query(Sale)
        .filter(Sale.id == sale_id)
        .first()
    )


# ==========================================================
# Get All Sales
# ==========================================================

def get_all_sales(
    db: Session,
):
    return (
        db.query(Sale)
        .order_by(Sale.sale_date.desc())
        .all()
    )


# ==========================================================
# Update Inventory
# ==========================================================

def update_inventory_stock(
    db: Session,
    product_id: int,
    quantity: int,
):
    inventory = (
        db.query(Inventory)
        .filter(
            Inventory.product_id == product_id
        )
        .first()
    )

    if inventory:
        inventory.current_stock -= quantity

    return inventory


# ==========================================================
# Bulk Import Sales
# ==========================================================

def bulk_import_sales(
    db: Session,
    owner_id: int,
    sales_data: list[dict],
):
    """
    Bulk insert sales from parsed CSV data.
    """

    inserted = 0
    skipped = 0
    errors = []

    try:

        for sale_data in sales_data:

            try:

                sale = create_sale(
                    db=db,
                    sale_data=sale_data,
                )

                update_inventory_stock(
                    db=db,
                    product_id=sale.product_id,
                    quantity=sale.quantity_sold,
                )

                inserted += 1

            except Exception as e:

                skipped += 1
                errors.append(str(e))

        db.commit()

        return {
            "inserted": inserted,
            "skipped": skipped,
            "errors": errors,
        }

    except Exception:

        db.rollback()
        raise


# ==========================================================
# Delete Sale
# ==========================================================

def delete_sale(
    db: Session,
    sale_id: int,
):
    sale = get_sale_by_id(
        db,
        sale_id,
    )

    if not sale:
        return False

    db.delete(sale)

    db.commit()

    return True


# ==========================================================
# Update Sale
# ==========================================================

def update_sale(
    db: Session,
    sale,
    data: dict,
):
    """
    Update existing sale.
    """

    for key, value in data.items():

        setattr(
            sale,
            key,
            value,
        )

    db.commit()

    db.refresh(sale)

    return sale