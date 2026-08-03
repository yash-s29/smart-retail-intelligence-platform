"""
==============================================================
Sales Service Layer
--------------------------------------------------------------
Responsibilities:

    • Create sales transactions
    • Validate products
    • Validate inventory
    • Update stock
    • Handle CSV imports
    • Provide sales analytics

This file DOES:

    ✅ Database operations
    ✅ Product lookup
    ✅ Inventory updates
    ✅ Sale creation


CSV Parser DOES:

    ✅ Read CSV
    ✅ Clean data
    ✅ Validate CSV structure

==============================================================
"""


from datetime import date, datetime


from sqlalchemy import func

from sqlalchemy.exc import SQLAlchemyError

from sqlalchemy.orm import Session


from app.models.inventory import Inventory

from app.models.product import Product

from app.models.sales import Sale





# ==========================================================
# Invoice Generator
# ==========================================================


def generate_invoice_number() -> str:
    """
    Generate unique invoice number.

    Example:

    INV-20260715-153245
    """


    timestamp = datetime.now().strftime(
        "%Y%m%d-%H%M%S"
    )


    return f"INV-{timestamp}"







# ==========================================================
# Sale Calculations
# ==========================================================


def calculate_sale_totals(
    quantity: int,
    unit_price: float,
    discount: float = 0.0,
    tax: float = 0.0,
):
    """
    Calculate sale totals.


    Formula:

    subtotal =
        quantity * unit_price


    total =
        subtotal
        - discount
        + tax

    """


    subtotal = (

        quantity

        *

        unit_price

    )



    total_amount = (

        subtotal

        -

        discount

        +

        tax

    )



    return {


        "subtotal": round(
            subtotal,
            2
        ),


        "total_amount": round(
            total_amount,
            2
        ),

    }








# ==========================================================
# Profit Calculation
# ==========================================================


def calculate_profit(
    quantity: int,
    selling_price: float,
    cost_price: float,
):
    """
    Calculate profit.

    Formula:

    Revenue - Cost
    """


    revenue = (

        quantity

        *

        selling_price

    )


    cost = (

        quantity

        *

        cost_price

    )


    return round(

        revenue - cost,

        2

    )









# ==========================================================
# Inventory Status
# ==========================================================


def determine_inventory_status(
    inventory: Inventory,
) -> str:
    """
    Determine inventory status.
    """


    if inventory.current_stock <= 0:

        return "Out of Stock"



    if inventory.current_stock <= inventory.minimum_stock:

        return "Low Stock"



    if inventory.current_stock <= inventory.reorder_level:

        return "Reorder Soon"



    return "In Stock"









# ==========================================================
# Update Inventory Status
# ==========================================================


def update_inventory_status(
    inventory: Inventory,
):
    """
    Update inventory status.
    """


    inventory.status = determine_inventory_status(

        inventory

    )









# ==========================================================
# Validate Inventory
# ==========================================================


def validate_inventory(
    inventory: Inventory,
    quantity: int,
):
    """
    Validate available stock.
    """


    if inventory is None:

        raise ValueError(

            "Inventory record not found."

        )



    if quantity <= 0:

        raise ValueError(

            "Quantity must be greater than zero."

        )



    if inventory.current_stock < quantity:

        raise ValueError(

            f"Insufficient stock. "
            f"Available: {inventory.current_stock}"

        )









# ==========================================================
# Fetch Product By ID
# ==========================================================


def get_product(
    db: Session,
    owner_id: int,
    product_id: int,
):
    """
    Fetch product using product id.
    """


    product = (

        db.query(Product)

        .filter(

            Product.id == product_id,

            Product.owner_id == owner_id,

        )

        .first()

    )



    if not product:

        raise ValueError(

            "Product not found."

        )



    return product







# ==========================================================
# NEW: Fetch Product By SKU
# ==========================================================


def get_product_by_sku(
    db: Session,
    owner_id: int,
    product_sku: str,
):
    """
    Fetch product using SKU.

    Used for CSV imports.

    Flow:

    CSV

    product_sku

        ↓

    Product lookup

        ↓

    product.id

    """


    product = (

        db.query(Product)

        .filter(

            Product.sku == product_sku,

            Product.owner_id == owner_id,

        )

        .first()

    )



    if not product:

        raise ValueError(

            f"Product with SKU '{product_sku}' not found."

        )



    return product







# ==========================================================
# Fetch Inventory
# ==========================================================


def get_inventory(
    db: Session,
    product_id: int,
):
    """
    Fetch inventory record.
    """


    inventory = (

        db.query(Inventory)

        .filter(

            Inventory.product_id == product_id

        )

        .first()

    )



    if not inventory:

        raise ValueError(

            "Inventory record not found."

        )



    return inventory
