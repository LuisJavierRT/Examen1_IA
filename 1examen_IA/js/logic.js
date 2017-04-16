var abc = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","ñ","o","p","q","r","s","t","u","v","w","x","y","z"];
var idNode = undefined;
var idEdges = [];
var data = {};
var network = undefined;
var container = undefined;
var logicNetwork = [];
var json;
var options = {
    stabilize: false,
    dataManipulation: true,
    onAdd: function(data,callback) {
        var span = document.getElementById('operation');
        var idInput = document.getElementById('node-id');
        var labelInput = document.getElementById('node-label');
        var saveButton = document.getElementById('saveButton');
        var cancelButton = document.getElementById('cancelButton');
        var div = document.getElementById('network-popUp');
        span.innerHTML = "Add Node";
        idInput.value = logicNetwork.length+1;
        saveButton.onclick = saveNodeData.bind(this,data,"I",callback);
        cancelButton.onclick = clearPopUp.bind();
        div.style.display = 'block';
    },
    onEdit: function(data,callback) {
        var span = document.getElementById('operation');
        var idInput = document.getElementById('node-id');
        var labelInput = document.getElementById('node-label');
        var saveButton = document.getElementById('saveButton');
        var cancelButton = document.getElementById('cancelButton');
        var div = document.getElementById('network-popUp');
        span.innerHTML = "Edit Node";
        idInput.value = data.id;
        labelInput.value = data.label;
        saveButton.onclick = saveNodeData.bind(this,data,"E",callback);
        cancelButton.onclick = clearPopUp.bind();
        div.style.display = 'block';
    },
    onEditEdge: function(data, callback){
        var span = document.getElementById('operation');
        var idInput = document.getElementById('node-id');
        var labelInput = document.getElementById('node-label');
        var saveButton = document.getElementById('saveButton');
        var cancelButton = document.getElementById('cancelButton');
        var div = document.getElementById('network-popUp');
        span.innerHTML = "Edit Edge";
        idInput.value = data.id;
        saveButton.onclick = saveEdgeData.bind(this,data,"E",callback);
        cancelButton.onclick = clearPopUp.bind();
        div.style.display = 'block';
    },
    onConnect: function(data,callback) {
        var span = document.getElementById('operation');
        var idInput = document.getElementById('node-id');
        var labelInput = document.getElementById('node-label');
        var saveButton = document.getElementById('saveButton');
        var cancelButton = document.getElementById('cancelButton');
        var div = document.getElementById('network-popUp');
        span.innerHTML = "Add Edge";
        idInput.value = "None";
        saveButton.onclick = saveEdgeData.bind(this,data,"I",callback);
        cancelButton.onclick = clearPopUp.bind();
        div.style.display = 'block';
    },
    onDelete: function(data, callback){
       
    }
}; 

var auto_graph = function(number){
    logicNetwork = []
    var listaNodes = [];
    var listaEdges = [];
    var n = randomNumber(number,1);
    for (var i = 1; i <= n; i++) {
        var node = {
            id: i,
            label: abc[i-1],
            initial: false,
            final: false,
            visited: false
        };
        listaNodes.push(node);
    }
    var nodes = new vis.DataSet(listaNodes);

    for (var i = 1; i <= n; i++) {
        var m = randomNumber(5,0);
        if(m>n) {
            m = n;
        }
        var uniques = chance.unique(chance.natural, m, {min: 1, max: n});
        var listaEd = [];

        for (var j = 0; j < uniques.length; j++) {
            var val = randomNumber(10,1);
            var edge = {
                from: i,
                to: uniques[j],
                label: val,
                color: "blue"
            };
            listaEdges.push(edge);
            listaEd.push({to: uniques[j], weigth: val});
        }
        logicNetwork.push({id: i, name: abc[i-1], visited: false, final: false, initial: false, edges: listaEd});
    }
    console.log(logicNetwork);
    var edges = new vis.DataSet(listaEdges);
    // create a network
    container = document.getElementById('mynetwork');

    // provide the data in the vis format
    data = {
        nodes: nodes,
        edges: edges
    };
    
    // initialize your network!
    network = new vis.Network(container, data, options);

    network.on("select", function (params) {
        idNode = params.nodes[0];
        idEdges = params.edges;
    }); 
};

var createAutoGraph = function(){
    var num = document.getElementById("num").value;
    if(num != undefined)
        auto_graph(num);
};

var clearPopUp = function() {
    var saveButton = document.getElementById('saveButton');
    var cancelButton = document.getElementById('cancelButton');
    saveButton.onclick = null;
    cancelButton.onclick = null;
    var div = document.getElementById('network-popUp');
    div.style.display = 'none';
}

