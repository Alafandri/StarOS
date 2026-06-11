var biggestIndex = 1;
var selectedIcon = undefined;

var topBar = document.querySelector("#top");
var welcomeScreen = document.querySelector("#welcome");
var welcomeScreenClose = document.querySelector("#welcomeclose");
var welcomeScreenOpen = document.querySelector("#welcomeopen");

var content = [
    {
        title: "%&2!3",
        date: "06/28/1999",
        content: `
            <p contenteditable="true">
                <blockquote style="background-color: #F9F9F9; margin: 16px 0; padding: 16px; border-radius: 16px;">
                   <span>Devlog <strong>1</strong><br><br>
                    <img src="" style="width: 96px; border-radius: 16px" /><br><br>
                    Progress is good so far, the OS is coming together very well. And I havev decided to name it <del>DustOS</del> <strong>StarOS</strong></span>
                    <span>That's it for now! See you soon.</span>
                </blockquote>
              <i>Update: This OS has turned out to be the most special thing I have ever created! <br>~ Alafandri</i>
            </p>
        `
    },
    {
        title: "Test",
        date: "06/28/2026",
        content: `
            <p contenteditable="true">Test</p>
        `
    }
];

function updateTime() {
    var currentTime = new Date().toLocaleString();
    var timeText = document.querySelector("#timeElement");
    timeText.innerHTML = currentTime;
}
updateTime();
setInterval(updateTime, 1000);

function closeWindow(element) {
    element.style.display = "none";
}

function openWindow(element) {
    element.style.display = "flex";
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    topBar.style.zIndex = biggestIndex + 1;
}

function handleWindowTap(element) {
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    topBar.style.zIndex = biggestIndex + 1;
    if (selectedIcon) {
        deselectIcon(selectedIcon);
    }
}

function addWindowTapHandling(element) {
    element.addEventListener("mousedown", function() {
        handleWindowTap(element);
    });
}

function selectIcon(element) {
    element.classList.add("selected");
    selectedIcon = element;
}

function deselectIcon(element) {
    element.classList.remove("selected");
    selectedIcon = undefined;
}

function handleIconTap(element, targetWindow) {
    if (element.classList.contains("selected")) {
        deselectIcon(element);
        openWindow(targetWindow);
    } else {
        if (selectedIcon) {
            deselectIcon(selectedIcon);
        }
        selectIcon(element);
    }
}

function setNotesContent(index) {
    var notesDisplay = document.querySelector("#notesDisplay");
    if (notesDisplay) {
        notesDisplay.innerHTML = content[index].content;
    }
}

function addToSideBar(index) {
    var sidebar = document.querySelector("#sidebar");
    if (!sidebar) return;
    var note = content[index];
    var newDiv = document.createElement("div");
    newDiv.classList.add("sidebar-item");
    newDiv.innerHTML = `
        <p style="margin: 0px; font-weight: bold;">${note.title}</p>
        <p style="font-size: 12px; margin: 0px;">${note.date}</p>
    `;
    newDiv.addEventListener("click", function() {
        setNotesContent(index);
    });
    sidebar.appendChild(newDiv);
}

function initializeWindow(windowId) {
    var win = document.getElementById(windowId);
    dragElement(win);
    addWindowTapHandling(win);

    var closeBtn = document.getElementById(windowId + "close");
    if (closeBtn) {
        closeBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            closeWindow(win);
        });
    }
}

function initializeIcon(iconId, windowId) {
    var icon = document.getElementById(iconId);
    var win = document.getElementById(windowId);
    if (!icon) return;
    icon.addEventListener("click", function(e) {
        e.stopPropagation();
        handleIconTap(icon, win);
    });
}

welcomeScreenOpen.addEventListener("click", function(e) {
    e.stopPropagation();
    openWindow(welcomeScreen);
});

document.addEventListener("click", function() {
    if (selectedIcon) {
        deselectIcon(selectedIcon);
    }
});

for (let i = 0; i < content.length; i++) {
    addToSideBar(i);
}
if (content.length > 0) {
    setNotesContent(0);
}

initializeWindow("welcome");
initializeWindow("notes");
initializeWindow("photo");
initializeWindow("sudoku");

initializeIcon("notesIcon", "notes");
initializeIcon("photoIcon", "photo");
initializeIcon("sudokuicon", "sudoku");

const sudokuSolution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

const sudokuStartingBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

let playerBoard = JSON.parse(JSON.stringify(sudokuStartingBoard));
let selectedCellIndex = null;

function renderSudokuBoard() {
    const gridContainer = document.getElementById("sudokuGrid");
    if (!gridContainer) return;
    gridContainer.innerHTML = "";

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cellVal = playerBoard[r][c];
            const isInitial = sudokuStartingBoard[r][c] !== 0;
            
            const cell = document.createElement("div");
            cell.classList.add("sudoku-cell");
            if (isInitial) cell.classList.add("initial");
            
            cell.textContent = cellVal !== 0 ? cellVal : "";
            const internalIndex = r * 9 + c;
            
            if (selectedCellIndex === internalIndex) {
                cell.classList.add("selected");
            }

            cell.addEventListener("click", function(e) {
                e.stopPropagation();
                if (isInitial) return; 
                selectedCellIndex = internalIndex;
                renderSudokuBoard();
            });

            gridContainer.appendChild(cell);
        }
    }
}

document.querySelectorAll(".num-btn").forEach(button => {
    button.addEventListener("click", function(e) {
        e.stopPropagation();
        if (selectedCellIndex === null) return;

        const row = Math.floor(selectedCellIndex / 9);
        const col = selectedCellIndex % 9;
        const val = parseInt(this.getAttribute("data-val"));

        playerBoard[row][col] = val;
        renderSudokuBoard();
        checkSudokuWinCondition();
    });
});

function checkSudokuWinCondition() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (playerBoard[r][c] !== sudokuSolution[r][c]) {
                return;
            }
        }
    }
    setTimeout(() => { alert("Congratulations! You completely solved the StarOS Sudoku puzzle! 🌠"); }, 100);
}

document.getElementById("sudoku").addEventListener("mousedown", function(e) {
    if(!e.target.classList.contains("sudoku-cell") && !e.target.classList.contains("num-btn")) {
        selectedCellIndex = null;
        renderSudokuBoard();
    }
});

renderSudokuBoard();

function dragElement(element) {
    var initialX = 0, initialY = 0, currentX = 0, currentY = 0;
    var header = document.getElementById(element.id + "header");

    if (header) {
        header.onmousedown = startDragging;
    } else {
        element.onmousedown = startDragging;
    }

    function startDragging(e) {
        e = e || window.event;
        if (e.target.classList.contains("closebutton")) return;
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;
        document.onmouseup = stopDragging;
        document.onmousemove = dragElementMove;
    }

    function dragElementMove(e) {
        e = e || window.event;
        e.preventDefault();
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;
        element.style.top = (element.offsetTop - currentY) + "px";
        element.style.left = (element.offsetLeft - currentX) + "px";
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}