# ==========================================================
# Process Sale Transaction
# ==========================================================


def process_sale_transaction(
    db: Session,
    owner_id: int,
    sale_data: dict,
):
    """
    Complete sale creation workflow.

    Workflow:

    Validate Product
            ↓
    Validate Inventory
            ↓
    Calculate Amount
            ↓
    Calculate Profit
            ↓
    Reduce Stock
            ↓
    Update Inventory Status
            ↓
    Create Sale
            ↓
    Commit
    """

    try:

        # ==========================================
        # Product Validation
        # ==========================================

        product = get_product(

            db=db,

            owner_id=owner_id,

            product_id=sale_data["product_id"],

        )



        # ==========================================
        # Inventory Validation
        # ==========================================

        inventory = get_inventory(

            db=db,

            product_id=product.id,

        )



        quantity = sale_data["quantity_sold"]



        validate_inventory(

            inventory=inventory,

            quantity=quantity,

        )



        # ==========================================
        # Sale Values
        # ==========================================

        unit_price = sale_data["unit_price"]


        discount = sale_data.get(

            "discount",

            0.0,

        )


        tax = sale_data.get(

            "tax",

            0.0,

        )



        # ==========================================
        # Calculate Total
        # ==========================================

        totals = calculate_sale_totals(

            quantity=quantity,

            unit_price=unit_price,

            discount=discount,

            tax=tax,

        )



        # ==========================================
        # Calculate Profit
        # ==========================================

        profit = calculate_profit(

            quantity=quantity,

            selling_price=unit_price,

            cost_price=product.cost_price,

        )



        # ==========================================
        # Update Inventory
        # ==========================================

        inventory.current_stock -= quantity



        update_inventory_status(

            inventory

        )



        # ==========================================
        # Create Sale Record
        # ==========================================

        new_sale = Sale(

            owner_id=owner_id,


            product_id=product.id,


            invoice_number=generate_invoice_number(),



            sale_date=sale_data.get(

                "sale_date",

                date.today(),

            ),



            quantity_sold=quantity,


            unit_price=unit_price,


            discount=discount,


            tax=tax,


            total_amount=totals["total_amount"],


            profit=profit,



            customer_name=sale_data.get(

                "customer_name"

            ),



            customer_phone=sale_data.get(

                "customer_phone"

            ),



            customer_email=sale_data.get(

                "customer_email"

            ),



            payment_method=sale_data.get(

                "payment_method",

                "Cash",

            ),



            status=sale_data.get(

                "status",

                "Completed",

            ),



            notes=sale_data.get(

                "notes"

            ),

        )



        db.add(new_sale)



        db.commit()



        db.refresh(new_sale)



        return new_sale



    except ValueError:


        db.rollback()

        raise



    except SQLAlchemyError as error:


        db.rollback()



        raise ValueError(

            f"Database error: {str(error)}"

        )



    except Exception as error:


        db.rollback()



        raise ValueError(

            f"Unexpected error: {str(error)}"

        )








# ==========================================================
# Convert CSV Row Into Sale Data
# ==========================================================


def process_csv_sale_row(
    db: Session,
    owner_id: int,
    csv_row: dict,
):
    """
    Convert CSV row into
    database sale format.


    CSV:

    product_sku

          ↓

    Product lookup

          ↓

    product_id


    quantity

          ↓

    quantity_sold

    """


    product = get_product_by_sku(

        db=db,

        owner_id=owner_id,

        product_sku=csv_row["product_sku"],

    )



    sale_data = {


        "product_id": product.id,



        "quantity_sold": int(

            csv_row["quantity_sold"]

        ),



        "unit_price": float(

            csv_row["unit_price"]

        ),



        "discount": float(

            csv_row.get(

                "discount",

                0,

            )

        ),



        "tax": float(

            csv_row.get(

                "tax",

                0,

            )

        ),



        "sale_date": csv_row.get(

            "sale_date",

            date.today(),

        ),



        "customer_name": csv_row.get(

            "customer_name"

        ),



        "customer_phone": csv_row.get(

            "customer_phone"

        ),



        "customer_email": csv_row.get(

            "customer_email"

        ),



        "payment_method": csv_row.get(

            "payment_method",

            "Cash",

        ),



        "status": csv_row.get(

            "status",

            "Completed",

        ),



        "notes": csv_row.get(

            "notes"

        ),

    }



    return process_sale_transaction(

        db=db,

        owner_id=owner_id,

        sale_data=sale_data,

    )
# ==========================================================
# Sales Analytics
# ==========================================================


