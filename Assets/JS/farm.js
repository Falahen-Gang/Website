document.addEventListener('DOMContentLoaded', () => {

    // Get farm details elements
    const farmDetails = document.querySelector('.farm-info');
    const farmMap = document.querySelector('.farm-map');

    const tasksTableBody = document.querySelector('#tasks-body');
    const messageBox = document.getElementById('customMessageBox');
    const messageBoxTitle = document.getElementById('messageBoxTitle');
    const messageBoxText = document.getElementById('messageBoxText');
    const messageBoxButton = document.getElementById('messageBoxButton');

    const tasksListContainer = document.getElementById('tasks-list-container');
    const taskDetailsView = document.getElementById('task-details-view');
    const toggleTasksBtn = document.getElementById('toggle-tasks-visibility-btn');

    let isTasksListVisible = true;

    // Initial check for critical elements
    if (!tasksTableBody || !tasksListContainer || !taskDetailsView || !toggleTasksBtn) {
        console.error("Critical layout element(s) missing. App may not function correctly.");
        showCustomMessage("Initialization Error", "One or more page components are missing.");
        return;
    }


    function showCustomMessage(title, text) {
        if (!messageBox || !messageBoxTitle || !messageBoxText) {
            console.error("Message box elements not found.");
            alert(`${title}\n\n${text}`); // Fallback
            return;
        }
        messageBoxTitle.textContent = title;
        messageBoxText.textContent = text;
        messageBox.classList.add('visible');
    }

    if (messageBoxButton) {
        messageBoxButton.onclick = () => messageBox.classList.remove('visible');
    }

    function updateToggleButton() {
        const isMobile = window.innerWidth <= 768;
        if (isTasksListVisible) {
            toggleTasksBtn.innerHTML = isMobile ? 'Hide Tasks' : '&laquo;';
            toggleTasksBtn.title = "Hide Task List";
        } else {
            toggleTasksBtn.innerHTML = isMobile ? 'Show Tasks' : '&raquo;';
            toggleTasksBtn.title = "Show Task List";
        }
    }
    
    function handleToggleButtonClick() {
        isTasksListVisible = !isTasksListVisible;
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            tasksListContainer.classList.toggle('mobile-collapsed', !isTasksListVisible);
            // On mobile, details view is always full width below, so no width adjustment needed for it based on task list visibility
        } else {
            tasksListContainer.classList.toggle('collapsed', !isTasksListVisible);
        }
        updateToggleButton();
    }

    toggleTasksBtn.addEventListener('click', handleToggleButtonClick);


    function displayTaskDetails(task) {
        taskDetailsView.innerHTML = `
            <div class="details-content">
                <h3>${task.title}</h3>
                <img src="Assets/IMG/profile/image-03.webp.png" alt="${task.title}" onerror="this.onerror=null; this.src='https://placehold.co/100x100/cccccc/333333?text=No+Img';">
                <p></p>
                <p><strong>Type:</strong> ${task.type}</p>
                <p><strong>Status:</strong> <span style="color:${task.status === 'Complete' ? 'green' : (task.status === 'In Progress' ? 'orange' : 'red')}">${task.status}</span></p>
                <p><strong>Full Description:</strong> ${task.description || 'Not available.'}</p>
                <p><strong>Assigned Personnel:</strong> ${task.assigned || 'Not specified.'}</p>
            </div>
        `;
    }

    function clearTaskDetails(message = "Select a completed task to view its details.") {
        taskDetailsView.innerHTML = `
        <div class="details-placeholder">${message}</div>
        `;
    }

    function getTask(task) {

        if (task.status !== 'finished') {
            showCustomMessage("Task Incomplete", `Task "${task.title}" is currently ${task.status}. Full details are shown for completed tasks only.`);
            return;
        }
    displayTaskDetails(task)
    console.log(task)

    const serviceId           =  task.service_id
    const api_npk             = `${base_url}getNPK`;
    const api_weed            = `${base_url}getWeed`;
    const api_disease         = `${base_url}getDisease`;
    options_profile['body']   = JSON.stringify({ task_id: task.id })
    options_profile['method'] = 'POST'

  // Check Task Service Type
  // 1. Disease
  if(serviceId == 3){
    // Get Task Details
    fetch(api_disease, options_profile)
    .then(response => response.json())
    .then(data => {
      // Log Response
      console.log(data)
      // TODO Create Diseases Chart
      generateHeatmap(data.data, false);
    })
    .catch(error => console.error('Error:', error));
  }
  // 2. NPK
  else if(serviceId == 1) {
    // Get Task Details
    fetch(api_npk, options_profile)
    .then(response => response.json())
    .then(data => {
      // Log Response
      console.log(data)
      // Loop on Each NPK reading to Draw Charts
      // TODO Create NPK Chart
      generateNPK(data.data);
    })
    .catch(error => console.error('Error:', error));
  }
  // 2. Weeds
  else if(serviceId == 2) {
    // Get Task Details
    fetch(api_weed, options_profile)
    .then(response => response.json())
    .then(data => {
      // Log Response
      console.log(data)
      // TODO Create Diseases Chart
      generateHeatmap(data.data, true);
    })
    .catch(error => console.error('Error:', error));
  }



        console.log(`Task selected: ID ${task.id}, Title: ${task.title}, Status: ${task.status}`);

        // Collapse task list on any selection, if not on mobile where it might already be a bar
        const isMobile = window.innerWidth <= 768;
        if (isTasksListVisible && !isMobile) { // Only collapse if visible and not on mobile (mobile handled by its own class)
            handleToggleButtonClick(); // This will set isTasksListVisible to false
        } else if (isMobile && isTasksListVisible) { // On mobile, if list is fully open, collapse it to bar
                handleToggleButtonClick();
        }
    }


    /**
     * Generates line and barchart.
     */
    function generateNPK(data){
        // Create NPK per distance chart
        // Create Average NPK per line Chart
        taskDetailsView.querySelector(".details-content").innerHTML += `
    <div class="chart-container">
        <h2 class="text-2xl font-semibold text-gray-700">AVG. NPK Per Distance</h2>
        <svg id="multiLineChartSVG" width="100%" height="400" viewBox="0 0 800 400"></svg>
    </div>

    <div class="chart-container">
        <h2 class="text-2xl font-semibold text-gray-700">Avg. NPK Per Line</h2>
        <svg id="rowChartSVG" width="100%" height="400" viewBox="0 0 800 400"></svg>
    </div>
        `

       let distanceData = [];
       let distanceSum  = {};
       let rowData      = [];
       let rowSum       = {};
       data.forEach( npk => {
                rowSum[npk.row] = rowSum[npk.row] ? {sum_n: rowSum[npk.row]['sum_n'] + parseInt(npk.n), sum_p: rowSum[npk.row]['sum_p'] + parseInt(npk.p), sum_k: rowSum[npk.row]['sum_k'] + parseInt(npk.k), counter: rowSum[npk.row]['counter'] + 1} : {sum_n: parseInt(npk.n), sum_p: parseInt(npk.p), sum_k: parseInt(npk.k), counter: 1};
                distanceSum[npk.distance] = distanceSum[npk.distance] ? {sum_n: distanceSum[npk.distance]['sum_n'] + parseInt(npk.n), sum_p: distanceSum[npk.distance]['sum_p'] + parseInt(npk.p), sum_k: distanceSum[npk.distance]['sum_k'] + parseInt(npk.k), counter: distanceSum[npk.distance]['counter'] + 1} : {sum_n: parseInt(npk.n), sum_p: parseInt(npk.p), sum_k: parseInt(npk.k), counter: 1};
            }
        )

        console.log(Object.keys(rowSum), Object.values(rowSum))
        for(const key in rowSum){
            rowData.push({row: key, n: rowSum[key]['sum_n'] / rowSum[key]['counter'], p: rowSum[key]['sum_p'] / rowSum[key]['counter'], k: rowSum[key]['sum_k'] / rowSum[key]['counter']})
        };
        for(const key in distanceSum){
            distanceData.push({distance: key, n: distanceSum[key]['sum_n'] / distanceSum[key]['counter'], p: distanceSum[key]['sum_p'] / distanceSum[key]['counter'], k: distanceSum[key]['sum_k'] / distanceSum[key]['counter']})
        };
        console.log(distanceData)
        console.log(distanceSum)
        console.log(rowData)

        // Define color scheme for lines
        const lineColors = d3.scaleOrdinal()
            .domain(['n', 'p', 'k'])
            .range(['#ef4444', '#3b82f6', '#10b981']); // Tailwind CSS colors: red-500, blue-500, emerald-500

        // --- Multi-Line Chart Function ---
        function drawDistanceChart() {
            const svg = d3.select("#multiLineChartSVG");
            const svgWidth = 800;
            const svgHeight = 400;

            const margin = { top: 30, right: 90, bottom: 50, left: 60 }; // Increased right margin for legend
            const width = svgWidth - margin.left - margin.right;
            const height = svgHeight - margin.top - margin.bottom;

            // Clear any existing chart elements
            svg.selectAll('*').remove();

            const g = svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // X scale (Point Scale for categorical data points)
            const xScale = d3.scalePoint()
                .domain(distanceData.map(d => d.distance))
                .range([0, width])
                .padding(0.5); // Add padding between points

            // Y scale (Linear Scale)
            const yScale = d3.scaleLinear()
                // Get the max value across all products
                .domain([0, d3.max(distanceData, d => Math.max(d.n, d.p, d.k, 300)) * 1.1])
                .range([height, 0]);

            // Add X axis
            g.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(xScale));

            // Add Y axis
            g.append("g")
                .call(d3.axisLeft(yScale));

            // Add Y axis label
            g.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 5)
                .attr("x", -height / 2)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("font-size", "14px")
                .style("fill", "#555")
                .text("mg/kg");

            // Add X axis label
            g.append("text")
                .attr("y", height + 30)
                .attr("x", width / 2)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("font-size", "14px")
                .style("fill", "#555")
                .text("Distance");

            // --- Add Horizontal Colored Regions ---
            // Define Y-axis thresholds for regions
            const lowThreshold = 100; // e.g., below 100 units is "low"
            const highThreshold = 300; // e.g., above 180 units is "high"

            // Region 1: Below lowThreshold (Red)
            g.append("rect")
                .attr("x", 0)
                .attr("y", yScale(lowThreshold)) // Top of the region is at the lowThreshold value
                .attr("width", width)
                .attr("height", height - yScale(lowThreshold)) // Height from lowThreshold to bottom
                .attr("fill", "rgba(255, 99, 132, 0.1)"); // Light red

            // Region 2: Between lowThreshold and highThreshold (Green)
            g.append("rect")
                .attr("x", 0)
                .attr("y", yScale(highThreshold)) // Top of this region is at highThreshold
                .attr("width", width)
                .attr("height", yScale(lowThreshold) - yScale(highThreshold)) // Height between thresholds
                .attr("fill", "rgba(75, 192, 192, 0.1)"); // Light green

            // Region 3: Above highThreshold (Red)
            g.append("rect")
                .attr("x", 0)
                .attr("y", 0) // Top of this region is at the very top of the chart
                .attr("width", width)
                .attr("height", yScale(highThreshold)) // Height from top to highThreshold
                .attr("fill", "rgba(255, 99, 132, 0.1)"); // Light red
            // --- End Horizontal Colored Regions ---


            // Define the line generator for each product
            const lineA = d3.line()
                .x(d => xScale(d.distance))
                .y(d => yScale(d.n))
                .curve(d3.curveMonotoneX); // Smooth line

            const lineB = d3.line()
                .x(d => xScale(d.distance))
                .y(d => yScale(d.p))
                .curve(d3.curveMonotoneX);

            const lineC = d3.line()
                .x(d => xScale(d.distance))
                .y(d => yScale(d.k))
                .curve(d3.curveMonotoneX);

            // Add the lines
            g.append("path")
                .datum(distanceData)
                .attr("class", "line")
                .attr("d", lineA)
                .attr("stroke", lineColors('n'));

            g.append("path")
                .datum(distanceData)
                .attr("class", "line")
                .attr("d", lineB)
                .attr("stroke", lineColors('p'));

            g.append("path")
                .datum(distanceData)
                .attr("class", "line")
                .attr("d", lineC)
                .attr("stroke", lineColors('k'));

            // Add dots for each data point and tooltip interaction
            const products = ['n', 'p', 'k'];
            products.forEach(product => {
                g.selectAll(`.dot-${product}`)
                    .data(distanceData)
                    .enter().append("circle")
                    .attr("class", `dot dot-${product}`)
                    .attr("cx", d => xScale(d.distance))
                    .attr("cy", d => yScale(d[product]))
                    .attr("r", 4) // Radius of dots
                    .attr("fill", lineColors(product))
                    .on("mouseover", function(event, d) {
                        d3.select(this).attr("r", 6).style("fill", d3.rgb(lineColors(product)).brighter(0.5)); // Enlarge and brighten on hover
                        distanceTooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        distanceTooltip.html(`Distance: ${d.distance}<br/>${product.toUpperCase()}: ${d[product]}`)
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", function(event, d) {
                        d3.select(this).attr("r", 4).style("fill", lineColors(product)); // Original size and color
                        distanceTooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
            });

            // Add Legend
            const legend = g.append("g")
                .attr("transform", `translate(${width + 10}, 0)`); // Position legend to the right

            const legendData = [
                { name: 'N', key: 'n' },
                { name: 'P', key: 'p' },
                { name: 'K', key: 'k' }
            ];

            legend.selectAll("rect")
                .data(legendData)
                .enter().append("rect")
                .attr("x", 0)
                .attr("y", (d, i) => i * 20)
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", d => lineColors(d.key));

            legend.selectAll("text")
                .data(legendData)
                .enter().append("text")
                .attr("x", 15)
                .attr("y", (d, i) => i * 20 + 9) // Vertically center text with rect
                .attr("class", "legend")
                .text(d => d.name);
        }
    


        // --- Multi-Line Chart Function ---
        function drawRowChart() {
            const svg = d3.select("#rowChartSVG");
            const svgWidth = 800;
            const svgHeight = 400;

            const margin = { top: 30, right: 90, bottom: 50, left: 60 }; // Increased right margin for legend
            const width = svgWidth - margin.left - margin.right;
            const height = svgHeight - margin.top - margin.bottom;

            // Clear any existing chart elements
            svg.selectAll('*').remove();

            const g = svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // X scale (Point Scale for categorical data points)
            const xScale = d3.scalePoint()
                .domain(rowData.map(d => d.row))
                .range([0, width])
                .padding(0.5); // Add padding between points

            // Y scale (Linear Scale)
            const yScale = d3.scaleLinear()
                // Get the max value across all products
                .domain([0, d3.max(rowData, d => Math.max(d.n, d.p, d.k, 300)) * 1.1])
                .range([height, 0]);

            // Add X axis
            g.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(xScale));

            // Add Y axis
            g.append("g")
                .call(d3.axisLeft(yScale));

            // Add Y axis label
            g.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 5)
                .attr("x", -height / 2)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("font-size", "14px")
                .style("fill", "#555")
                .text("mg/kg");

            // Add X axis label
            g.append("text")
                .attr("y", height + 30)
                .attr("x", width / 2)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("font-size", "14px")
                .style("fill", "#555")
                .text("Line");

            // --- Add Horizontal Colored Regions ---
            // Define Y-axis thresholds for regions
            const lowThreshold = 100; // e.g., below 100 units is "low"
            const highThreshold = 300; // e.g., above 180 units is "high"

            // Region 1: Below lowThreshold (Red)
            g.append("rect")
                .attr("x", 0)
                .attr("y", yScale(lowThreshold)) // Top of the region is at the lowThreshold value
                .attr("width", width)
                .attr("height", height - yScale(lowThreshold)) // Height from lowThreshold to bottom
                .attr("fill", "rgba(255, 99, 132, 0.1)"); // Light red

            // Region 2: Between lowThreshold and highThreshold (Green)
            g.append("rect")
                .attr("x", 0)
                .attr("y", yScale(highThreshold)) // Top of this region is at highThreshold
                .attr("width", width)
                .attr("height", yScale(lowThreshold) - yScale(highThreshold)) // Height between thresholds
                .attr("fill", "rgba(75, 192, 192, 0.1)"); // Light green

            // Region 3: Above highThreshold (Red)
            g.append("rect")
                .attr("x", 0)
                .attr("y", 0) // Top of this region is at the very top of the chart
                .attr("width", width)
                .attr("height", yScale(highThreshold)) // Height from top to highThreshold
                .attr("fill", "rgba(255, 99, 132, 0.1)"); // Light red
            // --- End Horizontal Colored Regions ---


            // Define the line generator for each product
            const lineA = d3.line()
                .x(d => xScale(d.row))
                .y(d => yScale(d.n))
                .curve(d3.curveMonotoneX); // Smooth line

            const lineB = d3.line()
                .x(d => xScale(d.row))
                .y(d => yScale(d.p))
                .curve(d3.curveMonotoneX);

            const lineC = d3.line()
                .x(d => xScale(d.row))
                .y(d => yScale(d.k))
                .curve(d3.curveMonotoneX);

            // Add the lines
            g.append("path")
                .datum(rowData)
                .attr("class", "line")
                .attr("d", lineA)
                .attr("stroke", lineColors('n'));

            g.append("path")
                .datum(rowData)
                .attr("class", "line")
                .attr("d", lineB)
                .attr("stroke", lineColors('p'));

            g.append("path")
                .datum(rowData)
                .attr("class", "line")
                .attr("d", lineC)
                .attr("stroke", lineColors('k'));

            // Add dots for each data point and tooltip interaction
            const products = ['n', 'p', 'k'];
            products.forEach(product => {
                g.selectAll(`.dot-${product}`)
                    .data(rowData)
                    .enter().append("circle")
                    .attr("class", `dot dot-${product}`)
                    .attr("cx", d => xScale(d.row))
                    .attr("cy", d => yScale(d[product]))
                    .attr("r", 4) // Radius of dots
                    .attr("fill", lineColors(product))
                    .on("mouseover", function(event, d) {
                        d3.select(this).attr("r", 6).style("fill", d3.rgb(lineColors(product)).brighter(0.5)); // Enlarge and brighten on hover
                        rowTooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        rowTooltip.html(`Line: ${d.row}<br/>${product.toUpperCase()}: ${d[product]}`)
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", function(event, d) {
                        d3.select(this).attr("r", 4).style("fill", lineColors(product)); // Original size and color
                        rowTooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
            });

            // Add Legend
            const legend = g.append("g")
                .attr("transform", `translate(${width + 10}, 0)`); // Position legend to the right

            const legendData = [
                { name: 'N', key: 'n' },
                { name: 'P', key: 'p' },
                { name: 'K', key: 'k' }
            ];

            legend.selectAll("rect")
                .data(legendData)
                .enter().append("rect")
                .attr("x", 0)
                .attr("y", (d, i) => i * 20)
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", d => lineColors(d.key));

            legend.selectAll("text")
                .data(legendData)
                .enter().append("text")
                .attr("x", 15)
                .attr("y", (d, i) => i * 20 + 9) // Vertically center text with rect
                .attr("class", "legend")
                .text(d => d.name);
        }


        // Global tooltip element
        const distanceTooltip = d3.select("body").append("div")
            .attr("class", "char-tooltip");

        const rowTooltip = d3.select("body").append("div")
            .attr("class", "char-tooltip");

        drawDistanceChart();
        drawRowChart();
    }

    /**
     * Generates the grid based on current row and column values.
     * Clears any existing grid cells and populates the cell list dropdown.
     */
    function generateHeatmap(data, weed){
        const numRows = Math.ceil(parseFloat(data[0].task.farms.line_length) / 0.66)
        const numCols    = Math.ceil(parseFloat(data[0].task.farms.number_of_lines))

        console.log(numCols, numRows)

        // Create Heat Map Section
        taskDetailsView.querySelector(".details-content").innerHTML += `
        <div class="chart-container">
                <h2 class="text-2xl font-semibold text-gray-700">Count of Found ${weed? "Weeds" : "Diseases"}</h2>
            <svg id="barChartSVG" width="100%" height="400" viewBox="0 0 800 400"></svg>
        </div>
        `
        taskDetailsView.innerHTML += `
        <div class="mt-4">
        <div id="zoom-scroll-wrapper" class="relative w-full h-[400px] border border-gray-300 rounded-lg mb-8" style="overflow: hidden;">
            <div id="inner-scroll-area" style="width: 100%; height: 100%;">
                <div id="map-container" class="transform origin-top-left" style="display: grid;">
                    </div>
            </div>

            <div id="magnifier-controls" class="absolute bottom-4 right-4 flex flex-col items-center z-50">
                <div id="zoom-slider-container" class="flex flex-col items-center bg-gray-700 p-2 rounded-lg shadow-lg mb-2 hidden">
                    <span class="text-white text-xs mb-2">Zoom</span>
                    <input type="range" id="zoom-slider" min="100" max="200" value="100"
                        class="bg-indigo-100 rounded-lg appearance-none cursor-pointer range-lg">
                </div>
                <button id="magnifier-btn" class="bg-indigo-600 p-3 rounded-full shadow-lg transition-opacity duration-300 opacity-30 hover:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-white">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>
            </div>
        </div>

        `;


        // Get DOM elements
        const mapContainer = document.getElementById('map-container');
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomScrollWrapper = document.getElementById('zoom-scroll-wrapper');
        const magnifierBtn = document.getElementById('magnifier-btn');
        const zoomSliderContainer = document.getElementById('zoom-slider-container');
        const innerScrollArea = document.getElementById('inner-scroll-area'); // New element reference

        // Data structure to store weeds in each cell
        // Key: "row-col" (e.g., "0-0"), Value: Array of weed objects { name: "weed_name", x: 50, y: 50 }
        const cellWeeds = {};

        // Create a single tooltip element that we can show/hide and update
        const tooltip = document.createElement('div');
        tooltip.classList.add('weed-tooltip');
        document.body.appendChild(tooltip);


        let cellBaseSizePx = 140; // Base size for each cell in pixels

        // Variables for drag-to-scroll functionality
        let isDragging = false;
        let startX, startY;
        let scrollLeft, scrollTop;


/**
 * Adds a weed image and a circle effect to the selected grid cell.
 */
function addWeed(weedName, x, y, cellId) {
    const selectedWeedName = weedName;
    const xLocation = x;   // 0-100 percentage
    const yLocation = y;   // 0-100 percentage
    const selectedCellId = cellId; // e.g., "0-0"

    const targetCell = document.getElementById(`cell-${selectedCellId}`);

    if (!targetCell) {
        console.error('Target cell not found:', selectedCellId);
        return;
    }

    // Store weed data in cellWeeds
    if (!cellWeeds[selectedCellId]) {
        cellWeeds[selectedCellId] = [];
    }
    cellWeeds[selectedCellId].push({
        name: selectedWeedName,
        x: xLocation,
        y: yLocation
    });

    // Create weed image element
    const weedImage = document.createElement('img');
    weedImage.src = `Assets/IMG/Weeds/${selectedWeedName.replace(/ /g, '_').toLowerCase()}-removebg-preview.png`; // Placeholder for weed image
    weedImage.alt = selectedWeedName.replace(/_/g, ' ');
    weedImage.classList.add('weed-image');
    // Position the weed image
    weedImage.style.left = `${xLocation}%`;
    weedImage.style.top = `${yLocation}%`;

    // Create circle element
    const weedCircle = document.createElement('div');
    weedCircle.classList.add('weed-circle-red');
    // Position the circle
    weedCircle.style.left = `${xLocation}%`;
    weedCircle.style.top = `${yLocation}%`;


    // Create circle element
    const weedCircleYellow = document.createElement('div');
    weedCircleYellow.classList.add('weed-circle-yellow');
    // Position the circle
    weedCircleYellow.style.left = `${xLocation}%`;
    weedCircleYellow.style.top = `${yLocation}%`;

    // Append the circle first, then the image, so the image is on top
    targetCell.appendChild(weedCircleYellow);
    targetCell.appendChild(weedCircle);
    targetCell.appendChild(weedImage);
}


    /**
     * Calculates and applies the initial zoom level to ensure all columns are shown.
     */
    function setInitialZoom() {
        const mapContainerUnscaledWidth = numCols * cellBaseSizePx;
        const wrapperVisibleWidth = zoomScrollWrapper.clientWidth;

        // Calculate the minimum zoom percentage required to show all columns
        let minFitZoom = (wrapperVisibleWidth / mapContainerUnscaledWidth) * 100;

        // Ensure minFitZoom is not less than 100% if the grid is smaller than the wrapper
        // The lowest zoom we want is 100% (natural size) or the zoom needed to fit all columns.
        minFitZoom = Math.max(100, minFitZoom);

        // Set the slider's minimum value to the calculated minFitZoom
        zoomSlider.min = Math.ceil(minFitZoom); // Round up to ensure all columns are visible

        // Set the slider's current value to its new minimum, so it starts at the "fit all columns" view
        zoomSlider.value = zoomSlider.min;

        applyZoom(); // Apply the zoom to the map container
    }

    /**
     * Applies the current zoom level to the map container.
     */
    function applyZoom() {
        // const zoomLevel = parseInt(zoomSlider.value); // Slider value directly represents zoom percentage
        // mapContainer.style.transform = `scale(${zoomLevel / 100})`;

        const zoomLevel = parseInt(zoomSlider.value); // e.g., 150 means 150%
        // Update the effective size of the map container.
        const scaleFactor = zoomLevel / 100;
        mapContainer.style.width = `${numCols * cellBaseSizePx * scaleFactor}px`;
        mapContainer.style.height = `${numRows * cellBaseSizePx * scaleFactor}px`;
        // Optionally, you might still use transform if needed:
        mapContainer.style.transform = `scale(${scaleFactor})`;
        // If using both, be mindful that transform may stack on top of the resized dimensions.
    }

    /**
     * Handles mouseover event on a grid cell to show tooltip.
     * @param {MouseEvent} event - The mouse event.
     */
    function handleCellMouseOver(event) {
        const cellId = event.currentTarget.id.replace('cell-', ''); // Get "row-col"
        const weedsInCell = cellWeeds[cellId];

        if (weedsInCell && weedsInCell.length > 0) {
            let tooltipContent = `<div class="font-bold mb-2"> Line ${(parseInt(event.currentTarget.dataset.row) + 1)}, Distance ~${Math.round((parseInt(event.currentTarget.dataset.col) + 1) * 0.66)}m</div>`;
            tooltipContent += `
                <div class="tooltip-weed-item">
                    <img src="${data[0].img}" alt="${weedsInCell[0].name}" class="tooltip-weed-image">
                    <span>${weedsInCell[0].name.replace(/_/g, ' ')}</span>
                </div>
            `;
        
            // weedsInCell.forEach((weed, index) => {
            //     tooltipContent += `
            //         <div class="tooltip-weed-item">
            //             <img src="${data[index].img}" alt="${weed.name}" class="tooltip-weed-image">
            //             <span>${weed.name.replace(/_/g, ' ')}</span>
            //         </div>
            //     `;
            // });
            tooltip.innerHTML = tooltipContent;
            tooltip.classList.add('active'); // Show the tooltip
        }
    }

    /**
     * Handles mouseout event on a grid cell to hide tooltip.
     */
    function handleCellMouseOut() {
        tooltip.classList.remove('active'); // Hide the tooltip
    }

    /**
     * Handles mousemove event on a grid cell to position tooltip.
     * @param {MouseEvent} event - The mouse event.
     */
    function handleCellMouseMove(event) {
        // Position the tooltip near the cursor
        if(event.clientX > (window.innerWidth * 0.7))
            tooltip.style.left = `${event.clientX - 340}px`; // 15px offset to the right
        else
            tooltip.style.left = `${event.clientX + 15}px`; // 15px offset to the right
        if(event.clientY > (window.innerHeight * 0.6))
            tooltip.style.top = `${event.clientY - 200}px`; // 15px offset to the right
        else
            tooltip.style.top = `${event.clientY + 15}px`; // 15px offset to the right
    }


    // Event Listener for zoom slider
    zoomSlider.addEventListener('input', applyZoom);

    // Magnifier button click to toggle zoom slider visibility
    magnifierBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent this click from immediately hiding the slider via document listener
        zoomSliderContainer.classList.toggle('hidden');
    });

    // Hide zoom slider if clicked outside
    document.addEventListener('click', (event) => {
        // Check if the click target is outside the zoom slider container AND outside the magnifier button
        if (!zoomSliderContainer.classList.contains('hidden') &&
            !zoomSliderContainer.contains(event.target) &&
            event.target !== magnifierBtn &&
            !magnifierBtn.contains(event.target)) { // Also check if the click was on the button itself
            zoomSliderContainer.classList.add('hidden');
        }
    });

    // Drag-to-scroll functionality (now on innerScrollArea)
    innerScrollArea.addEventListener('mousedown', (e) => {
        // Only activate drag if left mouse button is pressed AND the click is NOT on the magnifier controls
        if (e.button === 0 && !magnifierBtn.contains(e.target) && !zoomSliderContainer.contains(e.target)) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            scrollLeft = innerScrollArea.scrollLeft;
            scrollTop = innerScrollArea.scrollTop;
            innerScrollArea.classList.add('dragging'); // Apply grabbing cursor
            innerScrollArea.style.userSelect = 'none'; // Prevent text selection
            // setInitialZoom();
        }
    });

    innerScrollArea.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Prevent default browser drag behavior
        const x = e.clientX - startX;
        const y = e.clientY - startY;
        innerScrollArea.scrollLeft = scrollLeft - x; // Apply horizontal scroll
        innerScrollArea.scrollTop = scrollTop - y; // Apply vertical scroll
    });

    innerScrollArea.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            innerScrollArea.classList.remove('dragging'); // Remove grabbing cursor
            innerScrollArea.style.removeProperty('user-select'); // Re-enable text selection
        }
    });

    // Also stop dragging if mouse leaves the wrapper area
    innerScrollArea.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            innerScrollArea.classList.remove('dragging');
            innerScrollArea.style.removeProperty('user-select');
        }
    });



        // Clear existing grid cells and weed elements from DOM and data
        mapContainer.innerHTML = '';
        // Clear the cellWeeds data when the grid is regenerated
        for (const key in cellWeeds) {
            delete cellWeeds[key];
        }

        // Set explicit pixel dimensions for mapContainer
        mapContainer.style.width = `${numCols * cellBaseSizePx}px`;
        mapContainer.style.height = `${numRows * cellBaseSizePx}px`;

        // Set grid template columns and rows
        mapContainer.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
        mapContainer.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;

        // Create grid cells
        for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < numCols; c++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.id = `cell-${r}-${c}`; // Assign a unique ID for easy targeting
                mapContainer.appendChild(cell);

                // Add mouseover and mouseout listeners for tooltip
                cell.addEventListener('mouseover', handleCellMouseOver);
                cell.addEventListener('mouseout', handleCellMouseOut);
                // Add mousemove to update tooltip position
                cell.addEventListener('mousemove', handleCellMouseMove);
            }
        }
        // Weeds/Diseases Counter
        let counter = 0
        let name    = '';
        let found_list = {};
        let barData = [];
        data.forEach( weed => {
            // TODO: Add weed.x and weed.y
            if(weed.type !== "Healthy"){
                counter++;
                name = weed.type.toUpperCase().replace(/_/g, ' ')
                found_list[name] = found_list[name] ? found_list[name] + 1 : 1;
                addWeed(weed.type, 27, 27, `${Math.ceil(parseFloat(weed.row))}-${Math.ceil(parseFloat(weed.distance) / 0.66)}`)
            }
        })
        taskDetailsView.querySelector('p').innerHTML = `<strong>Count:</strong> ${counter}`
        const weeds = true;



        console.log(Object.keys(found_list), Object.values(found_list))
        for(const key in found_list){
            barData.push({disease: key, count: found_list[key]})
        };
        console.log(barData)

        // --- Bar Chart Function ---
        function drawBarChart() {
            const svg = d3.select("#barChartSVG");
            const svgWidth = 800; // Corresponds to viewBox width
            const svgHeight = 400; // Corresponds to viewBox height

            const margin = { top: 30, right: 30, bottom: 50, left: 60 };
            const width = svgWidth - margin.left - margin.right;
            const height = svgHeight - margin.top - margin.bottom;

            // Clear any existing chart elements
            svg.selectAll('*').remove();

            const g = svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // X scale (Band Scale for categorical data)
            const xScale = d3.scaleBand()
                .domain(barData.map(d => d.disease))
                .range([0, width])
                .padding(0.3);

            // Y scale (Linear Scale for numerical data)
            const yScale = d3.scaleLinear()
                .domain([0, d3.max(barData, d => d.count) * 2]) // 10% buffer for max value
                .range([height, 0]);

            // Add X axis
            g.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(xScale))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

            // Add Y axis
            g.append("g")
                .call(d3.axisLeft(yScale).tickFormat(d => d));

            // Add Y axis label
            g.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 15)
                .attr("x", -height / 2)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("font-size", "14px")
                .style("fill", "#555")
                .text("Count");

            // Add bars
            g.selectAll(".bar")
                .data(barData)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", d => xScale(d.disease))
                .attr("y", d => yScale(d.count))
                .attr("width", xScale.bandwidth())
                .attr("height", d => height - yScale(d.count))
                .attr("fill", "rgba(75, 192, 192, 0.8)") // Teal color for bars
                .on("mouseover", function(event, d) {
                    d3.select(this).attr("fill", "rgba(75, 192, 192, 1)"); // Darker on hover
                    chartTooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    chartTooltip.html(`${weed? "Weed":"Disease"}: ${d.disease}<br/>Count: ${d.count.toLocaleString()}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function(event, d) {
                    d3.select(this).attr("fill", "rgba(75, 192, 192, 0.8)"); // Original color
                    chartTooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        }

        // Global tooltip element
        const chartTooltip = d3.select("body").append("div")
            .attr("class", "char-tooltip");

        
        drawBarChart();

        // Apply initial zoom after grid generation
        setInitialZoom();
}
    
// while(!document.getElementById(`cell-0-0`));

// // Initial grid generation and zoom application on page load
// window.onload = generateGrid;





const api_farm = `${base_url}getFarms`;
const options_profile = {
    method : 'GET',
    headers : {
        'Authorization' : `Bearer ${localStorage['token']}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
};


// Get Tasks
fetch(api_farm, options_profile)
.then(response => response.json())
.then(data => {
  console.log(data)
  data.data.forEach(farm => {
    if(farm.id == localStorage.getItem('farmId'))
    {
        // Add map to farm
        farmMap.innerHTML = `<div id="map-${farm.id}" class="farm-map" style="height: 380px; width: 100%;"></div>`;
        var mapbox_url = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9ubnltY2N1bGxhZ2giLCJhIjoiY2xsYzdveWh4MGhwcjN0cXV5Z3BwMXA1dCJ9.QoEHzPNq9DtTRrdtXfOdrw';
        var mapbox_attribution = '© Mapbox © OpenStreetMap Contributors';
        var esri_url ='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        var esri_attribution = '© Esri © OpenStreetMap Contributors';

        var lyr_satellite = L.tileLayer(esri_url, {id: 'MapID', maxZoom: 20, tileSize: 512, zoomOffset: -1, attribution: esri_attribution});
        var lyr_streets   = L.tileLayer(mapbox_url, {id: 'mapbox/streets-v11', maxZoom: 28, tileSize: 512, zoomOffset: -1, attribution: mapbox_attribution});

        var baseMaps = {
            "Streets": lyr_streets,
            "Satellite": lyr_satellite
        };

        console.log(farm.x, farm.y)
        if (!farm.x || !farm.y) {
        farm.x = 1
        farm.y = 1
        }
        const map = L.map(
            `map-${farm.id}`,
            {
                dragging: false,
                zoomControl: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                boxZoom: false,
                touchZoom: false,
                keyboard: false,
                layers: [lyr_satellite, lyr_streets]
            }
            ).setView([parseFloat(farm.x), parseFloat(farm.y)], 17);

            L.marker().setLatLng([farm.x, farm.y]).addTo(map).bindPopup(`<b>${farm.location}</b>`).openPopup();;
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        L.control.layers(baseMaps).addTo(map);

        // Add Farm Details
        farmDetails.innerHTML = `
          <h3 data-key="FarmName">Farm Name ${farm.name}</h3>
          <p>Location <span id="farm-location">${farm.location}</span></p>
          <p>Size <span id="farm-size">${farm.area}</span></p>
          <p>Crops <span id="farm-crops">Tomato</span></p>
        `

    if (farm && farm.tasks && farm.tasks.length > 0) {
        farm.tasks.forEach(task => {
            const tr = document.createElement('tr');
            tr.className = 'task-item';
            tr.innerHTML = `
                <td><img src="Assets/IMG/profile/image-03.webp.png" alt="${task.title} image" onerror="this.onerror=null; this.src='https://placehold.co/40x40/cccccc/333333?text=X';"></td>
                <td>${task.type}</td>
                <td>${task.title}</td>
                <td></td>
                <td>${task.status}</td>
            `;
            tr.addEventListener('click', () => getTask(task));
            tasksTableBody.appendChild(tr);
        });
    } else {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 4;
        td.textContent = 'No tasks available.';
        td.style.textAlign = 'center';
        tr.appendChild(td);
        tasksTableBody.appendChild(tr);
        console.warn("No tasks found.");
    }


    }
  })

})
.catch(error => console.error('Error:', error));


    // Initial setup
    // clearTaskDetails(); // Set initial placeholder message in details view
    updateToggleButton(); // Set initial button text/icon

    // Update button on resize to handle mobile/desktop views correctly
    window.addEventListener('resize', updateToggleButton);
        // Adjust layout on resize, especially for mobile transitions
    window.addEventListener('resize', () => {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            // If switching to mobile and tasks list was collapsed desktop-style, ensure mobile-collapsed is applied if needed
            if (!isTasksListVisible) tasksListContainer.classList.add('mobile-collapsed');
            else tasksListContainer.classList.remove('mobile-collapsed');
            tasksListContainer.classList.remove('collapsed'); // Remove desktop collapse style
        } else {
            // If switching to desktop, ensure desktop styles are applied
            if (!isTasksListVisible) tasksListContainer.classList.add('collapsed');
            else tasksListContainer.classList.remove('collapsed');
            tasksListContainer.classList.remove('mobile-collapsed'); // Remove mobile collapse style
        }
        updateToggleButton();
    });

});