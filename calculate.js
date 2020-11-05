var finalArray = [];
var workingArray = [];
var type = "";
var frames;
var referenceString = [];
var pageFault = [];
var toShift = ["mostRecentlyUsed", "leastFrequentlyUsed", "mostFrequentlyUsed"];

function show() {
  finalArray = [];
  workingArray = [];
  pageFault = [];
  frames = document.getElementById("numberOfFrames").value;
  var string = document.getElementById("inputString").value;
  type = document.getElementById("type").value;
  referenceString = string.split`,`.map((x) => +x);
  var fn = window[type];
  // if (typeof fn === "function") fn();
  calculate();
  showResults();
}


function calculate() {
  const frequentAlgorithm =
    type === "mostFrequentlyUsed" || type === "leastFrequentlyUsed";
  const secondChanceAlgorithm = type === "secondChance";
  var toWork =
    frequentAlgorithm || secondChanceAlgorithm
      ? arrayToObject()
      : referenceString;

  toWork.forEach((element) => {
    const checkExists =
      frequentAlgorithm || secondChanceAlgorithm
        ? exists(element)
        : workingArray.includes(element);

    if (!checkExists) {
      pageFault.push("Y");

      if (workingArray.length < frames) {
        toShift.includes(type)
          ? workingArray.unshift(element)
          : workingArray.push(element);
      } else {
        secondChanceAlgorithm ? secondChanceReplace(element) : replace(element);
      }
    } else {
      pageFault.push("N");

      if (toShift.includes(type) && !frequentAlgorithm && !secondChanceAlgorithm) {
        workingArray.unshift(
          workingArray.splice(workingArray.indexOf(element), 1)[0]
        );
      } else {
        if (type !== "firstInFirstOut" && !frequentAlgorithm && !secondChanceAlgorithm) {
          console.log("here");
          workingArray.push(
            workingArray.splice(workingArray.indexOf(element), 1)[0]
          );
        }

        if (frequentAlgorithm) {
          workingArray.forEach((e) => {
            if (e.name == element.name) {
              e.count++;
            }
          });
        }

        if(secondChanceAlgorithm)
        {
          workingArray.forEach((e) => {
            if (e.name == element.name) {
              e.touched = true;
            }
          });
        }
      }
    }
    type === "leastFrequentlyUsed"
      ? sort(workingArray, "asc")
      : sort(workingArray, "desc");
      const clone = JSON.parse(JSON.stringify(workingArray));
console.log(clone)
      finalArray.push(clone);
    });
  console.log(finalArray)
}

function sort(array, type) {
  if (type === "desc") {
    console.log("desc");
    return array.sort((a, b) => {
      return b.count - a.count;
    });
  }
  return array.sort((a, b) => {
    return a.count - b.count;
  });
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

const newElement = (name) => document.createElement(name)

function showResults() {
  const table = document.getElementById("result");
  removeAllChildNodes(table);

  const caption = newElement("caption");
  caption.innerHTML = titleCase(type);
  table.appendChild(caption);
  const tr = newElement("tr");
  const tr2 = newElement("tr");
  tr.setAttribute("class", "resultRow");
  for (j = 0; j < referenceString.length; j++) {
    const th = newElement("th");
    const td = newElement("td");

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

        if(type ==='mostFrequentlyUsed' || type === 'leastFrequentlyUsed')
        {
          toEnter = `<span> ${toEnter.name} <sub> ${toEnter.count}</sub></span>`;
        }
        else{
          toEnter.touched&& (td.style.color = 'red')
          toEnter = toEnter.name

        }
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