var saveEdgeData = function(data, action, callback) {
    var idInput = document.getElementById('node-id');
    var labelInput = document.getElementById('node-label');
    var div = document.getElementById('network-popUp');
    if(action == "I"){
        data.label = parseInt(labelInput.value);
        clearPopUp();
        callback(data);
        for(var i=0; i<logicNetwork.length; i++) {
            if(logicNetwork[i].id == data.from) {
                var edge = {to: data.to, weigth: data.label};
                logicNetwork[i].edges.push(edge);
                break;
            }
        }
    }
    else{
        data.id = parseInt(idInput.value);
        data.label = parseInt(labelInput.value);
        clearPopUp();
        callback(data);
        for(var i=0; i<logicNetwork.length; i++) {
            for(var j=0; j<logicNetwork[i].edges.length; j++) {
                if(logicNetwork[i].id == data.from) {
                    logicNetwork[i].edges[j].to = data.to;
                    logicNetwork[i].edges[j].weigth = data.label;
                    break;
                }
            }
        }
    }
};

var saveNodeData = function(data,action,callback) {
    var idInput = document.getElementById('node-id');
    var labelInput = document.getElementById('node-label');
    var div = document.getElementById('network-popUp');
    data.id = parseInt(idInput.value);
    data.label = labelInput.value;
    clearPopUp();
    callback(data);
    if(action == "I"){
        var node = {
            id: data.id, 
            name: data.label, 
            visited: false, 
            final: false, 
            initial: false, 
            edges: []
        };
        logicNetwork.push(node);
    }
    else{
        for(var i=0; i<logicNetwork.length; i++) {
            if(logicNetwork[i].id == data.id) {
                logicNetwork[i].name = data.label;
                break;
            }
        }
    }
}

var randomNumber = function(n1,n2){
    return Math.floor(Math.random()*n1)+n2;
};

var setInitialState = function(){
    if(idNode != undefined){
        data.nodes.update({id: idNode, initial: true, color: "#52D408"});
        for (var i = 0 ; i < idEdges.length; i++) {
           data.edges.update({id: idEdges[i], color: "blue"});
        }   
        for (var i=0; i<logicNetwork.length; i++) {
            if(logicNetwork[i].id == idNode) {
                logicNetwork[i].initial = true;
                break;
            }
        } 
    }
};

var setFinalState = function(){
    if(idNode != undefined){
        data.nodes.update({id: idNode, final: true, color: "#FAE409"});
        for (var i = 0 ; i <= idEdges.length; i++) {
           data.edges.update({id: idEdges[i], color: "blue"});
        }
        for (var i=0; i<logicNetwork.length; i++) {
            if(logicNetwork[i].id == idNode) {
                logicNetwork[i].final = true;
                break;
            }
       }    
    }
};

var clearAllStates = function() {
    for(var i=0; i<logicNetwork.length; i++) {
        logicNetwork[i].initial = false;
        logicNetwork[i].final = false;
        data.nodes.update({id: i+1, visited: false, initial: false, final: false, color:"#99ccff"});
    }
    clearAllVisites();
}

var clearAllVisites = function() {
    for(var i=0; i<logicNetwork.length; i++) {
        logicNetwork[i].visited = false;
        data.nodes.update({id: i+1, visited: false});
    }
}


var saveText = function(text, filename){
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click();
};

var saveGraphJSON = function(){
    saveText(JSON.stringify(data), "filename.json" );
};

var handleFileSelect = function(evt,callback) {

    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onloadend = (function (theFile) {
            return function (e) {
                    try {

                        callback(e.target.result);
                       
                    } catch (ex) {
                        alert('ex when trying to parse json = ' + ex);
                    }
            }
        })(f);

        reader.readAsText(f);
    }
};

var loadGraphJSON = function(evt){
    handleFileSelect(evt,function(result){

        json = JSON.parse(result);

        var arr = Object.values(json.nodes._data);
        var arr2 = Object.values(json.edges._data);

        var nodos = new vis.DataSet(arr);
        var arcos = new vis.DataSet(arr2);
        data = {
            nodes: nodos,
            edges: arcos
        };

        network = new vis.Network(container, data, options);
        console.log(network);
        network.on("select", function (params) {
            idNode = params.nodes[0];
            idEdges = params.edges;
        });
        updateLogicNetworkOnNew(arr, arr2); 
        console.log(logicNetwork);
    });
};

