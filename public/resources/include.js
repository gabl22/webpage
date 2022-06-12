"use-strict";

let systemVars = [];

function loadTemplates() {
    let elements = document.getElementsByTagName("*");
    let element;
    for(let i = 0; i < elements.length; i++) {
        element = elements[i];
        if(loadTemplate(elements[i]).remove) {
            element.remove();
            i--;
        }
        console.log(elements.length +" "+ i);
    }
    removeInfos("templates");
}

function loadTemplate(element) {
    if(!element.hasAttribute("include")) {
        return {"remove": false};
    }

    if(!checkConditions(element)) {
        return {"remove": true};
    }

    let include = templateFile(element.getAttribute("include"), element.tagName);
    let http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if(this.readyState === 4) {
            if(this.status === 200) {
                element.innerHTML = this.responseText;
            } else {
                element.innerHTML = "An error occurred";
                //TODO Do something
            }
        }
    }
    http.open("GET", include, true);
    http.send();
    element.removeAttribute("include");
    return {"remove": false};
}

function templateFile(s, tagName) {
    if(!s.includes("/")) {
        s = "resources/template/" + s;
    }
    if(!s.includes(".")) {
        if(tagName === "SCRIPT") {
            s += ".js";
        } else if(tagName === "STYLE") {
            s += ".css";
        } else {
            s += ".html"
        }
    }
    return s
}

function checkConditions(element) {
    if(!element.hasAttribute("if")) {
        return true;
    }
    let conditions = element.getAttribute("if").replace(" ", "").split(";");
    element.removeAttribute("if");
    let value = true;
    for(let condition of conditions) {
        value = value && checkCondition(condition);
    }
    return value;
}

function checkCondition(condition) {
    for(let systemVar of systemVars) {
        if(condition.startsWith(systemVar.id)) {
            let length = systemVar.id.length;
            return check(systemVar.value, condition.substring(length, length + 2), condition.substring(length + 2));
        }
    }
    return false;
}

function check(numberA, sign, numberB) {
    if(sign === ">>") {
        return numberA > numberB;
    } else if(sign === ">=") {
        return numberA >= numberB;
    } else if(sign === "==") {
        return numberA === numberB;
    } else if(sign === "<=") {
        return numberA <= numberB;
    } else if(sign === "<<") {
        return numberA < numberB;
    } else if(sign === ">=") {
        return numberA >= numberB;
    } else if(sign === "!=") {
        return numberA >= numberB;
    }
    return false;
}


function removeInfos(state) {
    let elements, i, element, remove;
    elements = document.getElementsByTagName("*");
    for(i = 0; i < elements.length; i++) {
        element = elements[i];
        remove = element.getAttribute("remove");
        if(remove) {
            if(remove === state) {
                element.remove();
            }
        }
    }
}

function initSystemVar() {
    systemVars = [];
    initSystemVarPair("SCREEN-WIDTH", window.screen.width, 0);
    initSystemVarPair("SCREEN-HEIGHT", window.screen.height, 1);
    initSystemVarPair("INNER-WIDTH", window.innerWidth, 2);
    initSystemVarPair("INNER-HEIGHT", window.innerHeight, 3);
    initSystemVarPair("OUTER-WIDTH", window.outerWidth, 4);
    initSystemVarPair("OUTER-HEIGHT", window.outerHeight, 5);
}

function initSystemVarPair(id, value, i) {
    systemVars[i] = {
        "id": id,
        "value": value
    };
}