def get_sales_analytics(
    db: Session,
    owner_id: int,
):
    """
    Generate sales dashboard analytics.
    """


    try:

        # ==========================================
        # Total Revenue
        # ==========================================

        total_revenue = (

            db.query(

                func.coalesce(

                    func.sum(

                        Sale.total_amount

                    ),

                    0,

                )

            )

            .filter(

                Sale.owner_id == owner_id

            )

            .scalar()

        )



        # ==========================================
        # Total Profit
        # ==========================================

        total_profit = (

            db.query(

                func.coalesce(

                    func.sum(

                        Sale.profit

                    ),

                    0,

                )

            )

            .filter(

                Sale.owner_id == owner_id

            )

            .scalar()

        )



        # ==========================================
        # Total Orders
        # ==========================================

        total_orders = (

            db.query(

                func.count(

                    Sale.id

                )

            )

            .filter(

                Sale.owner_id == owner_id

            )

            .scalar()

        )



        # ==========================================
        # Products Sold
        # ==========================================

        total_products_sold = (

            db.query(

                func.coalesce(

                    func.sum(

                        Sale.quantity_sold

                    ),

                    0,

                )

            )

            .filter(

                Sale.owner_id == owner_id

            )

            .scalar()

        )



        # ==========================================
        # Average Order Value
        # ==========================================

        average_order_value = (

            float(total_revenue) / total_orders

            if total_orders > 0

            else 0

        )



        # ==========================================
        # Today's Sales
        # ==========================================

        today = date.today()



        today_sales = (

            db.query(

                func.coalesce(

                    func.sum(

                        Sale.total_amount

                    ),

                    0,

                )

            )

            .filter(

                Sale.owner_id == owner_id,

                Sale.sale_date == today,

            )

            .scalar()

        )



        # ==========================================
        # Today's Orders
        # ==========================================

        today_orders = (

            db.query(

                func.count(

                    Sale.id

                )

            )

            .filter(

                Sale.owner_id == owner_id,

                Sale.sale_date == today,

            )

            .scalar()

        )



        # ==========================================
        # Low Stock Products
        # ==========================================

        low_stock_products = (

            db.query(

                func.count(

                    Inventory.id

                )

            )

            .join(

                Product,

            )

            .filter(

                Product.owner_id == owner_id,

                Inventory.current_stock
                <= Inventory.minimum_stock,

            )

            .scalar()

        )



        # ==========================================
        # Out Of Stock Products
        # ==========================================

        out_of_stock_products = (

            db.query(

                func.count(

                    Inventory.id

                )

            )

            .join(

                Product,

            )

            .filter(

                Product.owner_id == owner_id,

                Inventory.current_stock <= 0,

            )

            .scalar()

        )



        return {


            "total_revenue": round(

                float(total_revenue or 0),

                2,

            ),



            "total_profit": round(

                float(total_profit or 0),

                2,

            ),



            "total_orders": int(

                total_orders or 0

            ),



            "total_products_sold": int(

                total_products_sold or 0

            ),



            "average_order_value": round(

                average_order_value,

                2,

            ),



            "today_sales": round(

                float(today_sales or 0),

                2,

            ),



            "today_orders": int(

                today_orders or 0

            ),



            "low_stock_products": int(

                low_stock_products or 0

            ),



            "out_of_stock_products": int(

                out_of_stock_products or 0

            ),

        }



    except Exception as error:


        print(

            f"Analytics Error: {error}"

        )



        return {


            "total_revenue": 0,

            "total_profit": 0,

            "total_orders": 0,

            "total_products_sold": 0,

            "average_order_value": 0,

            "today_sales": 0,

            "today_orders": 0,

            "low_stock_products": 0,

            "out_of_stock_products": 0,

        }







# ==========================================================
# Recent Sales
# ==========================================================


def get_recent_sales(
    db: Session,
    owner_id: int,
    limit: int = 10,
):
    """
    Return latest sales.
    """


    sales = (

        db.query(Sale)

        .join(Product)

        .filter(

            Sale.owner_id == owner_id

        )

        .order_by(

            Sale.created_at.desc()

        )

        .limit(limit)

        .all()

    )



    recent_sales = []



    for sale in sales:


        recent_sales.append(


            {


                "id": sale.id,


                "invoice_number":
                    sale.invoice_number,


                "product_id":
                    sale.product_id,


                "product_name":
                    sale.product.name
                    if sale.product
                    else "-",



                "customer_name":
                    sale.customer_name,



                "sale_date":
                    sale.sale_date,



                "quantity_sold":
                    sale.quantity_sold,



                "total_amount":
                    sale.total_amount,



                "payment_method":
                    sale.payment_method,



                "status":
                    sale.status,

            }


        )



    return recent_sales