var updateLogicNetworkOnNew = function(nodes, edges) {
    logicNetwork = [];
    for(var i=0; i<nodes.length; i++) {
        var listaEdges = [];
        for(var j=0; j<edges.length; j++) {
            if(nodes[i].id == edges[j].from) {
                listaEdges.push({to: edges[j].to, weigth: edges[j].label});
            }
        }
        var node = {
            id: i+1,
            name: nodes[i].label,
            visited: false,
            final: false,
            initial: false,
            edges: listaEdges
        };
        logicNetwork.push(node);
    }
};

var DFS = function(graph, node1, goal) {
    var stack = [];
    var node;
    var succes = "Fracaso";
    stack.push(node1);
    while(stack.length > 0) {
        node = stack.pop();
        console.log("->" + node.name);
        if(node.id == goal.id){
            succes = "Exito";
            break;
        }
        if(node.visited == false) {
            for(var i=graph.length-1; i>0; i--) {
                if(getEdge(node, graph[i]))
                    stack.push(graph[i]);
            }
        }
        node.visited = true;
    }
    console.log(succes);
};

var DLS = function(graph, node1, goal, limit) {
    var stack = [];
    var depth_stack = [];
    var node;
    var depth;
    stack.push(node1);
    depth_stack.push(0);
    while(stack.length > 0) {
        node = stack.pop();
        depth = depth_stack.pop();
        console.log("->" + node.name);
        console.log("Depth: " + depth);
        if(node.id == goal.id){
            return true;
        }
        if(depth < limit) {
            if(node.visited == false) {
                for(var i=graph.length-1; i>0; i--) {
                    if(getEdge(node, graph[i])){
                        stack.push(graph[i]);
                        depth_stack.push(depth+1);
                    }
                }
            }
            node.visited = true;
        }
    }
    return false;
};

var BFS = function(graph, node1, goal) {
    var queue = [];
    var node;
    var succes = "Fracaso";
    queue.push(node1);
    while(queue.length > 0) {
        node = queue.shift();
        console.log("->" + node.name);
        if(node.id == goal.id){
            succes = "Exito";
            break;
        }
        if(node.visited == false) {
            for(var i=graph.length-1; i>0; i--) {
                if(getEdge(node, graph[i]))
                    queue.push(graph[i]);
            }
        }
        node.visited = true;
    }
    console.log(succes);
};

var UCS = function(graph, node1, goal) {
    var queue = [];
    var node;
    var cost;
    var succes = "Fracaso";
    queue.push(node1);
    queue.push(0);
    while(queue.length > 0) {
        node = queue.shift();
        cost = queue.shift();
        console.log("->" + node.name);
        console.log("Cost: " + cost);
        if(node.id == goal.id){
            succes = "Exito";
            break;
        }
        if(node.visited == false) {
            for(var i=graph.length-1; i>0; i--) {
                cost = getEdgeCost(node, graph[i]);
                if(cost){
                    queue.push(graph[i]);
                    queue.push(cost);
                }
            }
        }
        node.visited = true;
    }
    console.log(succes);
};

var SA = function(graph, node1, goal){
    var temp = 100000;
    var coolingRate = 0.003;
    var currentSolution = [];
    currentSolution.push(node1);
    currentSolution.push(node1);
    while(currentSolution.length > 0){          // Find initial solution (random solution)
        node = currentSolution.pop();
        if(node.id == goal.id){
            currentSolution.push(goal);
            break;
        }
        if(node.visited == false){
            for (var i = graph.length-1; i > 0; i--) {
                cost = getEdgeCost(node, graph[i]);
                if(cost){
                    currentSolution.push(graph[i]);
                }
            }
        }
        node.visited = true;
    }

    var bestSolution = currentSolution;         // Asumme is the best solution

    while(temp > 1){                            // Loop until system has cooled
        var newSolution = currentSolution;

        var newSolution2 = createNeighbour(newSolution);
        var bandera = checkRoad(newSolution2);

        while(bandera == false){
           newSolution2 = createNeighbour(newSolution);
           bandera = checkRoad(newSolution2);
        }

        var currentSolutionCost = getTotalCost(currentSolution);
        var newSolutionCost = getTotalCost(newSolution2);
        var bestSolutionCost = getTotalCost(bestSolution);

        var rand =  Math.random() * (1.0 - 0.0) + 0.0;
        if(acceptanceProbability(currentSolutionCost,newSolutionCost, temp)){
            currentSolution = newSolution2;
        }
        if(currentSolutionCost < bestSolutionCost){
            bestSolution = currentSolution;
        }

        temp *= 1 - coolingRate;

    }

    console.log("Best Solution Cost: " + bestSolutionCost);
    console.log("Best Solution: " );
    for (var i = 0; i < bestSolution.length; i++) {
        console.log(bestSolution[i].name);
    }
    
}

