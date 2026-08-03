"""
==============================================================
CSV Parser Utility
--------------------------------------------------------------
Purpose:
    • Read uploaded sales CSV files
    • Validate file structure
    • Clean raw data
    • Prepare dataframe for service layer

IMPORTANT:
    This file DOES NOT:
        ❌ Query database
        ❌ Lookup products
        ❌ Update inventory
        ❌ Create sales

Responsibilities belong to:

    services/sales_service.py

Workflow:

CSV
 |
 ↓
Parser
 |
 ↓
Clean DataFrame
 |
 ↓
Sales Service
 |
 ↓
SKU lookup
 |
 ↓
Create Sale
 |
 ↓
Update Inventory

==============================================================
"""


from __future__ import annotations


from datetime import datetime
from typing import BinaryIO


import pandas as pd



# ==========================================================
# Required CSV Columns
# ==========================================================

REQUIRED_COLUMNS = [

    "sale_date",

    "customer_name",

    "product_sku",

    "quantity",

    "unit_price",

    "payment_method",

]



# ==========================================================
# Optional CSV Columns
# ==========================================================

OPTIONAL_COLUMNS = [

    "customer_email",

    "customer_phone",

    "discount",

    "tax",

    "status",

    "employee",

    "notes",

]



# ==========================================================
# Valid Payment Methods
# ==========================================================

VALID_PAYMENT_METHODS = {

    "Cash",

    "Card",

    "UPI",

    "Net Banking",

    "Wallet",

}



# ==========================================================
# Valid Sale Status
# ==========================================================

VALID_STATUS = {

    "Completed",

    "Pending",

    "Cancelled",

}



# ==========================================================
# Maximum File Size
# ==========================================================

MAX_FILE_SIZE = 100 * 1024 * 1024



# ==========================================================
# CSV Validation Exception
# ==========================================================


class CSVValidationError(Exception):
    """
    Raised when CSV validation fails.
    """

    pass




# ==========================================================
# File Size Validation
# ==========================================================


def validate_file_size(
    file: BinaryIO,
) -> None:
    """
    Prevent extremely large uploads.
    """


    file.seek(0, 2)


    size = file.tell()


    file.seek(0)



    if size > MAX_FILE_SIZE:

        raise CSVValidationError(

            f"CSV file exceeds "
            f"{MAX_FILE_SIZE // (1024 * 1024)} MB limit."

        )




# ==========================================================
# Empty File Validation
# ==========================================================


def validate_not_empty(
    df: pd.DataFrame,
) -> None:
    """
    Ensure CSV contains records.
    """


    if df.empty:

        raise CSVValidationError(

            "Uploaded CSV file is empty."

        )





# ==========================================================
# Normalize Column Names
# ==========================================================


