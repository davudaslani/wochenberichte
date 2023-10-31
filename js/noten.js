// ---------------------------------------------------------------------------------------------------------------------------
// Grades average calculation and color highlightning
// Note:
// -> the penultimate table data contains the average
// -> the last table data contains the rounded average
// -> the penultimate table row contains the average of all grades
// -> the last table row contains the rounded average of all grades
// ---------------------------------------------------------------------------------------------------------------------------

// All note entries > 4 = red / notes between 4 - 5.2 = yellow / notes from 5.3 = green
let redColor = "rgba(255, 0, 0, 0.5)";
let yellowColor = "rgba(251, 189, 26, 0.5)";
let greenColor = "rgba(131, 184, 26, 0.5)";
let decimalPlaces = 1; // how many decimal places are displayed

// ---------------------------------------------------------------------------------------------------------------------------
// Do not touch the lines below this line
// ---------------------------------------------------------------------------------------------------------------------------

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

function round(value, step) {
  step || (step = 1.0);
  var inv = 1.0 / step;
  return Math.round(value * inv) / inv;
}

function setGradesAverage(element, value) {
  let grade = parseFloat(value);
  // the penultimate  table data contains the average
  let penultimate = element[element.length - 2];
  penultimate.innerHTML = grade.toFixed(decimalPlaces);
  setGradeColor(penultimate, grade);
  // the last table data contains the rounded average
  let last = element[element.length - 1];
  last.innerHTML = round(grade, 0.5).toFixed(decimalPlaces);
  setGradeColor(last, round(grade, 0.5));
}

function setGradeColor(element, value) {
  element.style.background = yellowColor;
  if (value < 4) {
    element.style.background = redColor;
  } else if (value > 5.3) {
    element.style.background = greenColor;
  }
}

function calcAvgGrade(target, summary) {
  // calculate avg grade and show if available
  let avg = [];
  let container = document.getElementById(target);
  // if the container exists
  if (container !== null) {
    for (const element of summary) {
      if (element.target === target) {
        avg.push(element);
      }
    }
    let grades = document.getElementById(target + "-grade");
    let experience = 0;
    if (avg.length === 2) {
      for (const element of avg) {
        experience += parseFloat(element.weight) * parseFloat(element.value);
      }
    } else if (avg.length === 1) {
      let weight = 1; // There is only one section
      for (const element of avg) {
        experience += parseFloat(weight) * parseFloat(element.value);
      }
    }
    grades.innerHTML = experience.toFixed(decimalPlaces);
  }
}
// ---------------------------------------------------------------------------------------------------------------------------
let summary = [];
// select all table bodies
let tbodies = document.querySelectorAll("tbody");
// loop throught all grade tables
for (i = 0; i < tbodies.length; ++i) {
  let tbody = tbodies[i];
  // select all table rows
  let trows = tbody.querySelectorAll("tr");
  let topicSum = 0; // Sum of grades per table
  let topicCount = 0;
  // loop throught all table rows
  for (j = 0; j < trows.length; ++j) {
    let trow = trows[j];
    let tcells = trow.querySelectorAll("td");
    let gradeSum = 0; // Sum of grades per row
    let gradeCount = 0;
    // loop throught all table row cells
    for (k = 0; k < tcells.length; ++k) {
      let tdata = tcells[k];
      let cellValue = tdata.innerHTML;
      // if content is numeric it is a grade
      if (isNumeric(cellValue)) {
        gradeSum += parseFloat(cellValue);
        gradeCount++;
        setGradeColor(tdata, cellValue);
      }
    }
    // Calculate average per row
    let avg = parseFloat(gradeSum / gradeCount);
    if (!isNaN(avg)) {
      topicCount++;
      topicSum += avg;
      setGradesAverage(tcells, avg);
    }
  }
  // Calculate average per table
  let avgRows = parseFloat(topicSum / topicCount).toFixed(decimalPlaces);
  if (!isNaN(avgRows)) {
    let lastRow = trows[trows.length - 1];
    let lastRowCells = lastRow.querySelectorAll("td");
    setGradesAverage(lastRowCells, avgRows);
    if (tbody.dataset.weight) {
      summary.push({
        target: tbody.dataset.view,
        name: tbody.dataset.title,
        weight: tbody.dataset.weight,
        value: round(avgRows, 0.5).toFixed(decimalPlaces),
      });
    }
  }
}

calcAvgGrade("competencies", summary);
calcAvgGrade("abu", summary);
calcAvgGrade("egk", summary);
calcAvgGrade("bms", summary);
