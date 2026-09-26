// ================================================================
// DOM references
// ================================================================

// Search text field
const searchInput = document.getElementById("search-input");

// Category dropdown
const categoryFilter = document.getElementById("category-filter");

// Status dropdown
const statusFilter = document.getElementById("status-filter");

// Container where result cards will be inserted
const resultsContainer =
    document.getElementById("results-container");

// Result count text
const resultCount =
    document.getElementById("result-count");

// "No results" message
const noResults =
    document.getElementById("no-results");


// ================================================================
// Load results from Flask
// ================================================================

async function loadResults() {

    try {

        // ----------------------------------------------------------
        // Read the current filter values
        // ----------------------------------------------------------

        const search = searchInput.value.trim();

        const category = categoryFilter.value;

        const status = statusFilter.value;


        // ----------------------------------------------------------
        // Build query parameters
        // ----------------------------------------------------------

        /*
            URLSearchParams creates a URL query string.

            For example:

                search=sensor&category=Sensor&status=Active
        */

        const params = new URLSearchParams();


        // Only add parameters when the user actually selected them.

        if (search) {
            params.append("search", search);
        }

        if (category) {
            params.append("category", category);
        }

        if (status) {
            params.append("status", status);
        }


        // ----------------------------------------------------------
        // Call Flask
        // ----------------------------------------------------------

        /*
            fetch() sends an HTTP request without reloading the
            current page.

            Example:

                GET /api/items?search=sensor&status=Active
        */

        const response = await fetch(
            `/api/items?${params.toString()}`
        );


        // Check whether Flask returned an HTTP error.

        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        // Convert the JSON response into a JavaScript object.

        const data = await response.json();


        // ----------------------------------------------------------
        // Display results
        // ----------------------------------------------------------

        renderResults(data.results);

        resultCount.textContent =
            `${data.count} result${data.count === 1 ? "" : "s"}`;

    }

    catch (error) {

        console.error(
            "Unable to load search results:",
            error
        );

        resultCount.textContent =
            "Unable to load results.";

    }
}


// ================================================================
// Render result cards
// ================================================================

function renderResults(items) {

    // Remove any previous results.

    resultsContainer.innerHTML = "";


    // --------------------------------------------------------------
    // Handle zero results
    // --------------------------------------------------------------

    if (items.length === 0) {

        noResults.classList.remove("hidden");

        return;

    }


    // We have results, so hide the "no results" message.

    noResults.classList.add("hidden");


    // --------------------------------------------------------------
    // Create a card for each result
    // --------------------------------------------------------------

    items.forEach(item => {

        /*
            Create a new <article> element.

            We use DOM APIs rather than inserting all of the HTML
            into the page as one large string.
        */

        const card =
            document.createElement("article");

        card.className = "result-card";


        // Result title

        const title =
            document.createElement("h3");

        title.textContent = item.name;


        // Result description

        const description =
            document.createElement("p");

        description.textContent =
            item.description;


        // Metadata container

        const metadata =
            document.createElement("div");

        metadata.className = "result-meta";


        // Category badge

        const category =
            document.createElement("span");

        category.className = "badge";

        category.textContent =
            `Category: ${item.category}`;


        // Status badge

        const status =
            document.createElement("span");

        status.className = "badge";

        status.textContent =
            `Status: ${item.status}`;


        // Assemble the card

        metadata.appendChild(category);

        metadata.appendChild(status);

        card.appendChild(title);

        card.appendChild(description);

        card.appendChild(metadata);


        // Add card to the results container

        resultsContainer.appendChild(card);

    });
}


// ================================================================
// Event listeners
// ================================================================

// Run a search whenever the category changes.

categoryFilter.addEventListener(
    "change",
    loadResults
);


// Run a search whenever the status changes.

statusFilter.addEventListener(
    "change",
    loadResults
);


// ---------------------------------------------------------------
// Text search
// ---------------------------------------------------------------

/*
    For the text field, we don't necessarily want to make an HTTP
    request for every single keystroke.

    Without debouncing:

        s  → request
        se → request
        sen → request
        sens → request
        senso → request
        sensor → request

    Instead, wait until the user stops typing for 250ms.
*/

let searchTimeout;

searchInput.addEventListener(
    "input",
    () => {

        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(
            loadResults,
            250
        );

    }
);


// ================================================================
// Initial load
// ================================================================

// Load all records when the search page first opens.

loadResults();