# ==========================================================
# Top Selling Products
# ==========================================================


def get_top_selling_products(
    db: Session,
    owner_id: int,
    limit: int = 5,
):
    """
    Return best selling products.
    """


    products = (

        db.query(

            Product.id,


            Product.name,


            func.sum(

                Sale.quantity_sold

            ).label(

                "quantity"

            ),


            func.sum(

                Sale.total_amount

            ).label(

                "revenue"

            ),

        )


        .join(

            Sale,

            Product.id == Sale.product_id

        )


        .filter(

            Product.owner_id == owner_id

        )


        .group_by(

            Product.id,

            Product.name,

        )


        .order_by(

            func.sum(

                Sale.quantity_sold

            ).desc()

        )


        .limit(limit)


        .all()

    )



    return [


        {


            "product_id":
                item.id,


            "product_name":
                item.name,


            "quantity_sold":
                int(item.quantity or 0),


            "revenue":
                round(

                    float(item.revenue or 0),

                    2,

                ),

        }


        for item in products

    ]







# ==========================================================
# Sales By Date Range
# ==========================================================


def get_sales_by_date_range(
    db: Session,
    owner_id: int,
    start_date: date,
    end_date: date,
):
    """
    Fetch sales between dates.
    """


    return (

        db.query(Sale)

        .filter(

            Sale.owner_id == owner_id,


            Sale.sale_date >= start_date,


            Sale.sale_date <= end_date,

        )

        .order_by(

            Sale.sale_date.desc()

        )

        .all()

    )
# ==========================================================
# Sales Dashboard Response
# ==========================================================


def get_dashboard_data(
    db: Session,
    owner_id: int,
):
    """
    Complete sales dashboard data.

    Returns:

    {
        analytics,
        recent_sales,
        top_products
    }
    """


    analytics = get_sales_analytics(

        db=db,

        owner_id=owner_id,

    )



    recent_sales = get_recent_sales(

        db=db,

        owner_id=owner_id,

        limit=10,

    )



    top_products = get_top_selling_products(

        db=db,

        owner_id=owner_id,

        limit=5,

    )



    return {


        "analytics": analytics,


        "recent_sales": recent_sales,


        "top_products": top_products,

    }


def validate_business_rules(
    sale_data: dict
):
    """
    Validate sales CSV business rules.
    """

    errors = []


    if sale_data.get("quantity") is None:

        errors.append(
            "Quantity is required."
        )


    if sale_data.get("quantity", 0) <= 0:

        errors.append(
            "Quantity must be greater than zero."
        )


    if sale_data.get("unit_price") is None:

        errors.append(
            "Unit price is required."
        )


    if sale_data.get("unit_price", 0) <= 0:

        errors.append(
            "Unit price must be greater than zero."
        )


    if not sale_data.get("product_sku"):

        errors.append(
            "Product SKU is required."
        )


    if not sale_data.get("invoice_number"):

        errors.append(
            "Invoice number is required."
        )


    return errors






# ==========================================================
# Bulk CSV Import
# ==========================================================


def bulk_import_sales(
    db: Session,
    owner_id: int,
    sales_data: list[dict],
):
    """
    Import multiple sales from CSV.

    Flow:

    CSV Row

        ↓

    product_sku lookup

        ↓

    process_csv_sale_row()

        ↓

    process_sale_transaction()

        ↓

    Update inventory

        ↓

    Create Sale


    Returns:

    {
        inserted,
        skipped,
        errors
    }

    """


    inserted = 0


    skipped = 0


    errors = []



    for index, row in enumerate(
        sales_data,
        start=1,
    ):


        try:


            process_csv_sale_row(

                db=db,

                owner_id=owner_id,

                csv_row=row,

            )



            inserted += 1



        except Exception as error:



            skipped += 1



            errors.append(

                {

                    "row": index,

                    "error": str(error),

                    "product_sku":
                        row.get(
                            "product_sku",
                            "Unknown"
                        ),

                }

            )



    return {


        "inserted": inserted,


        "skipped": skipped,


        "total_rows": len(sales_data),


        "errors": errors,

    }





__all__ = [

    "generate_invoice_number",

    "calculate_sale_totals",

    "calculate_profit",

    "determine_inventory_status",

    "update_inventory_status",

    "validate_inventory",

    "get_product",

    "get_product_by_sku",

    "validate_business_rules",

    "process_sale_transaction",

    "process_csv_sale_row",

    "bulk_import_sales",

    "get_sales_analytics",

    "get_recent_sales",

    "get_top_selling_products",

    "get_sales_by_date_range",

    "get_dashboard_data",

]