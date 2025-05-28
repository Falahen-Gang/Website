// // Fetch tasks availabe for user

// // TODO: Get value from DB
// // Initial values
// let numRows = 5;
// let numCols = 5;


// /********************************************************************************************\
// |***************************************** Task Bar *****************************************|
// \********************************************************************************************/
// const tasksContainer = document.getElementById('tasks-container');
// const tasksArrow = document.getElementById('tasks-arrow');
// const arrowIcon = document.getElementById('arrow-icon');
// const tasksList = document.getElementById('.tasks-table tbody');
// const mainContainer = document.getElementById('main-container')

// let tasksVisible = true;
// // tasksArrow.onclick = function() {
// //     tasksVisible = !tasksVisible;
// //     tasksContainer.classList.toggle('collapsed', !tasksVisible);
// //     // mainContainer.width = '120%'
// //     // graphsContainer.classList.toggle('col-md-7');
// //     // graphsContainer.classList.toggle('col-md-7');
// //     // if(tasksVisible)
// //     //     graphsContainer.style.width = '50%';
// //     // else
// //     //     graphsContainer.style.width = '100%';

// // };

// // tasksList.addEventListener('click', function(e) {
// //     if (e.target.classList.contains('task-btn')) {
// //         tasksContainer.classList.add('collapsed');
// //         tasksVisible = false;
// //         console.log(e.target.textContent);
// //     }
// // });



// // Elements for zoom and magnifier button
// // Get DOM elements
// const mapContainer = document.getElementById('map-container');

// const zoomSlider = document.getElementById('zoom-slider');
// const zoomScrollWrapper = document.getElementById('zoom-scroll-wrapper');
// const magnifierBtn = document.getElementById('magnifier-btn');
// const zoomSliderContainer = document.getElementById('zoom-slider-container');
// const innerScrollArea = document.getElementById('inner-scroll-area'); // New element reference

// // Data structure to store weeds in each cell
// // Key: "row-col" (e.g., "0-0"), Value: Array of weed objects { name: "weed_name", x: 50, y: 50 }
// const cellWeeds = {};

// // Create a single tooltip element that we can show/hide and update
// const tooltip = document.createElement('div');
// tooltip.classList.add('weed-tooltip');
// document.body.appendChild(tooltip);

// let cellBaseSizePx = 130; // Base size for each cell in pixels

// // Variables for drag-to-scroll functionality
// let isDragging = false;
// let startX, startY;
// let scrollLeft, scrollTop;


// /**
//  * Adds a weed image and a circle effect to the selected grid cell.
//  */
// function addWeed(weedName, x, y, cellId) {
//     const selectedWeedName = weedName;
//     const xLocation = x;   // 0-100 percentage
//     const yLocation = y;   // 0-100 percentage
//     const selectedCellId = cellId; // e.g., "0-0"

//     const targetCell = document.getElementById(`cell-${selectedCellId}`);

//     if (!targetCell) {
//         console.error('Target cell not found:', selectedCellId);
//         return;
//     }

//     // Store weed data in cellWeeds
//     if (!cellWeeds[selectedCellId]) {
//         cellWeeds[selectedCellId] = [];
//     }
//     cellWeeds[selectedCellId].push({
//         name: selectedWeedName,
//         x: xLocation,
//         y: yLocation
//     });

//     // Create weed image element
//     const weedImage = document.createElement('img');
//     weedImage.src = `Assets/IMG/Weeds/${selectedWeedName.replace(/ /g, '_').toLowerCase()}-removebg-preview.png`; // Placeholder for weed image
//     weedImage.alt = selectedWeedName.replace(/_/g, ' ');
//     weedImage.classList.add('weed-image');
//     // Position the weed image
//     weedImage.style.left = `${xLocation}%`;
//     weedImage.style.top = `${yLocation}%`;

//     // Create circle element
//     const weedCircle = document.createElement('div');
//     weedCircle.classList.add('weed-circle');
//     // Position the circle
//     weedCircle.style.left = `${xLocation}%`;
//     weedCircle.style.top = `${yLocation}%`;

