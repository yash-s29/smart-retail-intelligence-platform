"""
==============================================================
Sales Routes
--------------------------------------------------------------
Responsibilities:

    • Sales CRUD APIs
    • Sales dashboard APIs
    • CSV upload API

Business logic belongs to:

    services/sales_service.py

==============================================================
"""


from datetime import date


from fastapi import (

    APIRouter,

    Depends,

    HTTPException,

    Query,

    UploadFile,

    File,

    status,

)


from sqlalchemy.orm import Session


from app.database.session import get_db

from app.models.product import Product
from app.models.inventory import Inventory

from app.models.sales import Sale

from app.models.user import User


from app.schemas.sales import (

    SaleAnalytics,

    SaleCreate,

    SaleRead,

    SaleSummary,

    SaleUpdate,

    SalesDashboardResponse,

    SalesUploadResult,

)


from app.services.auth_service import get_current_user


from app.services.sales_service import (

    get_dashboard_data,

    get_recent_sales,

    get_sales_analytics,

    get_sales_by_date_range,

    get_top_selling_products,

    process_sale_transaction,

)





router = APIRouter(

    prefix="/sales",

    tags=["Sales"],

)







# ==========================================================
# Sale Lookup Helper
# ==========================================================


def get_sale_or_404(
    db: Session,
    owner_id: int,
    sale_id: int,
) -> Sale:
    """
    Fetch sale belonging to user.
    """


    sale = (

        db.query(Sale)

        .filter(

            Sale.id == sale_id,

            Sale.owner_id == owner_id,

        )

        .first()

    )



    if not sale:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Sale not found.",

        )



    return sale







# ==========================================================
# Create Sale
# ==========================================================


@router.post(
    "",
    response_model=SaleRead,
    status_code=status.HTTP_201_CREATED,
)
def create_sale(

    payload: SaleCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),

):
    """
    Create sale.

    Inventory automatically updates.
    """


    try:


        sale = process_sale_transaction(

            db=db,

            owner_id=current_user.id,

            sale_data=payload.model_dump(),

        )



        return sale



    except ValueError as error:


        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail=str(error),

        )



    except Exception:


        raise HTTPException(

            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,

            detail="Unable to create sale.",

        )








# ==========================================================
# Get Single Sale
# ==========================================================


@router.get(
    "/record/{sale_id}",
    response_model=SaleRead,
)
def get_sale(

    sale_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),

):
    """
    Return single sale.
    """


    sale = get_sale_or_404(

        db=db,

        owner_id=current_user.id,

        sale_id=sale_id,

    )



    return sale







# ==========================================================
# Update Sale
# ==========================================================


@router.put(
    "/record/{sale_id}",
    response_model=SaleRead,
)
def update_sale(

    sale_id: int,

    payload: SaleUpdate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),

):
    """
    Update sale information.

    Note:
    Inventory adjustment is handled later
    when editing quantity.
    """


    sale = get_sale_or_404(

        db,

        current_user.id,

        sale_id,

    )



    try:


        update_data = payload.model_dump(

            exclude_unset=True

        )



        for key, value in update_data.items():


            setattr(

                sale,

                key,

                value,

            )



        db.commit()



        db.refresh(sale)



        return sale




    except Exception as error:


        db.rollback()



        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail=str(error),

        )









# ==========================================================
# Delete Sale
# ==========================================================


@router.delete(
    "/record/{sale_id}",
    status_code=status.HTTP_200_OK,
)
def delete_sale(

    sale_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),

):
    """
    Delete sale.

    Restores inventory stock.
    """


    sale = get_sale_or_404(

        db,

        current_user.id,

        sale_id,

    )



    try:


        inventory = (

            db.query(Inventory)

            .filter(

                Inventory.product_id
                ==
                sale.product_id

            )

            .first()

        )



        if inventory:


            inventory.current_stock += sale.quantity_sold



        db.delete(sale)



        db.commit()



        return {


            "message":

            "Sale deleted successfully."

        }




    except Exception as error:


        db.rollback()



        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail=str(error),

        )
    # ==========================================================
# Sales Analytics
# ==========================================================


@router.get(
    "/analytics",
    response_model=SaleAnalytics,
)
def sales_analytics(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),

):
    """
    Return sales KPI analytics.
    """


    return get_sales_analytics(

        db=db,

        owner_id=current_user.id,

    )







# ==========================================================
# Sales Dashboard
# ==========================================================


@router.get(
    "/dashboard",
    response_model=SalesDashboardResponse,
)
def sales_dashboard(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),

):
    """
    Complete sales dashboard data.

    Includes:

        - Analytics
        - Recent sales
        - Top products

    """


    return get_dashboard_data(

        db=db,

        owner_id=current_user.id,

    )