var createNeighbour = function(solution){
    var pos1 = randomNumber(solution.length-1,1);
    var pos2 = randomNumber(solution.length-1,1);
    while(pos1 == pos2){
        pos2 = randomNumber(solution.length-1,1);
    }
    var temp = solution[pos1];
    solution[pos1] = solution[pos2];
    solution[pos2] = temp;
    return solution;
}

var checkRoad = function(solution){
    for (var i = 1; i < solution.length; i++) {
        if(getEdge(solution[i-1],solution[i]) == false){
            return false;
        }
    }
    return true
}

var acceptanceProbability = function(currentCost, newCost, temperature){
    if(newCost < currentCost){
        return 1.0;
    }
    else{
        return Math.exp((currentCost - newCost) / temperature);
    }
}


var getTotalCost = function(solution){
    var totalCost = 0;
    for (var i = 0; i < solution.length; i++) {
        var from = solution[i];
        var to;
        if (i+1 < solution.length){
            to = solution[i+1];
        }
        else{
            to = solution[0];
        }

        if (getEdgeCost(from,to)){
            totalCost += getEdgeCost(from,to);
        }
        else{
            totalCost += 0;
        }
    }
    return totalCost;
}

var getEdge = function(node, to) {
    for(var i=0; i<node.edges.length; i++) {
        if(node.edges[i].to == to.id){
            return true;
        }
    }
    return false;
};

var getEdgeCost = function(node, to) {
    var cost;
    for(var i=0; i<node.edges.length; i++) {
        if(node.edges[i].to == to.id){
            cost = node.edges[i].weigth;
            break;
        }
    }
    return cost;
};


var callDFS = function(){
    console.log("\n-------\n");
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].initial){
            for(var j=0; j<logicNetwork.length; j++) {
                if(logicNetwork[j].final) {
                    DFS(logicNetwork, logicNetwork[i], logicNetwork[j]);
                    clearAllVisites();
                }
            }
        }
    }
};

var callDLS = function(){
    console.log("\n-------\n");
    var limit = document.getElementById("limit").value;
    if(limit){
        for(var i=0; i<logicNetwork.length; i++) {
            if(logicNetwork[i].initial) {
                for(var j=0; j<logicNetwork.length; j++) {
                    if(logicNetwork[j].final){
                        if(DLS(logicNetwork, logicNetwork[i], logicNetwork[j], parseInt(limit))){
                            console.log("Exito");
                        }
                        else{
                            console.log("Fracaso");
                        }
                        clearAllVisites();
                    }
                }
            }
        }
    }
};

var callIDS = function(){
    console.log("\n-------\n");
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].initial) {
            for(var j=0; j<logicNetwork.length; j++) {
                if(logicNetwork[j].final) {
                    var depth = 1;
                    var status = false;
                    while(true){
                        console.log("\n\n Again");
                        status = DLS(logicNetwork, logicNetwork[i], logicNetwork[j], depth);
                        clearAllVisites();
                        if(status || depth.length == logicNetwork.length)
                            break;
                        depth+=1;
                    }
                    if(status){
                        console.log("Exito");
                    }
                    else{
                        console.log("Fracaso");
                    }
                }
            }
        }
    }
};

var callBFS = function(){
    console.log("\n-------\n");
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].initial) {
            for(var j=0; j<logicNetwork.length; j++) {
                if(logicNetwork[j].final) {
                    BFS(logicNetwork, logicNetwork[i], logicNetwork[j]);
                    clearAllVisites();
                }
            }
        }
    }
};

var callUCS = function(){
    console.log("\n-------\n");
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].initial) {
            for(var j=0; j<logicNetwork.length; j++) {
                if(logicNetwork[j].final) {
                    UCS(logicNetwork, logicNetwork[i], logicNetwork[j]);
                    clearAllVisites();
                }
            }
        }
    }
};

var callSA = function(){
    console.log("\n-------\n");
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].initial) {
            for(var j=0; j<logicNetwork.length; j++) {
                if(logicNetwork[j].final) {
                    SA(logicNetwork, logicNetwork[i], logicNetwork[j]);
                    clearAllVisites();
                }
            }
        }
    }
};

document.getElementById('files').addEventListener('change', loadGraphJSON, false);

auto_graph(0);