//     // Append the circle first, then the image, so the image is on top
//     targetCell.appendChild(weedCircle);
//     targetCell.appendChild(weedImage);
// }


// /**
//  * Generates the grid based on current row and column values.
//  * Clears any existing grid cells and populates the cell list dropdown.
//  */
// function generateGrid() {
//     numRows = numRows;
//     numCols = numCols;

//     // Clear existing grid cells and weed elements from DOM and data
//     mapContainer.innerHTML = '';
//     // Clear the cellWeeds data when the grid is regenerated
//     for (const key in cellWeeds) {
//         delete cellWeeds[key];
//     }

//     // Set explicit pixel dimensions for mapContainer
//     mapContainer.style.width = `${numCols * cellBaseSizePx}px`;
//     mapContainer.style.height = `${numRows * cellBaseSizePx}px`;

//     // Set grid template columns and rows
//     mapContainer.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
//     mapContainer.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;

//     // Create grid cells
//     for (let r = 0; r < numRows; r++) {
//         for (let c = 0; c < numCols; c++) {
//             const cell = document.createElement('div');
//             cell.classList.add('grid-cell');
//             cell.dataset.row = r;
//             cell.dataset.col = c;
//             cell.id = `cell-${r}-${c}`; // Assign a unique ID for easy targeting
//             mapContainer.appendChild(cell);

//             // Add mouseover and mouseout listeners for tooltip
//             cell.addEventListener('mouseover', handleCellMouseOver);
//             cell.addEventListener('mouseout', handleCellMouseOut);
//             // Add mousemove to update tooltip position
//             cell.addEventListener('mousemove', handleCellMouseMove);
//             addWeed('amaranthus palmeri', 27, 27, `${r}-${c}`)
//         }
//     }
//     // Apply initial zoom after grid generation
//     setInitialZoom();
// }

// /**
//  * Calculates and applies the initial zoom level to ensure all columns are shown.
//  */
// function setInitialZoom() {
//     const mapContainerUnscaledWidth = numCols * cellBaseSizePx;
//     const wrapperVisibleWidth = zoomScrollWrapper.clientWidth;

//     // Calculate the minimum zoom percentage required to show all columns
//     let minFitZoom = (wrapperVisibleWidth / mapContainerUnscaledWidth) * 100;

//     // Ensure minFitZoom is not less than 100% if the grid is smaller than the wrapper
//     // The lowest zoom we want is 100% (natural size) or the zoom needed to fit all columns.
//     minFitZoom = Math.max(100, minFitZoom);

//     // Set the slider's minimum value to the calculated minFitZoom
//     zoomSlider.min = Math.ceil(minFitZoom); // Round up to ensure all columns are visible

//     // Set the slider's current value to its new minimum, so it starts at the "fit all columns" view
//     zoomSlider.value = zoomSlider.min;

//     applyZoom(); // Apply the zoom to the map container
// }

// /**
//  * Applies the current zoom level to the map container.
//  */
// function applyZoom() {
//     // const zoomLevel = parseInt(zoomSlider.value); // Slider value directly represents zoom percentage
//     // mapContainer.style.transform = `scale(${zoomLevel / 100})`;

//     const zoomLevel = parseInt(zoomSlider.value); // e.g., 150 means 150%
//     // Update the effective size of the map container.
//     const scaleFactor = zoomLevel / 100;
//     mapContainer.style.width = `${numCols * cellBaseSizePx * scaleFactor}px`;
//     mapContainer.style.height = `${numRows * cellBaseSizePx * scaleFactor}px`;
//     // Optionally, you might still use transform if needed:
//     mapContainer.style.transform = `scale(${scaleFactor})`;
//     // If using both, be mindful that transform may stack on top of the resized dimensions.
// }

// /**
//  * Handles mouseover event on a grid cell to show tooltip.
//  * @param {MouseEvent} event - The mouse event.
//  */
// function handleCellMouseOver(event) {
//     const cellId = event.currentTarget.id.replace('cell-', ''); // Get "row-col"
//     const weedsInCell = cellWeeds[cellId];