# ==========================================================
# Recent Sales
# ==========================================================


@router.get(
    "/recent",
    response_model=list[SaleSummary],
)
def recent_sales(

    limit: int = Query(

        default=10,

        ge=1,

        le=50,

    ),

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),

):
    """
    Return latest sales.
    """


    return get_recent_sales(

        db=db,

        owner_id=current_user.id,

        limit=limit,

    )








# ==========================================================
# Top Selling Products
# ==========================================================


@router.get(
    "/top-products",
)
def top_products(

    limit: int = Query(

        default=5,

        ge=1,

        le=20,

    ),

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),

):
    """
    Return best selling products.
    """


    return get_top_selling_products(

        db=db,

        owner_id=current_user.id,

        limit=limit,

    )







# ==========================================================
# Sales By Date Range
# ==========================================================


@router.get(
    "/date-range",
    response_model=list[SaleRead],
)
def sales_date_range(

    start_date: date,

    end_date: date,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),

):
    """
    Fetch sales between dates.
    """


    if start_date > end_date:


        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail="Start date cannot be greater than end date.",

        )



    return get_sales_by_date_range(

        db=db,

        owner_id=current_user.id,

        start_date=start_date,

        end_date=end_date,

    )
# ==========================================================
# List Sales With Filters + Pagination
# ==========================================================


@router.get(
    "",
    response_model=list[SaleRead],
)
def list_sales(

    page: int = Query(

        default=1,

        ge=1,

    ),

    page_size: int = Query(

        default=20,

        ge=1,

        le=100,

    ),

    search: str | None = Query(
        default=None
    ),

    status_filter: str | None = Query(
        default=None
    ),

    payment_method: str | None = Query(
        default=None
    ),


    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),

):
    """
    Return sales with:

    - Pagination
    - Product search
    - Status filter
    - Payment filter

    """


    query = (

        db.query(Sale)

        .join(Product)

        .filter(

            Sale.owner_id
            ==
            current_user.id

        )

    )



    # ------------------------------------------
    # Search Product Name
    # ------------------------------------------

    if search:


        query = query.filter(

            Product.name.ilike(

                f"%{search}%"

            )

        )



    # ------------------------------------------
    # Status Filter
    # ------------------------------------------

    if status_filter:


        query = query.filter(

            Sale.status == status_filter

        )



    # ------------------------------------------
    # Payment Filter
    # ------------------------------------------

    if payment_method:


        query = query.filter(

            Sale.payment_method
            ==
            payment_method

        )



    sales = (

        query

        .order_by(

            Sale.sale_date.desc(),

            Sale.created_at.desc(),

        )

        .offset(

            (page - 1)

            *

            page_size

        )

        .limit(page_size)

        .all()

    )



    return sales








# ==========================================================
# Upload Sales CSV
# ==========================================================


@router.post(
    "/upload",
    response_model=SalesUploadResult,
)
async def upload_sales_csv(

    file: UploadFile = File(...),

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),

):
    """
    Upload sales CSV.

    Flow:

    Upload CSV

        ↓

    csv_parser.py

        ↓

    DataFrame

        ↓

    list[dict]

        ↓

    sales_service.bulk_import_sales()

        ↓

    SKU lookup

        ↓

    Create sales

        ↓

    Update inventory

    """



    if not file.filename:


        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail="No file selected.",

        )





    if not file.filename.lower().endswith(".csv"):


        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail="Only CSV files are allowed.",

        )



    try:


        # --------------------------------------
        # Read Uploaded File
        # --------------------------------------

        contents = await file.read()



        import io



        csv_file = io.BytesIO(contents)




        # --------------------------------------
        # Parse CSV
        # --------------------------------------

        from app.utils.csv_parser import parse_sales_csv



        dataframe = parse_sales_csv(

            csv_file

        )



        # --------------------------------------
        # Convert DataFrame
        # --------------------------------------

        sales_data = dataframe.to_dict(

            orient="records"

        )



        # --------------------------------------
        # Import Sales
        # --------------------------------------

        from app.services.sales_service import bulk_import_sales



        result = bulk_import_sales(

            db=db,

            owner_id=current_user.id,

            sales_data=sales_data,

        )



        return SalesUploadResult(

            inserted=result["inserted"],

            skipped=result["skipped"],

            errors=result["errors"],

        )



    except ValueError as error:


        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail=str(error),

        )



    except Exception as error:


        raise HTTPException(

            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,

            detail=f"CSV upload failed: {str(error)}",

        )
