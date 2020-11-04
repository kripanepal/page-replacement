var finalArray = [];
var workingArray = [];
var type = "";
var frames;
var referenceString = [];
var pageFault = [];

function show() {
  finalArray = [];
  workingArray = [];
  pageFault = [];
  frames = document.getElementById("numberOfFrames").value;
  var string = document.getElementById("inputString").value;
  type = document.getElementById("type").value;
  referenceString = string.split`,`.map((x) => +x);

  console.log(frames, referenceString, type);
  // function we want to run

  // find object
  var fn = window[type];

  // is object a function?
  if (typeof fn === "function") fn();

  showResults();
}

function leastRecentlyUsed() {
  referenceString.forEach((element) => {
    if (!workingArray.includes(element)) {
      pageFault.push("Y");

      if (workingArray.length < frames) {
        workingArray.push(element);
      } else {
        replace(element);
      }
    } else {
      pageFault.push("N");

      workingArray.push(
        workingArray.splice(workingArray.indexOf(element), 1)[0]
      );
    }
    finalArray.push([...workingArray]);
  });
  console.log(finalArray);
}
function mostRecentlyUsed() {
  referenceString.forEach((element) => {
    if (!workingArray.includes(element)) {
      pageFault.push("Y");

      if (workingArray.length < frames) {
        workingArray.unshift(element);
      } else {
        replace(element);
      }
    } else {
      pageFault.push("N");

      workingArray.unshift(
        workingArray.splice(workingArray.indexOf(element), 1)[0]
      );
    }
    finalArray.push([...workingArray]);
  });
  console.log(finalArray);
}
function firstInFirstOut() {
  referenceString.forEach((element) => {
    if (!workingArray.includes(element)) {
      pageFault.push("Y");

      if (workingArray.length < frames) {
        workingArray.push(element);
      } else {
        replace(element);
      }
    } else {
      pageFault.push("N");
    }
    finalArray.push([...workingArray]);
  });
  console.log(finalArray);
}

function mostFrequentlyUsed() {
  const temp = arrayToObject();
  console.log(temp.slice());

  temp.forEach((element) => {
    if (!exists(element)) {
      pageFault.push("Y");

      if (workingArray.length < frames) {
        workingArray.push(element);
      } else {
        element.count = 1;
        replace(element);
      }
    } else {
      pageFault.push("N");

      workingArray.forEach((e) => {
        if (e.name == element.name) {
          e.count++;
        }
      });
    }
    workingArray.sort((a, b) => {
      return b.count - a.count;
    });
    finalArray.push([...workingArray]);
  });
  console.log(finalArray);
}

function leastFrequentlyUsed() {
  const temp = arrayToObject();
  console.log(temp.slice());
  temp.forEach((element) => {
    if (!exists(element)) {
      pageFault.push("Y");

      if (workingArray.length < frames) {
        workingArray.unshift(element);
      } else {
        element.count = 1;
        replace(element);
      }
    } else {
      pageFault.push("N");

      workingArray.forEach((e) => {
        if (e.name == element.name) {
          e.count++;
        }
      });
    }
    workingArray.sort((a, b) => {
      return a.count - b.count;
    });
    finalArray.push([...workingArray]);
  });
  console.log(finalArray);
}

function secondChance() {
  const temp = arrayToObject();
  temp.forEach((element) => {
    if (!exists(element)) {
      pageFault.push("Y");

      if (workingArray.length < frames) {
        workingArray.push(element);
      } else {
        secondChanceReplace(element);
      }
    } else {
      pageFault.push("N");

      workingArray.forEach((e) => {
        if (e.name == element.name) {
          e.touched = true;
        }
      });
    }
    console.log(workingArray);
    finalArray.push([...workingArray]);
  });
  console.log(finalArray);
}

function exists(identity) {
  var toReturn = false;

  workingArray.forEach((element) => {
    if (element.name == identity.name) {
      toReturn = true;
      return true;
    }
  });
  return toReturn;
}

function arrayToObject() {
  var toReturn = [];
  referenceString.forEach((element) => {
    toReturn.push({ name: element, touched: false, count: 1 });
  });
  return toReturn;
}

function replace(element) {
  workingArray.shift();
  if (
    type === "mostRecentlyUsed" ||
    type == "mostFrequentlyUsed" ||
    type == "leastFrequentlyUsed"
  ) {
    workingArray.unshift(element);
  } else {
    workingArray.push(element);
  }
}
function secondChanceReplace(element) {
  var done = false;
  while (!done) {
    workingArray.some((e) => {
      if (!e.touched) {
        workingArray.shift();
        workingArray.push(element);
        done = true;
        return true;
      } else {
        e.touched = false;
        workingArray.push(workingArray.shift());
        return true;
      }
    });
  }
}

function showResults() {
  const table = document.getElementById("result");
  removeAllChildNodes(table);

  const caption = document.createElement("caption");
  caption.innerHTML = titleCase(type);
  table.appendChild(caption);
  const tr = document.createElement("tr");
  const tr2 = document.createElement("tr");
  tr.setAttribute("class", "resultRow");
  for (j = 0; j < referenceString.length; j++) {
    const th = document.createElement("th");
    const td = document.createElement("td");

    th.innerHTML = referenceString[j];
    td.innerHTML = pageFault[j];
    if (pageFault[j] === "Y") {
      td.style.color = "red";
    }
    tr.appendChild(th);
    tr2.appendChild(td);
  }
  table.appendChild(tr);
  table.appendChild(tr2);

  for (i = 0; i < frames; i++) {
    const tr = document.createElement("tr");
    tr.setAttribute("class", "resultRow");

    for (j = 0; j < finalArray.length; j++) {
      const td = document.createElement("td");

      var toEnter = finalArray[j][i];
      if (typeof toEnter === "object") {
        toEnter = toEnter.name;
      }
      td.innerHTML = toEnter === undefined ? "X" : toEnter;
      td.setAttribute("class", "resultData");
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  calculateResults();
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

const countOccurrences = (arr, val) =>
  arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

const calculateResults = () => {
  const parent = document.getElementById("calculations");
  removeAllChildNodes(parent);
  const times = countOccurrences(pageFault, "Y");
  console.log(times);
  const myDiv = document.createElement("div");
  myDiv.innerHTML =
    "Total number of page faults = " +
    times +
    "<br/> Page Fault = " +
    (times * 100) / referenceString.length +
    "%";
  myDiv.style.marginTop = "10px";
  parent.appendChild(myDiv);
};

const titleCase = (text) => {
  var result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};
