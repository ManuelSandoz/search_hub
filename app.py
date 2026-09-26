from flask import Flask, jsonify, render_template, request

app = Flask(__name__)


# ------------------------------------------------------------------
# Demo data
# ------------------------------------------------------------------
# For now, we are keeping the data directly in Python.
#
# Later this could come from:
#   - SQLite
#   - PostgreSQL
#   - MySQL
#   - another REST API
#   - a CSV/database file
# ------------------------------------------------------------------

ITEMS = [
    {
        "id": 1,
        "name": "Temperature Sensor",
        "description": "Measures environmental temperature.",
        "category": "Sensor",
        "status": "Active",
    },
    {
        "id": 2,
        "name": "Pressure Sensor",
        "description": "Measures fluid pressure.",
        "category": "Sensor",
        "status": "Active",
    },
    {
        "id": 3,
        "name": "Motor Controller",
        "description": "Controls electric motor operation.",
        "category": "Controller",
        "status": "Inactive",
    },
    {
        "id": 4,
        "name": "Power Controller",
        "description": "Manages system power distribution.",
        "category": "Controller",
        "status": "Active",
    },
    {
        "id": 5,
        "name": "Network Gateway",
        "description": "Provides communication between network segments.",
        "category": "Network",
        "status": "Active",
    },
    {
        "id": 6,
        "name": "Data Logger",
        "description": "Stores sensor measurements.",
        "category": "Storage",
        "status": "Inactive",
    },
    {
        "id": 7,
        "name": "Humidity Sensor",
        "description": "Measures relative humidity.",
        "category": "Sensor",
        "status": "Active",
    },
]


# ------------------------------------------------------------------
# Landing page
# ------------------------------------------------------------------
@app.route("/")
def index():
    """
    Render the application's landing page.
    """
    return render_template("index.html")


# ------------------------------------------------------------------
# Search page
# ------------------------------------------------------------------
@app.route("/search")
def search():
    """
    Render the search interface.

    The actual filtering will be handled by JavaScript calling
    the /api/items endpoint.
    """
    return render_template("search.html")


# ------------------------------------------------------------------
# Search API
# ------------------------------------------------------------------
@app.route("/api/items")
def api_items():
    """
    Return filtered items as JSON.

    Example request:

        /api/items?search=sensor&category=Sensor&status=Active

    Supported query parameters:
        search
        category
        status
    """

    # Get query parameters from the URL.
    #
    # request.args.get() returns None if the parameter doesn't exist.
    search_text = request.args.get("search", "").strip().lower()
    category = request.args.get("category", "").strip()
    status = request.args.get("status", "").strip()

    # Start with the complete dataset.
    filtered_items = ITEMS

    # --------------------------------------------------------------
    # Text search
    # --------------------------------------------------------------
    # Search both the name and description.
    if search_text:
        filtered_items = [
            item
            for item in filtered_items
            if search_text in item["name"].lower()
            or search_text in item["description"].lower()
        ]

    # --------------------------------------------------------------
    # Category filter
    # --------------------------------------------------------------
    if category:
        filtered_items = [
            item
            for item in filtered_items
            if item["category"] == category
        ]

    # --------------------------------------------------------------
    # Status filter
    # --------------------------------------------------------------
    if status:
        filtered_items = [
            item
            for item in filtered_items
            if item["status"] == status
        ]

    # Return the filtered data as JSON.
    #
    # Flask automatically converts this Python dictionary into
    # a JSON HTTP response.
    return jsonify({
        "count": len(filtered_items),
        "results": filtered_items
    })


# ------------------------------------------------------------------
# Start development server
# ------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)