def normalize_columns(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Normalize CSV headers.

    Example:

    Product SKU

    becomes:

    product_sku

    """


    df.columns = (

        df.columns

        .str.strip()

        .str.lower()

        .str.replace(
            " ",
            "_",
            regex=False,
        )

        .str.replace(
            "-",
            "_",
            regex=False,
        )

    )


    return df





# ==========================================================
# Read CSV File
# ==========================================================


def read_csv_file(
    file: BinaryIO,
) -> pd.DataFrame:
    """
    Read uploaded CSV safely.
    """


    validate_file_size(file)



    try:

        file.seek(0)


        df = pd.read_csv(

            file,

            encoding="utf-8"

        )



    except UnicodeDecodeError:


        file.seek(0)


        try:

            df = pd.read_csv(

                file,

                encoding="latin-1"

            )


        except Exception as exc:


            raise CSVValidationError(

                "Unable to decode CSV file."

            ) from exc




    except Exception as exc:


        raise CSVValidationError(

            f"CSV parsing failed: {str(exc)}"

        ) from exc




    validate_not_empty(df)



    df = normalize_columns(df)



    return df






# ==========================================================
# Validate Required Columns
# ==========================================================


def validate_required_columns(
    df: pd.DataFrame,
) -> None:
    """
    Ensure mandatory columns exist.
    """


    existing_columns = set(df.columns)



    required_columns = set(REQUIRED_COLUMNS)



    missing_columns = (

        required_columns

        -

        existing_columns

    )



    if missing_columns:


        raise CSVValidationError(

            "Missing required columns: "

            +

            ", ".join(

                sorted(missing_columns)

            )

        )






# ==========================================================
# Remove Empty Rows
# ==========================================================


def remove_empty_rows(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Remove completely empty rows.
    """


    return (

        df

        .dropna(
            how="all"
        )

        .reset_index(
            drop=True
        )

    )





# ==========================================================
# Remove Duplicate Rows
# ==========================================================


def remove_duplicate_rows(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Remove duplicate records.
    """


    return (

        df

        .drop_duplicates()

        .reset_index(
            drop=True
        )

    )





# ==========================================================
# Trim String Columns
# ==========================================================


def trim_string_columns(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Remove extra spaces.
    """


    string_columns = df.select_dtypes(

        include=["object"]

    ).columns



    for column in string_columns:


        df[column] = (

            df[column]

            .fillna("")

            .astype(str)

            .str.strip()

        )



    return df






# ==========================================================
# Replace Blank Values
# ==========================================================


def replace_blank_values(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Replace empty strings with None.
    """


    return df.replace(

        {

            "": None,

            " ": None,

            "NULL": None,

            "null": None,

            "NaN": None,

        }

    )





# ==========================================================
# Validate Required Data
# ==========================================================


def validate_required_data(
    df: pd.DataFrame,
) -> None:
    """
    Ensure mandatory fields
    do not contain empty values.
    """


    for column in REQUIRED_COLUMNS:


        if df[column].isnull().any():


            rows = (

                df.index[
                    df[column].isnull()
                ]

                +

                2

            )



            raise CSVValidationError(

                f"Column '{column}' contains "
                f"empty values at rows {list(rows)}"

            )




# ==========================================================
# Clean DataFrame Pipeline
# ==========================================================


def clean_dataframe(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Basic dataframe cleaning.
    """


    df = remove_empty_rows(df)


    df = remove_duplicate_rows(df)


    df = trim_string_columns(df)


    df = replace_blank_values(df)



    validate_required_columns(df)


    validate_required_data(df)



    return df
# ==========================================================
# Business Rule Validation
# ==========================================================


def validate_business_rules(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Validate sales business rules.

    Does NOT access database.

    Database validation happens in:

        sales_service.py
    """

    # ------------------------------------------
    # Quantity Validation
    # ------------------------------------------

    df["quantity"] = pd.to_numeric(

        df["quantity"],

        errors="coerce"

    )


    if df["quantity"].isnull().any():

        raise CSVValidationError(

            "Quantity contains invalid values."

        )


    if (df["quantity"] <= 0).any():

        raise CSVValidationError(

            "Quantity must be greater than zero."

        )



    # ------------------------------------------
    # Unit Price Validation
    # ------------------------------------------

    df["unit_price"] = pd.to_numeric(

        df["unit_price"],

        errors="coerce"

    )


    if df["unit_price"].isnull().any():

        raise CSVValidationError(

            "Unit price contains invalid values."

        )


    if (df["unit_price"] < 0).any():

        raise CSVValidationError(

            "Unit price cannot be negative."

        )



    # ------------------------------------------
    # Discount
    # ------------------------------------------

    if "discount" not in df.columns:

        df["discount"] = 0.0


    df["discount"] = pd.to_numeric(

        df["discount"],

        errors="coerce"

    ).fillna(0)



    if (df["discount"] < 0).any():

        raise CSVValidationError(

            "Discount cannot be negative."

        )



    # ------------------------------------------
    # Tax
    # ------------------------------------------

    if "tax" not in df.columns:

        df["tax"] = 0.0


    df["tax"] = pd.to_numeric(

        df["tax"],

        errors="coerce"

    ).fillna(0)



    if (df["tax"] < 0).any():

        raise CSVValidationError(

            "Tax cannot be negative."

        )



    # ------------------------------------------
    # Payment Validation
    # ------------------------------------------

    df["payment_method"] = (

        df["payment_method"]

        .astype(str)

        .str.strip()

    )


    invalid_payment = (

        ~df["payment_method"]

        .isin(
            VALID_PAYMENT_METHODS
        )

    )



    if invalid_payment.any():

        values = (

            df.loc[
                invalid_payment,
                "payment_method"
            ]

            .unique()

        )


        raise CSVValidationError(

            f"Invalid payment methods: {list(values)}"

        )



    # ------------------------------------------
    # Status Validation
    # ------------------------------------------

    if "status" in df.columns:


        df["status"] = (

            df["status"]

            .fillna("Completed")

            .astype(str)

            .str.strip()

        )


        invalid_status = (

            ~df["status"]

            .isin(
                VALID_STATUS
            )

        )


        if invalid_status.any():

            values = (

                df.loc[
                    invalid_status,
                    "status"
                ]

                .unique()

            )


            raise CSVValidationError(

                f"Invalid status values: {list(values)}"

            )



    else:


        df["status"] = "Completed"



    return df





# ==========================================================
# Date Validation
# ==========================================================


def normalize_sale_dates(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Convert sale_date into proper date format.
    """


    df["sale_date"] = pd.to_datetime(

        df["sale_date"],

        errors="coerce"

    )



    if df["sale_date"].isnull().any():

        raise CSVValidationError(

            "Invalid sale_date values found."

        )



    df["sale_date"] = (

        df["sale_date"]

        .dt.date

    )


    return df





# ==========================================================
# Calculate Total Amount
# ==========================================================


def calculate_total_amount(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Calculate total sale amount.

    Formula:

    quantity × unit_price
    - discount
    + tax

    """


    df["total_amount"] = (

        (

            df["quantity"]

            *

            df["unit_price"]

        )

        -

        df["discount"]

        +

        df["tax"]

    )


    df["total_amount"] = (

        df["total_amount"]

        .round(2)

    )


    return df





# ==========================================================
# Rename Fields For Service Layer
# ==========================================================


def prepare_sales_dataframe(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Convert parser fields
    into service layer fields.

    quantity
        |
        ↓
    quantity_sold
    """


    df = df.rename(

        columns={

            "quantity":

            "quantity_sold"

        }

    )


    return df





# ==========================================================
# Complete CSV Parsing Pipeline
# ==========================================================


def parse_sales_csv(
    file: BinaryIO,
) -> pd.DataFrame:
    """
    Complete sales CSV parser pipeline.


    Flow:

    Upload CSV

        ↓

    Read CSV

        ↓

    Clean

        ↓

    Validate rules

        ↓

    Calculate total

        ↓

    Rename fields

        ↓

    Return DataFrame

    """


    df = read_csv_file(file)



    df = clean_dataframe(df)



    df = validate_business_rules(df)



    df = normalize_sale_dates(df)



    df = calculate_total_amount(df)



    df = prepare_sales_dataframe(df)



    return df.reset_index(drop=True)






# ==========================================================
# DataFrame Preview
# ==========================================================


def dataframe_preview(
    df: pd.DataFrame,
    rows: int = 5,
) -> list[dict]:
    """
    Return CSV preview records.
    """


    if df.empty:

        return []



    return (

        df.head(rows)

        .to_dict(

            orient="records"

        )

    )





# ==========================================================
# Upload Statistics
# ==========================================================


def dataframe_statistics(
    df: pd.DataFrame,
) -> dict:
    """
    Generate upload statistics.
    """


    return {


        "rows": int(

            len(df)

        ),


        "columns": int(

            len(df.columns)

        ),


        "total_quantity": int(

            df["quantity_sold"]

            .sum()

        ),



        "total_sales": float(

            df["total_amount"]

            .sum()

        ),



        "unique_products": int(

            df["product_sku"]

            .nunique()

        ),



        "unique_customers": int(

            df["customer_name"]

            .nunique()

        ),

    }





# ==========================================================
# High Level Upload Helper
# ==========================================================


def parse_uploaded_sales_file(
    file: BinaryIO,
) -> tuple[pd.DataFrame, dict]:
    """
    Parse CSV and return:

        dataframe

        statistics
    """


    df = parse_sales_csv(file)



    stats = dataframe_statistics(df)



    return df, stats






# ==========================================================
# Module Exports
# ==========================================================


__all__ = [

    "CSVValidationError",

    "parse_sales_csv",

    "parse_uploaded_sales_file",

    "dataframe_preview",

    "dataframe_statistics",

]