//     if (weedsInCell && weedsInCell.length > 0) {
//         let tooltipContent = `<div class="font-bold mb-2">Cell: R${parseInt(event.currentTarget.dataset.row) + 1}, C${parseInt(event.currentTarget.dataset.col) + 1}</div>`;
//         weedsInCell.forEach(weed => {
//             tooltipContent += `
//                 <div class="tooltip-weed-item">
//                     <img src="Assets/IMG/Weeds/${weed.name.replace(/ /g, '_').toLowerCase()}.jpg" alt="${weed.name}" class="tooltip-weed-image">
//                     <span>${weed.name.replace(/_/g, ' ')}</span>
//                 </div>
//             `;
//         });
//         tooltip.innerHTML = tooltipContent;
//         tooltip.classList.add('active'); // Show the tooltip
//     }
// }

// /**
//  * Handles mouseout event on a grid cell to hide tooltip.
//  */
// function handleCellMouseOut() {
//     tooltip.classList.remove('active'); // Hide the tooltip
// }

// /**
//  * Handles mousemove event on a grid cell to position tooltip.
//  * @param {MouseEvent} event - The mouse event.
//  */
// function handleCellMouseMove(event) {
//     // Position the tooltip near the cursor
//     tooltip.style.left = `${event.clientX + 15}px`; // 15px offset to the right
//     tooltip.style.top = `${event.clientY + 15}px`;  // 15px offset downwards
// }


// // Event Listener for zoom slider
// zoomSlider.addEventListener('input', applyZoom);

// // Magnifier button click to toggle zoom slider visibility
// magnifierBtn.addEventListener('click', (event) => {
//     event.stopPropagation(); // Prevent this click from immediately hiding the slider via document listener
//     zoomSliderContainer.classList.toggle('hidden');
// });

// // Hide zoom slider if clicked outside
// document.addEventListener('click', (event) => {
//     // Check if the click target is outside the zoom slider container AND outside the magnifier button
//     if (!zoomSliderContainer.classList.contains('hidden') &&
//         !zoomSliderContainer.contains(event.target) &&
//         event.target !== magnifierBtn &&
//         !magnifierBtn.contains(event.target)) { // Also check if the click was on the button itself
//         zoomSliderContainer.classList.add('hidden');
//     }
// });

// // Drag-to-scroll functionality (now on innerScrollArea)
// innerScrollArea.addEventListener('mousedown', (e) => {
//     // Only activate drag if left mouse button is pressed AND the click is NOT on the magnifier controls
//     if (e.button === 0 && !magnifierBtn.contains(e.target) && !zoomSliderContainer.contains(e.target)) {
//         isDragging = true;
//         startX = e.clientX;
//         startY = e.clientY;
//         scrollLeft = innerScrollArea.scrollLeft;
//         scrollTop = innerScrollArea.scrollTop;
//         innerScrollArea.classList.add('dragging'); // Apply grabbing cursor
//         innerScrollArea.style.userSelect = 'none'; // Prevent text selection
//         // setInitialZoom();
//     }
// });

// innerScrollArea.addEventListener('mousemove', (e) => {
//     if (!isDragging) return;
//     e.preventDefault(); // Prevent default browser drag behavior
//     const x = e.clientX - startX;
//     const y = e.clientY - startY;
//     innerScrollArea.scrollLeft = scrollLeft - x; // Apply horizontal scroll
//     innerScrollArea.scrollTop = scrollTop - y; // Apply vertical scroll
// });

// innerScrollArea.addEventListener('mouseup', () => {
//     if (isDragging) {
//         isDragging = false;
//         innerScrollArea.classList.remove('dragging'); // Remove grabbing cursor
//         innerScrollArea.style.removeProperty('user-select'); // Re-enable text selection
//     }
// });

// // Also stop dragging if mouse leaves the wrapper area
// innerScrollArea.addEventListener('mouseleave', () => {
//     if (isDragging) {
//         isDragging = false;
//         innerScrollArea.classList.remove('dragging');
//         innerScrollArea.style.removeProperty('user-select');
//     }
// });

// // while(!document.getElementById(`cell-0-0`));

// // Initial grid generation and zoom application on page load
// window.onload = generateGrid;